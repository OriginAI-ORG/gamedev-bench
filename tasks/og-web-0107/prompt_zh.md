# 本轮获胜面板

实现 `game/` 中配套本地浏览器游戏的 `panel.js`；保持 `index.html` 为入口。

- **R1 — 接口。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 与 `dispose()`。挂载一个初始隐藏的 `#battle-panel`。订阅 EventTarget 的 `battle-over` 事件，其 `detail: {text, type}`。直接调用也必须有效。
- **R2 — 外观。** 用 alpha 为 0.43 的黑色填满游戏区域。`#battle-content` 在两个轴上居中，最小为 76×76 px。`#result-label` 居中，初始为 `You Won This One`，字号 32 px。视口改变时保持锚定关系。
- **R3 — 结果。** 将任意传入消息按纯文本显示。WIN 只显示 `#continue`（`Keep Going`）；LOSE 只显示 `#restart`（`Try Again`）。按钮最小为 82×30 px，并拉伸至内容宽度。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 生命周期。** 停止实际游戏计时和角色运动，但不禁用面板按钮。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态运行游戏。隐藏面板不能执行操作。销毁移除 DOM 和订阅，允许重复调用。
- **R5 — 集成。** 保留战斗结果、消息、结果类型和重置控件。重置恢复一个隐藏面板、归零计数器和运行中的游戏，不能重复监听。

验收检查任意直接调用和事件文本、两种结果、真实暂停和操作、销毁、重置，以及 1100×760 / 520×800 布局。公开检查请求胜利。不得修改检查或伪造结果。
