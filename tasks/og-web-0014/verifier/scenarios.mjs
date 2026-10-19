import assert from 'node:assert/strict';import {assertVisibleElement} from '../../../environments/verification/visual.mjs';
export const scenarios=['layout','wiring','updates','reset'].map(id=>({id,description:'Unit label '+id}));
export async function runScenario(page,url,scenario,record=()=>{}){
 await page.goto(url);const label=page.locator('#debug-label'),click=id=>page.locator('#'+id).click();
 async function geometry(){const a=await page.locator('#actor').boundingBox(),b=await label.boundingBox();assert.deepEqual([b.x-a.x,b.y-a.y,b.width,b.height],[-65,-47,130,18]);assert.equal(await label.evaluate(e=>getComputedStyle(e).textAlign),'center');await assertVisibleElement(label);}
 if(scenario.id==='layout'){assert.equal(await label.innerText(),'IDLE');await geometry();for(const v of [{width:1100,height:760},{width:520,height:800}]){await page.setViewportSize(v);await click('move');await geometry();}}
 if(scenario.id==='wiring'){
  const results=await page.evaluate(async()=>{const {attachAI}=await import('./component.js');const rows=[];for(let i=0;i<2;i++){const actor=document.createElement('div');document.body.append(actor);let input;class Probe{constructor(args){input=args;}setState(s){input.debugLabel.textContent=s;}}const ai=attachAI(actor,Probe),label=actor.querySelector('#debug-label');ai.setState('CUSTOM-'+i);rows.push({instance:ai instanceof Probe,actor:input.actor===actor,label:input.debugLabel===label,text:label?.textContent,count:actor.querySelectorAll('#debug-label').length});actor.remove();}return rows;});
  assert.deepEqual(results,[{instance:true,actor:true,label:true,text:'CUSTOM-0',count:1},{instance:true,actor:true,label:true,text:'CUSTOM-1',count:1}]);
 }
 if(scenario.id==='updates'){await click('patrol');assert.equal(await label.innerText(),'PATROL');await click('toggle');assert.equal(await label.isVisible(),false);await click('attack');await click('toggle');assert.equal(await label.innerText(),'ATTACK');await assertVisibleElement(label);await click('stop');assert.equal(await label.innerText(),'IDLE');}
 if(scenario.id==='reset'){await click('move');await click('attack');await click('toggle');await click('reset');assert.equal(await label.count(),1);assert.equal(await label.innerText(),'IDLE');await geometry();await click('patrol');assert.equal(await label.innerText(),'PATROL');}
 await assertVisibleElement(page.locator('#scene'));record({scenario:scenario.id});
}
