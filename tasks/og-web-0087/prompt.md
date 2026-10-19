# Top flight panel

Complete `game/view.js` in the supplied local browser game, launched by `index.html`.

- **R1.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. Mount the screen UI in `host`, independently of world motion.
- **R2.** `#hud` spans the width of `#scene` and touches its top edge. Use minimum height 58 pixels and opaque `rgb(153, 153, 153)`. Increased minimum height grows downward while the top stays fixed.
- **R3.** Initially show `Lives: 3` in `#life` and `Points: 0` in `#score`; update both from state.
- **R4.** Top-center `#instrument` contains separate loaded images `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`), both visible with nonzero size. Move the pointer with `state.fuel`. Do not substitute a progress widget.
- **R5.** Initially hide `#gameover`. When `state.phase === 'gameover'`, show its solid `#gameover-card` centered in the game area, with `#gameover-title` reading `GAME OVER`.
- **R6.** Preserve supplied hit/damage/pan/grow/reset controls. Reset restores initial labels and hides the overlay. Panning, viewport resizing and panel growth must preserve HUD anchoring and instrument alignment.

Acceptance checks 1100×760 and 520×800 layouts, two 30-pixel height increases, images, labels, pointer movement, overlay and reset. The public example sets score to 100. Use local dependencies; do not modify checks or fabricate results.
