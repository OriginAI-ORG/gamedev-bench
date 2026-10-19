import path from 'node:path';
import {createHash} from 'node:crypto';
import {ROOT,json,writeJson,contained,harnessHashes,taskEvidenceHashes,benchmarkManifest} from '../runner/common.mjs';

const folder=path.resolve(process.argv[2]??'');
if(!contained(path.join(ROOT,'artifacts','batches'),folder)||folder===path.join(ROOT,'artifacts','batches'))throw new Error('Provide a local batch directory');
const state=await json(path.join(folder,'batch.json')),summary=await json(path.join(folder,'summary.json')),manifest=await benchmarkManifest();
if(state.diagnostic||summary.diagnostic)throw new Error('Diagnostic continuations cannot be exported as a formal baseline');
if(state.status!=='finished'||!summary.formal_eligible||JSON.stringify(state.tasks)!==JSON.stringify(manifest.tasks))throw new Error('A complete isolated full-cohort batch is required');
if(JSON.stringify(state.harness_sha256)!==JSON.stringify(await harnessHashes()))throw new Error('Harness changed since baseline');
const rows=[];
for(const task of manifest.tasks){
  if(JSON.stringify(state.task_versions[task])!==JSON.stringify(await taskEvidenceHashes(task)))throw new Error('Task changed: '+task);
  const item=summary.attempts.find(a=>a.task===task),attempt=await json(path.join(ROOT,'artifacts','attempts',item.id,'attempt.json'));
  const isolation=await json(path.join(ROOT,'artifacts','attempts',item.id,'generation/sandbox-preflight.json'));
  if(attempt.state!=='finished'||!attempt.formal_eligible||!isolation.passed)throw new Error('Attempt incomplete or unconfined: '+task);
  rows.push({task,family:manifest.candidates.find(c=>c.id===task).source_kind+'/'+manifest.candidates.find(c=>c.id===task).family,
    successful:attempt.outcome==='success',model_submitted:attempt.model_submitted,generation_status:attempt.generation.status,
    generation_ms:attempt.generation.duration_ms,tool_calls:attempt.generation.tool_calls,usage:attempt.generation.usage,
    acceptance_status:attempt.acceptance.status,passed_checks:attempt.acceptance.passed_checks,total_checks:attempt.acceptance.total_checks,
    cli_version:attempt.generation.cli_version,isolation_checks:isolation.checked});
}
const passed=rows.filter(r=>r.successful).length;
let executionPhases=[];try{executionPhases=await json(path.join(folder,'execution-phases.json'));}catch{}
const baseline={schema_version:1,complete:true,formal_eligible:true,scope:'Local full-cohort pass@1; source release only, no raw trajectories or model code included',
  model:state.model,reasoning_effort:state.effort,started_at:state.created_at,finished_at:state.finished_at,total:rows.length,successful:passed,pass_at_1:passed/rows.length,
  family_macro_pass_rate:summary.family_macro_pass_rate,families:summary.families,harness_sha256:state.harness_sha256,task_versions:state.task_versions,
  manifest_sha256:createHash('sha256').update(JSON.stringify(manifest.candidates)).digest('hex'),
  execution_phases:executionPhases,infrastructure_attempts:state.attempts.filter(a=>a.state!=='finished').map(a=>({task:a.task,state:a.state,generation_status:a.generation?.status??null,rate_limited:JSON.stringify(a.generation?.errors??[]).includes('429')})),attempts:rows};
await writeJson(path.join(ROOT,'results/baseline.json'),baseline);
console.log(JSON.stringify({model:state.model,successful:passed,total:rows.length,output:'results/baseline.json'}));
