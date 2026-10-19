# 骰子王座

制作完整的浏览器骰子战斗肉鸽游戏，包含保留与重掷决策、可见敌方骰子、真正改变骰面的装备、分支地牢及专用骰面首领。交付无需外部服务的本地自包含 `index.html` 包。附带的奇幻与骰子图集可选用。

- **R1 — 掷骰与战术选择。** 新冒险以 50/50 生命、30 金币和 5 颗独立骰子开始，每颗包含 sword,sword,shield,heart,skull,blank。每个战斗回合同时掷出玩家与敌方全部骰子，以可见翻滚动画结束并显示朝上的结果。在选择阶段可逐颗锁定或解锁玩家骰子，只重掷未锁定者，每回合最多 2 次。重掷时锁定骰面和敌方结果保持不变。全部锁定时拒绝重掷且不消耗次数。确认结束选择阶段，下一回合重置锁定和重掷次数。使用带种子的均匀骰面采样，不得使用预编结果序列。为保持轨迹可重复，使用无符号 32 位 xorshift，移位量为 13,17,5，除以 4294967296，默认种子 42；零种子替换为 1。修改后的骰子对其全部实际骰面均匀采样。
- **R2 — 骰面效果和可见意图。** 结算前同时保留双方已掷骰面的可见状态。每方效果相加。普通攻击减去对方格挡及削弱总值，最低为 0；穿透攻击忽略这些防御。先对双方治疗并限制在最大生命内，再造成玩家伤害；只有存活的敌人才发动攻击。生命最低为 0。回合伤害记录实际扣除的生命，并更新本次冒险的最佳单次掷骰伤害。清楚显示攻击、格挡、治疗、穿透、削弱及最终伤害和治疗。

|骰面|效果|
|---|---|
|sword|3 攻击|
|shield|3 格挡|
|heart|3 治疗|
|skull|5 穿透特殊攻击|
|blank|无效果|
|fire|6 攻击|
|ice|2 攻击与 2 削弱|
|guard|6 格挡|
|renew|6 治疗|
|drain|2 穿透与 2 治疗|
|inferno|8 攻击，首领专用骰面|
|carapace|8 格挡，首领专用骰面|
|devour|4 攻击与 4 治疗，首领专用骰面|

- **R3 — 真实骰面改造。** 提供下列全部 8 件装备，由玩家选择目标骰子。替换操作修改第一个匹配骰面；没有对应骰面时拒绝操作且不收费。新增骰面会扩大该骰子的采样空间。跨战斗保留修改，并提供可查看的每颗骰子全部实际骰面列表。记录获得的装备及目标骰子。战利品可免费选择一件；商店出售装备及价格为 35 金币的新标准骰子，玩家最多拥有 8 颗骰子。拒绝资金不足、目标无效和商店外购买。

|装备 ID|改造|商店价格|
|---|---|---|
|flame|sword → fire|18|
|frost|sword → ice|18|
|armor|blank → guard|16|
|healer|heart → renew|16|
|bone|blank → skull|20|
|vampire|skull → drain|14|
|lucky|blank → sword|12|
|ward|追加一个 shield 骰面|15|

- **R4 — 敌人与首领。** 包含下列 6 种普通敌人与首领，各自有不同插画形象及指定骰子。每颗敌方骰子均采样其列出的骰面数组。精英版本的最大及当前生命乘以 1.6 并向上取整，增加 1 颗骰子。普通胜利奖励 10 金币，精英奖励 20，首领奖励 40。击败普通或精英遭遇后进入战利品；击败首领后本次冒险胜利结束。死亡后本次冒险失败结束。终局不能继续战斗。

|敌人 ID|生命|骰子数|每颗骰子的骰面|
|---|---|---|---|
|goblin|16|2|sword,sword,sword,blank,shield,blank|
|skeleton|20|3|sword,skull,blank,shield,blank,skull|
|witch|22|3|skull,heart,drain,blank,ice,shield|
|golem|30|3|shield,guard,sword,shield,blank,sword|
|slime|24|3|heart,heart,shield,sword,skull,blank|
|wraith|26|3|ice,skull,sword,blank,drain,shield|
|dragon|65|3|inferno,inferno,carapace,devour,skull,sword|

- **R5 — 分支冒险。** 使用下列连通地图，每行所选遭遇或房间完成后开放下一行的两项选择。不可进入尚未到达或已经访问的节点。初始只开放首行。跨节点保留生命、金币、骰子、装备和统计。离开商店前可多次购买可负担商品。休息一次最多恢复 18 生命，然后推进，也可跳过。每次非首领胜利提供 3 项免费装备选择：按上表装备 ID 顺序，以已访问节点数模 8 为起点，取偏移 0,2,4 并模 8。玩家可以跳过战利品。领取奖励或离开后推进地图。

