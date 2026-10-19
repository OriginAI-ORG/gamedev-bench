import fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT,json} from '../runner/common.mjs';

export async function loadTask(taskId) {
  if(!/^og-web-\d{4}$/.test(taskId||'')) throw new Error('Invalid task identifier');
  const directory=path.join(ROOT,'tasks',taskId);
  const spec=await json(path.join(directory,'task.json'));
  if(spec.id!==taskId) throw new Error('Task identity mismatch');
  return {directory,spec,instruction:await fs.readFile(path.join(directory,'prompt.md'),'utf8'),
    provenance:await json(path.join(directory,'provenance.json'))};
}
export async function listTasks() {
  const tasks=[];
  for(const entry of await fs.readdir(path.join(ROOT,'tasks'),{withFileTypes:true})) {
    if(!entry.isDirectory()) continue;
    try { tasks.push((await loadTask(entry.name)).spec); } catch {}
  }
  return tasks;
}
