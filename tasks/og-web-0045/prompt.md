# Find and configure the missile sprite

Complete the missile prefab in the supplied browser shooter. Work in `game/`, with local assets and `index.html` as the entry point. Inspect `atlas.svg`: the missile is the small ivory projectile with an orange exhaust near the top center. Other regions are distractors. Movement and collision dispatch are supplied.

- **R1 — Module.** Export `definition` from `projectile.js` with `size`, `layer`, `mask`, `texture` and `visibility`. Multiple missiles must be independent instances.
- **R2 — Collision.** Use `size: [4, 4]`, `layer: 4` and `mask: 26`. A centered 4 × 4 collision box detects enemy category `2`, bridge `8` and power station `16`, while ignoring friendly category `1` and projectile category `4`. Contact filtering is `(mask & target.layer) !== 0`.
- **R3 — Visual identification.** Set `texture.src` to `atlas.svg` and select the missile's 4 × 4 rectangle as `texture.region: [x, y, width, height]`. Determine its location from the supplied atlas. Retain the sprite's transparent corners, ivory nose and orange exhaust; render at 4 × 4 without smoothing. A flat square or another atlas object is incorrect.
- **R4 — Visibility.** Set `visibility: [4, 4]` as a separate centered probe. Dispose only after the whole probe leaves the range. Do not confuse this field with collision dimensions.
- **R5 — Integration.** Preserve Fire/Space, aiming, target and owner selectors, continuous movement, pause and reset. Allowed contacts dispose the missile; filtered contacts do not. Reset removes all missiles. Keep `#scene`, `.shot`, `#fire`, `#target-kind`, `#aim`, `#tank`, `#pause`, `#reset` and `#shots`.

Acceptance checks the selected crop's actual pixels and alpha, definition fields, collision filtering, dimensions, disposal, continuous play and reset. The public example observes 200 ms after firing. Do not modify checks or fabricate test results.
