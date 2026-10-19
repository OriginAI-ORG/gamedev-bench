# 河道飞行 HUD

完成 `game/` 中提供的浏览器游戏的 `view.js`，入口为 `index.html`。只使用本地依赖。

- **R1 — 组件。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。场景提供生命、分数、燃料及游戏阶段。在 `host` 内创建 HUD，使其独立于移动的游戏世界。
- **R2 — 布局。** `#hud` 横跨 `#scene` 全宽并固定在底边。最小高度初始为 58 像素，`setMinimum` 增大时向上增长。背景使用不透明的 `rgb(153, 153, 153)`。
- **R3 — 标签。** 面板内放置可见的 `#life` 和 `#score`，初始显示 `Lives: 3` 和 `Points: 0`。根据 `state.life` 和 `state.score` 更新。
- **R4 — 仪表。** `#instrument` 由两张独立且已加载的图片组成：`#power-meter` 使用 `meter.svg`，`#power-indicator` 使用 `indicator.svg`。仪表水平居中并贴住面板底边。两张图片都必须可见且尺寸非零。指针随 `state.fuel` 改变位置；不得以原生进度条替代图片。
- **R5 — 结束界面。** 提供初始隐藏的 `#gameover`，其中的纯色 `#gameover-card` 居中于游戏区，`#gameover-title` 显示 `GAME OVER`。当 `state.phase === 'gameover'` 时显示。
- **R6 — 集成。** 保留提供的命中、受伤、平移、增大和重置控件。重置恢复初始标签并隐藏覆盖层。视口调整和最小高度增大后锚定必须保持；平移世界不得移动 HUD。

验收检查 1100×760 与 520×800 布局、连续两次每次 30 像素的增长、仪表图片加载、实际标签、燃料指针移动、结束界面可见性和重置。公开示例将分数改为 100。不得修改检查或伪造结果。
