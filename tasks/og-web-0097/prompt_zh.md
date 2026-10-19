# 关卡通过面板

在 `game/` 中配套的本地浏览器游戏内实现 `panel.js`，入口保持为 `index.html`。

- **R1 — API。** 导出 `Type = {WIN: 0, LOSE: 1}` 和类 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 和可重复安全调用的 `dispose()`。挂载一个初始隐藏的 `#battle-panel`。订阅 EventTarget 的 `battle-over` 事件，其 `detail` 为 `{text, type}`；直接调用和事件都必须显示结果。
- **R2 — 布局。** 面板用 alpha 为 0.4 的黑色填满游戏区域。`#battle-content` 在两个轴上居中，最小为 48×48 px。`#result-label` 居中，初始为 `Stage Clear!`，字号 26 px。视口改变后保持布局。
- **R3 — 结果和按钮。** 按字面显示任意消息文本。WIN 只显示文字为 `Continue` 的 `#continue`；LOSE 只显示文字为 `Retry` 的 `#restart`。按钮最小为 56×20 px，并拉伸至内容宽度。显示结果时调用 `game.pause()`。
- **R4 — 状态。** 实际计时和角色运动冻结，面板仍可交互。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态运行游戏。隐藏面板不得执行操作。销毁时移除 DOM 和事件订阅。
- **R5 — 集成。** 保留配套的战斗结果、自定义消息、结果类型和重置控件。重置恢复一个隐藏面板、运行状态和归零计数器，不能出现重复监听器。

验收覆盖事件与直接调用、两种结果、任意消息、暂停和操作、销毁、重置，以及 1100×760 / 520×800 布局。公开检查请求胜利。不得修改检查或伪造结果。
