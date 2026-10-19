# Slice and configure a directional character

Complete `component.js` in the supplied local browser scene in `game/`; retain `index.html`. Inspect the supplied `sokoban_character.png` to determine its uniform frame grid and directional groups. Sprite/clip classes, animation playback, collision probes and controls are supplied.

- **R1 — Sprite assembly.** Export `configurePlayer(player, services)`, configure the supplied player and return it. Assign a supplied Sprite using the original bitmap and the correct column/row counts, without margins or trimming. Frame indices are row-major. Begin at frame 0.
- **R2 — Collision.** Add a centered RectangleCollider sized [32, 32] and a RayProbe with `collideWithAreas = true`. Preserve their supplied collision methods so the rectangle has the required footprint and the ray detects nearby area targets.
- **R3 — Clips.** Fill `player.animations` with up, down, left and right AnimationClip instances. Each has exactly one track bound to the same sprite, `property: 'frame'`, and all 6 distinct frames visually facing that direction, ordered left-to-right and top-to-bottom within its group. Inspect the image rather than assuming each direction occupies one whole row. Use keys at 0, 0.1, 0.2, 0.3, 0.4 and 0.5 seconds; duration is 0.6 seconds and looping is enabled.
- **R4 — Fixture.** Keep the original bitmap rendered in the 128×128 canvas with nearest-neighbor scaling. Direction buttons/arrow keys start the corresponding real-time loop. Preserve Pause / Play, Advance 0.1 s, Probe area and Reset. Reset restores frame 0, no active clip and a fresh configuration.

Acceptance checks inferred grid dimensions, typed components and bindings, every directional frame and timestamp, actual rendered cells, collision boundaries, area-ray detection and reset. The public example selects Up and probes an area. Do not modify checks or fabricate results.
