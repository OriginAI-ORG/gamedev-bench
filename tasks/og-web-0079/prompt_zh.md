# 河道飞行控制面板

在 `game/view.js` 实现屏幕覆盖层。本地浏览器游戏从 `index.html` 启动，初始工程已提供玩法场景。

- **R1 — API。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。在 `host` 内放置 UI，使其独立于世界移动。
- **R2 — 底部锚定。** `#hud` 横跨游戏区全宽，贴住 `#scene` 底边，最小高度为 58 像素。增加最小高度时向上增长，底边保持不动。背景使用不透明的 `rgb(153, 153, 153)`。
- **R3 — 状态。** `#life` 初始显示 `Lives: 3`，`#score` 初始显示 `Points: 0`。随后渲染 `state.life` 和 `state.score` 的值。
- **R4 — 贴图仪表。** 将 `#instrument` 放在面板底部中央。它包含可见且已加载的 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`）。两者尺寸非零，指针随 `state.fuel` 移动。普通进度条不满足要求。
- **R5 — 游戏结束。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示居中于游戏区的纯色 `#gameover-card`，其中 `#gameover-title` 显示 `GAME OVER`。
- **R6 — 集成。** 保留提供的命中、受伤、平移、增大和重置控件。重置恢复初始 UI。世界平移、视口调整和最小尺寸变化后 HUD 仍保持锚定。

验收检查 1100×760 与 520×800 两种视口、两次每次 30 像素的增长、实际图片加载、标签、指针移动、覆盖层及重置。公开示例得到分数 100。所有资源必须在本地；不得修改检查或伪造结果。
