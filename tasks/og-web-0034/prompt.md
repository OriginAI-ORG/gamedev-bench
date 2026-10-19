# Configure four-direction sprite clips

Complete `component.js` in the supplied local browser scene in `game/`; retain `index.html`. The bitmap, sprite/clip classes, animator, collision probes and controls are supplied. Inspect `sokoban_character.png`; configure the player without replacing the artwork.

- **R1 — Assembly.** Export `configurePlayer(player, services)`, configure the passed player and return that same object. Assign a supplied Sprite using the bitmap, 6 columns, 4 rows and initial frame 6. Frame indices run left-to-right, then top-to-bottom. Keep every 64×64 cell intact.
- **R2 — Collision and ray.** Assign a supplied RectangleCollider of size [32, 32] and a supplied RayProbe with `collideWithAreas = true`. The rectangle is centered on the player. The provided ray must detect nearby area targets, not only solid bodies.
- **R3 — Animation clips.** Populate `player.animations` with up, down, left and right AnimationClip instances. Each clip has exactly one track targeting the same sprite object, with `property: 'frame'`, and all 6 distinct frames that visually face that direction. Determine the correct groups from the bitmap and retain their left-to-right/top-to-bottom order; a group may span more than one image row. Set keys at 0, 0.1, 0.2, 0.3, 0.4 and 0.5 seconds, duration 0.6 seconds and looping enabled.
- **R4 — Playback and fixture.** Preserve directional buttons/arrow keys, real elapsed-time playback, Pause / Play, Advance 0.1 s, Probe area and Reset. Render the actual selected cell in the 128×128 canvas, with nearest-neighbor scaling. Each loop visits every frame and wraps; Reset restores initial frame 6, no active clip and a fresh player configuration.

Acceptance checks component identity, complete directional frame selection, single-track sprite binding and timing, rendered cell pixels, collider boundary behavior, ray filtering and reset. The public example selects Up and probes an area. Do not modify checks or fabricate results.
