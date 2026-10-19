import assert from 'node:assert/strict';import {assertVisibleElement,screenshotPixels} from '../../../environments/verification/visual.mjs';
export function highlightVerifier(yellow){
 const scenarios=['initial','component','input-filter','rendering','reset'].map(id=>({id,description:'Reusable pickup '+id}));
 async function runScenario(page,url,scenario,record=()=>{}){
  await page.goto(url);const canvas=page.locator('#scene'),click=id=>page.locator('#'+id).click(),status=()=>page.locator('#status').innerText();
  const photo=async()=>{const p=screenshotPixels(await canvas.screenshot());let bright=0;for(let i=0;i<p.pixels.length;i+=p.channels)if(p.pixels[i]>240&&p.pixels[i+1]>240&&(yellow?p.pixels[i+2]<20:p.pixels[i+2]>240))bright++;const i=(Math.floor(p.height/2)*p.width+Math.floor(p.width/2))*p.channels;return{...p,bright,center:[...p.pixels.subarray(i,i+3)]};};
  if(scenario.id==='initial'){assert.equal(await page.locator('#metadata').innerText(),'Test Cube');assert.equal(await status(),'Unfocused');assert.ok((await photo()).bright<20,'no initial highlight');}
  if(scenario.id==='component'){
   const r=await page.evaluate(async()=>{const m=await import('./component.js'),a=m.testCube.itemModel(),b=m.testCube.itemModel(),initial=a.body.highlight.visible;const refs=a.interaction.body===a.body&&a.interaction.highlight===a.body.highlight;a.interaction.gainFocus();a.interaction.gainFocus();const gain=a.body.highlight.visible&&b.body.highlight.visible===false;a.interaction.loseFocus();const lose=a.body.highlight.visible===false;const customBody={},customHull={visible:true},custom=new m.InteractableItem(customBody,customHull),bound=custom.body===customBody&&custom.highlight===customHull&&!customHull.visible;custom.gainFocus();const customGain=customHull.visible;return{metadata:m.testCube instanceof m.ItemData&&m.testCube.itemName==='Test Cube'&&m.testCube.itemModel===m.createPickup,separate:a.body!==b.body&&a.body.highlight!==b.body.highlight&&a.interaction!==b.interaction,interaction:a.interaction instanceof m.InteractableItem,initial,refs,gain,lose,bound,customGain,body:{layer:a.body.collisionLayer,mask:a.body.collisionMask,frozen:a.body.frozen,size:a.body.size},hull:{size:a.body.highlight.size,flip:a.body.highlight.flipFaces,emissive:a.body.highlight.emissive,color:a.body.highlight.color}};});
   for(const k of ['metadata','separate','interaction','refs','gain','lose','bound','customGain'])assert.equal(r[k],true,k);assert.equal(r.initial,false);assert.deepEqual(r.body,{layer:2,mask:3,frozen:true,size:.75});assert.equal(r.hull.size,.9);assert.equal(r.hull.flip,true);assert.equal(r.hull.emissive,true);assert.deepEqual(r.hull.color,yellow?[1,1,0]:[1,1,1]);
  }
  if(scenario.id==='input-filter'){
   const b=await canvas.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);assert.equal(await status(),'Focused');await page.mouse.move(b.x+12,b.y+12);assert.equal(await status(),'Unfocused');await canvas.focus();assert.equal(await status(),'Focused');await click('probe');assert.equal(await status(),'Unfocused');
   for(const[group,expected]of[['1','Contact'],['2','Contact'],['4','Filtered']]){await page.locator('#category').selectOption(group);await click('probe');assert.equal(await page.locator('#contact').innerText(),expected);}
  }
  if(scenario.id==='rendering'){
   await canvas.focus();const a=await photo();assert.ok(a.bright>200,'actual emissive rim pixels');assert.ok(a.center[0]<150&&a.center[2]>70&&a.center[2]>a.center[0]*1.5,'shaded cube center is not covered by its hull');
   await click('light');await canvas.focus();const dark=await photo();assert.ok(dark.bright>a.bright*.8&&dark.bright<a.bright*1.2,'outline emission survives lighting changes');assert.ok(a.center[2]-dark.center[2]>30,'body responds to light');
   await click('rotate');await canvas.focus();const rotated=await photo();assert.ok(rotated.bright>200);let changed=0;for(let i=0;i<dark.pixels.length;i+=dark.channels)if(Math.abs(dark.pixels[i]-rotated.pixels[i])+Math.abs(dark.pixels[i+1]-rotated.pixels[i+1])+Math.abs(dark.pixels[i+2]-rotated.pixels[i+2])>80)changed++;assert.ok(changed>500,'three-dimensional hull changes with rotation');
  }
  if(scenario.id==='reset'){await canvas.focus();await click('rotate');await click('light');await click('reset');assert.equal(await status(),'Unfocused');assert.ok((await photo()).bright<20);await canvas.focus();assert.ok((await photo()).bright>200);await click('reset');assert.equal(await status(),'Unfocused');assert.equal(await canvas.count(),1);}
  await assertVisibleElement(canvas);record({scenario:scenario.id,yellow});
 }
 return{scenarios,runScenario};
}
