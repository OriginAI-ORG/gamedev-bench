# 可拖动星形装饰

完成 `game/` 中配套本地浏览器游戏的 `draggable.js`；保留 `index.html`。配套环境提供 1024×520 游戏区域、`star.svg`、目标矩形和逐帧更新。

- **R1 — 组件。** 导出 `Draggable extends EventTarget`，构造参数为 `(host, {position, scale = [1, 1], targets})`。将独立副本保存为 `initialPosition` 和 `initialScale`，维护 `.position`、`.element` 与 `.destroyed`。使用 72×72 碰撞矩形、`collisionMask = 2` 和 `damping = 20`。渲染一个 `.draggable`，其中加载的 `.decoration` 图片统一缩放为 0.58。
- **R2 — 运动。** 指针左键按下开始拖动，捕获后的移动更新目的地。在 `update(delta)` 中按系数 `1 - exp(-20 * delta)` 平滑逼近指针的每个坐标，不能瞬移。提供行为一致的 `beginDrag()`、`movePointer({x, y})`、`release()` 和 `cancelDrag()`。保存本次拖动起点。Escape 或指针取消恢复该位置，并防止后续释放触发投放或销毁。
- **R3 — 投放约定。** 释放结束拖动，并发送一次 `dropped` CustomEvent，`detail: {draggable, overlaps}`。传入当前组件本身，以及按碰撞掩码过滤 `.layer` 后实际重叠的目标对象本身。按装饰当前位置的矩形检查重叠，不能只检查中心或指针。若重叠目标中没有 `id === 'DropTarget'`，调用 `selfDestruct()`；否则保留装饰。未拖动时重复释放无效。
- **R4 — 动画。** `playSpawnAnimation()` 在 160 ms 内将根元素从零放大至保存的初始缩放。`selfDestruct()` 在 160 ms 内从当前缩放缩小到零，随后移除元素和输入订阅。两种操作都不能立即出现或消失。精灵自身的 0.58 缩放保持独立。`dispose()` 为重置安全地立即移除实例。
- **R5 — 配套环境。** 初始位置为 (512, 360)；DropTarget 中心为 (512, 180)，尺寸 120×48，层为 2。橙色的层 4 假目标被过滤。保留 Reset、存活数量和投放载荷显示。重置恢复一个新装饰并清空日志。

验收检查初始副本、精灵缩放与碰撞几何、定时出现/缩小、与帧率无关的平滑运动、指针输入和取消、准确事件载荷身份、边缘重叠、掩码、有效/无效投放和重置。公开示例向绿色区域投放。不得修改检查或伪造结果。
