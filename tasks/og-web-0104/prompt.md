# Cleared encounter panel

Complete `panel.js` in the supplied browser game in `game/`. Retain `index.html` and use local dependencies.

- **R1 — API.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and repeat-safe `dispose()`. Create one initially hidden `#battle-panel`. Handle EventTarget event `battle-over` with `{text, type}` in `detail`, as well as direct calls.
- **R2 — Layout.** Cover the game area with black at alpha 0.41. Center `#battle-content` in both axes with minimum size 24×24 px. Center `#result-label`, initially `Cleared`, at 20 px. Preserve this layout when resized.
- **R3 — Results.** Display arbitrary supplied messages as plain text. WIN shows only `#continue` (`Proceed`); LOSE shows only `#restart` (`Retry`). Buttons are at least 52×16 px and horizontally centered at natural width. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Runtime.** Pause actual gameplay time and movement while panel buttons remain interactive. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Hidden panels cannot execute actions. Disposal removes DOM and subscription.
- **R5 — Fixture.** Preserve encounter, message, outcome and reset controls. Reset restores one hidden panel, zero counters and running gameplay without stale listeners.

Acceptance covers arbitrary direct/event messages, both outcomes, live pause and actions, disposal, reset and layouts at 1100×760 and 520×800. The public check requests a win. Do not modify checks or fabricate results.
