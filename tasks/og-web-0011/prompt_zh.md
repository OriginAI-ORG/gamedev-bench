# 推进任务进度的子弹

完成提供的浏览器射击场中的子弹组件。在 `game/` 内开发，入口为 `index.html`。所有素材和模块必须在本地运行，不得访问外网。

- **R1 — 集成。** 在 `projectile.js` 导出 `SPEED = 500` 和 `createProjectile({id, position, direction, tank, world, quests})`。返回包含 `id`、`x`、`y`、`direction`、`tank`、`active`、`tick(deltaSeconds)`、`onSensor(target)` 和 `onBody(body)` 的子弹。保留传入的发射者和方向。使用提供的任务服务和世界对象生命周期；单独显示一个计数器不满足要求。
- **R2 — 移动。** 根据归一化方向和经过的秒数，以每秒 500 像素连续移动。零方向保持静止。不同时间步长的调用在相同累计时间内必须产生相同位移。初始工程已提供动画循环、控件和碰撞事件分发。
- **R3 — 任务事件。** 活跃子弹碰到 `group` 为 `enemy` 的传感对象时，必须调用一次 `quests.progressQuest('Shoot Em Up', 'kill_step', id)`，然后调用 `world.removeProjectile(projectile)`。其他碰撞只移除子弹，不推进任何任务。销毁后的重复回调不得产生效果。不得改变 Supply Run 任务。提供的 HUD 必须显示任务服务中的进度。
- **R4 — 清理。** 子弹中心越过 `world.width × world.height` 的任意边缘超过 50 像素时销毁。恰好超出 50 像素时仍保持活跃。清理不得推进任务。销毁后的子弹必须停止移动和处理碰撞。
- **R5 — 可玩集成。** 保持 `#fire`、`#aim`、`#target-kind`、`#tank`、`#pause`、`#reset`、`#scene`、`.shot`、`#shots`、`#quest-progress` 和 `#supply-progress` 可用。Fire/Space 创建可见的贴图子弹，渲染位置随运动更新。重置清除子弹及两个任务计数。两个任务状态必须相互独立。

验收覆盖不同时间步长、零方向和非单位方向、两个发射者、敌人和中立碰撞、重复碰撞、四个清理边界、实时连续移动及重置。公开示例发射子弹并观察 200 ms 的移动。必须实现实际行为；不得修改检查或伪造测试结果。