|行|楼层|可达选择|
|---|---|---|
|0|1|`goblin` 战斗或 `slime` 战斗|
|1|1|`shop-1` 或 `rest-1`|
|2|2|`skeleton` 战斗或 `witch` 战斗|
|3|2|`elite-golem` 或 `shop-2`|
|4|3|`wraith` 战斗或 `rest-2`|
|5|3|`elite-witch` 或 `shop-3`|
|6|4|`boss`，使用 dragon 专用骰子|

- **R6 — 完整流程与表现。** 无需重启即可串联带翻滚骰子的插画标题页、地图、战斗、战利品、商店、休息以及胜利或死亡结果。结果显示到达楼层、最佳单次掷骰伤害、获得装备和获胜遭遇数。提供清空旧冒险状态的新冒险操作。使用统一的奇幻骰子美术、不同骰面图标、敌人精灵、装备插画、有主题的生命与重掷及地图商店控件、锁定发光、掷骰动画，以及可见的斩击、格挡、治疗和伤害反馈。1280 × 720 下双方骰盘、生命条、重掷次数和操作须同时可读。390 × 844 下允许滚动，两种尺寸下较长库存均可滚动。
- **R7 — 可验证仿真。** 从 `game.js` 导出 `DiceRun`、`FACES`、`STANDARD`、`ITEMS`、`ENEMIES`、`NODES`、`effects`。`new DiceRun(seed,scenario)` 提供 `screen`、`phase`、`hp`、`maxHp`、`gold`、`dice`、`rolls`、`enemyRolls`、`enemy`、`rerolls`、`equipment`、`available`、`visited`、`current`、`floor`、`wins`、`bestDamage`、`result`、`loot`、`lastEffects`，以及 `start()`、`enter(id)`、`roll()`、`lock(index)`、`reroll()`、`resolve()`、`canEquip(item,index)`、`equip(item,index,source)`、`buyDie()`、`rest()`、`leave()`、`summary()`。玩家掷骰记录含 `face`、`index`、`locked`，敌方结果为骰面 ID。装备来源为 `shop` 或 `loot`。战斗阶段为 `await-roll`、`choose`，界面为 `title`、`map`、`combat`、`loot`、`shop`、`rest`、`result`。界面使用同一引擎。验收可设置独立生命和掷骰结果场景，以验证通用骰面结算而非预编遭遇。
- **R8 — 场景、操作和演示。** 支持 `?seed=` 和确定性场景 `?scenario=combat`（初始 goblin 遭遇）、`?scenario=shop`（首个商店，150 金币、32 生命）、`?scenario=loot`（首次 goblin 已被击败）、`?scenario=near-victory`（首领剩 6 生命，玩家已掷出 5 个 sword，敌方已掷出 3 个 sword）、`?scenario=near-defeat`（goblin 战斗，玩家剩 1 生命且有 5 个 blank，敌方有 2 个 sword）。使用可见的 `#start`、`#node-ID`、`#roll`、`#die-N`、`#reroll`、`#rerolls`、`#resolve`、`#player-dice`、`#enemy-dice`、`#enemy-hp`、`#enemy-preview`、`#hp`、`#gold`、`#floor`、`#dice-count`、`#selected-die`、`#buy-ITEM`、`#loot-ITEM`、`#buy-die`、`#faces-N`、`#continue`、`#rest`、`#status`、`#outcome`、`#result-floor`、`#best-damage`、`#wins`、`#item-count`、`#restart`、`#title`。在 `demo_outputs/` 提供 1–10 条真实输入轨迹，由 `demos.json` 索引，展示正常游玩、骰面改造和终局。轨迹包含可选的 `scenario`、不超过 600 的 `duration_frames`，以及有序的 `events`；事件包含 `frame`、`type`、指针 `x`、`y`、`button` 或键盘 `keycode`。回放在 1280 × 720 下以每秒 30 帧确定性运行。
- **R9 — 完整评测。** 保留启动门槛及 `rubric.md` 全部 18 项标准：机制 15%、内容深度 35%、功能视觉 15%、表现与美术 35%。自动验收覆盖采样、锁定和次数限制、效果、真实装备修改、敌人差异、分支合法性、经济、冒险推进、结果、界面及轨迹回放。艺术质量、构筑多样性和动画精细度须记录审查，功能通过不能填充未审查分数。
