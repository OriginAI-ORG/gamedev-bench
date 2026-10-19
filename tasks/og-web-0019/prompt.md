# Tank projectile motion and cleanup

Implement the projectile behavior in the supplied browser tank range. Work in `game/`; serve `index.html` using only local dependencies. The starter provides rendering, collision dispatch and controls.

- **R1 — Component state.** In `projectile.js`, export `SPEED = 500` and `createProjectile({id, position, direction, tank, world, quests})`. The returned object exposes `id`, `x`, `y`, `direction`, `tank`, `active`, `tick(deltaSeconds)`, `onSensor(target)` and `onBody(body)`. Retain the firing tank and a copy of the travel direction; instances must not share mutable state. This task receives `quests: null`.
- **R2 — Motion.** Every update moves by `normalize(direction) * 500 * deltaSeconds`. Support arbitrary nonnegative time steps and non-unit directions. A zero vector stays still, without NaN coordinates. The game must animate continuously; a manual step button alone is insufficient.
- **R3 — Sensor contact.** An active bullet receiving `onSensor` must call `world.removeProjectile(projectile)`. No further motion or contact effects are allowed after disposal.
- **R4 — Body contact.** If `body.kind === 'crate'`, call `world.destroyBody(body)` before removing the projectile. For other solid bodies, remove only the projectile. Both handlers must ignore repeated callbacks after disposal. Destroyed crates must disappear from the actual game.
- **R5 — Fixture lifecycle.** Keep the visible 3 × 3 textured projectile, owner selection, target selection, Fire/Space, aiming, pause and reset. Remove projectiles whose centers exceed any range boundary by more than 50 pixels; at exactly 50 pixels they remain active. Reset removes all projectiles and restores the target. Keep `#scene`, `.shot`, `#fire`, `#aim`, `#target-kind`, `#tank`, `#pause`, `#reset` and `#shots`.

Acceptance tests unequal update intervals, diagonal and zero directions, independent owners, both contact types, destruction order, non-crate preservation, repeated callbacks, all cleanup edges, continuous rendered motion and reset. The public example observes 200 ms after firing. Do not modify checks or fabricate test results.
