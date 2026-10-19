# Install a high-priority chest anchor

Complete `component.js` in the supplied local browser game in `game/`; retain `index.html`. The fixture supplies a spatial hierarchy, perspective projection, registry and reusable `FlashlightPoint` class.

- **R1 — Attachment.** Export `installPoint(chest, Point, registry)`. Construct one instance of the supplied `Point` named `FlashlightPoint`, attach it directly to `chest` at local position `[0, 0, 0]`, register that same instance with `registry.add(point)`, and return it.
- **R2 — Priority.** Set its priority to `Point.Priority.high` (3 in the supplied class). Preserve the supplied point's initially false `hasBeenTargeted` state and reset behavior. The fixture must be able to discover and target it through the registry.
- **R3 — Existing scene.** Leave the existing `ChestTarget` object, its parent and local position `[0, 0.25, 0]` intact. The chest container remains at `[0, 1.45, 0]` with a 180-degree Y rotation. The new anchor must inherit parent transformations and project from its actual world position, rather than staying at a fixed screen coordinate.
- **R4 — Integration.** Preserve target, scene movement, camera movement, target-state reset and fixture reset controls. Targeting draws the beam to this anchor; target reset clears its state. Full reset restores one registered anchor and the unchanged chest target, without duplicates.

Acceptance checks instance and reference identity with an independent supplied point class, high priority, parent/local/world coordinates, preservation of the existing target, projected marker movement, targeting and reset. The public example targets the new anchor. Do not modify checks or fabricate results.
