# 右侧生命面板

完成 `game/view.js` 中的屏幕 HUD。提供的本地游戏从 `index.html` 启动。

- **R1。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。`host` 内的 UI 独立于世界运动。
- **R2。** `#hud` 铺满 `#scene` 高度并固定在右边。最小宽度为 86 像素，背景为不透明的 `rgb(153, 153, 153)`。最小宽度增长时从固定右边向左延伸。
- **R3。** `#life` 初始显示 `Health: 3`，`#score` 初始显示 `Score: 0`；根据状态更新。
- **R4。** 将 `#instrument` 竖直居中并贴住右边。使用两张独立且已加载的图片 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`），可见且尺寸非零。指针随 `state.fuel` 移动；不得替换为进度条。
- **R5。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示居中于游戏区的纯色 `#gameover-card`，其中 `#gameover-title` 显示 `RETRY`。
- **R6。** 保留命中、受伤、平移、增大及重置；重置恢复初始 UI。视口变化、世界平移及面板增长后保持 HUD 贴边和仪表居中。

验收检查 1100×760 和 520×800 布局、两次每次 30 像素的宽度增长、图片、状态更新、指针移动、重试覆盖层及重置。公开示例将分数设为 100。使用本地依赖；不得修改检查或伪造结果。
