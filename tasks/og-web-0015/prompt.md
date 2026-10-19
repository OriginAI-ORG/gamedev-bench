# Card pile utilities

Implement `pile.js` in the supplied local browser game in `game/`; retain `index.html`. Use the provided `Card` class from `card.js` rather than replacing cards with strings.

- **R1 — Reusable pile.** Export `CardPile extends EventTarget`, constructed as `(cards = [], random = Math.random)`. Keep an independent mutable `cards` array containing the original Card object references. New piles are empty. Reject non-Card entries with TypeError before changing the pile or emitting an event.
- **R2 — Operations and events.** `empty()` returns a boolean. `addCard(card)` appends the card. `drawCard()` removes and returns the front object, or returns null without emitting when empty. Each successful add/draw emits one `size-changed` CustomEvent with `detail: {count}` after mutation. `clear()` empties the array in place and emits count 0, even if already empty.
- **R3 — Shuffle and listing.** `shuffle()` uses the supplied random function to shuffle the existing array in place, preserving all object references and duplicate occurrences; it emits no size event. Use Fisher–Yates, traversing indices from length−1 down to 1 and choosing `floor(random() * (i+1))`. `toString()` returns one `index: card_id` line per card with indices starting at 1, no trailing newline, and an empty string for an empty pile.
- **R4 — Integration.** Preserve the supplied draw/add/shuffle/clear/reset controls and visible card faces, costs, count, drawn card, listing and event log. The fixture starts with strike (1), defend (1), bash (2); Reset restores this display and clears its event log. Count must update from size events, not a parallel counter.

Acceptance checks arbitrary cards, identity and duplicate preservation, exact event counts/order, empty operations, deterministic random probes, invalid types, independent piles and visible UI. The public example draws strike and checks count 2. Do not modify checks or fabricate results.
