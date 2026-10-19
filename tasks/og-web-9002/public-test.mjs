import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = process.argv[2];
if (!base || !/^http:\/\/(127\.0\.0\.1|localhost):\d+\/?$/.test(base)) throw new Error('Pass a loopback URL.');
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
try {
  const page = await browser.newPage();
  await page.goto(base);
  await page.locator('[data-index="0"]').click();
  await page.locator('[data-index="2"]').click();
  assert.equal((await page.locator('#pairs').innerText()).trim(), '1');
  assert.equal((await page.locator('#attempts').innerText()).trim(), '1');
  await page.getByRole('button', { name: '重新开始', exact: true }).click();
  assert.equal((await page.locator('#pairs').innerText()).trim(), '0');
  console.log('Public example passed.');
} finally { await browser.close(); }
