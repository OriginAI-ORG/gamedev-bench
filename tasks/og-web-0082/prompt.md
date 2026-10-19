# Sky patrol status strip

Complete the browser HUD in `game/view.js`; the supplied game starts at `index.html`. Use local dependencies.

- **R1 — API.** Export `mountHud(host, config, actions)` with returned `render(state)`, `setMinimum(value)` and `dispose()` methods. Mount in `host`, independently of the world.
- **R2 — Strip.** `#hud` spans `#scene` horizontally and touches its bottom. Use minimum height 58 pixels and opaque `rgb(153, 153, 153)`. Increasing the minimum grows the strip upward from the fixed bottom edge.
- **R3 — Readouts.** Initially render `Health: 3` in `#life` and `Score: 0` in `#score`; update from state.
- **R4 — Fuel instrument.** Bottom-center `#instrument` contains loaded `#power-meter` from `meter.svg` and `#power-indicator` from `indicator.svg`. Both are visible with nonzero size, and the pointer moves with `state.fuel`. Do not substitute a progress widget.
- **R5 — Defeat.** Initially hide `#gameover`. When `state.phase === 'gameover'`, show its solid `#gameover-card` centered in the game area, with `#gameover-title` reading `DEFEAT`.
- **R6 — Fixture.** Keep hit, damage, pan, grow and reset working. Reset restores labels and hides defeat. World panning, viewport changes and minimum-size growth must preserve HUD attachment and meter alignment.

Acceptance tests 1100×760 and 520×800 viewports, two 30-pixel growth increments, image loading, label and pointer changes, defeat and reset. The public example sets score to 100. Do not alter checks or fabricate results.
