# Game-over dashboard

Complete `game/view.js` in the supplied browser game. Launch through `index.html`; use local dependencies.

- **R1 — API.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. The provided fixture owns gameplay state. Mount the UI in `host` independently of the moving world.
- **R2 — Top status.** Place `#hud` 20 pixels from the game area's left, top and right edges. Its horizontal row contains `#life` initially reading `Health: 100` and right-aligned `#score` initially reading `Score: 0`. Update from `state.life` and `state.score`.
- **R3 — Overlay geometry.** `#gameover` starts hidden. When `state.phase === 'gameover'`, show it with insets of 70 pixels left, 60 top, 70 right and 100 bottom relative to `#scene`. Fill it with a visible gradient background that resizes with the game area.
- **R4 — Content.** Within `#gameover-card`, stack `#gameover-title` reading `Game Over!!!`, `#final-score` reading `your score is N` from `state.score`, and `#high-score` reading `your high score is N` from `state.highScore` (initially 100). Keep all labels readable.
- **R5 — Controls during pause.** Provide a horizontal button row: `#menu` calls `actions.menu()`, and `#restart` calls `actions.restart()`. Both must remain usable while gameplay has stopped at game over. Restart restores Health: 100, Score: 0 and a hidden overlay; Menu switches the provided fixture to its menu phase.
- **R6 — Integration.** Preserve supplied hit/damage/pan/reset controls and state updates. World panning must not move the HUD. Preserve margins and alignment at 1100×760 and 520×800. `setMinimum` may be a no-op for this status layout.

Acceptance checks every inset, the rendered gradient, initial hidden state, exact labels, live score updates, paused-game buttons and reset. The public example sets score to 100. Do not modify checks or fabricate results.
