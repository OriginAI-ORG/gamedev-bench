import fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT,json,writeJson,hashes,taskEvidenceHashes,id,contained,treeFiles} from '../runner/common.mjs';
import {loadTask} from './tasks.mjs';

export const ATTEMPTS=path.join(ROOT,'artifacts','attempts');
export function attemptPath(attemptId) {
  if(!/^attempt-[a-zA-Z0-9_-]+$/.test(attemptId||'')) throw new Error('Invalid attempt identifier');
  return path.join(ATTEMPTS,attemptId);
}
export async function event(folder,type,data={}) {
  await fs.appendFile(path.join(folder,'lifecycle.jsonl'),JSON.stringify({at:new Date().toISOString(),type,...data})+'\n');
}
export async function updateAttempt(folder,patch) {
  const record={...await json(path.join(folder,'attempt.json')),...patch,updated_at:new Date().toISOString()};
  await writeJson(path.join(folder,'attempt.json'),record);
  return record;
}
export async function prepareAttempt(taskId,{parent=null}={}) {
  const task=await loadTask(taskId),attemptId=id('attempt-'+taskId),folder=attemptPath(attemptId);
  const wallSeconds=task.spec.generation_budget?.wall_seconds??1200;
  const toolCalls=task.spec.generation_budget?.max_observable_tool_calls??task.spec.generation_budget?.max_response_tool_rounds??30;
  if(!Number.isInteger(wallSeconds)||wallSeconds<1||!Number.isInteger(toolCalls)||toolCalls<1)throw new Error('Invalid task generation budget');
  const taskHash=await taskEvidenceHashes(taskId);
  if(parent) {
    const previous=(await readAttempt(parent)).record;
    if(previous.task_id!==taskId || JSON.stringify(previous.task_version_sha256)!==JSON.stringify(taskHash)) {
      throw new Error('Task changed since the parent attempt; reset requires the identical task version and files.');
    }
  }
  await fs.mkdir(path.join(folder,'workspace'),{recursive:true});
  await fs.mkdir(path.join(folder,'generation'),{recursive:true});
  const workspace=path.join(folder,'workspace');
  await fs.cp(path.join(task.directory,'starter'),path.join(workspace,'game'),{recursive:true});
  await fs.writeFile(path.join(workspace,'instruction.md'),task.instruction);
  await fs.copyFile(path.join(ROOT,'environments','development','bench-client.mjs'),path.join(workspace,'bench.mjs'));
  await fs.copyFile(path.join(task.directory,'public-test.mjs'),path.join(workspace,'public-test.mjs'));
  // Public scoring instructions belong with the English task input, not with
  // the private checker. Legacy/pilot tasks may have no separate rubric.
  try { await fs.copyFile(path.join(task.directory,'rubric.md'),path.join(workspace,'rubric.md')); }
  catch(error) { if(error.code!=='ENOENT')throw error; }
  await writeJson(path.join(workspace,'task.json'),task.spec);
  const record={
    schema_version:1,attempt_id:attemptId,project:'webgame-benchmark',task_id:taskId,task_version:task.spec.version,
    runtime:task.spec.runtime||'webgame',state:'prepared',created_at:new Date().toISOString(),parent_attempt_id:parent,
    reset_semantics:'New workspace and new model context; previous attempt and evidence retained.',
    classification:'agent-development-attempt',formal_eligible:false,
    budget:{wall_seconds:wallSeconds,max_tool_calls:toolCalls,model_response_rounds:null,
      note:'CLI JSON exposes tool completions, not every internal model response; no false round-limit claim.'},
    generation:null,acceptance:null,
    isolation:{agent:'workspace-write',filesystem_read_boundary:'not-validated',private_tests_excluded_from_workspace:true,
      explanation:'Public files are staged separately; this is not proof that the model process cannot read outside them.'},
    initial_workspace_sha256:await hashes(workspace),
    task_version_sha256:taskHash,
    rights:{
      task:task.provenance,trajectory:{origin:'model-agent-run',expert_demonstration:false},
      model_output:{provider:null,model:null,terms_evidence:null,training:'unconfirmed',redistribution:'unconfirmed',commercial_use:'unconfirmed'},
      training_export_allowed:false
    }
  };
  await writeJson(path.join(folder,'attempt.json'),record);
  await event(folder,'environment.created',{task_id:taskId,parent_attempt_id:parent,initial_workspace_sha256:record.initial_workspace_sha256});
  return {folder,record,workspace};
}
export async function readAttempt(attemptId) {
  const folder=attemptPath(attemptId);
  return {folder,record:await json(path.join(folder,'attempt.json')),workspace:path.join(folder,'workspace')};
}
export async function selectPreparedAttempt(target) {
  const attempt=target?.startsWith('attempt-')?await readAttempt(target):await prepareAttempt(target);
  if(attempt.record.state!=='prepared')throw new Error('This attempt already started. Reset it to create a new attempt.');
  if(JSON.stringify(await hashes(attempt.workspace))!==JSON.stringify(attempt.record.initial_workspace_sha256)) {
    throw new Error('Prepared workspace was modified. Reset before running the model.');
  }
  const task=await loadTask(attempt.record.task_id);
  if(JSON.stringify(await taskEvidenceHashes(task.spec.id))!==JSON.stringify(attempt.record.task_version_sha256)) {
    throw new Error('Task version changed after preparation. Prepare a new task attempt.');
  }
  return attempt;
}
export class SnapshotValidationError extends Error {
  constructor(message){super(message);this.name='SnapshotValidationError';this.code='INVALID_SUBMISSION';}
}

export async function snapshotGame(workspace,target,{previous=null}={}) {
  const game=path.join(workspace,'game');
  let info,files;
  try {
    info=await fs.lstat(game);
    if(info.isSymbolicLink()||!info.isDirectory())throw new SnapshotValidationError('Game root must be a directory, not a symlink');
    files=await treeFiles(game);
  } catch(error) {
    if(error.code==='ENOENT'||/^(Symbolic links|Unsupported file)/.test(error.message))throw new SnapshotValidationError(error.message);
    throw error;
  }
  if(files.length>200) throw new SnapshotValidationError('Submission exceeds the 200-file pilot limit');
  let total=0;
  for(const file of files) {
    const relative=path.relative(game,file);
    if(!contained(game,file) || relative.split(path.sep).some(p=>p.startsWith('.'))) throw new SnapshotValidationError('Hidden/escaped files are not accepted; remove temporary dotfiles before test or submit');
    total+=(await fs.stat(file)).size;
    if(total>20*1024*1024) throw new SnapshotValidationError('Submission exceeds 20 MiB');
  }
  if(previous&&JSON.stringify(await hashes(game))===JSON.stringify(previous))return null;
  await fs.cp(game,target,{recursive:true,errorOnExist:true,force:false});
  return hashes(target);
}
