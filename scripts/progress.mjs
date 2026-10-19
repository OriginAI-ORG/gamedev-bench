import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT, contained, json} from '../runner/common.mjs';
import {createReviewService,safeFile} from './review-service.mjs';
import {handleReacceptance} from './reaccept-report.mjs';

export async function progressSnapshot(folder) {
  const batch = await json(path.join(folder, 'batch.json'));
  let runnerAlive = false;
  try {
    const lock = await json(path.join(folder, 'runner.lock'));
    process.kill(lock.pid, 0);
    runnerAlive = true;
  } catch {}
  const latest = new Map(batch.attempts.map(a => [a.task, a]));
  const rows = await Promise.all(batch.tasks.map(async task => {
    const attempt = latest.get(task);
    if (!attempt) return {task, state: 'pending'};
    let record = attempt;
    try { record = await json(path.join(ROOT, 'artifacts/attempts', attempt.id, 'attempt.json')); } catch {}
    let generation = record.generation ?? attempt.generation;
    if(!generation)try{generation=await json(path.join(ROOT,'artifacts/attempts',attempt.id,'generation/result.json'));}catch{}
    const active = attempt.state === 'running';
    let tools = generation?.tool_calls ?? null;
    if (active && tools === null) {
      try {
        const log = await fs.readFile(path.join(folder, attempt.id + '.log'), 'utf8');
        const calls = [...log.matchAll(/Agent tool (\d+):/g)];
        tools = calls.length ? Number(calls.at(-1)[1]) : 0;
      } catch {}
    }
    return {
      task, attempt_id: attempt.id,
      retained_reacceptance:!!attempt.retained_reacceptance,
      state: active ? (runnerAlive ? 'running' : 'interrupted') : attempt.state,
      phase: record.state,
      successful: attempt.successful === true,
      tools,
      duration_ms: generation?.duration_ms ?? (active && runnerAlive ? Date.now() - Date.parse(attempt.started_at) : null),
      acceptance: attempt.acceptance ?? record.acceptance ?? null,
      generation_status: generation?.status ?? null,
      error: record.error ?? record.submission_error ?? attempt.error ?? generation?.errors?.[0] ?? null,
      playable: !!(attempt.acceptance??record.acceptance)?.run_id
    };
  }));
  const finished = rows.filter(r => r.state === 'finished');
  const usage = {input_tokens: 0, cached_input_tokens: 0, output_tokens: 0};
  let knownUsage = 0;
  for (const attempt of batch.attempts) {
    const value = attempt.generation?.usage;
    if (!value) continue;
    knownUsage++;
    for (const key of Object.keys(usage)) usage[key] += value[key] ?? 0;
  }
  let phases = [];
  try { phases = await json(path.join(folder, 'execution-phases.json')); } catch {}
  return {
    batch: batch.id, model: batch.model, effort: batch.effort, diagnostic: batch.diagnostic===true,
    retained_reaccepted:batch.attempts.filter(a=>a.retained_reacceptance).length,
    concurrency: phases.at(-1)?.concurrency ?? batch.concurrency,
    runner_alive: runnerAlive, complete: finished.length === batch.tasks.length,
    total: batch.tasks.length, finished: finished.length,
    running: rows.filter(r => r.state === 'running').length,
    successful: finished.filter(r => r.successful).length,
    unsuccessful: finished.filter(r => !r.successful).length,
    pending: rows.filter(r => r.state === 'pending').length,
    interrupted: rows.filter(r => r.state === 'interrupted').length,
    historical_interruptions: batch.attempts.filter(a => a.state === 'interrupted').length,
    usage, attempts_with_usage: knownUsage,
    updated_at: new Date().toISOString(), rows
  };
}

