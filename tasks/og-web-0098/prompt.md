# Victory result panel

Complete `panel.js` in the provided browser game under `game/`. Use local dependencies and retain `index.html`.

- **R1 — API.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` implementing `showScreen(text, type)` and `dispose()`. Create one initially hidden `#battle-panel` and subscribe to EventTarget event `battle-over` with `detail: {text, type}`. Both direct calls and external events must work.
- **R2 — Visuals.** Fill the game area with black at alpha 0.32. Center `#battle-content` horizontally and vertically with minimum size 36×36 px. Center `#result-label`, initially `Victory!`, in 22 px type. Preserve this layout on resizing.
- **R3 — Outcomes.** Render arbitrary supplied messages as plain text. WIN exposes only `#continue` (`Done`); LOSE exposes only `#restart` (`Again`). Each button has minimum size 60×18 px and fills the content width. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Lifecycle.** Stop actual gameplay time and motion without disabling panel buttons. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` for a fresh running state. Hidden panels cannot act. Disposal removes the panel and event subscription and tolerates repeated calls.
- **R5 — Fixture.** Retain encounter, message, outcome and reset controls. Reset restores one hidden panel, running gameplay and zero counters without stale listeners.

Acceptance checks arbitrary direct/event messages, both outcomes, live pause, actions, disposal, reset and layouts at 1100×760 and 520×800. The public example requests a win. Do not modify checks or fabricate results.
