# Centered alert dialog

Implement the browser game's alert overlay in `game/index.html`, using local assets and scripts.

- **R1 — Initial state.** Keep the game scene visible and `#dialog` hidden on initial load.
- **R2 — Open and content.** Clicking `#open-dialog` shows one `#dialog` overlay containing a solid `#dialog-box` and the visible text `ALERT`.
- **R3 — Minimum size.** The panel has minimum width 220 pixels and minimum height 100 pixels. Keep its content readable.
- **R4 — Center and growth.** The center of `#dialog-box` must remain within 2 pixels of the center of `#scene` on both axes. At 800×600 and 1100×760 viewport sizes, resizing the scene or increasing both panel minimum dimensions by 80 pixels must retain this center. Growth extends equally to opposite sides.
- **R5 — Close and reset.** `#close-dialog` hides the overlay. Reopening must not create duplicate panels. `#reset` restores the initially hidden state.

Acceptance uses real button clicks and rendered geometry, including minimum-size growth. The public example opens the overlay. Preserve the stated selectors; do not read private checks or fabricate test results. All resources must work without network access.
