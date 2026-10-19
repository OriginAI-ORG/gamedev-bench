# 背包物品资源与槽位

完成 `game/` 中配套本地浏览器游戏的 `inventory.js`；保留 `index.html`。已提供 Item 对象、Slot 渲染、图标和按钮处理器。

- **R1 — 背包。** 导出 `Inventory(grid, slots, {random = Math.random, icon = 'item.svg'} = {})`。保留准确的 grid 和 Slot 对象引用，并拥有初始为空的 `.items` 数组。使用 `item.js` 提供的 `Item` 类，不能用名称或计数器代替物品对象。
- **R2 — 添加。** `addItemResource()` 找到第一个 `slotItemResource` 为 null 的 Slot，创建新的 `Item(icon, quantity)`，将同一个对象追加到 `.items`，调用该槽位的 `setItem(item)` 并返回此对象。数量按 `1 + floor(random() * 20)` 计算，范围包含 1 和 20。每次成功添加必须创建独立对象。所有槽位已满时返回 null，不改变数据或槽位，也不消耗随机数。
- **R3 — 清空。** `clearAllInventoryItems()` 原地清空 `.items`，并调用每个 Slot 的 `setDataEmpty()`。所有槽位资源、图标和数量标签都必须清除。允许重复清空，再次添加从第一个槽位开始。
- **R4 — 集成。** 保留六槽显示以及 Add item、Clear items 和 Reset 控件。配套槽位点击处理器移除一个物品，制造空洞；下次添加填入最靠前的空洞，不覆盖已占用槽位。图标必须真正加载，显示数量与保存的 Item 相同。计数等于保存的资源数量。重置恢复六个空槽和数量 0。

验收检查配套 Slot 方法调用及准确对象身份、首个空槽选择、随机数端点、独立资源、满背包、清空/重新添加、渲染图标与数量同步、空洞填充和重置。公开示例向槽位 0 添加物品。不得修改检查或伪造结果。
