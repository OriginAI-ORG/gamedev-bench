import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {ROOT,json,writeJson,id,contained,hashes,taskEvidenceHashes,harnessHashes,benchmarkManifest} from '../runner/common.mjs';
import {acquireLock} from '../runner/lock.mjs';
import {pendingBatchTasks,validateBatchResume} from '../core/batch-resume.mjs';

const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const digest=async file=>createHash('sha256').update(await fs.readFile(file)).digest('hex');

// Copies records into a new diagnostic batch. Original attempts, batch and
// acceptance records are never edited or submitted to a model again.
export function retainedAttempts(source,result,taskVersions){
 if(result.status!=='complete'||!result.original_evidence_unchanged||result.batch_id!==source.id)throw new Error('A complete, integrity-checked reacceptance is required');
 const finished=source.attempts.filter(a=>a.state==='finished');
 if(new Set(finished.map(a=>a.task)).size!==finished.length)throw new Error('Ambiguous completed source tasks');
 if(result.items.length!==finished.length||new Set(result.items.map(i=>i.attempt_id)).size!==finished.length)throw new Error('Reacceptance must cover every completed attempt exactly once');
 const indexed=new Map(result.items.map(i=>[i.attempt_id,i]));
 return source.attempts.map(original=>{
  const a=structuredClone(original);
  a.source_batch_id=source.id;a.source_execution_phase=a.execution_phase??null;delete a.execution_phase;
  if(a.state!=='finished')return a;
  const item=indexed.get(a.id);
  if(!item||item.task!==a.task||item.original_run_id!==a.acceptance?.run_id)throw new Error('Reacceptance identity mismatch: '+a.id);
  if(!same(item.revised_task_sha256,taskVersions[a.task]))throw new Error('Reaccepted task version is stale: '+a.task);
  if(!['passed','functional-failure'].includes(item.revised_status))throw new Error('Interrupted acceptance cannot be retained');
  a.retained_reacceptance={id:result.id,original_acceptance:a.acceptance,original_successful:a.successful,original_task_version_sha256:a.task_version_sha256};
  a.task_version_sha256=item.revised_task_sha256;
  a.acceptance={run_id:item.revised_run_id,status:item.revised_status,functional_pass:item.revised_functional_pass,
   passed_checks:item.revised_checks.filter(c=>c.passed).length,total_checks:item.revised_checks.length};
  a.successful=a.model_submitted===true&&a.generation?.status==='completed'&&item.revised_functional_pass;
  if(a.successful!==item.revised_successful)throw new Error('Reaccepted success eligibility differs: '+a.task);
  a.formal_eligible=false;
  return a;
 });
}

