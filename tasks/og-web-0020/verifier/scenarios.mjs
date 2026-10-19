import assert from 'node:assert/strict';import {assertVisibleElement} from '../../../environments/verification/visual.mjs';
export const scenarios=['component','transitions','reset'].map(id=>({id,description:'FSM '+id}));
export async function runScenario(page,url,scenario,record=()=>{}){
 await page.goto(url);const click=id=>page.locator('#'+id).click();
 if(scenario.id==='component'){
  const r=await page.evaluate(async()=>{const{State,FiniteStateMachine}=await import('./machine.js'),actor={},other={},events=[],machine=new FiniteStateMachine(),independent=new FiniteStateMachine();class Probe extends State{constructor(a,name){super(a);this.name=name;}enter(){events.push('enter:'+this.name);}exit(){events.push('exit:'+this.name);}}const a=new Probe(actor,'A7'),b=new Probe(actor,'B9'),c=new Probe(other,'C2');const refs=a.actor===actor&&b.actor===actor&&c.actor===other;const initial=machine.state===null&&independent.state===null;machine.addEventListener('state-changed',e=>events.push('changed:'+e.detail.name+':'+(machine.state===e.detail)));machine.changeState(a);machine.changeState(b);machine.changeState(b);const end=machine.state===b&&independent.state===null;return{refs,initial,end,events,methods:['enter','exit','process','physicsProcess'].every(k=>typeof new State(actor)[k]==='function')};});
  assert.deepEqual(r,{refs:true,initial:true,end:true,events:['enter:A7','changed:A7:true','exit:A7','enter:B9','changed:B9:true','exit:B9','enter:B9','changed:B9:true'],methods:true});
 }
 if(scenario.id==='transitions'){
  const before=await page.locator('#actor').boundingBox();await click('state-RUN');assert.equal(await page.locator('#status').innerText(),'RUN');assert.notDeepEqual(await page.locator('#actor').boundingBox(),before);await click('state-ATTACK');assert.equal(await page.locator('#status').innerText(),'ATTACK');assert.equal(await page.locator('#actor').getAttribute('data-pose'),'ATTACK');await click('state-ATTACK');assert.equal(await page.locator('#log').innerText(),'exit:IDLE\nenter:RUN\nchanged:RUN\nexit:RUN\nenter:ATTACK\nchanged:ATTACK\nexit:ATTACK\nenter:ATTACK\nchanged:ATTACK');await assertVisibleElement(page.locator('#actor'));
 }
 if(scenario.id==='reset'){await click('state-ATTACK');await click('reset');assert.equal(await page.locator('#status').innerText(),'IDLE');assert.equal(await page.locator('#log').innerText(),'');assert.equal(await page.locator('#actor').getAttribute('data-pose'),'IDLE');await click('state-RUN');assert.equal(await page.locator('#log').innerText(),'exit:IDLE\nenter:RUN\nchanged:RUN');}
 await assertVisibleElement(page.locator('#scene'));record({scenario:scenario.id});
}
