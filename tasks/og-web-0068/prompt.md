# Assemble a checkerboard playfield and bench

Create the shared resource in `tileset.json` and the layer hierarchy in `scene.json`. The browser loader, atlas renderer, parent transforms and visibility controls are supplied. Author the scene data directly.

- **R1 — Shared tileset.** Use the supplied `tiles.png` atlas with tile size [32,32] and separation [0,0]. Every layer, including empty highlights, references the same `tileset.json` resource and resolves to the same object. Preserve the source image and use valid atlas coordinates.
- **R2 — Playfield.** Add a root child layer named `GameArea` at position [160,32]. Paint a filled rectangular checkerboard-style playfield of at least 2 columns and 2 rows using at least two distinct atlas tiles. Horizontally or vertically adjacent cells must use different tiles; do not leave holes or duplicate coordinates.
- **R3 — Playfield children.** Add child layers `Decor` and `Highlight` under GameArea, both at local position [0,0]. Paint at least one Decor cell and leave Highlight completely empty. Keep their parent relationship so they inherit the playfield offset.
- **R4 — Bench and highlight.** Add a separate root child layer named `Bench` at position [160,320] and paint at least one cell. Add its own child layer named `Highlight` at local position [160,32], leaving it empty. This highlight therefore has global position [320,352]. The two highlight layers are distinct objects.
- **R5 — Visible composition.** Render actual atlas cells using the hierarchy and offsets. Preserve each layer's visibility checkbox and Reset visibility. Empty highlight layers remain configured and inspectable without painting placeholder cells.

Groups use `name` and `children`. Each layer has `type` set to `layer`, plus `name`, `position`, `tileset`, `cells` and optional `children`. A cell is [column,row,atlasColumn,atlasRow]. The tileset uses `src`, `tileSize` and `separation`. Acceptance checks shared resources, the alternating playfield, populated decor/bench, empty highlights, local/global positions and actual rendered crops. Keep the page runnable through `index.html`.
