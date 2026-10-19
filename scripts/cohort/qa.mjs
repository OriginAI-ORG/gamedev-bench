import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {ROOT,json,writeJson,taskEvidenceHashes,escapeHtml as e} from '../../runner/common.mjs';
import {acquireLock} from '../../runner/lock.mjs';

const args=process.argv.slice(2),option=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
for(let i=0;i<args.length;i++){
  if(args[i]==='--resume')continue;
  if(!['--concurrency','--prefix','--task','--tasks'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--'))throw new Error('Invalid QA option '+args[i]+'. In PowerShell use npm.cmd or call node directly.');
  i++;
}
const concurrency=Number(option('--concurrency','3')),prefix=option('--prefix',''),only=option('--task',null);
const selected=option('--tasks',null)?.split(',');
if(selected&&(only||selected.some(id=>!/^og-web-\d{4}$/.test(id))||new Set(selected).size!==selected.length))throw new Error('Invalid or conflicting task selection');
if(!Number.isInteger(concurrency)||concurrency<1||concurrency>8)throw new Error('Concurrency must be 1..8');
const releaseLock=acquireLock(path.join(ROOT,'artifacts','og-qa-controller.lock'));
const tasks=(await json(path.join(ROOT,'configs/OriginGameDevBench.json'))).tasks.filter(id=>id.startsWith(prefix)&&(!only||id===only)&&(!selected||selected.includes(id)));
if(selected&&tasks.length!==selected.length)throw new Error('A selected task does not exist or is excluded by the prefix');
const started=Date.now(),results=[];let next=0;
let progressSaving=Promise.resolve();
function saveProgress(value){const snapshot=structuredClone(value);progressSaving=progressSaving.then(()=>writeJson(path.join(ROOT,'artifacts','og-qa-progress.json'),snapshot));return progressSaving;}
async function run(task){
  const dir=path.join(ROOT,'artifacts','og-qa',task);await fs.mkdir(dir,{recursive:true});
  if(args.includes('--resume'))try{
    const prior=await json(path.join(dir,'result.json'));
    if(prior.passed&&JSON.stringify(prior.task_hashes)===JSON.stringify(await taskEvidenceHashes(task)))return {...prior,reused:true};
  }catch{}
  // Preserve the previous attempt before rerunning an invalidated or failed
  // check. A later pass must not erase the earlier failure evidence.
  try{
    const prior=await json(path.join(dir,'result.json'));
    const history=path.join(dir,'history',(prior.started_at??new Date().toISOString()).replace(/[:.]/g,'-'));
    await fs.mkdir(history,{recursive:true});
    await fs.copyFile(path.join(dir,'result.json'),path.join(history,'result.json'));
    const files=['worker.log',...prior.outcomes.filter(o=>!o.ok&&o.evidence).flatMap(o=>[o.evidence,o.evidence.replace(/\.json$/,'.png')])];
    for(const file of files)if(/^[a-zA-Z0-9._-]+$/.test(file))try{await fs.copyFile(path.join(dir,file),path.join(history,file));}catch{}
  }catch{}
  const log=await fs.open(path.join(dir,'worker.log'),'w');
  const status=await new Promise(resolve=>{
    const child=spawn(process.execPath,[path.join(ROOT,'scripts','cohort','qa-task.mjs'),task],{cwd:ROOT,windowsHide:true,stdio:['ignore',log.fd,log.fd]});
    const timer=setTimeout(()=>{child.kill();},240000);
    child.on('error',error=>{clearTimeout(timer);resolve({error:String(error)});});
    child.on('close',(code,signal)=>{clearTimeout(timer);resolve({code,signal});});
  });await log.close();
  try{const result=await json(path.join(dir,'result.json'));if(Date.parse(result.started_at)<started-1000)throw new Error('Stale worker result');return result;}
  catch{return {task,passed:false,outcomes:[{kind:'worker',ok:false,...status}]};}
}
await Promise.all(Array.from({length:concurrency},async()=>{
  while(next<tasks.length){const task=tasks[next++],result=await run(task);results.push(result);console.log('['+results.length+'/'+tasks.length+'] '+task+' '+(result.passed?'PASS':'FAIL')+(result.reused?' (cached)':''));
    await saveProgress({total:tasks.length,completed:results.length,passed:results.filter(r=>r.passed).length,last:task});}
}));
results.sort((a,b)=>a.task.localeCompare(b.task));
const summary={started_at:new Date(started).toISOString(),finished_at:new Date().toISOString(),duration_ms:Date.now()-started,concurrency,model_run:false,total:results.length,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).map(r=>({task:r.task,failures:r.outcomes.filter(o=>!o.ok)})),results:results.map(r=>({task:r.task,passed:r.passed,duration_ms:r.duration_ms,reused:r.reused??false}))};
await writeJson(path.join(ROOT,'artifacts','og-qa-summary.json'),summary);
await fs.writeFile(path.join(ROOT,'artifacts','OriginGameDevBench-qa.html'),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>OriginGameDevBench 验收器自检</title><style>body{font:15px/1.7 system-ui;max-width:1100px;margin:36px auto;padding:20px;background:#f5f7fa}table{border-collapse:collapse;width:100%;background:white}td,th{padding:8px;border:1px solid #cdd7e0}pre{white-space:pre-wrap}.fail{color:#a32828}</style><h1>OriginGameDevBench 验收器自检</h1><p>'+summary.passed+'/'+summary.total+' 题通过；每题参考解重复3次、公开检查、行为负例和starter拒绝。</p><p>这是参考解与验收器的自检报告，不是GPT-6模型测试成绩。</p><table><tr><th>任务</th><th>结果</th><th>时间</th><th>证据</th></tr>'+results.map(r=>'<tr><td>'+e(r.task)+'</td><td class="'+(r.passed?'':'fail')+'">'+(r.passed?'通过':'失败')+'</td><td>'+Math.round((r.duration_ms??0)/1000)+'秒</td><td><a href="og-qa/'+e(r.task)+'/result.json">逐项检查</a></td></tr>').join('')+'</table>');
console.log(JSON.stringify({total:summary.total,passed:summary.passed,failed:summary.failed.length,seconds:summary.duration_ms/1000}));
releaseLock();
if(summary.passed!==summary.total||summary.total===0)process.exitCode=1;
