# 卡牌交互：逐项来源审查

来源包括 `task_0281.zip` 至 `task_0294.zip`、`task_config` 指令、卡牌／手牌／状态脚本、主场景和 `test.gd`。十四个原验证器使用相同的状态／重叠序列，但各自的字面值如下。修订后的浏览器任务保留这些语义及各起始项目原本缺失的工作范围。

| 任务 | 界面／手牌 | 拖动组；专用层 | 区域大小 | 秒数 | 卡牌标题 | 修订范围 |
| --- | --- | --- | --- | --- | --- | --- |
| 281 | HUD / CardRow | overlay_layer；UI 根节点 | PlayZone 240×96 | .04 | Guard,Brace,Cleave | 完成状态机、各状态、卡牌转发、手牌归还和放置 |
| 282 | ScreenUI / Grip | drag_layer；UI 根节点 | CastZone 272×92 | .06 | Feint,Ward,Pierce | 缺失函数相同，字面值不同 |
| 283 | OverlayUI / Rack | card_layer；UI 根节点 | ResolveArea 248×108 | .08 | Shell,Focus,Chop | 缺失函数相同，字面值不同 |
| 284 | BattleUI / Hand | ui_layer；UI 根节点 | CardDropArea 256×100 | .05 | Block,Defend,Strike | 缺失函数相同，字面值不同 |
| 285 | CombatHUD / Slots | float_layer；UI 根节点 | CommitArea 260×88 | .03 | Block,Lunge,Guard | 缺失函数相同，字面值不同 |
| 286 | ActionUI / Tray | front_layer；UI 根节点 | UseZone 252×104 | .07 | Ward,Strike,Brace | 缺失函数相同，字面值不同 |
| 287 | BoardUI / HandBar | ui_drag_layer；UI 根节点 | DropSlot 264×98 | .09 | Thrust,Guard,Chant | 缺失函数相同，字面值不同 |
| 288 | TacticalUI / Cards | hud_drag_layer；UI 根节点 | CastArea 244×110 | .05 | Bash,Shield,Jab | 缺失函数相同，字面值不同 |
| 289 | ArenaUI / Palm | screen_layer；UI 根节点 | ReleaseZone 268×90 | .045 | Charge,Brace,Slice | 缺失函数相同，字面值不同 |
| 290 | FieldUI / GripRow | top_ui_layer；UI 根节点 | SpendArea 250×102 | .065 | Ward,Rush,Smite | 缺失函数相同，字面值不同 |
| 291 | BattleOverlay / MoveBar | drag_overlay；UI 根节点 | ConfirmArea 258×94 | .055 | Cover,Drive,Cut | 缺失函数相同，字面值不同 |
| 292 | BattleUI / BottomPanel / HandTray | ui_layer；BattleUI/DragCanvas | CommitZone 264×96 | .06 | Ward,Strike,Brace | 已提供状态机、各状态和卡牌转发；补充拖动放置和手牌重新设父节点监听器 |
| 293 | BattleUI / BottomPanel / HandLane | ui_layer；BattleUI/DragCanvas | CommitZone 264×96 | .06 | Ward,Strike,Brace | 仅把错误的底部面板父节点换为专用拖动层 |
| 294 | CombatHUD / BottomBar / CardTray | ui_layer；CombatHUD/DragStage | ConfirmArea 258×92 | .055 | Guard,Drive,Slice | 仅替换错误的底部栏父节点，保留手牌换行 |

旧改编以单一拖动演示替代可复用组件／事件接线，丢失生命周期保护、带类型的回调转发、原索引恢复，以及后期变体较小的修复范围，不能视为等价。现在各项均有明确配置和独立的已提供代码边界。保留原始 256×144 逻辑视口、25×30 卡牌／检测器、中心 (12.5,15)、掩码 2、初始禁用监测和 0–3 状态标识。逻辑宽度超过 256 的区域仍大于可见视口。

移除引擎序列化、原生节点／资源类型及一概排除引擎／像素要求的声明。以 DOM 输入和 EventTarget 替代原生回调，以真实 AABB 重叠替代碰撞区域，以 DOM 插入替代延迟子节点排序。提供方负责缩放布局、重叠服务和渲染。已提供的即时布局没有待执行补间，因此不额外要求重写动画取消。原卡牌场景未引用图像；CSS 保留几何、标题和状态用途，不引入压缩包内无关的战斗美术。

新增重复／不存在成员保护、监听器清理、明确的添加／重置检查控件和可见区域边界。手牌间距 4 与检查颜色是已提供的展示选择，不是额外求解工作。后期底部面板保留高度 36（292／293）和 40（294）。指令 292 简写为 DragCanvas，但场景和验证器指向 BattleUI/DragCanvas，修订层级遵循这一证据。

独立状态机探针检查初始进入／赋值顺序、拒绝非当前状态或未知状态的转换、退出→进入→赋值、四种转发方法和断开连接。模拟时钟检查阈值以下／恰好到达阈值、立即取消与重新计时。检查嵌套坐标、全部原始索引、新增卡牌和索引钳制；按对象身份检查成员关系及部分矩形重叠，并另行验证真实鼠标拖动、渲染状态、出牌和重置。行为变异覆盖移除保护、过期计时器、仅追加恢复和两种错误父节点。没有运行源引擎；等价判断来自已检查的契约和源行为，不代表完成时间已经实测相等。
