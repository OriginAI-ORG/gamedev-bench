# 胜利战斗结算面板

完成 `game/` 中配套浏览器游戏的 `panel.js`。入口保持为 `index.html`，只使用本地依赖。

- **R1 — 组件。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 和 `dispose()`。在 `host` 中创建一个初始隐藏的 `#battle-panel`。订阅所提供 EventTarget 的 `battle-over` 事件，其 `detail` 为 `{text, type}`；事件和直接方法调用都必须有效。
- **R2 — 外观。** 用 alpha 为 0.34902 的黑色覆盖游戏区域。`#battle-content` 在两个轴上居中，最小宽度和高度均为 40 px。`#result-label` 居中，初始文字为 `Victorious!`，字号 24 px。视口改变后，遮罩和内容仍保持对齐。
- **R3 — 操作。** `#continue` 文字为 `Awesome!`，`#restart` 文字为 `Restart`；两者至少为 50×16 px，横向拉伸至内容宽度。传入消息按纯文本显示。WIN 只显示 Continue，LOSE 只显示 Restart。`showScreen` 显示面板并调用 `game.pause()`。
- **R4 — 生命周期。** 面板打开时游戏时间和物体运动停止，但按钮仍可交互。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态恢复运行。隐藏面板不能再次执行操作。`dispose()` 移除面板和事件订阅，允许重复调用。
- **R5 — 集成。** 保留配套的战斗结果、消息、结果类型和重置控件。重置清除旧监听器，恢复一个隐藏面板、归零的计数器以及运行中的游戏。

验收覆盖任意事件消息和直接调用消息、两种结果、真实计时和物体运动、按钮操作、销毁、重置，以及 1100×760 和 520×800 下的布局。公开示例触发一次胜利。不得修改检查或伪造结果。
