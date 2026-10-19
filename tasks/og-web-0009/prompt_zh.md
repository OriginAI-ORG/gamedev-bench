# Potion Shop

制作完整、温暖的浏览器药剂店，包含按配方酿造、自动顾客、定价、鲜度、声誉、补货、升级和七天经营周期。交付可本地独立运行的 `index.html`；提供的奇幻和药剂店图集为可选美术资源。

- **R1 — 材料与配方。** 初始 45 金币、60 声誉、第 1 天、药水架为空，每种材料各有一批鲜度 3 的库存，数量见下表。初始只知道 heal 和 cure。选择恰好 2 单位材料、gentle/steady/hot 火候及 0 到 5 的整数搅拌次数。实验允许重复材料。每个配方各用一单位所列材料，选择顺序无关。显示已知配方和操作流程；未知配方在成功制作或购书发现前不揭示在手册中。材料不足、无效选择、错误时段、坩埚占用或货架满时拒绝，不得部分消耗。优先消耗最旧/最低鲜度批次，同鲜度按创建先后。开酿立即扣材料。普通酿造耗时 2.5 秒，完成时才生成药瓶。无匹配配方的材料组合仍消耗材料并产生废料。匹配组合即使操作不佳也制作相应药水，并只发现该配方一次。

|材料 ID|名称|初始数量|供应商单价|
|---|---|---|---|
|herb|Sunleaf（日叶草）|8|2|
|mushroom|Dewcap（露帽菇）|6|3|
|crystal|Aether crystal（以太水晶）|6|6|
|moonflower|Moonflower（月光花）|3|8|
|scale|Dragon scale（龙鳞）|2|12|

|药水 ID|名称|材料|火候|搅拌次数|基准价格|
|---|---|---|---|---|---|
|heal|Heartmend（愈心剂）|herb,crystal|gentle|2|12|
|cure|Clearbreath（清息剂）|herb,mushroom|steady|1|10|
|buff|Starstrength（星力剂）|crystal,scale|hot|3|30|
|antidote|Venomquiet（静毒剂）|mushroom,moonflower|gentle|3|18|

- **R2 — 品质、容量与老化。** 品质等于消耗材料中的最低鲜度加 2，火候错误减 2，再减去 2 与搅拌次数绝对误差中的较小值，限制在 1–5。显示瓶装品质和材料批次鲜度。货架初始可容纳 6 瓶。每批材料和每瓶药水拥有唯一 ID。每个次日早晨将现有材料鲜度减 1，最低 0；药瓶年龄加 1、品质减 1，最低 1。年龄到达 3 的药瓶移除并计入浪费。早晨/晚上可丢弃最旧材料单位或指定药瓶以管理容量/鲜度；丢弃药瓶计入浪费，丢弃材料不退款。不可能的丢弃操作必须拒绝且无变化。不能用无限材料或免费药瓶绕过库存。
- **R3 — 时段与自动顾客。** 早晨可酿造，开门售卖时不得有未完成酿造。下午顾客每 4 秒到达一名，第一名立即出现，浏览 2 秒后自动购买匹配药水。顾客顺序为 knight,gardener,apprentice,merchant，按天数减 1 轮转并按需重复。每名顾客有独立耐心和状态。优先考虑最旧的匹配药瓶。售价必须不超过预算，也不超过“基准价乘以品质除以 5 再乘以 1.4”向下取整，才能成交。否则等到耐心耗尽，仍无匹配库存则缺货离开，有匹配但无法接受价格则过贵离开。手动推荐可提前处理等待顾客；推荐错误类型导致拒绝，不消耗药瓶或支付金币；推荐缺货药水则拒绝操作，不改变该顾客。每次成交恰好移除一瓶，按当前售价收入并只处理该顾客一次。全部计划顾客处理完或达到 60 秒时自动结束售卖，关门时剩余顾客被拒绝。晚上可以采购材料、书籍和升级，合上账本显示日报，再推进次日；第 7 天后进入周报。跨日保留状态。

|顾客 ID|需求|预算|耐心秒数|视觉身份|
|---|---|---|---|---|
|knight|cure|14|8|咳嗽的披甲旅客|
|gardener|heal|18|12|受伤的年长园丁|
|apprentice|antidote|24|6|中毒的年轻学徒|
|merchant|buff|38|10|疲惫的旅行商人|

- **R4 — 定价、声誉与需求。** 药水售价默认等于基准价，接受 1–60 的整数，改价会影响等待中的顾客和后续需求。声誉限定在 0–100。成交的声誉变化为品质减 3，售价不超过基准价 0.8 倍时加 2，高于基准价时减 2，再加装饰奖励；该变化限制在 −3 到 4。错误推荐扣 4 声誉，过贵拒绝扣 2，缺货拒绝扣 3。开门时，顾客数为 6 加“声誉减 50 后除以 20 向下取整”，若四种售价/基准价比例的平均数不超过 0.8 则再加 2，超过 1.2 则减 2，最终限制在 4–12。开门后冻结当天人数。因此低价必须改变实际未来客流，不能只改标签。显示需求、预算、耐心、购买/失望反馈和声誉后果。
- **R5 — 供应、书籍和改进。** 晚上可按单价购买所选材料 1–20 单位，创建鲜度 3 的新批次。未知配方书价格 15 金币，已知配方不能重复购买。采购必须有足够金币且不可部分执行。包含下表全部升级，每项仅买一次。花园在后续早晨的现有库存老化之后产出新材料。将全部供应/书籍/升级支出与收入分开统计。玩家可用收益改善后续容量和效率。

