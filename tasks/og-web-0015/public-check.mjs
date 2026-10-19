import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);await page.locator('#draw').click();assert.equal(await page.locator('#drawn').innerText(),'strike · Cost 1');assert.equal(await page.locator('#count').innerText(),'2');record({drawn:'strike',count:2});}
