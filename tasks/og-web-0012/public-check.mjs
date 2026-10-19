import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){
  await page.clock.install({time:new Date(0)});await page.clock.pauseAt(new Date(1000));await page.goto(url);await page.locator('#fire').click();
  assert.equal(await page.locator('.shot').count(),1);
  assert.ok(await page.locator('.shot').isVisible(),'visible projectile');
  await page.clock.runFor(200);
  assert.ok(await page.locator('.shot').evaluate(e=>parseFloat(e.style.left))>155,'projectile moves without a step button');
  record({action:'fire-and-run',milliseconds:200});
  return[{name:'visible-continuous-projectile',passed:true}];
}
