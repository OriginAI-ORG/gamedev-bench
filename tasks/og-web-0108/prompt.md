# Success panel

Complete `panel.js` in the supplied browser game under `game/`, using local dependencies and retaining `index.html`.

- **R1 — API.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and repeat-safe `dispose()`. Create one initially hidden `#battle-panel`. Handle EventTarget event `battle-over` with `{text, type}` in `detail`; direct calls must work too.
- **R2 — Layout.** Cover the game area with black at alpha 0.26. Center `#battle-content` horizontally and vertically with minimum size 22×22 px. Center `#result-label`, initially `Success`, with font size 18 px. Preserve layout when resized.
- **R3 — Results.** Display arbitrary supplied messages as plain text. WIN shows only `#continue` (`Done`); LOSE shows only `#restart` (`Retry`). Buttons have minimum size 46×15 px and natural width aligned to the content's left edge. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Runtime.** Actual gameplay time and movement stop while panel buttons remain interactive. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Hidden panels cannot execute actions. Disposal removes the DOM and subscription.
- **R5 — Fixture.** Retain encounter, message, outcome and reset controls. Reset restores one hidden panel, running gameplay and zero counters without stale listeners.

Acceptance covers arbitrary direct/event text, both outcomes, live pause and actions, disposal, reset and layouts at 1100×760 and 520×800. The public example requests a win. Do not modify checks or fabricate results.
