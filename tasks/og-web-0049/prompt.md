# Slice eight-direction idle and run atlases

Complete `component.js` in the supplied browser scene in `game/`; retain `index.html`. Inspect the Crusader atlases and use the supplied Frame, Clip, Sprite and RectangleCollider classes.

- **R1 — Setup.** Export `configurePlayer(player, services)`, configure and return the same player. Set `motionMode = 'floating'`, use a Sprite defaulting to `idle0` at frame 0 and set `speedScale = 2`.
- **R2 — Atlas slicing.** Create `idle0`–`idle7` from `assets/crusader_idle.png` and `run0`–`run7` from `assets/crusader_run.png`. Idle has 16 frames per direction; run has 17. Each image is a uniform grid of 8 directional rows and the corresponding frame columns. Every Frame must reference its original atlas and full cell rectangle `[x, y, width, height]`. Infer cell dimensions from the image; do not add margins, trim transparent space or combine cells.
- **R3 — Facing and playback.** Index 0 faces right, then directions proceed clockwise through down-right, down, down-left, left, up-left, up and up-right. Determine the source row for each direction and use increasing columns for its complete sequence. Both action sets loop at base 5 FPS; scale 2 yields 10 FPS. Keep idle and run direction mappings consistent.
- **R4 — Collider.** Assign a RectangleCollider with `size = [66, 24]` and `position = [7, 44]`, relative to the untrimmed cell center. Preserve actual boundary tests.
- **R5 — Fixture.** Keep the actual untrimmed image view, collider, direction controls, Idle/Run, Pause / Play, Advance 0.1 s, Probe pointer and Reset. Initial preview pauses at idle0/frame 0; selecting an action/direction starts real-time playback. Reset restores fresh initial configuration. Keep art attribution and license.

Acceptance independently checks every source rectangle, source image identity, direction/column ordering, complete frame counts, animation rates, collision geometry, rendered atlas crops, real-time playback and reset. The public example selects Run. Do not modify checks or fabricate results.
