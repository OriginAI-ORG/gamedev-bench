# Align vertical trap spawn markers

Complete `component.js` in the supplied local browser scene in `game/`; retain `index.html`. Inspect the supplied 64×64 `trap.png` bitmap. Its sprite origin is at the image center; no image reconstruction is required.

- **R1 — Structure.** Export `configureTrap(trap, Node)`. Create and return one `SpawningPoints` child with `SpawnTop` and `SpawnBot` children using the supplied scene-node constructor. Preserve the existing `Sprite`, its position and rotation.
- **R2 — Visual alignment.** Place SpawnTop at the upper spike tip and SpawnBot at the lower spike tip of the actual bitmap, within 2 image-space pixels. Do not substitute the rectangle center or recenter the image. Use the image's visible shape to determine local coordinates.
- **R3 — Layer and transforms.** SpawnTop has `z = 0`; SpawnBot has `z = 1`. Both stay attached to the holder and inherit parent movement/rotation. The layer-0.5 probe must cover SpawnTop while SpawnBot remains in front.
- **R4 — Fixture.** Preserve Move parent, Rotate parent, Toggle layer probe and Reset. The root begins at [300, 190]; movement adds [40, 20] and rotation adds 90 degrees. Reset restores exactly two markers at their original aligned positions and disables the probe.

Acceptance checks the supplied bitmap, spike-tip alignment, unchanged sprite, hierarchy, transformed visible positions, real paint order and reset. The public example moves the parent. Do not modify checks or fabricate results.
