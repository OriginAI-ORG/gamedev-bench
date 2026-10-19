# 空中巡逻状态条

完成 `game/view.js` 中的浏览器 HUD；提供的游戏从 `index.html` 启动。使用本地依赖。

- **R1 — API。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()` 方法。挂载到 `host`，使其独立于世界。
- **R2 — 状态条。** `#hud` 横向铺满 `#scene` 并贴住底边。最小高度为 58 像素，背景为不透明的 `rgb(153, 153, 153)`。增加最小值时从固定底边向上增长。
- **R3 — 读数。** `#life` 初始显示 `Health: 3`，`#score` 初始显示 `Score: 0`；根据状态更新。
- **R4 — 燃料仪表。** 底部中央的 `#instrument` 包含已加载的 `#power-meter`（来自 `meter.svg`）和 `#power-indicator`（来自 `indicator.svg`）。两者可见且尺寸非零，指针随 `state.fuel` 移动。不得替换为进度条。
- **R5 — 失败。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示居中于游戏区的纯色 `#gameover-card`，其中 `#gameover-title` 显示 `DEFEAT`。
- **R6 — 场景。** 保持命中、受伤、平移、增大和重置可用。重置恢复标签并隐藏失败界面。世界平移、视口变化和最小尺寸增长后必须保持 HUD 贴边及仪表对齐。

验收测试 1100×760 和 520×800 视口、两次每次 30 像素的增长、图片加载、标签及指针变化、失败界面和重置。公开示例将分数设为 100。不得修改检查或伪造结果。
