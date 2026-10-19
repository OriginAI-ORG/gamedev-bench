import path from 'node:path';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {ROOT,json,writeJson,taskEvidenceHashes,benchmarkManifest} from '../runner/common.mjs';

if(!process.argv.includes('--review-completed'))throw new Error('Record only after the explicitly authorized AI technical review has actually been completed.');
const manifest=await benchmarkManifest();
const notes=await json(path.join(ROOT,'configs/family-review-notes.json'));
if(!manifest.passed||manifest.tasks.length!==228)throw new Error('Review requires the complete frozen candidate');
const groups=new Map();
for(const task of manifest.candidates){
  if(JSON.stringify(task.task_sha256)!==JSON.stringify(await taskEvidenceHashes(task.id)))throw new Error('Stale reviewed task: '+task.id);
  const key=task.source_kind+'/'+task.family;
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push(task.id);
}
if(groups.size!==Object.keys(notes).length)throw new Error('Family review coverage differs');
const families=[...groups].map(([family,tasks])=>{if(!notes[family])throw new Error('Unreviewed family: '+family);return {family,tasks,...notes[family]};});
const reviewEvidence={};for(const file of [...new Set(families.map(f=>f.review))].sort())reviewEvidence[file]=createHash('sha256').update(await fs.readFile(path.join(ROOT,file))).digest('hex');
const digest=createHash('sha256').update(JSON.stringify(manifest.candidates)).digest('hex'),at=new Date().toISOString();
await writeJson(path.join(ROOT,'validation/technical-review.json'),{review_type:'ai-technical-review',reviewer:'Codex (AI)',reviewed_at:at,manifest_sha256:digest,
  scope:'Published Web contracts, reference/verifier mechanisms, family variants, negative examples, scope/provenance and declared coverage limitations',
  independence:'AI review by the implementation assistant; not independent human or expert validation',
  version:manifest.version,review_policy:'Task-by-task AI technical review and repair requested by the project owner',review_evidence_sha256:reviewEvidence,families});
await writeJson(path.join(ROOT,'configs/review-signoff.json'),{status:'approved',review_type:'ai-technical-review',reviewer:'Codex (AI)',reviewed_at:at,
  version:manifest.version,reviewed_task_manifest_sha256:digest,scope:manifest.tasks.length+' tasks / '+families.length+' source-family groups; individual comparisons in docs/task-reviews and limitations in validation/technical-review.json',
  human_signoff:false,independent_expert_review:false,evidence:'validation/technical-review.json'});
console.log('Recorded AI technical review: '+families.length+' source/family groups');
