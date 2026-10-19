import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);for(const n of ['Archer','Marksman','Archer'])await page.locator('#add-'+n).click();assert.equal(await page.locator('#active-units').innerText(),'2');assert.equal(await page.locator('#trait').evaluate(e=>getComputedStyle(e).opacity),'1');record({unique:2});}
