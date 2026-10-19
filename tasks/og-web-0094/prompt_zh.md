# 右侧弹药面板

为从 `index.html` 启动的浏览器场景实现 `game/view.js`。所有资源均在本地。

- **R1。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。UI 挂载在 `host` 内，独立于世界。
- **R2。** `#hud` 铺满高度并固定在 `#scene` 右侧，最小宽度为 86 像素，背景为不透明的 `rgb(153, 153, 153)`。最小宽度增加时向左增长，右边不动。
- **R3。** `#life` 初始显示 `Ammo: 3`，`#score` 初始显示 `Score: 0`。根据状态更新。
- **R4。** 右侧中央的 `#instrument` 包含已加载的 `#power-meter`（`meter.svg`）和 `#power-indicator`（`indicator.svg`）图片。两者可见且尺寸非零。指针位置随 `state.fuel` 更新；不得以进度条替代。
- **R5。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时，显示纯色且居中的 `#gameover-card`，其中 `#gameover-title` 显示 `DEFEAT`。
- **R6。** 保留命中、受伤、平移、增大及重置；重置恢复初始 UI。世界平移、尺寸调整及面板增长后保持贴边和仪表对齐。

验收检查 1100×760 和 520×800 视口、两次每次 30 像素的宽度增长、图片、标签、指针变化、失败界面及重置。公开示例得到分数 100。不得修改检查或伪造结果。
