# 连接一次性敌人生成波次

完成 `game/` 中配套本地浏览器场景的 `component.js`；保留 `index.html`。题包提供支持完整三维变换的场景图、EnemyAIController、Cultist 工厂、触发区重叠检测及投影检查视图。实现生成逻辑和事件连接。控制器的放置接口已经提供，生成初始化时调用该接口。

- **R1 — 生成组件。** 导出 `EnemySpawnPoint`，构造函数为 `(marker, {enemyFactory, autoSetTarget = false, targetToSet = null})`，保留这些引用/配置。其 `spawnInitiated(body)` 必须通过 enemyFactory 创建新敌人，将其作为同级对象加入标记的父级，并独立复制标记的完整局部变换：位置及三个基向量列，包括旋转/缩放。返回新敌人。多次直接调用创建不同实例；不得移动标记或共享可变变换数据。
- **R2 — 控制器配置。** 完成父级挂接及变换复制后，调用新敌人的 `placeOnMesh()` 接口。如果 autoSetTarget 为 true，再调用 `setNodeTarget(targetToSet)` 并传入该对象本身。如果为 false，则不得调用目标设置方法。进入区域的物体不能代替 targetToSet。经过父级变换后，敌人与标记的世界变换必须相同。
- **R3 — 触发器组件。** 导出 `TriggerVolume`，构造函数为 `(trigger)`，提供 `onBodyEntered(body)`，通过配套触发器的 remove 方法将其移除。必须等本次接触事件中所有配置的生成回调执行完毕，才能移除触发器。
- **R4 — 波次绑定。** 导出 `connectWave(trigger, markers, player, enemyFactory)`。为每个提供的标记创建一个 EnemySpawnPoint，使用传入的工厂本身、autoSetTarget true 和 targetToSet player。将触发器的 `body-entered` 事件连接到每个生成点的 spawnInitiated 方法，传入事件 detail。在生成回调之后连接 TriggerVolume 清理。返回 `{points, volume, dispose}`。第一次接触后完整波次已存在，触发器及其监听器消失，再次发送事件不能生成第二波。dispose 必须取消本组件的所有回调订阅，并且在接触前调用也有效。
- **R5 — 配套环境。** 保留 A/B/C 三个标记，局部坐标分别为 [-2.5, 0, -2]、[0, 0, -2.75] 和 [2.5, 0, -2]，上级两层平移分别为 [0, 0, -8] 和 [0, 0, -5]。玩家初始位置为 [0, 0, 2]。触发盒尺寸为 6×3×10，中心位于其原点上方 1.5 单位，层为 0、掩码为 2。Forward/Back 或上/下方向键将玩家 Z 改变 -2/+2。穿过盒子后，在标记位置创建三个可见 Cultist 实例，并显示指向玩家的目标线。Rotate marker group 将父级坐标轴旋转 90 度；标记及已生成敌人都继承该变换。重置释放旧绑定，恢复一个未使用触发器、三个标记及零敌人。

验收检查注入工厂、父级及目标的精确身份、完整变换组合及数据独立性、放置/目标调用顺序、关闭自动目标、每个事件连接、完整波次生成后的清理、实际投影物体和目标线、重复接触及重置。公开示例进入触发区。不得修改检查或伪造结果。
