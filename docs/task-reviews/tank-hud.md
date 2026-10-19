# Tank HUD — individual revision review

All six original instructions, validators, tank/weapon/pickup scripts, scene files, project entries and image hashes were compared. The v1 browser task retained numeric score increments and quantization, but replaced gameplay pickups with clickable tokens, doubled the reload from0.5 to1second, discarded the ammo texture and omitted the component/event chain. That simplified the actual integration problem and changed timing.

| Task | Points | Reload step | Game reference properties | Source state and repair |
|---|---:|---:|---|---|
| og-web-0150 |100|0.1|tank,ui|HUD/game wrapper absent; implement components and events. Exact image regions (0,0,16,16) and (0,16,16,16) restored.|
| og-web-0151 |75|0.1|player_tank,hud|HUD/game wrapper absent; implement components and events. Source requires the same PNG for both layers but does not specify regions.|
| og-web-0152 |125|0.2|tank_node,status_ui|HUD/game wrapper absent; implement components and events. Preserve its distinct quantization.|
| og-web-0153 |40|0.05|vehicle,overlay|HUD/game wrapper absent; implement components and events. Preserve its distinct quantization.|
| og-web-0154 |250|0.25|tank_actor,hud_layer|HUD/game wrapper absent; implement components and events. Source's0.22second progress probe replaces the shorter frame-based probe; browser tests elapsed0.22seconds directly.|
| og-web-0155 |60|0.2|hero_tank,scoreboard|Source already has a complete wrapper, HUD, event emitters/connections and correct startup scene. Treat this as a defective restoration baseline; provide complete components and explicitly disconnect only the wrapper bindings/subscriptions for a bounded repair exercise.|

The261 source was inspected, not executed in its native engine. Its claimed missing feature is nevertheless present in all relevant files. The revised261 exercise intentionally introduces missing bindings, so difficulty equivalence to that already-complete baseline is not claimed. This exception must remain visible in reports, not averaged away as an ordinary parameter variant.

## Changes

- Removed token-click scoring, forced SVG rectangles,1second reload and the requirement to recreate already-supplied components in261.
- Restored the original six bitmap assets,500ms timer, game/World/Tank/UI composition, per-task reference names, pickup→tank→game→HUD score delivery, weapon progress/completion delivery, quantization and bottom-to-top textured fill.
- The supplied browser fixture keeps the184-cell perimeter,19 crate positions, slight world rotation, tank movement/turn/turret controls, bullets and crate destruction. AABB collision and static crates replace the native rigid-body solver. This supplied approximation is outside the HUD work and is not presented as complete physics equivalence.
- Browser modules/EventTarget replace scene resources/events. A DOM output and Canvas progress indicator replace label/texture controls. Public gameplay uses real collision pickup detection; injected events separately prove wiring.
- Added disposal checks, type/duplicate-pickup guards, independent event probes, automatic reload checks, image hashes and rendered progress pixels. The original tests directly invoked a pickup callback and did not test duplicate collection or cleanup.
- For257–260 the provided default texture crop configuration uses the same gray/yellow16px halves as256; these regions were not mandated by their original validator. They are supplied configuration, not additional artwork work.261 retains both whole-image layers from its supplied UI. The renderer dims the underlay to35% so identical source layers still show visible progress; this is an explicit presentation repair.
- Added the progressbar accessibility attributes and a32×48 display size to the browser contract.261 already supplied that minimum size; the other missing UIs had no exact layout requirement. Numerical score/timer/step requirements remain task-specific in configuration.

## Verification

Private scenarios cover visible HUD/unique controls; original image bytes; immutable supplied services; scene identities; arbitrary score events; independent finish events; no events after disposal; tank-only and one-shot pickups; live normalized timer emissions and firing lock; exact textured clipping/quantized values; and real keyboard shooting, crate destruction, driving, pickup disappearance and reset. The public scenario performs the real shoot-and-collect sequence. Behavioral mutations target lost subscriptions, cleanup, duplicate pickups, quantization and missing tick events. Starter rejection is required. Fresh staged receipts live under artifacts/og-qa; final full-cohort results are recorded in validation/task-audit.json.
