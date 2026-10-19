# 将方向精灵匹配到网格

完成 `game/` 中配套本地浏览器场景的 `component.js`；保留 `index.html`。观察 `sokoban_character.png` 的帧网格和朝向。使用提供的 `gridCellSize` 确定碰撞尺寸；可见精灵单元与碰撞单元是独立的尺寸。

- **R1 — 配置。** 导出 `configurePlayer(player, services)`，配置并返回传入的玩家。指定使用原始位图的配套 Sprite，并设置正确的均匀行列数。不得裁剪或增加边距。索引按行优先排列，初始帧为 0。
- **R2 — 网格碰撞。** 指定居中的 RectangleCollider，其宽高等于 gridCellSize，同时指定设为 `collideWithAreas = true` 的 RayProbe。保留配套探测方法和区域目标检测。不得用完整精灵图像大小作为碰撞尺寸。
- **R3 — 方向片段。** 在 `player.animations` 中指定 up、down、left、right 四个 AnimationClip 实例。每个片段恰有一条 `property: 'frame'` 轨道，绑定该精灵。选择视觉符合对应名称的全部 6 个不同帧，在分组内按从左到右/从上到下排列；分组可以跨越图像行。关键帧时刻为 0、0.1、0.2、0.3、0.4、0.5 秒，时长为 0.6 秒，启用循环。
- **R4 — 运行。** 保留以最近邻缩放在 128×128 画布内渲染实际单元、方向按钮/方向键和实时循环。保留 Pause / Play、Advance 0.1 s、Probe area 和 Reset。重置恢复第 0 帧、无活动片段，以及使用配套网格尺寸的新配置。

验收分别检查推导的图像网格和碰撞尺寸，检查组件类型及身份、每个帧/轨道/时间戳、可见单元像素、碰撞边界及区域射线行为，以及重置。公开示例选择 Up 并探测区域。不得修改检查或伪造结果。
