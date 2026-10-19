# Bind the nested target finder to its unit

The completed target finder is a child of its detector and reads detection events from that parent. Its actor reference is missing.

- **R1 — Bind the actor.** Complete `bind(unit, config)` in `bindings.js` so `unit.targetFinder.actor` references the unit. Keep `TargetFinder` inside `DetectRange`, alongside `Collider`, and preserve the unit's `detectRange` and `targetFinder` references and stats forwarding.
- **R2 — Preserve detection and targeting.** Keep team 0 targeting enemy_units and team 1 targeting player_units, base range 36, player attack range 2, radius 72, 24 by 24 unit bodies and the supplied collision bits. Parent detector events must update the typed range array and notify changes. Global nearest-target selection remains independent of the range array.
- **R3 — Live behavior.** Initially only the unit at (50,0) is in range; the unit at (130,0) is outside. Moving the far unit to (10,0) selects it. Moving both to (300,0) empties the range list. Preserve controls, rendering, repeated stats assignments and listener cleanup.

Only edit `bindings.js`; keep other supplied files unchanged. Submit the complete package with `index.html` as entry. Acceptance tests nested structure, object identity, parent-sourced events, both teams, actual overlaps, nearest targets and cleanup.
