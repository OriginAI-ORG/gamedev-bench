# Center the trap texture and align its markers

Complete `component.js` in the supplied local browser scene under `game/`; keep `index.html`. Inspect the provided 64×64 `trap.png`; its sprite origin starts at the image center.

- **R1 — Recenter the body.** Export `configureTrap(trap, Node)`. Preserve the existing `Sprite` object and bitmap. Adjust only its local position so the center of the bitmap's rectangular body lies at the trap origin, within 2 image-space pixels. Do not rotate, rescale or redraw the bitmap.
- **R2 — Align markers.** Create and return a `SpawningPoints` child containing `SpawnTop` and `SpawnBot`. Align them with the upper and lower spike tips after the sprite translation, within 2 image-space pixels. Their coordinates are relative to the trap through the holder, not relative to the translated sprite.
- **R3 — Layer and inheritance.** SpawnTop has `z = 0`; SpawnBot has `z = 1`. Keep the sprite and marker hierarchy responsive to parent transforms. The layer-0.5 probe covers SpawnTop but not SpawnBot.
- **R4 — Fixture.** Retain Move parent, Rotate parent, Toggle layer probe and Reset. The root begins at [300, 190]; movement adds [40, 20], rotation adds 90 degrees. Reset restores the centered body and two aligned markers without duplicates and disables the probe.

Acceptance independently checks body centering, translated spike-tip coordinates, hierarchy, unchanged bitmap/rotation, parent transforms, visible paint order and reset. The public example moves the parent. Do not modify checks or fabricate results.
