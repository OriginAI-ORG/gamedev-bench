# Centered warning dialog

Complete the browser game's warning overlay in `game/index.html`. All assets and scripts must be local.

- **R1 — Initial state.** The game scene is visible; `#dialog` starts hidden.
- **R2 — Opening.** Clicking `#open-dialog` reveals one overlay `#dialog` with a solid panel `#dialog-box` and visible text `WARNING`.
- **R3 — Size.** Use minimum panel width 230 pixels and minimum height 100 pixels. Keep the content readable.
- **R4 — Symmetric growth.** Center the panel on `#scene`, with at most 2 pixels of error per axis. At 800×600 and 1100×760 viewports, retain the center when the scene resizes or both panel minimum dimensions increase by 80 pixels. Opposite sides expand equally.
- **R5 — Lifecycle.** `#close-dialog` hides the overlay, repeated opening never duplicates the panel, and `#reset` returns to the initial hidden state.

Acceptance checks real interactions, minimum dimensions, centering and growth. The public example opens the overlay. Preserve the selectors; do not access private checks or fabricate results. The game must work without network access.
