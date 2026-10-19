# Kingdom Cards

制作完整的浏览器策略游戏，由真实牌库驱动建设、招募、战争和外交，对抗两个会主动行动的王国。交付可本地独立运行的 `index.html`。提供的奇幻和羊皮纸图集为可选美术资源。

- **R1 — 真实牌库与回合。** 玩家初始拥有 12 金币、8 食物、8 士兵，16 张牌按此顺序组成牌库：farm,farm,market,barracks,militia,militia,militia,guard,guard,raid,raid,assault,assault,truce,trade,betrayal。每张牌有唯一 ID。使用 Fisher–Yates 洗牌和无符号 32 位 xorshift，位移 13,17,5，除以 4294967296；默认种子 42，零改为 1。按玩家、red、blue 顺序初始化，使用共享随机流。各阵营初始牌库先洗牌，再从牌堆末尾给玩家抽 5 张、各对手抽 3 张。玩家每回合最多点击打出 3 张牌，实际支付费用、应用效果，再将已打出的牌移入弃牌堆。无效目标、余额不足或次数用完必须拒绝，不消耗卡牌/资源。回合结束时选择保留或永久移除未打出的牌，其余弃置。保留和移除选择必须有效、不重复且互斥。保留牌留在手中，下回合再抽最多 5 张。抽牌堆空时洗入弃牌堆，不复制手中或已移除的牌；两堆都空则停止抽牌。显示手牌、抽牌/弃牌数量、存续牌库总大小及永久移除的牌。手牌无上限，较长手牌可以滚动。
- **R2 — 领土与产出。** 使用下表的连接地图。House Alder 为 player，Crimson Crown 为 red，Azure League 为 blue。中立领地不给任何阵营产出。每块己方领土在回合结束、对手行动前提供表中资源。每地最多建一个农场、市场和兵营，只有所有者可建造。农场每回合额外产 3 食物，市场产 3 金币，兵营产 2 士兵且永久增加当地防御 2。占领后保留建筑。新建筑永久向建造者弃牌堆添加一张更强卡：农场给 harvest，市场给 tax，兵营给 veterans。新增牌使用全新 ID 并记录；成功占领给 siege。建造立即付费，产出等到回合结束。

|领土 ID|初始归属|防御|每回合金币/食物/士兵|相邻 ID|
|---|---|---|---|---|
|crown|player|6|2/1/0|meadow,quarry|
|meadow|neutral|3|0/3/0|crown,wood,redkeep|
|quarry|neutral|5|3/0/0|crown,wood,harbor|
|wood|neutral|4|1/2/0|meadow,quarry,redkeep,harbor|
|redkeep|red|7|1/0/2|meadow,wood|
|harbor|blue|6|2/1/0|quarry,wood|

- **R3 — 不同卡牌效果。** 包含下表全部卡牌，使用不同的独立制作插画，清晰显示类别、费用和效果。guard 要求己方目标，普通招募和补给不需要目标。进阶卡牌在招募、进攻或即时资源方面显著强于基础卡。

|卡牌 ID|类别|金币费用|食物费用|效果|
|---|---|---|---|---|
|farm|build|3|0|建农场，获得 harvest。|
|market|build|4|0|建市场，获得 tax。|
|barracks|build|5|2|建兵营，获得 veterans。|
|militia|recruit|0|2|获得 4 士兵。|
|guard|recruit|1|1|获得 3 士兵，目标防御增加 2。|
|veterans|recruit|1|3|获得 8 士兵。|
|raid|attack|0|0|投入军队战力 +1。|
|assault|attack|2|0|投入军队战力 +3。|
|siege|attack|3|0|投入军队战力 +6。|
|truce|diplomacy|5|0|与一个存活对手互不攻击，持续 2 个对手阶段。|
|trade|diplomacy|0|3|给对手 3 食物，取其 6 金币。|
|betrayal|diplomacy|2|0|打破有效停战并攻击该对手，战力 +4。|
|harvest|provision|0|0|获得 6 食物。|
|tax|provision|0|0|获得 8 金币。|

