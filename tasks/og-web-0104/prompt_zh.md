# 战斗完成面板

完成 `game/` 中配套浏览器游戏的 `panel.js`。保留 `index.html`，使用本地依赖。

- **R1 — API。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 与可重复安全调用的 `dispose()`。创建一个初始隐藏的 `#battle-panel`。处理 EventTarget 的 `battle-over` 事件（`detail` 为 `{text, type}`）以及直接调用。
- **R2 — 布局。** 用 alpha 为 0.41 的黑色覆盖游戏区域。`#battle-content` 在两个轴上居中，最小为 24×24 px。`#result-label` 居中，初始为 `Cleared`，字号 20 px。调整尺寸后保持此布局。
- **R3 — 结果。** 将任意传入消息按纯文本显示。WIN 只显示 `#continue`（`Proceed`）；LOSE 只显示 `#restart`（`Retry`）。按钮至少为 52×16 px，以自然宽度水平居中。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 运行。** 暂停实际游戏计时和运动，面板按钮仍可交互。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态运行游戏。隐藏面板不能执行操作。销毁移除 DOM 和订阅。
- **R5 — 配套环境。** 保留战斗结果、消息、结果类型和重置控件。重置恢复一个隐藏面板、归零计数器和运行中的游戏，不保留旧监听器。

验收覆盖任意直接调用和事件消息、两种结果、真实暂停和操作、销毁、重置，以及 1100×760 和 520×800 的布局。公开检查请求胜利。不得修改检查或伪造结果。
