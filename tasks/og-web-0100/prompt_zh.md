# 凯旋面板

完成 `game/` 中配套本地浏览器游戏的 `panel.js`，保持 `index.html` 为入口。

- **R1 — API。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 和可重复安全调用的 `dispose()`。挂载一个初始隐藏的 `#battle-panel`。处理 EventTarget 的 `battle-over` 事件（`detail: {text, type}`）与直接方法调用。
- **R2 — 布局。** 用 alpha 为 0.33 的黑色填满游戏区域。`#battle-content` 水平与垂直居中，最小为 68×68 px。`#result-label` 居中，初始为 `Triumph!`，字号 27 px。视口改变时保持锚定关系。
- **R3 — 结果。** 按纯文本显示任意传入消息。WIN 只显示 `#continue`（`Advance`）；LOSE 只显示 `#restart`（`Restart Battle`）。按钮最小为 78×26 px，横向拉伸至内容宽度。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 生命周期。** 实际游戏计时和运动必须停止，面板按钮仍可交互。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态运行游戏。隐藏面板不能执行操作。销毁时移除 DOM 和事件订阅。
- **R5 — 配套环境。** 保留战斗结果、消息、结果类型和重置控件。重置恢复一个隐藏面板、归零计数器和运行中的游戏，没有旧监听器。

验收覆盖任意直接调用和事件消息、两种结果、真实暂停和操作、销毁、重置，以及 1100×760 和 520×800 的布局。公开示例请求胜利。不得修改检查或伪造结果。
