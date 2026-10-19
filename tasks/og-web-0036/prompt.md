# Assemble a platform player and implement movement

Complete `createPlayer({Body,Sprite,RectangleCollider})` and `physicsStep(player,input,dt)` in `component.js`. The browser fixture supplies collision integration, input, a fixed physics clock, rendering and parameter controls.

- **R1 — Player assembly.** Return a new `Body` named `Player`, with a `Sprite` using `tileYellow_02.png` and a `RectangleCollider` of size [32,68]. Preserve the original bitmap. Set editable movement parameters `speed` to 1200, `jumpSpeed` to -1800 and `gravity` to 4000.
- **R2 — Gravity and horizontal input.** On every physics step, add gravity ×dt to `player.velocity[1]`. Read `input.getAxis()` and set `player.velocity[0]` to the axis multiplied by speed. The axis is -1, 0 or 1, and velocity units are pixels per second. Horizontal response is immediate.
- **R3 — Move before checking jump.** Call `player.moveAndSlide(dt)` once to integrate movement and update contact state. Afterward, set vertical velocity to jump speed only if `input.justPressed('jump')` is true and `player.isOnFloor()` is true. Holding jump or pressing it in midair must not repeatedly reset vertical velocity.
- **R4 — Reusable parameters.** Movement must use the player's current parameter values. Preserve the supplied body's collision method and contact result rather than replacing them with a timer or displayed state. Landing must resolve penetration and stop downward velocity.
- **R5 — Browser integration.** Preserve direction controls, keyboard arrows, Space to jump, Play/Pause, a 1/60-second step, parameter inputs and Reset. Actual position and bitmap rendering must change with movement. Reset restores the initial player and parameter values.

Acceptance checks component types, image integrity, dimensions, per-step velocity, operation order, floor-gated jumps, landing, keyboard input and visible motion. Keep the local page runnable through `index.html`.
