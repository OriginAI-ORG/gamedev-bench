# Slice the walking atlas into run-named clips

Complete `component.js` in the supplied browser scene in `game/`; retain `index.html`. Use the supplied Crusader atlases and typed sprite helpers. This task deliberately uses walking art for the run-named action.

- **R1 — Setup.** Export `configurePlayer(player, services)`, configure and return the same player. Set `motionMode = 'floating'`, assign a Sprite with default `idle0`, frame 0 and `speedScale = 2`.
- **R2 — Correct atlas and full cells.** Create `idle0`–`idle7` from `assets/crusader_idle.png`, with all 16 frames per direction, and `run0`–`run7` from `assets/crusader_walk.png`, with all 15 walking frames per direction. Slice each atlas into 8 uniform directional rows and its full frame columns. Use Frame objects referencing the atlas and `[x, y, width, height]` rectangles. Infer cell size from the supplied images; do not trim, pad, skip, duplicate or invent extra columns.
- **R3 — Direction mapping.** Index 0 faces right; indices then proceed clockwise through down-right, down, down-left, left, up-left, up and up-right. Identify the correct source row visually and keep idle/run directions consistent. Frames advance in increasing column order. Clips loop at base 5 FPS, resulting in 10 FPS with the sprite scale.
- **R4 — Collision.** Use a RectangleCollider with `size = [66, 24]` and `position = [7, 44]` relative to the untrimmed image center, preserving hit tests.
- **R5 — Inspection.** Keep actual atlas-cell rendering, collider, direction controls, Idle/Run, Pause / Play, Advance 0.1 s, Probe pointer and Reset. Start paused at idle0/frame 0; action/direction selection starts real-time playback. Reset restores fresh initial configuration. Preserve art attribution and license.

Acceptance checks the actual 15-column walk atlas, every frame rectangle/direction, source choice, complete loops, rates, collider, rendered pixels and playback/reset. The public example selects Run. Do not modify checks or fabricate results.
