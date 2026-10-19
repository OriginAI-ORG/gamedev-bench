# 左侧失败侧栏

完成提供的浏览器游戏中的 `game/view.js`。使用 `index.html` 和本地资源。

- **R1。** 导出 `mountHud(host, config, actions)`，提供 `render(state)`、`setMinimum(value)` 和 `dispose()`。屏幕 UI 独立于世界运动。
- **R2。** 全高 `#hud` 贴住 `#scene` 左侧。最小宽度为 86 像素，背景为不透明的 `rgb(153, 153, 153)`。增加最小宽度时从固定左边向右增长。
- **R3。** `#life` 初始为 `Ammo: 3`，`#score` 初始为 `Score: 0`。根据状态更新。
- **R4。** 左侧中央的 `#instrument` 包含两张已加载、可见且尺寸非零的图片：来自 `meter.svg` 的 `#power-meter` 和来自 `indicator.svg` 的 `#power-indicator`。指针随 `state.fuel` 移动；原生进度条不满足要求。
- **R5。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示纯色且居中的 `#gameover-card`，其中 `#gameover-title` 显示 `DEFEAT`。
- **R6。** 保留命中、受伤、平移、增大及重置；重置恢复初始 UI。视口调整、增长及世界平移后仍保持全高锚定和仪表居中。

验收检查 1100×760 和 520×800 视口、两次每次 30 像素的宽度增长、图片、标签、指针更新、失败界面及重置。公开示例得到分数 100。不得修改检查或伪造结果。
