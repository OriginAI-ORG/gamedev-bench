import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {benchmarkManifest,writeJson,contained} from '../runner/common.mjs';
test('validation receipts cannot silently replace a frozen cohort or reuse another version',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'webgame-cohort-'));
 try{
  const tasks=['og-web-8001','og-web-8002'],manifest={schema_version:2,version:'2.0.0',tasks,validation_receipt:'validation/task-audit.json'};
  await writeJson(path.join(root,'configs/OriginGameDevBench.json'),manifest);
  let current=await benchmarkManifest(root);assert.equal(current.passed,false);assert.deepEqual(current.tasks,tasks);
  const receipt={version:'2.0.0',passed:true,cohort_sha256:createHash('sha256').update(JSON.stringify(tasks)).digest('hex'),candidates:tasks.map(id=>({id,qa_passed:true}))};
  const save=async value=>writeJson(path.join(root,manifest.validation_receipt),value);
  await save(receipt);assert.equal((await benchmarkManifest(root)).passed,true);
  await save({...receipt,candidates:receipt.candidates.slice(0,1)});current=await benchmarkManifest(root);assert.equal(current.passed,false);assert.deepEqual(current.tasks,tasks);
  await save({...receipt,version:'1.0.0'});assert.equal((await benchmarkManifest(root)).passed,false);
  await save({...receipt,passed:false});current=await benchmarkManifest(root);assert.equal(current.passed,false);assert.deepEqual(current.tasks,tasks);
 }finally{const resolved=await fs.realpath(root);assert.ok(contained(await fs.realpath(os.tmpdir()),resolved)&&path.basename(resolved).startsWith('webgame-cohort-'));await fs.rm(resolved,{recursive:true,force:true});}
});
