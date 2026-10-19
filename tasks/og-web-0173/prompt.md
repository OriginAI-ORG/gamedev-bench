# Connect filtered range-event forwarding

The detector and target finder are already implemented. The detector has typed forwarding handlers, but its raw overlap events are not connected to them. `config.json` supplies this task's distinct teams, names, ranges and demonstration positions.

- **R1 — Connect both directions.** Implement `connectForwarding(detector)` in `forwarding.js`. Subscribe to `area-entered` and pass event detail to `detector.onAreaEntered`; subscribe to `area-exited` and pass detail to `detector.onAreaExited`. Return a cleanup function that disconnects these exact listeners and is safe to repeat.
- **R2 — Preserve typed forwarding.** The provided handlers emit `unit-entered-range` and `unit-exited-range` only for `BattleUnit` instances. The finder subscribes to these filtered events, maintains `targetsInRange` and emits `targets-in-range-changed`. Keep this two-stage event path; non-unit overlaps must not reach the range list, and a real enter or exit produces one membership notification.
- **R3 — Preserve integration.** Keep the supplied team-to-opposing-group mapping, detector layer `4 * (team + 1)`, mask `2 - team`, per-task base range times attack range, 24 by 24 unit bodies and sibling detector/finder structure. Global nearest selection uses the full opposing group, even when no opponent is in range. Preserve live controls, actual shape overlap, stats updates, rendering and disposal.

Only edit `forwarding.js`; keep other files unchanged. Submit the complete package with `index.html` as entry. Acceptance tests both raw event directions, filtering, independent detector instances, cleanup, the task-specific movement examples and rendered membership/target state.
