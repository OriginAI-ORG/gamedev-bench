# Inventory item resources and slots

Complete `inventory.js` in the supplied local browser game under `game/`; retain `index.html`. Item objects, Slot rendering, the icon and button handlers are provided.

- **R1 — Inventory.** Export `Inventory(grid, slots, {random = Math.random, icon = 'item.svg'} = {})`. Retain the exact grid and Slot objects and own an initially empty `.items` array. Use the supplied `Item` class from `item.js`; do not replace items with names or counters.
- **R2 — Add.** `addItemResource()` finds the first Slot whose `slotItemResource` is null, creates a new `Item(icon, quantity)`, appends that exact object to `.items`, calls that Slot's `setItem(item)`, and returns it. Compute quantity as `1 + floor(random() * 20)`, including both 1 and 20. Every successful add creates a distinct object. When all slots are full, return null without changing data, slots or consuming randomness.
- **R3 — Clear.** `clearAllInventoryItems()` empties `.items` in place and calls `setDataEmpty()` on every Slot. All slot resources, icons and quantity labels must clear. Repeated clear is safe and adding again starts at the first slot.
- **R4 — Integration.** Preserve the six-slot display and Add item, Clear items and Reset controls. The provided slot-click handler removes one item to create a hole; the next add fills the earliest hole without overwriting occupied slots. Icons must actually load and show the same quantity as the stored Item. Count equals the number of stored resources. Reset restores six empty slots and count 0.

Acceptance checks supplied Slot method calls and exact object identity, first-empty selection, random endpoints, distinct resources, full inventory, clear/re-add, rendered icon and quantity synchronization, hole filling and reset. The public example adds to slot 0. Do not modify checks or fabricate results.
