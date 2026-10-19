import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT,json,writeJson,escapeHtml as e } from './common.mjs';

export async function report() {
  const base = path.join(ROOT,'artifacts','runs');
  await fs.mkdir(base,{recursive:true});
  const runs = [];
  for(const entry of await fs.readdir(base,{withFileTypes:true})) {
    if(!entry.isDirectory()) continue;
    try { runs.push(await json(path.join(base,entry.name,'verdict.json'))); } catch {}
  }
  runs.sort((a,b)=>a.started_at.localeCompare(b.started_at));
  const attempts=[];
  const attemptsPath=path.join(ROOT,'artifacts','attempts');
  await fs.mkdir(attemptsPath,{recursive:true});
  for(const entry of await fs.readdir(attemptsPath,{withFileTypes:true})) {
    if(entry.isDirectory())try{attempts.push(await json(path.join(attemptsPath,entry.name,'attempt.json')));}catch{}
  }
  const modelAttempts=attempts.filter(a=>a.generation);
  const summary={total_acceptance_runs:runs.length,passed:runs.filter(r=>r.functional_pass).length,infrastructure_errors:runs.filter(r=>r.status==='infrastructure-error').length,
    model_development_attempts:modelAttempts.length,formal_model_attempts:modelAttempts.filter(a=>a.formal_eligible).length};
  await writeJson(path.join(ROOT,'artifacts','summary.json'),{...summary,attempts:modelAttempts.map(a=>({id:a.attempt_id,task:a.task_id,generation:a.generation.status,acceptance:a.acceptance})),runs:runs.map(r=>({id:r.run_id,task:r.task,status:r.status,classification:r.classification,expected:r.expected}))});
  const agentRows=attempts.map(a=>{
    const f='attempts/'+encodeURIComponent(a.attempt_id)+'/';
    return '<article><h2>模型开发 · '+e(a.task_id)+' · '+e(a.state)+'</h2><p>'+e(a.attempt_id)+'</p><p>模型 '+e(a.generation?.model??'尚未运行')+' · 工具调用 '+e(a.generation?.tool_calls??0)+' · 代码版本 '+e(a.generation?.revisions??0)+' · 验收 '+e(a.acceptance?.status??'未验收')+'</p><p><a href="'+f+'attempt.json">完整记录与授权状态</a> · <a href="'+f+'lifecycle.jsonl">生命周期与反馈</a>'+(a.generation?' · <a href="'+f+'generation/trajectory.jsonl">模型操作轨迹</a> · <a href="'+f+'submitted_project/index.html">最终游戏</a>':'')+'</p><p>训练导出：'+(a.rights.training_export_allowed?'已记录授权':'未授权，禁止导出')+' · 正式盲测资格：'+(a.formal_eligible?'已验证':'未验证')+'</p></article>';
  }).join('');
  const rows=runs.map(r=>{
    const folder='runs/'+encodeURIComponent(r.run_id)+'/';
    const testList=r.checks.map(c=>'<li><strong>'+e(c.passed?'通过':'失败')+' · '+e(c.id)+'</strong><p>'+e(c.message)+'</p>'+
      (c.evidence?'<a href="'+folder+e(c.evidence)+'final.png">截图</a> · <a href="'+folder+e(c.evidence)+'gameplay.webm">录像</a> · <a href="'+folder+e(c.evidence)+'actions.json">操作记录</a>':'')+'</li>').join('');
    return '<article><header><h2>'+e(r.task)+' / '+e(r.run_id)+'</h2><span class="'+(r.functional_pass?'pass':'fail')+'">'+e(r.status)+'</span></header><p>'+e(r.classification)+' · '+(r.duration_ms/1000).toFixed(1)+'s · 预期 '+e(r.expected??'未指定')+'</p><p><a href="'+folder+'verdict.json">逐项结果</a> · <a href="'+folder+'submitted_project/index.html">查看提交游戏</a> · <a href="'+folder+'reward.json">Analog 格式</a> · <a href="'+folder+'breakdown.json">GameCraft 格式</a> · <a href="'+folder+'origin-validation.json">GameDev 格式</a></p><details><summary>检查与证据（'+r.checks.filter(c=>c.passed).length+'/'+r.checks.length+'）</summary><ul>'+testList+'</ul></details></article>';
  }).join('');
  const html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>webgame-benchmark · WebGame 试点</title><style>body{margin:0;background:#f3f5f7;color:#172b3c;font:15px system-ui;line-height:1.6}main{max-width:1100px;margin:auto;padding:36px 24px}h1{font-size:34px;margin-bottom:8px}.cards{display:flex;gap:16px;flex-wrap:wrap}.cards p,article{background:white;border:1px solid #d8e1e7;border-radius:10px;padding:20px}.cards strong{display:block;font-size:32px}.cards p{min-width:170px}article{margin:16px 0}header{display:flex;align-items:center;justify-content:space-between;gap:15px}h2{font-size:16px;overflow-wrap:anywhere}.pass{color:#146340}.fail{color:#9e3b2d}a{color:#16629b}li{margin:16px 0}li p{white-space:pre-wrap;overflow-wrap:anywhere}summary{cursor:pointer}aside{border-left:4px solid #cf8c34;padding:8px 20px;background:#fff9ed}</style><main><p>WEBGAME-BENCHMARK / V1 CANDIDATE</p><h1>webgame-benchmark · WebGame</h1><p>模型开发 · 公开反馈与修改 · 冻结提交 · 独立验收 · 授权记录</p><div class="cards"><p>验收运行<strong>'+summary.total_acceptance_runs+'</strong></p><p>功能通过<strong>'+summary.passed+'</strong></p><p>基础设施故障<strong>'+summary.infrastructure_errors+'</strong></p><p>模型开发尝试<strong>'+summary.model_development_attempts+'</strong></p><p>正式模型尝试<strong>'+summary.formal_model_attempts+'</strong></p></div><aside>模型开发尝试与验收器自检分开统计。每次模型尝试单独记录系统读取隔离证据；题库人工审核与完整基线由最终发布检查负责。Token 只采用模型工具实测值，费用不作推算。轨迹训练与分发授权未确认。当前版本仅声明本地运行。</aside><h2>模型任务</h2>'+agentRows+'<h2>独立验收</h2>'+rows+'</main></html>';
  const target=path.join(ROOT,'artifacts','index.html'); await fs.writeFile(target,html); return target;
}
