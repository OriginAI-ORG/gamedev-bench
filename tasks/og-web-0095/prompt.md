# Right health panel

Complete the screen HUD in `game/view.js`. The supplied local game starts from `index.html`.

- **R1.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. Keep the `host` UI independent of world motion.
- **R2.** `#hud` spans the full height of `#scene` and stays on its right edge. Use minimum width 86 pixels and opaque `rgb(153, 153, 153)`. Growing minimum width extends leftward from the fixed right edge.
- **R3.** Initially render `Health: 3` in `#life` and `Score: 0` in `#score`; update with state.
- **R4.** Vertically center `#instrument` at the right edge. Use distinct loaded images `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`) with visible nonzero dimensions. Move the pointer with `state.fuel`; do not substitute a progress widget.
- **R5.** `#gameover` is initially hidden. For `state.phase === 'gameover'`, show its solid `#gameover-card` centered in the game area with `#gameover-title` reading `RETRY`.
- **R6.** Preserve hit/damage/pan/grow/reset; reset restores initial UI. Viewport changes, world panning and panel growth must preserve HUD attachment and meter centering.

Acceptance checks 1100×760 and 520×800 layouts, two 30-pixel width increases, images, state updates, pointer movement, retry overlay and reset. The public example sets score to 100. Use local dependencies; do not modify checks or fabricate results.
