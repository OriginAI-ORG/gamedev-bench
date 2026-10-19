# 顶部飞行面板

完成提供的本地浏览器游戏中的 `game/view.js`，游戏由 `index.html` 启动。

- **R1。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。将屏幕 UI 挂载到 `host`，使其独立于世界运动。
- **R2。** `#hud` 铺满 `#scene` 宽度并贴住顶边。最小高度为 58 像素，背景为不透明的 `rgb(153, 153, 153)`。最小高度增加时向下增长，顶边保持固定。
- **R3。** `#life` 初始显示 `Lives: 3`，`#score` 初始显示 `Points: 0`；两者根据状态更新。
- **R4。** 顶部中央的 `#instrument` 包含独立且已加载的图片 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`），两者可见且尺寸非零。指针随 `state.fuel` 移动。不得替换为进度条。
- **R5。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示居中于游戏区的纯色 `#gameover-card`，其中 `#gameover-title` 显示 `GAME OVER`。
- **R6。** 保留提供的命中、受伤、平移、增大和重置控件。重置恢复初始标签并隐藏覆盖层。平移、视口调整及面板增长后必须保持 HUD 锚定和仪表对齐。

验收检查 1100×760 和 520×800 布局、两次每次 30 像素的高度增长、图片、标签、指针移动、覆盖层及重置。公开示例将分数设为 100。使用本地依赖；不得修改检查或伪造结果。
