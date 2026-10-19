# 黄色自发光拾取物轮廓

完成 `game/` 中配套浏览器游戏的 `component.js`，保留 `index.html` 和本地依赖。配套环境包含 WebGL 渲染、射线拾取和可工作的焦点控制器；请完成材质、外壳和物品数据配置。

- **R1 — 焦点绑定。** 保持 `InteractableItem(body, highlight)` 准确绑定对应物体及其高亮。构造时隐藏外壳，`gainFocus()` 显示它，`loseFocus()` 隐藏它。各实例的焦点状态必须独立。
- **R2 — 轮廓工厂。** 导出 `createPickup()`，通过 `createBasePickup()` 返回新的 `{body, interaction}`。保留冻结的 0.75 单位立方体、0.9 单位高亮外壳、`collisionLayer: 2` 和 `collisionMask: 3`。把高亮的 `flipFaces` 和 `emissive` 设为 true，RGB `color` 设为 `[1, 1, 0]`（#ffff00）。通过配套渲染器反转外壳表面，让黄色边缘环绕立方体而不覆盖其明暗表面。光照改变时仍发黄色光，视角旋转时跟随立方体。
- **R3 — 可复用数据。** 实现导出的 `ItemData(itemName, itemModel)`，保存字符串和可调用模型工厂。导出 ItemData 实例 `testCube`，满足 `itemName === 'Test Cube'`、`itemModel === createPickup`。两次工厂调用必须创建不同的物体、高亮和交互组件。
- **R4 — 集成。** 保留指针拾取、键盘画布聚焦/失焦、视角旋转、光照、类别探测和重置。探测类别 1 和 2 能接触中心，4 被过滤。重置恢复一个未聚焦立方体并显示物品名。重复聚焦和重置不得积累外壳或共享状态。

验收检查元数据/工厂身份、焦点绑定、碰撞过滤、实际指针和键盘输入、黄色边缘像素及未被遮盖的中心明暗、光照、旋转、独立实例和重置。公开示例聚焦后取消聚焦。不得修改检查或伪造结果。
