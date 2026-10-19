# Match eight animation directions to separate image sequences

Complete `component.js` in the supplied browser scene in `game/`; retain `index.html`. Inspect the Crusader images: source direction numbers differ from the animation indices. The sprite/clip classes, playback and collision inspection are supplied.

- **R1 — Assembly.** Export `configurePlayer(player, services)`, configure and return the same player. Set `motionMode = 'floating'`, assign a supplied Sprite, default to `idle0` at frame 0 and set `speedScale = 2`.
- **R2 — Direction mapping.** Create `idle0`–`idle7` and `run0`–`run7` using Clip and Frame objects. Index 0 faces right, then indices proceed clockwise through down-right, down, down-left, left, up-left, up and up-right. Determine the corresponding source numbers by inspecting the images; idle and run must agree for each direction.
- **R3 — Full source sequences.** Use all 16 images per idle direction from `assets/idle/` and all 17 images per run direction from `assets/run/`, in increasing frame order. Frames use complete individual images without cropping. Clips loop at base 5 FPS; the sprite scale yields 10 FPS. Do not substitute walk frames or repeated still images.
- **R4 — Feet collider.** Add a supplied RectangleCollider with `size = [66, 24]` and `position = [7, 44]`, relative to the untrimmed image center. Retain its actual hit testing.
- **R5 — Fixture.** Keep actual 299×240 images, the visible collider, direction controls, Idle/Run, Pause / Play, Advance 0.1 s, Probe pointer and Reset. The initial preview is paused; selecting an action/direction plays in real time. Reset restores idle0/frame 0 and fresh configured components. Preserve art attribution and license.

Acceptance checks all eight visual direction mappings, every image/frame, complete loops and rates, default state, floating mode, collider geometry, actual rendered pixels, real-time playback and reset. The public example selects Run. Do not modify checks or fabricate results.
