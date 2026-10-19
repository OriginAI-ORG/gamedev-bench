import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);await page.locator('#actor').click();assert.equal(await page.locator('#damage-label').innerText(),'Total Damage: 20');record({total:20});}
