# Growing bottom control panel

Implement `game/view.js` for the supplied browser game, entered through `index.html`. All resources stay local.

- **R1 — API.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. Mount the UI in the screen's `host` layer.
- **R2 — Growth.** A full-width `#hud` touches the bottom of `#scene`. Start with minimum height 58 pixels and opaque `rgb(153, 153, 153)`. Increasing the minimum height must move its top upward while leaving its bottom fixed.
- **R3 — Readouts.** `#life` initially reads `Lives: 3`; `#score` reads `Points: 0`. Both track the provided state.
- **R4 — Instrument.** At the panel's bottom-center, `#instrument` contains loaded `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`) images. Render both with nonzero size and update pointer position with `state.fuel`. Do not replace image composition with a progress widget.
- **R5 — End state.** `#gameover` starts hidden; for `state.phase === 'gameover'`, display a centered solid `#gameover-card` containing `#gameover-title` with `GAME OVER`.
- **R6 — Integration.** Preserve hit/damage/pan/grow/reset. Reset restores the initial UI. World movement must leave the HUD stationary. Resizing must retain full-width anchoring and instrument centering.

Acceptance covers 1100×760 and 520×800 layouts, two 30-pixel growth steps, actual images, state and pointer updates, end screen and reset. The public example sets score to 100. Do not alter checks or fabricate results.
