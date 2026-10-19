# Wire a unit's AI debug label

Complete `component.js` in the supplied browser game in `game/`. The entry is `index.html`; dependencies must stay local. The provided `UnitAI` controller already implements state text and debug visibility.

- **R1 — Binding.** Export `attachAI(actor, Controller)`. Create a `#debug-label` child of the supplied actor, then return a new instance of the supplied `Controller`, constructed with `{actor, debugLabel}`. Both references must point to those exact objects, including when attached to a different actor.
- **R2 — Geometry.** Position the label relative to the actor's origin at left −65 px, top −47 px, width 130 px and height 18 px. Center its text horizontally and initialize it to `IDLE`. Keep the provided sprite intact. The label must move with its actor and remain above the sprite after viewport changes.
- **R3 — Controller integration.** State and visibility changes come from the supplied controller. Its `setState(text)` updates the bound label; its `enabled` property hides or reveals it without losing the current state. Preserve the Patrol, Attack, Idle and Toggle debug controls. Do not replace controller wiring with independent button handlers or hardcoded label updates.
- **R4 — Reset.** Preserve Move actor and Reset. Reset recreates one actor and one bound label in the initial position, showing `IDLE` with debugging enabled. No stale label may remain.

Acceptance checks reference identity using an independently supplied controller, arbitrary state text, visibility toggling, the exact label rectangle, actor movement, reset and layouts at 1100×760 and 520×800. The public example switches IDLE to PATROL. Do not modify checks or fabricate results.
