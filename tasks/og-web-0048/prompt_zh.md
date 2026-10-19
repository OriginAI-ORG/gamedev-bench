# 在 run 片段中使用行走帧

完成 `game/` 中配套浏览器场景的 `component.js`；保留 `index.html`。题包包含独立的 Crusader idle、run、walk 图像集，以及精灵/片段构造类、播放和碰撞检查功能。

- **R1 — 玩家。** 导出 `configurePlayer(player, services)`，配置并返回同一玩家。设置 `motionMode = 'floating'`，指定配套 Sprite，默认为 `idle0` 第 0 帧，并设置 `speedScale = 2`。
- **R2 — 素材选择与方向。** 使用 `assets/idle/` 创建 `idle0`–`idle7`，使用 `assets/walk/` 创建 `run0`–`run7`。名称为 run 的片段必须使用行走美术。索引 0 朝右，后续索引按顺时针依次朝右下、下、左下、左、左上、上、右上。观察素材方向编号，使两种动作映射一致。
- **R3 — 完整片段。** 每个 idle Clip 包含该方向全部 16 张独立图像；每个 run Clip 包含全部 15 张行走图像。使用配套 Frame 对象、完整未裁剪图像及递增帧编号顺序。两种动作均以基础 5 FPS 循环，经过精灵缩放后为 10 FPS。改变 run 图像的步幅不能代替选择 walk 素材。
- **R4 — 碰撞体。** 指定配套 RectangleCollider，设置相对图像中心的 `size = [66, 24]` 和 `position = [7, 44]`，保留命中检测。
- **R5 — 预览。** 保留 299×240 实际图像视图、碰撞框、方向控件、Idle/Run、Pause / Play、Advance 0.1 s、Probe pointer 和 Reset。初始暂停在 idle0/第 0 帧；动作/方向选择启动实时播放。重置恢复新的初始配置。保留配套美术署名和授权文件。

验收检查 walk 与 run 素材身份、全部方向及帧、速率/循环/缩放、组件类型、碰撞几何、实际像素及播放/重置。公开示例选择 Run。不得修改检查或伪造结果。
