import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {ROOT,json,writeJson,taskEvidenceHashes,treeFiles,contained} from '../../runner/common.mjs';

// Validation only: never writes task content, translations, catalogs or cohort configuration.
const manifest=await json(path.join(ROOT,'configs/OriginGameDevBench.json'));
const digest=data=>createHash('sha256').update(data).digest('hex');
const cohort=digest(JSON.stringify(manifest.tasks));
assert.equal(manifest.version,(await json(path.join(ROOT,'package.json'))).version);assert.equal(manifest.tasks.length,228);
assert.deepEqual(manifest.tasks,Array.from({length:228},(_,i)=>`og-web-${String(i+1).padStart(4,'0')}`),'Frozen task selection changed');
const errors=[],warnings=[],candidates=[],counts={private_scenarios:0,reference_scenario_runs:0,public_examples:0,rejected_behavioral_mutations:0,rejected_visual_mutations:0,rejected_starters:0};
let shipped={};try{shipped=(await json(path.join(ROOT,'validation/qa.json'))).tasks;}catch{}
const tokenSet=text=>[...new Set([...text.matchAll(/`([^`]+)`/g)].map(m=>m[1]))].sort();
const numberSet=text=>[...new Set(text.replaceAll('−','-').match(/(?<![A-Za-z])-?\d+(?:\.\d+)?/g)??[])].sort();
const safe=relative=>{assert.equal(typeof relative,'string');assert.ok(!path.isAbsolute(relative)&&!relative.split(/[\\/]/).includes('..'));return relative;};
for(const id of manifest.tasks){
 const dir=path.join(ROOT,'tasks',id);let spec,actual,qa,review;
 try{
  spec=await json(path.join(dir,'task.json'));assert.equal(spec.id,id);assert.equal(spec.version,manifest.version);assert.equal(spec.prompt,'prompt.md');assert.equal(spec.prompt_zh,'prompt_zh.md');assert.equal(spec.public_verifier,'public-check.mjs');
  for(const file of ['starter/index.html','reference/index.html','LICENSE'])await fs.access(path.join(dir,file));
  for(const budget of [spec.generation_budget,spec.acceptance_budget])assert.ok(Number.isInteger(budget.wall_seconds)&&budget.wall_seconds>0);
  const en=await fs.readFile(path.join(dir,'prompt.md'),'utf8'),zh=await fs.readFile(path.join(dir,'prompt_zh.md'),'utf8');
  assert.doesNotMatch(en,/\p{Script=Han}/u);assert.match(zh,/\p{Script=Han}/u);assert.doesNotMatch(en+zh,/godot|GDScript|PackedScene|res:\/\/|\.tscn\b|\.tres\b/i);
  const req=text=>[...text.matchAll(/\*\*(R\d+)\b/g)].map(m=>m[1]);assert.ok(req(en).length>=3);assert.deepEqual(req(en),req(zh));assert.deepEqual(tokenSet(en),tokenSet(zh));assert.deepEqual(numberSet(en),numberSet(zh));
  const pub=await fs.readFile(path.join(dir,'public-check.mjs'),'utf8');assert.equal(pub,await fs.readFile(path.join(dir,'public-test.mjs'),'utf8'));assert.doesNotMatch(pub,/(?:from|import\s*\()\s*['"]\.\./);
  const provenance=await json(path.join(dir,'provenance.json'));assert.equal(provenance.version,manifest.version);assert.equal(spec.source_kind,'OriginGameDevBench');assert.doesNotMatch(JSON.stringify(provenance),/不检查 Godot|original_art\.py/);
  review=safe(provenance.review);await fs.access(path.join(ROOT,review));
  const assets=await json(path.join(dir,'assets.json')),redistributed=assets.source_art_redistributed??assets.rights?.source_art_redistributed;
  assert.equal(typeof redistributed,'boolean','Asset redistribution status missing');
  if(redistributed)assert.ok(assets.license_evidence||assets.rights,'Retained media license evidence missing');
  for(const asset of assets.embedded_assets??[]){
   const relative=safe(asset.path??asset.file);assert.match(asset.sha256,/^[a-f0-9]{64}$/);
   for(const side of ['starter','reference'])assert.equal(digest(await fs.readFile(path.join(dir,side,relative))),asset.sha256,side+'/'+relative);
  }
  if(assets.hash_manifest){
   const entries=await json(path.join(ROOT,safe(assets.hash_manifest)));
   for(const[file,hash]of Object.entries(entries))for(const side of ['starter','reference'])assert.equal(digest(await fs.readFile(path.join(dir,side,safe(assets.asset_root),safe(file)))),hash);
  }
  if(assets.digest){
   for(const side of ['starter','reference']){
    const root=path.join(dir,side,safe(assets.asset_root)),files=await treeFiles(root),hash=createHash('sha256');assert.equal(files.length,assets.files);
    for(const file of files){hash.update(path.relative(root,file).split(path.sep).join('/'));hash.update(Buffer.from([0]));hash.update(createHash('sha256').update(await fs.readFile(file)).digest());}
    assert.equal(hash.digest('hex'),assets.digest);
   }
  }
  const verifier=await import(pathToFileURL(path.join(dir,'verifier/scenarios.mjs')));assert.equal(typeof verifier.runScenario,'function');assert.ok(verifier.scenarios.length>=3);assert.equal(new Set(verifier.scenarios.map(s=>s.id)).size,verifier.scenarios.length);
  const mutations=await json(path.join(dir,'negative_cases/manifest.json'));assert.ok(mutations.length>=2);
  for(const item of mutations){assert.ok(verifier.scenarios.some(s=>s.id===item.must_fail_check));assert.ok(item.mutation,'Use current source mutations, not legacy rendered copies');const m=item.mutation;safe(m.file);assert.ok(m.find&&m.find!==m.replace);assert.equal((await fs.readFile(path.join(dir,'reference',m.file),'utf8')).split(m.find).length,2);}
  actual=await taskEvidenceHashes(id);try{qa=await json(path.join(ROOT,'artifacts/og-qa',id,'result.json'));}catch{qa=shipped[id];}
  assert.ok(qa?.passed,'QA failed or missing');assert.ok(JSON.stringify(qa.task_hashes)===JSON.stringify(actual),'QA hashes are stale');assert.equal(qa.reference_repetitions,3);
  for(let repeat=1;repeat<=3;repeat++)for(const scenario of verifier.scenarios)assert.ok(qa.outcomes.some(o=>o.kind==='reference-'+repeat&&o.scenario===scenario.id&&o.ok),'Missing repeated scenario '+scenario.id);
  assert.equal(qa.outcomes.filter(o=>o.kind.startsWith('negative-')&&o.ok).length,mutations.length);assert.equal(qa.outcomes.filter(o=>o.kind.startsWith('visual-')&&o.ok).length,4);assert.ok(qa.outcomes.some(o=>o.kind==='starter-rejected'&&o.ok));assert.ok(qa.outcomes.some(o=>o.kind==='reference-public'&&o.ok));
  counts.private_scenarios+=verifier.scenarios.length;counts.reference_scenario_runs+=verifier.scenarios.length*3;counts.public_examples++;counts.rejected_behavioral_mutations+=mutations.length;counts.rejected_visual_mutations+=4;counts.rejected_starters++;
 }catch(error){errors.push({task:id,message:error.message});}
 const passed=!errors.some(e=>e.task===id);
 candidates.push({id,version:spec?.version,source_kind:spec?.source_kind,family:spec?.family??spec?.contract??'unknown',review,qa_passed:passed,task_sha256:actual??null});
}
const result={schema_version:2,version:manifest.version,checked_at:new Date().toISOString(),cohort_sha256:cohort,scope:'Reference/verifier and package validation; not solver performance or artistic certification',passed:errors.length===0,qa_passed:candidates.filter(c=>c.qa_passed).length,total:228,verification_counts:counts,candidates,errors,warnings};
const output=path.join(ROOT,manifest.validation_receipt);assert.ok(contained(path.join(ROOT,'validation'),output));await writeJson(output,result);
console.log(JSON.stringify({...result,candidates:undefined},null,2));if(errors.length)process.exitCode=1;
