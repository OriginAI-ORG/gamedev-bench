# Trap spawn-marker coordinates

Complete `component.js` in the supplied local browser scene in `game/`; keep `index.html`. The fixture supplies scene transforms, the trap bitmap and inspection controls.

- **R1 — Hierarchy.** Export `configureTrap(trap, Node)`. Use the supplied scene-node constructor to create one `SpawningPoints` child of `trap`, with exactly two children named `SpawnTop` and `SpawnBot`. Return the holder. Preserve the existing `Sprite` and its texture/transform.
- **R2 — Coordinates.** Set local positions to `SpawnTop: [0, 15]` and `SpawnBot: [0, -15]`. These names identify the required coordinates; positive Y points downward in this browser scene. Set SpawnTop's `z` to 0 and SpawnBot's `z` to 1.
- **R3 — Inheritance and order.** Markers inherit the trap and parent transforms rather than fixed screen positions. SpawnBot must paint in front of an intervening layer-0.5 probe; SpawnTop paints behind it. Keep each marker attached to the holder.
- **R4 — Fixture.** Preserve Move parent, Rotate parent, Toggle layer probe and Reset. The root starts at [300, 190]; movement adds [40, 20], and rotation adds 90 degrees. Reset restores the original scene, exactly two markers and no active probe.

Acceptance checks exact hierarchy and local coordinates, retained sprite identity, transformed rendered positions, bitmap visibility, paint order and reset. The public example moves the parent and observes the markers. Do not modify checks or fabricate results.
