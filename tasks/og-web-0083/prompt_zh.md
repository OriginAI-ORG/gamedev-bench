# 峡谷飞行仪表板

为提供的本地浏览器游戏实现 `game/view.js` 中的仪表板。从 `index.html` 启动，所有依赖均在本地。

- **R1 — 组件。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。UI 必须独立于世界移动。
- **R2 — 底栏。** 全宽 `#hud` 固定在 `#scene` 底部，最小高度为 58 像素，背景为不透明的 `rgb(153, 153, 153)`。增加最小高度时向上延伸，贴边位置不变。
- **R3 — 标签。** `#life` 初始为 `Ships: 3`，`#score` 初始为 `Score: 0`。随后根据状态值渲染。
- **R4 — 仪表。** 将 `#instrument` 放在底部中央，包含独立且已加载的 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`）图片。两者均可见且尺寸非零。根据 `state.fuel` 更新指针；不得用进度条替代。
- **R5 — 重试覆盖层。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示纯色且居中的 `#gameover-card`，其中 `#gameover-title` 显示 `RETRY`。
- **R6 — 集成。** 保留命中、受伤、平移、增大和重置。重置恢复标签并隐藏覆盖层。世界平移、视口调整及面板增长后，仍保持贴边锚定和仪表居中。

验收检查 1100×760 和 520×800 布局、两次每次 30 像素的增长、图片加载、标签、燃料指针移动、重试覆盖层及重置。公开示例将分数设为 100。不得修改检查或伪造结果。
