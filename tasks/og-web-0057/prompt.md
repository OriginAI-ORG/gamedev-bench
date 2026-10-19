# Bind sprite frames to four movement directions

Complete `component.js` in the supplied local browser scene in `game/`; retain `index.html`. Use the supplied `sokoban_character.png`, divided into 6 columns and 4 rows. The animator, sprite/clip constructors, collision probes and inspection controls are already available.

- **R1 — Player assembly.** Export `configurePlayer(player, services)`, configure the supplied player and return the same object. Assign a supplied Sprite using the original bitmap, the specified grid and initial frame 0. Frame indices are row-major; keep the full 64×64 cells without trimming or margins.
- **R2 — Collision setup.** Assign a centered RectangleCollider of size [32, 32] and a RayProbe with `collideWithAreas = true`. Preserve actual rectangle boundary checks and nearby area-target detection.
- **R3 — Directional tracks.** Add up, down, left and right AnimationClip instances to `player.animations`. Each has exactly one track bound to that sprite and `property: 'frame'`. Visually identify all 6 distinct frames for each direction; retain their left-to-right/top-to-bottom image order within the group, including groups spanning rows. Set keys at 0, 0.1, 0.2, 0.3, 0.4 and 0.5 seconds, duration 0.6 seconds and looping enabled.
- **R4 — Runtime.** Direction buttons/arrow keys must play the corresponding real-time loop and render its actual cells in the 128×128 nearest-neighbor canvas. Keep Pause / Play, Advance 0.1 s, Probe area and Reset. Reset restores frame 0, no active clip and fresh configured components.

Acceptance verifies exact slicing, visually correct directional groups, every frame/timestamp, the single sprite-bound track, rendered cells, collider/ray behavior and reset. The public example selects Up and probes an area. Do not modify checks or fabricate results.
