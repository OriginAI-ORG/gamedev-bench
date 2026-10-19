# 胜利画面组件

实现 `game/` 中配套浏览器游戏的 `panel.js`；保留 `index.html` 和本地依赖。

- **R1 — 接口。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 与可重复安全调用的 `dispose()`。挂载一个初始隐藏的 `#battle-panel`。监听配套 EventTarget 的 `battle-over` 事件，其 `detail` 为 `{text, type}`；也支持直接调用。
- **R2 — 外观。** 用 alpha 为 0.29 的黑色覆盖游戏区域。`#battle-content` 在两个轴上居中，最小为 28×28 px。`#result-label` 居中，初始为 `Victory Screen`，字号 21 px。视口调整后保持对齐。
- **R3 — 显示。** 每次传入的消息均使用纯文本。WIN 只显示文字为 `Continue` 的 `#continue`；LOSE 只显示文字为 `Replay` 的 `#restart`。两个按钮最小均为 54×18 px，并拉伸至内容宽度。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 运行。** 冻结实际游戏计时和角色运动，面板按钮仍可交互。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态运行游戏。忽略隐藏面板上的操作。销毁时移除 DOM 和事件订阅。
- **R5 — 集成。** 保留战斗结果、自定义消息、结果类型和重置控件。重置恢复一个隐藏面板、归零计数器和运行中的游戏，不保留旧订阅。

验收覆盖任意直接调用和事件文本、两种结果、真实暂停和操作、销毁、重置，以及 1100×760 / 520×800 布局。公开检查请求胜利。不得修改检查或伪造结果。
