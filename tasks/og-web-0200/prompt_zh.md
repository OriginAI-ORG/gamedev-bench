# 配置雨滴与碰撞驱动的飞溅发射器

完成 `configure.js` 中的 `configure(scene, target)`。浏览器粒子运行库、绘制、地面和检查控件已经提供。`requirements.json` 给出本题目标值，并以 `target` 传入。这是一道发射器配置与连接题。

- **R1 — 雨滴容量与可见范围。** 将现有 `Rain` 发射器的 `amount`、`lifetime` 和 `preprocess` 设为目标值。数量表示粒子容量；连续发射速率为数量除以寿命，因此碰撞会减少存活数量。保持位置为 0、-200。根据 `baseSize` 设置 `collisionBaseSize`，并将相对发射器的 `visibilityRect` 设为 [-900, -200, 1800, 900]。视口覆盖 1800 乘 900 世界单位。
- **R2 — 雨滴材质与连接。** 为 Rain 设置独立的 `ParticleMaterial`。`emissionShape` 为 `box`，`boxHalfExtents` 为 [900, 0]，方向为 [目标风向值, 1]，使用目标 `velocity` 范围、零重力和从 `scaleMin` 到 1 的缩放范围。保留提供的 45 度散射角。启用值为 `hide` 的 `collision` 和值为 `collision` 的 `subEmitterMode`；根据 `burst` 设置 `particlesPerCollision`。将 `subEmitter` 指向实际的 `Splash` 发射器。发射宽度为 1800，原点两侧各为 900。
- **R3 — 飞溅材质。** 根据 `splashAmount` 设置 Splash 的容量，将 `explosiveness` 设为 1，启用可见性，关闭独立发射。使用单独材质，将 `alignY` 设为真，方向为 [0, -1]，保留提供的 5 度散射角，速度来自 `splashVelocity`，重力为 [0, 目标重力值]，缩放范围来自 `splashScale`。保持提供的 1 秒寿命。接触时隐藏雨滴，并在接触位置立即发射配置数量的飞溅；飞溅先上升，再受重力下落。
- **R4 — 地面与整合。** 保留提供的地面多边形、顶部 y=260 且尺寸为 1920 乘 120 的碰撞体以及地面遮挡多边形。保留现有发射器对象和名称。材质对象及范围数组必须彼此独立，也不能与目标数据共用。保留提供的实际预热、碰撞模拟、可见范围裁剪、沿速度对齐绘制、暂停/运行、0.1 秒步进和可重复重置。

只修改 `configure.js`，其他文件保持不变，提交完整文件包，以 `index.html` 为入口。验收检查每个逐题参数和引用连接、真实分布和轨迹、接触飞溅与容量、预热启动、可见动画和重置。仅有不驱动实际效果的配置值不能通过。
