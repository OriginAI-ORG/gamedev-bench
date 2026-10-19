# Identify directions in the supplied sprite sheet

Complete `component.js` in the supplied local browser scene in `game/`; retain `index.html`. Inspect this task's `sokoban_character.png`. Its frame placement must be read from the image; use the actual facing direction of each character to select clips. Sprite classes, playback and collision probes are supplied.

- **R1 — Sprite.** Export `configurePlayer(player, services)`, configure and return that same player. Assign a supplied Sprite with the original bitmap, the correct uniform grid dimensions and initial frame 0. Use row-major indices without margins or trimming.
- **R2 — Collider and ray.** Assign a centered [32, 32] RectangleCollider and a RayProbe with `collideWithAreas = true`. The supplied ray must detect area targets, and the collider must retain its actual boundary behavior.
- **R3 — Visual frame selection.** Populate `player.animations` with up, down, left and right AnimationClip instances. Each contains exactly one track bound to the sprite, with `property: 'frame'`. Use all 6 distinct frames visually facing that direction, ordered left-to-right and top-to-bottom within their group. Do not assume a direction occupies a whole row or reuse a frame map from another image. Keys occur at 0, 0.1, 0.2, 0.3, 0.4 and 0.5 seconds; duration is 0.6 seconds and clips loop.
- **R4 — Playback.** Keep real-time direction buttons/arrow keys, Pause / Play, Advance 0.1 s, Probe area and Reset. Render each actual selected cell in the 128×128 canvas with nearest-neighbor scaling. Reset restores frame 0 and no active clip, with a fresh player configuration.

Acceptance checks the supplied bitmap and its particular direction mapping, grid slicing, all six frames and their timing, one-track identity, rendered pixels, collider/ray behavior and reset. The public example selects Up and probes an area. Do not modify checks or fabricate results.
