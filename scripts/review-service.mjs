import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {randomBytes,createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {ROOT,contained,json,hashes} from '../runner/common.mjs';

const VERDICTS = new Set(['looks_good','model_issue','verifier_issue','both','uncertain']);
const RATINGS = new Set(['not_checked','pass','fail']);
const TYPES = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.gif':'image/gif','.webm':'video/webm','.mp3':'audio/mpeg','.wav':'audio/wav','.ogg':'audio/ogg','.woff2':'font/woff2'};
const fail=(status,message)=>Object.assign(new Error(message),{status});
const stripAnsi=value=>String(value??'').replace(/\u001b\[[0-9;]*m/g,'');

export async function safeFile(root,parts) {
  if(parts.some(p=>!p||p==='.'||p==='..'||p.startsWith('.')||/[\\/:\0]/.test(p)))throw fail(403,'Invalid file path');
  const realRoot=await fs.realpath(root),file=await fs.realpath(path.join(realRoot,...parts));
  if(!contained(realRoot,file)||!(await fs.stat(file)).isFile())throw fail(403,'File outside allowed directory');
  return file;
}

async function sendFile(req,res,file,contentType) {
  const body=await fs.readFile(file);
  res.setHeader('Content-Type',contentType??TYPES[path.extname(file)]??'application/octet-stream');
  res.setHeader('Accept-Ranges','bytes');
  if(req.headers.range){
    const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
    const start=match?Number(match[1]):-1,end=match&&match[2]?Math.min(Number(match[2]),body.length-1):body.length-1;
    if(!match||start<0||start>=body.length||end<start){res.writeHead(416,{'Content-Range':'bytes */'+body.length});res.end();return;}
    res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${body.length}`,'Content-Length':end-start+1});
    res.end(req.method==='HEAD'?undefined:body.subarray(start,end+1));
  }else{res.setHeader('Content-Length',body.length);res.end(req.method==='HEAD'?undefined:body);}
}

export async function createReviewService({folder,root=ROOT,uiOrigin,gamePort=0}) {
  const csrf=randomBytes(24).toString('hex'),metaCache=new Map(),queues=new Map();
  const readBatch=()=>json(path.join(folder,'batch.json'));
  const reviewPath=id=>path.join(folder,'human-reviews',id+'.json');
  async function eligible(id){
    if(!/^attempt-[a-zA-Z0-9_-]+$/.test(id))throw fail(400,'Invalid attempt');
    const batch=await readBatch(),attempt=batch.attempts.find(a=>a.id===id);
    if(!attempt||attempt.state!=='finished'||!attempt.acceptance?.run_id)throw fail(404,'Only completed attempts with a frozen playable submission can be reviewed');
    const project=path.join(root,'artifacts/attempts',id,'submitted_project');
    await safeFile(project,['index.html']);
    return {batch,attempt,project};
  }
  async function saved(id){
    try{return await json(reviewPath(id));}catch(error){if(error.code==='ENOENT')return null;throw error;}
  }
  async function metadata(task){
    if(!metaCache.has(task))metaCache.set(task,await json(path.join(root,'tasks',task,'task.json')));
    return metaCache.get(task);
  }
  async function identity(attempt){
    const verdict=await json(path.join(root,'artifacts/runs',attempt.acceptance.run_id,'verdict.json'));
    const binding={attempt_id:attempt.id,run_id:attempt.acceptance.run_id,task_sha256:attempt.task_version_sha256,submission_sha256:verdict.submission_sha256};
    if(!binding.submission_sha256||!Object.keys(binding.submission_sha256).length)throw fail(409,'Submission hashes unavailable');
    const actual=await hashes(path.join(root,'artifacts/attempts',attempt.id,'submitted_project'));
    if(JSON.stringify(actual)!==JSON.stringify(binding.submission_sha256))throw fail(409,'提交文件与验收时版本不一致，不能记录为同一版本的复审。');
    return {verdict,binding,digest:createHash('sha256').update(JSON.stringify(binding)).digest('hex')};
  }
  const gameServer=http.createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Access-Control-Allow-Origin','*');
    try{
      if(!['GET','HEAD'].includes(req.method))throw fail(405,'Read only');
      const url=new URL(req.url,'http://127.0.0.1'),parts=url.pathname.split('/').slice(1).map(decodeURIComponent);
      if(parts.shift()!=='play')throw fail(404,'Not found');
      const attemptId=parts.shift(),{project}=await eligible(attemptId);
      if(parts.at(-1)==='')parts[parts.length-1]='index.html';
      const origin='http://127.0.0.1:'+gameServer.address().port;
      const packageOrigin=origin+'/play/'+encodeURIComponent(attemptId)+'/';
      res.setHeader('Content-Security-Policy',`sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline' ${packageOrigin}; style-src 'unsafe-inline' ${packageOrigin}; img-src ${packageOrigin} data: blob:; font-src ${packageOrigin} data:; media-src ${packageOrigin} data: blob:; connect-src ${packageOrigin}; worker-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors ${uiOrigin()}`);
      await sendFile(req,res,await safeFile(project,parts));
    }catch(error){res.writeHead(error.status??404);res.end('Game unavailable');}
  });
  await new Promise((resolve,reject)=>{gameServer.once('error',reject);gameServer.listen(gamePort,'127.0.0.1',resolve);});
  const gameOrigin='http://127.0.0.1:'+gameServer.address().port;

  async function tasks(){
    const batch=await readBatch(),latest=[...new Map(batch.attempts.map(a=>[a.task,a])).values()];
    const rows=await Promise.all(latest.filter(a=>a.state==='finished'&&a.acceptance?.run_id).map(async a=>{
      const spec=await metadata(a.task),review=await saved(a.id);
      return {task:a.task,title:spec.title,attempt_id:a.id,successful:a.successful,model_submitted:a.model_submitted===true,acceptance:a.acceptance,review:review?{revision:review.revision,verdict:review.current.verdict,reviewer:review.current.reviewer,saved_at:review.current.saved_at}:null};
    }));
    return {batch:batch.id,diagnostic:batch.diagnostic===true,total:batch.tasks.length,available:rows.length,reviewed:rows.filter(r=>r.review).length,rows};
  }
  async function detail(id){
    const {attempt}=await eligible(id),{verdict,binding,digest}=await identity(attempt);
    const publicRoot=path.join(root,'artifacts/attempts',id,'workspace');
    const spec=await json(path.join(publicRoot,'task.json')),prompt=await fs.readFile(path.join(publicRoot,'instruction.md'),'utf8');
    if(createHash('sha256').update(prompt).digest('hex')!==attempt.task_version_sha256['prompt.md'])throw fail(409,'原始题目快照已变化，请先检查记录。');
    const verifierFile=path.join(root,'tasks',attempt.task,'verifier/scenarios.mjs');
    const sameVerifier=createHash('sha256').update(await fs.readFile(verifierFile)).digest('hex')===attempt.task_version_sha256['verifier/scenarios.mjs'];
    const verifier=sameVerifier?await import(pathToFileURL(verifierFile)):{scenarios:[]};
    const checks=await Promise.all(verdict.checks.map(async c=>{
      const scenario=verifier.scenarios.find(s=>s.id===c.id),evidence={};
      for(const file of ['final.png','gameplay.webm','actions.json']){
        if(!c.evidence)continue;
        const evidenceRoot=path.join(root,'artifacts/runs',verdict.run_id),parts=c.evidence.split('/').filter(Boolean).concat(file);
        try{await safeFile(evidenceRoot,parts);evidence[file]='/api/review/evidence/'+encodeURIComponent(id)+'/'+encodeURIComponent(c.id)+'/'+file;}catch{}
      }
      let recordedQuery={};
      if(evidence['actions.json'])try{const actions=await json(await safeFile(path.join(root,'artifacts/runs',verdict.run_id),c.evidence.split('/').filter(Boolean).concat('actions.json')));recordedQuery=actions.find(a=>a.action==='load')?.query??{};}catch{}
      return {id:c.id,description:scenario?.description??c.id,passed:c.passed,message:stripAnsi(c.message),duration_ms:c.duration_ms,query:scenario?.query??recordedQuery,steps:scenario?.steps??null,evidence};
    }));
    return {attempt_id:id,task:attempt.task,title:spec.title,prompt,model_submitted:attempt.model_submitted===true,
      generation_status:attempt.generation?.status,successful:attempt.successful,checks,binding,digest,
      game_url:gameOrigin+'/play/'+encodeURIComponent(id)+'/',review:await saved(id),csrf};
  }
  async function save(id,payload){
    const previous=queues.get(id)??Promise.resolve();
    const operation=previous.catch(()=>{}).then(async()=>{
      const {attempt}=await eligible(id),{binding,digest}=await identity(attempt),old=await saved(id);
      if(payload.digest!==digest)throw fail(409,'提交版本已变化，请重新打开后复审。');
      if(payload.revision!==(old?.revision??0))throw fail(409,'此复审已在其他页面更新，请重新打开后再保存。');
      if(!VERDICTS.has(payload.verdict))throw fail(400,'请选择复审结论。');
      if(typeof payload.notes!=='string'||payload.notes.length>6000||typeof payload.reviewer!=='string'||payload.reviewer.length>80)throw fail(400,'复审内容过长。');
      const ratings={};for(const key of ['playable','rules','visuals']){if(!RATINGS.has(payload.ratings?.[key]))throw fail(400,'Invalid rating');ratings[key]=payload.ratings[key];}
      const entry={saved_at:new Date().toISOString(),reviewer:payload.reviewer.trim()||'本机复审者',review_type:'human-review',verdict:payload.verdict,ratings,notes:payload.notes.trim()};
      const record={schema_version:1,batch_id:(await readBatch()).id,task:attempt.task,attempt_id:id,binding,digest,revision:(old?.revision??0)+1,current:entry,history:[...(old?.history??[]),entry],score_effect:'Annotation only; original automated scores are unchanged.'};
      await fs.mkdir(path.dirname(reviewPath(id)),{recursive:true});
      const temp=reviewPath(id)+'.'+randomBytes(8).toString('hex')+'.tmp';
      try{await fs.writeFile(temp,JSON.stringify(record,null,2)+'\n',{flag:'wx'});await fs.rename(temp,reviewPath(id));}finally{await fs.rm(temp,{force:true});}
      return record;
    });
    queues.set(id,operation);try{return await operation;}finally{if(queues.get(id)===operation)queues.delete(id);}
  }
  async function handle(req,res,url){
    if(!url.pathname.startsWith('/api/review/'))return false;
    try{
      if(req.headers.origin&&req.headers.origin!==uiOrigin())throw fail(403,'Origin denied');
      if(req.method==='GET'&&url.pathname==='/api/review/tasks')res.end(JSON.stringify(await tasks()));
      else if(req.method==='GET'&&url.pathname==='/api/review/detail')res.end(JSON.stringify(await detail(url.searchParams.get('attempt'))));
      else if(req.method==='GET'&&url.pathname.startsWith('/api/review/evidence/')){
        const parts=url.pathname.slice('/api/review/evidence/'.length).split('/').map(decodeURIComponent);
        if(parts.length!==3||!['final.png','gameplay.webm','actions.json'].includes(parts[2]))throw fail(404,'Evidence not found');
        const {attempt}=await eligible(parts[0]),{verdict}=await identity(attempt),check=verdict.checks.find(c=>c.id===parts[1]);
        if(!check?.evidence)throw fail(404,'Evidence not found');
        const file=await safeFile(path.join(root,'artifacts/runs',verdict.run_id),check.evidence.split('/').filter(Boolean).concat(parts[2]));
        await sendFile(req,res,file);
      }else if(req.method==='POST'&&url.pathname==='/api/review/save'){
        if(req.headers.origin!==uiOrigin()||req.headers['x-review-token']!==csrf)throw fail(403,'Review token required');
        if(!(req.headers['content-type']??'').startsWith('application/json'))throw fail(415,'JSON required');
        const chunks=[];let bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>32768)throw fail(413,'Review too large');chunks.push(chunk);}
        let payload;try{payload=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw fail(400,'Invalid JSON');}
        res.end(JSON.stringify(await save(payload.attempt_id,payload)));
      }else throw fail(405,'Unsupported request');
    }catch(error){if(!res.headersSent)res.writeHead(error.status??500);res.end(JSON.stringify({error:error.status?error.message:'暂时无法读取或保存，请稍后重试。'}));}
    return true;
  }
  return {handle,gameOrigin,close:()=>new Promise(resolve=>{gameServer.closeAllConnections();gameServer.close(resolve);})};
}
