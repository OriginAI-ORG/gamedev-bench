# 左侧弹药面板

为提供的本地浏览器游戏（`index.html`）实现 `game/view.js`。

- **R1。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。`host` 内的 UI 独立于世界移动。
- **R2。** `#hud` 铺满 `#scene` 高度并贴住左边。初始最小宽度为 86 像素，使用不透明的 `rgb(153, 153, 153)` 填充。最小宽度增加时向右增长，左边保持固定。
- **R3。** `#life` 初始显示 `Ammo: 3`，`#score` 初始显示 `Score: 0`。根据提供的状态更新。
- **R4。** 将 `#instrument` 竖直居中并贴住面板左边。分别加载可见的 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`）图片，尺寸非零。指针位置跟随 `state.fuel`；不得替换为进度条。
- **R5。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示居中于游戏区的纯色 `#gameover-card`，其中 `#gameover-title` 显示 `GAME OVER`。
- **R6。** 保留命中、受伤、平移、增大及重置。重置恢复初始 UI。世界平移、视口变化及增长后仍保持全高拉伸、贴边和仪表居中。

验收检查 1100×760 和 520×800 布局、两次每次 30 像素的宽度增长、图片、状态和指针变化、覆盖层及重置。公开示例将分数设为 100。所有依赖均在本地；不得修改检查或伪造结果。
