import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {reviewFixture} from './helpers/review-fixture.mjs';
import {launchBrowser} from '../environments/verification/browser.mjs';

test('human reviews preserve revisions and reject stale or unbound writes',async()=>{
  const f=await reviewFixture();
  try{
    const before=await fs.readFile(path.join(f.folder,'batch.json'),'utf8');
    const detail=await (await fetch(f.service.url+'/api/review/detail?attempt='+f.id)).json();
    const post=(payload,headers={})=>fetch(f.service.url+'/api/review/save',{method:'POST',headers:{Origin:f.service.url,'Content-Type':'application/json','X-Review-Token':detail.csrf,...headers},body:JSON.stringify(payload)});
    const invalid=await post({...f.payload(detail),verdict:'fabricated'});assert.equal(invalid.status,400);
    assert.equal((await post({...f.payload(detail),digest:'wrong'})).status,409);
    const first=await post(f.payload(detail));assert.equal(first.status,200);const saved=await first.json();assert.equal(saved.revision,1);assert.equal(saved.current.review_type,'human-review');
    assert.equal((await post(f.payload(detail))).status,409,'stale page must not overwrite review');
    const next=await post({...f.payload(detail),revision:1,verdict:'model_issue'});assert.equal(next.status,200);const updated=await next.json();assert.equal(updated.history.length,2);assert.equal(updated.history[0].verdict,'verifier_issue');
    const list=await (await fetch(f.service.url+'/api/review/tasks')).json();assert.equal(list.reviewed,1);assert.equal(list.rows[0].review.verdict,'model_issue');
    assert.equal(await fs.readFile(path.join(f.folder,'batch.json'),'utf8'),before,'human review must not change automatic scores');
    await fs.appendFile(path.join(f.root,'artifacts/attempts',f.id,'submitted_project/index.html'),'changed');
    assert.equal((await post({...f.payload(detail),revision:2})).status,409,'changed game cannot reuse a frozen submission identity');
  }finally{await f.close();}
});

test('review writes require same-origin token; playable files and evidence stay scoped',async()=>{
  const f=await reviewFixture();
  try{
    const detail=await (await fetch(f.service.url+'/api/review/detail?attempt='+f.id)).json();
    const post=headers=>fetch(f.service.url+'/api/review/save',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(f.payload(detail))});
    assert.equal((await post({Origin:'null','X-Review-Token':detail.csrf})).status,403);
    assert.equal((await post({Origin:f.service.url})).status,403);
    assert.equal((await fetch(f.service.url+'/api/review/detail?attempt=attempt-not-in-batch')).status,404);
    const game=await fetch(detail.game_url);assert.equal(game.status,200);assert.match(game.headers.get('content-security-policy'),/sandbox allow-scripts;/);assert.ok(game.headers.get('content-security-policy').includes('connect-src '+detail.game_url+';'));assert.notEqual(new URL(detail.game_url).origin,f.service.url);
    assert.equal((await fetch(new URL('..%5C..%5Cbatch.json',detail.game_url))).status,403);
    assert.equal((await fetch(f.service.url+'/api/review/evidence/'+f.id+'/score/index.html')).status,404);
    const evidence=await fetch(detail.checks[0].evidence['actions.json'].startsWith('/')?f.service.url+detail.checks[0].evidence['actions.json']:detail.checks[0].evidence['actions.json'],{headers:{Range:'bytes=0-9'}});assert.equal(evidence.status,206);assert.equal((await evidence.text()).length,10);
    const ui=await (await fetch(f.service.url+'/review')).text();assert.match(ui,/sandbox="allow-scripts"/);
  }finally{await f.close();}
});

test('sandboxed review permits own modules and JSON/audio fetch but blocks other packages and UI',async()=>{
 const f=await reviewFixture(),browser=await launchBrowser();
 try{
  const detail=await(await fetch(f.service.url+'/api/review/detail?attempt='+f.id)).json();
  const project=path.join(f.root,'artifacts/attempts',f.id,'submitted_project');
  await fs.writeFile(path.join(project,'directory.json'),'["tone.wav"]');
  await fs.writeFile(path.join(project,'tone.wav'),Buffer.from([82,73,70,70]));
  await fs.writeFile(path.join(project,'module.js'),'export const loaded = 42;');
  const page=await browser.newPage();await page.goto(f.service.url+'/review');
  await page.locator('#game-frame').evaluate((frame,url)=>frame.src=url,detail.game_url);
  await page.waitForFunction(()=>document.querySelector('#game-frame').src.includes('/play/'));
  const frame=await page.waitForEvent('framenavigated',{predicate:frame=>frame.url().startsWith(detail.game_url),timeout:3000}).catch(()=>page.frames().find(frame=>frame.url().startsWith(detail.game_url)));
  const output=await frame.evaluate(async({ui,other})=>{
   const blocked=async url=>{try{await fetch(url);return false;}catch{return true;}};
   let parentBlocked=false;try{void parent.document.body;}catch{parentBlocked=true;}
   return{module:(await import('./module.js')).loaded,json:await(await fetch('./directory.json')).json(),audio:(await(await fetch('./tone.wav')).arrayBuffer()).byteLength,parentBlocked,origin:self.origin,uiBlocked:await blocked(ui+'/api/review/tasks'),otherBlocked:await blocked(other),outsideBlocked:await blocked('https://example.invalid/data')};
  },{ui:f.service.url,other:new URL('../attempt-other/index.html',detail.game_url).href});
  assert.deepEqual(output,{module:42,json:['tone.wav'],audio:4,parentBlocked:true,origin:'null',uiBlocked:true,otherBlocked:true,outsideBlocked:true});
  assert.equal((await fetch(detail.game_url,{method:'POST',body:'x'})).status,405);
 }finally{await browser.close();await f.close();}
});
