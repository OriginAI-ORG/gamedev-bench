# 居中的属性叠层

完成 `game/` 中配套本地浏览器游戏的 `view.js`；保留 `index.html`。配套环境提供游戏区域、数据控件、`theme.css`、`block.svg` 和 `heart.svg`。

- **R1 — 组件。** 导出 `StatsUI(host)`，提供 `updateStats(stats)` 和 `dispose()`。在 host 中挂载 `#stats`，使用配套 `stats-theme` 类，使叠层保持在游戏区域中央。使用内容居中的水平排列，最小尺寸为 90×16 px。保留共享主题的 8 px 等宽字体和文字颜色。
- **R2 — 分组。** 创建水平排列的 `#block` 和 `#health` 分组。Block 图片与标签之间间距为 0 px，Health 间距为 2 px。`#block-image` 和 `#health-image` 分别加载 `block.svg` 和 `heart.svg`，两者均为 16×16 px，保持图像比例。对应 `#block-label` 和 `#health-label` 的文字需水平及垂直居中。
- **R3 — 数据更新。** `updateStats({block, health, maxHealth})` 把格挡和生命值写入对应标签。值为零时隐藏整个对应分组，恢复正数时重新显示。两个值独立更新，不得硬编码示例数据。配套环境初始提供格挡 4 和生命 10。
- **R4 — 生命周期。** 保留 Apply stats、Zero block、Zero health 和 Reset。重置恢复初始值，并确保只有一个叠层；`dispose()` 移除当前实例。视口改变或任意一组隐藏后，叠层仍需居中。

验收检查任意数据、零值恢复正数、加载的图标像素、比例保持、分组间距、共享主题、标签对齐、1100×760 和 520×800 下的居中、销毁和重置。公开示例隐藏零格挡分组，同时保留生命 10。不得修改检查或伪造结果。
