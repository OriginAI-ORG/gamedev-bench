# 绑定单位的 AI 调试标签

完成 `game/` 中配套浏览器游戏的 `component.js`。入口为 `index.html`，依赖必须保留在本地。提供的 `UnitAI` 控制器已经实现状态文字与调试信息可见性。

- **R1 — 绑定。** 导出 `attachAI(actor, Controller)`。在传入的 actor 下创建 `#debug-label`，然后返回用 `{actor, debugLabel}` 构造的配套 `Controller` 实例。两个引用必须指向对应对象本身，绑定不同 actor 时也一样。
- **R2 — 几何。** 标签相对 actor 原点的位置为 left −65 px、top −47 px，宽 130 px、高 18 px。文字水平居中，初始为 `IDLE`。保留配套精灵。标签必须跟随 actor 移动，视口变化后仍位于精灵上方。
- **R3 — 控制器集成。** 状态和可见性变化由配套控制器驱动。它的 `setState(text)` 更新绑定标签；`enabled` 属性隐藏或显示标签，不丢失当前状态。保留 Patrol、Attack、Idle 和 Toggle debug 控件。不能用独立按钮处理器或硬编码文字更新代替控制器绑定。
- **R4 — 重置。** 保留 Move actor 和 Reset。重置重新创建一个 actor 和一个绑定标签，恢复初始位置，显示 `IDLE` 并启用调试信息。不得残留旧标签。

验收通过独立传入的控制器检查引用身份、任意状态文字、可见性切换、准确标签矩形、actor 移动、重置，以及 1100×760 和 520×800 下的布局。公开示例将 IDLE 切换为 PATROL。不得修改检查或伪造结果。
