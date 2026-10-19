import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {prepareAttempt,selectPreparedAttempt,updateAttempt,ATTEMPTS,snapshotGame} from '../core/attempts.mjs';
import {assertTrainingRights} from '../core/run-attempt.mjs';
import {startDevelopment as openDevelopment,safeWorkspacePath} from '../environments/development/broker.mjs';
import {observableEvent} from '../agents/events.mjs';
import {createRevisionRecorder} from '../agents/revisions.mjs';
import {finalizeGeneration} from '../core/finalize-generation.mjs';
import {contained,hashes,json,ROOT} from '../runner/common.mjs';

async function fixture(t,task='og-web-9001',options={}) {
  const a=await prepareAttempt(task,options);
  t.after(async()=>{await a.stopDevelopment?.();assert.ok(contained(ATTEMPTS,a.folder)&&a.folder!==ATTEMPTS);await fs.rm(a.folder,{recursive:true,force:true});});
  return a;
}
async function startDevelopment(attempt){
  const development=await openDevelopment(attempt);
  attempt.stopDevelopment=()=>development.stop();
  return development;
}
function request(a,action) {
  return new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,['bench.mjs',action],{cwd:a.workspace,windowsHide:true});let output='';
    child.stdout.on('data',b=>output+=b);child.on('error',reject);
    child.on('close',code=>{try{resolve({code,...JSON.parse(output)});}catch(error){reject(error);}});
  });
}
test('reset creates identical public files and preserves the earlier workspace',async t=>{
  const old=await fixture(t),fresh=await fixture(t,'og-web-9001',{parent:old.record.attempt_id});
  await fs.writeFile(path.join(old.workspace,'game','index.html'),'modified attempt');
  assert.notEqual(old.record.attempt_id,fresh.record.attempt_id);
  assert.equal(fresh.record.parent_attempt_id,old.record.attempt_id);
  assert.deepEqual(await hashes(fresh.workspace),old.record.initial_workspace_sha256);
  assert.equal(await fs.readFile(path.join(old.workspace,'game','index.html'),'utf8'),'modified attempt');
  assert.equal(Object.keys(await hashes(fresh.workspace)).some(p=>/reference|verifier|negative_cases/.test(p)),false);
  assert.equal(fresh.record.formal_eligible,false);
});

test('revised public inputs stage the current example and complete-game rubric without private material',async t=>{
  const a=await fixture(t,'og-web-0010');
  const source=path.join(ROOT,'tasks','og-web-0010');
  assert.equal(await fs.readFile(path.join(a.workspace,'instruction.md'),'utf8'),await fs.readFile(path.join(source,'prompt.md'),'utf8'));
  assert.equal(await fs.readFile(path.join(a.workspace,'public-test.mjs'),'utf8'),await fs.readFile(path.join(source,'public-check.mjs'),'utf8'));
  assert.equal(await fs.readFile(path.join(a.workspace,'rubric.md'),'utf8'),await fs.readFile(path.join(source,'rubric.md'),'utf8'));
  assert.equal(Object.keys(await hashes(a.workspace)).some(p=>/reference|verifier|negative_cases|prompt_zh/.test(p)),false);
});
test('submission stays frozen after later edits and rejects second submit',async t=>{
  const a=await fixture(t),dev=await startDevelopment(a);t.after(()=>dev.stop());
  const first=await request(a,'submit');assert.equal(first.ok,true);
  await fs.writeFile(path.join(a.workspace,'game','index.html'),'late change');
  assert.deepEqual(await hashes(path.join(a.folder,'submitted_project')),first.sha256);
  const second=await request(a,'submit');assert.equal(second.ok,false);
});
test('model run selects only a clean, never-started prepared attempt',async t=>{
  const a=await fixture(t);
  assert.equal((await selectPreparedAttempt(a.record.attempt_id)).record.attempt_id,a.record.attempt_id);
  await fs.writeFile(path.join(a.workspace,'game','index.html'),'prewritten answer');
  await assert.rejects(selectPreparedAttempt(a.record.attempt_id),/workspace was modified/);
  await updateAttempt(a.folder,{state:'finished'});
  await assert.rejects(selectPreparedAttempt(a.record.attempt_id),/already started/);
});
test('public feedback detects starter failure and accepts a correct implementation',async t=>{
  const a=await fixture(t),dev=await startDevelopment(a);t.after(()=>dev.stop());
  const bad=await request(a,'test');assert.equal(bad.ok,false);
  await fs.copyFile(path.join(ROOT,'tasks','og-web-9001','reference','index.html'),path.join(a.workspace,'game','index.html'));
  const good=await request(a,'test');assert.equal(good.ok,true);
  assert.ok(good.screenshot.startsWith('feedback/'));
  assert.ok((await fs.stat(path.join(a.workspace,good.screenshot))).size>0);
});
test('workspace junctions and hidden submission files are rejected',async t=>{
  const a=await fixture(t),other=await fixture(t);
  const link=path.join(a.workspace,'linked');
  await fs.symlink(other.workspace,link,process.platform==='win32'?'junction':'dir');
  await assert.rejects(safeWorkspacePath(a.workspace,link),/Symlink/);
  await fs.unlink(link);
  await fs.writeFile(path.join(a.workspace,'game','.env'),'not a submission');
  await assert.rejects(snapshotGame(a.workspace,path.join(a.folder,'bad-snapshot')),/Hidden/);
});
test('training gate requires independent evidence and traces exclude reasoning',async t=>{
  const a=await fixture(t);
  assert.throws(()=>assertTrainingRights(a.record),/authorization evidence/);
  a.record.rights.training_export_allowed=true;
  assert.throws(()=>assertTrainingRights(a.record),/authorization evidence/);
  assert.equal(observableEvent({type:'item.completed',item:{type:'reasoning',text:'private'}}),null);
  const visible=observableEvent({type:'item.completed',item:{id:'1',type:'command_execution',aggregated_output:'Bearer abc123'}});
  assert.equal(visible.item.aggregated_output,'Bearer [REDACTED]');
});

