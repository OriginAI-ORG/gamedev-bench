# Circuit Wizard assessment

BUILD gates the score on a successful local browser launch without fatal errors. Score each item0–1 from recorded evidence. Total = BUILD × (0.15 mean(M1–M4) +0.35 mean(D1–D4) +0.15 mean(V1–V3) +0.35 mean(A1–A3)). All14 source criteria and category weights are retained. Automated success is functional evidence, not a completed aesthetic rating; unreviewed values remain null.

| ID | Criterion | Evidence / aggregation |
|---|---|---|
|M1|Drag AND/OR/NOT/XOR onto grid cells; distinct functional input/output pins; remove and reposition gates.|Spatial and UI tests; maximum demonstrated score.|
|M2|Draw actual gate-output to gate-input wires; signals propagate with correct boolean logic.|Topology and independent truth-table tests; maximum.|
|M3|Run/test visibly propagates signals; correct outputs green, incorrect outputs red with expected values.|UI tests and motion/readability review; maximum.|
|M4|All output combinations must pass before completion; advance and clear support replay.|False-positive tests and campaign navigation; maximum.|
|D1|At least15 progressively complex puzzles, including basic/compound logic,half/full adders,multiplexers and challenge rounds.|All15 solutions plus manual content variety; maximum. Fewer than5 scores0.|
|D2|At least4 core gate types plus distinct later splitters,delays or NAND/NOR,each with correct logic.|Component and campaign tests,illustrated identity review; maximum. Fewer than3 scores0.|
|D3|Bounded space,wire-crossing restrictions,immovable pre-placed components and gate-count efficiency.|Bounds/budget/crossing/lock tests; maximum.|
|D4|Later multi-bit buses require multiple signal lanes; all required input/output combinations readable.|Two-bit16-row tests,splitter and display review; maximum.|
|V1|At1280×720,inputs,outputs,gates,wires,high/low states and empty cells are distinct and readable.|Layout and manual review; mean across demos.|
|V2|Directional signal animation,distinct high/low states and visible per-row pass/fail truth-table feedback.|Motion review and UI checks; mean.|
|V3|Styled title,chapter selection,puzzle selection and completion; efficiency and next puzzle.|Navigation tests; maximum.|
|A1|Coherent electronics workshop art direction: PCB green,copper traces,components and UI.|Manual demo review; mean.|
|A2|Detailed gate sprites with symbols,pins and housings; connector terminals,cables and textured board/workbench.|Manual; mean.|
|A3|Polished placement/wiring/signal/success/failure/transition animation with coherent feedback.|Manual; mean.|

Where a criterion requires illustrated assets or themed presentation for full credit, purely programmatic shapes,color swaps,solid fills or default widgets are capped at0.5 for that criterion. Distinct content cannot receive full credit from text labels alone. The instruction's additional delay and feedback-latch requirements are enforced by timing tests even though the rubric does not give them a separate item. Fixed puzzle targets and interfaces are reproducibility additions, not claims of identical creative freedom.
