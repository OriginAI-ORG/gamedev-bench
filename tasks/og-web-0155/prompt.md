# Repair the existing tank HUD connections

This browser game already contains working HUD, pickup and weapon components. Its game wrapper has lost its object bindings and event subscriptions. Repair `wiring.js` while preserving the supplied implementation.

- **R1 — Bind the scene.** In `createGame(root, config)`, retain the existing `World`, `Tank` and `UI` children, and bind `hero_tank` to the actual tank and `scoreboard` to the actual HUD. Preserve startup score 0 and reload value 1.
- **R2 — Score connection.** Subscribe to the tank's `pickup-collected` event. Add the points in event detail to the game score and call the HUD's `setScore`. The supplied pickups are worth 60 points each; newly spawned pickups must work through the tank event without being registered with the HUD individually.
- **R3 — Reload connection.** Subscribe to the weapon's `reload-progress` and `reload-finished` events. Forward progress to `setReload`; completion independently sets it to 1. Keep the supplied 0.5-second reload, 0.2 quantization step, range 0 through 1, bottom-to-top textured fill, full initial value and firing lock. Keep both image layers sourced from `assets/ammo_ui_icon.png` at the supplied 32 by 48 display size.
- **R4 — Integration and cleanup.** Keep driving with W/S, turning with A/D, turret rotation with Q/E, Space or Fire to shoot, pause, 0.1-second advance and reset. Breaking a crate produces a pickup; driving over it updates the score through events. `dispose()` must disconnect all game subscriptions and be safe to repeat. Reset restores score 0, a full indicator and one set of event connections.

Only edit `wiring.js`; keep all other supplied files unchanged. Submit the complete package with `index.html` as entry. Acceptance tests live gameplay, event delivery independent of the demonstration controls, correct object identity, progress rendering and cleanup. The component implementation is already provided.
