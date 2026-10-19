# 底部控制面板

为提供的浏览器场景完成 `game/view.js` 中的 HUD 组件。使用 `index.html` 和本地素材。

- **R1 — 接口。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。UI 属于 `host`，而不是移动的世界。
- **R2 — 面板。** `#hud` 铺满 `#scene` 宽度，固定在底边，最小高度为 58 像素。最小高度增加时向上增长。背景为不透明的 `rgb(153, 153, 153)`。
- **R3 — 标签。** 面板内放置 `#life` 和 `#score`，初始为 `Lives: 3` 和 `Points: 0`，并根据状态更新。
- **R4 — 仪表。** `#instrument` 位于底部中央。使用两张可见且已加载的图片：来自 `meter.svg` 的 `#power-meter` 和来自 `indicator.svg` 的 `#power-indicator`。尺寸保持非零，指针随 `state.fuel` 移动；不得替换为原生进度条。
- **R5 — 覆盖层。** 初始隐藏的 `#gameover` 包含居中的纯色 `#gameover-card` 及显示 `GAME OVER` 的 `#gameover-title`。当 `state.phase === 'gameover'` 时显示。
- **R6 — 场景。** 保留命中、受伤、平移、增大及重置。重置恢复标签并隐藏覆盖层。调整尺寸和增长后必须保持贴边；平移不得移动 HUD。

验收使用 1100×760 和 520×800 视口、两次每次 30 像素的增长，并检查图片加载、状态更新、燃料指针移动、覆盖层及重置。公开示例将分数设为 100。不得修改检查或伪造结果。
