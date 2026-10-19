# Duplicate a mirrored trap

Complete `component.js` in the supplied local browser scene under `game/`; retain `index.html`. The fixture provides a complete TrapBot and the original 64×64 `trap.png` bitmap.

- **R1 — Reuse.** Export `createTrapTop(root, bottom)`. Deep-clone the supplied bottom trap, name the new instance `TrapTop`, add it directly under the same root, and return it. Preserve all other properties and children, including texture, metadata, marker names, local positions and layers. Do not mutate or share mutable child/transform/property objects with the bottom trap.
- **R2 — Requested changes.** Set TrapTop's local position to [0, -32] and only its `Sprite` child's rotation to 270 degrees. Keep the root trap's rotation unchanged. TrapBot remains at [0, 32] with its Sprite at 90 degrees, so the trap origins are 64 units apart.
- **R3 — Markers.** Both traps retain their own `SpawningPoints` holder with `SpawnLeft` at [-15, 0], `z = 0`, and `SpawnRight` at [15, 0], `z = 1`. Rotating only the Sprite must not rotate the marker holder. Display all four markers; the layer-0.5 probe covers left markers while right markers paint in front.
- **R4 — Fixture.** Preserve Move parent, Rotate parent, Toggle layer probe and Reset. The root starts at [300, 190]; movement adds [40, 20] and rotation adds 90 degrees. Both complete trap instances inherit those transforms. Reset restores the original pair, four markers and no probe without duplicates.

Acceptance compares every cloned property with the supplied instance, checks mutable independence and the two permitted changes, all four marker coordinates/layers, bitmap reuse, rendered transforms, paint order and reset. The public example moves the parent. Do not modify checks or fabricate results.
