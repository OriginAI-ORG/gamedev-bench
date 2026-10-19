# 实现小地图跟踪与世界事件

完成 `component.js` 中的 `Minimap` 和 `world.js` 中的 `configureWorld`。所提供界面大小为 [200,200]，网格为 [150,150]，包含原始图像原型和可用的世界检查场景。保持提供的界面、图像和绘制器不变。

- **R1 — 可复用状态。** 构造函数接收 `root`、可选的 `player`、返回 [宽,高] 的 `viewport` 函数和可选异步 `frame` 函数。后两项默认使用浏览器视口和提供的 `nextFrame`。公开 `player`、初始为 1.5 的 `zoom`、`gridScale`，以及以对象身份为键的 Map `markers`。缓存 `Grid`、`PlayerMarker`、`MobMarker`、`AlertMarker`，并缓存从 `mob`、`alert` 映射到两个隐藏原型的 `icons`。
- **R2 — 延迟初始化。** `ready(objects)` 首先等待一帧，使布局可用。将玩家标记放在网格大小 / 2 的中心处，按分量计算 gridScale = 网格大小 / (视口大小 * zoom)，然后为 `groups` Set 包含 `minimap_objects` 的每个对象复制对应原型。通过 `minimapIcon` 选择原型，将每个独立副本加入 Grid、显示并存入 markers。原型保持隐藏。
- **R3 — 投影。** 没有玩家时，`update()` 不做任何操作。否则将居中箭头旋转为玩家旋转角 + PI/2，单位为弧度。对每个跟踪对象的 `position`，按分量计算 (对象位置 - 玩家位置) * gridScale + 网格大小 / 2。在半开矩形 [0,宽) × [0,高) 内使用缩放 1；在外使用缩放 0.75，并将各坐标限制到 [0,网格大小]。对象返回内部时恢复缩放 1。将这些数值显示在实际图像元素上。
- **R4 — 缩放和输入。** `setZoom(value)` 和对 zoom 的赋值都限制到 [0.5,5]，并立即重算 gridScale。`onWheel(event)` 对负 `deltaY` 增加 0.1，对正 deltaY 减少 0.1；零值无效果。将滚轮事件绑定到小地图，处理输入时阻止页面滚动，并更新可见标记。
- **R5 — 移除。** `removeObject(object)` 从 DOM 移除其图像，并删除对应 Map 项；重复移除或移除未知对象均无害。其他对象和原型保持完整。
- **R6 — 世界连接。** `configureWorld({player,objects,minimap})` 设置玩家引用。每个对象具有 `kind`、`groups`、`active`、位置和 EventTarget 方法。为怪物设置 minimapIcon 为 `mob`，箱子为 `alert`，将每个对象注册到 minimap_objects 组，并提供 `remove()`：仅在活跃时执行一次，派发 `removed`，其 `detail` 为该对象本身，然后标记为非活跃。将事件连接到小地图的移除方法。返回用于断开这些监听器的清理函数。
- **R7 — 生命周期与交互。** `dispose()` 断开滚轮处理并移除复制的标记；重复调用无害。保留 W/S 移动、A/D 转向、收集箱子和重置场景。世界事件清理后必须停止后续移除回调。

验收使用不同视口和网格尺寸、同名但身份不同的对象、各方向边界、两个缩放极限、直接属性赋值、真实滚轮输入和实际移除事件。所提供绘制服务不属于实现工作。保持 `index.html` 可运行。
