import assert from 'node:assert/strict';import {assertVisibleElement} from '../../../environments/verification/visual.mjs';
const worldPoints=[['PillarPoint',[8.36166,1.81915,-12.0301],1],['GatePoint',[-16.6577,2.41884,-39.9426],0],['EnemyPoint',[23.0185,2.63927,-86.6948],2]];
export function markerVerifier(mode){
 const points=mode==='chest'?[['FlashlightPoint',[0,1.45,0],3]]:worldPoints,camera=mode==='chest'?[0,2,5]:[0,1.6,4];
 const scenarios=['initial','component','projection','target-reset'].map(id=>({id,description:'Spatial marker '+id}));
 async function runScenario(page,url,scenario,record=()=>{}){
  await page.goto(url);const click=id=>page.locator('#'+id).click();
  async function projection(shift=[0,0,0],cameraX=0){
   assert.equal(await page.locator('.point').count(),points.length);
   for(const [name,position]of points){const p=position.map((v,i)=>v+shift[i]),d=camera[2]-p[2],expected=[400+(p[0]-camera[0]-cameraX)*300/d,200-(p[1]-camera[1])*300/d];
    const circle=page.locator('#marker-'+name);await assertVisibleElement(circle);const actual=await circle.evaluate(e=>[Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))]);for(let i=0;i<2;i++)assert.ok(Math.abs(actual[i]-expected[i])<.1,'perspective coordinates for '+name);
    const screen=await page.locator('#scene').evaluate((e,p)=>{const m=e.getScreenCTM();return{x:m.a*p[0]+m.c*p[1]+m.e,y:m.b*p[0]+m.d*p[1]+m.f};},expected),box=await circle.boundingBox();assert.ok(Math.abs(box.x+box.width/2-screen.x)<1&&Math.abs(box.y+box.height/2-screen.y)<1,'visible projected center');
   }
  }
  if(scenario.id==='initial'){await projection();for(const[name,,priority]of points)assert.equal(await page.locator('#entry-'+name).innerText(),name+' · '+priority+' · ready');if(mode==='chest')await assertVisibleElement(page.locator('#chest-target'));}
  if(scenario.id==='projection'){await projection();await click('move');await projection([1,.2,0]);await click('camera');await projection([1,.2,0],2);await page.setViewportSize({width:520,height:800});await projection([1,.2,0],2);}
  if(scenario.id==='component'){
   if(mode==='chest'){
    const r=await page.evaluate(async()=>{const{installPoint}=await import('./component.js'),{SpatialNode}=await import('./spatial.js');const chest=new SpatialNode('chest',{position:[0,1.45,0],rotationY:Math.PI}),target=chest.add(new SpatialNode('target',{position:[0,.25,0]})),registry=new Set();class Probe extends SpatialNode{static Priority={high:3};constructor(name,options){super(name,options);this.priority=options.priority;this.hasBeenTargeted=false;}}const p=installPoint(chest,Probe,registry);const before=p.worldPosition();chest.position=[2,3,4];return{instance:p instanceof Probe,registry:registry.size===1&&registry.has(p),parent:p.parent===chest,local:p.position,name:p.name,priority:p.priority,targeted:p.hasBeenTargeted,before,after:p.worldPosition(),kept:chest.children.includes(target)&&target.parent===chest&&target.position.join(',')==='0,0.25,0',children:chest.children.length};});
    assert.deepEqual(r,{instance:true,registry:true,parent:true,local:[0,0,0],name:'FlashlightPoint',priority:3,targeted:false,before:[0,1.45,0],after:[2,3,4],kept:true,children:2});
   }else{
    const r=await page.evaluate(async()=>{const{Priority,FlashlightPoint,createPoints}=await import('./component.js'),{SpatialNode}=await import('./spatial.js');const root=new SpatialNode('root'),registry=new Set(),items=createPoints(root,registry),records=items.map(p=>({name:p.name,position:[...p.position],priority:p.priority,targeted:p.hasBeenTargeted,instance:p instanceof FlashlightPoint,parent:p.parent===root,registered:registry.has(p)}));const a=new FlashlightPoint('a',{position:[1,2,3],priority:Priority.high}),b=new FlashlightPoint('b',{position:[1,2,3],priority:Priority.low});a.hasBeenTargeted=true;b.hasBeenTargeted=true;a.resetTargetState();a.position[0]=7;return{Priority,records,count:registry.size,children:root.children.length,independent:a.hasBeenTargeted===false&&b.hasBeenTargeted===true&&b.position[0]===1,resetPreserves:a.name==='a'&&a.priority===Priority.high&&a.position.join(',')==='7,2,3'};});
    assert.deepEqual(r.Priority,{low:0,medium:1,high:2});assert.equal(r.count,3);assert.equal(r.children,3);assert.equal(r.independent,true);assert.equal(r.resetPreserves,true);assert.equal(r.records.length,3);
    for(const[name,position,priority]of worldPoints){const p=r.records.find(x=>x.name===name);assert.ok(p,name);assert.ok(Math.hypot(...position.map((v,i)=>v-p.position[i]))<=.05,'world coordinate tolerance');assert.equal(p.priority,priority);assert.equal(p.targeted,false);assert.ok(p.instance&&p.parent&&p.registered);}
   }
  }
  if(scenario.id==='target-reset'){
   const names=mode==='chest'?['FlashlightPoint']:['EnemyPoint','PillarPoint','GatePoint'];for(const name of names){await click('target');assert.equal(await page.locator('#status').innerText(),name);assert.match(await page.locator('#marker-'+name).getAttribute('class'),/targeted/);await assertVisibleElement(page.locator('#marker-'+name));}await click('target');assert.equal(await page.locator('#status').innerText(),'All targeted');await click('reset-targets');assert.equal(await page.locator('.point.targeted').count(),0);await projection();await click('target');assert.equal(await page.locator('#status').innerText(),names[0]);await click('move');for(let n=0;n<2;n++)await click('reset');await projection();assert.equal(await page.locator('.point.targeted').count(),0);
  }
  await assertVisibleElement(page.locator('#scene'));record({scenario:scenario.id,mode});
 }
 return{scenarios,runScenario};
}
