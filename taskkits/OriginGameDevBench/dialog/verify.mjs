import assert from 'node:assert/strict';
import {assertVisibleElement} from '../../../environments/verification/visual.mjs';
export async function checkDialogGrowth(page,url,{width,height,word},record=()=>{}){
  await page.goto(url);assert.equal(await page.locator('#dialog').isVisible(),false);await page.locator('#open-dialog').click();
  assert.ok((await page.locator('#dialog-box').innerText()).includes(word));
  for(const viewport of [{width:800,height:600},{width:1100,height:760}]){
    await page.setViewportSize(viewport);
    for(const extra of [0,80]){
      await page.locator('#dialog-box').evaluate((e,size)=>{e.style.minWidth=size[0]+'px';e.style.minHeight=size[1]+'px';},[width+extra,height+extra]);
      await assertVisibleElement(page.locator('#dialog-box'));
      const a=await page.locator('#scene').boundingBox(),b=await page.locator('#dialog-box').boundingBox();
      assert.ok(b.width>=width+extra&&b.height>=height+extra,'minimum size grows');
      assert.ok(Math.abs(a.x+a.width/2-b.x-b.width/2)<=2,'horizontal growth remains centered');
      assert.ok(Math.abs(a.y+a.height/2-b.y-b.height/2)<=2,'vertical growth remains centered');
    }
  }
  await page.locator('#close-dialog').click();await page.locator('#open-dialog').click();assert.equal(await page.locator('#dialog-box').count(),1);
  await page.locator('#reset').click();assert.equal(await page.locator('#dialog').isVisible(),false);record({scenario:'symmetric-growth',width,height});
}
