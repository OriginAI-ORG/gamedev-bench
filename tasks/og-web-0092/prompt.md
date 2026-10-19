# Left health rail

Implement `game/view.js` for the supplied browser game at `index.html`, using local dependencies.

- **R1.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. Screen UI in `host` must not follow world motion.
- **R2.** Attach full-height `#hud` to the left edge of `#scene`, with minimum width 86 pixels and opaque `rgb(153, 153, 153)`. It grows rightward as minimum width increases; the left edge stays fixed.
- **R3.** Initially show `Health: 3` in `#life` and `Score: 0` in `#score`. Both track state values.
- **R4.** Vertically center `#instrument` along the left edge. Use separate loaded, visible images `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`) with nonzero size. Pointer position follows `state.fuel`; do not replace images with a progress widget.
- **R5.** Initially hide `#gameover`. For `state.phase === 'gameover'`, display a solid centered `#gameover-card` with `#gameover-title` reading `RETRY`.
- **R6.** Preserve hit/damage/pan/grow/reset. Reset restores initial UI. Preserve anchoring and instrument alignment through resizing, growth and world panning.

Acceptance uses 1100×760 and 520×800 viewports, two 30-pixel growth steps, images, state updates, pointer movement, retry overlay and reset. The public example sets score to 100. Do not modify checks or fabricate results.
