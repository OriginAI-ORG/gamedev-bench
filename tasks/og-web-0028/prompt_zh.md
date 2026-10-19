# 可复用空间手电定位点

完成 `game/` 中配套本地浏览器游戏的 `component.js`，保留 `index.html`。配套环境提供 `SpatialNode`、注册集合、透视相机和定位控件。

- **R1 — 可复用点。** 导出 `Priority = {low: 0, medium: 1, high: 2}` 和 `FlashlightPoint extends SpatialNode`。构造函数接收 `(name, {position, priority})`；各实例拥有独立坐标及初始为 false 的布尔值 `hasBeenTargeted`。`resetTargetState()` 只清除当前实例的定位状态，保留名称、变换和优先级。
- **R2 — 实例。** 导出 `createPoints(root, registry)`，返回三个独立的点，直接挂在 `root` 下并加入 `registry`。`PillarPoint` 位于 `[8.36166, 1.81915, -12.0301]`，优先级 medium；`GatePoint` 位于 `[-16.6577, 2.41884, -39.9426]`，优先级 low；`EnemyPoint` 位于 `[23.0185, 2.63927, -86.6948]`，优先级 high。位置误差不得超过 0.05 世界单位。
- **R3 — 空间行为。** 保留位于 `[0, 1.6, 4]` 的配套透视相机。标记必须由实际三维世界坐标（包括深度）渲染。父级移动和相机移动都必须正确改变投影位置。
- **R4 — 集成。** 保留配套控件。Target next point 选择优先级最高且尚未定位的点，顺序为 EnemyPoint、PillarPoint、GatePoint。目标状态重置清除所有标记状态，不改变几何或优先级。完整重置恢复恰好三个初始点并清除光束。重复重置不得产生重复实例。

验收检查可复用实例、独立状态、准确父级和注册集合成员、坐标、优先级顺序、实际透视渲染位置、移动和重置。公开示例定位 EnemyPoint。不得修改检查或伪造结果。
