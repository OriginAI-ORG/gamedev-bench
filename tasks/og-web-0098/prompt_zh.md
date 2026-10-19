# 胜利结果面板

完成 `game/` 中配套浏览器游戏的 `panel.js`。使用本地依赖并保留 `index.html`。

- **R1 — API。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，实现 `showScreen(text, type)` 与 `dispose()`。创建一个初始隐藏的 `#battle-panel`，订阅 EventTarget 的 `battle-over` 事件，其 `detail: {text, type}`。直接调用与外部事件都必须有效。
- **R2 — 外观。** 用 alpha 为 0.32 的黑色填满游戏区域。`#battle-content` 水平与垂直居中，最小尺寸为 36×36 px。`#result-label` 居中，初始为 `Victory!`，字号 22 px。调整尺寸后保持此布局。
- **R3 — 结果。** 将任意传入消息按纯文本显示。WIN 只显示 `#continue`（`Done`）；LOSE 只显示 `#restart`（`Again`）。每个按钮最小为 60×18 px，并填满内容宽度。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 生命周期。** 停止实际游戏计时和运动，但不禁用面板按钮。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，恢复初始运行状态。隐藏面板不能执行操作。销毁移除面板和事件订阅，允许重复调用。
- **R5 — 配套环境。** 保留战斗结果、消息、结果类型和重置控件。重置恢复一个隐藏面板、运行中的游戏和归零计数器，没有残留监听器。

验收检查任意直接调用和事件消息、两种结果、真实暂停、操作、销毁、重置，以及 1100×760 和 520×800 的布局。公开示例请求胜利。不得修改检查或伪造结果。
