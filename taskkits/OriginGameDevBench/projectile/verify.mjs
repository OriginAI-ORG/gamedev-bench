import assert from 'node:assert/strict';
import {assertVisibleElement} from '../../../environments/verification/visual.mjs';

const near=(value,expected,message)=>assert.ok(Math.abs(value-expected)<.02,`${message}: ${value} != ${expected}`);
export function projectileVerifier(mode){
  const scenarios=['core-sequence','edge-sequence','reset-sequence','component','asset-and-filter'].map(id=>({id,description:`Projectile ${mode}: ${id}`}));
  async function runScenario(page,url,scenario,record=()=>{}){
    await page.clock.install({time:new Date(0)});await page.clock.pauseAt(new Date(1000));await page.goto(url);await page.locator('#fire').waitFor();
    const click=id=>page.locator('#'+id).click();
    const select=(id,value)=>page.locator('#'+id).selectOption(value);
    const advance=ms=>page.clock.runFor(ms);
    const shots=async n=>assert.equal(await page.locator('.shot').count(),n,'live projectile count');
    if(scenario.id==='core-sequence'){
      await click('fire');await shots(1);await assertVisibleElement(page.locator('.shot'));
      const x=await page.locator('.shot').evaluate(e=>parseFloat(e.style.left));
      await advance(200);const after=await page.locator('.shot').evaluate(e=>parseFloat(e.style.left));
      assert.ok(after>x+85&&after<x+110,'continuous movement uses elapsed time');
      await advance(500);await shots(0);
      if(mode==='quest')assert.equal(await page.locator('#quest-progress').innerText(),'1');
      if(mode==='behavior'){
        await select('target-kind','crate');await click('fire');await advance(750);await shots(0);assert.equal(await page.locator('#target').count(),0,'crate removed');
        assert.deepEqual((await page.locator('#event-log li').allTextContents()).slice(0,2).map(x=>x.split(':')[0]),['dispose','destroy']);
      }
    }else if(scenario.id==='edge-sequence'){
      await select('aim','left');await click('fire');await advance(450);await shots(0);
      await select('aim','zero');await click('fire');await advance(200);await shots(1);
      await select('tank','bravo');await click('fire');assert.deepEqual(await page.locator('.shot').evaluateAll(es=>es.map(e=>e.dataset.owner)),['alpha','bravo']);
      if(mode==='quest'){assert.equal(await page.locator('#quest-progress').innerText(),'0');assert.equal(await page.locator('#supply-progress').innerText(),'0');}
    }else if(scenario.id==='reset-sequence'){
      await select('aim','zero');await click('fire');await click('fire');await shots(2);
      await click('reset');await shots(0);assert.equal(await page.locator('#shots').innerText(),'0');
      await click('fire');await advance(750);await shots(0);
      if(mode==='quest')assert.equal(await page.locator('#quest-progress').innerText(),'1');
    }else if(scenario.id==='component'){
      if(mode==='quest'||mode==='behavior'){
        const observed=await page.evaluate(async mode=>{
          const m=await import('./projectile.js'),events=[];
          const world={width:800,height:420,removeProjectile:p=>{events.push(['dispose',p.id]);p.active=false;},destroyBody:b=>{events.push(['destroy',b.kind]);b.active=false;}};
          const quests={progressQuest:(...args)=>events.push(['quest',...args])};
          const make=(id,direction={x:3,y:4},position={x:0,y:0})=>m.createProjectile({id,position,direction,tank:'bravo',world,quests:mode==='quest'?quests:null});
          const p=make('motion');p.tick(.03);p.tick(.07);const motion=[p.x,p.y,p.tank,p.direction];
          const idle=make('idle',{x:0,y:0});idle.tick(.1);const zero=[idle.x,idle.y];
          events.length=0;const enemy=make('enemy');enemy.onSensor({group:'enemy'});enemy.onSensor({group:'enemy'});const enemyEvents=events.splice(0);
          const neutral=make('neutral');neutral.onSensor({group:'neutral'});const neutralEvents=events.splice(0);
          const crate=make('crate');crate.onBody({kind:'crate',active:true});crate.onBody({kind:'crate',active:true});const crateEvents=events.splice(0);
          const wall=make('wall');wall.onBody({kind:'wall',active:true});const wallEvents=events.splice(0);
          const bounds=[];for(const [x,y]of [[-50,0],[850,0],[0,-50],[0,470],[-50.1,0],[850.1,0],[0,-50.1],[0,470.1]]){const p=make('bounds',{x:0,y:0},{x,y});p.tick(.1);bounds.push(p.active);}
          const ownerA=m.createProjectile({id:'a',position:{x:12,y:16},direction:{x:1,y:0},tank:'alpha',world,quests:mode==='quest'?quests:null});const ownerB=make('b');ownerA.tick(.1);ownerB.tick(.2);
          return{speed:m.SPEED,motion,zero,enemyEvents,neutralEvents,crateEvents,wallEvents,bounds,owners:[ownerA.tank,ownerB.tank],positions:[ownerA.x,ownerB.x,ownerB.y]};
        },mode);
        assert.equal(observed.speed,500);near(observed.motion[0],30,'normalized x');near(observed.motion[1],40,'normalized y');assert.equal(observed.motion[2],'bravo');assert.deepEqual(observed.motion[3],{x:3,y:4});assert.deepEqual(observed.zero,[0,0]);
        assert.deepEqual(observed.enemyEvents,mode==='quest'?[['quest','Shoot Em Up','kill_step','enemy'],['dispose','enemy']]:[['dispose','enemy']]);
        assert.deepEqual(observed.neutralEvents,[['dispose','neutral']]);assert.deepEqual(observed.crateEvents,mode==='quest'?[['dispose','crate']]:[['destroy','crate'],['dispose','crate']]);assert.deepEqual(observed.wallEvents,[['dispose','wall']]);
        assert.deepEqual(observed.bounds,[true,true,true,true,false,false,false,false]);assert.deepEqual(observed.owners,['alpha','bravo']);assert.deepEqual(observed.positions,[62,60,80]);
      }else{
        const d=await page.evaluate(async()=>{const m=await import('./projectile.js');return m.definition;});
        assert.deepEqual(d.size,mode==='missile'?[4,4]:[3,3]);assert.equal(d.layer,mode==='missile'?4:16);assert.equal(d.mask,mode==='missile'?26:44);assert.deepEqual(d.visibility,mode==='missile'?[4,4]:[3,3]);
        if(mode==='wiring'){
          const events=await page.evaluate(async()=>{const m=await import('./projectile.js'),result=[];for(const name of ['sensorcontact','bodycontact']){const p=new EventTarget();const off=m.wireContacts(p,{removeProjectile:which=>result.push([name,which===p])});p.dispatchEvent(new CustomEvent(name,{detail:{}}));off();p.dispatchEvent(new CustomEvent(name,{detail:{}}));}return result;});
          assert.deepEqual(events,[['sensorcontact',true],['bodycontact',true]],'both subscriptions work and detach');
        }
      }
    }else if(scenario.id==='asset-and-filter'){
      await select('aim','zero');await click('fire');await assertVisibleElement(page.locator('.shot'));
      const image=await page.locator('.shot').evaluate(e=>({width:e.width,height:e.height,pixels:[...e.getContext('2d').getImageData(0,0,e.width,e.height).data]}));
      assert.equal(image.width,mode==='missile'?4:3);assert.equal(image.height,image.width);
      if(mode==='missile'){
        assert.equal(image.pixels[3],0,'transparent atlas corner retained');assert.deepEqual(image.pixels.slice(4,8),[247,241,206,255],'correct cropped nose');assert.deepEqual(image.pixels.slice(52,56),[228,92,53,255],'correct cropped exhaust');
      }else assert.ok(image.pixels.some((v,i)=>i%4===3&&v>0),'textured projectile has painted pixels');
      for(const kind of mode==='missile'?['enemy','bridge','power','friendly','projectile']:['enemy','crate','wall','friendly']){
        await click('reset');await select('target-kind',kind);await click('fire');await advance(700);
        const filtered=['friendly','projectile'].includes(kind);await shots(filtered?1:0);
      }
    }
    await assertVisibleElement(page.locator('#scene'));record({scenario:scenario.id,mode,checks:'component-and-gameplay'});
  }
  return{scenarios,runScenario};
}

export async function projectilePublicCheck(page,url,record=()=>{}){
  await page.clock.install({time:new Date(0)});await page.clock.pauseAt(new Date(1000));await page.goto(url);await page.locator('#fire').click();
  assert.equal(await page.locator('.shot').count(),1);await assertVisibleElement(page.locator('.shot'));
  await page.clock.runFor(200);assert.ok(await page.locator('.shot').evaluate(e=>parseFloat(e.style.left))>155,'projectile moves without a step button');
  record({action:'fire-and-run',milliseconds:200});return[{name:'visible-continuous-projectile',passed:true}];
}
