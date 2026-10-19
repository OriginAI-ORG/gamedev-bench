# Encounter victory panel

Complete `panel.js` in the supplied browser game in `game/`; retain `index.html` and use local dependencies.

- **R1 — Component.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and `dispose()`. Mount one initially hidden `#battle-panel`. Listen for `battle-over` on the supplied EventTarget, reading `{text, type}` from `detail`. Direct method calls must also work.
- **R2 — Layout.** Fill the game area with black at alpha 0.34902. Center `#battle-content` horizontally and vertically with minimum size 40×40 px. Center `#result-label`, initially `Victorious!`, at 24 px. Preserve anchoring when resized.
- **R3 — Result.** Render each supplied message as plain text. WIN shows only `#continue` (`Awesome!`); LOSE shows only `#restart` (`Restart`). Each button has minimum size 50×16 px and stretches across the content width. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Lifecycle.** Pause actual gameplay time and movement while keeping panel controls interactive. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` to resume from a fresh state. Hidden panels cannot execute actions. `dispose()` removes DOM and subscriptions and tolerates repeated calls.
- **R5 — Fixture.** Preserve encounter, custom-message, outcome and reset controls. Reset leaves one hidden panel, running gameplay and zero counters without duplicate listeners.

Acceptance checks both outcomes, arbitrary event/direct text, live pause, actions, disposal, reset and layout at 1100×760 and 520×800. The public example requests a win. Do not modify checks or fabricate results.
