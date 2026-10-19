# Add a tile layer and full-tile collision

Edit `scene.json` and `tileset.json`. The supplied browser services load these resources, render atlas cells and perform polygon collision queries. Configure the data while retaining the supplied services and image.

- **R1 — Ordered layers.** Keep the existing `Base` layer at index 0 and add `Details` at index 1. Both are direct children of the tile map, have `type` set to `layer`, and reference the same `tileset.json` resource. No painted cells are required in the saved scene.
- **R2 — Atlas preservation.** Keep `tilemap.png`, tile size [18,18], atlas separation [1,1] and the existing tile at atlas coordinate [0,0]. The 1-pixel gutters must not be included in a tile's rendered crop.
- **R3 — Collision configuration.** Add physics layer 0 with `collisionLayer` equal to 2. Give tile [0,0] a full 18×18 rectangle centered on the cell, with corners [-9,-9], [9,-9], [9,9] and [-9,9] connected around the perimeter. Store it as that tile's first polygon in `polygons`.
- **R4 — Actual query behavior.** The supplied inspection sample renders tile [0,0] without adding painted cells to the saved layers. Its center, interior and boundary must block a query with mask 2; exterior points and mask 1 must remain clear. Mask 3 must also detect it because it includes the configured layer.
- **R5 — Preview.** Retain layer listing, original atlas rendering, collision probe buttons and Reset visibility. Both layer resources must resolve to the same tileset object.

The scene format uses `children`, with layer objects containing `name`, `type`, `tileset` and `cells`. The tileset uses `src`, `tileSize`, `separation`, `physics` and a `tiles` dictionary keyed by atlas coordinates. Acceptance checks resource data, source image bytes, actual tile crops, polygon coverage and mask filtering. Keep the page runnable through `index.html`.
