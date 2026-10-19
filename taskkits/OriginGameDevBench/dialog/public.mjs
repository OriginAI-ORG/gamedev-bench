import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);assert.equal(await page.locator('#dialog').isVisible(),false);await page.locator('#open-dialog').click();assert.equal(await page.locator('#dialog-box').isVisible(),true);record({action:'open-dialog',visible:true});}
