# 右侧飞行面板

完成提供的浏览器游戏中的 `game/view.js`，使用本地依赖从 `index.html` 启动。

- **R1。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。`host` 内的 UI 必须独立于世界运动。
- **R2。** `#hud` 铺满 `#scene` 高度并贴住右边。最小宽度为 86 像素，背景为不透明的 `rgb(153, 153, 153)`。最小宽度增加时向左增长，右边保持固定。
- **R3。** `#life` 初始显示 `Lives: 3`，`#score` 初始显示 `Points: 0`。两者根据状态更新。
- **R4。** 将 `#instrument` 竖直居中并贴住右边。使用独立且已加载的 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`）图片，可见且尺寸非零。指针随 `state.fuel` 移动；不得替换为进度条。
- **R5。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示居中于游戏区的纯色 `#gameover-card`，其中 `#gameover-title` 显示 `GAME OVER`。
- **R6。** 保留命中、受伤、平移、增大及重置。重置恢复初始 UI。视口变化、增长及世界平移后保持全高贴边及仪表居中。

验收检查 1100×760 和 520×800 布局、两次每次 30 像素的宽度增长、图片、状态和指针变化、覆盖层及重置。公开示例将分数设为 100。不得修改检查或伪造结果。
