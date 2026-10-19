const el=id=>document.getElementById(id);
const verdictLabels={looks_good:'试玩未发现问题',model_issue:'模型实现问题',verifier_issue:'疑似验收误判',both:'两者均有问题',uncertain:'无法判断'};
let queue=[],current=null,dirty=false,selecting=false,saving=false;
const time=value=>new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Taipei',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));

async function request(url,options){
 const response=await fetch(url,{cache:'no-store',...options});
 const value=await response.json();if(!response.ok)throw new Error(value.error||'请求失败，请稍后重试');return value;
}
function renderQueue(){
 const search=el('search').value.toLowerCase(),filter=el('queue-filter').value;
 const rows=queue.filter(r=>(r.task+' '+r.title).toLowerCase().includes(search)&&(filter==='all'||filter==='unreviewed'&&!r.review||filter==='reviewed'&&r.review||filter==='auto-fail'&&!r.successful));
 const fragment=document.createDocumentFragment();
 for(const row of rows){
  const button=document.createElement('button');button.type='button';button.className='task-item'+(current?.attempt_id===row.attempt_id?' selected':'');button.dataset.attempt=row.attempt_id;button.setAttribute('aria-pressed',String(current?.attempt_id===row.attempt_id));
  const code=document.createElement('span');code.className='task-code';code.textContent=row.task;
  const name=document.createElement('span');name.className='task-name';name.textContent=row.title;
  const meta=document.createElement('span');meta.className='task-meta';
  const auto=document.createElement('span');auto.className=row.successful?'pass':'fail';auto.textContent='自动 '+(row.successful?'通过':'未通过');
  const human=document.createElement('span');human.className='muted';human.textContent=row.review?'人审 · '+verdictLabels[row.review.verdict]:'待人审';
  meta.append(auto,human);button.append(code,name,meta);button.addEventListener('click',()=>selectAttempt(row.attempt_id));fragment.append(button);
 }
 if(!rows.length){const message=document.createElement('p');message.className='muted small';message.style.padding='12px';message.textContent='没有符合当前筛选的题目。';fragment.append(message);}
 el('task-list').replaceChildren(fragment);
}
async function refreshQueue(){
 try{
  const data=await request('/api/review/tasks');queue=data.rows.sort((a,b)=>Number(a.successful)-Number(b.successful)||a.task.localeCompare(b.task));
  el('diagnostic-notice').hidden=!data.diagnostic;
  el('available').textContent=data.available;el('review-count').textContent='已人审 '+data.reviewed+' / 可试玩 '+data.available;
  el('queue-message').textContent='共 '+data.total+' 题 · 新提交每 10 秒加入';renderQueue();
  if(!current&&!selecting&&queue.length){const initial=new URL(location.href).searchParams.get('attempt');await selectAttempt(queue.find(r=>r.attempt_id===initial)?.attempt_id??queue.find(r=>!r.review)?.attempt_id??queue[0].attempt_id);}
 }catch(error){el('queue-message').textContent='进度暂时不可用，稍后自动重试。';}
}
function populateSelect(id,checks,withDefault=false){
 const select=el(id);select.replaceChildren();
 if(withDefault){const option=new Option('默认场景','default');select.add(option);}
 for(const c of checks)select.add(new Option((c.passed?'通过 · ':'未通过 · ')+c.description,c.id));
}
async function selectAttempt(id){
 if(selecting||saving||current?.attempt_id===id)return;
 if(dirty&&!confirm('这道题的复审意见尚未保存。放弃修改并切换题目？'))return;
 selecting=true;el('queue-message').textContent='正在打开提交…';
 try{
  const value=await request('/api/review/detail?attempt='+encodeURIComponent(id));
  current=value;dirty=false;el('empty').hidden=true;el('workspace').hidden=false;
  el('task-id').textContent=value.task;el('task-title').textContent=value.title;
  const passed=value.checks.filter(c=>c.passed).length;
  el('auto-result').textContent='自动验收 '+passed+'/'+value.checks.length+' · '+(value.successful?'通过':'未通过');el('auto-result').className='badge '+(value.successful?'pass':'fail');
  el('human-result').textContent=value.review?'人审 · '+verdictLabels[value.review.current.verdict]:'尚未人工复审';
  el('draft-warning').hidden=value.model_submitted;
  el('prompt').textContent=value.prompt;
  populateSelect('game-case',value.checks,true);populateSelect('evidence-case',value.checks);
  el('evidence-case').value=value.checks.find(c=>!c.passed)?.id??value.checks[0]?.id??'';
  renderEvidence();
  const stored=value.review?.current;
  for(const key of ['playable','rules','visuals'])el(key).value=stored?.ratings[key]??'not_checked';
  el('verdict').value=stored?.verdict??'';el('notes').value=stored?.notes??'';
  el('reviewer').value=stored?.reviewer??sessionStorage.getItem('reviewer')??'';
  el('save-status').className='small muted';el('save-status').textContent=stored?'已保存 · '+time(stored.saved_at)+' · 修订 '+value.review.revision:'尚未保存';
  el('submission-id').textContent='提交 '+value.attempt_id+' · 复审绑定此提交与验收版本';
  const url=new URL(location.href);url.searchParams.set('attempt',id);history.replaceState(null,'',url);
  renderQueue();loadGame();el('queue-message').textContent='可继续选择其他题目';
 }catch(error){el('queue-message').textContent=error.message;}
 finally{selecting=false;}
}
function fitGame(){
 if(!current)return;
 const [width,height]=el('viewport').value==='mobile'?[390,844]:[1280,720];
 const stage=el('stage'),fullscreen=document.fullscreenElement===stage;
 const scale=Math.min(1,stage.clientWidth/width,fullscreen?stage.clientHeight/height:1);
 const frame=el('game-frame');frame.style.width=width+'px';frame.style.height=height+'px';
 frame.style.transform=fullscreen?'translateY(-50%) scale('+scale+')':'scale('+scale+')';
 if(!fullscreen)stage.style.height=Math.ceil(height*scale)+'px';
 el('game-size').textContent=width+' × '+height+' · '+Math.round(scale*100)+'%';
}
function loadGame(){
 if(!current)return;
 const selected=current.checks.find(c=>c.id===el('game-case').value),url=new URL(current.game_url);
 for(const [key,value]of Object.entries(selected?.query??{}))url.searchParams.set(key,String(value));
 el('game-loading').hidden=false;
 // Replace the iframe document; no injected scripts or changes to the frozen game.
 el('game-frame').src=url.href;fitGame();
}
function renderEvidence(){
 const check=current?.checks.find(c=>c.id===el('evidence-case').value);if(!check)return;
 el('check-summary').textContent=(check.passed?'通过':'未通过')+' · '+check.id+' · '+(check.duration_ms/1000).toFixed(2)+' 秒';
 el('check-summary').className=check.passed?'pass':'fail';el('check-message').textContent=check.message||'此项没有额外说明。';
 el('check-steps').textContent=check.steps?JSON.stringify(check.steps,null,2):'此场景使用程序化操作，请结合下方原始操作记录复现。';
 el('action-log').hidden=!check.evidence['actions.json'];if(check.evidence['actions.json'])el('action-log').href=check.evidence['actions.json'];
 const media=el('evidence-media');media.replaceChildren();
 if(check.evidence['final.png']){
  const label=document.createElement('p');label.className='media-title';label.textContent='验收截图 · 点击查看原图';
  const link=document.createElement('a');link.href=check.evidence['final.png'];link.target='_blank';link.rel='noopener';
  const img=document.createElement('img');img.src=link.href;img.alt=check.description+' 验收时截图';img.className='evidence-shot';img.loading='lazy';link.append(img);media.append(label,link);
 }
 if(check.evidence['gameplay.webm']){
  const label=document.createElement('p');label.className='media-title';label.textContent='验收录像';
  const video=document.createElement('video');video.src=check.evidence['gameplay.webm'];video.controls=true;video.preload='metadata';video.className='evidence-video';if(check.evidence['final.png'])video.poster=check.evidence['final.png'];video.setAttribute('aria-label',check.description+' 验收录像');media.append(label,video);
 }
}
function markDirty(){dirty=true;el('save-status').textContent='有未保存的修改';el('save-status').className='small warning';}
async function saveReview(andNext=false){
 if(!current||saving||selecting||!el('review-form').reportValidity())return;
 saving=true;el('save-review').disabled=el('save-next').disabled=true;el('save-status').textContent='正在保存…';
 try{
  const payload={attempt_id:current.attempt_id,digest:current.digest,revision:current.review?.revision??0,verdict:el('verdict').value,notes:el('notes').value,reviewer:el('reviewer').value,ratings:Object.fromEntries(['playable','rules','visuals'].map(key=>[key,el(key).value]))};
  const result=await request('/api/review/save',{method:'POST',headers:{'Content-Type':'application/json','X-Review-Token':current.csrf},body:JSON.stringify(payload)});
  current.review=result;dirty=false;sessionStorage.setItem('reviewer',payload.reviewer);
  el('human-result').textContent='人审 · '+verdictLabels[result.current.verdict];
  el('save-status').textContent='已保存到本机 · '+time(result.current.saved_at)+' · 修订 '+result.revision;el('save-status').className='small saved';
  await refreshQueue();
  saving=false;if(andNext)await nextTask();
 }catch(error){el('save-status').textContent=error.message;el('save-status').className='small error';}
 finally{saving=false;el('save-review').disabled=el('save-next').disabled=false;}
}
async function nextTask(){
 const candidates=queue.filter(r=>!r.review&&r.attempt_id!==current?.attempt_id);
 if(candidates.length)await selectAttempt(candidates[0].attempt_id);
 else{el('save-status').textContent='当前可用提交已全部复审，等待新的测评结果。';}
}
el('search').addEventListener('input',renderQueue);el('queue-filter').addEventListener('change',renderQueue);
el('game-case').addEventListener('change',loadGame);el('viewport').addEventListener('change',fitGame);el('reload-game').addEventListener('click',loadGame);
el('game-frame').addEventListener('load',()=>{el('game-loading').hidden=true;});
el('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await el('stage').requestFullscreen();}catch{el('game-size').textContent='当前浏览器不支持全屏，可使用原页面试玩。';}});
new ResizeObserver(fitGame).observe(el('stage'));document.addEventListener('fullscreenchange',fitGame);
el('evidence-case').addEventListener('change',renderEvidence);el('play-case').addEventListener('click',()=>{el('game-case').value=el('evidence-case').value;loadGame();el('stage').scrollIntoView({behavior:'smooth',block:'center'});});
for(const name of ['evidence','requirements'])el(name+'-tab').addEventListener('click',()=>{for(const other of ['evidence','requirements']){el(other+'-tab').setAttribute('aria-selected',String(other===name));el(other+'-pane').hidden=other!==name;}});
el('review-form').addEventListener('input',markDirty);el('review-form').addEventListener('change',markDirty);el('review-form').addEventListener('submit',event=>{event.preventDefault();saveReview();});
el('save-next').addEventListener('click',()=>saveReview(true));el('next-task').addEventListener('click',nextTask);
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
refreshQueue();setInterval(refreshQueue,10000);
