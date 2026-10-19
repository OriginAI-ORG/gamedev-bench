# 在已集成的世界中完成小地图跟踪器

完成 `component.js` 中 `Minimap` 尚未实现的方法。构造函数、缓存图像引用和世界事件连接均已提供。界面为 [250,250]，网格为 [200,200]。保持提供的界面、图像、绘制器和 `world.js` 不变。

- **R1 — 状态约定。** 保留构造参数 `root`、可选 `player`、`viewport` 和 `frame`，默认使用浏览器视口和提供的 `nextFrame`。保留初始为 1.5 的 `zoom`、`gridScale`、以对象身份为键的 Map `markers`，缓存的 `Grid`、`PlayerMarker`、`MobMarker`、`AlertMarker`，以及以 `mob` 和 `alert` 为键的 `icons`。
- **R2 — 延迟初始化。** `ready(objects)` 在读取布局前等待一帧。将玩家标记居中于网格大小 / 2，并按分量计算 gridScale = 网格大小 / (视口大小 * zoom)。对 `groups` Set 包含 `minimap_objects` 的每个对象，根据 `minimapIcon` 复制原型，将独立副本加入 Grid、显示并按对象身份记录。保留隐藏原型。
- **R3 — 投影。** 没有玩家时，`update()` 返回且不做修改。否则将居中箭头旋转为玩家旋转角 + PI/2 弧度。按分量投影每个对象的 `position`：(对象位置 - 玩家位置) * gridScale + 网格大小 / 2。在 [0,宽) × [0,高) 内使用缩放 1；在外使用缩放 0.75，并将坐标限制到 [0,网格大小]。重新进入时恢复缩放 1。更新实际图像的位置和变换。
- **R4 — 缩放。** `setZoom(value)` 和对 zoom 的赋值都限制到 [0.5,5]，并立即重算 gridScale。`onWheel(event)` 对负 `deltaY` 增加 0.1，对正 deltaY 减少 0.1，忽略零值。在小地图上绑定滚轮事件，处理时阻止页面滚动，并刷新可见标记。
- **R5 — 移除与清理。** `removeObject(object)` 移除图像和 Map 项，不影响其他标记或原型。移除未知对象或重复移除均无害。`dispose()` 断开滚轮处理并移除全部副本；重复调用无害。
- **R6 — 保留集成。** 提供的世界会设置玩家、对象的 minimapIcon 和组成员关系，并派发 `removed`，其 `detail` 为被移除对象本身。已有监听器会调用 removeObject。让 W/S 移动、A/D 转向、收集箱子和重置场景与完成后的跟踪器正常配合。

验收检查延迟布局帧、不同视口和网格尺寸、同名但身份不同的对象、各方向边界、两个缩放极限、属性赋值、真实滚轮输入和已有移除事件。保持 `index.html` 可运行。
