// Only public requirements and public-map actions. No private evaluator import.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.argv[2];
if (!base || !/^http:\/\/(127\.0\.0\.1|localhost):\d+\/?$/.test(base)) {
  throw new Error('Usage: node tasks/og-web-9001/public-test.mjs http://127.0.0.1:PORT/');
}
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
try {
  const page = await browser.newPage();
  await page.goto(base);
  await page.locator('#board').waitFor({ state: 'visible' });
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(220);
  assert.equal((await page.locator('#steps').innerText()).trim(), '1');
  assert.equal((await page.locator('#status').innerText()).trim(), '胜利');
  await page.getByRole('button', { name: '重新开始', exact: true }).click();
  assert.equal((await page.locator('#steps').innerText()).trim(), '0');
  assert.equal((await page.locator('#status').innerText()).trim(), '进行中');
  console.log('Public example passed.');
} finally {
  await browser.close();
}
