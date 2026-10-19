import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){
  await page.goto(url);assert.ok(await page.locator('#hud').isVisible());
  assert.match(await page.locator('#score').innerText(),/: 0$/);
  await page.locator('#hit').click();assert.match(await page.locator('#score').innerText(),/: 100$/);
  record({action:'hit',score:100});return[{name:'hud-event-update',passed:true}];
}