- **R4 — 实际军队与外交。** 只能进攻与任意己方领土相邻的敌方/中立领地。选择 1 到现有士兵数之间的整数军队，结算前扣除全部投入。战力为军队加卡牌加成，必须严格大于防御才能占领。胜利后返还幸存军队，为 0 与“投入数减去对抗战力除以 2 向上取整”中的较大值。单次攻击的对抗战力是目标防御；失败则投入部队全部损失。占领改变归属，防御重置为 2，若保留兵营再加 2。停战双向阻止攻击，每个对手阶段结束后减一次，续约设为 2。贸易要求对手存活且至少有 6 金币，两种资源必须真实转移。背叛要求与目标所有者有有效停战，取消停战后攻击，不能免费攻击任意敌人。失败交易不得产生部分效果。
- **R5 — 两个主动对手与同时指令。** 每个对手初始 10 金币、8 食物、5 士兵，牌库顺序为 militia,raid,farm,assault,market,guard,militia,raid。每个对手阶段在产出后，两个存活对手从同一棋盘/资源状态规划，任一指令结算前两者都已决定。各自最多打出一张真实手牌：优先可获胜的相邻攻击，目标依次优先中立、玩家、另一对手；同优先级按防御升序，平局保持地图顺序。按手牌顺序寻找可用攻击，投入全部现有部队。否则按手牌顺序尝试在其首块领地招募，再按手牌/领土顺序尝试合法建造，最后尝试补给。都不可用则跳过。应用已规划的非攻击效果并支付所有军队投入，再按目标分组结算攻击。多个攻击者同时争夺原守方领地：必须有唯一最高攻击战力且严格超过防御才能占领，平局保留守方控制。胜者的损失基数是防御与第二攻击者战力中的较大值，失败攻击者损失所有投入。只有胜者获得卡牌。目标分组按指令首次出现顺序结算。显示实际对手指令、战斗、领土扩张和损失。非终局阶段后弃置对手剩余手牌，各存活对手重新抽 3 张。被消灭者停止行动。不能用装饰性战报代替对手出牌。
- **R6 — 完整战役与历史。** 从插画标题进入第 1 回合。拥有全部 6 块领土获胜，失去全部领土失败。在玩家每张卡后及完整对手阶段后检查终局，结束后禁止继续行动。保存战役开始、每个目标战斗结算后、每个对手阶段后的领土历史快照，并包含终局快照。结果显示胜负、回合、领地、牌库大小、新增/移除卡数、资源和可导航的可视化领土历史。新战役重置全部状态。使用统一羊皮纸与墨线美术、插画政令卡、地形/城堡/农场、归属旗帜、资源图标、蜡封回合控件，以及可见建造/战斗/移除/占领反馈、卡牌/回合过渡动画和地图环境动态。在 1280 × 720 下，初始手牌、地图、资源、牌库/回合数及操作控件须清晰且不重叠。在 390 × 844 下允许滚动。
- **R7 — 可测试模拟。** 从 `game.js` 导出 `KingdomRun`, `CARDS`, `INITIAL`, `MAP`, `FACTIONS`。`new KingdomRun(seed,scenario)` 暴露 `screen`, `turn`, `plays`, `map`, `actors`, `truces`, `history`, `log`, `lastBattles`, `lastOrders`, `result`, `message`。阵营 ID 为 `player`, `red`, `blue`，各有 `gold`, `food`, `troops`, `hand`, `draw`, `discard`, `gained`, `trashed`。卡牌记录包含 `id`, `kind`，领土包含 `id`, `owner`, `fort`, `yield`, `links`, `structures`。提供 `start()`, `territory(id)`, `owned(actor)`, `deckSize(actor)`, `drawCards(actor,count)`, `gain(actor,kind)`, `adjacent(actor,target)`, `peace(a,b)`, `canPlay(actor,cardId,targetId,committed)`, `play(cardId,targetId,committed)`, `income()`, `planAI(actor)`, `rivalPhase()`, `resolveAttacks(attacks)`, `endTurn(trashIds,keepIds)`, `checkEnd()`, `summary()`。界面使用同一模拟。独立夹具可以设置手牌、资源、归属和防御；完整战役必须使用实际抽牌和合法选择。攻击记录包含 `actor`, `target`, `committed`, `strength`, `card`，投入军队须在 `resolveAttacks(attacks)` 之前扣除。
- **R8 — 控件、场景和录制。** 支持 `?seed=`；`?scenario=economy` 手牌为 farm,market,barracks,militia,guard，拥有 30 金币/20 食物；`?scenario=diplomacy` 手牌为 truce,trade,betrayal,assault,guard，拥有 30 金币/20 食物/20 士兵，meadow 归 red，red 金币为 30；`?scenario=near-victory` 除防御 3 的 blue harbor 外全部归玩家，玩家士兵 12，手牌为 raid,militia,guard,farm,market；`?scenario=near-defeat` 除防御 1 的玩家 crown 外全部归 red，玩家士兵 0，red 士兵 12、手牌只有 raid，抽牌/弃牌为空。场景替换手牌时保留现有匹配卡的 ID，把其他玩家卡放入抽牌堆，只有缺少该类型时才新增 ID。保留可见选择器 `#start`, `#gold`, `#food`, `#troops`, `#turn`, `#deck-size`, `#kingdom-map`, `#territory-ID`, `#territory-detail`, `#commit`, `#rival`, `#truce-red`, `#truce-blue`, `#end-turn`, `#plays`, `#trashed`, `#hand`, `#card-ID`, `#play-ID`, `#keep-ID`, `#trash-ID`, `#status`, `#gained`, `#orders-log`, `#battle-log`, `#outcome`, `#result-kind`, `#result-turn`, `#result-territories`, `#gained-count`, `#history-prev`, `#history-next`, `#history-position`, `#history-event`, `#restart`。在 `demo_outputs/` 提供 1–10 个真实输入轨迹，由 `demos.json` 索引，覆盖正常游玩、永久牌库变化、外交和终局。轨迹包含可选 `scenario`、不超过 600 的 `duration_frames` 和有序 `events`，包含 `frame`, `type`、指针 `x`, `y`, `button` 或键盘 `keycode`。在 1280 × 720、每秒 30 帧下确定性回放。
- **R9 — 完整评估。** 保留 `rubric.md` 全部 18 项标准及启动门槛，权重为机制 15%、深度 35%、功能视觉 15%、表现/美术 35%。自动检查覆盖真实卡牌身份/抽取/保留/移除、出牌限制、经济、建筑、进阶卡获取、战斗、同时行动对手、外交、完整战役、历史、界面和轨迹回放。美术一致性、动画和策略平衡须有记录的审查，功能通过不会填入未审查值。精确卡牌、地图、AI 策略、洗牌及接口为了可重复验证而限制了原先的开放设计，不证明难度完全相同。
