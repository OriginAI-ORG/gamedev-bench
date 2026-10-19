# 连接经过过滤的范围事件转发

检测器和目标查找器已经实现。检测器具有类型过滤的转发处理器，但原始重叠事件尚未连接到它们。`config.json` 提供本题独有的队伍、名称、范围和演示位置。

- **R1 — 连接两个方向。** 在 `forwarding.js` 中实现 `connectForwarding(detector)`。订阅 `area-entered` 并将事件详情传给 `detector.onAreaEntered`；订阅 `area-exited` 并将详情传给 `detector.onAreaExited`。返回用于断开这些准确监听器的清理函数，并确保可安全重复调用。
- **R2 — 保留类型过滤转发。** 提供的处理器只为 `BattleUnit` 实例发出 `unit-entered-range` 和 `unit-exited-range`。查找器订阅这些过滤后的事件，维护 `targetsInRange` 并发出 `targets-in-range-changed`。保留这条两阶段事件链；非单位重叠不能进入范围列表，每次真实进入或退出只产生一次成员通知。
- **R3 — 保留集成。** 保留提供的队伍到敌方组映射、检测器碰撞层 `4 * (team + 1)`、掩码 `2 - team`、各题基础范围乘以攻击范围、24 乘 24 的单位碰撞体及同级检测器/查找器结构。全局最近选择使用整个敌方组，即使范围内没有敌方也如此。保留实时控件、实际形状重叠、属性更新、渲染和清理。

只修改 `forwarding.js`，其余文件保持不变。提交以 `index.html` 为入口的完整包。验收测试原始事件的两个方向、过滤、独立检测器实例、清理、本题的移动示例，以及渲染的成员和目标状态。
