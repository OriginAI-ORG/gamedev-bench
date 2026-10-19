# Stage clear panel

Implement `panel.js` in the supplied local browser game in `game/`. Keep `index.html` as entry.

- **R1 — API.** Export `Type = {WIN: 0, LOSE: 1}` and class `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and repeat-safe `dispose()`. Mount one initially hidden `#battle-panel`. Subscribe to EventTarget event `battle-over`, whose `detail` is `{text, type}`; direct calls and events must both show results.
- **R2 — Layout.** The panel fills the game area with black at alpha 0.4. Center `#battle-content` in both axes; its minimum size is 48×48 px. Center `#result-label`, initially `Stage Clear!`, with font size 26 px. Maintain layout after viewport resizing.
- **R3 — Result and buttons.** Show arbitrary message text literally. WIN shows only `#continue` labeled `Continue`; LOSE shows only `#restart` labeled `Retry`. Buttons have minimum size 56×20 px and stretch to the content width. Showing a result calls `game.pause()`.
- **R4 — State.** Actual time and actor motion freeze while the panel remains interactive. Continue hides it and calls `game.finish()` to end the session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Do not execute actions on a hidden panel. Disposal removes its DOM and event subscription.
- **R5 — Integration.** Retain the supplied encounter, custom-message, outcome and reset controls. Reset returns to one hidden panel, running gameplay and zero counters without duplicated listeners.

Acceptance covers event and direct calls, both outcomes, arbitrary messages, pause and actions, disposal, reset and 1100×760 / 520×800 layouts. The public check requests a win. Do not modify checks or fabricate results.
