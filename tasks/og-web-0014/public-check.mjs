import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);assert.equal(await page.locator('#debug-label').innerText(),'IDLE');await page.locator('#patrol').click();assert.equal(await page.locator('#debug-label').innerText(),'PATROL');record({state:'PATROL'});}
