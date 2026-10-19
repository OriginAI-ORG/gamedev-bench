# Textured missile prefab

Build a reusable missile definition for the supplied browser shooter. Work in `game/`, with `index.html` as the entry point and all dependencies local. Movement, collision dispatch and controls are supplied; this task concerns the missile's asset, collision and visibility configuration.

- **R1 — Module.** Export `definition` from `projectile.js` with `size`, `layer`, `mask`, `texture` and `visibility`. The fixture must instantiate multiple independent missiles from this definition.
- **R2 — Collision.** Set `size` to `[4, 4]`, category `layer` to `4` and filter `mask` to `26`. Detect a contact only when `(mask & target.layer) !== 0`: enemy `2`, bridge `8` and power station `16` are detected; friendly `1` and projectile `4` are ignored. Collision uses the actual centered 4 × 4 box.
- **R3 — Atlas.** Use `texture: {src: 'atlas.svg', region: [69, 0, 4, 4]}`. Crop that source rectangle, preserve transparency and render at 4 × 4 without smoothing. Do not substitute a solid rectangle or the entire atlas.
- **R4 — Visibility.** Set `visibility` to `[4, 4]`. This separate centered probe controls disposal: remove the missile only once the whole probe leaves the range. Keep collision size and visibility size as separate configuration fields.
- **R5 — Integration.** Preserve continuous play, Fire/Space, target and aim selection, owner selection, pause and reset. Missiles move visibly, contact allowed targets, survive filtered targets and disappear on disposal. Reset removes all missiles. Keep `#scene`, `.shot`, `#fire`, `#target-kind`, `#aim`, `#tank`, `#pause`, `#reset` and `#shots`.

Acceptance checks the definition, rendered crop including alpha, category filtering, dimensions, off-screen disposal, continuous movement and reset. The public example observes 200 ms after firing. Do not modify checks or fabricate test results.
