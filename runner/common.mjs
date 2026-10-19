import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
// The cohort is authored once; validation writes a separate receipt and cannot
// remove failed tasks or rewrite their prompts.
export async function benchmarkManifest(root=ROOT) {
  const manifest=await json(path.join(root,'configs/OriginGameDevBench.json'));
  if(manifest.schema_version!==2)return manifest;
  let receipt;try{receipt=await json(path.join(root,manifest.validation_receipt));}catch{}
  const digest=createHash('sha256').update(JSON.stringify(manifest.tasks)).digest('hex');
  const bound=receipt?.version===manifest.version&&receipt.cohort_sha256===digest&&JSON.stringify(receipt.candidates?.map(c=>c.id))===JSON.stringify(manifest.tasks);
  return {...manifest,passed:bound&&receipt.passed===true,qa_passed:bound?receipt.qa_passed:0,candidates:bound?receipt.candidates:[],verification_counts:bound?receipt.verification_counts:null};
}
export async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');
}
export function contained(root, item) {
  const relative = path.relative(path.resolve(root), path.resolve(item));
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}
export async function treeFiles(root) {
  const files = [];
  async function walk(folder) {
    for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Symbolic links are not accepted: ' + file);
      if (entry.isDirectory()) await walk(file);
      else if (entry.isFile()) files.push(file);
      else throw new Error('Unsupported file: ' + file);
    }
  }
  await walk(root);
  return files.sort();
}
export async function hashes(root) {
  const result = {};
  for (const file of await treeFiles(root)) {
    result[path.relative(root, file).split(path.sep).join('/')] = createHash('sha256').update(await fs.readFile(file)).digest('hex');
  }
  return result;
}
// Verifiers may import shared task-kit helpers. Their source is part of the
// validated task version, so changes cannot silently reuse old QA results.
export async function taskEvidenceHashes(taskId) {
  const result=await hashes(path.join(ROOT,'tasks',taskId));
  const spec=await json(path.join(ROOT,'tasks',taskId,'task.json'));
  const kit=spec.taskkit;
  if(kit){
    if(kit!=='OriginGameDevBench')throw new Error('Unknown taskkit');
    const shared=await hashes(path.join(ROOT,'taskkits',kit));
    for(const [name,digest] of Object.entries(shared))result['@taskkit/'+kit+'/'+name]=digest;
    for(const file of ['scripts/cohort/qa-task.mjs','environments/verification/browser.mjs','environments/verification/server.mjs','environments/verification/visual.mjs','environments/verification/input-trace.mjs','core/attempts.mjs','runner/evaluate.mjs','runner/common.mjs','runner/lock.mjs','package-lock.json']){
      result['@qa-engine/'+file]=createHash('sha256').update(await fs.readFile(path.join(ROOT,file))).digest('hex');
    }
  }
  return result;
}
export function id(prefix) { return prefix + '-' + new Date().toISOString().replace(/[:.]/g, '-') + '-' + Math.random().toString(36).slice(2,7); }
export async function harnessHashes(){
  const result={};
  for(const folder of ['agents','core','runner','environments'])for(const file of await treeFiles(path.join(ROOT,folder))){
    result[path.relative(ROOT,file).replaceAll('\\','/')]=createHash('sha256').update(await fs.readFile(file)).digest('hex');
  }
  for(const file of ['scripts/benchmark.mjs','scripts/cohort/batch.mjs','package-lock.json'])result[file]=createHash('sha256').update(await fs.readFile(path.join(ROOT,file))).digest('hex');
  return result;
}
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
