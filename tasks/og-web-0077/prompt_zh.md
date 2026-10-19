# 在运行中的世界里组装小地图界面

使用提供的 PNG 文件完成 `ui.json`。世界、标记跟踪、移除事件和缩放逻辑已可用。本题只编辑界面配置：保持提供的 JavaScript、HTML、CSS、资源定义和图像不变，不要添加代码文件。

- **R1 — 外层容器。** 将 `size` 设为 [200,200]，`margin` 设为 5。边框和内容都位于该边距内。
- **R2 — 边框。** 添加 `frame`，其 `texture` 为 `assets/panel_woodDetail_blank.png`，`patch` 为 [64,64,64,64]，依次表示左、上、右、下。
- **R3 — 内容与网格。** 添加同级的 `content`，其 `margin` 为 20。内部 `grid` 的 `texture` 为 `assets/pattern_blueprintPaper.png`，`mode` 为 `tile`。以原始尺寸重复铺设纹理；最终网格为 [150,150]。
- **R4 — 玩家标记。** 在网格的 `markers` 数组中添加 `PlayerMarker`，其 `texture` 为 `assets/minimapIcon_arrowA.png`，`center` 为 true，`visible` 为 true。它在网格内居中于 [75,75]，使用图像原始尺寸。
- **R5 — 隐藏原型。** 添加 `MobMarker`，其 `texture` 为 `assets/minimapIcon_jewelRed.png`；添加 `AlertMarker`，其 `texture` 为 `assets/minimapIcon_exclamationYellow.png`。两者的 `visible` 均设为 false。保留在网格下，使提供的跟踪器可以复制出可见的实时标记，同时原型仍然隐藏。
- **R6 — 已有集成。** 保持世界功能正常：W/S 移动，A/D 转向，在小地图上滚动改变缩放，收集箱子会移除其实时标记，重置场景会重建场景。提供的跟踪器会旋转居中的玩家箭头，并将其他对象投影到配置好的网格。

每个标记对象使用 `name` 和上述属性。直接引用 PNG 路径。验收检查配置、原图像字节、实际布局尺寸、平铺像素、隐藏原型和提供的实时集成。保持 `index.html` 可运行。
