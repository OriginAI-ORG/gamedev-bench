# Right ammunition panel

Implement `game/view.js` for the supplied browser scene at `index.html`. Keep all resources local.

- **R1.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. Mount the UI in `host`, independently of the world.
- **R2.** Make `#hud` full-height and right-attached to `#scene`, with minimum width 86 pixels and opaque `rgb(153, 153, 153)`. When minimum width increases, grow leftward without moving the right edge.
- **R3.** `#life` initially displays `Ammo: 3`, and `#score` displays `Score: 0`. Update from state.
- **R4.** Right-center `#instrument` contains loaded `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`) images. Both are visible and have nonzero size. Update pointer position with `state.fuel`; a progress widget is not a replacement.
- **R5.** Hide `#gameover` initially. For `state.phase === 'gameover'`, show its solid centered `#gameover-card` with `#gameover-title` reading `DEFEAT`.
- **R6.** Preserve hit/damage/pan/grow/reset; reset restores initial UI. Keep edge attachment and instrument alignment through world panning, resizing and panel growth.

Acceptance checks 1100×760 and 520×800 viewports, two 30-pixel width increments, images, labels, pointer changes, defeat and reset. The public example produces score 100. Do not modify checks or fabricate results.
