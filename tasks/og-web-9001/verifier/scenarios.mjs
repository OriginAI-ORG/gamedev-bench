import assert from 'node:assert/strict';
import { visibleText, visibleCells } from '../../../environments/verification/browser.mjs';

// Independent rule model; never imports the submitted game or reference implementation.
function createState(rows) {
  const flat = rows.join(''), width = rows[0].length;
  return { rows, width, terrain:[...flat].map(c => c === '#' ? '#' : '.*+'.includes(c) ? '.' : ' '),
    boxes:[...flat].flatMap((c,i) => '$*'.includes(c) ? [i] : []),
    player:[...flat].findIndex(c => '@+'.includes(c)), steps:0 };
}
function complete(s) { return s.boxes.every(i => s.terrain[i] === '.'); }
function move(s, key) {
  if (complete(s)) return;
  const delta = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-s.width,ArrowDown:s.width}[key];
  const next = s.player + delta, dest = next + delta;
  const valid = (from,to) => to >= 0 && to < s.terrain.length && s.terrain[to] !== '#' && (Math.abs(delta) !== 1 || Math.floor(from/s.width) === Math.floor(to/s.width));
  if (!valid(s.player,next)) return;
  const boxIndex = s.boxes.indexOf(next);
  if (boxIndex !== -1) {
    if (!valid(next,dest) || s.boxes.includes(dest)) return;
    s.boxes[boxIndex] = dest;
  }
  s.player = next; s.steps++;
}
function symbols(s) {
  return s.terrain.map((t,i) => i === s.player ? (t === '.' ? '⊕' : '@') : s.boxes.includes(i) ? (t === '.' ? '■' : '□') : t === '#' ? '#' : t === '.' ? '○' : '·');
}
async function inspect(page,s) {
  const cells = await visibleCells(page,'#board > *');
  assert.equal(cells.length,s.terrain.length,'Grid cell count');
  const byPosition = new Map();
  for (const cell of cells) {
    const r = Number(cell.row), c = Number(cell.col), pos = r*s.width+c;
    assert.ok(cell.row !== null && cell.col !== null && Number.isInteger(r) && Number.isInteger(c) && r>=0 && r<s.rows.length && c>=0 && c<s.width,'Cell coordinates');
    assert.ok(!byPosition.has(pos),'Duplicate cell coordinate'); byPosition.set(pos,cell);
  }
  const expected = symbols(s);
  for (let pos=0;pos<expected.length;pos++) {
    const cell = byPosition.get(pos);
    assert.equal(cell.text,expected[pos],'Visible board cell '+pos);
    if (pos % s.width > 0) {
      const left = byPosition.get(pos-1);
      assert.ok(cell.box.x >= left.box.x+left.box.width-2 && Math.abs(cell.box.y-left.box.y)<3,'Cells must form visible rows');
    }
    if (pos >= s.width) {
      const above = byPosition.get(pos-s.width);
      assert.ok(cell.box.y >= above.box.y+above.box.height-2 && Math.abs(cell.box.x-above.box.x)<3,'Cells must form visible columns');
    }
  }
  assert.equal(await visibleText(page,'#steps'),String(s.steps),'Step count');
  assert.equal(await visibleText(page,'#status'),complete(s) ? '胜利' : '进行中','Completion must match board');
  return { board:expected, steps:s.steps, status:complete(s)?'胜利':'进行中' };
}
const navigation = ["#######","#@    #","# #$ .#","#     #","#######"];
const blockedWall = ["#######","#@$# .#","#     #","#######"];
const blockedBox = ["########","#@$$ ..#","#      #","########"];
const twoBoxes = ["########","#      #","# .$ @ #","# .$   #","#      #","########"];
const special = ["#######","#  *  #","# +$  #","#     #","#######"];
export const scenarios = [
  {id:'wall-and-movement',description:'墙体、合法移动、无效输入不计步',map:navigation,keys:['ArrowLeft','ArrowUp','ArrowRight','ArrowDown','ArrowRight']},
  {id:'blocked-push-wall',description:'箱子后方是墙时推箱失败',map:blockedWall,keys:['ArrowRight','ArrowRight']},
  {id:'blocked-push-box',description:'不能同时推两个箱子',map:blockedBox,keys:['ArrowRight','ArrowRight']},
  {id:'all-boxes-win',description:'未全到目标不通关、真正胜利、胜利后停止移动',map:twoBoxes,keys:['ArrowLeft','ArrowLeft','ArrowRight','ArrowDown','ArrowLeft','ArrowRight']},
  {id:'reset-state',description:'移动后重开恢复布局、步数和状态',map:navigation,keys:['ArrowRight','ArrowRight','ArrowDown'],reset:true},
  {id:'goal-symbols',description:'目标上的玩家与箱子正确显示和移动',map:special,keys:['ArrowRight','ArrowDown','ArrowLeft'],reset:true}
];

export async function runScenario(page, url, scenario, record) {
  let state = createState(scenario.map);
  record({action:'load',map:scenario.map});
  await page.goto(url+'?map='+encodeURIComponent(JSON.stringify(scenario.map)), { waitUntil:'load' });
  await page.locator('#board').waitFor({state:'visible'});
  record({action:'initial',observed:await inspect(page,state)});
  for (const key of scenario.keys) {
    record({action:'key',key});
    await page.keyboard.press(key); move(state,key); await page.waitForTimeout(220);
    record({action:'observe',expected:{steps:state.steps},observed:await inspect(page,state)});
  }
  if (scenario.reset) {
    record({action:'reset'});
    await page.getByRole('button',{name:'重新开始',exact:true}).click();
    state = createState(scenario.map); await page.waitForTimeout(220);
    record({action:'observe',observed:await inspect(page,state)});
  }
}
