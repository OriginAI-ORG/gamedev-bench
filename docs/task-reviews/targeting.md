# Battle targeting — eighteen individual reviews

All18 instructions, validators, unit stats, main scenes and component files were compared. The263–273 archives omit detector/finder implementations and assembly;274–280 already contain those algorithms with specific missing connections. The previous Web version used base50 everywhere, centered-point range tests and a flat SVG state model. It retained nearest opposing selection but lost collision formulas, component identity, actual two-stage forwarding and seven distinct repair boundaries. All source archives contain no bitmap/vector artwork; visible Web inspection geometry is supplied, not omitted source art.

## Per-task parameters and work boundaries

Own/opposing group columns correspond to team0. Team1 targets the own group. Both enemy units have attack range1; every original body is24×24. Position/probe columns give x with y0; the player starts at0.

| Task | Own / opposing group | Base × player range = radius | Near / far | Move far closer / move both outside | Repair scope |
|---|---|---|---|---|---|
| og-web-0157 | heroes / goblins |30×3=90|70/140|20/340|Implement detector/finder/mapping/assembly|
| og-web-0158 | guards / intruders |24×4=96|80/170|30/360|Implement detector/finder/mapping/assembly|
| og-web-0159 | blue_bots / red_bots |28×3=84|60/150|10/300|Implement detector/finder/mapping/assembly|
| og-web-0160 | predators / prey |32×2=64|50/120|20/260|Implement detector/finder/mapping/assembly|
| og-web-0161 | player_units / enemy_units |36×2=72|50/130|10/300|Implement detector/finder/mapping/assembly|
| og-web-0162 | allies / hostiles |40×2=80|75/140|15/310|Implement detector/finder/mapping/assembly|
| og-web-0163 | security_drones / intruders |26×3=78|55/130|12/280|Implement detector/finder/mapping/assembly|
| og-web-0164 | fleet_a / fleet_b |34×2=68|60/125|18/290|Implement detector/finder/mapping/assembly|
| og-web-0165 | wizards / warlocks |22×4=88|70/160|25/330|Implement detector/finder/mapping/assembly|
| og-web-0166 | workers / saboteurs |38×2=76|65/150|14/320|Implement detector/finder/mapping/assembly|
| og-web-0167 | sentries / raiders |27×3=81|60/145|16/305|Implement detector/finder/mapping/assembly|
| og-web-0168 | player_units / enemy_units |36×2=72|50/130|10/300|Supply missing explicit finder.detector reference; actor and algorithms already supplied|
| og-web-0169 | player_units / enemy_units |36×2=72|50/130|10/300|Supply missing actor reference to finder nested under detector; source test explicitly uses nested lookup|
| og-web-0170 | player_units / enemy_units |36×2=72|50/130|10/300|Assign detector.actor on unit stats updates; detector reads actor.stats|
| og-web-0171 | player_units / enemy_units |36×2=72|50/130|10/300|Connect raw detector events to existing typed forwarding handlers|
| og-web-0172 | player_units / enemy_units |36×2=72|50/130|10/300|Invoke finder actor setter from stats update; source setter and detector forwarding already present|
| og-web-0173 | heroes / monsters |30×3=90|70/145|20/340|Connect raw events to typed handlers; preserve distinct groups/positions|
| og-web-0174 | security_drones / intruders |26×3=78|60/135|15/300|Connect raw events to typed handlers; preserve distinct groups/positions|

Full validators were read for263/274 and differences inspected across every task. After normalizing only string/numeric literals, control flow is identical except275's nested finder lookup. The parameter table retains all numeric differences; the component inspections above retain differences the common source validator does not directly assess.

## Removed, replaced and added

- Removed the fabricated base50 and common world positions, center-only range checks, undifferentiated flat state and algorithm rewrites for274–280. Original numeric values are supplied explicitly because several source instructions omitted values demanded by their validators.
- Restored detector layer4×(team+1), mask2−team, body layerteam+1/mask0, a new independent circle on stats assignment, current stats forwarding and inherited world coordinates. A provided circle-versus-rectangle overlap service replaces native area physics. Its edge/corner behavior is independently tested.
- Restored typed BattleUnit reference arrays, actual EventTarget subscriptions, full-group nearest selection by squared distance, sibling/nested hierarchy, explicit detector binding, actor-derived configuration, setter-triggered subscriptions and filtered forwarding as applicable.
- Replaced native resources with UnitStats objects, scene groups with a recursive browser scene registry, and scene connections with object references/listeners. Stats cloning already existed and remains supplied. Browser rendering and controls are provided to expose runtime state.
- Retained the v1 empty-group reset and stable tie behavior, and added explicit duplicate/absent-event guards and cleanup. The source finder used a minimum-index expression without an empty-group guard, and raw handlers would append duplicate artificial enter events. These are disclosed robustness additions; they do not establish equal difficulty across platforms.
- Added stats reassignment checks for both teams, separate shape/list identity, inherited offsets, type filtering, nearest targets beyond the circle, repeated binding without duplicate subscriptions, direct forwarding probes and mutation coverage. For the seven repair variants, these verify preserved supplied behavior rather than expand the implementation assignment.

## Acceptance

Each task checks exact config, group mapping, scene structure, bindings, bits, sizes and source positions; live overlap and target-switch examples; independent geometry edge/corner samples; opposite-team search and closest-target changes; in-place typed membership events and cleanup; SVG radius/line/count changes and keyboard movement. Forwarding tasks also exercise both raw directions on independent detectors and reject non-unit payloads. Initial incomplete starters must fail. Behavioral mutations distinguish wrong formulas, reused shapes, range-limited nearest searches, duplicate members, omitted bindings and leaked forwarding listeners.

Staged QA receipts are recorded under artifacts/og-qa. All packages are version2.0.0 with matched bilingual requirements and English solver input. Final cohort QA is indexed in validation/task-audit.json against the frozen shared code. Naming/parameter variants should retain their family grouping when reporting benchmark results; they are not18 independent algorithmic challenges.
