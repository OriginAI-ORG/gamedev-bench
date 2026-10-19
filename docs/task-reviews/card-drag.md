# Card interaction: individual source review

Sources: task_0281.zip through task_0294.zip, task_config instructions, card/hand/state scripts, main scene and test.gd. All fourteen source validators use the same state/overlap sequence with the individual literals below. The repaired browser tasks use those semantics and preserve each starter's missing work.

| Task | UI / hand | Drag group; dedicated layer | Zone size | Seconds | Titles | Repair boundary |
|---|---|---|---|---|---|---|
|281|HUD / CardRow|overlay_layer; UI root|PlayZone 240×96|.04|Guard,Brace,Cleave|Complete machine, states, card forwarding, hand return and placement|
|282|ScreenUI / Grip|drag_layer; UI root|CastZone 272×92|.06|Feint,Ward,Pierce|Same missing functions, distinct literals|
|283|OverlayUI / Rack|card_layer; UI root|ResolveArea 248×108|.08|Shell,Focus,Chop|Same missing functions, distinct literals|
|284|BattleUI / Hand|ui_layer; UI root|CardDropArea 256×100|.05|Block,Defend,Strike|Same missing functions, distinct literals|
|285|CombatHUD / Slots|float_layer; UI root|CommitArea 260×88|.03|Block,Lunge,Guard|Same missing functions, distinct literals|
|286|ActionUI / Tray|front_layer; UI root|UseZone 252×104|.07|Ward,Strike,Brace|Same missing functions, distinct literals|
|287|BoardUI / HandBar|ui_drag_layer; UI root|DropSlot 264×98|.09|Thrust,Guard,Chant|Same missing functions, distinct literals|
|288|TacticalUI / Cards|hud_drag_layer; UI root|CastArea 244×110|.05|Bash,Shield,Jab|Same missing functions, distinct literals|
|289|ArenaUI / Palm|screen_layer; UI root|ReleaseZone 268×90|.045|Charge,Brace,Slice|Same missing functions, distinct literals|
|290|FieldUI / GripRow|top_ui_layer; UI root|SpendArea 250×102|.065|Ward,Rush,Smite|Same missing functions, distinct literals|
|291|BattleOverlay / MoveBar|drag_overlay; UI root|ConfirmArea 258×94|.055|Cover,Drive,Cut|Same missing functions, distinct literals|
|292|BattleUI / BottomPanel / HandTray|ui_layer; BattleUI/DragCanvas|CommitZone 264×96|.06|Ward,Strike,Brace|Machine, states and card forwarding already provided; add drag placement and hand reparent listener|
|293|BattleUI / BottomPanel / HandLane|ui_layer; BattleUI/DragCanvas|CommitZone 264×96|.06|Ward,Strike,Brace|Only replace wrong bottom-panel parent with dedicated drag layer|
|294|CombatHUD / BottomBar / CardTray|ui_layer; CombatHUD/DragStage|ConfirmArea 258×92|.055|Guard,Drive,Slice|Only replace wrong bottom-bar parent; preserve wrapping hand|

The old adaptation replaced reusable component/event wiring with a single drag demo, dropping lifecycle guards, typed callback forwarding, original-index restoration and the late variants' smaller repair boundaries. This was not equivalent. All rows now carry explicit configuration and distinct supplied-code boundaries. The original 256×144 logical viewport and 25×30 card/detector size, center (12.5,15), mask2, initial disabled monitoring and state IDs0–3 are preserved. Zone logical widths exceeding256 remain larger than the visible viewport.

Removed requirements: engine serialization, native node/resource types and the blanket engine/pixel-exclusion disclaimer. Replaced requirements: native callbacks by DOM inputs and EventTarget, collision areas by actual AABB overlap, deferred child ordering by DOM insertion. The provider supplies scaled layout, overlap service and rendering. Native tween cancellation has no pending counterpart in the supplied instantaneous layout; no animation-reimplementation requirement is added. Source card scenes reference no image assets; CSS preserves their geometry and title/state roles, without carrying unrelated battle artwork from the archive.

Added requirements: duplicate/absent membership protection, listener cleanup, explicit add/reset inspection controls and visible zone boundaries. Hand gap4 and inspection colors are supplied presentation choices, not additional solver work. The later bottom panels retain heights36 (292/293) and40 (294). Instruction292 abbreviates DragCanvas, but the actual scene and validator identify BattleUI/DragCanvas; the repaired hierarchy follows that evidence.

Acceptance: independent state-machine spies verify initial enter/assignment order, rejected noncurrent/unknown transitions, exit→enter→assignment, all four forwarding methods and disconnection. Fake clocks probe below/exact thresholds, immediate cancellation and fresh timing. Nested coordinates and all original indices are tested, including added cards and clamping. Identity-based membership and partial rectangle overlap are exercised separately from real mouse drags, rendered state changes, play and reset. Behavioral mutations target guard removal, stale timers, append-only restoration and two distinct wrong-parent choices. Source-engine execution was not performed; equivalence is based on inspected contracts and supplied source behavior, not a claim of equal empirical completion time.
