# Configure lower-body run and stand clips

Complete `configureAnimations(player,{Clip})` in `component.js`, returning the same player. The supplied scene provides `player.lowerSprite`, `player.lower`, the animation clock and renderer. Add the missing clips to `player.lower.clips`.

- **R1 — Run.** Create `run` as a `Clip` with duration 0.6 seconds, step 0.1 seconds and looping enabled. Give it one track targeting the exact `player.lowerSprite` object's `frame` property. Use frames 0, 1, 2, 3, 4 and 5 at times 0, 0.1, 0.2, 0.3, 0.4 and 0.5 seconds respectively.
- **R2 — Stand.** Create `stand` as a non-looping `Clip` with duration and step both 0.1 seconds. Its single track targets the same sprite's `frame` property, with frame 6 at time 0. The frame remains visible after the clip finishes.
- **R3 — Preserve sprite assembly.** Keep the supplied 960×40 bitmap, its 15 horizontal cells, local position [-2,-13] and sprite offset [16,0]. Preserve the sprite and animator objects. Do not replace the image with a procedural character or add unrelated directional clips.
- **R4 — Visible playback.** The existing controls must play the actual frame sequence, loop run after 0.6 seconds, hold stand, pause, advance by 0.05 seconds and reset to stand. Playback must update the rendered crop as well as the displayed time.

The supplied `Clip` accepts `duration`, `step`, `loop` and `tracks`; a track contains `target`, `property` and `keys` of [time,value] pairs. Acceptance checks clip values, object identity, every rendered frame, loop boundaries and real-time playback. Keep the local page runnable through `index.html`.
