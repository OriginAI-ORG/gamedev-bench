# 有限状态机基础

完成 `game/` 中配套本地浏览器游戏的 `machine.js`；保留 `index.html`。配套环境提供角色姿态和控件。请实现可复用生命周期组件，不要硬编码画面中的三个状态。

- **R1 — 状态。** 导出 `State(actor)`，将传入 actor 的准确引用保存为 `.actor`。提供可覆写的 `enter()`、`exit()`、`process(delta)` 和 `physicsProcess(delta)` 方法。不同 State 实例可以引用同一个 actor，但仍是独立状态对象。
- **R2 — 状态机。** 导出 `FiniteStateMachine extends EventTarget`，初始 `.state === null`。`changeState(next)` 在存在前一状态时调用其 `exit()`，随后调用 `next.enter()`，赋值 `.state = next`，最后恰好发送一次 `state-changed` CustomEvent，`detail` 为该新状态对象本身。监听器必须能看到更新后的状态。第一次转移没有旧状态退出。传入当前状态时仍执行退出、进入和通知。
- **R3 — 通用性。** 使用传入的状态对象及方法，包括任意子类和名称。保留对象身份与 actor 引用；不能从文字推测转移，也不能伪造生命周期日志。多个状态机独立工作。
- **R4 — 集成。** 保留配套 Idle、Run、Attack 和 Reset 控件。状态回调改变可见角色姿态，事件监听器更新 `#status` 和 `#log`。一次普通转移按顺序追加 `exit:OLD`、`enter:NEW`、`changed:NEW`。配套环境初始化为 IDLE 并清除初始化日志。重置创建新的状态机，恢复相同初始显示，不得残留旧转移历史。

验收检查任意状态对象、actor 身份、生命周期顺序、首次与重复转移、事件载荷/状态时序、独立状态机、可见姿态和重置。公开示例从 IDLE 转为 RUN。不得修改检查或伪造结果。
