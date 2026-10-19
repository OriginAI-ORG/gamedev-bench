# 坦克子弹运动与清理

实现提供的浏览器坦克射击场中的子弹行为。在 `game/` 内开发，使用本地依赖运行 `index.html`。初始工程已提供渲染、碰撞分发和控件。

- **R1 — 组件状态。** 在 `projectile.js` 导出 `SPEED = 500` 和 `createProjectile({id, position, direction, tank, world, quests})`。返回对象提供 `id`、`x`、`y`、`direction`、`tank`、`active`、`tick(deltaSeconds)`、`onSensor(target)` 和 `onBody(body)`。保留发射坦克及移动方向的副本；不同实例不得共享可变状态。本题传入 `quests: null`。
- **R2 — 运动。** 每次更新按 `normalize(direction) * 500 * deltaSeconds` 移动。支持任意非负时间步长和非单位方向。零向量保持静止，不得产生 NaN 坐标。游戏必须连续播放运动；仅提供手动步进按钮不满足要求。
- **R3 — 传感碰撞。** 活跃子弹收到 `onSensor` 后必须调用 `world.removeProjectile(projectile)`。销毁后不得继续移动或产生碰撞效果。
- **R4 — 实体碰撞。** 若 `body.kind === 'crate'`，先调用 `world.destroyBody(body)` 再移除子弹。其他实体只移除子弹。两个处理器都必须忽略销毁后的重复回调。销毁的箱子必须从实际游戏中消失。
- **R5 — 场景生命周期。** 保留可见的 3 × 3 贴图子弹、发射者选择、目标选择、Fire/Space、瞄准、暂停及重置。子弹中心超出射击场任意边界超过 50 像素时移除；恰好超出 50 像素时仍活跃。重置移除全部子弹并恢复目标。保持 `#scene`、`.shot`、`#fire`、`#aim`、`#target-kind`、`#tank`、`#pause`、`#reset` 和 `#shots`。

验收检查不等长更新间隔、斜向和零方向、独立发射者、两类碰撞、销毁顺序、非箱子保留、重复回调、全部清理边界、连续渲染运动及重置。公开示例观察发射后 200 ms 的运动。不得修改检查或伪造测试结果。
