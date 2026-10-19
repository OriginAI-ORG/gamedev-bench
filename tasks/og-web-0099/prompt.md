# Victory screen component

Implement `panel.js` in the supplied browser game in `game/`; preserve `index.html` and local dependencies.

- **R1 — Interface.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and repeat-safe `dispose()`. Mount one initially hidden `#battle-panel`. Listen to the supplied EventTarget's `battle-over` event with `{text, type}` in `detail`; also support direct calls.
- **R2 — Appearance.** Cover the game area in black at alpha 0.29. Center `#battle-content` on both axes with minimum size 28×28 px. Center `#result-label`, initially `Victory Screen`, at 21 px. Preserve alignment across viewport resizing.
- **R3 — Display.** Use plain text for every supplied message. WIN shows only `#continue` labeled `Continue`; LOSE shows only `#restart` labeled `Replay`. Both buttons have minimum size 54×18 px and stretch to content width. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Runtime.** Freeze actual gameplay time and actor movement while panel buttons remain interactive. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` to start fresh running gameplay. Ignore actions on hidden panels. Disposal removes DOM and event subscriptions.
- **R5 — Integration.** Preserve encounter, custom-message, outcome and reset controls. Reset restores one hidden panel, zero counters and running gameplay with no stale subscriptions.

Acceptance covers arbitrary direct/event text, both outcomes, live pause and actions, disposal, reset and 1100×760 / 520×800 layouts. The public check requests a win. Do not modify checks or fabricate results.
