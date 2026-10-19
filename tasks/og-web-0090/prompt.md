# Left ammunition panel

Implement `game/view.js` for the supplied local browser game (`index.html`).

- **R1.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. The UI in `host` is independent of world movement.
- **R2.** `#hud` spans the full height of `#scene` and touches its left edge. Start at minimum width 86 pixels, filled with opaque `rgb(153, 153, 153)`. Increased minimum width grows rightward; the left edge remains fixed.
- **R3.** Initially show `Ammo: 3` in `#life` and `Score: 0` in `#score`. Update with the provided state.
- **R4.** Place `#instrument` vertically centered against the panel's left edge. Load separate visible images `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`) at nonzero sizes. Pointer position tracks `state.fuel`; do not substitute a progress widget.
- **R5.** Hide `#gameover` initially. For `state.phase === 'gameover'`, show a solid `#gameover-card` centered in the game area with `#gameover-title` reading `GAME OVER`.
- **R6.** Preserve hit/damage/pan/grow/reset. Reset restores initial UI. Keep height stretch, edge attachment and instrument centering during world panning, viewport changes and growth.

Acceptance checks 1100×760 and 520×800 layouts, two 30-pixel width increases, images, state and pointer changes, overlay and reset. The public example sets score to 100. All dependencies are local; do not modify checks or fabricate results.
