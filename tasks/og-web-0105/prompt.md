# Encounter won panel

Implement `panel.js` in the supplied local browser game under `game/`; retain the `index.html` entry.

- **R1 — Component.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and `dispose()`. Mount one initially hidden `#battle-panel`. Subscribe to EventTarget event `battle-over` whose `detail` is `{text, type}`. Direct method calls must also work.
- **R2 — Presentation.** Fill the game area with black at alpha 0.47. Center `#battle-content` in both axes with minimum size 72×72 px. Center `#result-label`, initially `Encounter Won`, with font size 31 px. Preserve layout on viewport resizing.
- **R3 — Outcomes.** Render arbitrary supplied messages as plain text. WIN shows only `#continue` (`Next Round`); LOSE shows only `#restart` (`Reset Fight`). Buttons have minimum size 80×28 px and natural width centered horizontally. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Lifecycle.** Actual gameplay time and movement stop while panel buttons remain interactive. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Hidden panels cannot act. Disposal removes DOM and event subscription and is safe to repeat.
- **R5 — Integration.** Preserve encounter, custom-message, outcome and reset controls. Reset restores one hidden panel, zero counters and running gameplay without stale listeners.

Acceptance checks arbitrary direct/event text, both outcomes, live pause and actions, disposal, reset and 1100×760 / 520×800 layouts. The public example requests a win. Do not modify checks or fabricate results.
