# River flight control panel

Implement the screen overlay in `game/view.js`. The local browser game starts from `index.html`; its gameplay fixture is supplied.

- **R1 — API.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. Place UI in `host`, independently of world movement.
- **R2 — Bottom anchoring.** Make `#hud` span the game area's width, touch the bottom of `#scene`, and have minimum height 58 pixels. Increasing its minimum height grows it upward without moving the bottom edge. Use opaque `rgb(153, 153, 153)`.
- **R3 — State.** Initially display `Lives: 3` in `#life` and `Points: 0` in `#score`. Render subsequent `state.life` and `state.score` values.
- **R4 — Textured meter.** Bottom-center `#instrument` inside the panel. It contains visible loaded `#power-meter` (`meter.svg`) and `#power-indicator` (`indicator.svg`). Both have nonzero size; the pointer moves with `state.fuel`. A generic progress widget is insufficient.
- **R5 — Game over.** Keep `#gameover` initially hidden. When `state.phase === 'gameover'`, show a solid `#gameover-card` centered in the game area with `#gameover-title` reading `GAME OVER`.
- **R6 — Integration.** Preserve the supplied hit/damage/pan/grow/reset controls. Reset restores the initial UI. The HUD remains anchored after world panning, viewport resizing and minimum-size changes.

Acceptance checks both 1100×760 and 520×800 viewports, two 30-pixel growth steps, actual image loading, labels, pointer movement, overlay and reset. The public example produces score 100. Keep all resources local; do not alter checks or fabricate results.
