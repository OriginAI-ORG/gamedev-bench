# Mission complete panel

Complete `panel.js` in the supplied browser game in `game/`, retaining `index.html` and using local dependencies.

- **R1 — API.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and repeat-safe `dispose()`. Create one initially hidden `#battle-panel`. Support direct calls and EventTarget event `battle-over`, reading `{text, type}` from `detail`.
- **R2 — Layout.** Cover the game area with black at alpha 0.37. Center `#battle-content` horizontally and vertically with minimum size 20×20 px. Center `#result-label`, initially `Mission Complete`, in 19 px type. Maintain layout after resizing.
- **R3 — Results.** Show arbitrary supplied messages as plain text. WIN shows only `#continue` (`Okay`); LOSE shows only `#restart` (`Restart`). Buttons have minimum size 48×16 px and stretch across the content width. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Runtime.** Stop actual gameplay time and movement while panel buttons remain interactive. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Hidden panels cannot act. Disposal removes DOM and event subscription.
- **R5 — Fixture.** Preserve encounter, message, outcome and reset controls. Reset restores one hidden panel, running gameplay and zero counters without stale listeners.

Acceptance covers arbitrary direct/event messages, both outcomes, live pause and actions, disposal, reset and layouts at 1100×760 and 520×800. The public check requests a win. Do not modify checks or fabricate results.
