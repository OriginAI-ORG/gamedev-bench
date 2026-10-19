# Align horizontal trap spawn markers

Complete `component.js` in the supplied local browser scene in `game/`, retaining `index.html`. The supplied 64×64 `trap.png` sprite is already rotated 90 degrees.

- **R1 — Hierarchy.** Export `configureTrap(trap, Node)`. Create and return one `SpawningPoints` child containing `SpawnLeft` and `SpawnRight`, using the provided scene-node constructor. Keep the existing `Sprite` identity, bitmap, position and 90-degree rotation.
- **R2 — Image alignment.** Place SpawnLeft at the visible left spike tip and SpawnRight at the visible right spike tip after the sprite rotation, within 2 image-space pixels. Derive their trap-local coordinates from the supplied bitmap; the markers belong to the holder and must not rotate a second time with the sprite.
- **R3 — Order and transforms.** SpawnLeft has `z = 0`; SpawnRight has `z = 1`. Both inherit the trap's parent transforms. The layer-0.5 probe covers the left marker while the right marker paints in front.
- **R4 — Fixture.** Preserve Move parent, Rotate parent, Toggle layer probe and Reset. The root starts at [300, 190]; movement adds [40, 20] and parent rotation adds 90 degrees. Reset restores exactly two correctly aligned markers and disables the probe.

Acceptance checks local spike alignment, retained sprite properties, hierarchy, transformed rendered positions, bitmap visibility, paint order and reset. The public example moves the parent. Do not modify checks or fabricate results.
