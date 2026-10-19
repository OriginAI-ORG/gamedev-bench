# Repair the card drag destination

The supplied card interaction system is complete, but dragging reparents a card to the wrong container. `config.json` describes the UI root, bottom panel, hand and dedicated drag layer.

- **R1 — Resolve the correct parent.** Repair `moveToDragLayer(card)` in `placement.js`. Use the configured drag group via the scene service. Its member is the dedicated drag layer under the UI root, a sibling of the bottom panel. The hand's immediate parent is not the drag destination.
- **R2 — Preserve coordinates.** Reparent with the supplied position-preserving helper. Global position and pointer pivot must stay unchanged across the nested hierarchy, and subsequent motion must follow pointer minus pivot. Cancelling restores the original hand index and layout positioning.
- **R3 — Preserve interaction.** Keep all configured dimensions, names, titles and timing values, the 256 by 144 scene and 25 by 30 cards. Preserve states 0 through 3, monitoring, real rectangle overlaps, immediate right-click cancellation, a fresh threshold for every drag, valid-zone play, and empty release waiting for the next input before returning. Added cards, status and reset must work.

Only edit `placement.js`. Keep every other file unchanged. Submit the complete package with `index.html` as entry. Acceptance checks parent identity, global coordinates, card order, timing and actual pointer interaction.
