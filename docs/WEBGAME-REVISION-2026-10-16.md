# WebGame 2.0.0：228 道题逐题审查与修复

228 道题的逐题审查、双语题面、参考实现与验收修复均已完成，全量 QA 通过 228/228。最终结果以 `validation/task-audit.json` 中绑定当前文件哈希的记录为准。范围固定为 218 道组件题和 10 道完整游戏，共 42 个来源/任务族；另 245 个来源条目及两个试点不计入本次工作或成绩分母。

题目、实现和验收直接编辑，没有运行题目生成脚本。每题版本均为 2.0.0；`prompt.md` 为英文且仍是任务输入，`prompt_zh.md` 是完全对应的中文说明。需求编号、接口名和数值通过一致性检查；逐题语义审查记录在下表链接中。任务题面不携带来源引擎描述或泛化免责句。

旧版那句排除检查的统一说明，实质上是在缩小评测范围：排除特定实现形式本身可以是合理的平台转换，但连同资源连接、事件生命周期、精确布局或图像识别一起放弃，会改变考点。现在改为每题明确的浏览器要求和可验证结果；来源差异只记录在审查资料中。

## 逐题对照索引

每个链接包含对应任务的原始要求、旧改编的删减/替换/新增、非等价判断、具体题面修复及验收修复。参数族逐行列出每道题的数值和差异，不把整个族当成一道题。

| 当前任务 | 数量 | 审查记录与主要修复 |
| --- | ---: | --- |
| og-web-0011、0004、0011、0012、0067、0068 | 6 | [子弹](task-reviews/projectile.md)：任务服务、所属对象、实际时间更新、图集/碰撞配置和独立接触绑定 |
| og-web-0013、0063、0065、0133–0149 | 20 | [HUD 与对话框](task-reviews/hud-and-dialog.md)：逐题尺寸、锚点、增长方向、图像和真实状态集成 |
| og-web-0060、0150–0163 | 15 | [战斗结果面板](task-reviews/battle-panel.md)：可复用接口、外部消息、真实暂停、重开和结束 |
| og-web-0014、0016、0024、0028、0122 | 5 | [焦点与空间组件](task-reviews/focus-and-spatial-components.md)：三维变换、优先级、数据绑定和实际发光外壳 |
| og-web-0015、0008、0013、0023、0036、0037、0044、0048 | 8 | [数据与生命周期](task-reviews/data-components.md)：资源身份、状态方法、事件、背包、特性、出售和拖动 |
| og-web-0024、0115、0118、0119、0120 | 5 | [陷阱场景](task-reviews/trap-scenes.md)：原图、层级、局部变换、图层和深拷贝 |
| og-web-0017、0025 | 2 | [拾取](task-reviews/pickup-components.md)：自动音效拾取与空间最近物品交互分别恢复 |
| og-web-0022、0021 | 2 | [菜单和相机](task-reviews/menus-and-cameras.md)：菜单装配和关卡/玩家相机工厂分别恢复 |
| og-web-0029 | 1 | [生成波次](task-reviews/spawn-wave.md)：工厂实例、完整变换、目标绑定和一次性事件 |
| og-web-0034、0054、0079–0084、0086–0088、0090、0091、0098、0104、0109 | 16 | [精灵与动画](task-reviews/sprite-components.md)：原始图集、逐帧动画、碰撞配置和完成时序 |
| og-web-0035、0051、0052、0066 | 4 | [移动与平台](task-reviews/movement-and-platforms.md)：射线、异步补间、逐步物理和动态碰撞 |
| og-web-0039、0089、0092、0105、0127 | 5 | [音频](task-reviews/audio-components.md)：目录绑定、真实音频、复用池、独立路由与持久服务 |
| og-web-0062、0126、0128 | 3 | [控制面板与材质](task-reviews/control-panels-and-materials.md)：不同布局、面板透明度和真实 WebGL 材质 |
| og-web-0063、0112、0113 | 3 | [瓦片](task-reviews/tile-components.md)：原始图集、共享资源、碰撞位和多层绘制 |
| og-web-0040、0060、0131、0132 | 4 | [小地图](task-reviews/minimap.md)：原图、独立尺寸、对象身份与投影生命周期 |
| og-web-0110–0248 | 33 | [收集物覆盖层](task-reviews/collectible-overlays.md)：原图与逐题变换、硬币 90% / 星和宝石 85% IoU、染色约束 |
| og-web-0143–0255 | 7 | [导航追踪](task-reviews/navigation-chase.md)：原地图、连续移动、实时目标与不同待修代码边界 |
| og-web-0150–0261 | 6 | [坦克 HUD](task-reviews/tank-hud.md)：图像进度、装填和真实射击→箱子→拾取链；0261 明确保留非等价标记 |
| og-web-0156 | 1 | [设置](task-reviews/preferences.md)：原范围和默认值、完整按键表、持久化与实际服务 |
| og-web-0157–0280 | 18 | [目标查找](task-reviews/targeting.md)：逐题范围、碰撞公式、组件事件和连接修复边界 |
| og-web-0175–0294 | 14 | [卡牌拖动](task-reviews/card-drag.md)：受限状态迁移、重叠集合、原位置返回、时序和回调 |
| og-web-0189–0314 | 20 | [雨滴与飞溅](task-reviews/rain.md)：恢复只配置/连接的工作范围、预热、材质、碰撞与子发射器 |
| og-web-0209–0334 | 20 | [烟雾拖尾](task-reviews/smoke.md)：恢复资源装配、三张原图、独立曲线/渐变与真实纹理拖尾 |
| og-web-0001 | 1 | [工厂星球](task-reviews/factory-planet.md)：实际有向运输、生产守恒、科技、耗竭和重置成长 |
| og-web-0002 | 1 | [电路](task-reviews/circuit-wizard.md)：15 关、引脚连接、组合逻辑和时序状态 |
| og-web-0003 | 1 | [管道](task-reviews/pipe-crisis.md)：15 图、有限管件、真实分流、污染、交叉通道和蓄水 |
| og-web-0004 | 1 | [规则改写](task-reviews/rule-rewrite.md)：20 关、完整解析、多对象控制、条件/变形/HAS 与无限撤销 |
| og-web-0005 | 1 | [骰子冒险](task-reviews/dice-throne.md)：真实掷骰、装备、分支地图、商店、休息和完整首领战 |
| og-web-0006 | 1 | [单词法术](task-reviews/word-spell.md)：真实手牌、词库、元素时序、卡组成长和限时完整冒险 |
| og-web-0007 | 1 | [边境审查](task-reviews/border-check.md)：10 天/80 人、多证件、累积规则、家庭、故事和四种结局 |
| og-web-0008 | 1 | [王国卡牌](task-reviews/kingdom-cards.md)：永久卡组变化、地图、真实 AI 手牌、同时战斗与外交 |
| og-web-0009 | 1 | [药水商店](task-reviews/potion-shop.md)：七天经营、鲜度/操作质量、配方发现、自动队列、定价反馈和升级 |
| og-web-0010 | 1 | [法庭推理](task-reviews/courtroom.md)：完整双层证词、证物、追问、信誉和成功/失败流程 |

