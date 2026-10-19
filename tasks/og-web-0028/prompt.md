# Reusable spatial flashlight points

Complete `component.js` in the supplied local browser game in `game/`, keeping `index.html`. The fixture supplies `SpatialNode`, a registry, perspective camera and targeting controls.

- **R1 — Reusable point.** Export `Priority = {low: 0, medium: 1, high: 2}` and `FlashlightPoint extends SpatialNode`. Its constructor accepts `(name, {position, priority})`; each instance has its own position and boolean `hasBeenTargeted`, initially false. `resetTargetState()` clears only that instance's targeted state, preserving its name, transform and priority.
- **R2 — Instances.** Export `createPoints(root, registry)`, returning three distinct points attached directly to `root` and added to `registry`. Configure `PillarPoint` at `[8.36166, 1.81915, -12.0301]` with medium priority; `GatePoint` at `[-16.6577, 2.41884, -39.9426]` with low priority; and `EnemyPoint` at `[23.0185, 2.63927, -86.6948]` with high priority. Position error must be at most 0.05 world units.
- **R3 — Spatial behavior.** Preserve the supplied perspective camera at `[0, 1.6, 4]`. Render markers from their true three-dimensional world positions, including depth. Parent movement and camera movement must change their projected positions correctly.
- **R4 — Integration.** Retain the supplied controls. Target next point selects the highest-priority untargeted point, giving EnemyPoint, PillarPoint, then GatePoint. Target-state reset clears all flags without changing geometry or priority. Full reset restores exactly three initial points and clears beams. Repeated resets must not create duplicates.

Acceptance checks reusable instances, independent state, exact parent/registry membership, coordinates, priority order, rendered perspective positions, movement and reset. The public example targets EnemyPoint. Do not modify checks or fabricate results.
