# Add character and weapon action timelines

Complete `configureAnimations(player,{Clip})` in `component.js`, returning the same player. The supplied player contains `character`, `knife`, `animator`, a working `onActionComplete` callback and a `RESET` clip. Add the missing clips to `player.animator.clips`.

- **R1 — Hurt.** Add `hurt` with duration 0.3 seconds, step 0.1 seconds and no loop. Add a `frame` track for each of the exact `player.character` and `player.knife` objects. Both use frames 70, 71 and 72 at times 0, 0.1 and 0.2 seconds.
- **R2 — Completion method.** Add a method event at 0.3 seconds targeting the player itself and invoking `onActionComplete`. It runs exactly once per completed hurt playback, including when a clock step crosses the endpoint. Keep frame 72 visible afterward. Starting hurt again permits one new completion.
- **R3 — Fall and grounded.** Add `fall` and `grounded`, both looping with duration and step 0.1 seconds. Each has two tracks targeting the same sprites' `frame` properties. Use frame 80 at time 0 for fall, and frame 82 at time 0 for grounded. Neither calls the completion method.
- **R4 — Preserve assembly.** Retain the supplied `RESET` clip and its identity. Keep both 480×480 atlases, 10×10 cells, disabled centering and offset [-24,-48]. Do not replace either sprite or the animator. Both images must participate in rendering.
- **R5 — Playback and reset.** Preserve action buttons, Play/Pause, the 0.05-second step and Reset. Actual images must follow the timeline. Reset restores the supplied initial pose and clears the displayed completion count.

The supplied `Clip` accepts `duration`, `step`, `loop`, `tracks` and `events`. A track has `target`, `property` and `keys` of [time,value] pairs. A method event has `at`, `target` and `method`. Acceptance checks both tracks, precise timing, real callback invocation, replay, source images and rendered crops. Keep the local page runnable through `index.html`.
