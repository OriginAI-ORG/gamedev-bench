import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);await page.locator('#zero-block').click();assert.equal(await page.locator('#block').isVisible(),false);assert.equal(await page.locator('#health-label').innerText(),'10');record({block:0,health:10});}
