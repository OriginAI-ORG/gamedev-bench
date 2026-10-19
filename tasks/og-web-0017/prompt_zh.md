# 组装自动拾取的坦克物品

完成 `game/` 中配套本地浏览器游戏的 `component.js`；保留 `index.html`。题包提供 Tank 和 Pickup 类、碰撞循环、混音器、8×8 位图及拾取音效。本题要求组装并连接拾取物。配套 Pickup 处理方法已经实现收集、播放音效及延迟移除。

- **R1 — 工厂与场景。** 导出 `createPickup(world, services)`。创建一个 `services.Pickup` 实例，命名为 `Pickup`，设定 `position = [64, 0]` 和 `scale = [4, 4]`，通过 `world.add(pickup)` 加入场景并返回该实例本身。
- **R2 — 图像与碰撞。** 指定 `sprite = {src: 'pickups.png'}` 和 `collider = {type: 'rectangle', size: [8, 8]}`。保持提供的位图和 `pickup.wav` 不变。图像及矩形跟随拾取物缩放，在世界空间占据以物体位置为中心的 32×32 区域。
- **R3 — 音效。** 使用 `services.createAudioPlayer('pickup.wav', 'SFX')` 的返回值设置 `audio`。实际声音经过 SFX 增益通道；静音 SFX 后不能发声，但收集行为和移除时机不变。配套音频播放器的播放 promise 在音源结束时完成，而非在开始播放时完成。
- **R4 — 碰撞连接。** 订阅拾取物的 `body-entered` 事件，将其 `detail` 直接传入 `pickup.onBodyEntered`。Tank 接触后先调用它的 collect 方法，并传入该拾取物本身，再开始播放音效。非 Tank 物体不产生任何效果。声音播放期间拾取物保留在场景内，声音结束后才消失。播放期间重复接触不能重复收集。保留配套处理方法，不得用手动收集按钮代替碰撞。
- **R5 — 配套环境。** Tank 初始位于 [0, 0]，占据 24×24 区域。Left/Right 按钮或左右方向键每次输入移动 16 世界单位；碰撞触发收集。保留 Non-tank contact、Mute SFX 和 Reset。重置恢复一个拾取物、Tank 初始位置、启用的 SFX 以及零收集计数。

验收使用配套服务检查工厂返回身份、配置及事件连接，检查接触过滤、收集/播放/移除顺序、实际渲染位图和音频输出（包含静音播放）、单次收集及重置。公开示例向右移动直至接触拾取物。不得修改检查或伪造结果。
