import test from 'node:test';
import assert from 'node:assert/strict';
import {retainedAttempts} from '../scripts/continue-reaccepted.mjs';
import {pendingBatchTasks} from '../core/batch-resume.mjs';

function fixture(){
 const taskVersions={a:{verifier:'new'},b:{verifier:'new'},c:{verifier:'new'},d:{verifier:'new'}};
 const source={id:'old',tasks:['a','b','c','d'],attempts:[
  {id:'attempt-a',task:'a',state:'finished',model_submitted:true,generation:{status:'completed'},successful:false,task_version_sha256:{verifier:'old'},acceptance:{run_id:'old-a'}},
  {id:'attempt-b',task:'b',state:'finished',model_submitted:true,generation:{status:'completed'},successful:false,task_version_sha256:{verifier:'old'},acceptance:{run_id:'old-b'}},
  {id:'attempt-c',task:'c',state:'interrupted'}]};
 const result={id:'reaccept-test',batch_id:'old',status:'complete',original_evidence_unchanged:true,items:['a','b'].map(task=>({task,attempt_id:'attempt-'+task,original_run_id:'old-'+task,revised_run_id:'new-'+task,revised_task_sha256:taskVersions[task],revised_status:task==='a'?'passed':'functional-failure',revised_functional_pass:task==='a',revised_successful:task==='a',revised_checks:[{id:'core',passed:task==='a'}]}))};
 return {source,result,taskVersions};
}

test('continuation reuses completed generations including failures and only queues unfinished tasks',()=>{
 const {source,result,taskVersions}=fixture(),before=structuredClone(source);
 const attempts=retainedAttempts(source,result,taskVersions);
 assert.deepEqual(source,before,'original scores and generation records must remain immutable');
 assert.deepEqual(pendingBatchTasks({...source,attempts}),['c','d']);
 assert.equal(attempts[0].acceptance.run_id,'new-a');assert.equal(attempts[0].successful,true);
 assert.equal(attempts[0].retained_reacceptance.original_acceptance.run_id,'old-a');
 assert.equal(attempts[1].successful,false,'a real failure is retained, not regenerated');
 assert.equal(attempts[0].formal_eligible,false);
 assert.deepEqual(attempts[0].generation,source.attempts[0].generation);
});

test('continuation rejects partial, stale, mismatched or infrastructure reacceptance',()=>{
 for(const mutate of [f=>f.result.items.pop(),f=>f.result.items[0].revised_task_sha256={verifier:'stale'},f=>f.result.items[0].original_run_id='unrelated',f=>f.result.items[0].revised_status='infrastructure-error',f=>f.result.original_evidence_unchanged=false]){
  const f=fixture();mutate(f);assert.throws(()=>retainedAttempts(f.source,f.result,f.taskVersions));
 }
 const f=fixture();f.source.attempts[0].model_submitted=false;
 assert.throws(()=>retainedAttempts(f.source,f.result,f.taskVersions),/eligibility/);
});
