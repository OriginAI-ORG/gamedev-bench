# 子弹碰撞事件接线

完成提供的浏览器坦克射击场中的可复用子弹组件及碰撞订阅。在 `game/` 内开发，入口为 `index.html`。使用本地素材和 ES 模块。

- **R1 — 定义。** 在 `projectile.js` 导出 `definition`：`size: [3, 3]`、`layer: 16`、`mask: 44`、`texture: {src: 'atlas.svg', region: [12, 8, 3, 3]}` 和 `visibility: [3, 3]`。可见贴图精灵和碰撞矩形均居中，尺寸为 3 × 3。
- **R2 — 过滤。** 检测类别 `4` 的敌人传感对象、类别 `8` 的箱子和类别 `32` 的墙。忽略类别 `1` 的友军传感对象。提供的分发器使用 `(mask & target.layer) !== 0`。
- **R3 — 两个订阅。** 导出 `wireContacts(projectile, world)`。`projectile` 是 `EventTarget`。分别订阅 `sensorcontact` 和 `bodycontact`；每个事件通过 `event.detail` 携带目标。任一种碰撞都对同一实例调用 `world.removeProjectile(projectile)`。只处理一种事件不满足要求。
- **R4 — 生命周期。** 返回取消订阅函数，移除两个监听器。销毁后的对象不得响应后续事件。为一颗子弹接线不得覆盖另一颗子弹的监听器。
- **R5 — 集成。** 保留连续移动、Fire/Space、瞄准、发射者选择、目标切换、暂停及重置。可见子弹在任一种允许的碰撞后消失；重置清除全部子弹。保持 `#scene`、`.shot`、`#fire`、`#aim`、`#target-kind`、`#tank`、`#pause`、`#reset` 和 `#shots`。

验收检查定义、已加载的精灵像素、过滤、两个事件路径、监听器移除、多实例、实时运动及重置。公开示例观察发射后 200 ms 的运动。不得修改检查或伪造测试结果。
