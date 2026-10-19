# 任务通过面板

实现 `game/` 中配套浏览器游戏的 `panel.js`。保留 `index.html`，使用本地依赖。

- **R1 — 组件。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 和 `dispose()`。创建一个初始隐藏的 `#battle-panel`。订阅 EventTarget 的 `battle-over` 事件，从 `detail` 读取 `{text, type}`；直接调用也必须有效。
- **R2 — 外观。** 用 alpha 为 0.44 的黑色覆盖游戏区域。`#battle-content` 在两个轴上居中，最小尺寸为 52×52 px。`#result-label` 居中，初始为 `Mission Clear`，字号 30 px。视口调整后保持此布局。
- **R3 — 结果。** 将任意传入消息按纯文本显示。WIN 只显示 `#continue`（`Keep Going`）；LOSE 只显示 `#restart`（`Try Again`）。按钮至少为 70×22 px，以自然宽度水平居中。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 运行。** 停止实际游戏计时和运动，面板按钮仍可交互。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态运行游戏。隐藏面板不能执行操作。销毁移除 DOM 和订阅，允许重复调用。
- **R5 — 集成。** 保留战斗结果、自定义消息、结果类型和重置控件。重置恢复一个隐藏面板、运行中的游戏和归零计数器，不保留旧监听器。

验收检查任意直接调用和事件文本、两种结果、真实暂停和操作、销毁、重置，以及 1100×760 / 520×800 布局。公开检查请求胜利。不得修改检查或伪造结果。
