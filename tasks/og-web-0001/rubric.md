# Idle Factory Planet assessment

BUILD gates the score on a working local browser launch. Score each criterion0–1, with evidence and rationale. Total = BUILD × (0.15 mean(M1–M3) +0.35 mean(D1–D4) +0.15 mean(V1–V2) +0.35 mean(A1–A4)). Original category weights and criteria are retained. Functional QA never fills unreviewed artistic values; leave those null.

| ID | Criterion | Evidence |
|---|---|---|
|M1|Grid machine placement and continuous automatic resource production, with visible operation; at least two types.|Placement/real-time tests plus animation review.|
|M2|Actual miner→smelter→fabricator→seller chains connected by visible conveyors carrying resources.|Topology,disconnection,resource conservation and visible-flow tests.|
|M3|Finite resources,depletion meter,prestige preview,permanent multiplier,layout reset and retained research.|Depletion/slowdown/prestige tests.|
|D1|At least four distinct machine functions and recognizable sprites; higher stages require lower-stage inputs.|Recipe tests and art review.|
|D2|At least three distinct research options with costs/effects; faster mining,multi-input fabrication,storage.|Prerequisite,unlock,capacity and multi-input tests.|
|D3|Per-stage measured throughput allows identifying bottlenecks and improving layout.|Rate and interrupted-network tests; manual clarity.|
|D4|Exponential cost/production growth and prestige acceleration; K/M/B large-number formatting.|Economy/scaling tests; manual progression review.|
|V1|Place→connect→produce→sell→research→expand is fully playable,with visible state changes.|UI actions,demos and manual end-to-end review.|
|V2|Title→planet→research→depletion→prestige→next planet connects without restart.|UI/demos.|
|A1|Styled industrial title with planet/factory/conveyor imagery and functioning play action.|Manual title review.|
|A2|Coherent industrial/science-fiction visual language across terrain,machines,belts,resources and UI.|Manual.|
|A3|Illustrated/textured world,distinct machine sprites,resource movement and themed counters/tech tree.|Manual.|
|A4|Smooth multi-frame operation,transport,research,depletion,prestige,counter feedback and transitions.|Manual replay/motion review.|

M/D/V use best demonstrated evidence; A uses mean presentation evidence across input demos. Where source criteria require authored sprites and themed art for full credit, functional shapes/default widgets cannot receive full visual credit. Purely geometric/default presentation is capped at0.5 for the affected criteria. New explicit economy values and a simulation module interface make automated verification reproducible; they do not replace the presentation and progression judgment.
