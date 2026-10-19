# Centered stats overlay

Complete `view.js` in the supplied local browser game in `game/`; retain `index.html`. The fixture supplies the game area, data controls, `theme.css`, `block.svg` and `heart.svg`.

- **R1 — Component.** Export `StatsUI(host)` with `updateStats(stats)` and `dispose()`. Mount `#stats` inside the host, use the supplied `stats-theme` class, and keep the overlay centered in the game area. Use a horizontal row with centered contents and minimum size 90×16 px. Preserve the shared theme's 8 px monospace text and color.
- **R2 — Groups.** Create horizontal `#block` and `#health` groups. The gap between Block's image and label is 0 px; Health's gap is 2 px. Use loaded `#block-image` and `#health-image` images from `block.svg` and `heart.svg`, each 16×16 px with its aspect ratio preserved. Pair them with `#block-label` and `#health-label`, with horizontally and vertically centered text.
- **R3 — Data update.** `updateStats({block, health, maxHealth})` writes the block and health values to the matching labels. Hide the entire corresponding group when its value is zero and show it again when positive. Both values update independently; do not hardcode the supplied examples. The fixture initially supplies block 4 and health 10.
- **R4 — Lifecycle.** Preserve Apply stats, Zero block, Zero health and Reset. Reset restores initial values and exactly one overlay; `dispose()` removes this instance. The overlay stays centered after viewport resizing and after either group is hidden.

Acceptance checks arbitrary data, zero-to-positive transitions, loaded icon pixels, aspect preservation, group gaps, shared theme, label alignment, centering at 1100×760 and 520×800, disposal and reset. The public example hides the zero-block group while retaining health 10. Do not modify checks or fabricate results.
