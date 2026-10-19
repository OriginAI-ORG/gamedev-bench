import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);await page.locator('#target').click();assert.equal(await page.locator('#status').innerText(),'FlashlightPoint');assert.equal(await page.locator('#marker-FlashlightPoint').isVisible(),true);record({target:'FlashlightPoint'});}
