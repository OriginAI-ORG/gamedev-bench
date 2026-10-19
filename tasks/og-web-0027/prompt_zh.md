# 实现最近物品交互

完成 `game/` 中配套本地浏览器游戏的 `component.js`；保留 `index.html`。题包提供三维 WebGL 视图、玩家移动、重叠检测、InteractableItem 和 ItemData 类，以及立方体/球体工厂。实现可复用的交互处理组件，不得将配套环境替换成名称列表。

- **R1 — 组件与绑定。** 导出继承 EventTarget 的 `PlayerInteractionHandler`。构造函数接收 `{area, input, player, itemTypes, ItemClass}`。保留这些引用，持有自己的 `nearbyBodies` 数组，设置 `area.collisionLayer = 0` 和 `area.collisionMask = 2`，订阅区域的 `body-entered` 和 `body-exited` 事件，并将事件的 `detail` 作为物体传入。订阅 input 的 keydown 事件：非重复的 `KeyF` 按下调用 `pickupNearestItem()`；其他按键不产生效果。
- **R2 — 焦点与成员。** 实现 `onBodyEntered(body)` 和 `onBodyExited(body)`。只有未移除的 ItemClass 实例能加入数组。每个实例只添加一次，并调用其 gainFocus 方法。离开时移除该实例本身并调用 loseFocus。忽略无关物体和重复进入/离开通知；不得残留高亮或重复成员。
- **R3 — 最近选择。** 实现 `pickupNearestItem()`。从附近未移除的物体中选出与 `player.position` 欧氏距离最小的一件，使用全部三个位置坐标。距离相同时保留数组顺序。将其从 nearbyBodies 中移除、清除高亮并调用它的 remove 方法。返回选中的物体本身；附近没有有效物品时返回 null 且不产生效果。长按 F 不得通过重复 keydown 事件连续收走多件物品。
- **R4 — 类型化拾取事件。** 使用已移除物体的 `prefabId` 匹配配套 itemTypes 资源中的 prefabId。移除完成后发送 `item-picked-up`，以匹配到的 ItemData 对象本身作为 `detail`。不得使用名称匹配，也不得发送复制的文字/对象。未匹配到资料的物体仍被移除，但不发送拾取事件。不得修改 itemTypes 或重复计数。
- **R5 — 空间环境。** 保留配套半径 2.5 的接触检测器及原始位置：玩家 [0, 0, 0]、立方体 [1.25, 0.5, -2]、球体 [-2.5, 0.5, -3.5]。资料为 prefabId 是 cube 的 Test Cube 和 prefabId 是 sphere 的 Test Sphere。立方体边长为 0.75，高亮外壳边长为 0.9；球体半径为 0.4，高亮外壳半径为 0.5。只允许类别 2 的物品参与检测。Left/Right 将玩家 X 改变 1；Forward/Back 将 Z 改变 -1/+1。保留真实几何体、焦点高亮、已收集资料显示和 F 输入。
- **R6 — 生命周期。** 实现 `dispose()`，取消两个区域事件及键盘输入的订阅，并清理本组件的高亮和成员。保留 Reset：释放旧处理组件，恢复两件物品、初始位置和空收集显示。多个处理组件的成员及监听器必须独立。

验收检查任意三维距离、物体类型、资料对象身份、进出事件、重复输入、操作顺序和释放；同时检查实际 WebGL 几何体/高亮像素、移动、拾取及重置。公开示例按 F 拾取初始位于范围内的立方体。不得修改检查或伪造结果。
