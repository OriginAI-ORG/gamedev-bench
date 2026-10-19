# Top health status strip

Complete `game/view.js` in the supplied browser scene. Launch `index.html` with local resources.

- **R1.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. Mount UI in `host` independently of the world.
- **R2.** Make `#hud` full-width and top-attached to `#scene`, with minimum height 58 pixels and opaque `rgb(153, 153, 153)`. Growing the minimum height extends downward while preserving the top edge.
- **R3.** `#life` initially displays `Health: 3`; `#score` displays `Score: 0`. Update both from state.
- **R4.** Top-center `#instrument` contains visible loaded `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`) images of nonzero size. Move the pointer with `state.fuel`; do not replace them with a progress widget.
- **R5.** Initially hidden `#gameover` becomes visible for `state.phase === 'gameover'`. Its solid `#gameover-card` is centered in the game area and contains `#gameover-title` reading `RETRY`.
- **R6.** Preserve hit/damage/pan/grow/reset. Reset restores the initial UI. Keep anchoring and meter alignment through viewport changes, growth and world panning.

Acceptance checks 1100×760 and 520×800 viewports, two 30-pixel growth steps, loaded images, labels, pointer movement, retry overlay and reset. The public example sets score to 100. Do not alter checks or fabricate results.
