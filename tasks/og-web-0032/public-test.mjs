import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);await page.locator('#add').click();assert.equal(await page.locator('#count').innerText(),'1');assert.equal(await page.locator('#slot-0 img').isVisible(),true);assert.match(await page.locator('#slot-0 .quantity').innerText(),/^(?:[1-9]|1\d|20)$/);record({slot:0});}
