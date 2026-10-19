# River flight HUD

Complete `view.js` in the supplied browser game under `game/`; `index.html` is the entry point. Use only local dependencies.

- **R1 — Component.** Export `mountHud(host, config, actions)`, returning `render(state)`, `setMinimum(value)` and `dispose()`. The fixture supplies health, score, fuel and game phase. Create the HUD inside `host`, independently of the moving world.
- **R2 — Layout.** `#hud` spans the full width of `#scene` and stays attached to its bottom edge. Its minimum height starts at 58 pixels and grows upward when `setMinimum` increases it. Use opaque `rgb(153, 153, 153)`.
- **R3 — Labels.** Place visible `#life` and `#score` inside the panel, initially reading `Lives: 3` and `Points: 0`. Update them from `state.life` and `state.score`.
- **R4 — Instruments.** Compose `#instrument` from separate loaded images: `#power-meter` using `meter.svg` and `#power-indicator` using `indicator.svg`. Center the instrument horizontally against the panel's bottom edge. Both images have visible nonzero size. Move the pointer as `state.fuel` changes; do not replace the images with a native progress widget.
- **R5 — End screen.** Include initially hidden `#gameover` with a solid `#gameover-card`, centered in the game area, and `#gameover-title` reading `GAME OVER`. Show it when `state.phase === 'gameover'`.
- **R6 — Integration.** Preserve the supplied hit, damage, pan, grow and reset controls. Reset restores initial labels and hides the overlay. Anchoring must survive viewport resizing and increased minimum height; panning the world must not move the HUD.

Acceptance checks layout at 1100×760 and 520×800, growth in two 30-pixel increments, loaded instrument images, rendered labels, fuel-pointer movement, end-screen visibility and reset. The public example changes the score to 100. Do not modify checks or fabricate results.
