import assert from 'node:assert/strict';
import { visibleText, visibleCells } from '../../../environments/verification/browser.mjs';

const deck = ['A','B','C','A','C','B'];
export const scenarios = [
  { id:'mismatch-and-lock', description:'不匹配回盖、快速第三张点击被忽略' },
  { id:'match-and-repeat', description:'正确匹配保留，重复点同牌不自配对' },
  { id:'all-pairs-win', description:'只有全部配对才胜利' },
  { id:'reset-counts', description:'重开清除配对数、尝试数与卡牌' },
  { id:'reset-pending', description:'重开取消等待中的回盖计时器' }
];
async function inspect(page, expected, attempts, pairs, status='进行中') {
  const cards = await visibleCells(page,'#board > button');
  assert.equal(cards.length,deck.length);
  const byIndex = new Map(cards.map(c=>[c.index,c]));
  assert.equal(byIndex.size,deck.length,'Unique card indices');
  for(let i=0;i<deck.length;i++) {
    assert.ok(byIndex.has(String(i)),'Card index '+i);
    assert.equal(byIndex.get(String(i)).text,expected[i],'Visible card '+i);
  }
  assert.equal(await visibleText(page,'#attempts'),String(attempts),'Attempt count');
  assert.equal(await visibleText(page,'#pairs'),String(pairs),'Pair count');
  assert.equal(await visibleText(page,'#status'),status,'Completion');
  return {cards:expected,attempts,pairs,status};
}
export async function runScenario(page,url,scenario,record) {
  record({action:'load',deck});
  await page.goto(url+'?deck='+encodeURIComponent(JSON.stringify(deck)), {waitUntil:'load'});
  await page.locator('#board').waitFor({state:'visible'});
  const hidden = Array(deck.length).fill('?');
  const check = async (cards,attempts,pairs,status) => record({action:'observe',observed:await inspect(page,cards,attempts,pairs,status)});
  const click = async i => { await page.locator('#board > button[data-index="'+i+'"]').click(); record({action:'click',index:i}); };
  const reset = async () => { await page.getByRole('button',{name:'重新开始',exact:true}).click(); record({action:'reset'}); };
  await check(hidden,0,0);
  if (scenario.id === 'mismatch-and-lock') {
    await click(0); await click(1); await click(2);
    await check(['A','B','?','?','?','?'],1,0);
    await page.waitForTimeout(760); await check(hidden,1,0);
  } else if (scenario.id === 'match-and-repeat') {
    await click(0); await click(0); await check(['A','?','?','?','?','?'],0,0);
    await click(3); await check(['A','?','?','A','?','?'],1,1);
    await click(0); await check(['A','?','?','A','?','?'],1,1);
  } else if (scenario.id === 'all-pairs-win') {
    await click(1); await click(5); await check(['?','B','?','?','?','B'],1,1);
    await click(2); await click(4); await check(['?','B','C','?','C','B'],2,2);
    await click(3); await click(0); await check(deck,3,3,'胜利');
    await click(0); await check(deck,3,3,'胜利');
    await reset(); await check(hidden,0,0);
  } else if (scenario.id === 'reset-counts') {
    await click(0); await click(3); await check(['A','?','?','A','?','?'],1,1);
    await reset(); await check(hidden,0,0);
  } else {
    await click(0); await click(1);
    await reset(); await click(2);
    await page.waitForTimeout(760); await check(['?','?','C','?','?','?'],0,0);
    await click(4); await check(['?','?','C','?','C','?'],1,1);
  }
}
