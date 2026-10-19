# Finite state machine foundations

Complete `machine.js` in the supplied local browser game in `game/`; retain `index.html`. The fixture supplies actor poses and controls. Implement the reusable lifecycle component rather than hardcoding the three displayed states.

- **R1 — State.** Export `State(actor)` storing the exact actor reference as `.actor`. Supply overridable `enter()`, `exit()`, `process(delta)` and `physicsProcess(delta)` methods. Different State instances can refer to the same actor without sharing their own state objects.
- **R2 — Machine.** Export `FiniteStateMachine extends EventTarget`, initially with `.state === null`. `changeState(next)` calls the previous state's `exit()` if one exists, calls `next.enter()`, assigns `.state = next`, then emits exactly one `state-changed` CustomEvent whose `detail` is that exact new state. Listeners must see the updated state. The first transition has no outgoing exit. Calling with the current state still performs exit, enter and notification.
- **R3 — Generality.** Use the provided state objects and methods, including arbitrary subclasses and names. Preserve object identity and actor references; do not infer transitions from labels or fabricate a lifecycle log. Multiple machines operate independently.
- **R4 — Integration.** Keep the supplied Idle, Run, Attack and Reset controls. State callbacks change the visible actor pose, and the event listener updates `#status` and `#log`. A normal transition appends `exit:OLD`, `enter:NEW`, `changed:NEW` in that order. The fixture initializes IDLE and clears its initialization log. Reset creates a new machine in that same initial display with no stale transition history.

Acceptance checks arbitrary state objects, actor identity, lifecycle order, first and repeated transitions, event payload/state timing, independent machines, visible poses and reset. The public example transitions IDLE to RUN. Do not modify checks or fabricate results.
