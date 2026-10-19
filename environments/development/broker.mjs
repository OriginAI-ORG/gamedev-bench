import fs from 'node:fs/promises';
import path from 'node:path';
import {writeJson,contained} from '../../runner/common.mjs';
import {event,snapshotGame} from '../../core/attempts.mjs';
import {publicCheck} from './public-check.mjs';

// Defense in depth for this local pilot. Concurrent malicious path swaps still
// require an OS/container boundary before formal or untrusted multi-tenant use.
export async function safeWorkspacePath(workspace,target,{create=false}={}) {
  if(!contained(workspace,target))throw new Error('Path escapes workspace');
  let current=workspace;
  const parts=path.relative(workspace,target).split(path.sep).filter(Boolean);
  for(const part of ['',...parts]) {
    if(part)current=path.join(current,part);
    let info;
    try{info=await fs.lstat(current);}catch(error){
      if(error.code!=='ENOENT'||!create)throw error;
      await fs.mkdir(current);info=await fs.lstat(current);
    }
    if(info.isSymbolicLink())throw new Error('Symlink in development path');
  }
  const real=await fs.realpath(target),root=await fs.realpath(workspace);
  if(!contained(root,real))throw new Error('Resolved path escapes workspace');
  return real;
}

export async function startDevelopment(attempt) {
  const {folder,workspace,record}=attempt,inbox=path.join(workspace,'requests');
  const receipts=path.join(folder,'generation','feedback');
  await safeWorkspacePath(workspace,inbox,{create:true});
  await safeWorkspacePath(workspace,path.join(workspace,'feedback'),{create:true});
  await fs.mkdir(receipts,{recursive:true});
  let stopped=false,busy=false,submitted=null;
  const processed=new Set();
  async function processRequest(file) {
    let request;
    try {
      const filePath=await safeWorkspacePath(workspace,path.join(inbox,file));
      if((await fs.stat(filePath)).size>4096)throw new Error('Request too large');
      request=JSON.parse(await fs.readFile(filePath,'utf8'));
    }
    catch {return;}
    if(!/^[0-9a-f-]{36}$/.test(request.id)||file!==request.id+'.json') return;
    const out=path.join(receipts,request.id),visible=path.join(workspace,'feedback',request.id);
    await fs.mkdir(out,{recursive:true});
    await event(folder,'tool.request',{name:'development.'+request.action,request_id:request.id});
    let response;
    try {
      if(submitted) throw new Error('Submission already frozen; this attempt no longer accepts changes.');
      if(!['test','observe','submit'].includes(request.action))throw new Error('Unknown development action');
      const source=path.join(out,'project');
      const snapshot=await snapshotGame(workspace,source);
      if(request.action==='submit') {
        const final=path.join(folder,'submitted_project');
        await fs.cp(source,final,{recursive:true,errorOnExist:true,force:false});
        submitted={at:new Date().toISOString(),reason:'model-submitted',sha256:snapshot};
        await writeJson(path.join(folder,'submission.json'),submitted);
        response={ok:true,message:'Submission frozen. Independent acceptance will run after the agent exits.',sha256:snapshot};
      } else response=await publicCheck(record.task_id,source,out,request.action);
    } catch(error) {response={ok:false,message:String(error.message||error)};}
    await writeJson(path.join(out,'result.json'),response);
    // Publish only public feedback, never host paths or private verifier files.
    await safeWorkspacePath(workspace,visible,{create:true});
    if((await fs.readdir(visible)).length)throw new Error('Feedback destination must be empty');
    for(const name of ['screenshot.png','public-win.png','public-match.png','public-test.webm']) {
      try {await fs.copyFile(path.join(out,name),path.join(visible,name));}catch(error){if(error.code!=='ENOENT')throw error;}
    }
    if(response.screenshot)response.screenshot=path.posix.join('feedback',request.id,response.screenshot);
    if(response.video)response.video=path.posix.join('feedback',request.id,response.video);
    await writeJson(path.join(visible,'result.json'),response);
    await event(folder,'tool.response',{name:'development.'+request.action,request_id:request.id,ok:response.ok,
      evidence:'generation/feedback/'+request.id+'/result.json'});
  }
  const timer=setInterval(async()=>{
    if(stopped||busy)return;busy=true;
    try {
      await safeWorkspacePath(workspace,inbox);
      for(const file of await fs.readdir(inbox)) {
        if(!file.endsWith('.json')||processed.has(file))continue;
        processed.add(file);await processRequest(file);
      }
    } catch(error) {await event(folder,'development.error',{message:String(error)});}
    finally{busy=false;}
  },100);
  return {
    submission:()=>submitted,
    async stop(){stopped=true;clearInterval(timer);while(busy)await new Promise(resolve=>setTimeout(resolve,100));},
    async freezeDraft(reason) {
      if(submitted)return submitted;
      const sha256=await snapshotGame(workspace,path.join(folder,'submitted_project'));
      submitted={at:new Date().toISOString(),reason,sha256};
      await writeJson(path.join(folder,'submission.json'),submitted);return submitted;
    }
  };
}
