import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawn,spawnSync} from 'node:child_process';
import {ROOT,json,writeJson,contained,taskEvidenceHashes,harnessHashes,benchmarkManifest,escapeHtml} from '../runner/common.mjs';
import {prepareAttempt} from '../core/attempts.mjs';
import {acquireLock} from '../runner/lock.mjs';
import {validateBatchResume} from '../core/batch-resume.mjs';

const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const digest=async file=>createHash('sha256').update(await fs.readFile(file)).digest('hex');
const alive=pid=>{try{process.kill(pid,0);return true;}catch(error){if(error.code==='ESRCH')return false;throw error;}};
export function schedulingPlan(state){
 const finished=new Set(state.attempts.filter(a=>a.state==='finished').map(a=>a.task));
 const running=state.attempts.filter(a=>a.state==='running');
 if(new Set(running.map(a=>a.task)).size!==running.length||running.some(a=>finished.has(a.task)))throw new Error('Ambiguous active tasks');
 const active=new Set(running.map(a=>a.task));
 return {running,pending:state.tasks.filter(t=>!finished.has(t)&&!active.has(t))};
}

// Lowering concurrency drains existing jobs; raising it fills only free slots.
export async function runPool({pending,initial=[],concurrency,run,stop=()=>false,tick=()=>delay(1000)}){
 const queue=[...pending],active=new Set();let failure;
 const start=fn=>{const promise=Promise.resolve().then(fn).catch(e=>{failure??=e;}).finally(()=>active.delete(promise));active.add(promise);};
 for(const job of initial)start(job);
 while(queue.length||active.size){
  const desired=await concurrency();
  if(!Number.isInteger(desired)||desired<1||desired>8)throw new Error('Concurrency must be 1..8');
  while(!failure&&!stop()&&queue.length&&active.size<desired){const task=queue.shift();start(()=>run(task));}
  if(!active.size)break;
  await Promise.race([...active,tick()]);
 }
 if(failure)throw failure;
 return queue;
}

function processInfo(pid){
 if(!Number.isInteger(pid)||pid<1)throw new Error('Invalid child PID');
 if(process.platform!=='win32')throw new Error('Live adoption currently requires the validated Windows host');
 const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`Get-CimInstance Win32_Process -Filter 'ProcessId = ${pid}' | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress`],{encoding:'utf8',windowsHide:true});
 if(result.status!==0)throw new Error('Cannot validate child process identity');
 return result.stdout.trim()?JSON.parse(result.stdout):null;
}
function matchingChild(info,attemptId){
 return info&&info.CommandLine?.includes(path.join(ROOT,'scripts','benchmark.mjs'))&&info.CommandLine.endsWith('attempt run '+attemptId);
}