|升级 ID|费用|永久效果|
|---|---|---|
|shelves|30|药瓶容量由 6 增至 12。|
|cauldron|35|酿造时间由 2.5 秒缩短为 1.25 秒。|
|garden|40|每个后续早晨增加 2 单位新鲜 herb 和 1 单位新鲜 mushroom。|
|decor|25|每次成交额外增加 1 声誉，仍受通常变化上限约束。|

- **R6 — 完整表现与记录。** 无需重启即可连接插画标题、早晨酿造、下午售卖、晚上采购、日报和周报。每日记录显示酿造/售出/不满数量、收入、支出、浪费、新配方、期初/期末金币和声誉。周报汇总这些数量，并显示营业天数、剩余金币、声誉、已知配方、升级和七天账本。新店清除全部进度。使用统一、温暖的魔法室内环境，配有真实插画货架、木质表面、草药、灯光、坩埚、可识别的材料/药水精灵，以及独立顾客肖像/症状图标。提供酿造气泡、药瓶生成/发光、顾客到店和购买/失望、材料闪光、可见补货及更新价签。配方卡、菜单和 HUD 须主题化。在 1280 × 720 下主店区域和当前操作须清晰且不重叠；较长配方手册、队列和供应商可滚动。在 390 × 844 下允许滚动。
- **R7 — 可测试模拟。** 从 `game.js` 导出 `PotionShop`, `INGREDIENTS`, `RECIPES`, `CUSTOMERS`, `ORDER`, `UPGRADES`。`new PotionShop(scenario)` 暴露 `screen`, `phase`, `day`, `gold`, `rep`, `lots`, `stock`, `known`, `prices`, `upgrades`, `brewing`, `customers`, `traffic`, `arrived`, `time`, `daily`, `totals`, `reports`, `message`, `capacity`, `brewSeconds`。页面为 `title`, `shop`, `report`, `result`，时段为 `morning`, `sales`, `evening`。材料批次有 `id`, `kind`, `qty`, `fresh`，药瓶有 `id`, `kind`, `quality`, `age`。顾客有 `id`, `kind`, `need`, `budget`, `patience`, `remaining`, `browse`, `status`, `reason`, `paid`。方法为 `start()`, `count(kind)`, `beginBrew(kinds,heat,stirs)`, `step(seconds)`, `setPrice(kind,value)`, `expectedTraffic()`, `openSales()`, `active()`, `offer(customerId,kind)`, `buyIngredient(kind,qty)`, `buyBook(kind)`, `upgrade(kind)`, `discardIngredient(kind,qty)`, `discardPotion(id)`, `closeDay()`, `nextDay()`, `summary()`。界面使用同一模拟。验收可设置独立库存/鲜度/顾客夹具；完整周测试必须使用合法酿造、销售、采购和跨日操作。
- **R8 — 场景、控件和录制。** 支持 `?scenario=brew` 进入初始早晨；`?scenario=quality` 将初始全部材料鲜度设为 1；`?scenario=sales` 进入第 1 天售卖，依次有六瓶品质 5 的 cure,heal,antidote,buff,cure,heal；`?scenario=low-stock` 无药瓶、10 金币、30 声誉并开始售卖；`?scenario=restock` 进入首日晚间，120 金币且无 herb；`?scenario=near-week` 进入第 7 天晚上，100 金币且之前日报历史为空。场景预置库存不计为已酿造。保留可见选择器 `#start`, `#gold`, `#rep`, `#day`, `#phase`, `#clock`, `#capacity`, `#ingredient-KIND`, `#count-KIND`, `#mix`, `#heat`, `#stirs`, `#brew`, `#clear`, `#brew-progress`, `#brew-state`, `#stock-KIND`, `#price-KIND`, `#discard-ID`, `#discard-ingredient-KIND`, `#traffic`, `#customers`, `#customer-ID`, `#offer-ID`, `#offer-kind`, `#open-sales`, `#close-day`, `#known-count`, `#recipe-KIND`, `#quantity`, `#buy-KIND`, `#book-KIND`, `#upgrade-KIND`, `#report-brewed`, `#report-sold`, `#report-unhappy`, `#report-earned`, `#report-spent`, `#next-day`, `#outcome`, `#result-days`, `#total-brewed`, `#total-sold`, `#total-earned`, `#total-spent`, `#restart`, `#status`。在 `demo_outputs/` 中提供 1–10 个真实输入轨迹，由 `demos.json` 索引，覆盖正常酿造/销售、补货/升级和周报过渡。轨迹包含可选 `scenario`、不超过 600 的 `duration_frames`、有序 `events`，包含 `frame`, `type`、指针 `x`, `y`, `button` 或键盘 `keycode`。以每秒 30 帧和 1280 × 720 确定性回放。
- **R9 — 完整评估。** 保留 `rubric.md` 中启动门槛和全部 18 项标准，权重为机制 15%、深度 35%、功能视觉 15%、表现/美术 35%。自动检查覆盖材料消耗、配方/发现、操作/鲜度品质、容量、限时酿造、自动需求/耐心/价格、库存/金钱、全部升级、老化、完整周、报告、界面及轨迹回放。美术一致性、动画和经济平衡须有记录的审查，功能通过不会填入未审查分数。精确配方、价格、时间、客流公式、丢弃操作和公开接口是为可重复验证新增的约束，限制了开放设计，并不证明难度完全相同。
