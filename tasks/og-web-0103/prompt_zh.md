# 回合胜利面板

实现 `game/` 中配套本地浏览器游戏的 `panel.js`；入口保持为 `index.html`。

- **R1 — 接口。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 和 `dispose()`。挂载一个初始隐藏的 `#battle-panel`。订阅 EventTarget 的 `battle-over` 事件，其 `detail: {text, type}`。直接调用也必须有效。
- **R2 — 外观。** 用 alpha 为 0.27 的黑色填满游戏区域。`#battle-content` 水平和垂直居中，最小为 56×56 px。`#result-label` 居中，初始为 `Round Won`，字号 27 px。调整尺寸后保持锚定关系。
- **R3 — 结果。** 任意传入消息均按纯文本显示。WIN 只显示 `#continue`（`Advance`）；LOSE 只显示 `#restart`（`Reset`）。按钮最小为 66×24 px，以自然宽度对齐内容左边缘。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 生命周期。** 停止实际游戏计时和角色运动，但不禁用面板按钮。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态运行游戏。隐藏面板不能执行操作。销毁移除 DOM 和订阅，允许重复调用。
- **R5 — 集成。** 保留战斗结果、消息、结果类型和重置控件。重置后只存在一个隐藏面板，游戏运行、计数归零，没有重复监听器。

验收检查任意直接调用和事件消息、两种结果、真实暂停和操作、销毁、重置，以及 1100×760 和 520×800 的布局。公开示例请求胜利。不得修改检查或伪造结果。
