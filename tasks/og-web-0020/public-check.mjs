import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);await page.locator('#state-RUN').click();assert.equal(await page.locator('#status').innerText(),'RUN');assert.equal(await page.locator('#log').innerText(),'exit:IDLE\nenter:RUN\nchanged:RUN');record({state:'RUN'});}
