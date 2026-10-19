# Assemble the minimap UI in a running world

Complete `ui.json` using the supplied PNG files. The world, marker tracking, removal events and zoom logic already work. This task edits only UI configuration: keep the supplied JavaScript, HTML, CSS, resource definitions and images unchanged, and do not add code files.

- **R1 — Outer container.** Set `size` to [200,200] and `margin` to 5. Both the frame and content sit inside this margin.
- **R2 — Frame.** Add `frame` with `texture` `assets/panel_woodDetail_blank.png` and `patch` [64,64,64,64], ordered left, top, right, bottom.
- **R3 — Content and grid.** Add sibling `content` with `margin` 20. Its `grid` has `texture` `assets/pattern_blueprintPaper.png` and `mode` `tile`. Repeat the original pattern at natural size; the resulting grid is [150,150].
- **R4 — Player marker.** In the grid's `markers` array, add `PlayerMarker` with `texture` `assets/minimapIcon_arrowA.png`, `center` true and `visible` true. It is centered at [75,75] within the grid and uses its natural image size.
- **R5 — Hidden prototypes.** Add `MobMarker` with `texture` `assets/minimapIcon_jewelRed.png` and `AlertMarker` with `texture` `assets/minimapIcon_exclamationYellow.png`. Set both `visible` false. Keep them under the grid so the supplied tracker can duplicate them into visible live markers without showing the prototypes.
- **R6 — Existing integration.** Preserve the working world: W/S move, A/D turn, scrolling over the minimap changes zoom, Collect crate removes its live marker, and Reset scene rebuilds the scene. The supplied tracker rotates the centered player arrow and projects the other objects onto the configured grid.

Each marker object uses `name` and the properties above. Reference the PNG paths directly. Acceptance checks configuration, original image bytes, measured layout, tiled pixels, hidden prototypes and the supplied live integration. Keep `index.html` runnable.
