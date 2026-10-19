import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {ROOT,json,writeJson,hashes,taskEvidenceHashes,harnessHashes,id,contained} from '../runner/common.mjs';
import {runOne} from '../runner/submission.mjs';
import {acquireLock} from '../runner/lock.mjs';

const args=process.argv.slice(2),mode=args[0],target=path.resolve(args[1]??'');
const digest=async file=>createHash('sha256').update(await fs.readFile(file)).digest('hex');
const base=path.join(ROOT,'artifacts/reevaluations');
if(mode==='prepare'){
  const batches=path.join(ROOT,'artifacts/batches');
  if(!contained(batches,target)||target===batches)throw new Error('Expected a local batch directory');
  try{const lock=await json(path.join(target,'runner.lock'));try{process.kill(lock.pid,0);throw new Error('Stop model generation before preparing reacceptance');}catch(e){if(e.code!=='ESRCH')throw e;}}catch(e){if(e.code!=='ENOENT')throw e;}
  const batch=await json(path.join(target,'batch.json')),folder=path.join(base,id('reaccept'));
  await fs.mkdir(folder,{recursive:true});
  const attempts=batch.attempts.filter(a=>a.state==='finished'&&a.acceptance?.run_id),items=[];
  for(const a of attempts){
    const attemptFolder=path.join(ROOT,'artifacts/attempts',a.id),runFolder=path.join(ROOT,'artifacts/runs',a.acceptance.run_id);
    const verdict=await json(path.join(runFolder,'verdict.json')),submitted=await hashes(path.join(attemptFolder,'submitted_project'));
    if(JSON.stringify(submitted)!==JSON.stringify(verdict.submission_sha256))throw new Error('Original submission changed: '+a.id);
    const protectedFiles=[path.join(attemptFolder,'attempt.json'),path.join(runFolder,'verdict.json'),path.join(runFolder,'run-config.json')];
    items.push({task:a.task,attempt_id:a.id,original_run_id:a.acceptance.run_id,model_submitted:a.model_submitted===true,generation_status:a.generation?.status,
      original_successful:a.successful,original_functional_pass:verdict.functional_pass,original_checks:verdict.checks,
      submission_sha256:submitted,original_task_sha256:a.task_version_sha256,
      protected_files:Object.fromEntries(await Promise.all(protectedFiles.map(async f=>[path.relative(ROOT,f),await digest(f)])))});
  }
  // Freeze the previous verifier source as well as its identity before any edits.
  for(const name of ['taskkits','configs/OriginGameDevBench.json'])await fs.cp(path.join(ROOT,name),path.join(folder,'before',name),{recursive:true});
  for(const task of batch.tasks)await fs.cp(path.join(ROOT,'tasks',task,'verifier'),path.join(folder,'before/tasks',task,'verifier'),{recursive:true});
  const plan={schema_version:1,id:path.basename(folder),batch_id:batch.id,batch_folder:path.relative(ROOT,target),created_at:new Date().toISOString(),
    no_model_calls:true,scope:'Reacceptance of unchanged existing submissions; no regeneration, no new pass@1 claim.',
    original_batch_sha256:await digest(path.join(target,'batch.json')),original_harness_sha256:await harnessHashes(),items};
  await writeJson(path.join(folder,'plan.json'),plan);console.log(JSON.stringify({folder,submissions:items.length,original_passed:items.filter(i=>i.original_functional_pass).length}));
}else if(mode==='run'){
  if(!contained(base,target)||target===base)throw new Error('Expected a prepared reevaluation directory');
  const release=acquireLock(path.join(target,'runner.lock'));
  try{
    const plan=await json(path.join(target,'plan.json')),before=await harnessHashes();
    const replayScriptHash=await digest(path.join(ROOT,'scripts/reaccept.mjs'));
    let result;try{result=await json(path.join(target,'results.json'));}catch(e){if(e.code!=='ENOENT')throw e;result={...plan,items:[],status:'running',reaccepted_at:new Date().toISOString(),harness_sha256:before,replay_script_sha256:replayScriptHash,task_manifest:Object.fromEntries(await Promise.all(plan.items.map(async i=>[i.task,await taskEvidenceHashes(i.task)])))};}
    if(result.replay_script_sha256&&result.replay_script_sha256!==replayScriptHash)throw new Error('Replay controller changed; prepare a separate reacceptance');
    if(JSON.stringify(result.harness_sha256)!==JSON.stringify(before))throw new Error('Verifier harness changed after replay began; prepare a separate reacceptance');
    const verifyOriginal=async item=>{
      for(const [file,expected] of Object.entries(item.protected_files))if(await digest(path.join(ROOT,file))!==expected)throw new Error('Original evidence changed: '+file);
      if(JSON.stringify(await hashes(path.join(ROOT,'artifacts/attempts',item.attempt_id,'submitted_project')))!==JSON.stringify(item.submission_sha256))throw new Error('Original submission changed');
    };
    for(const item of plan.items){
      await verifyOriginal(item);
      const current=await taskEvidenceHashes(item.task);
      if(result.task_manifest&&JSON.stringify(current)!==JSON.stringify(result.task_manifest[item.task]))throw new Error('Verifier changed after replay began: '+item.task);
      // Public task text/starter seen by the original model must not be rewritten.
      for(const [file,sha] of Object.entries(item.original_task_sha256))if(file==='prompt.md'||file==='task.json'||file==='public-test.mjs'||file==='public-check.mjs'||file.startsWith('starter/')){
        if(current[file]!==sha)throw new Error('Original public contract changed: '+item.task+'/'+file);
      }
      const prior=result.items.find(i=>i.attempt_id===item.attempt_id);
      if(prior){
        if(JSON.stringify(prior.revised_task_sha256)!==JSON.stringify(current))throw new Error('Task changed since replay: '+item.task);
        if(prior.revised_status!=='infrastructure-error')continue;
        (result.retry_history??=[]).push(prior);result.items=result.items.filter(i=>i!==prior);
      }
      result.status='running';await writeJson(path.join(target,'results.json'),result);
      const verdict=await runOne(item.task,path.join(ROOT,'artifacts/attempts',item.attempt_id,'submitted_project'),'existing-submission-reacceptance',null,
        {identifier:null,agent:null,independent_generation:false,attempt_id:item.attempt_id,original_run_id:item.original_run_id,no_model_call:true});
      await verifyOriginal(item);
      if(JSON.stringify(current)!==JSON.stringify(await taskEvidenceHashes(item.task)))throw new Error('Task changed during replay');
      result.items.push({...item,revised_run_id:verdict.run_id,revised_task_sha256:current,revised_functional_pass:verdict.functional_pass,
        revised_successful:item.model_submitted&&item.generation_status==='completed'&&verdict.functional_pass,
        revised_status:verdict.status,revised_checks:verdict.checks});
      await writeJson(path.join(target,'results.json'),result);
      console.log(`${result.items.length}/${plan.items.length} ${item.task}: ${item.original_functional_pass?'PASS':'FAIL'} -> ${verdict.functional_pass?'PASS':'FAIL'}`);
      if(verdict.status==='infrastructure-error'){result.status='interrupted';await writeJson(path.join(target,'results.json'),result);throw new Error('Acceptance infrastructure failed; rerun this command to resume without model calls');}
    }
    if(await digest(path.join(ROOT,plan.batch_folder,'batch.json'))!==plan.original_batch_sha256)throw new Error('Original batch changed');
    if(JSON.stringify(await harnessHashes())!==JSON.stringify(before))throw new Error('Harness changed during replay');
    result.status='complete';result.finished_at=new Date().toISOString();result.original_evidence_unchanged=true;
    result.summary={total:result.items.length,original_passed:result.items.filter(i=>i.original_functional_pass).length,revised_passed:result.items.filter(i=>i.revised_functional_pass).length,
      improved:result.items.filter(i=>!i.original_functional_pass&&i.revised_functional_pass).length,regressed:result.items.filter(i=>i.original_functional_pass&&!i.revised_functional_pass).length};
    await writeJson(path.join(target,'results.json'),result);console.log(JSON.stringify(result.summary));
  }finally{release();}
}else throw new Error('Usage: node scripts/reaccept.mjs prepare BATCH_PATH | run REEVALUATION_PATH');
