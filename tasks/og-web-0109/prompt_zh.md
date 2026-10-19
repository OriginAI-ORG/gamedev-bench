# 战斗结算面板

实现 `game/` 中配套本地浏览器游戏的 `panel.js`；保留 `index.html` 入口。

- **R1 — 接口。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 和 `dispose()`。挂载一个初始隐藏的 `#battle-panel`。支持直接调用与 EventTarget 的 `battle-over` 事件，其 `detail` 为 `{text, type}`。
- **R2 — 外观。** 用 alpha 为 0.45 的黑色填满游戏区域。`#battle-content` 在两个轴上居中，最小为 80×80 px。`#result-label` 居中，初始为 `Battle Resolved`，字号 33 px。视口变化时保持锚定关系。
- **R3 — 结果。** 将任意传入消息按纯文本显示。WIN 只显示 `#continue`（`Onward`）；LOSE 只显示 `#restart`（`Restart Match`）。按钮最小为 84×30 px，以自然宽度对齐内容左边缘。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 生命周期。** 冻结实际游戏计时和运动，面板按钮仍可交互。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态运行游戏。隐藏面板不能执行操作。销毁移除 DOM 和订阅，允许重复调用。
- **R5 — 集成。** 保留战斗结果、消息、结果类型和重置控件。重置恢复一个隐藏面板、归零计数器和运行中的游戏，没有重复监听器。

验收检查任意直接调用和事件文本、两种结果、真实暂停和操作、销毁、重置，以及 1100×760 / 520×800 布局。公开检查请求胜利。不得修改检查或伪造结果。
