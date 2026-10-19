# og-web-0156 — preference persistence review

Read the original instruction, full validator, menu/remap scripts, scene layout, theme and original960×544 screenshot. The source lacks its preference resource and save/load integration; remapping already changes the live input map but has no completion event for persistence. The former Web prompt retained immediate persistence and one remap, but changed sliders to0..100, invented70/80 defaults, omitted four visible action rows and replaced the referenced layout. Those changes were not equivalent.

## Requirement repair

- Removed the0..100 range,70/80 defaults, arbitrary settings-panel layout and forward-only action list.
- Restored music0/SFX1 defaults,0..1 range and0.05 step; input types Keyboard/Gamepad with indices0/1; preference fields including an event dictionary; immediate saves from each handler; reload into visible controls; and applying saved bindings before constructing remap buttons.
- Restored all five source rows in order: move_forward, move_backward, turn_left, turn_right, weapon_fire. A remap completion event carries action/event to the menu, preserving separation of responsibilities.
- Replaced the native resource file with a serializable localStorage preference object. Keyboard events retain code/key, and the browser input map receives them on recreation. Audio gain services preserve volume values and mute below0.05. These are supplied services, not extra audio implementation work.
- Restored the original reference image in the task package. Its captured upper layout begins at x256,y360 with controls nearx398. The image cuts off halfway through the action list. The browser layout extends downward, allows scrolling and uses smaller margins on narrow screens. Reproducing the crop as inaccessible controls would not satisfy the intended usable menu.
- The screenshot uses plain light16px text. The source theme contains a separate bitmap font, but that font is not shown in the reference and is not made a new requirement. No full-frame pixel-equivalence claim is made: layout, colors, hierarchy, supplied reference bytes and actual visible controls are checked directly.
- Added listener cleanup, preservation of unrelated fields during independent saves, alternative preference values, persistent remapping of another existing action, a provided input-test arena and provided audio test tones. Clear/recreate controls remain harness conveniences. Native application quit is represented by an ended-game view.

## Acceptance

The private checks restore the original0.35/0.65/index1/I example, modify additional values, verify storage immediately after each event, check service gains and input scheme, recreate the menu after explicitly resetting its input map, reload the browser, and confirm that I actually moves the rendered actor while W no longer does. Other cases check a separate storage adapter, remap dictionaries, disposed listeners, reference geometry/colors, narrow-screen containment and accessible full rows. Mutations break each save/restore/event/layout/cleanup path independently. The reference passed three runs, public feedback, behavior/visual negatives and starter rejection. The task is version2.0.0; its English prompt remains the input.
