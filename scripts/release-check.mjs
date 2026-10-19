import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {ROOT,json,taskEvidenceHashes,harnessHashes,writeJson,benchmarkManifest} from '../runner/common.mjs';

const final=process.argv.includes('--final'),errors=[];
const requireCheck=(value,message)=>{if(!value)errors.push(message);};
const manifest=await benchmarkManifest();
const harness=await harnessHashes();
requireCheck(manifest.passed&&manifest.tasks.length===228,'The frozen 228-task OriginGameDevBench audit must pass.');
for(const file of ['LICENSE','NOTICE','README.md','THIRD_PARTY_NOTICES.md','CONTRIBUTING.md','SECURITY.md','CHANGELOG.md','CITATION.cff','docs/PROTOCOL.md','configs/source-index.json','configs/task-licenses.json']){
  try{await fs.access(path.join(ROOT,file));}catch{errors.push('Missing release file: '+file);}
}
let shipped={};try{shipped=(await json(path.join(ROOT,'validation/qa.json'))).tasks;}catch{}
const license=await fs.readFile(path.join(ROOT,'LICENSE'),'utf8'),tasks={};
for(const task of manifest.tasks){
  try{
    const actual=await taskEvidenceHashes(task),candidate=manifest.candidates.find(c=>c.id===task);
    requireCheck(JSON.stringify(candidate?.task_sha256)===JSON.stringify(actual),task+': manifest hash stale');
    let qa;try{qa=await json(path.join(ROOT,'artifacts/og-qa',task,'result.json'));}catch{qa=shipped[task];}
    requireCheck(qa?.passed&&JSON.stringify(qa.task_hashes)===JSON.stringify(actual),task+': QA missing, failed or stale');
    requireCheck(qa?.outcomes.filter(o=>o.kind.startsWith('visual-')&&o.ok).length===4,task+': four visual mutations must fail');
    if(qa)tasks[task]={task,passed:qa.passed,task_hashes:qa.task_hashes,runtime:qa.runtime,reference_repetitions:qa.reference_repetitions,outcomes:qa.outcomes.map(({kind,scenario,passed,ok,expected})=>({kind,scenario,passed,ok,expected}))};
    const provenance=await json(path.join(ROOT,'tasks',task,'provenance.json'));
    requireCheck(provenance.version===manifest.version&&provenance.review,task+': current review provenance missing');
    requireCheck(await fs.readFile(path.join(ROOT,'tasks',task,'LICENSE'),'utf8')===license,task+': task license differs');
    const assets=await json(path.join(ROOT,'tasks',task,'assets.json'));
    const redistributed=assets.source_art_redistributed??assets.rights?.source_art_redistributed;
    requireCheck(typeof redistributed==='boolean'&&(!redistributed||assets.license_evidence||assets.rights),task+': media provenance incomplete');
    for(const asset of assets.embedded_assets??[]){
      for(const side of ['starter','reference'])requireCheck(createHash('sha256').update(await fs.readFile(path.join(ROOT,'tasks',task,side,asset.path??asset.file))).digest('hex')===asset.sha256,task+': '+side+' asset hash differs');
    }
  }catch(error){errors.push(task+': '+error.message);}
}
for(const name of ['tests','isolation']){
  try{
    const check=await json(path.join(ROOT,'validation',name+'.json'));
    requireCheck(check.passed,name+': validation failed');
    requireCheck(JSON.stringify(check.harness_sha256)===JSON.stringify(harness),name+': evidence is stale');
  }catch{errors.push(name+': validation receipt missing');}
}
if(final){
  try{
    const smoke=await json(path.join(ROOT,'validation/package-smoke.json'));
    requireCheck(smoke.passed&&smoke.clean_dependency_install&&smoke.archive_integrity_verified,'Clean archive installation smoke test missing');
    requireCheck(JSON.stringify(smoke.harness_sha256)===JSON.stringify(harness),'Clean archive smoke test is stale');
    requireCheck(smoke.task_manifest_sha256===createHash('sha256').update(JSON.stringify(manifest.candidates)).digest('hex'),'Clean archive task manifest changed');
  }catch{errors.push('Clean archive installation smoke test missing');}
  try{
    const review=await json(path.join(ROOT,'configs/review-signoff.json'));
    requireCheck(review.status==='approved'&&review.reviewer&&['ai-technical-review','human-review'].includes(review.review_type)&&review.reviewed_task_manifest_sha256===createHash('sha256').update(JSON.stringify(manifest.candidates)).digest('hex'),'Disclosed technical review sign-off missing or stale');
    const notes=await json(path.join(ROOT,'validation/technical-review.json'));
    for(const[file,expected]of Object.entries(notes.review_evidence_sha256??{}))requireCheck(createHash('sha256').update(await fs.readFile(path.join(ROOT,file))).digest('hex')===expected,'Review evidence changed: '+file);
    requireCheck(Object.keys(notes.review_evidence_sha256??{}).length===33,'Task comparison evidence missing');
    const families=[...new Set(manifest.candidates.map(c=>c.source_kind+'/'+c.family))].sort();
    requireCheck(notes.manifest_sha256===review.reviewed_task_manifest_sha256&&JSON.stringify(notes.families.map(f=>f.family).sort())===JSON.stringify(families),'Review does not cover current source/family groups');
  }catch{errors.push('Technical review sign-off or family evidence missing');}
  try{
    const baseline=await json(path.join(ROOT,'results/baseline.json'));
    requireCheck(baseline.complete&&baseline.formal_eligible&&baseline.total===manifest.tasks.length,'Complete isolated model baseline missing');
    requireCheck(JSON.stringify(baseline.harness_sha256)===JSON.stringify(harness),'Baseline harness changed');
    requireCheck(JSON.stringify(baseline.task_versions)===JSON.stringify(Object.fromEntries(manifest.candidates.map(c=>[c.id,c.task_sha256]))),'Baseline tasks changed');
  }catch{errors.push('Complete isolated model baseline missing');}
}
if(process.argv.includes('--save-qa')&&errors.length===0)await writeJson(path.join(ROOT,'validation/qa.json'),{schema_version:1,scope:'Reference and negative-fixture QA, not model results',tasks});
console.log(JSON.stringify({stage:final?'validated-baseline':'release-candidate',version:manifest.version,passed:errors.length===0,tasks:manifest.tasks.length,errors},null,2));
if(errors.length)process.exitCode=1;
