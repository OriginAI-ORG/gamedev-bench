# 左侧生命状态栏

为从 `index.html` 启动的浏览器游戏实现 `game/view.js`，使用本地依赖。

- **R1。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。`host` 内的屏幕 UI 不得跟随世界运动。
- **R2。** 将全高 `#hud` 固定在 `#scene` 左边，最小宽度为 86 像素，背景为不透明的 `rgb(153, 153, 153)`。最小宽度增加时向右增长，左边保持固定。
- **R3。** `#life` 初始显示 `Health: 3`，`#score` 初始显示 `Score: 0`。两者跟随状态值更新。
- **R4。** 将 `#instrument` 沿左边竖直居中。分别使用已加载、可见且尺寸非零的 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`）图片。指针位置跟随 `state.fuel`；不得以进度条代替图片。
- **R5。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示纯色且居中的 `#gameover-card`，其中 `#gameover-title` 显示 `RETRY`。
- **R6。** 保留命中、受伤、平移、增大及重置。重置恢复初始 UI。调整尺寸、增长及世界平移后保持锚定和仪表对齐。

验收使用 1100×760 和 520×800 视口、两次每次 30 像素的增长，并检查图片、状态更新、指针移动、重试覆盖层和重置。公开示例将分数设为 100。不得修改检查或伪造结果。
