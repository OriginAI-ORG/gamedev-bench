# Configure a minimap with image resources

Complete `ui.json` using the named image resources supplied in `resources.json`. This is a declarative UI task: keep the supplied JavaScript, HTML, CSS, resource definitions and images unchanged. Do not add code files.

- **R1 — Outer container.** Set `size` to [200,200] and `margin` to 5. The supplied renderer places both the frame and content inside this margin.
- **R2 — Frame.** Add `frame` with `texture` set to `frame` and `patch` set to [64,64,64,64], ordered left, top, right, bottom. Use the original wooden frame through its image resource.
- **R3 — Content and grid.** Add a sibling `content` with `margin` 20. Its `grid` uses `texture` `grid` and `mode` `tile`, repeating the original blueprint pattern at its natural size. The resulting grid is [150,150].
- **R4 — Player marker.** In the grid's `markers` array, add `PlayerMarker` using `texture` `player`, `center` true and `visible` true. Its center is [75,75] within the grid, and the original arrow remains at its natural image size.
- **R5 — Hidden prototypes.** Add `MobMarker` with `texture` `mob` and `AlertMarker` with `texture` `alert`. Set `visible` false on both. Retain these image elements under the grid for later duplication; use the red jewel and yellow exclamation resources respectively.

Each marker object has a `name` and the properties above. Resource names resolve through the provided descriptors; do not replace them with image paths. Acceptance checks the configuration, measured layout, original image bytes, tiled pixels, marker hierarchy and visibility. The supplied Reset scene control reloads the configuration. Keep `index.html` runnable.
