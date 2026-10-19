# Battle resolved panel

Implement `panel.js` in the supplied local browser game in `game/`; preserve the `index.html` entry.

- **R1 — Interface.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and `dispose()`. Mount one initially hidden `#battle-panel`. Support direct calls and EventTarget event `battle-over` whose `detail` is `{text, type}`.
- **R2 — Presentation.** Fill the game area with black at alpha 0.45. Center `#battle-content` in both axes with minimum size 80×80 px. Center `#result-label`, initially `Battle Resolved`, at 33 px. Preserve anchoring when the viewport changes.
- **R3 — Outcomes.** Show arbitrary supplied messages as plain text. WIN shows only `#continue` (`Onward`); LOSE shows only `#restart` (`Restart Match`). Buttons have minimum size 84×30 px and natural width aligned to the content's left edge. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Lifecycle.** Freeze actual gameplay time and movement while panel buttons remain interactive. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Hidden panels cannot act. Disposal removes DOM and subscription and tolerates repeated calls.
- **R5 — Integration.** Preserve encounter, message, outcome and reset controls. Reset restores one hidden panel, zero counters and running gameplay without duplicate listeners.

Acceptance checks arbitrary direct/event text, both outcomes, live pause and actions, disposal, reset and 1100×760 / 520×800 layouts. The public check requests a win. Do not modify checks or fabricate results.
