# 遭遇战胜利面板

实现 `game/` 中配套本地浏览器游戏的 `panel.js`；保留 `index.html` 入口。

- **R1 — 组件。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 和 `dispose()`。挂载一个初始隐藏的 `#battle-panel`。订阅 EventTarget 的 `battle-over` 事件，其 `detail` 为 `{text, type}`。直接方法调用也必须有效。
- **R2 — 外观。** 用 alpha 为 0.47 的黑色填满游戏区域。`#battle-content` 在两个轴上居中，最小为 72×72 px。`#result-label` 居中，初始为 `Encounter Won`，字号 31 px。视口调整后保持布局。
- **R3 — 结果。** 任意传入消息均按纯文本显示。WIN 只显示 `#continue`（`Next Round`）；LOSE 只显示 `#restart`（`Reset Fight`）。按钮最小为 80×28 px，采用自然宽度并水平居中。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 生命周期。** 实际游戏计时和运动停止，面板按钮仍可交互。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态运行游戏。隐藏面板不能执行操作。销毁移除 DOM 和事件订阅，允许重复调用。
- **R5 — 集成。** 保留战斗结果、自定义消息、结果类型和重置控件。重置恢复一个隐藏面板、归零计数器和运行中的游戏，不保留旧监听器。

验收检查任意直接调用和事件文本、两种结果、真实暂停和操作、销毁、重置，以及 1100×760 / 520×800 布局。公开示例请求胜利。不得修改检查或伪造结果。
