# 关联物品资源的出售传送门

完成 `game/` 中配套本地浏览器游戏的 `portal.js`；保留 `index.html`。配套环境提供可拖动的 Unit 对象、重叠事件、PortalView、玩家属性和可复用单位池。

- **R1 — 连接。** 导出 `SellPortal(view, units, playerStats, unitPool)`。订阅 `view.events` 的 `unit-enter` 和 `unit-exit` 事件，`detail` 为 Unit。扫描传入的单位，调用 `setupUnit(unit)` 连接各 Unit 的 `dropped` 和 `quick-sell` 事件。重复 setup 不得重复订阅。提供 `onEnter(unit)`、`onExit(unit)`、`update()`、`sellUnit(unit)` 与 `dispose()`。
- **R2 — 预览。** 进入时将准确的 Unit 引用保存为 `.currentUnit`，通过 `view.setHighlighted(true)` 高亮，并用 `view.showGold(value)` 显示 `unit.stats.getGoldValue()`。每次 `update()` 调用 `view.faceUnit(currentUnit)`，让可见生物朝向单位。当前 Unit 离开后清除引用，以 `showGold(null)` 隐藏预览并移除轮廓。其他 Unit 离开不能清除当前单位。
- **R3 — 出售。** 只有被放下或快捷出售的 Unit 是当前重叠单位、且此前没有卖出时才出售。标记已出售，将计算出的金币价值加入 `playerStats.gold`，把准确的属性对象传给 `unitPool.addUnit(stats)`，调用 `unit.remove()`，最后清除预览和当前单位。重复事件及其他单位的放下事件不得重复结算或卖错实例。
- **R4 — 集成与清理。** 保留指针拖放、S 快捷出售、取消和重置。Swift Rogue 价值为 3（3×1），Stone Champion 为 12（4×3）。显示金币、剩余单位和返还资源名称。`dispose()` 移除重叠/单位订阅并清除预览；Reset 恢复两个新单位、金币归零，不能残留旧监听器。

验收检查动态价格、返还资源的准确身份、两种事件路径、错误单位放下、一次性移除、重叠离开、精灵朝向、销毁和可见拖放/重置行为。公开示例将 Swift Rogue 放入传送门并获得 3 金币。不得修改检查或伪造结果。
