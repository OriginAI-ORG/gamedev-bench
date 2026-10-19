# 顶部生命状态条

完成提供的浏览器场景中的 `game/view.js`。使用本地资源启动 `index.html`。

- **R1。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。UI 挂载在 `host` 内，独立于世界。
- **R2。** `#hud` 铺满宽度并固定在 `#scene` 顶部，最小高度为 58 像素，背景为不透明的 `rgb(153, 153, 153)`。最小高度增长时向下延伸，顶边保持不变。
- **R3。** `#life` 初始显示 `Health: 3`；`#score` 显示 `Score: 0`。两者根据状态更新。
- **R4。** 顶部中央的 `#instrument` 包含可见且已加载的 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`）图片，尺寸非零。指针随 `state.fuel` 移动；不得替换为进度条。
- **R5。** 初始隐藏的 `#gameover` 在 `state.phase === 'gameover'` 时显示。纯色 `#gameover-card` 居中于游戏区，其中 `#gameover-title` 显示 `RETRY`。
- **R6。** 保留命中、受伤、平移、增大及重置。重置恢复初始 UI。视口变化、增长及世界平移后保持锚定和仪表对齐。

验收检查 1100×760 和 520×800 视口、两次每次 30 像素的增长、图片加载、标签、指针移动、重试覆盖层及重置。公开示例将分数设为 100。不得修改检查或伪造结果。
