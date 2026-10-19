# Navigation chase — individual revision review

The seven archives, instructions, controller files, scene hierarchy, tile layers and test code were inspected individually. All use the same 101 fence cells, 720 terrain cells and three unchanged images. The previous browser packages replaced this with a 9×7 grid, a single wall and one-cell discrete steps. That lost continuous velocity interpolation, collision-body behavior, periodic live target refresh, component integration and the original visual/spatial complexity. It was not equivalent.

## Per-task source and repair

| Task | Actual supplied implementation | Required identity | Source target-movement probes | Repair |
|---|---|---|---|---|
| og-web-0143 | Controller and Navigation subtree missing | Enemy.target → Target | +(32,48) | Implement controller and assemble navigation components; supplied constructor keeps speed300/acceleration7 defaults explicit |
| og-web-0144 | Complete controller, agent, timer and timeout connection supplied | Chaser.goal → Goal | +(32,48) | Preserve implementation; complete live object binding |
| og-web-0145 | Complete controller, agent, timer and timeout connection supplied | Guard.beacon → Beacon | +(24,40), then+(-16,20) | Preserve implementation; complete live object binding |
| og-web-0146 | Complete controller, agent, timer and timeout connection supplied | Drone.focus → Focus | +(48,16) | Preserve implementation; complete live object binding |
| og-web-0147 | Complete controller, agent, timer and timeout connection supplied | Hunter.marker → Marker | +(-20,36), then+(12,-28) | Preserve implementation; complete live object binding |
| og-web-0148 | Complete controller, agent, timer and timeout connection supplied | Seeker.objective → Objective | +(40,-24) | Preserve implementation; complete live object binding |
| og-web-0149 | Complete controller, agent, timer and timeout connection supplied | Bot.checkpoint → Checkpoint | +(28,44), then+(8,-12) | Preserve implementation; complete live object binding |

In 250–255 the serialized typed reference is a relative path, while the actor declaration lacks the corresponding node-path annotation. The source engine was not executed, so this is not claimed as a reproduced runtime defect. The browser contract tests the needed live object identity directly. Giving these six tasks a blank controller would add work that was already solved in their supplied projects; the binding-only starter preserves that distinction. Naming variants remain correlated and should not be counted as independent difficulty evidence.

## Removed, replaced and added requirements

- Removed the arbitrary 9×7 wall layout, 100ms cell hopping, forced SVG circle selectors and a requirement to recreate the supplied controller in six variants.
- Restored normalized waypoint direction, per-frame velocity interpolation, collision-aware movement, automatic100ms target refresh, live world-space coordinates, original actor/camera positions, collision bits and all original tile cells/images.
- Replaced native navigation and physics APIs with provided browser services. The service contains BFS and circle-versus-wall collision; solving path planning from scratch is not part of these tasks. A parent/child object model preserves assembly and inherited coordinates. EventTarget supplies the timeout connection.
- Replaced the incidental20px editor-logo target placeholder with a20px yellow beacon. The original tank, terrain and fence images are unchanged. This is a disclosed visual substitution, not a claim of full-scene pixel identity.
- Added explicit lifecycle cleanup, alternate object/configuration identity checks, real browser interaction, and a30-simulated-second/20px arrival bound for a reachable stationary target. The bound makes runtime pursuit testable; it is not an original numeric requirement.
- The original navigation region had no baked polygon vertices or outlines, and source tests only checked structure/code patterns plus direct timeout calls. The supplied browser planner makes the intended chase playable. This repairs an untested functional dependency instead of asking solvers to invent navigation geometry.

## Acceptance and difficulty

Acceptance checks immutable provided runtime/assets/configuration; hierarchy and flags; exact target identity; every source movement probe; inherited parent offsets; timer cadence and null-target behavior; disposal; independent velocity calculations on nonzero and zero-length paths; real3600-step routes in both directions without wall intersections or teleports; rendered movement; wall-click rejection; run/pause and reset. Mutation checks cover missing elapsed time, local/global confusion, missing timeout connection, wrong objects, snapshots and hard-coded bindings. Public checks show movement; incomplete starters must fail.

The browser ports retain the domain logic and original work boundaries but do not assess native editor operation. Cross-platform difficulty cannot be declared identical from reference QA. In particular, binding-only tasks are intentionally small because their source controller was already complete. All revised packages are version2.0.0; staged QA receipts are under artifacts/og-qa and final hash-bound evidence is indexed in validation/task-audit.json.
