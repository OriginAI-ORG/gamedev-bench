# Bottom control panel

Complete the HUD component in `game/view.js` for the supplied browser scene. Use `index.html` and local assets.

- **R1 — Interface.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. UI belongs to `host`, not the moving world.
- **R2 — Panel.** `#hud` fills the width of `#scene`, is fixed to its bottom edge, and has minimum height 58 pixels. It grows upward when its minimum height increases. Its fill is opaque `rgb(153, 153, 153)`.
- **R3 — Labels.** Put `#life` and `#score` in the panel, initially `Lives: 3` and `Points: 0`, and update them from state.
- **R4 — Meter.** Put `#instrument` at bottom-center. Use two visible loaded images: `#power-meter` from `meter.svg` and `#power-indicator` from `indicator.svg`. Keep nonzero sizes and move the pointer with `state.fuel`; do not substitute a native progress bar.
- **R5 — Overlay.** An initially hidden `#gameover` contains a centered solid `#gameover-card` and `#gameover-title` with `GAME OVER`. Show it for `state.phase === 'gameover'`.
- **R6 — Fixture.** Preserve hit, damage, pan, grow and reset. Reset restores labels and hides the overlay. Resizing and growing must preserve the attached edge; panning must not displace the HUD.

Acceptance uses 1100×760 and 520×800 viewports, two 30-pixel growth increments, image loading, state updates, fuel-pointer movement, overlay and reset. The public example sets score to 100. Do not alter checks or fabricate results.
