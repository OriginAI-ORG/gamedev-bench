# 牌堆工具

实现 `game/` 中配套本地浏览器游戏的 `pile.js`；保留 `index.html`。使用 `card.js` 提供的 `Card` 类，不能用字符串代替卡牌对象。

- **R1 — 可复用牌堆。** 导出 `CardPile extends EventTarget`，构造参数为 `(cards = [], random = Math.random)`。保留独立可变的 `cards` 数组，其中保存原 Card 对象引用。新牌堆为空。遇到非 Card 元素时，在改变牌堆或发送事件之前抛出 TypeError。
- **R2 — 操作与事件。** `empty()` 返回布尔值。`addCard(card)` 追加卡牌。`drawCard()` 移除并返回队首对象，空堆时返回 null 且不发送事件。每次成功添加/抽取后，发送一次 `size-changed` CustomEvent，`detail: {count}`。`clear()` 原地清空数组并发送 count 0，即使原来已经为空。
- **R3 — 洗牌与列表。** `shuffle()` 使用传入的随机函数原地打乱既有数组，保留所有对象引用及重复出现次数，不发送数量事件。采用 Fisher–Yates：从 length−1 到 1 遍历索引，选择 `floor(random() * (i+1))`。`toString()` 每行输出 `index: card_id`，序号从 1 开始，末尾没有换行；空堆返回空字符串。
- **R4 — 集成。** 保留配套抽牌/加牌/洗牌/清空/重置控件，以及可见牌面、费用、计数、抽出的牌、列表和事件日志。配套环境初始为 strike（1）、defend（1）、bash（2）；Reset 恢复这些显示并清空事件日志。计数必须从数量事件更新，不能维护平行计数器。

验收检查任意卡牌、对象身份及重复项保留、准确事件数量/顺序、空堆操作、确定性随机探测、非法类型、独立牌堆和可见 UI。公开示例抽出 strike 并检查数量为 2。不得修改检查或伪造结果。
