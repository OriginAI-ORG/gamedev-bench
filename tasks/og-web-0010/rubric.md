# Courtroom Clue Trial assessment

BUILD is1 only when the local browser entry loads, accepts input and has no fatal runtime errors; otherwise total score is0. Each criterion is scored0–1. Total = BUILD × (0.15 mean(M1–M5) +0.35 mean(D1–D5) +0.15 mean(V1–V4) +0.35 mean(A1–A4)). M/D/V/A weights preserve the source assessment. Automatic QA is a separate functional report, not this total. Record an evidence trace/screenshot and rationale for every manual score; leave missing reviews null, never implicitly1.

| ID | Criterion | Evidence / ownership |
|---|---|---|
|M1|Multiple statements can be advanced, reviewed and pressed for new relevant information; visible index.|Automated navigation/press; manual relevance review.|
|M2|Evidence selection/inspection presents useful, readable facts for deduction.|Automated selection and required facts; manual relevance/readability.|
|M3|Correct evidence against the particular contradictory statement triggers objection and changes case progress.|Automated first and second layers plus wrong-statement controls.|
|M4|Wrong choices visibly reduce credibility and provoke a warning.|Automated penalties and mistrial; manual clarity.|
|M5|A genuinely interactive second deduction follows the first contradiction.|Automated second-layer decisions, not automatic verdict.|
|D1|At least four distinct exhibits with different logical roles; at least two affect different deductions.|Automated distinct exhibits and outcomes; manual logical fairness.|
|D2|Several courtroom roles have meaningful staging, reactions or mechanics beyond labels.|Manual role staging/reaction review.|
|D3|At least three statements require comparison; only one or two in a layer are contradictable.|Automated pairing checks; manual plausibility.|
|D4|Case-specific successful and failed endings are reachable, with summary and retry/title navigation.|Automated both endings/navigation; manual outcome writing.|
|D5|Opening brief establishes charge, suspect, location and evidence before testimony.|Automated title/brief path; manual adequacy for reasoning.|
|V1|Styled case-file title uses authored courtroom/case imagery and an obvious start action.|Manual visual review; automatic visibility check only.|
|V2|Title/scenario→brief/testimony→evidence→objection/penalty→verdict is connected.|Automated complete flow and demos.|
|V3|Dialogue,index,evidence,credibility and actions are readable at1280×720 without clipping/overlap.|Automated bounds/visibility; manual legibility.|
|V4|Pressing,objections,penalties and verdicts clearly communicate their consequences.|Manual feedback review with automated pixel-change evidence.|
|A1|Publishable courtroom visual direction: consistent palette,type,icons,spacing,hierarchy and feedback.|Manual; cannot be inferred from passing tests.|
|A2|Evidence looks like designed physical exhibits with cards,stamps,tabs,icons or diagrams, not plain rows.|Manual.|
|A3|Portraits establish identity; at least two characters visibly react during key moments.|Manual across traces; reference provides four roles.|
|A4|Animation,timing,transitions,cut-ins or dramatic pauses reinforce the trial.|Manual motion review, not screenshot-only scoring.|

Normal startup and deterministic scenarios must be replayable using1–10 input traces at1280×720,30fps,maximum600frames each. Keep the maximum/mean evidence aggregation roles of the original rubric: mechanics and depth use best demonstrated evidence, V1/V2/V3/V4 use best demonstrated evidence, and A1–A4 use mean evidence across submitted demos. A coherent fully functional case is required; there is no requirement for several separate cases or an unrelated branching campaign.
