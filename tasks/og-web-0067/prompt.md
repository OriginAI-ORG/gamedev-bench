# Paint a layered arena

Create the shared tile resource in `tileset.json` and assemble the arena in `scene.json`. The supplied browser loader, hierarchy, atlas renderer and visibility controls already work; author the scene data directly.

- **R1 — Shared tileset.** Use the supplied `tiles.png` atlas with tile size [32,32] and separation [0,0]. All three layers reference the same `tileset.json` resource and resolve to the same tileset object. Use valid atlas cells and preserve the original image.
- **R2 — Layer hierarchy.** Under the existing `Visuals` group, add layers named `Background`, `Props` and `Walls` in that draw order. Set each layer's `type` to `layer`.
- **R3 — Background rectangle.** Paint Background as a completely filled rectangular arena with no duplicate cells or holes. Choose its dimensions and tiles, with at least 3 columns and 3 rows so the arena has an interior.
- **R4 — Sparse props.** Paint at least one Props cell within the background rectangle. Props must occupy fewer cells than Background and remain inside its bounds. Choose tiles from the supplied atlas.
- **R5 — Border walls.** Paint Walls only along the background rectangle's border. Include at least one wall cell on each side: top, bottom, left and right. Do not place walls outside the rectangle or in its interior. Choose tiles from the atlas.
- **R6 — Visible composition.** Render the original tiles in the specified layer order. Retain individual visibility checkboxes and Reset visibility, allowing the background, props and walls to be inspected separately.

Scene groups use `name` and `children`. Layers also contain `type`, `tileset` and `cells`; each cell is [column,row,atlasColumn,atlasRow]. The tileset uses `src`, `tileSize` and `separation`. Acceptance checks resource identity, rectangular coverage, sparse props, border coverage, actual atlas crops, draw order and visibility reset. Keep the page runnable through `index.html`.
