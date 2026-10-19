# Fit the collision rectangle to the character's feet

Complete `component.js` in the supplied browser scene in `game/`; retain `index.html`. The player, floating mode, full idle/walk animation clips and direction mapping are already supplied. This task adds only the missing collision rectangle by inspecting the character image.

- **R1 — Preserve the existing component.** Export `configurePlayer(player, services)`, modify and return the same player. Keep the supplied sprite, its animation objects and frame resources unchanged. Preserve default `idle0`, frame 0, `speedScale = 2` and existing floating mode.
- **R2 — Visual fit.** Add a supplied RectangleCollider. Inspect frame 0 of idle0 and place the rectangle around the two visible feet. It should be only tall enough to cover the feet, and roughly as wide as the head. Coordinates are relative to the center of the full untrimmed image, positive Y downward. Do not center the collider on the torso or use the whole image bounds.
- **R3 — Functional bounds.** The same collider must drive both the visible rectangle and pointer hit tests. Points on the feet must fall inside; a point at the torso center must remain outside. Preserve its position/size when changing preview direction or animation.
- **R4 — Fixture.** Keep the actual bitmap preview and all supplied clips, direction controls, Idle/Run, Pause / Play, Advance 0.1 s, Probe pointer and Reset. Start paused at idle0/frame 0. Reset restores the fitted collider and original supplied animation objects in a fresh player instance. Preserve art attribution and license.

Acceptance checks preservation of supplied resources, collider type, placement and approximate dimensions against the visible feet/head, real hit boundaries, matching on-screen bounds, unchanged animation rendering and reset. The public example probes the feet. Do not modify checks or fabricate results.
