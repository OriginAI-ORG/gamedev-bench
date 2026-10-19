# Winner panel

Complete `panel.js` in the supplied browser game under `game/`, retaining `index.html` and local dependencies.

- **R1 — API.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and repeat-safe `dispose()`. Mount one initially hidden `#battle-panel`. Support direct calls and EventTarget event `battle-over` with `{text, type}` in `detail`.
- **R2 — Layout.** Fill the game area with black at alpha 0.31. Center `#battle-content` in both axes with minimum size 32×32 px. Center `#result-label`, initially `Winner!`, with 23 px type. Preserve layout when resized.
- **R3 — Results.** Show arbitrary supplied messages as plain text. WIN shows only `#continue` (`Accept`); LOSE shows only `#restart` (`Retry`). Buttons have minimum size 58×18 px and natural width aligned to the content's left edge. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Lifecycle.** Freeze actual gameplay time and movement while panel buttons remain interactive. Continue hides the panel and calls `game.finish()` to end the session in the page. Restart hides it and calls `game.restart()` to start fresh running gameplay. Hidden panels cannot act. Disposal removes the DOM and event subscription.
- **R5 — Fixture.** Keep encounter, custom-message, outcome and reset controls. Reset restores one hidden panel, zero counters and running gameplay without stale listeners.

Acceptance covers arbitrary direct/event messages, both outcomes, live pause and actions, disposal, reset and 1100×760 / 520×800 layouts. The public example requests a win. Do not modify checks or fabricate results.
