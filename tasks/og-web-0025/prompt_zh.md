# 将玩家受伤事件接入 HUD

完成 `game/` 中配套本地浏览器游戏的 `hud.js`，保留 `index.html`。已有 Player 和 DamageController 会发送并累计伤害；请把它们连接到可见 HUD。

- **R1 — 挂载。** 导出 `mountDamageHud(controller, player, host)`。在传入的 HUD host 内创建一个 `#damage-label`，初始为 `Total Damage: 0`。将该元素本身绑定到 `controller.label`。保留既有世界和角色。
- **R2 — 订阅。** 将玩家的 `taken-damage` 事件连接到 `controller.onPlayerTakenDamage`。其 `detail.amount` 驱动配套累加器及文字更新。一次 Player.takeDamage 调用发送 20；每次调用必须恰好增加一次显示总量。来自角色点击处理器之外的事件也必须有效。不能用独立点击计数器代替配套事件/控制器。
- **R3 — HUD 行为。** 标签保持独立于世界运动。保留角色点击、External damage 和 Pan world。重复受伤持续累计，五次命中后也一样；此组件没有生命或击败门槛。
- **R4 — 清理。** 返回清理函数，断开当前订阅并移除标签。允许重复清理。Reset 调用清理并使用新的控制器，恢复总量 0 且仅有一个标签；后续伤害必须只更新新 HUD 一次。

验收检查玩家/控制器/标签绑定、任意事件伤害量、外部伤害、超过 100 的累计值、HUD 与世界平移独立、清理和重置。公开示例发送一次 20 伤害命中。不得修改检查或伪造结果。
