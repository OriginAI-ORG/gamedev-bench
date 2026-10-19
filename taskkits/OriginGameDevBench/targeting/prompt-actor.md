# Refresh detection from the actor

The supplied detector derives collision settings and its circle from an actor reference. The unit's stats-update hook does not assign that reference yet.

- **R1 — Forward the actor.** Complete `applyStats(unit, config)` in `bindings.js` by assigning the exact unit to `unit.detectRange.actor`. Do this on each invocation, including repeated stats changes. Preserve `unit.targetFinder.actor` and the sibling detector/finder structure.
- **R2 — Preserve derived state.** The detector reads current actor stats to produce layer `4 * (team + 1)`, mask `2 - team` and a new circle of radius base range times attack range. Defaults are base range 36 and player attack range 2, giving radius 72; unit bodies remain 24 by 24. A later change of team or attack range must immediately update all derived values without changing another unit's state.
- **R3 — Preserve targeting.** Team 0 targets enemy_units and team 1 targets player_units. Initial opponents at (50,0) and (130,0) give one in-range unit and the nearer target. Moving the far one to (10,0) changes the target; moving both to (300,0) clears membership. Preserve the full-group nearest search, typed events, visible controls and cleanup.

Only edit `bindings.js`; keep other files unchanged. Submit the complete package with `index.html` as entry. Acceptance checks live actor identity, replacement shapes, both teams, repeated property updates, real overlaps and rendered results.
