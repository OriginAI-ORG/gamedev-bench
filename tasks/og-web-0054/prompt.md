# Match a directional sprite to the grid

Complete `component.js` in the supplied local browser scene in `game/`; retain `index.html`. Inspect `sokoban_character.png` for its frame grid and facing directions. Use the supplied `gridCellSize` to size collision; the visible sprite cell and the collision cell are separate dimensions.

- **R1 — Configuration.** Export `configurePlayer(player, services)`, configure and return the passed player. Assign a supplied Sprite with the original bitmap and correct uniform column/row counts. Do not trim or add margins. Indices are row-major and initial frame is 0.
- **R2 — Grid collision.** Assign a centered RectangleCollider whose width and height equal gridCellSize, plus a RayProbe with `collideWithAreas = true`. Retain the supplied probe methods and area-target detection. Do not use the entire sprite image size as collision size.
- **R3 — Directional clips.** Assign up, down, left and right AnimationClip instances in `player.animations`. Each has exactly one track with `property: 'frame'` bound to that sprite. Select all 6 distinct frames visually matching each name, in left-to-right/top-to-bottom order within its group; groups may span image rows. Key them at 0, 0.1, 0.2, 0.3, 0.4 and 0.5 seconds, with duration 0.6 seconds and looping enabled.
- **R4 — Runtime.** Preserve actual cell rendering in the 128×128 canvas using nearest-neighbor scaling, direction buttons/arrow keys and real-time loops. Preserve Pause / Play, Advance 0.1 s, Probe area and Reset. Reset restores frame 0, no active clip and a new configuration using the supplied grid dimensions.

Acceptance checks the inferred image grid and collision size independently, typed component identities, every frame/track/timestamp, visible cell pixels, collision boundary and area-ray behavior, and reset. The public example selects Up and probes an area. Do not modify checks or fabricate results.
