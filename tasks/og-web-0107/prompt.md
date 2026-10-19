# You won this one panel

Implement `panel.js` in the supplied local browser game in `game/`; keep `index.html` as entry.

- **R1 — Interface.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and `dispose()`. Mount one initially hidden `#battle-panel`. Subscribe to EventTarget event `battle-over` with `detail: {text, type}`. Direct calls must also work.
- **R2 — Appearance.** Fill the game area with black at alpha 0.43. Center `#battle-content` in both axes with minimum size 76×76 px. Center `#result-label`, initially `You Won This One`, at 32 px. Maintain anchoring on viewport resizing.
- **R3 — Outcomes.** Render arbitrary supplied messages as plain text. WIN shows only `#continue` (`Keep Going`); LOSE shows only `#restart` (`Try Again`). Buttons have minimum size 82×30 px and stretch to content width. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Lifecycle.** Stop actual gameplay time and actor motion without disabling panel buttons. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Hidden panels cannot act. Disposal removes DOM and subscriptions and tolerates repeated calls.
- **R5 — Integration.** Keep encounter, message, outcome and reset controls. Reset restores one hidden panel, zero counters and running gameplay without duplicate listeners.

Acceptance checks arbitrary direct/event text, both outcomes, live pause and actions, disposal, reset and 1100×760 / 520×800 layouts. The public check requests a win. Do not modify checks or fabricate results.
