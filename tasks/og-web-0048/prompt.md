# Use walking frames for the run clips

Complete `component.js` in the supplied browser scene in `game/`; retain `index.html`. The package includes separate Crusader idle, run and walk image sets, plus sprite/clip constructors, playback and collision inspection.

- **R1 — Player.** Export `configurePlayer(player, services)`, configure and return the same player. Set `motionMode = 'floating'`, assign a supplied Sprite, default to `idle0` frame 0 and set `speedScale = 2`.
- **R2 — Source choice and direction.** Create `idle0`–`idle7` from `assets/idle/` and `run0`–`run7` from `assets/walk/`. The run-named clips must use walking art. Index 0 faces right, and subsequent indices go clockwise through down-right, down, down-left, left, up-left, up and up-right. Inspect the source direction numbering and map both actions consistently.
- **R3 — Complete clips.** Each idle Clip contains all 16 individual images for its direction; each run Clip contains all 15 walking images. Use supplied Frame objects, full untrimmed images and increasing frame-number order. Both actions loop at base 5 FPS, giving 10 FPS with the sprite scale. Changing the stride of a run image is not a substitute for selecting the walk set.
- **R4 — Collider.** Assign a supplied RectangleCollider with `size = [66, 24]` and `position = [7, 44]` relative to the image center, preserving hit tests.
- **R5 — Preview.** Keep the 299×240 actual-image view, collider, direction controls, Idle/Run, Pause / Play, Advance 0.1 s, Probe pointer and Reset. Start paused at idle0/frame 0; action/direction selection starts real-time playback. Reset restores fresh initial configuration. Preserve supplied art attribution and license.

Acceptance checks walk-versus-run source identity, all directions and frames, rate/loop/scale, typed components, collision geometry, actual pixels and playback/reset. The public example selects Run. Do not modify checks or fabricate results.
