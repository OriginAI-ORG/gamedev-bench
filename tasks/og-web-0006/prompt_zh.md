# Word Spell

制作完整的浏览器拼词施法 Roguelike：在时间压力下拼词，改造永久字母池，选择穿过三层地牢的路线并击败首领。交付可本地独立运行的 `index.html` 包。保留提供的 `dictionary.js` 词典；提供的奇幻和骰子图集为可选美术资源。

- **R1 — 字母池、手牌和词语。** 新一局拥有 65/65 生命、20 金币和 20 个独立普通字母，顺序为 A,A,E,E,E,I,I,O,R,R,S,S,T,T,L,N,D,C,H,F。每个字母块有唯一 ID。每个战斗回合前对整个永久字母池执行 Fisher–Yates 洗牌，抽取 7 个不同 ID。抽取不会永久消耗字母。使用无符号 32 位 xorshift，位移为 13,17,5，除以 4294967296，默认种子 42，零种子改为 1。将字母拖入有序拼词栏，允许重排和放回手牌；点击和键盘字母也可操作，Enter 施法、Backspace 放回最后一块、Delete 清空。一块字母不能在同一词中重复使用。忽略大小写，精确校验提供的 2053 词词典，长度须为 3–7。无效词、空白施法和重抽/跳过都会浪费回合并允许敌人响应。有效词伤害为词长乘以所用字母权重之和；普通权重为 1，因此普通词伤害是词长的平方。
- **R2 — 元素与结算顺序。** 有效词包含 fire,ice,heal 时触发相应元素；附魔字母也能触发。每种元素每次施法只触发一次。火焰增加 4 点即时伤害，并在接下来的 2 次敌人响应各造成 3 点燃烧伤害，包括本次施法后的响应；弱火敌人每次受到 6 点燃烧伤害。冰冻阻止接下来 1 次敌人攻击，弱冰敌人为 2 次。治疗恢复 6 生命，不超过上限。若词语触发敌人的弱点元素，先将词语伤害乘以 1.5 向下取整，再加火焰伤害。依次应用治疗和状态、即时词语/火焰伤害、未使用诅咒字母的惩罚；同时击杀时玩家死亡优先。玩家存活且敌人被击败则进入奖励/胜利；否则先结算燃烧再攻击，燃烧致死会阻止攻击。消耗一次冰冻代替攻击，否则应用显示的攻击伤害；被冰冻时也推进攻击序列。双方存活则抽新手牌并重置倒计时。生命最低为 0；总伤害记录实际扣除的敌人生命，包括燃烧。再次燃烧将剩余持续时间设为 2；冰冻保留较大的剩余持续时间。
- **R3 — 倒计时和敌人。** 显示双方生命、下一次攻击伤害、弱点、状态持续时间和实时递减的秒数。施法立即触发响应；倒计时归零则自动跳过并重抽，无需输入。只有战斗中计时。包含下列 6 种具有独立美术和配置的普通敌人及首领；攻击序列循环。普通胜利奖励 12 金币，首领奖励 40。普通胜利提供奖励；首领胜利或玩家死亡结束本局，禁用战斗。

|敌人 ID|生命|攻击序列|每回合秒数|弱点|
|---|---|---|---|---|
|goblin|30|4|20|fire|
|slime|36|4,6|18|ice|
|skeleton|42|6,8|16|heal|
|witch|46|7,4,9|15|fire|
|golem|64|8,10|13|ice|
|wraith|56|6,11|12|heal|
|dragon|135|10,14,8|12|ice|

- **R4 — 五种特殊字母。** 支持权重 2 的 gold 元音；权重 1 的 ember,frost,blessed 辅音在有效词中分别触发 fire,ice,heal；以及适用于任意字母、权重 3 的 cursed。当前手牌中未用于有效词的每个诅咒字母扣除 2 生命；无效词/跳过会惩罚该手牌中所有诅咒字母。用独立制作的图标区分变体，不能仅靠换色。升级只适用于普通字母，商店收费 10 金币，奖励中免费。不兼容的字母/类型、已特殊的目标、无效 ID 或余额不足都必须拒绝且不改变状态。升级必须影响后续抽取，不能只改标签。
- **R5 — 永久字母池管理。** 商店出售下表所有条目；新字母拥有全新 ID 并计入收集数量。出售任意字母获得 5 金币；奖励中的移除免费。字母池不得少于 7 块。每次普通胜利后只能选择一次添加、升级或移除，也可跳过：第 1 层添加项为 gold-e,ember-f,rare-g；第 2 层为 frost-c,blessed-h,rare-m；第 3 层为 cursed-z,gold-e,ember-f。余额足够时商店可多次交易。交易只能发生在对应房间，奖励不可重复领取。显示可检查的完整字母池和目标选择。休息最多恢复 20 生命一次并前进，也可跳过。

|商品 ID|字母|类型|价格|
|---|---|---|---|
|gold-e|E|gold|12|
|ember-f|F|ember|14|
|frost-c|C|frost|14|
|blessed-h|H|blessed|14|
|cursed-z|Z|cursed|8|
|rare-g|G|normal|6|
|rare-m|M|normal|6|

