# Synchronize upper and lower character animation

Complete `bindAnimations({lower,upper})` in `component.js`. The supplied browser scene already contains both sprites, their clips, an animation clock, image rendering and inspection controls. Implement the event binding and return a function that disconnects it.

- **R1 — Follow lower animation changes.** Subscribe to the lower player's `animation-changed` event. Its `detail` is the new animation name. Call `upper.play(name)` so the upper player follows the same animation, except while `upper.current` is `attack`.
- **R2 — Protect attacks.** Lower animation changes during an attack must not interrupt or restart the upper attack. Do not change the lower player's animation or playback position.
- **R3 — Resume at the current phase.** Subscribe to the upper player's `animation-finished` event. Only when its `detail` is `attack`, play `lower.current` on the upper player and then call `upper.seek(lower.position)`. Read the lower state at completion time. The resulting positions must agree within 0.05 seconds. Other completion events must not trigger this recovery.
- **R4 — Use the supplied components.** Preserve the player and sprite objects and all clip definitions. Both bodies have a non-looping stand clip using frame 6 for 0.1 seconds and a looping run clip using frames 0 and 1 over 0.2 seconds. The upper attack uses frames 7, 8 and 9 over 0.3 seconds. Actual bitmap frames and time progression must remain visible.
- **R5 — Clean up subscriptions.** The returned function removes both listeners and can be called repeatedly. After disposal, neither event may call the other player. Reset must rebuild a working binding without accumulating listeners.

The scene starts paused. Use the animation buttons, Play, the 0.05-second step and Reset to inspect it. Acceptance checks event delivery, attack interruption, play-then-seek order, arbitrary completion phases, cleanup, rendered frames and real-time playback. Keep the local page runnable through `index.html`.
