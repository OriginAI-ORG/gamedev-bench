# 可复用交互拾取物

完成 `game/` 中配套浏览器游戏的 `component.js`。保留 `index.html` 和本地依赖。配套 WebGL 渲染器提供冻结的 0.75 单位立方体、独立的 0.9 单位高亮外壳、光照、拾取和碰撞过滤。

- **R1 — 焦点组件。** 导出 `InteractableItem(body, highlight)`，准确保留 `body` 和 `highlight` 引用。构造时隐藏高亮。`gainFocus()` 显示同一个外壳，`loseFocus()` 隐藏它。重复调用不得创建副本或影响其他实例。
- **R2 — 拾取物工厂。** 导出 `createPickup()`，返回新的 `{body, interaction}`。用 `createBasePickup()` 创建物体，将 `collisionLayer` 设为 2、`collisionMask` 设为 3，把自身高亮绑定到交互组件。保留冻结物体、几何形状和独立的白色自发光反向高亮外壳（`color: [1, 1, 1]`、`emissive: true`、`flipFaces: true`）。轮廓必须出现在立方体周围，不覆盖中心的明暗表面；光照改变时仍保持自发光。
- **R3 — 物品数据。** 导出 `ItemData(itemName, itemModel)`，保存字符串和可调用的模型工厂。导出 ItemData 实例 `testCube`，满足 `itemName === 'Test Cube'`、`itemModel === createPickup`。通过此数据创建两个拾取物时，必须得到独立物体、高亮和焦点状态。
- **R4 — 集成。** 保留指针拾取、键盘画布聚焦/失焦、视角旋转、光照、类别探测和重置控件。类别 1 和 2 能接触中心，类别 4 被过滤。重置创建一个新的未聚焦立方体并显示物品信息。视角旋转时，高亮必须跟随三维立方体。

验收直接检查组件与元数据，以及实际射线/过滤行为、指针和键盘输入、渲染轮廓与中心明暗、光照、旋转、实例独立性和重置。公开示例聚焦后取消聚焦。不得修改检查或伪造结果。
