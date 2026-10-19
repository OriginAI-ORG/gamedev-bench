# Projectile collision event wiring

Complete the reusable projectile prefab and contact subscriptions in the supplied browser tank range. Work in `game/`; `index.html` is the entry point. Use local assets and ES modules.

- **R1 — Definition.** Export `definition` from `projectile.js`: `size: [3, 3]`, `layer: 16`, `mask: 44`, `texture: {src: 'atlas.svg', region: [12, 8, 3, 3]}`, and `visibility: [3, 3]`. The visible textured sprite and collision rectangle are centered and 3 × 3.
- **R2 — Filtering.** Detect enemy sensors on category `4`, crates on category `8`, and walls on category `32`. Ignore friendly sensors on category `1`. The supplied dispatcher uses `(mask & target.layer) !== 0`.
- **R3 — Two subscriptions.** Export `wireContacts(projectile, world)`. `projectile` is an `EventTarget`. Subscribe separately to `sensorcontact` and `bodycontact`; each event carries its target in `event.detail`. Either contact calls `world.removeProjectile(projectile)` on that same instance. Handling only one event is insufficient.
- **R4 — Lifecycle.** Return an unsubscribe function that detaches both listeners. Disposed objects must not react to later events. Wiring one projectile must not overwrite another projectile's listeners.
- **R5 — Integration.** Preserve continuous movement, Fire/Space, aiming, owner selection, target changes, pause and reset. Visible projectiles disappear on either permitted contact; reset clears all projectiles. Keep `#scene`, `.shot`, `#fire`, `#aim`, `#target-kind`, `#tank`, `#pause`, `#reset` and `#shots`.

Acceptance checks the definition, loaded sprite pixels, filtering, both event paths, listener removal, multiple instances, live motion and reset. The public example observes 200 ms after firing. Do not modify checks or fabricate test results.
