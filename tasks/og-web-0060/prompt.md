# Victorious battle panel

Complete `panel.js` in the supplied browser game in `game/`. Keep `index.html` as its entry and use local dependencies.

- **R1 — Component.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and `dispose()`. Create one initially hidden `#battle-panel` in `host`. Subscribe to the supplied EventTarget's `battle-over` event with `{text, type}` in `detail`; both this event and the direct method must work.
- **R2 — Presentation.** Cover the game area with black at alpha 0.34902. Center `#battle-content` in both axes, with minimum width and height 40 px. Center `#result-label`, initially `Victorious!`, in 24 px type. Keep the overlay and content aligned when the viewport changes.
- **R3 — Actions.** Use `#continue` labeled `Awesome!` and `#restart` labeled `Restart`, each at least 50×16 px and stretched to the content width. Display the supplied message as plain text. WIN shows only Continue; LOSE shows only Restart. `showScreen` reveals the panel and calls `game.pause()`.
- **R4 — Lifecycle.** Gameplay time and movement stop while the panel is open; its buttons remain interactive. Continue hides it and calls `game.finish()` to end the session in the page. Restart hides it and calls `game.restart()` to start fresh running gameplay. A hidden panel cannot execute another action. `dispose()` removes the panel and its subscription and is safe to repeat.
- **R5 — Integration.** Preserve the supplied encounter, message, outcome and reset controls. Reset removes stale listeners and restores one hidden panel, zero counters and running gameplay.

Acceptance exercises arbitrary event/direct messages, both outcomes, real clock and actor motion, button actions, disposal, reset and layout at 1100×760 and 520×800. The public example wins an encounter. Do not modify checks or fabricate results.