const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>WebGame · 实时测评进度</title>
<style>
:root{font-family:system-ui,"Microsoft YaHei",sans-serif;color:#e9eef7;background:#101722;color-scheme:dark}
*{box-sizing:border-box}body{margin:0}main{max-width:1180px;margin:auto;padding:38px 24px}h1{font-size:30px;margin:8px 0 12px}
p{line-height:1.65}.muted{color:#a8b7cc}header{display:flex;justify-content:space-between;gap:20px;align-items:center}.badge{border:1px solid #5b7697;border-radius:24px;padding:9px 16px;white-space:nowrap}
.cards{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin:24px 0 16px}.card{background:#192536;border:1px solid #34445b;padding:18px;border-radius:12px}.card span{color:#acbdd3;font-size:14px}.card strong{display:block;font-size:32px;margin-top:6px}
progress{width:100%;height:14px;accent-color:#60c6af}.toolbar{display:flex;gap:12px;align-items:center;margin:26px 0 12px;flex-wrap:wrap}input,select,button{padding:10px 12px;border:1px solid #536780;border-radius:6px;background:#192536;color:inherit;font:inherit}input{flex:1;min-width:180px}button{cursor:pointer}button:hover{background:#2b3c52}input:focus-visible,select:focus-visible,button:focus-visible{outline:2px solid #7ce3cb;outline-offset:3px}
.table{overflow:auto;border:1px solid #34445b;border-radius:10px}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:13px 15px;border-bottom:1px solid #2d3b50;white-space:nowrap}th{background:#192536;color:#b5c6dc}td:first-child{font-family:ui-monospace,monospace}.running{color:#83d9ff}.pass{color:#7ce3b6}.fail{color:#ffc28f}.interrupted{color:#ffd480}#connection{min-height:24px}.notice{border-left:3px solid #6486b4;padding-left:14px}.small{font-size:13px}
@media(max-width:780px){.cards{grid-template-columns:repeat(3,1fr)}header{display:block}.badge{display:inline-block}main{padding:24px 14px}h1{font-size:25px}.card{padding:12px}.card strong{font-size:27px}}
</style></head><body><main>
<header><div><div class="muted small">WEBGAME BENCHMARK · 本机测评</div><h1>第一轮模型测评进度</h1><div id="model" class="muted">正在读取…</div></div><div><a href="/review" style="color:#7ce3cb;display:block;margin-bottom:12px">打开人工复审 · 试玩游戏 →</a><a href="/reaccept" style="color:#7ce3cb;display:block;margin-bottom:12px">原提交重验 · 新旧成绩对比 →</a><div id="status" class="badge" role="status">连接中</div></div></header>
<div class="cards">
<div class="card"><span>已完成 / 总题数</span><strong id="finished">—</strong></div>
<div class="card"><span>正在运行</span><strong id="running">—</strong></div>
<div class="card"><span>通过</span><strong id="successful">—</strong></div>
<div class="card"><span>未通过</span><strong id="unsuccessful">—</strong></div>
<div class="card"><span>尚未开始</span><strong id="pending">—</strong></div>
<div class="card"><span>中断待重试</span><strong id="interrupted">—</strong></div>
</div><progress id="bar" aria-label="已完成题目比例" max="228" value="0"></progress>
<p id="usage" class="muted">用量读取中…</p>
<p class="notice small muted">每 5 秒自动刷新。可进入人工复审试玩并记录意见，原始成绩在重验对比页保留。执行中的 token 消耗可能尚未计入。</p>
<p id="retained" class="notice small" hidden></p>
<p id="diagnostic" class="notice small" hidden>诊断续跑：运行器已修复，保留此前结果。当前批次包含不同运行器版本，仅用于试玩与问题排查，不作为正式当前版本基线。</p>
<div class="toolbar"><input id="search" aria-label="搜索题号" placeholder="搜索题号，如 og-web-0011"><select id="filter" aria-label="筛选状态"><option value="all">全部题目</option><option value="running">正在运行</option><option value="finished">已完成</option><option value="pass">通过</option><option value="fail">未通过</option><option value="pending">尚未开始</option><option value="interrupted">中断待重试</option></select><button id="refresh">立即刷新</button></div>
<div id="connection" class="muted small" aria-live="polite"></div>
<div class="table"><table><thead><tr><th>题号</th><th>状态</th><th>阶段</th><th>已观察工具调用</th><th>开发用时</th><th>验收检查</th><th>人工复审</th></tr></thead><tbody id="rows"></tbody></table></div>
<p id="batch" class="muted small"></p>
</main><script>
const el=id=>document.getElementById(id), nf=new Intl.NumberFormat('zh-CN');
let data=null, busy=false;
const labels={running:'正在运行',finished:'已完成',pending:'尚未开始',interrupted:'中断待重试'};
const phases={prepared:'准备环境',running:'模型开发',submitted:'已提交',verifying:'正在验收',finished:'验收结束',interrupted:'基础设施中断',error:'执行异常'};
function renderRows(){
 if(!data)return;
 const query=el('search').value.toLowerCase(), filter=el('filter').value;
 const rank={running:0,interrupted:1,finished:2,pending:3};
 const selected=data.rows.filter(r=>r.task.toLowerCase().includes(query)&&(filter==='all'||filter===r.state||filter==='pass'&&r.state==='finished'&&r.successful||filter==='fail'&&r.state==='finished'&&!r.successful)).sort((a,b)=>(rank[a.state]??4)-(rank[b.state]??4)||a.task.localeCompare(b.task));
 const fragment=document.createDocumentFragment();
 for(const r of selected){
  const tr=document.createElement('tr'), state=r.state==='finished'?(r.successful?'通过':'未通过'):(labels[r.state]??r.state);
  const seconds=r.duration_ms===null||r.duration_ms===undefined?null:Math.floor(r.duration_ms/1000);
  const values=[r.task,state,r.retained_reacceptance?'保留重验结果':r.state==='pending'?'—':(phases[r.phase]??'等待记录'),r.tools??'—',seconds===null?'—':Math.floor(seconds/60)+'分 '+seconds%60+'秒',r.acceptance?r.acceptance.passed_checks+'/'+r.acceptance.total_checks:'—'];
  values.forEach((value,i)=>{const td=document.createElement('td');td.textContent=value;if(i===1)td.className=r.state==='finished'?(r.successful?'pass':'fail'):r.state;if(i===2&&r.error){td.title=r.error;const note=document.createElement('div');note.className='small muted';note.style.whiteSpace='normal';note.style.maxWidth='360px';note.textContent=r.error;td.append(note);}tr.append(td)});
  const review=document.createElement('td');if(r.state==='finished'&&r.playable){const link=document.createElement('a');link.href='/review?attempt='+encodeURIComponent(r.attempt_id);link.textContent='试玩与复审 →';link.style.color='#7ce3cb';review.append(link);}else review.textContent=r.state==='finished'?'无可试玩提交':'完成后可试玩';tr.append(review);fragment.append(tr);
 }
 el('rows').replaceChildren(fragment);
}
async function refresh(){
 if(busy)return;busy=true;
 try{
  const response=await fetch('/status',{cache:'no-store'});if(!response.ok)throw new Error('unavailable');data=await response.json();
  el('model').textContent=data.model+' · '+data.effort+' · '+data.concurrency+' 并发';
  el('diagnostic').hidden=!data.diagnostic;
  el('retained').hidden=!data.retained_reaccepted;
  el('retained').textContent='已保留 '+data.retained_reaccepted+' 题的修正后验收结果；这些题不会重新调用模型，后续题目使用同版修正验收器。用量累计包含此前尝试。';
  el('status').textContent=data.complete?'本轮完成':data.runner_alive?'测评运行中':'测评已停止，可从断点恢复';
  el('finished').textContent=data.finished+'/'+data.total;
  for(const key of ['running','successful','unsuccessful','pending','interrupted'])el(key).textContent=data[key];
  el('bar').max=data.total;el('bar').value=data.finished;
  el('usage').textContent='已记录输入 '+nf.format(data.usage.input_tokens)+' tokens（含缓存 '+nf.format(data.usage.cached_input_tokens)+'） · 输出 '+nf.format(data.usage.output_tokens)+' · '+data.attempts_with_usage+' 次尝试返回用量';
  el('connection').textContent='更新于 '+new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(data.updated_at))+'（台北时间）';
  el('batch').textContent='批次 '+data.batch+' · 历史基础设施中断 '+data.historical_interruptions+' 次（保留记录）';
  renderRows();
 }catch{el('connection').textContent='暂时无法读取新进度，保留上次结果，5 秒后重试。';}finally{busy=false;}
}
el('refresh').addEventListener('click',refresh);el('search').addEventListener('input',renderRows);el('filter').addEventListener('change',renderRows);
refresh();setInterval(refresh,5000);
</script></body></html>`;

export async function startProgressServer({folder,port=8081,root=ROOT}) {
  const base = path.join(root, 'artifacts/batches');
  if (!contained(base, folder) || folder === base) throw new Error('Provide a directory inside artifacts/batches');
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid port');
  await progressSnapshot(folder);
  let origin;
  const review=await createReviewService({folder,root,uiOrigin:()=>origin});
  const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; frame-src "+review.gameOrigin+"; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
    const url=new URL(req.url,'http://127.0.0.1');
    if(url.pathname==='/reaccept'||url.pathname==='/api/reaccept/result'||url.pathname.startsWith('/reaccept-evidence/')){await handleReacceptance(req,res,url,{root,folder});return;}
    if(url.pathname.startsWith('/api/review/')){res.setHeader('Content-Type','application/json; charset=utf-8');await review.handle(req,res,url);return;}
    if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
    const route = url.pathname;
    if (route === '/') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); return; }
    if(route==='/review'||route.startsWith('/review-assets/')){
      const name=route==='/review'?'index.html':route.slice('/review-assets/'.length);
      if(!['index.html','review.js','review.css'].includes(name)){res.writeHead(404);res.end();return;}
      try{const file=await safeFile(path.join(ROOT,'scripts/review-ui'),[name]);res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8');res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end();}return;
    }
    if (route !== '/status') { res.writeHead(404); res.end(); return; }
    try {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(await progressSnapshot(folder)));
    } catch { res.writeHead(503); res.end('{"error":"Snapshot temporarily unavailable"}'); }
  });
  try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});}catch(error){await review.close();throw error;}
  origin='http://127.0.0.1:'+server.address().port;
  return {url:origin,close:async()=>{server.closeAllConnections();await Promise.all([new Promise(resolve=>server.close(resolve)),review.close()]);}};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const service=await startProgressServer({folder:path.resolve(process.argv[2]??''),port:Number(process.argv[3]??8081)});
  console.log('Live progress: '+service.url+'/\nHuman review: '+service.url+'/review');
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>service.close().then(()=>process.exit(0)));
}