test('temporary hidden files skip revision capture, allow repair, and still block final submission',async t=>{
  const a=await fixture(t),recorder=createRevisionRecorder(a),dev=await startDevelopment(a);
  t.after(()=>dev.stop());
  assert.equal(await recorder.capture('starter'),true);
  const temporary=path.join(a.workspace,'game','.tool-check');
  await fs.writeFile(temporary,'probe');
  assert.equal(await recorder.capture('temporary-file'),false);
  assert.equal(recorder.count(),1);
  const rejected=await request(a,'submit');assert.equal(rejected.ok,false);
  assert.match(rejected.message,/Hidden/);
  await fs.unlink(temporary);
  await fs.appendFile(path.join(a.workspace,'game','index.html'),'<!-- repaired -->');
  assert.equal(await recorder.capture('repair'),true);
  assert.equal(await recorder.capture('unchanged'),false);
  const accepted=await request(a,'submit');assert.equal(accepted.ok,true);
  assert.equal(recorder.count(),2);
  const events=(await fs.readFile(path.join(a.folder,'lifecycle.jsonl'),'utf8')).trim().split('\n').map(JSON.parse);
  assert.ok(events.some(e=>e.type==='workspace.revision-skipped'&&e.after_item==='temporary-file'));
});

test('invalid final drafts retain generation usage and distinguish model failure from infrastructure interruption',async t=>{
  for(const status of ['completed','wall-budget-exceeded','agent-error']){
    const a=await fixture(t),dev=await startDevelopment(a);t.after(()=>dev.stop());
    const generation={status,tool_calls:6,usage:{input_tokens:100,output_tokens:20}};
    await fs.writeFile(path.join(a.workspace,'game','.tool-check'),'probe');
    const final=await finalizeGeneration(a,dev,generation);
    assert.equal(final.ready,false);
    const record=await json(path.join(a.folder,'attempt.json'));
    assert.deepEqual(record.generation,generation);
    assert.equal(record.state,status==='agent-error'?'interrupted':'finished');
    assert.equal(record.model_submitted,false);
    assert.equal(record.acceptance.status,'invalid-submission');
    await assert.rejects(fs.access(path.join(a.folder,'submitted_project')));
  }
});

test('unexpected finalization failure still retains the original generation result',async t=>{
  const a=await fixture(t),generation={status:'completed',usage:{output_tokens:123}};
  const development={submission:()=>null,stop:async()=>{},freezeDraft:async()=>{throw new Error('disk unavailable');}};
  await assert.rejects(finalizeGeneration(a,development,generation),/disk unavailable/);
  assert.deepEqual((await json(path.join(a.folder,'attempt.json'))).generation,generation);
});
