# 坦克子弹生命周期

完成提供的浏览器坦克射击场中的子弹行为。在 `game/` 内开发，以 `index.html` 为入口。所有依赖均在本地；初始工程已提供渲染、碰撞分发及控件。

- **R1 — 状态。** 在 `projectile.js` 导出 `SPEED = 500` 和 `createProjectile({id, position, direction, tank, world, quests})`。返回 `id`、`x`、`y`、`direction`、`tank`、`active`、`tick(deltaSeconds)`、`onSensor(target)` 和 `onBody(body)`。保留发射坦克并复制方向；各子弹必须拥有独立的可变状态。本题传入 `quests: null`。
- **R2 — 按时间移动。** 每次更新按 `normalize(direction) * 500 * deltaSeconds` 移动。接受任意非负时间步长和非单位方向。零方向保持静止，坐标保持有限值。运动必须连续进行，不能仅由手动步进驱动。
- **R3 — 传感碰撞。** 活跃子弹在传感碰撞时调用 `world.removeProjectile(projectile)`。销毁后不得移动或产生后续碰撞效果。
- **R4 — 实体碰撞。** 碰到 `body.kind === 'crate'` 时，先调用 `world.destroyBody(body)` 再移除子弹。其他实体保持完整，只移除子弹。忽略销毁后的重复回调。箱子销毁必须在游戏中可见。
- **R5 — 场景集成。** 保留 3 × 3 贴图子弹、发射者和目标选择、Fire/Space、瞄准、暂停及重置。子弹中心越过任意射击场边缘超过 50 像素时销毁，恰好超出 50 像素时不得销毁。重置清除子弹并恢复目标。保持 `#scene`、`.shot`、`#fire`、`#aim`、`#target-kind`、`#tank`、`#pause`、`#reset` 和 `#shots`。

验收覆盖不等长更新间隔、斜向和零方向、独立发射者、传感和实体碰撞路径、先箱子后子弹的销毁顺序、其他实体保留、重复回调、全部清理边界、连续可见运动及重置。公开示例观察发射后 200 ms 的运动。不得修改检查或伪造测试结果。
