# Health and score status bar

Build the status bar in `game/view.js` for the supplied browser game at `index.html`. All dependencies must be local.

- **R1 — Component.** Export `mountHud(host, config, actions)` returning `render(state)`, `setMinimum(value)` and `dispose()`. Place UI in `host`, independently of the world layer. `setMinimum` may be a no-op for this layout.
- **R2 — Margins.** Position `#hud` at the top of `#scene`, with exactly 20 pixels of left, top and right spacing. Its width follows the game area when resized.
- **R3 — Readouts.** Create one horizontal row containing `#life`, initially `Health: 100`, and `#score`, initially `Score: 0`. Place the score at the row's right edge with right-aligned text. Render values from `state.life` and `state.score` without duplicating labels.
- **R4 — Integration.** Preserve the supplied hit/damage/pan/reset controls. State changes must update the visible labels, and reset must restore their initial values. Panning the world must leave HUD geometry unchanged.
- **R5 — Scope.** Keep the status row readable at 1100×760 and 520×800. An end-of-game overlay or fuel instrument is outside the required work and must not obstruct the status row.

Acceptance checks exact margins, responsive width, right alignment, initial and changed values, independence from world panning and reset. The public example changes Score: 0 to Score: 100. Do not modify checks or fabricate results.
