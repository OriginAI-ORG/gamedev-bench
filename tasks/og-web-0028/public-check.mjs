import assert from 'node:assert/strict';
export async function runPublicCheck(page,url,record=()=>{}){await page.goto(url);await page.locator('#target').click();assert.equal(await page.locator('#status').innerText(),'EnemyPoint');assert.equal(await page.locator('#marker-EnemyPoint').isVisible(),true);record({target:'EnemyPoint'});}
