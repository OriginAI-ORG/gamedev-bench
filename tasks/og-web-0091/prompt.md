# Left defeat sidebar

Complete `game/view.js` in the supplied browser game. Use `index.html` and local resources.

- **R1.** Export `mountHud(host, config, actions)` with `render(state)`, `setMinimum(value)` and `dispose()`. Keep screen UI independent of world motion.
- **R2.** A full-height `#hud` touches the left side of `#scene`. Use minimum width 86 pixels and opaque `rgb(153, 153, 153)`. Increasing minimum width grows rightward from a fixed left edge.
- **R3.** Place `#life` with `Ammo: 3` and `#score` with `Score: 0` initially. Update from state.
- **R4.** Left-center `#instrument` contains two loaded, visible, nonzero-size images: `#power-meter` from `meter.svg` and `#power-indicator` from `indicator.svg`. Move the pointer with `state.fuel`; a native progress widget is insufficient.
- **R5.** Keep `#gameover` initially hidden. For `state.phase === 'gameover'`, show its solid centered `#gameover-card` with `#gameover-title` reading `DEFEAT`.
- **R6.** Preserve hit/damage/pan/grow/reset; reset restores the initial UI. Maintain full-height anchoring and meter centering through viewport resizing, growth and world panning.

Acceptance checks 1100×760 and 520×800 viewports, two 30-pixel width increases, images, labels, pointer updates, defeat and reset. The public example produces score 100. Do not modify checks or fabricate results.
