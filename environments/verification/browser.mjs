import path from 'node:path';
import { ROOT } from '../../runner/common.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.join(ROOT, '.browsers');
const { chromium } = await import('playwright');

export async function launchBrowser() {
  return chromium.launch({
    headless: true,
    chromiumSandbox: true,
    timeout: 25000,
    args: ['--disable-background-networking', '--disable-extensions']
  });
}

export async function visibleText(page, selector) {
  const element = page.locator(selector);
  if (await element.count() !== 1 || !(await element.isVisible())) throw new Error('Missing or invisible control: ' + selector);
  return (await element.innerText()).trim();
}

export async function visibleCells(page, selector) {
  const cells = page.locator(selector);
  const result = [];
  for (let i=0; i<await cells.count(); i++) {
    const cell = cells.nth(i);
    if (!(await cell.isVisible())) throw new Error('Hidden cell at ' + i);
    const box = await cell.boundingBox();
    if (!box || box.width < 8 || box.height < 8) throw new Error('Unreadable cell at ' + i);
    result.push({
      text: (await cell.innerText()).trim(),
      row: await cell.getAttribute('data-row'),
      col: await cell.getAttribute('data-col'),
      index: await cell.getAttribute('data-index'),
      box
    });
  }
  return result;
}
