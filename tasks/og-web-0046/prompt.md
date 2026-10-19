# Tank projectile lifecycle

Complete the projectile behavior in the supplied browser tank range. Develop in `game/` with `index.html` as the entry point. All dependencies are local; rendering, collision dispatch and controls are supplied.

- **R1 — State.** Export `SPEED = 500` and `createProjectile({id, position, direction, tank, world, quests})` from `projectile.js`. Return `id`, `x`, `y`, `direction`, `tank`, `active`, `tick(deltaSeconds)`, `onSensor(target)` and `onBody(body)`. Preserve the firing tank and copy the direction; projectiles must have independent mutable state. This task passes `quests: null`.
- **R2 — Elapsed-time movement.** Move by `normalize(direction) * 500 * deltaSeconds` on every update. Accept arbitrary nonnegative time steps and non-unit directions. Zero direction remains stationary with finite coordinates. Motion must run continuously, not only through manual stepping.
- **R3 — Sensor handling.** An active projectile calls `world.removeProjectile(projectile)` on sensor contact. Once disposed it must neither move nor produce further contact effects.
- **R4 — Body handling.** On contact with `body.kind === 'crate'`, call `world.destroyBody(body)` before removing the projectile. Other bodies remain intact while the projectile is removed. Ignore duplicate callbacks after disposal. Crate destruction must be visible in the game.
- **R5 — Scene integration.** Preserve the 3 × 3 textured projectile, owner and target selectors, Fire/Space, aiming, pause and reset. Dispose when the projectile center exceeds any range edge by more than 50 pixels, but not at exactly 50 pixels. Reset clears projectiles and restores the target. Keep `#scene`, `.shot`, `#fire`, `#aim`, `#target-kind`, `#tank`, `#pause`, `#reset` and `#shots`.

Acceptance covers unequal update intervals, diagonal and zero directions, independent owners, sensor/body paths, crate-before-projectile disposal, other-body preservation, duplicate callbacks, all cleanup boundaries, continuous visible motion and reset. The public example observes 200 ms after firing. Do not modify checks or fabricate test results.
