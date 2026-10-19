# Word Spell: source comparison and repair

The source instruction and all18 rubric items were read. The previous single-encounter Web slice omitted persistent tile-pool management,upgrades/removal,buy/sell shops,rest,branching floors,six enemy configurations,five special tile variants,boss and complete results/presentation. It named a missing large dictionary as a loss,although the source requires valid-word checking without prescribing a lexicon size; avoid inventing a source size requirement.

A2053-word local game lexicon is directly curated in dictionary.js. The repair restores a20-tile starting pool,seven unique drawn tiles,real drag/reorder input,exact word validation,length-based damage,fire/ice/heal triggers,live attack countdown and costly invalid/pass turns. Five special variants include double-scoring golden vowels,enchanted fire/ice/heal consonants,and cursed unused-tile penalties. Reward choices add/upgrade/remove; shops buy/sell/upgrade;rest heals;three branching floors contain six ordinary enemies and a boss. All18 source criteria and15/35/15/35 weights remain.

|Comparison|Change and repair|Acceptance|
|---|---|---|
|Removed in the old adaptation|Permanent pool,upgrades,removal,shop/rest/branching campaign,boss and run statistics.|Real mutation/persistence,economy,route legality,three legal seeded complete runs and result checks.|
|Replaced and weakened|A fixed hand and14-word list became the entire word game;turn-counter attacks replaced live time pressure.|2053-word supplied lexicon,seeded seven-tile draws,real seconds,damage/element order,automatic expiry and expensive invalid turns.|
|Incorrect substitution|CARE healing replaced the explicit heal substring and only one simplified enemy remained.|Restore heal trigger plus blessed consonants,six enemy patterns/weaknesses,five tile kinds and high-health boss.|
|Removed presentation and score coverage|Full game flow,illustrations,snap/cast/fizzle feedback and most weighted criteria were absent.|English/Chinese complete contract,18-item rubric,optional original generated art,real input demos and manual visual scoring retained.|
|Platform replacement|Native launch and recordings become local browser entry and real browser input playback.|Functional launch gate,viewport checks and deterministic input traces.|
|Added reproducibility constraints|Fixed lexicon,formulas,stats,map,seed algorithm,scenario fixtures and exported model/selectors.|Independent state fixtures plus legal full-run tests. These constrain design freedom and remove dictionary selection work.|

Version2.0.0 passed staged QA in86 seconds:three reference repetitions,eleven private scenarios,five behavior mutants,visual mutants,starter rejection and four real traces. Seeds42,43,44 win using actual hands and legal management;bosses take4–5 casts. No forced health/roll outcomes are used in full-run tests. Final all-task evidence is indexed in validation/task-audit.json after integration. Functional passing does not establish identical difficulty or award unreviewed art scores.
