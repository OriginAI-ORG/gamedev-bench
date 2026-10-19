# 切分八方向待机和奔跑图集

完成 `game/` 中配套浏览器场景的 `component.js`；保留 `index.html`。观察 Crusader 图集，使用配套 Frame、Clip、Sprite 和 RectangleCollider 类。

- **R1 — 配置。** 导出 `configurePlayer(player, services)`，配置并返回同一玩家。设置 `motionMode = 'floating'`，使用默认动画为 `idle0` 第 0 帧的 Sprite，并设置 `speedScale = 2`。
- **R2 — 图集切分。** 使用 `assets/crusader_idle.png` 创建 `idle0`–`idle7`，使用 `assets/crusader_run.png` 创建 `run0`–`run7`。Idle 每方向有 16 帧；run 有 17 帧。每张图像都是由 8 个方向行和对应帧列组成的均匀网格。每个 Frame 必须引用原始图集及完整单元矩形 `[x, y, width, height]`。根据图像推导单元尺寸；不得添加边距、裁剪透明区域或合并单元。
- **R3 — 朝向与播放。** 索引 0 朝右，之后按顺时针依次朝右下、下、左下、左、左上、上、右上。确定每个方向的素材行，并按列递增使用完整序列。两组动作都以基础 5 FPS 循环；缩放 2 后为 10 FPS。idle 和 run 的方向映射必须一致。
- **R4 — 碰撞体。** 指定 RectangleCollider，设置相对未裁剪单元中心的 `size = [66, 24]` 和 `position = [7, 44]`。保留实际边界检测。
- **R5 — 配套环境。** 保留实际未裁剪图像视图、碰撞框、方向控件、Idle/Run、Pause / Play、Advance 0.1 s、Probe pointer 和 Reset。初始预览暂停在 idle0/第 0 帧；选择动作/方向启动实时播放。重置恢复新的初始配置。保留美术署名和授权文件。

验收独立检查每个素材矩形、素材图像身份、方向/列顺序、完整帧数、动画速率、碰撞几何、实际图集裁片、实时播放和重置。公开示例选择 Run。不得修改检查或伪造结果。
