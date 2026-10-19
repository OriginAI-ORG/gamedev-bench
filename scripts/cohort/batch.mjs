import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {ROOT,json,writeJson,id,contained,taskEvidenceHashes,harnessHashes,benchmarkManifest,escapeHtml as e} from '../../runner/common.mjs';
import {prepareAttempt} from '../../core/attempts.mjs';
import {report} from '../../runner/report.mjs';
import {acquireLock} from '../../runner/lock.mjs';
import {validateBatchResume,pendingBatchTasks} from '../../core/batch-resume.mjs';

const args=process.argv.slice(2),get=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
for(let i=0;i<args.length;i++){
  if(['--execute','--diagnostic-continuation'].includes(args[i]))continue;
  if(!['--concurrency','--limit','--model','--effort','--resume'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--'))throw new Error('Invalid option '+args[i]+'. In PowerShell use npm.cmd or call node scripts/cohort/batch.mjs directly.');
  i++;
}
const manifest=await benchmarkManifest();
const concurrency=Number(get('--concurrency','1')),limit=Number(get('--limit',String(manifest.tasks.length)));
if(!Number.isInteger(concurrency)||concurrency<1||concurrency>4)throw new Error('Local model concurrency must be 1..4');
if(!Number.isInteger(limit)||limit<1)throw new Error('No validated cohort tasks available');
const tasks=manifest.tasks.slice(0,limit),model=get('--model',null),effort=get('--effort','high');
let totalBudgetSeconds=0;const budgets={},budgetLanes=Array(concurrency).fill(0);
for(const task of tasks){const spec=await json(path.join(ROOT,'tasks',task,'task.json'));const seconds=spec.generation_budget.wall_seconds+spec.acceptance_budget.wall_seconds;totalBudgetSeconds+=seconds;budgets[seconds]=(budgets[seconds]??0)+1;budgetLanes[budgetLanes.indexOf(Math.min(...budgetLanes))]+=seconds;}
const plan={tasks:tasks.length,model:model??'GPT-6 variant not selected',reasoning_effort:effort,local_concurrency:concurrency,model_calls_started:false,assumptions:{generation_minutes:[6,12],acceptance_minutes:[0.5,2],scheduling_allowance:0.2,quota_wait_included:false},estimate_hours:[6.5,14].map(m=>Math.round(tasks.length*m/60/concurrency*1.2*10)/10),budget_ceiling_hours:Math.ceil(Math.max(...budgetLanes)/360)/10,per_task_budget_seconds:budgets,note:'Planning estimate, not measured GPT-6 throughput. Budget duration models every task exhausting its generation and acceptance allowance; preflight, quota waits and retries are extra.'};
await writeJson(path.join(ROOT,'artifacts','og-model-run-plan.json'),plan);
if(!args.includes('--execute')){console.log(JSON.stringify(plan,null,2));process.exit(0);}
if(!model)throw new Error('Specify the exact authorized model with --model before --execute');
if(!manifest.passed||manifest.tasks.length<200)throw new Error('cohort release audit has not passed');
for(const task of tasks){
  const candidate=manifest.candidates.find(t=>t.id===task);
  if(!candidate?.qa_passed||JSON.stringify(candidate.task_sha256)!==JSON.stringify(await taskEvidenceHashes(task)))throw new Error('Task changed after cohort QA: '+task+'; rerun QA and audit');
}
const batches=path.join(ROOT,'artifacts','batches'),resume=get('--resume',null);
if(args.includes('--diagnostic-continuation')&&!resume)throw new Error('--diagnostic-continuation requires an existing --resume batch');
const folder=resume?path.resolve(resume):path.join(batches,id('og'));
if(!contained(batches,folder)||folder===batches)throw new Error('Batch directory must be inside artifacts/batches');
await fs.mkdir(folder,{recursive:true});
const releaseLock=acquireLock(path.join(folder,'runner.lock'));
const taskVersions=Object.fromEntries(tasks.map(task=>[task,manifest.candidates.find(t=>t.id===task).task_sha256]));
const harness=await harnessHashes();
let state=resume?await json(path.join(folder,'batch.json')):{id:path.basename(folder),created_at:new Date().toISOString(),model,effort,concurrency,tasks,task_versions:taskVersions,harness_sha256:harness,attempts:[]};
validateBatchResume(state,{model,effort,tasks,taskVersions,harness,diagnostic:args.includes('--diagnostic-continuation')});
let next=0,infrastructureStop=false;
const queue=pendingBatchTasks(state);
let phases=[];
try{phases=await json(path.join(folder,'execution-phases.json'));}catch(error){if(error.code!=='ENOENT')throw error;}
const phase={started_at:new Date().toISOString(),concurrency,harness_sha256:harness,
  diagnostic:state.diagnostic===true,retained_finished:tasks.length-queue.length,
  reason:state.diagnostic?'Explicit diagnostic continuation; original outcomes and runtime hashes retained.':resume?'Resume unfinished tasks with identical task and harness hashes.':'Initial run.'};
phases.push(phase);
await writeJson(path.join(folder,'execution-phases.json'),phases);
state.status='running';delete state.stopped_at;
let saving=Promise.resolve();
function save(){const snapshot=structuredClone(state);saving=saving.then(()=>writeJson(path.join(folder,'batch.json'),snapshot));return saving;}
await save();
await Promise.all(Array.from({length:concurrency},async()=>{
  while(!infrastructureStop&&next<queue.length){
    const task=queue[next++],prepared=await prepareAttempt(task);
    if(JSON.stringify(prepared.record.task_version_sha256)!==JSON.stringify(taskVersions[task]))throw new Error('Task changed before model launch: '+task);
    const attempt={task,id:prepared.record.attempt_id,state:'running',execution_phase:phases.length-1,task_version_sha256:prepared.record.task_version_sha256,started_at:new Date().toISOString()};
    state.attempts.push(attempt);await save();
    const log=await fs.open(path.join(folder,attempt.id+'.log'),'w');
    const result=await new Promise(resolve=>{
      const child=spawn(process.execPath,[path.join(ROOT,'scripts','benchmark.mjs'),'attempt','run',attempt.id],{cwd:ROOT,windowsHide:true,stdio:['ignore',log.fd,log.fd],env:{...process.env,BENCHMARK_MODEL:model,BENCHMARK_REASONING_EFFORT:effort,BENCHMARK_BATCH:'1'}});
      const timer=setTimeout(()=>{if(process.platform==='win32')spawnSync('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true});else child.kill('SIGTERM');},(prepared.record.budget.wall_seconds+360)*1000);
      child.on('error',error=>{clearTimeout(timer);resolve({error:String(error)});});
      child.on('close',(code,signal)=>{clearTimeout(timer);resolve({exit_code:code,signal});});
    });await log.close();
    const record=await json(path.join(prepared.folder,'attempt.json'));
    const unchanged=JSON.stringify(await taskEvidenceHashes(task))===JSON.stringify(taskVersions[task])&&JSON.stringify(await harnessHashes())===JSON.stringify(harness);
    Object.assign(attempt,{state:record.state==='finished'&&unchanged?'finished':'interrupted',finished_at:new Date().toISOString(),task_version_unchanged:unchanged,formal_eligible:record.formal_eligible===true,process:result,model_submitted:record.model_submitted??false,generation:record.generation,acceptance:record.acceptance,error:unchanged?(record.error??record.submission_error??result.error??null):'Task or harness changed during attempt; score discarded',successful:unchanged&&record.state==='finished'&&record.outcome==='success'});
    if(attempt.state==='interrupted')infrastructureStop=true;
    await save();console.log(task+' '+(attempt.successful?'PASS':'FAIL'));
  }
}));
const latest=tasks.map(task=>state.attempts.filter(a=>a.task===task).at(-1));
state.status=latest.every(a=>a?.state==='finished')?'finished':'incomplete';state.stopped_at=new Date().toISOString();if(state.status==='finished')state.finished_at=state.stopped_at;await save();
const groups=new Map();
for(let i=0;i<tasks.length;i++){
  const meta=manifest.candidates.find(t=>t.id===tasks[i]),key=(meta?.source_kind??'unknown')+'/'+(meta?.family??'unknown');
  if(!groups.has(key))groups.set(key,{family:key,total:0,completed:0,successful:0});
  const group=groups.get(key);group.total++;if(latest[i]?.state==='finished')group.completed++;if(latest[i]?.successful)group.successful++;
}
const families=[...groups.values()].map(g=>({...g,pass_rate:g.successful/g.total}));
const summary={batch_id:state.id,model,effort,diagnostic:state.diagnostic===true,classification:state.classification??'baseline',total:tasks.length,completed:latest.filter(a=>a?.state==='finished').length,successful:latest.filter(a=>a?.successful).length,model_submitted:latest.filter(a=>a?.model_submitted).length,formal_eligible:!state.diagnostic&&latest.every(a=>a?.state==='finished'&&a.formal_eligible),families,family_macro_pass_rate:families.reduce((s,g)=>s+g.pass_rate,0)/families.length,attempts:latest};
await writeJson(path.join(folder,'summary.json'),summary);
await fs.writeFile(path.join(folder,'index.html'),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>OriginGameDevBench 模型测试</title><style>body{font:15px system-ui;margin:40px}table{border-collapse:collapse}th,td{border:1px solid #ccd;padding:10px}</style><h1>OriginGameDevBench · '+e(model)+'</h1><p>'+summary.successful+'/'+summary.total+' 成功提交且通过验收。每次尝试记录读取隔离证据；最终发布资格由 release:final 检查。</p><table><tr><th>题号</th><th>结果</th><th>模型提交</th><th>开发秒数</th><th>通过检查</th></tr>'+latest.filter(Boolean).map(a=>'<tr><td>'+e(a.task)+'</td><td>'+(a.successful?'通过':'未通过')+'</td><td>'+a.model_submitted+'</td><td>'+Math.round((a.generation?.duration_ms??0)/1000)+'</td><td>'+e(a.acceptance?.passed_checks??0)+'/'+e(a.acceptance?.total_checks??0)+'</td></tr>').join('')+'</table>');
await fs.appendFile(path.join(folder,'index.html'),'<h2>机制族统计</h2><p>各族通过率等权平均：'+(summary.family_macro_pass_rate*100).toFixed(1)+'%。族内仍包含上游参数变体。</p><table><tr><th>来源 / 机制族</th><th>通过 / 总题数</th><th>通过率</th></tr>'+families.map(g=>'<tr><td>'+e(g.family)+'</td><td>'+g.successful+' / '+g.total+'</td><td>'+(g.pass_rate*100).toFixed(1)+'%</td></tr>').join('')+'</table>');
await report();console.log(path.join(folder,'index.html'));
releaseLock();
if(summary.successful!==summary.total)process.exitCode=1;
