# 可增长的底部控制面板

为提供的浏览器游戏实现 `game/view.js`，入口为 `index.html`。所有资源均在本地。

- **R1 — API。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。将 UI 挂载到屏幕的 `host` 图层。
- **R2 — 增长。** 全宽 `#hud` 贴住 `#scene` 底边。初始最小高度为 58 像素，背景为不透明的 `rgb(153, 153, 153)`。最小高度增加时顶边向上移动，底边保持固定。
- **R3 — 读数。** `#life` 初始显示 `Lives: 3`；`#score` 显示 `Points: 0`。两者跟随提供的状态更新。
- **R4 — 仪表。** 面板底部中央的 `#instrument` 包含已加载的 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`）图片。两者以非零尺寸渲染，指针位置随 `state.fuel` 更新。不得用进度条替代图片组合。
- **R5 — 结束状态。** `#gameover` 初始隐藏；当 `state.phase === 'gameover'` 时，显示居中的纯色 `#gameover-card`，其中 `#gameover-title` 显示 `GAME OVER`。
- **R6 — 集成。** 保留命中、受伤、平移、增大及重置。重置恢复初始 UI。世界移动时 HUD 保持不动。调整尺寸后仍保持全宽锚定及仪表居中。

验收覆盖 1100×760 与 520×800 布局、两次每次 30 像素的增长、实际图片、状态和指针更新、结束界面及重置。公开示例将分数设为 100。不得修改检查或伪造结果。
