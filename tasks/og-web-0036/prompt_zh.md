# 组装平台角色并实现移动

补全 `component.js` 中的 `createPlayer({Body,Sprite,RectangleCollider})` 和 `physicsStep(player,input,dt)`。浏览器配套场景提供碰撞积分、输入、固定物理时钟、绘制和参数控件。

- **R1 — 角色组装。** 返回新的 `Body`，名称为 `Player`，包含使用 `tileYellow_02.png` 的 `Sprite` 和大小为 [32,68] 的 `RectangleCollider`。保留原位图。将可编辑的移动参数 `speed` 设为 1200、`jumpSpeed` 设为 -1800、`gravity` 设为 4000。
- **R2 — 重力与水平输入。** 每次物理更新都向 `player.velocity[1]` 加上重力 ×dt。读取 `input.getAxis()`，将 `player.velocity[0]` 设为输入轴乘以速度。输入轴为 -1、0 或 1，速度单位为像素每秒。水平响应应立即生效。
- **R3 — 先移动再检查跳跃。** 调用一次 `player.moveAndSlide(dt)`，积分移动并更新接触状态。随后，仅在 `input.justPressed('jump')` 和 `player.isOnFloor()` 均为 true 时，将垂直速度设为跳跃速度。按住跳跃键或在空中按下，不能反复重置垂直速度。
- **R4 — 可复用参数。** 移动必须使用角色当前参数值。保留所提供物体的碰撞方法和接触结果，不能用计时器或显示状态替代。着陆必须消除穿透并停止向下速度。
- **R5 — 浏览器集成。** 保留方向控件、键盘方向键、空格跳跃、播放/暂停、1/60 秒单步、参数输入和重置。实际位置及位图绘制必须随移动变化。重置恢复初始角色和参数值。

验收检查组件类型、图像完整性、尺寸、每步速度、操作顺序、地面跳跃限制、着陆、键盘输入和可见移动。保持本地页面可通过 `index.html` 运行。
