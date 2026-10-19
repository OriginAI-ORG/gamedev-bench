# Defeat header

Implement `game/view.js` for the supplied browser game. `index.html` is the entry point; dependencies are local.

- **R1.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. Keep the UI independent of world motion.
- **R2.** Attach full-width `#hud` to the top of `#scene`. Use minimum height 58 pixels and opaque `rgb(153, 153, 153)`. Minimum-height increases extend downward without moving the top edge.
- **R3.** Place `#life` with initial `Lives: 3` and `#score` with initial `Points: 0` in the header; update from state.
- **R4.** Anchor `#instrument` at top-center. Load separate visible images `#power-meter` from `meter.svg` and `#power-indicator` from `indicator.svg`, with nonzero dimensions. Pointer position tracks `state.fuel`; a progress widget is insufficient.
- **R5.** `#gameover` starts hidden. For `state.phase === 'gameover'`, display its solid centered `#gameover-card` with `#gameover-title` reading `DEFEAT`.
- **R6.** Keep hit/damage/pan/grow/reset working. Reset restores the initial UI. Viewport resizing, panel growth and world panning must preserve attachment and meter centering.

Acceptance uses 1100×760 and 520×800 viewports, two 30-pixel height increases, actual images, labels, pointer updates, defeat and reset. The public example produces score 100. Do not alter checks or fabricate results.
