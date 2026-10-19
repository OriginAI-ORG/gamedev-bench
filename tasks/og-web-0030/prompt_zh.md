# 数据驱动的特性追踪面板

完成 `game/` 中配套本地浏览器游戏的 `view.js`；保留 `index.html`。已提供面板结构、单位控件、本地图标和 `Trait` 数据辅助方法。保留图标背景、计数/门槛行及下方名称。

- **R1 — 资源绑定。** 导出 `TraitUI(host)`，提供可写的 `traitData` 和 `active` 属性、`update(units)` 与 `dispose()`。赋值 `traitData` 后立即将其 `.icon` 应用到 `#trait-icon`，将 `.name` 应用到 `#trait-name`。保留准确的特性对象引用。配套环境初始为 elf，门槛为 2/4/6。
- **R2 — 唯一计数。** `update(units)` 从 `traitData.countUnique(units)` 获取数量并显示到 `#active-units`。配套单位具有 `stats.name` 和 `stats.traits`；辅助方法仅统计 traits 包含该特性对象本身的不同名称。重复单位实例仍然可见，但只贡献一次计数。移除单位后必须重新计算当前数量。
- **R3 — 富文本门槛。** 在 `#levels` 中渲染 `traitData.formatLevels(count)` 返回的片段，保留各片段文字和可选颜色。配套 elf 特性仅以 #fafa82 高亮已达到的最高门槛：数量 2–3 时高亮 2，4–5 时高亮 4，6 或更多时高亮 6；不能同时高亮低级门槛。遵循任意资源名称、图标、门槛和格式化结果。
- **R4 — 激活。** 根据 `traitData.isActive(count)` 设置 `active`。激活时整块面板透明度为 1，否则为 0.5。直接设置 `active` 也必须更新透明度。elf 特性在 2 个不同匹配名称时激活。
- **R5 — 集成。** 保留添加/移除、特性选择和重置控件。切换特性实际改变图标/名称，并根据现有单位重新计算。重置清空单位，恢复 elf、数量 0 和未激活透明度，且只有一个面板。`dispose()` 移除实例。

验收检查重复及不匹配单位、全部三个门槛、只高亮最高等级、资源替换及自定义格式化调用、加载的图标像素、透明度、移除和重置。公开示例添加 Archer、Marksman 和另一个 Archer，得到数量 2。不得修改检查或伪造结果。
