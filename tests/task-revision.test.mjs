import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT,json} from '../runner/common.mjs';
import {loadTask} from '../core/tasks.mjs';

test('revised tasks keep English as the input and align bilingual contract tokens',async()=>{
 const manifest=await json(path.join(ROOT,'configs','OriginGameDevBench.json'));let revised=0;
 const tokens=text=>[...new Set([...text.matchAll(/`([^`]+)`/g)].map(m=>m[1]))].sort();
 const numbers=text=>[...new Set(text.replaceAll('−','-').match(/(?<![A-Za-z])-?\d+(?:\.\d+)?/g)??[])].sort();
 for(const id of manifest.tasks){
  const folder=path.join(ROOT,'tasks',id),spec=await json(path.join(folder,'task.json'));assert.equal(spec.version,manifest.version,id+' current release version');revised++;
  const en=await fs.readFile(path.join(folder,'prompt.md'),'utf8'),zh=await fs.readFile(path.join(folder,'prompt_zh.md'),'utf8');
  assert.equal(spec.prompt,'prompt.md',id);assert.equal(spec.prompt_zh,'prompt_zh.md',id);
  assert.doesNotMatch(en,/\p{Script=Han}/u,id+' English input');assert.match(zh,/\p{Script=Han}/u,id+' Chinese companion');
  assert.doesNotMatch(en+'\n'+zh,/godot|res:\/\/|\.tscn\b|\.tres\b|PackedScene|GDScript/i,id+' browser-native prose');
  const requirements=text=>[...text.matchAll(/\*\*(R\d+)\b/g)].map(m=>m[1]);assert.ok(requirements(en).length>=3,id);assert.deepEqual(requirements(en),requirements(zh),id+' requirement IDs');
  assert.deepEqual(tokens(en),tokens(zh),id+' interface names and literal values');assert.deepEqual(numbers(en),numbers(zh),id+' numeric contract');
  const loaded=await loadTask(id);assert.equal(loaded.instruction,en,id+' loader must read prompt.md');assert.notEqual(loaded.instruction,zh,id+' companion is not solver input');
  const publicCheck=await fs.readFile(path.join(folder,'public-check.mjs'),'utf8');
  assert.equal(await fs.readFile(path.join(folder,'public-test.mjs'),'utf8'),publicCheck,id+' model-visible public example must match executed public check');
  assert.doesNotMatch(publicCheck,/(?:from|import\s*\()\s*['"]\.\./,id+' public example must be self-contained after staging');
 }
 assert.equal(revised,228,'all frozen task packages must be revised');
});

test('revised behavioral mutation recipes target one real source occurrence',async()=>{
 const manifest=await json(path.join(ROOT,'configs','OriginGameDevBench.json'));
 for(const id of manifest.tasks){
  const folder=path.join(ROOT,'tasks',id),spec=await json(path.join(folder,'task.json'));assert.equal(spec.version,manifest.version,id+' current release version');
  for(const item of await json(path.join(folder,'negative_cases','manifest.json'))){
   if(!item.mutation)continue;const m=item.mutation;assert.match(m.file,/^[a-zA-Z0-9_/-]+\.[a-z]+$/,id);assert.ok(!m.file.split('/').includes('..'),id);assert.ok(m.find,id+' mutation search');assert.notEqual(m.find,m.replace,id+' mutation changes behavior');
   const source=await fs.readFile(path.join(folder,'reference',m.file),'utf8');assert.equal(source.split(m.find).length,2,id+' '+item.fault+' exact source match');
  }
 }
});