## 保留的差异与难度边界

- 旧版大量“手动按钮推进＋一个计数器”的简化已经撤销。原题已提供的渲染、物理或动画基础设施，继续作为浏览器提供代码，避免把配置题变成重写整个引擎。
- 固定接口、随机种子、词库、关卡、人物或经济公式是新增的复现约束；它们减少部分自由设计工作。即使核心系统恢复，也不能视为与原题完全同难度或共享成绩。
- og-web-0155 的原始起始工程已经完成目标。替代成连接修复题属于明确的非等价改编；不能靠补测试消除这个来源缺陷。
- 部分来源检查存在矛盾、单边阈值或弱约束。采用明确行为/数值目标的调整，逐题记录为收紧，而不是声称旧验收完全等价。
- 完整游戏保留原评分维度和权重。自动检查提供功能证据；未经审阅的艺术、叙事和内容质量分数保持 null，不以参考解通过代替满分。

## 工具与证据

本记录评述 2.0.0 的题目修订。2026-10-19 的 3.0.0 编号迁移保留这 228 题和固定顺序，实际任务编号统一为 `og-web-0001` 至 `og-web-0228`，清单为 `configs/OriginGameDevBench.json`，运行命令位于 `scripts/cohort/`。不保留旧编号或路径兼容。审计只写 `validation/task-audit.json`，不会生成题目或剔除失败题。

完整测试为 37 个 Node 测试和 3 个 Python 测试通过。本机 MXC 读写隔离探针通过，没有启动模型评测。全量 QA 通过 228/228：1,240 个私有场景、3,720 次参考场景执行、922 个行为负例、912 个渲染负例、228 个公开示例及 228 个起始项目拒绝。完整游戏还执行实际输入演示。7 题复用了本轮整合后文件哈希完全相同、已完成三次重复的回执，其余 221 题重新执行；旧版回执不计入。

原始任务、旧目录和旧验证证据保存在 `artifacts/task-revision-20261016/before/`；另 456 个未使用负例目录保存在 `artifacts/task-revision-20261016/retired-negative-cases/`。旧模型结果保持原样，不转记为 2.0.0。未发布、上传或生成新的模型基线。

验证入口：[固定题库](../configs/OriginGameDevBench.json)、[当前哈希审计](../validation/task-audit.json)、[全量 QA 汇总](../artifacts/og-qa-summary.json)、[测试记录](../validation/tests.json)、[隔离记录](../validation/isolation.json)、[技术审查记录](../validation/technical-review.json)。技术审查由本次实现助手完成，记录明确标注为 AI 审查；不冒充独立人工评审。
