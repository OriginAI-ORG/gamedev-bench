# Wire player damage into the HUD

Complete `hud.js` in the supplied local browser game in `game/`, retaining `index.html`. The existing Player and DamageController already emit damage and accumulate it; connect them to the visible HUD.

- **R1 — Mount.** Export `mountDamageHud(controller, player, host)`. Create one `#damage-label` inside the supplied HUD host, initialized to `Total Damage: 0`. Bind that exact element to `controller.label`. Preserve the existing world and actor.
- **R2 — Subscribe.** Connect the player's `taken-damage` event to `controller.onPlayerTakenDamage`. Its `detail.amount` drives the supplied accumulator and text update. A Player.takeDamage call emits 20; every call must increase the displayed total once. Events from outside the actor's click handler must also work. Do not replace the provided event/controller with a separate click counter.
- **R3 — HUD behavior.** The label remains independent of world movement. Preserve actor clicks, External damage and Pan world. Repeated damage continues accumulating, including after five hits; this component has no health or defeat gate.
- **R4 — Cleanup.** Return a cleanup function that disconnects this subscription and removes its label. Repeated cleanup is safe. Reset uses cleanup and a fresh controller to restore total 0 and exactly one label; subsequent damage must update only the new HUD once.

Acceptance checks player/controller/label binding, arbitrary event amounts, external damage, totals beyond 100, HUD independence from world translation, cleanup and reset. The public example emits one 20-damage hit. Do not modify checks or fabricate results.
