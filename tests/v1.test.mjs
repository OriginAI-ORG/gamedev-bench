import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT,contained,writeJson} from '../runner/common.mjs';
import {prepareAttempt,ATTEMPTS} from '../core/attempts.mjs';
import {publicCheck} from '../environments/development/public-check.mjs';
import {acquireLock} from '../runner/lock.mjs';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {validateBatchResume,pendingBatchTasks} from '../core/batch-resume.mjs';

test('exclusive runner lock rejects another process and is released on clean exit',async t=>{
  const folder=path.join(ROOT,'artifacts','v1-lock-test-'+process.pid),file=path.join(folder,'runner.lock');
  t.after(async()=>{assert.ok(contained(path.join(ROOT,'artifacts'),folder));await fs.rm(folder,{recursive:true,force:true});});
  const release=acquireLock(file);t.after(release);
  const source='import {acquireLock} from '+JSON.stringify(pathToFileURL(path.join(ROOT,'runner','lock.mjs')).href)+';acquireLock(process.argv[1]);';
  const run=()=>spawnSync(process.execPath,['--input-type=module','-e',source,file],{encoding:'utf8',windowsHide:true});
  const blocked=run();assert.notEqual(blocked.status,0);assert.match(blocked.stderr,/Runner lock exists/);
  release();const accepted=run();assert.equal(accepted.status,0,accepted.stderr);
  await assert.rejects(fs.access(file));
});

test('resume retains successes and model failures; changed harness requires a diagnostic phase',()=>{
  const state={model:'test-model',effort:'high',tasks:['pass','fail','interrupted','pending'],
    task_versions:{version:'unchanged'},harness_sha256:{runner:'old'},attempts:[
      {task:'pass',state:'finished',successful:true},{task:'fail',state:'finished',successful:false},
      {task:'interrupted',state:'interrupted'}]};
  const options={model:state.model,effort:state.effort,tasks:state.tasks,taskVersions:state.task_versions,harness:state.harness_sha256};
  const original=structuredClone(state);
  validateBatchResume(state,options);
  assert.deepEqual(pendingBatchTasks(state),['interrupted','pending']);
  assert.throws(()=>validateBatchResume(state,{...options,harness:{runner:'fixed'}}),/Harness changed/);
  assert.throws(()=>validateBatchResume(state,{...options,diagnostic:true,taskVersions:{version:'changed'}}),/Tasks or shared verifiers changed/);
  validateBatchResume(state,{...options,harness:{runner:'fixed'},diagnostic:true});
  assert.equal(state.diagnostic,true);assert.equal(state.formal_eligible,false);
  assert.deepEqual(state.harness_sha256,original.harness_sha256);
  assert.deepEqual(state.attempts,original.attempts);
  validateBatchResume(state,options);
  assert.equal(state.diagnostic,true,'returning to an old harness cannot make a mixed batch formal');
});

test('formal baseline exporter refuses diagnostic results',async t=>{
  const folder=path.join(ROOT,'artifacts','batches','diagnostic-export-test-'+process.pid);
  t.after(async()=>{const parent=path.join(ROOT,'artifacts','batches');assert.ok(contained(parent,folder)&&folder!==parent);await fs.rm(folder,{recursive:true,force:true});});
  await writeJson(path.join(folder,'batch.json'),{diagnostic:true,status:'finished'});
  await writeJson(path.join(folder,'summary.json'),{formal_eligible:true});
  const run=spawnSync(process.execPath,['scripts/export-baseline.mjs',folder],{cwd:ROOT,encoding:'utf8',windowsHide:true});
  assert.notEqual(run.status,0);assert.match(run.stderr,/Diagnostic continuations cannot be exported/);
});

test('new task public checker dispatches without the legacy board contract and respects task budget',async t=>{
  const id='og-web-8999',folder=path.join(ROOT,'tasks',id),output=path.join(ROOT,'artifacts',id);
  const tasksRoot=path.join(ROOT,'tasks'),artifactsRoot=path.join(ROOT,'artifacts');
  t.after(async()=>{assert.ok(contained(tasksRoot,folder)&&folder!==tasksRoot);assert.ok(contained(artifactsRoot,output)&&output!==artifactsRoot);await fs.rm(folder,{recursive:true,force:true});await fs.rm(output,{recursive:true,force:true});});
  await fs.mkdir(path.join(folder,'starter'),{recursive:true});
  await writeJson(path.join(folder,'task.json'),{id,version:'1.0.0',public_verifier:'public-check.mjs',generation_budget:{wall_seconds:450,max_observable_tool_calls:12}});
  await writeJson(path.join(folder,'provenance.json'),{});
  await fs.writeFile(path.join(folder,'prompt.md'),'Implement a visible counter.');
  await fs.writeFile(path.join(folder,'public-test.mjs'),'// Public counter example');
  await fs.writeFile(path.join(folder,'starter','index.html'),'<!doctype html><button onclick="this.textContent=Number(this.textContent)+1">0</button>');
  await fs.writeFile(path.join(folder,'public-check.mjs'),`import assert from 'node:assert/strict';export async function runPublicCheck(page,url,record){await page.goto(url);await page.getByRole('button').click();assert.equal(await page.getByRole('button').innerText(),'1');record({action:'click',value:1});}`);
  const attempt=await prepareAttempt(id);
  t.after(async()=>{assert.ok(contained(ATTEMPTS,attempt.folder)&&attempt.folder!==ATTEMPTS);await fs.rm(attempt.folder,{recursive:true,force:true});});
  assert.equal(attempt.record.budget.wall_seconds,450);assert.equal(attempt.record.budget.max_tool_calls,12);
  await assert.rejects(fs.access(path.join(attempt.workspace,'public-check.mjs')));
  const result=await publicCheck(id,path.join(attempt.workspace,'game'),output);
  assert.equal(result.ok,true);assert.deepEqual(result.checks,[{name:'task-public-example',passed:true}]);
  const actions=JSON.parse(await fs.readFile(path.join(output,'public-actions.json'),'utf8'));
  assert.deepEqual(actions,[{action:'click',value:1}]);
});
