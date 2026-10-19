# Pipe Crisis assessment

BUILD gates the score on local browser launch without fatal errors. Total = BUILD × (0.15 mean(M1–M4) +0.35 mean(D1–D4) +0.15 mean(V1–V3) +0.35 mean(A1–A3)). Rate each criterion0–1 with evidence. All14 source criteria and weights are retained; unreviewed aesthetics remain null.

|ID|Criterion|Evidence / aggregation|
|---|---|---|
|M1|Select pipes from finite inventory and place on empty grid cells; straight,corner,T,cross openings and rotation before/after placement.|Placement/inventory/UI tests; maximum.|
|M2|Actual flow after countdown/trigger follows connected openings; dead ends and leaks overflow.|Topology/failure/timing tests and flow review; maximum.|
|M3|Each fluid reaches matching drains; mixing different fluids in one shared channel fails.|Drain/contamination/cross-isolation tests; maximum.|
|M4|Visible timed planning,early start,incomplete-route failure and retry.|Live countdown/UI/demos; maximum.|
|D1|At least3 distinct fluid behaviors,including standard flow,corrosive acid and faster steam.|Timing/damage tests and differentiated asset review; maximum.|
|D2|At least15 levels in themed facilities,escalating from single-source to parallel/crossing/multi-source obstacle layouts.|All15 constructed solutions and content review; maximum. Fewer than5 scores0.|
|D3|At least2 distinct special-pipe strategies: isolated crosses,reservoir delays,acid-resistant lining.|Component tests and visual identity; maximum.|
|D4|At least2 obstacle types,including blocks and immovable pre-placed pipes.|Placement/lock tests and map review; maximum.|
|V1|At1280×720,empty cells,pipes,terminals,obstacles,openings and moving fluids are unambiguous.|Bounds/UI and manual readability; mean across demos.|
|V2|HUD shows countdown,inventory,current level and fluid legend; flow progress is visible.|UI checks and motion review; mean.|
|V3|Styled title,level selection,success and failure; efficiency and failure position/reason.|Navigation/outcome tests; maximum.|
|A1|Coherent industrial plumbing art:metal pipes,fluids,terrain,gauges,valves and matching UI.|Manual; mean.|
|A2|Detailed textured pipes/openings/joints,animated fluid direction/bubbles and mechanical source/drain assets.|Manual; mean.|
|A3|Polished progressive filling,placement,rotation,overflow effects and transitions.|Manual; mean.|

Full credit for criteria requiring authored art cannot be obtained with plain geometry,solid fills,default widgets,text-only variants or color swaps; affected criteria are capped at0.5 in those cases. Passing functional checks does not imply full visual/art/content credit. Exact maps and simulation interfaces are additional reproducibility constraints and are documented as changes to the original design freedom.
