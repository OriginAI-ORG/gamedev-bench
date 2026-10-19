# 带碰撞门控的网格缓动移动

补全 `component.js` 中的 `GridController`。所提供的浏览器场景已经包含瓦片地图、原有精灵动画、角色、射线探针和缓动时钟。实现移动控制，保留所提供的素材和地图。

- **R1 — 控制器状态。** 保留所提供的角色，将原有 `player.ray` 缓存为 `ray`，将 `animationSpeed` 初始化为 2，`moving` 初始化为 false。`handleInput(event)` 仅在没有活动移动时将按下的方向传给 `move(direction)`。忽略释放、未知方向和重叠的移动请求。
- **R2 — 移动前刷新碰撞。** 在 `player.inputs` 中查找方向。将 `ray.targetPosition` 设为该向量乘以 `player.tileSize`，然后先调用 `ray.forceUpdate()`，再调用 `ray.isColliding()`。遇到阻挡时保持位置和动画不变，也不创建缓动。默认瓦片大小为 64；应使用所提供的值，不要写死位移。
- **R3 — 平滑移动一个瓦片。** 方向畅通时调用 `player.createTween({to,duration,transition})`，目标为起始位置加一个瓦片。时长为 1 除以当前动画速度，使用 `sine` 过渡。所提供的缓动采用正弦缓入缓出，因此归一化时间 t 对应的进度为 (1−cos(πt))/2。不要瞬移到目标。
- **R4 — 动画和异步生命周期。** 调用 `player.animator.play(direction)`，在等待缓动的 `finished` promise 前设置移动标记，仅在该 promise 完成后清除它。移动期间标记始终为 true。缓动期间的输入既不能启动另一次移动，也不能排队等待结束后执行。
- **R5 — 场景集成。** 保留所提供的方向位图片段和可见瓦片碰撞。按钮与方向键必须通过此控制器工作。0.125 秒单步和播放/暂停控制实际缓动时钟；重置恢复原场景，并可接受新的输入。

验收检查射线更新/查询顺序、变化后的瓦片大小和动画速度、被阻挡的移动、正弦中间位置、精确终点、动画选择、输入锁定及 promise 完成。保持本地页面可通过 `index.html` 运行。
