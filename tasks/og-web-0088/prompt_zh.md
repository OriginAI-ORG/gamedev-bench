# 失败提示顶栏

为提供的浏览器游戏实现 `game/view.js`。入口为 `index.html`，依赖均在本地。

- **R1。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。UI 保持独立于世界运动。
- **R2。** 将全宽 `#hud` 固定在 `#scene` 顶部。最小高度为 58 像素，背景为不透明的 `rgb(153, 153, 153)`。最小高度增加时向下延伸，顶边不动。
- **R3。** 顶栏内放置初始为 `Lives: 3` 的 `#life` 和初始为 `Points: 0` 的 `#score`；根据状态更新。
- **R4。** 将 `#instrument` 锚定在顶部中央。分别加载可见的 `#power-meter`（来自 `meter.svg`）和 `#power-indicator`（来自 `indicator.svg`），尺寸非零。指针位置跟随 `state.fuel`；进度条不满足要求。
- **R5。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示纯色且居中的 `#gameover-card`，其中 `#gameover-title` 显示 `DEFEAT`。
- **R6。** 保持命中、受伤、平移、增大及重置可用。重置恢复初始 UI。视口调整、面板增长及世界平移后仍保持贴边及仪表居中。

验收使用 1100×760 和 520×800 视口、两次每次 30 像素的高度增长，并检查实际图片、标签、指针更新、失败界面和重置。公开示例得到分数 100。不得修改检查或伪造结果。
