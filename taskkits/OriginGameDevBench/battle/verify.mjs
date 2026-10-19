import assert from 'node:assert/strict';
import {assertVisibleElement} from '../../../environments/verification/visual.mjs';
const near=(a,b,what,t=1)=>assert.ok(Math.abs(a-b)<=t,`${what}: ${a} != ${b}`);
export function battleVerifier(c){
 const scenarios=['initial','events','pause-actions','layout','component','reset'].map(id=>({id,description:c.title+': '+id}));
 async function runScenario(page,url,scenario,record=()=>{}){
  await page.clock.install({time:new Date(0)});await page.clock.pauseAt(new Date(1000));await page.goto(url);await page.locator('#scene').waitFor();
  const click=id=>page.locator('#'+id).click(),text=id=>page.locator('#'+id).innerText();
  const result=async(message,win)=>{await assertVisibleElement(page.locator('#battle-panel'));assert.equal(await text('result-label'),message);assert.equal(await page.locator('#continue').isVisible(),win);assert.equal(await page.locator('#restart').isVisible(),!win);assert.equal(await text('status'),'paused');};
  if(scenario.id==='initial'){assert.equal(await page.locator('#battle-panel').isVisible(),false);await page.clock.runFor(240);assert.ok(Number(await text('elapsed'))>.1);}
  if(scenario.id==='events'){
   await click('win');await result(c.text,true);await click('lose');await result('Defeat',false);
   for(const [message,type] of [['Signal 17: Victory','0'],['<b>Loss & retry</b>','1'],['Another result','0']]){await page.locator('#message').fill(message);await page.locator('#outcome').selectOption(type);await click('request');await result(message,type==='0');}
   assert.equal(await page.locator('#battle-panel').count(),1);assert.equal(await page.locator('#result-label b').count(),0,'message is plain text');
  }
  if(scenario.id==='pause-actions'){
   await page.clock.runFor(400);const moving=await page.locator('#actor').boundingBox();assert.ok(Number(await text('elapsed'))>.2);
   await click('lose');const elapsed=await text('elapsed'),position=await page.locator('#actor').boundingBox();await page.clock.runFor(600);assert.equal(await text('elapsed'),elapsed,'game clock pauses');assert.deepEqual(await page.locator('#actor').boundingBox(),position,'actor pauses');assert.ok(moving.x>24);
   await click('restart');assert.equal(await text('status'),'running');assert.equal(await text('restarts'),'1');assert.equal(Number(await text('elapsed')),0);assert.equal(await page.locator('#battle-panel').isVisible(),false);await page.clock.runFor(240);assert.ok(Number(await text('elapsed'))>.1);
   await click('win');await click('continue');assert.equal(await text('status'),'complete');assert.equal(await text('finishes'),'1');const ended=await text('elapsed');await page.clock.runFor(400);assert.equal(await text('elapsed'),ended);
  }
  if(scenario.id==='layout'){
   for(const viewport of [{width:1100,height:760},{width:520,height:800}]){
    await page.setViewportSize(viewport);await click('win');
    const scene=await page.locator('#scene').evaluate(e=>({x:e.getBoundingClientRect().x+e.clientLeft,y:e.getBoundingClientRect().y+e.clientTop,width:e.clientWidth,height:e.clientHeight})),panel=await page.locator('#battle-panel').boundingBox();for(const key of ['x','y','width','height'])near(panel[key],scene[key],key);
    const content=await page.locator('#battle-content').boundingBox();near(content.x+content.width/2,panel.x+panel.width/2,'center x');near(content.y+content.height/2,panel.y+panel.height/2,'center y');assert.ok(content.width>=c.offset*2&&content.height>=c.offset*2,'base centered extent');
    assert.deepEqual(await page.locator('#battle-content').evaluate(e=>{const s=getComputedStyle(e);return[parseFloat(s.minWidth),parseFloat(s.minHeight)];}),[c.offset*2,c.offset*2],'minimum centered extent remains explicit even when text is larger');
    const styles=await page.locator('#battle-panel').evaluate(e=>getComputedStyle(e).backgroundColor.match(/[\d.]+/g).map(Number));assert.deepEqual(styles.slice(0,3),[0,0,0]);near(styles[3],c.alpha,'overlay opacity',.002);
    assert.equal(await page.locator('#result-label').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)),c.font);assert.equal(await page.locator('#result-label').evaluate(e=>getComputedStyle(e).textAlign),'center');
    for(const [id,buttonText] of [['continue',c.labels[0]],['restart',c.labels[1]]]){
     await click(id==='continue'?'win':'lose');await assertVisibleElement(page.locator('#'+id));assert.equal(await text(id),buttonText);
     const b=await page.locator('#'+id).boundingBox(),p=await page.locator('#battle-content').boundingBox();assert.ok(b.width>=c.minimum[0]&&b.height>=c.minimum[1],'minimum button extent');
     assert.deepEqual(await page.locator('#'+id).evaluate(e=>{const s=getComputedStyle(e);return[parseFloat(s.minWidth),parseFloat(s.minHeight)];}),c.minimum,'configured minimum button size');
     if(c.align==='fill'){near(b.x,p.x,'button start');near(b.width,p.width,'button fill');}else if(c.align==='start')near(b.x,p.x,'button start');else near(b.x+b.width/2,p.x+p.width/2,'button center');
    }
   }
  }
  if(scenario.id==='component'){
   const r=await page.evaluate(async c=>{
    const {BattleOverPanel,Type}=await import('./panel.js'),host=document.createElement('div'),events=new EventTarget(),calls=[];document.body.append(host);
    const p=new BattleOverPanel(host,events,{pause:()=>calls.push('pause'),finish:()=>calls.push('finish'),restart:()=>calls.push('restart')},c);
    p.showScreen('Direct API result',Type.LOSE);const direct={text:host.querySelector('#result-label')?.textContent,restart:!host.querySelector('#restart')?.hidden,continue:!host.querySelector('#continue')?.hidden};
    host.querySelector('#restart')?.click();events.dispatchEvent(new CustomEvent('battle-over',{detail:{text:'Fresh event',type:Type.WIN}}));const eventText=host.querySelector('#result-label')?.textContent;host.querySelector('#continue')?.click();host.querySelector('#continue')?.click();
    p.dispose();p.dispose();events.dispatchEvent(new CustomEvent('battle-over',{detail:{text:'Disposed event',type:Type.WIN}}));p.showScreen('Disposed direct',Type.WIN);const left=host.children.length;host.remove();return{type:Type,direct,eventText,calls,left};
   },c);
   assert.deepEqual(r,{type:{WIN:0,LOSE:1},direct:{text:'Direct API result',restart:true,continue:false},eventText:'Fresh event',calls:['pause','restart','pause','finish'],left:0});
  }
  if(scenario.id==='reset'){await click('lose');await click('restart');await click('win');await click('reset');assert.equal(await text('status'),'running');assert.equal(await text('restarts'),'0');assert.equal(await text('finishes'),'0');assert.equal(await page.locator('#battle-panel').isVisible(),false);await click('lose');await click('restart');assert.equal(await text('restarts'),'1');assert.equal(await page.locator('#battle-panel').count(),1);}
  await assertVisibleElement(page.locator('#scene'));record({scenario:scenario.id,task:c.id});
 }
 return{scenarios,runScenario};
}
