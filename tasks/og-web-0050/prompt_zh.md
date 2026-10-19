# 将行走图集切分为 run 名称的片段

完成 `game/` 中配套浏览器场景的 `component.js`；保留 `index.html`。使用配套 Crusader 图集及类型化精灵辅助类。本题明确使用行走美术实现名称为 run 的动作。

- **R1 — 配置。** 导出 `configurePlayer(player, services)`，配置并返回同一玩家。设置 `motionMode = 'floating'`，指定默认动画为 `idle0`、第 0 帧、`speedScale = 2` 的 Sprite。
- **R2 — 正确图集与完整单元。** 使用 `assets/crusader_idle.png` 创建 `idle0`–`idle7`，每方向包含全部 16 帧；使用 `assets/crusader_walk.png` 创建 `run0`–`run7`，每方向包含全部 15 个行走帧。将各图集切分为 8 个均匀方向行及完整帧列。使用引用图集和 `[x, y, width, height]` 矩形的 Frame 对象。根据提供的图像推导单元尺寸；不得裁剪、填充、跳过、重复或凭空添加列。
- **R3 — 方向映射。** 索引 0 朝右，之后按顺时针依次朝右下、下、左下、左、左上、上、右上。根据视觉识别正确素材行，保持 idle/run 方向一致。帧按列递增播放。片段以基础 5 FPS 循环，经过精灵缩放后为 10 FPS。
- **R4 — 碰撞。** 使用 RectangleCollider，设置相对未裁剪图像中心的 `size = [66, 24]` 和 `position = [7, 44]`，保留命中检测。
- **R5 — 检查环境。** 保留实际图集单元渲染、碰撞框、方向控件、Idle/Run、Pause / Play、Advance 0.1 s、Probe pointer 和 Reset。初始暂停在 idle0/第 0 帧；动作/方向选择启动实时播放。重置恢复新的初始配置。保留美术署名和授权文件。

验收检查实际具有 15 列的 walk 图集、每个帧矩形/方向、素材选择、完整循环、速率、碰撞体、实际像素及播放/重置。公开示例选择 Run。不得修改检查或伪造结果。
