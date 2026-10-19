# 组装可复用的战斗目标检测组件

补全缺失的检测器、目标查找器、绑定和敌方分组映射。提供的浏览器底座包含场景注册表、重叠检测服务、单位碰撞体和可见检查控件。`config.json` 包含本题的组名、基础范围、攻击范围、单位身份和位置。

- **R1 — 队伍映射。** 在 `mapping.js` 中定义 `TARGET`，使队伍 0 以 `config.groups[1]` 为目标组，队伍 1 以 `config.groups[0]` 为目标组。底座将其安装为 `UnitStats.TARGET`。查询场景注册表时使用该映射。
- **R2 — 检测几何。** 在 `component.js` 中实现具有 `colShape`、`baseRangeSize` 和 `stats` 设置器的 `DetectRange`。每次赋值都将碰撞层更新为 `4 * (stats.team + 1)`、掩码更新为 `2 - stats.team`，并将碰撞形状替换为半径为 `baseRangeSize * stats.attackRange` 的新圆形。保留提供的单位 24 乘 24 矩形碰撞体及其 `team + 1` 碰撞层；重叠服务判断圆与矩形接触，不能只判断中心距离。
- **R3 — 组装与更新。** `assemble(unit, scene, config)` 为每个单位添加包含 `Collider` 子对象的 `DetectRange`，并添加与检测器同级的 `TargetFinder`，将两者暴露为 `detectRange` 和 `targetFinder`。`bindings.js` 中的 `bind(unit, config)` 将查找器绑定到实际单位。`applyStats(unit, config)` 在启动及每次属性赋值时，将单位当前属性传给检测器。提供的单位设置器已经复制属性；保留这种隔离。
- **R4 — 范围事件。** `TargetFinder.ready()` 连接角色检测器的 `area-entered` 和 `area-exited` 事件。维护独立的 `targetsInRange` 数组，其中保存实际 `BattleUnit` 引用，忽略非单位对象。原地添加或删除，并在每次成员变化时发出一次 `targets-in-range-changed`。重复进入或不存在成员的退出不能重复成员或事件。`hasTargetInRange()` 返回数组是否非空。
- **R5 — 最近的敌方目标。** `findTarget()` 用映射得到的敌方组查询 `scene.getNodesInGroup()`，按全局位置距离平方，把最近的有效 `BattleUnit` 保存到 `target`。搜索整个敌方组，包括检测圆外的单位。忽略非单位对象和角色自身。距离相同时保留注册顺序；没有候选时清空目标。
- **R6 — 渲染与交互。** 保留提供的范围圆、目标连线、选中单位移动、攻击范围选择和靠近/移出/移除/重置控件。可见范围、目标及计数必须反映实际组件。移动单位或修改属性必须触发真实的重叠成员更新；全部敌方单位移出范围后，仍可能保留所选目标。
- **R7 — 生命周期。** 每个单位拥有独立的检测器状态、形状和目标数组。`dispose()` 移除组件监听并清空查找器的目标与列表，不影响其他单位。重复清理应安全。

修改 `component.js`、`bindings.js` 和 `mapping.js`，其余提供的文件保持不变。提交以 `index.html` 为入口的完整包。验收检查两个队伍、各题准确参数、场景结构、类型过滤事件、形状替换、继承坐标、范围外最近目标、实时重叠边界、渲染和清理。
