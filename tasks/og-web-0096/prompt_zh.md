# 战斗胜利面板

完成 `game/` 中配套浏览器游戏的 `panel.js`；保留 `index.html`，只使用本地依赖。

- **R1 — 组件。** 导出 `Type = {WIN: 0, LOSE: 1}` 和 `BattleOverPanel(host, events, game, config)`，提供 `showScreen(text, type)` 和 `dispose()`。挂载一个初始隐藏的 `#battle-panel`。监听配套 EventTarget 的 `battle-over` 事件，从 `detail` 读取 `{text, type}`。直接调用方法也必须有效。
- **R2 — 布局。** 用 alpha 为 0.34902 的黑色填满游戏区域。`#battle-content` 水平和垂直居中，最小尺寸为 40×40 px。`#result-label` 居中，初始为 `Victorious!`，字号 24 px。改变尺寸时保持锚定关系。
- **R3 — 结果。** 将每次传入的消息按纯文本显示。WIN 只显示 `#continue`（`Awesome!`），LOSE 只显示 `#restart`（`Restart`）。每个按钮最小为 50×16 px，并拉伸至内容宽度。显示结果时打开面板并调用 `game.pause()`。
- **R4 — 生命周期。** 暂停实际游戏时间和运动，面板控件仍可交互。Continue 隐藏面板并调用 `game.finish()`，在页面内结束本局。Restart 隐藏面板并调用 `game.restart()`，从初始状态恢复运行。隐藏面板不能执行操作。`dispose()` 移除 DOM 和订阅，并允许重复调用。
- **R5 — 配套环境。** 保留战斗结果、自定义消息、结果类型和重置控件。重置后只存在一个隐藏面板，游戏运行、计数归零，且没有重复监听器。

验收检查两种结果、任意事件和直接调用文本、真实暂停、操作、销毁、重置，以及 1100×760 和 520×800 的布局。公开示例请求胜利。不得修改检查或伪造结果。
