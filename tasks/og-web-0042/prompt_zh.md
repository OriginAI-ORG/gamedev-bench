# 游戏结束仪表板

完成提供的浏览器游戏中的 `game/view.js`。通过 `index.html` 启动，使用本地依赖。

- **R1 — API。** 导出 `mountHud(host, config, actions)`，返回 `render(state)`、`setMinimum(value)` 和 `dispose()`。提供的场景管理玩法状态。将 UI 挂载到 `host`，使其独立于移动的世界。
- **R2 — 顶部状态。** 将 `#hud` 放在距离游戏区左、上、右边各 20 像素的位置。横向行包含初始显示 `Health: 100` 的 `#life` 和初始显示 `Score: 0`、右对齐的 `#score`。根据 `state.life` 和 `state.score` 更新。
- **R3 — 覆盖层几何。** `#gameover` 初始隐藏。当 `state.phase === 'gameover'` 时显示，相对 `#scene` 的内缩距离为左 70、上 60、右 70、下 100 像素。填充可见的渐变背景，并随游戏区调整尺寸。
- **R4 — 内容。** 在 `#gameover-card` 内纵向排列：显示 `Game Over!!!` 的 `#gameover-title`、根据 `state.score` 显示 `your score is N` 的 `#final-score`，以及根据 `state.highScore`（初始 100）显示 `your high score is N` 的 `#high-score`。全部标签必须清晰可读。
- **R5 — 暂停时的控件。** 提供横向按钮行：`#menu` 调用 `actions.menu()`，`#restart` 调用 `actions.restart()`。游戏结束、玩法停止时两者仍必须可用。Restart 恢复 Health: 100、Score: 0 并隐藏覆盖层；Menu 将提供的场景切换到菜单阶段。
- **R6 — 集成。** 保留提供的命中、受伤、平移、重置控件及状态更新。世界平移不得移动 HUD。在 1100×760 和 520×800 下保持边距与对齐。此状态布局允许 `setMinimum` 不执行操作。

验收检查每个内缩距离、实际渲染的渐变、初始隐藏状态、准确标签、实时分数更新、玩法暂停时的按钮及重置。公开示例将分数设为 100。不得修改检查或伪造结果。
