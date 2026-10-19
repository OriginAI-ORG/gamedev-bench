# Connect the target finder's detector

The browser game already includes complete detection and target-selection components. Its target finder has an actor but no detector reference.

- **R1 — Repair the binding.** In `bindings.js`, complete `bind(unit, config)` so `unit.targetFinder.detector` references the exact `unit.detectRange` object. Preserve the actor binding and stats forwarding. `DetectRange` and `TargetFinder` remain sibling children of the unit; `Collider` remains inside the detector.
- **R2 — Preserve behavior.** Keep team 0 targeting enemy_units and team 1 targeting player_units. Base range is 36; the player's attack range 2 produces radius 72. Keep the 24 by 24 unit bodies, detector layer `4 * (team + 1)`, mask `2 - team`, typed overlap events and membership change notifications. The finder searches the full opposing group by squared global distance, independently of range membership.
- **R3 — Verify integration.** The initial nearest unit at (50,0) is in range; the one at (130,0) is outside. Moving the far unit to (10,0) changes the nearest target. Moving both to (300,0) clears the range list while retaining a nearest target. Keep all supplied controls, rendering, repeated stats updates and listener cleanup.

Only edit `bindings.js`. Keep other supplied files unchanged and submit the complete package with `index.html` as entry. Acceptance checks reference identity, actual event subscription to the explicit detector, both teams, changed positions, rendering and cleanup. Do not rewrite the provided component implementations.
