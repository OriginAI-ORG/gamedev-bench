import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {ROOT,json,writeJson,id,hashes,treeFiles,taskEvidenceHashes} from './common.mjs';

export async function runOne(task,source,classification,expected=null,model=null) {
  if(!/^[a-z][a-z0-9-]*$/.test(task)) throw new Error("Invalid task name");
  const definition = await json(path.join(ROOT,'tasks',task,'task.json'));
  const runId=id(task), output=path.join(ROOT,'artifacts','runs',runId);
  await fs.mkdir(output,{recursive:true});
  await treeFiles(source); // rejects symlinks before snapshot creation
  await fs.cp(source,path.join(output,'submitted_project'),{recursive:true,errorOnExist:true,force:false});
  const request={
    run_id:runId,task,task_version:definition.version,classification,expected,
    source_label:path.basename(source),runtime:{
      node:process.version,platform:process.platform,arch:process.arch,
      os:os.release(),playwright:(await json(path.join(ROOT,'node_modules','playwright','package.json'))).version
    },
    budget:definition.acceptance_budget,task_files_sha256:await taskEvidenceHashes(task),
    upstream:await json(path.join(ROOT,'configs','upstream-lock.json')),
    model:model||{identifier:null,agent:classification==='current-session-development'?'current-codex-conversation':null,independent_generation:false}
  };
  const requestPath=path.join(output,'run-config.json');
  await writeJson(requestPath,request);
  const run=spawnSync(process.execPath,[path.join(ROOT,'scripts','benchmark.mjs'),'worker',requestPath],{
    cwd:ROOT,encoding:'utf8',timeout:definition.acceptance_budget.wall_seconds*1000,
    maxBuffer:4*1024*1024,windowsHide:true
  });
  await fs.writeFile(path.join(output,'worker.log'),(run.stdout||'')+(run.stderr||''));
  if(run.stdout) console.log(run.stdout.trim());
  if(run.error || run.status!==0) {
    const failure={schema_version:1,run_id:runId,task,task_version:definition.version,classification,expected,
      status:'infrastructure-error',functional_pass:false,started_at:new Date().toISOString(),finished_at:new Date().toISOString(),
      duration_ms:0,runtime:request.runtime,checks:[{id:'worker',passed:false,message:String(run.error||run.stderr||'Worker failed')}],
      errors:[String(run.error||run.stderr||'Worker failed')],usage:{input_tokens:null,output_tokens:null,cost:null}};
    try {
      const prior=await json(path.join(output,'verdict.json'));
      failure.checks=[...prior.checks,...failure.checks];
      await writeJson(path.join(output,'pre-worker-error-verdict.json'),prior);
    } catch {}
    await writeJson(path.join(output,'verdict.json'),failure);
    console.error('Acceptance infrastructure failed; see '+path.join(output,'worker.log'));
  }
  return {output,...await json(path.join(output,'verdict.json'))};
}

