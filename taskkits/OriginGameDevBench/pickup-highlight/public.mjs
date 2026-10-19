import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);await page.locator('#scene').focus();assert.equal(await page.locator('#status').innerText(),'Focused');await page.locator('#reset').click();assert.equal(await page.locator('#status').innerText(),'Unfocused');record({focus:'shown then hidden'});}
