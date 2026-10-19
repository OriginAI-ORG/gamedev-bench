# 组装视口菜单

完成 `game/` 中配套本地浏览器场景的 `component.js`；保留 `index.html`。题包提供 MenuHandler、过渡材质、游戏循环和检查控件。创建菜单组件并连接其引用和回调。

- **R1 — 组件。** 导出 `createMenus(host, {MenuHandler, material, game, actions})`。将 id 为 menus、铺满视口的根元素加入 host，使用该根元素、game 和 actions 构造配套 MenuHandler。返回该处理器，并命名为 Menus。游戏暂停时组件仍能交互和播放动画。透明根元素不能阻挡无关控件。
- **R2 — 面板与布局。** 创建 launch-menu、pause-menu 和 restart-menu 区块，处理器启动前全部隐藏。各面板锚定视口中点，左偏移为 -205、顶部偏移为 -196 CSS 像素。右/下偏移分别为 [205, 196]、[205, 45] 和 [205, 63]，对应尺寸 410×392、410×241 和 410×259。视口改变时保持这些偏移。每个面板都有填充其内边距内容区的垂直排列容器。启动菜单文字为 FPS Horror 和 By Bonkahe；其他标题为 Paused 和 You Died。
- **R3 — 按钮。** 使用字号为 31 像素的真实按钮。Launch 包含 Full Screen Toggle、Play 和 Quit；Pause 包含 Resume 和 Quit；Restart 包含 Restart 和 Quit。使用 fullscreen、play、resume、restart、quit 作为 `data-action` 值，分别连接返回处理器的 `toggleFullScreen`、`beginLaunch`、`hidePauseMenu`、`restartLevel` 和 `exitGame` 方法。每个 Quit 按钮都调用 exitGame。不得用局部状态文字替代配套方法。
- **R4 — 引用与遮罩。** 将面板本身分别赋给 `launchMenu`、`pauseMenu` 和 `deathMenu`。创建铺满视口的 transition-overlay，设置 `z-index: 2` 和 `pointer-events: none`。将提供的材质本身赋给 `transitionMaterial`，调用 `material.attach(overlay)`，让处理器与实际遮罩共享同一个材质。
- **R5 — 运行连接。** 保留配套启动行为：显示 Launch、隐藏其他面板并暂停游戏；暂停期间遮罩用 2 秒淡出。Play 隐藏 Launch，用 2 秒过渡到遮罩覆盖状态，恢复游戏，再淡出。Pause 冻结可见运动物体及时间；Resume 在暂停期间仍生效。Show death 显示 Restart；Restart 创建新会话。Full Screen Toggle 通过用户操作进入/退出浏览器全屏。Quit 完成过渡后结束本地会话并显示 Session ended。保留 Reset 和检查工具栏。

验收检查构造时隐藏状态、多种视口尺寸下的面板边界、文字、字体、每个回调及精确引用、全屏遮罩和点击穿透，以及实际暂停/恢复运动、全屏、重启/退出行为。公开示例检查初始 Launch 菜单。不得修改检查或伪造结果。
