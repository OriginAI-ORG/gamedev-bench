# Triumph panel

Complete `panel.js` in the supplied local browser game under `game/`, keeping `index.html` as entry.

- **R1 — API.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and repeat-safe `dispose()`. Mount one initially hidden `#battle-panel`. Handle EventTarget event `battle-over` with `detail: {text, type}` and direct method calls.
- **R2 — Layout.** Fill the game area with black at alpha 0.33. Center `#battle-content` horizontally and vertically with minimum size 68×68 px. Center `#result-label`, initially `Triumph!`, with font size 27 px. Maintain anchoring when the viewport changes.
- **R3 — Results.** Show arbitrary supplied messages as plain text. WIN shows only `#continue` (`Advance`); LOSE shows only `#restart` (`Restart Battle`). Buttons have minimum size 78×26 px and stretch across the content width. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Lifecycle.** Actual gameplay time and movement must stop while panel buttons stay interactive. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Hidden panels cannot execute actions. Disposal removes the DOM and event subscription.
- **R5 — Fixture.** Preserve encounter, message, outcome and reset controls. Reset restores one hidden panel, zero counters and running gameplay without stale listeners.

Acceptance exercises arbitrary direct/event messages, both outcomes, live pause and actions, disposal, reset and layouts at 1100×760 and 520×800. The public example requests a win. Do not modify checks or fabricate results.
