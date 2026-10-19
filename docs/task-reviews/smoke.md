# Campfire smoke: individual source review

All twenty instructions and numeric validator clauses were read. Main scenes are byte-identical (SHA256 prefix9dbac728b6a8); validators have the same control flow after numeric/string normalization (prefixeef76efcdb6a). Each starter contains Campfire at(600,500), a256×256 base sprite and an existing flame emitter at local(0,-28). Smoke is absent. This is an add/configure resource task, not a request to implement a particle simulator.

| Task | Amount / lifetime / preprocess | Direction X | Speed | Sway ± | Max scale | Trail seconds | Sections / subdivisions |
|---|---|---|---|---|---|---|---|
|315|8 /12 /18|.15|20–35|20|2|4|24 /24|
|316|20 /18 /25|.25|40–65|40|4|6|48 /48|
|317|15 /10 /15|.1|50–80|25|3|4.5|32 /32|
|318|6 /20 /30|.3|15–25|15|2.5|7|40 /40|
|319|12 /15 /20|.2|30–50|50|3|5|32 /32|
|320|14 /16 /22|.05|35–55|10|3.5|5.5|36 /36|
|321|25 /14 /18|.2|45–70|35|4.5|5|48 /48|
|322|4 /25 /35|.1|10–20|8|1.5|8|32 /32|
|323|18 /12 /16|.15|55–85|30|3.5|4|36 /36|
|324|10 /18 /24|.2|25–40|20|2.8|6|40 /40|
|325|9 /13 /17|.25|35–55|25|2.5|4.5|28 /28|
|326|5 /22 /30|.15|12–22|18|2|7.5|36 /36|
|327|22 /11 /14|.2|50–75|40|4|4|44 /44|
|328|16 /8 /12|.05|60–90|15|2.5|3|32 /32|
|329|7 /20 /28|.3|18–30|12|2.2|6.5|36 /36|
|330|13 /10 /14|.1|45–65|20|3|3.5|28 /28|
|331|11 /17 /23|.2|28–45|30|3.2|5.5|40 /40|
|332|19 /12 /16|.1|40–60|25|3.8|4.5|36 /36|
|333|6 /24 /32|.2|10–18|10|1.8|8|44 /44|
|334|24 /9 /12|.15|55–80|35|4.2|3.5|40 /40|

The previous Web version replaced the three source textures with synthetic shapes, moved the effect to(900,820), prescribed one alpha/width formula and required a full SVG simulation. This discarded resource assembly, texture binding and configurable curve/gradient composition, while adding unrelated algorithm implementation. All twenty repairs restore the resource-assembly boundary and task-specific configuration.

Removed: native serialization/types, source-engine disclaimer, SVG-only output and full-simulator implementation. Replaced: native curve/gradient resources with supplied independent Curve,CurveXYZ and Gradient objects; native GPU trails with a supplied WebGL textured triangle-strip renderer. Source textures are copied byte-for-byte (full hashes in assets.json). Campfire position/base/Fire properties remain supplied; the browser's provided flame animation approximates its original particle distribution and is not a new solver requirement.

Restored: per-row quantity,life,preheat,direction,speed,sway,growth,trail duration/sections/subdivisions; zero gravity; an X sway curve with at least three points; a separate growth curve and orange→gray→transparent ramp; actual smokelet texture applied across continuous trails. Curve shapes/colors remain solver choices. Explicit normalized domains, both positive/negative sway, monotonic growth, gray middle and fully transparent endpoint clarify the intended appearance. The source validator was weaker: it accepted any three X points, endpoint-only growth, merely warm first color and last alpha≤.15. Exact parameters and these semantic checks are recorded tightenings, not identical old pass criteria.

The provided runtime integrates the X curve over normalized particle age for lateral velocity, uses normalized initial direction, and maps sections×subdivisions+1 history points into textured ribbon geometry. This defines a browser-native curve/sampling model; native GPU interpolation/randomization/rasterization equivalence is not claimed. It avoids moving that simulator burden onto the solver. The source project does not specify a viewport size; the supplied browser inspection viewport is1200×700.

Acceptance verifies source image hashes, immutable provided files, hierarchy and independent material resources, all per-row settings, curve/ramp constraints, numerical motion integration, growth/fade endpoints, trail duration/tessellation, parent translation, particle expiry, actual texture/trail/growth effects on pixels, preheat and repeatable controls. Negative mutations remove trails, sway, growth or select the flame texture instead of smoke. These checks demonstrate resource settings affect the rendered effect; they do not certify equal human/model completion times or unmeasured artistic quality.

Runtime verification notes: an emission boundary can temporarily leave one pool slot empty, so preheated live count is checked against capacity minus one through capacity; configured amount is checked exactly. High tessellation preserves every requested sample while using triangle strips to avoid duplicate triangle vertices. Display refresh leaves100ms between draws. A standalone315-family high-density316 measurement recorded34.5ms JavaScript draw submission and1697ms Playwright pause-click completion on the local browser; three concurrent GPU tests exceeded the generic2200ms action timeout. Visual-control actions therefore use an8000ms timeout, without changing particle or mesh requirements. This is harness timing tolerance, not a measured frame-rate claim.
