# Mission clear panel

Implement `panel.js` in the supplied browser game in `game/`. Keep `index.html` and use local dependencies.

- **R1 — Component.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and `dispose()`. Create one initially hidden `#battle-panel`. Subscribe to EventTarget event `battle-over`, reading `{text, type}` from `detail`; direct calls must also work.
- **R2 — Appearance.** Cover the game area with black at alpha 0.44. Center `#battle-content` in both axes with minimum size 52×52 px. Center `#result-label`, initially `Mission Clear`, at 30 px. Maintain this layout on viewport resizing.
- **R3 — Outcomes.** Display arbitrary supplied messages as plain text. WIN shows only `#continue` (`Keep Going`); LOSE shows only `#restart` (`Try Again`). Buttons are at least 70×22 px and horizontally centered at their natural width. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Runtime.** Stop actual gameplay time and movement while keeping panel buttons interactive. Continue hides the panel and calls `game.finish()` to end the session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Hidden panels cannot act. Disposal removes DOM and subscriptions and is safe to repeat.
- **R5 — Integration.** Retain encounter, custom-message, outcome and reset controls. Reset restores one hidden panel, running gameplay and zero counters with no stale listeners.

Acceptance checks arbitrary direct/event text, both outcomes, live pause and actions, disposal, reset and 1100×760 / 520×800 layouts. The public check requests a win. Do not modify checks or fabricate results.
