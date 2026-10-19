# Right flight panel

Complete `game/view.js` in the supplied browser game, launched by `index.html` with local dependencies.

- **R1.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. UI in `host` must remain independent of world motion.
- **R2.** `#hud` spans the full height of `#scene` and touches its right edge. Use minimum width 86 pixels and opaque `rgb(153, 153, 153)`. Increased minimum width grows leftward while keeping the right edge fixed.
- **R3.** Initially render `Lives: 3` in `#life` and `Points: 0` in `#score`. Update both from state.
- **R4.** Put `#instrument` vertically centered at the right edge. Use separate loaded images `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`), visible and nonzero-sized. Move the pointer with `state.fuel`; do not substitute a progress widget.
- **R5.** `#gameover` starts hidden. For `state.phase === 'gameover'`, show a solid `#gameover-card` centered in the game area with `#gameover-title` reading `GAME OVER`.
- **R6.** Preserve hit/damage/pan/grow/reset. Reset restores initial UI. Maintain full-height attachment and instrument centering through viewport changes, growth and world panning.

Acceptance checks 1100×760 and 520×800 layouts, two 30-pixel width increases, images, state and pointer changes, overlay and reset. The public example sets score to 100. Do not modify checks or fabricate results.
