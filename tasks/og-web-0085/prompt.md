# Centered danger dialog

Build the danger overlay in `game/index.html` for the browser game. Use local assets and scripts.

- **R1 — Initial state.** Show the game scene while keeping `#dialog` hidden on load.
- **R2 — Open and content.** `#open-dialog` displays one `#dialog` overlay, containing a solid `#dialog-box` with visible text `DANGER`.
- **R3 — Minimum size.** Give the panel minimum width 240 pixels and minimum height 110 pixels; keep its content readable.
- **R4 — Center and growth.** Keep the panel center within 2 pixels of the `#scene` center on both axes, at 800×600 and 1100×760 viewports. Scene resizing and an 80-pixel increase in both panel minimum dimensions must not shift that center. Grow equally toward opposite sides.
- **R5 — Close and reset.** `#close-dialog` hides the overlay; reopening keeps exactly one panel. `#reset` restores the hidden initial state.

Acceptance checks actual button interactions and rendered geometry, including growth. The public example opens the overlay. Preserve the selectors, keep all resources offline, and do not read private checks or fabricate results.
