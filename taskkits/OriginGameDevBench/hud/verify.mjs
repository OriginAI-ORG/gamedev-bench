import assert from 'node:assert/strict';
import {assertVisibleElement,screenshotPixels} from '../../../environments/verification/visual.mjs';
const near=(a,b,label,tolerance=1)=>assert.ok(Math.abs(a-b)<=tolerance,`${label}: ${a} != ${b}`);
export function hudVerifier(c){
  const scenarios=['initial','layout','events','overlay','reset'].map(id=>({id,description:c.title+': '+id}));
  async function runScenario(page,url,scenario,record=()=>{}){
    await page.goto(url);await page.locator('#hud').waitFor();
    const click=id=>page.locator('#'+id).click(),text=id=>page.locator('#'+id).innerText();
    const labels=async(life=c.life,score=0)=>{assert.equal(await text('life'),c.lifeLabel+': '+life);assert.equal(await text('score'),c.scoreLabel+': '+score);};
    const layout=async(minimum=c.minimum)=>{
      const s=await page.locator('#scene').boundingBox(),h=await page.locator('#hud').boundingBox();
      if(c.mode!=='instrument'){
        near(h.x,s.x+20,'left margin');near(h.y,s.y+20,'top margin');near(h.x+h.width,s.x+s.width-20,'right margin');
        const score=await page.locator('#score').boundingBox();near(score.x+score.width,h.x+h.width,'score right alignment');return;
      }
      assert.equal(await page.locator('#hud').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(153, 153, 153)');
      const vertical=['left','right'].includes(c.edge),far=['bottom','right'].includes(c.edge),axis=vertical?'x':'y',size=vertical?'width':'height';
      near(h[axis]+(far?h[size]:0),s[axis]+(far?s[size]:0),'anchored edge');
      near(h[vertical?'y':'x'],s[vertical?'y':'x'],'stretch start');near(h[vertical?'height':'width'],s[vertical?'height':'width'],'stretch span');
      assert.ok(h[size]>=minimum,'minimum panel dimension');
      const i=await page.locator('#instrument').boundingBox();
      near(i[axis]+(far?i[size]:0),h[axis]+(far?h[size]:0),'instrument anchored edge');
      const cross=vertical?'y':'x',span=vertical?'height':'width';near(i[cross]+i[span]/2,h[cross]+h[span]/2,'instrument centered');
      for(const id of ['power-meter','power-indicator']){await assertVisibleElement(page.locator('#'+id));assert.ok(await page.locator('#'+id).evaluate(e=>e instanceof HTMLImageElement&&e.complete&&e.naturalWidth>0),'loaded local image');assert.ok(screenshotPixels(await page.locator('#'+id).screenshot()).colors>=2,'instrument image has actual painted detail');}
    };
    if(scenario.id==='initial'){
      await labels();await layout();if(c.mode!=='status')assert.equal(await page.locator('#gameover').isVisible(),false);
    }else if(scenario.id==='layout'){
      for(const viewport of [{width:1100,height:760},{width:520,height:800}]){
        await page.setViewportSize(viewport);await layout();
        const before=await page.locator('#hud').boundingBox();await click('pan');assert.deepEqual(await page.locator('#hud').boundingBox(),before,'HUD is independent of world translation');
      }
      if(c.mode==='instrument'){await click('grow');await layout(c.minimum+30);await click('grow');await layout(c.minimum+60);}
    }else if(scenario.id==='events'){
      const before=c.mode==='instrument'?await page.locator('#power-indicator').boundingBox():null;
      await click('hit');await click('damage');await labels(c.life-(c.life===100?20:1),100);
      if(before)assert.notEqual((await page.locator('#power-indicator').boundingBox()).x,before.x,'fuel pointer actually moves');
      for(let n=0;n<6;n++)await click('damage');await labels(0,100);await click('hit');await labels(0,100);
    }else if(scenario.id==='overlay'){
      if(c.mode==='status'){await layout();}
      else{
        for(let n=0;n<(c.life===100?5:c.life);n++)await click('damage');
        await assertVisibleElement(page.locator('#gameover'));assert.equal(await text('gameover-title'),c.over);
        if(c.mode==='detailed'){
          const s=await page.locator('#scene').boundingBox(),g=await page.locator('#gameover').boundingBox();
          near(g.x,s.x+70,'overlay left');near(g.y,s.y+60,'overlay top');near(g.x+g.width,s.x+s.width-70,'overlay right');near(g.y+g.height,s.y+s.height-100,'overlay bottom');
          assert.match(await page.locator('#gameover').evaluate(e=>getComputedStyle(e).backgroundImage),/gradient/);
          assert.ok(screenshotPixels(await page.locator('#gameover').screenshot()).colors>4,'gradient is rendered');
          assert.equal(await text('final-score'),'your score is 0');assert.equal(await text('high-score'),'your high score is 100');
          await click('restart');await labels();assert.equal(await page.locator('#gameover').isVisible(),false);
          for(let n=0;n<5;n++)await click('damage');await click('menu');assert.equal(await text('status'),'menu');
        }else{
          const s=await page.locator('#scene').boundingBox(),g=await page.locator('#gameover-card').boundingBox();near(g.x+g.width/2,s.x+s.width/2,'overlay center x');near(g.y+g.height/2,s.y+s.height/2,'overlay center y');
        }
      }
    }else if(scenario.id==='reset'){
      await click('hit');await click('damage');await click('grow');await click('pan');await click('reset');await labels();await layout();if(c.mode!=='status')assert.equal(await page.locator('#gameover').isVisible(),false);
    }
    await assertVisibleElement(page.locator('#hud'));record({scenario:scenario.id,task:c.id});
  }
  return{scenarios,runScenario};
}
