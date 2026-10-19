# 使用图像资源配置小地图

使用 `resources.json` 中提供的命名图像资源完成 `ui.json`。这是一道声明式界面题：保持所提供的 JavaScript、HTML、CSS、资源定义和图像不变，不要添加代码文件。

- **R1 — 外层容器。** 将 `size` 设为 [200,200]，`margin` 设为 5。提供的绘制器会将边框和内容都放在该边距内。
- **R2 — 边框。** 添加 `frame`，其 `texture` 为 `frame`，`patch` 为 [64,64,64,64]，依次表示左、上、右、下。通过图像资源使用原木质边框。
- **R3 — 内容与网格。** 添加同级的 `content`，其 `margin` 为 20。内部 `grid` 使用 `texture` `grid` 和 `mode` `tile`，以原始尺寸重复铺设蓝图纹理。最终网格大小为 [150,150]。
- **R4 — 玩家标记。** 在网格的 `markers` 数组中添加 `PlayerMarker`，使用 `texture` `player`，`center` 为 true，`visible` 为 true。它在网格内的中心为 [75,75]，原箭头保持图像原始尺寸。
- **R5 — 隐藏原型。** 添加 `MobMarker`，使用 `texture` `mob`；添加 `AlertMarker`，使用 `texture` `alert`。两者的 `visible` 都设为 false。将这些图像元素保留在网格下，以便后续复制；分别使用红宝石和黄色感叹号资源。

每个标记对象包含 `name` 和上述属性。资源名称通过提供的描述文件解析，不要替换为图像路径。验收检查配置、实际布局尺寸、原图像字节、平铺像素、标记层次和可见性。提供的重置场景控件会重新加载配置。保持 `index.html` 可运行。
