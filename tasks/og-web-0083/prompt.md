# Canyon flight dashboard

Implement the dashboard in `game/view.js` for the supplied local browser game. Start from `index.html` and keep all dependencies local.

- **R1 — Component.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. The UI must remain independent of world movement.
- **R2 — Bottom bar.** Attach full-width `#hud` to the bottom of `#scene`, with minimum height 58 pixels and opaque `rgb(153, 153, 153)`. Minimum-height growth extends upward without shifting the attached edge.
- **R3 — Labels.** `#life` starts at `Ships: 3`, and `#score` at `Score: 0`. Render subsequent state values.
- **R4 — Meter.** Place `#instrument` at bottom-center, containing separate loaded `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`) images. Both have visible nonzero dimensions. Update the pointer with `state.fuel`; a progress widget is not a replacement.
- **R5 — Retry overlay.** `#gameover` starts hidden. For `state.phase === 'gameover'`, show a solid centered `#gameover-card` and `#gameover-title` reading `RETRY`.
- **R6 — Integration.** Preserve hit/damage/pan/grow/reset. Reset restores labels and hides the overlay. Keep edge anchoring and instrument centering through world panning, viewport resizing and panel growth.

Acceptance checks 1100×760 and 520×800 layouts, two 30-pixel growth steps, image loading, labels, fuel movement, retry overlay and reset. The public example sets score to 100. Do not alter checks or fabricate results.
