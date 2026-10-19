# Bind targeting when unit stats are assigned

The supplied target finder establishes detection subscriptions through its actor setter. The unit forwards stats to its detector but does not yet bind its target finder.

- **R1 — Complete the update hook.** In `bindings.js`, keep detector stats forwarding inside `applyStats(unit, config)` and also assign the exact unit to `unit.targetFinder.actor` there. This must work both on startup and when stats are assigned again. Preserve the sibling component structure.
- **R2 — Preserve detector state.** Keep base range 36, initial player attack range 2, radius 72, 24 by 24 unit bodies, layer `4 * (team + 1)` and mask `2 - team`. Detector shapes remain independent and are replaced when stats change.
- **R3 — Preserve events and selection.** Team 0 targets enemy_units and team 1 targets player_units. Initially the opponent at (50,0) is the only range member; the one at (130,0) is outside. Moving the far one to (10,0) changes the nearest target; moving both to (300,0) empties the list. Repeated actor assignment must keep one effective set of subscriptions. Preserve global nearest selection, rendering, controls and disposal.

Only edit `bindings.js`; keep other files unchanged. Submit the complete package with `index.html` as entry. Acceptance checks assignments through the update hook, actual event delivery after repeated updates, object identity, both teams and cleanup.