export async function runElasticBatch(folder,requested){
 const base=path.join(ROOT,'artifacts/batches');
 if(!contained(base,folder)||folder===base)throw new Error('Expected a local batch folder');
 if(!Number.isInteger(requested)||requested<1||requested>8)throw new Error('Concurrency must be 1..8');
 let handoff;try{handoff=await json(path.join(folder,'concurrency-handoff.json'));}catch(error){if(error.code!=='ENOENT')throw error;}
 const lockFile=path.join(folder,'runner.lock');
 try{
  const lock=await json(lockFile);
  if(alive(lock.pid))throw new Error('Another batch controller is still running');
  if(lock.token!==handoff?.previous_lock?.token||lock.pid!==handoff.previous_lock.pid)throw new Error('Stale lock does not match the verified handoff');
  await fs.unlink(lockFile);
 }catch(error){if(error.code!=='ENOENT')throw error;}
 const release=acquireLock(lockFile),scriptFile=fileURLToPath(import.meta.url),scriptHash=await digest(scriptFile);
 try{
  const state=await json(path.join(folder,'batch.json')),manifest=await benchmarkManifest(),harness=await harnessHashes();
  const taskVersions=Object.fromEntries(manifest.candidates.map(c=>[c.id,c.task_sha256]));
  validateBatchResume(state,{model:state.model,effort:state.effort,tasks:manifest.tasks,taskVersions,harness});
  if(!manifest.passed)throw new Error('Task QA audit failed');
  for(const task of state.tasks)if(!same(await taskEvidenceHashes(task),taskVersions[task]))throw new Error('Task changed after QA: '+task);
  const plan=schedulingPlan(state),phases=await json(path.join(folder,'execution-phases.json'));
  for(const a of plan.running){
   a.child_pid??=handoff?.children.find(c=>c.attempt_id===a.id)?.pid;
   const record=await json(path.join(ROOT,'artifacts/attempts',a.id,'attempt.json'));
   if(!['finished','interrupted','error'].includes(record.state)&&!matchingChild(processInfo(a.child_pid),a.id))throw new Error('Running child identity unavailable: '+a.id);
  }
  const phase={started_at:new Date().toISOString(),concurrency:requested,harness_sha256:harness,coordinator_sha256:scriptHash,diagnostic:true,
   retained_finished:state.tasks.length-plan.pending.length-plan.running.length,adopted_attempt_ids:plan.running.map(a=>a.id),reason:'Concurrency change: adopt running subprocesses without restarting their model sessions.',concurrency_history:[{at:new Date().toISOString(),value:requested}]};
  phases.push(phase);state.concurrency=requested;state.status='running';delete state.stopped_at;
  await writeJson(path.join(folder,'execution-phases.json'),phases);
  await writeJson(path.join(folder,'control.json'),{concurrency:requested});
  let saving=Promise.resolve(),infrastructureStop=false;
  const save=()=>{const snapshot=structuredClone(state);saving=saving.then(async()=>{const tmp=path.join(folder,'batch.json.'+process.pid+'.tmp');await writeJson(tmp,snapshot);await fs.rename(tmp,path.join(folder,'batch.json'));});return saving;};
  await save();
  const finish=async(a,result)=>{
   const record=await json(path.join(ROOT,'artifacts/attempts',a.id,'attempt.json'));
   const unchanged=same(await taskEvidenceHashes(a.task),taskVersions[a.task])&&same(await harnessHashes(),harness)&&await digest(scriptFile)===scriptHash;
   Object.assign(a,{state:record.state==='finished'&&unchanged?'finished':'interrupted',finished_at:record.finished_at??new Date().toISOString(),task_version_unchanged:unchanged,
    formal_eligible:record.formal_eligible===true,process:result,model_submitted:record.model_submitted??false,generation:record.generation,acceptance:record.acceptance,
    error:unchanged?(record.error??record.submission_error??result.error??null):'Task or runtime changed during attempt',successful:unchanged&&record.state==='finished'&&record.outcome==='success'});
   if(a.state==='interrupted')infrastructureStop=true;
   await save();console.log(a.task+' '+(a.successful?'PASS':a.state==='interrupted'?'INTERRUPTED':'FAIL'));
  };
  const adopt=async a=>{
   console.log('Adopt existing model session: '+a.task+' '+a.id+' pid='+a.child_pid);
   a.adopted_by_phase=phases.length-1;await save();
   const recordPath=path.join(ROOT,'artifacts/attempts',a.id,'attempt.json');
   while(true){
    let record;try{record=await json(recordPath);}catch(error){if(error instanceof SyntaxError){await delay(500);continue;}throw error;}
    if(['finished','interrupted','error'].includes(record.state))break;
    if(!alive(a.child_pid))break;
    if(Date.now()-Date.parse(a.started_at)>(record.budget.wall_seconds+360)*1000){
     if(matchingChild(processInfo(a.child_pid),a.id))spawnSync('taskkill.exe',['/PID',String(a.child_pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
     return finish(a,{adopted:true,error:'Adopted worker exceeded original wall budget'});
    }
    await delay(2000);
   }
   await finish(a,{adopted:true,exit_code:null,note:'Existing subprocess retained; no second model invocation.'});
  };
  const run=async task=>{
   const prepared=await prepareAttempt(task);
   if(!same(prepared.record.task_version_sha256,taskVersions[task]))throw new Error('Task changed before launch: '+task);
   const a={task,id:prepared.record.attempt_id,state:'running',execution_phase:phases.length-1,task_version_sha256:prepared.record.task_version_sha256,started_at:new Date().toISOString()};
   state.attempts.push(a);await save();
   const log=await fs.open(path.join(folder,a.id+'.log'),'w');
   let child,timer;
   const completion=new Promise(resolve=>{
    child=spawn(process.execPath,[path.join(ROOT,'scripts/benchmark.mjs'),'attempt','run',a.id],{cwd:ROOT,windowsHide:true,stdio:['ignore',log.fd,log.fd],env:{...process.env,BENCHMARK_MODEL:state.model,BENCHMARK_REASONING_EFFORT:state.effort,BENCHMARK_BATCH:'1'}});
    timer=setTimeout(()=>{if(child.pid)spawnSync('taskkill.exe',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});},(prepared.record.budget.wall_seconds+360)*1000);
    child.on('error',error=>{clearTimeout(timer);resolve({error:String(error)});});child.on('close',(code,signal)=>{clearTimeout(timer);resolve({exit_code:code,signal});});
   });
   a.child_pid=child.pid;await save();
   const result=await completion;await log.close();await finish(a,result);
  };
  console.log(JSON.stringify({concurrency:requested,adopted:plan.running.length,remaining:plan.pending.length,retained:phase.retained_finished}));
  await runPool({pending:plan.pending,initial:plan.running.map(a=>()=>adopt(a)),run,stop:()=>infrastructureStop,concurrency:async()=>{
   let control;try{control=await json(path.join(folder,'control.json'));}catch(error){if(error instanceof SyntaxError)return state.concurrency;throw error;}
   if(!Number.isInteger(control.concurrency)||control.concurrency<1||control.concurrency>8)return state.concurrency;
   if(control.concurrency!==state.concurrency){state.concurrency=control.concurrency;phase.concurrency=state.concurrency;phase.concurrency_history.push({at:new Date().toISOString(),value:state.concurrency});await writeJson(path.join(folder,'execution-phases.json'),phases);await save();}
   return state.concurrency;
  }});
  const latest=state.tasks.map(t=>state.attempts.filter(a=>a.task===t).at(-1));
  state.status=latest.every(a=>a?.state==='finished')?'finished':'incomplete';state.stopped_at=new Date().toISOString();if(state.status==='finished')state.finished_at=state.stopped_at;
  await save();
  const groups=new Map();
  for(let i=0;i<state.tasks.length;i++){const meta=manifest.candidates.find(c=>c.id===state.tasks[i]),family=meta.source_kind+'/'+meta.family;if(!groups.has(family))groups.set(family,{family,total:0,completed:0,successful:0});const g=groups.get(family);g.total++;if(latest[i]?.state==='finished')g.completed++;if(latest[i]?.successful)g.successful++;}
  const families=[...groups.values()].map(g=>({...g,pass_rate:g.successful/g.total}));
  const summary={batch_id:state.id,model:state.model,effort:state.effort,diagnostic:true,classification:state.classification,total:state.tasks.length,completed:latest.filter(a=>a?.state==='finished').length,successful:latest.filter(a=>a?.successful).length,model_submitted:latest.filter(a=>a?.model_submitted).length,formal_eligible:false,families,family_macro_pass_rate:families.reduce((n,g)=>n+g.pass_rate,0)/families.length,attempts:latest};
  await writeJson(path.join(folder,'summary.json'),summary);
  await fs.writeFile(path.join(folder,'index.html'),'<!doctype html><meta charset="utf-8"><title>批次结果</title><h1>'+escapeHtml(state.id)+'</h1><p>'+summary.completed+'/'+summary.total+' 已完成；'+summary.successful+' 通过。诊断续跑，原始成绩与重验记录保留。</p><p>完整证据见 summary.json；实时进度与试玩见本机 8081 服务。</p>');
  console.log(JSON.stringify({status:state.status,completed:summary.completed,successful:summary.successful}));
 }finally{release();}
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 await runElasticBatch(path.resolve(process.argv[2]??''),Number(process.argv[3]));
}
