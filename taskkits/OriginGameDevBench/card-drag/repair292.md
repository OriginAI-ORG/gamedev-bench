# Connect drag placement and return-to-hand handling

The browser scene already supplies working card states, input forwarding and overlap detection. `config.json` defines the hand, drag layer, group, zone, titles and drag threshold. Two connections are missing.

- **R1 — Drag layer.** Complete `moveToDragLayer(card)` in `placement.js`. Resolve the configured drag group through the supplied scene service and reparent the card there with the provided position-preserving helper. The destination is the dedicated drag layer under the UI root, alongside the bottom panel; the hand is inside that panel. Keep global position and pointer pivot unchanged.
- **R2 — Hand return.** Complete `hand.js`. Connect every newly created card's `reparent-requested` event to restoration of its home hand and original index, clamped to the current child count. Restore layout positioning and preserve other cards' order. Disconnect these listeners when the hand is disposed. Preserve the supplied card creation and state initialization.
- **R3 — Preserve gameplay.** Keep state IDs 0 through 3, 25 by 30 cards, the 256 by 144 scene, and all configured values. Right press cancels immediately; left release before the per-drag threshold is ignored. A valid zone release plays the card; an empty release remains Released until the next input returns it. Real rectangle overlaps, labels, add-card and reset must continue working.

Only edit `placement.js` and `hand.js`. Submit the full package with `index.html` as entry. Acceptance exercises nested-parent coordinates, timing, repeated cancellation, original ordering, added cards and actual pointer play.
