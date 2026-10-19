import path from 'node:path';
import {prepareAttempt,readAttempt,selectPreparedAttempt,updateAttempt,event} from './attempts.mjs';
import {codexSettings,runCodex} from '../agents/codex.mjs';
import {preflightCodex} from '../agents/preflight.mjs';
import {startDevelopment} from '../environments/development/broker.mjs';
import {runOne} from '../runner/submission.mjs';
import {report} from '../runner/report.mjs';
import {taskEvidenceHashes} from '../runner/common.mjs';
import {finalizeGeneration,infrastructureGeneration} from './finalize-generation.mjs';

export async function runAttempt(taskId) {
  let settings=await codexSettings();
  const attempt=await selectPreparedAttempt(taskId),{folder,record}=attempt;
  taskId=record.task_id;
  console.log('Attempt '+record.attempt_id+' | '+settings.model+' | '+settings.effort);
  await updateAttempt(folder,{state:'running',rights:{...record.rights,model_output:{...record.rights.model_output,provider:'OpenAI',model:settings.model}}});
  let development;
  try {
    settings=await preflightCodex(attempt,settings);
    await updateAttempt(folder,{formal_eligible:settings.isolation.passed,isolation:{...record.isolation,agent:'benchmark-permission-profile',filesystem_read_boundary:settings.isolation.read_boundary,profile_sha256:settings.isolation.profile_sha256,evidence:'generation/sandbox-preflight.json'}});
    development=await startDevelopment(attempt);
    const generation=await runCodex(attempt,settings);
    const finalized=await finalizeGeneration(attempt,development,generation);
    if(!finalized.ready)return finalized.record;
    const submitted=finalized.modelSubmitted;
    await updateAttempt(folder,{state:'verifying'});
    if(JSON.stringify(await taskEvidenceHashes(taskId))!==JSON.stringify(record.task_version_sha256))throw new Error('Task changed during generation; discard this attempt and prepare again.');
    const result=await runOne(taskId,path.join(folder,'submitted_project'),'agent-development-attempt',null,
      {identifier:settings.model,agent:'codex-cli',independent_generation:true,attempt_id:record.attempt_id,filesystem_isolation:settings.isolation.read_boundary,isolation_profile_sha256:settings.isolation.profile_sha256});
    if(JSON.stringify(await taskEvidenceHashes(taskId))!==JSON.stringify(record.task_version_sha256))throw new Error('Task changed during acceptance; score discarded.');
    const acceptance={run_id:result.run_id,status:result.status,functional_pass:result.functional_pass,
      passed_checks:result.checks.filter(c=>c.passed).length,total_checks:result.checks.length};
    const outcome=generation.status==='completed'&&submitted&&acceptance.functional_pass?'success':'unsuccessful';
    const infrastructure=result.status==='infrastructure-error'||infrastructureGeneration(generation.status);
    const final=await updateAttempt(folder,{state:infrastructure?'interrupted':'finished',outcome:infrastructure?'infrastructure-error':outcome,acceptance,finished_at:new Date().toISOString()});
    await event(folder,'acceptance.finished',acceptance);
    console.log(JSON.stringify({attempt_id:record.attempt_id,generation:generation.status,model_submitted:!!submitted,acceptance},null,2));
    return final;
  } catch(error) {
    if(development)await development.stop();
    await updateAttempt(folder,{state:'error',error:String(error),finished_at:new Date().toISOString()});
    await event(folder,'attempt.error',{message:String(error)});throw error;
  } finally {if(process.env.BENCHMARK_BATCH!=='1')await report();}
}

export function assertTrainingRights(record) {
  const r=record.rights;
  if(r?.training_export_allowed!==true || r.task?.third_party_training!=='authorized' || r.model_output?.training!=='authorized'
    || !r.task?.authorization_evidence?.length || !r.model_output?.terms_evidence) {
    throw new Error('Training export blocked: task and model-output authorization evidence are incomplete.');
  }
}

export async function attemptCommand(args) {
  const [action,target]=args;
  if(action==='run') {
    const result=await runAttempt(target);
    if(result.generation.status!=='completed'||!result.model_submitted||!result.acceptance.functional_pass)process.exitCode=1;
  } else if(action==='prepare')console.log((await prepareAttempt(target)).record.attempt_id);
  else if(action==='reset') {
    const old=await readAttempt(target);
    const fresh=await prepareAttempt(old.record.task_id,{parent:target});
    console.log(fresh.record.attempt_id);
  } else if(action==='show')console.log(JSON.stringify((await readAttempt(target)).record,null,2));
  else if(action==='training-check') {
    assertTrainingRights((await readAttempt(target)).record);
    console.log('Recorded authorization gate passed; no export was performed.');
  } else throw new Error('Usage: npm run attempt -- run TASK_OR_PREPARED_ATTEMPT; prepare TASK; reset|show|training-check ATTEMPT_ID');
}
