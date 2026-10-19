# 组装八方向动画角色

完成 `game/` 中配套浏览器场景的 `component.js`；保留 `index.html`。题包包含独立的 Crusader idle、run、walk 图像，以及类型化精灵/片段辅助类、播放和碰撞检查功能。

- **R1 — 玩家配置。** 导出 `configurePlayer(player, services)`，配置并返回同一玩家。设置 `motionMode = 'floating'`。指定配套 Sprite，默认动画为 `idle0`、初始帧为 0，并设置 `speedScale = 2`。
- **R2 — 完整序列。** 创建 `idle0` 至 `idle7` 和 `run0` 至 `run7`，使用配套 Clip 对象。每个方向使用 `assets/idle/` 中全部 16 张 idle 图像或 `assets/run/` 中全部 17 张 run 图像，按帧编号递增排列。每个条目为引用完整独立图像、不裁剪的配套 Frame。每种动作恰好覆盖全部 8 个素材方向，每个索引的 idle 和 run 对应相同素材方向。本题允许任意一致的方向索引顺序。片段以基础 5 FPS 循环；精灵速率缩放使实际播放为 10 FPS。run 不得使用 walk 图像。
- **R3 — 脚部碰撞。** 指定配套 RectangleCollider，设置 `size = [66, 24]` 和 `position = [7, 44]`，坐标以未裁剪图像中心为基准。保持命中检测有效。
- **R4 — 检查环境。** 保留 Direction 控件、Idle/Run、Pause / Play、Advance 0.1 s、Probe pointer 和 Reset。初始预览暂停在第 0 帧；选择动作/方向启动实时播放。按原始 299×240 尺寸显示实际未裁剪图像，并将碰撞框覆盖在脚部。重置恢复 idle0/第 0 帧及新的配置。保留配套美术署名和授权文件。

验收检查完整且不重复的方向序列、idle/run 方向一致性、素材图像使用、帧顺序、循环/速率/缩放、组件类型、碰撞框位置及边界行为、实际像素、真实时间播放和重置。公开示例选择 Run。不得修改检查或伪造结果。
