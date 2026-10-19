import assert from 'node:assert/strict';
import {assertVisibleElement} from '../../../environments/verification/visual.mjs';
import {checkDialogGrowth} from './verify.mjs';
export function dialogVerifier(config){
 const scenarios=['core-sequence','edge-sequence','reset-sequence','symmetric-growth'].map(id=>({id,description:'Dialog: '+id}));
 async function runScenario(page,url,scenario,record=()=>{}){
  if(scenario.id==='symmetric-growth')return checkDialogGrowth(page,url,config,record);
  await page.goto(url);await assertVisibleElement(page.locator('#scene'));assert.equal(await page.locator('#dialog').isVisible(),false);
  await page.locator('#open-dialog').click();await assertVisibleElement(page.locator('#dialog-box'));assert.ok((await page.locator('#dialog-box').innerText()).includes(config.word));
  const a=await page.locator('#scene').boundingBox(),b=await page.locator('#dialog-box').boundingBox();assert.ok(b.width>=config.width&&b.height>=config.height);assert.ok(Math.abs(a.x+a.width/2-b.x-b.width/2)<=2&&Math.abs(a.y+a.height/2-b.y-b.height/2)<=2);
  if(scenario.id==='edge-sequence'){for(let i=0;i<3;i++){await page.locator('#close-dialog').click();assert.equal(await page.locator('#dialog').isVisible(),false);await page.locator('#open-dialog').click();assert.equal(await page.locator('#dialog-box').count(),1);await assertVisibleElement(page.locator('#dialog-box'));}}
  if(scenario.id==='reset-sequence'){await page.locator('#reset').click();assert.equal(await page.locator('#dialog').isVisible(),false);await page.locator('#open-dialog').click();await assertVisibleElement(page.locator('#dialog-box'));}
  record({scenario:scenario.id,...config});
 }return{scenarios,runScenario};
}