- **R6 — 分支冒险。** 从首行开始；完成一个选项后开放下一行的两个节点。拒绝未开放或已访问节点。房间之间保留生命、金币、字母池和统计。最终首领的生命足以承受多个普通强词。

|行|层|选项|
|---|---|---|
|0|1|`goblin` 或 `slime` 战斗|
|1|1|`shop-1` 或 `rest-1`|
|2|2|`skeleton` 或 `witch` 战斗|
|3|2|`shop-2` 或 `rest-2`|
|4|3|`golem` 或 `wraith` 战斗|
|5|3|`shop-3` 或 `rest-3`|
|6|3|`boss` 使用 dragon|

- **R7 — 完整流程和表现。** 无需重启即可连接标题、地图、战斗、奖励、商店、休息和胜利/死亡页面。结果显示到达层数、最长有效词、实际总伤害、收集字母数（排除初始字母池）、元素触发总数及各元素次数。分数为层数乘以 100，加最长词长乘以 25，再加总伤害。新一局清除旧进度。使用统一的奥术美术方向，包含敌人插画、字母块纹理、特殊图标、主题地图节点以及 HUD/商店/结果面板。标题将字母排列成动态法术。提供字母吸附、施法与元素爆发、敌人受伤反应和无效词消散反馈。在 1280 × 720 下，手牌、拼词栏、生命、攻击预告、倒计时、元素和操作必须同时清晰可读。在 390 × 844 下允许滚动；较长字母池在两种尺寸均可滚动。
- **R8 — 可测试模拟。** 从 `game.js` 导出 `WordRun`, `INITIAL`, `KINDS`, `OFFERS`, `ENEMIES`, `NODES`。`new WordRun(seed,scenario)` 暴露 `screen`, `pool`, `hand`, `bar`, `hp`, `maxHp`, `gold`, `enemy`, `countdown`, `available`, `visited`, `current`, `row`, `floor`, `reward`, `longest`, `totalDamage`, `tilesCollected`, `triggers`, `turns`, `result`, `last`；字母记录包含 `id`, `letter`, `kind`，手牌/拼词栏保存 ID。提供 `start()`, `tile(id)`, `draw()`, `enter(id)`, `select(id,index)`, `unselect(id)`, `clear()`, `preview()`, `cast()`, `pass()`, `step(seconds)`, `add(offer,source)`, `upgrade(id,kind,source)`, `remove(id,source)`, `rest()`, `leave()`, `summary()`。界面使用同一模拟。来源为 `shop` 或 `reward`；添加默认商店，其他交易默认当前页面。预览返回 `word`, `valid`, `elements`, `damage`；最近结算另记录 `incoming`, `penalty`, `healed`, `burn`, `frozen`。敌人状态包含 `id`, `hp`, `maxHp`, `attacks`, `seconds`, `weak`, `burn`, `frozen`, `turn`。验收可设置独立手牌、生命和状态夹具，但完整流程测试必须使用实际抽取和合法选择。
- **R9 — 浏览器控件和录制。** 支持 `?seed=` 和 `?scenario=combat` 进入初始 goblin 战斗；`?scenario=spell` 使用不同 ID 组成 FIREHEA 手牌；`?scenario=shop` 进入首个商店，拥有 100 金币和 40 生命；`?scenario=reward` 进入首个 goblin 奖励；`?scenario=near-victory` 使用生命 6 的首领及 FIREHEA 手牌；`?scenario=near-defeat` 使用同样手牌、goblin、玩家生命 1，剩余 0.6 秒。保留可见选择器 `#start`, `#node-ID`, `#hp`, `#gold`, `#floor`, `#pool-count`, `#hand`, `#tile-ID`, `#bar-ID`, `#spelling-bar`, `#word`, `#preview`, `#elements`, `#enemy-hp`, `#attack`, `#countdown`, `#cast`, `#clear`, `#pass`, `#effect-log`, `#selected-tile`, `#upgrade-kind`, `#upgrade`, `#remove`, `#buy-OFFER`, `#reward-OFFER`, `#continue`, `#rest`, `#status`, `#outcome`, `#result-floor`, `#longest`, `#total-damage`, `#collected`, `#trigger-count`, `#score`, `#restart`。在 `demo_outputs/` 中提供 1–10 个真实输入轨迹，由 `demos.json` 索引，覆盖正常游玩、元素施法、字母池管理和终局。轨迹字段为可选 `scenario`、不超过 600 的 `duration_frames`、按顺序排列的 `events`，包含 `frame`, `type`、指针 `x`, `y`, `button` 或键盘 `keycode`。以每秒 30 帧、1280 × 720 回放，结果可重复。
- **R10 — 完整评估。** 保留 `rubric.md` 中全部 18 项标准及启动门槛：机制 15%、内容深度 35%、功能视觉 15%、表现/美术 35%。自动检查覆盖实际抽取、词典校验、伤害、元素、倒计时、特殊字母、经济、分支、完整通关、结果、界面和输入演示。美术质量、动画细节和策略平衡须有记录的审查；功能通过不会填入未审查分数。固定词典、数值、地图和接口为了可重复评估而限制了设计自由。
