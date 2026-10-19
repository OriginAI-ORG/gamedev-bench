# Yellow emissive pickup outline

Complete `component.js` in the supplied browser game under `game/`, retaining `index.html` and local dependencies. The fixture includes WebGL rendering, ray picking and a working focus controller; finish the material, hull and item-data configuration.

- **R1 — Focus binding.** Keep `InteractableItem(body, highlight)` bound to the exact body and its highlight. Construction hides the hull, `gainFocus()` shows it and `loseFocus()` hides it. Instances must have independent focus state.
- **R2 — Outline factory.** Export `createPickup()` returning a fresh `{body, interaction}` from `createBasePickup()`. Retain the frozen 0.75-unit cube, 0.9-unit highlight hull, `collisionLayer: 2` and `collisionMask: 3`. Set the highlight's `flipFaces` and `emissive` to true and its RGB `color` to `[1, 1, 0]` (#ffff00). Reverse the hull faces through the supplied renderer so the visible yellow rim surrounds, rather than covers, the shaded cube. Emission remains yellow under lighting changes and follows the cube during view rotation.
- **R3 — Reusable data.** Implement exported `ItemData(itemName, itemModel)` storing a string and callable model factory. Export an ItemData instance `testCube` with `itemName === 'Test Cube'` and `itemModel === createPickup`. Two factory calls must create distinct bodies, highlights and interactions.
- **R4 — Integration.** Preserve pointer picking, keyboard canvas focus/blur, view rotation, lighting, category probe and reset. Probe categories 1 and 2 contact the center; 4 is filtered. Reset restores one unfocused cube with its item name shown. Repeated focus and reset must not accumulate hulls or shared state.

Acceptance checks metadata/factory identity, focus binding, collision filters, actual pointer and keyboard input, yellow rim pixels with an unobscured shaded center, lighting, rotation, independent instances and reset. The public example focuses then unfocuses the cube. Do not modify checks or fabricate results.