export async function prepareContinuation(reevaluation,{concurrency=2}={}){
 const replayRoot=path.join(ROOT,'artifacts/reevaluations'),batches=path.join(ROOT,'artifacts/batches');
 if(!contained(replayRoot,reevaluation)||reevaluation===replayRoot)throw new Error('Expected a local reacceptance folder');
 if(!Number.isInteger(concurrency)||concurrency<1||concurrency>4)throw new Error('Concurrency must be 1..4');
 const release=acquireLock(path.join(reevaluation,'continuation.lock'));let releaseSource;
 try{
  const resultFile=path.join(reevaluation,'results.json'),result=await json(resultFile),resultHash=await digest(resultFile);
  const sourceFolder=path.resolve(ROOT,result.batch_folder);
  if(!contained(batches,sourceFolder)||sourceFolder===batches)throw new Error('Source outside local batches');
  releaseSource=acquireLock(path.join(sourceFolder,'runner.lock'));
  const sourceFile=path.join(sourceFolder,'batch.json'),source=await json(sourceFile);
  if(await digest(sourceFile)!==result.original_batch_sha256)throw new Error('Original batch changed since reacceptance');
  const manifest=await benchmarkManifest();
  if(!manifest.passed||!same(source.tasks,manifest.tasks))throw new Error('Validated task selection differs from source batch');
  const taskVersions=Object.fromEntries(manifest.candidates.map(c=>[c.id,c.task_sha256]));
  for(const task of manifest.tasks)if(!same(await taskEvidenceHashes(task),taskVersions[task]))throw new Error('Task QA is stale: '+task);
  const harness=await harnessHashes(),attempts=retainedAttempts(source,result,taskVersions);
  const verdictHashes={};
  for(const item of result.items){
   for(const [file,sha] of Object.entries(item.protected_files)){
    const absolute=path.resolve(ROOT,file);if(!contained(path.join(ROOT,'artifacts'),absolute)||await digest(absolute)!==sha)throw new Error('Original evidence changed: '+file);
   }
   if(!same(await hashes(path.join(ROOT,'artifacts/attempts',item.attempt_id,'submitted_project')),item.submission_sha256))throw new Error('Original submission changed: '+item.task);
   const runFolder=path.join(ROOT,'artifacts/runs',item.revised_run_id),verdict=await json(path.join(runFolder,'verdict.json')),config=await json(path.join(runFolder,'run-config.json'));
   if(verdict.run_id!==item.revised_run_id||verdict.task!==item.task||verdict.functional_pass!==item.revised_functional_pass||verdict.status!==item.revised_status||!same(verdict.checks,item.revised_checks)||!same(verdict.submission_sha256,item.submission_sha256)||!verdict.submission_unchanged||!same(config.task_files_sha256,item.revised_task_sha256))throw new Error('Revised evidence mismatch: '+item.task);
   verdictHashes[item.revised_run_id]=await digest(path.join(runFolder,'verdict.json'));
  }
  const pointerFile=path.join(reevaluation,'continuation.json');let pointer;
  try{pointer=await json(pointerFile);}catch(error){if(error.code!=='ENOENT')throw error;}
  if(pointer){
   if(pointer.result_sha256!==resultHash)throw new Error('Previously imported reacceptance changed');
   const folder=path.join(batches,pointer.batch_id);
   if(!contained(batches,folder)||folder===batches)throw new Error('Invalid continuation pointer');
   const state=await json(path.join(folder,'batch.json'));
   validateBatchResume(state,{model:source.model,effort:source.effort,tasks:manifest.tasks,taskVersions,harness});
   return {folder,reused:true,retained:result.items.length,remaining:pendingBatchTasks(state).length,model:state.model,effort:state.effort,concurrency:state.concurrency};
  }
  const folder=path.join(batches,id('og-reaccepted'));
  const state={id:path.basename(folder),created_at:new Date().toISOString(),model:source.model,effort:source.effort,concurrency,
   tasks:manifest.tasks,task_versions:taskVersions,harness_sha256:harness,attempts,status:'prepared',diagnostic:true,formal_eligible:false,classification:'diagnostic-continuation',
   diagnostic_note:'Retains existing model generations with separately corrected acceptance; only unfinished tasks are generated.',
   reacceptance:{id:result.id,source_batch_id:source.id,result_sha256:resultHash,source_batch_sha256:result.original_batch_sha256,retained:result.items.length}};
  await writeJson(path.join(folder,'batch.json'),state);
  await writeJson(path.join(folder,'retention.json'),{created_at:state.created_at,...state.reacceptance,verdict_sha256:verdictHashes,retained_attempt_ids:result.items.map(i=>i.attempt_id),pending_tasks:pendingBatchTasks(state),model_calls_during_import:0,importer_sha256:await digest(fileURLToPath(import.meta.url))});
  await writeJson(pointerFile,{batch_id:state.id,result_sha256:resultHash});
  return {folder,reused:false,retained:result.items.length,remaining:pendingBatchTasks(state).length,model:source.model,effort:source.effort,concurrency};
 }finally{releaseSource?.();release();}
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(!process.argv[2])throw new Error('Usage: node scripts/continue-reaccepted.mjs REACCEPT_PATH [CONCURRENCY]');
 console.log(JSON.stringify(await prepareContinuation(path.resolve(process.argv[2]),{concurrency:Number(process.argv[3]??2)})));
}
