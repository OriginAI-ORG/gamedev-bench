import fs from 'node:fs/promises';
import path from 'node:path';
import {json,escapeHtml as e} from '../runner/common.mjs';
import {safeFile} from './review-service.mjs';

export async function reacceptanceResults(root,batchId,sourceBatchId=null){
 const base=path.join(root,'artifacts/reevaluations');let dirs;
 try{dirs=await fs.readdir(base,{withFileTypes:true});}catch(error){if(error.code==='ENOENT')return [];throw error;}
 const results=[];
 for(const dir of dirs.filter(d=>d.isDirectory()&&/^reaccept-[\w-]+$/.test(d.name))){
  try{const r=await json(await safeFile(base,[dir.name,'results.json']));if((r.batch_id===batchId||r.batch_id===sourceBatchId)&&r.id===dir.name)results.push(r);}catch(error){if(error.code!=='ENOENT'&&!(error instanceof SyntaxError))throw error;}
 }
 return results.sort((a,b)=>b.created_at.localeCompare(a.created_at));
}

export function renderReacceptance(results,chosen){
 const r=results.find(x=>x.id===chosen)??results[0];
 const status=value=>value?'<strong class="pass">通过</strong>':'<strong class="fail">未通过</strong>';
 const evidence=(item,version)=>{
  const run=item[version==='old'?'original_run_id':'revised_run_id'],checks=item[version==='old'?'original_checks':'revised_checks']??[];
  return '<details><summary>'+checks.filter(c=>c.passed).length+'/'+checks.length+' 项检查 · 展开证据</summary>'+checks.map(c=>{
   const base='/reaccept-evidence/'+[r.id,run,c.id].map(encodeURIComponent).join('/')+'/';
   return '<p><b>'+e(c.id)+'</b> '+status(c.passed)+'</p><pre>'+e(c.message??'')+'</pre>'+(c.evidence?'<p><a target="_blank" rel="noopener" href="'+base+'final.png">截图</a> · <a target="_blank" rel="noopener" href="'+base+'gameplay.webm">录像</a> · <a target="_blank" rel="noopener" href="'+base+'actions.json">操作</a></p>':'');
  }).join('')+'</details>';
 };
 return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WebGame · 重验对比</title><style>body{font:15px/1.65 system-ui;background:#101724;color:#e5edf8;max-width:1400px;margin:32px auto;padding:20px}a{color:#7ce3cb}h1{margin:18px 0 8px}.muted{color:#acc0d7}.notice{padding:18px;background:#203149;border-radius:12px}.pass{color:#7ce3cb}.fail{color:#ffb0a7}table{border-collapse:collapse;width:100%;margin-top:24px}th,td{text-align:left;border-bottom:1px solid #36445b;padding:14px;vertical-align:top}td:first-child{max-width:260px;overflow-wrap:anywhere}td:not(:first-child){width:34%}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;max-height:240px;overflow:auto}summary{cursor:pointer;margin-top:8px}nav{display:flex;gap:20px;flex-wrap:wrap}@media(max-width:700px){body{padding:10px}td,th{padding:7px}table{font-size:12px}}</style><nav><a href="/">测评进度</a><a href="/review">人工复审与试玩</a><a href="/reaccept">刷新最新重验</a></nav><h1>原提交重验 · 新旧成绩对比</h1><p class="muted">原始成绩保留。这里仅用现有提交运行修正后的验收，不新增被测模型调用。</p>'+(r?'<div class="notice"><b>'+r.items.length+' 份已重验 · 原通过 '+r.items.filter(i=>i.original_functional_pass).length+' → 修正后通过 '+r.items.filter(i=>i.revised_functional_pass).length+'</b><p>状态：'+(r.status==='complete'?'全部完成':'进行中，请刷新查看')+'。原批次为诊断批次；此次重验不构成新的正式模型基线，也不代表人工复审通过。</p><p>原提交和成绩完整性：'+(r.original_evidence_unchanged?'全部哈希校验通过':'逐项校验中')+'。审阅方式：AI 技术复核。</p><small>'+e(r.id)+'</small></div><table><thead><tr><th>题目 / 原提交</th><th>原始验收</th><th>修正后验收</th></tr></thead><tbody>'+r.items.map(i=>'<tr><td>'+e(i.task)+'<br><a href="/review?attempt='+encodeURIComponent(i.attempt_id)+'">试玩与人工复审 →</a></td><td>'+status(i.original_functional_pass)+evidence(i,'old')+'</td><td>'+status(i.revised_functional_pass)+evidence(i,'new')+'</td></tr>').join('')+'</tbody></table><p><a href="/api/reaccept/result?round='+encodeURIComponent(r.id)+'">下载完整 JSON 对比记录</a></p>':'<p>还没有重验结果。</p>')+(results.length>1?'<details><summary>此前重验记录</summary>'+results.map(x=>'<p><a href="/reaccept?round='+encodeURIComponent(x.id)+'">'+e(x.id)+'</a></p>').join('')+'</details>':'')+'</html>';
}

export async function handleReacceptance(req,res,url,{root,folder}){
 try{
  if(req.method!=='GET'){res.writeHead(405);res.end();return;}
  const batch=await json(path.join(folder,'batch.json')),results=await reacceptanceResults(root,batch.id,batch.reacceptance?.source_batch_id);
  if(url.pathname==='/reaccept'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(renderReacceptance(results,url.searchParams.get('round')));return;}
  if(url.pathname==='/api/reaccept/result'){
   const r=results.find(x=>x.id===url.searchParams.get('round'))??(!url.searchParams.has('round')?results[0]:null);
   if(!r){res.writeHead(404);res.end();return;}res.setHeader('Content-Type','application/json');res.end(JSON.stringify(r));return;
  }
  const parts=url.pathname.slice('/reaccept-evidence/'.length).split('/').map(decodeURIComponent);
  if(parts.length!==4||!['final.png','gameplay.webm','actions.json','runtime-errors.json'].includes(parts[3])){res.writeHead(404);res.end();return;}
  const [round,run,check,name]=parts,r=results.find(x=>x.id===round),item=r?.items.find(i=>i.original_run_id===run||i.revised_run_id===run);
  const original=batch.attempts.find(a=>a.id===item?.attempt_id);
  const boundRun=r?.batch_id===batch.id?original?.acceptance?.run_id:original?.retained_reacceptance?.original_acceptance?.run_id;
  if(!item||boundRun!==item.original_run_id){res.writeHead(404);res.end();return;}
  const checks=item[run===item.original_run_id?'original_checks':'revised_checks'];
  if(!checks.some(c=>c.id===check&&c.evidence==='evidence/'+check+'/')){res.writeHead(404);res.end();return;}
  const file=await safeFile(path.join(root,'artifacts/runs'),[run,'evidence',check,name]);
  res.setHeader('Content-Type',name.endsWith('.png')?'image/png':name.endsWith('.webm')?'video/webm':'application/json');res.end(await fs.readFile(file));
 }catch(error){res.writeHead(error.status??(error.code==='ENOENT'?404:500));res.end('无法读取重验记录');}
}
