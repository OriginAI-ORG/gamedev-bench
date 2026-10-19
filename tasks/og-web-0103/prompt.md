# Round won panel

Implement `panel.js` in the supplied local browser game under `game/`; keep `index.html` as entry.

- **R1 — Interface.** Export `Type = {WIN: 0, LOSE: 1}` and `BattleOverPanel(host, events, game, config)` with `showScreen(text, type)` and `dispose()`. Mount one initially hidden `#battle-panel`. Subscribe to EventTarget event `battle-over` with `detail: {text, type}`. Direct calls must also work.
- **R2 — Presentation.** Fill the game area with black at alpha 0.27. Center `#battle-content` horizontally and vertically with minimum size 56×56 px. Center `#result-label`, initially `Round Won`, in 27 px type. Maintain anchoring after resizing.
- **R3 — Outcomes.** Render arbitrary supplied messages as plain text. WIN shows only `#continue` (`Advance`); LOSE shows only `#restart` (`Reset`). Buttons have minimum size 66×24 px and natural width aligned to the content's left edge. Showing a result reveals the panel and calls `game.pause()`.
- **R4 — Lifecycle.** Stop actual gameplay time and actor motion without disabling panel buttons. Continue hides the panel and calls `game.finish()` to end this session in the page. Restart hides it and calls `game.restart()` for fresh running gameplay. Hidden panels cannot act. Disposal removes DOM and subscription and tolerates repeated calls.
- **R5 — Integration.** Preserve encounter, message, outcome and reset controls. Reset leaves one hidden panel, running gameplay and zero counters with no duplicated listeners.

Acceptance checks arbitrary direct/event messages, both outcomes, live pause and actions, disposal, reset and layouts at 1100×760 and 520×800. The public example requests a win. Do not modify checks or fabricate results.
