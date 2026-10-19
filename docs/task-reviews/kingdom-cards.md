# Kingdom Cards: source comparison and repair

The original instruction and all18 rubric criteria have been read. The previous fixed-hand three-territory slice omits real shuffled draw/discard/trash/keep persistence,diplomacy,two active AI factions,deck acquisitions,meaningful territorial strategy and a complete campaign/history. The repair must restore the four required card categories with at least two distinct cards each,farms/markets/barracks,actual army commitment,active rival expansion and attacks,truce/trade/betrayal,permanent stronger card gains,win-all/lose-all and territory-history results.

|Comparison|Change and repair|Acceptance|
|---|---|---|
|Removed by previous slice|Persistent shuffled decks,keep/permanent trash and stronger acquisitions.|Unique card IDs,reshuffle conservation,twenty-turn trash exclusion,kept cards plus fresh draws,construction/capture gains.|
|Removed|Diplomacy and two active opponents.|Real truce/trade/betrayal effects,two independent hands and paid actions,simultaneous competing armies with tie/loser/casualty checks.|
|Weakened|Three holdings and fixed hands reduced strategic campaign complexity.|Six connected holdings with different yields and positions;four required categories with multiple variants,plus stronger provision cards;real troop commitments and production.|
|Removed|Complete campaign,history and most visual/content rubric coverage.|All/no-territory results,three legal seed campaigns,interactive history,new game,18-item15/35/15/35 rubric and real input demos.|
|Replaced|Native launch/recordings and mounted art libraries.|Local browser entry/input replay and optional generated fantasy/parchment artwork.|
|Added|Exact card/map/economy values,AI policy,simultaneous conflict rule,seed and public interfaces.|These constrain open-ended design and platform engineering;they do not imply equal creative freedom or interchangeable scores.|

Version2.0.0 passed staged QA in96 seconds:three reference repetitions,eleven private scenarios,six behavior mutants,visual mutants,starter rejection and four input demos. Seeds42,43,44 complete actual shuffled campaigns in6,4,7 turns without forced territory changes. Independent fixtures cover both AI armies targeting one territory and a tied contest,real resource transfers,defense thresholds,permanent acquisitions and deck thinning. English/Chinese contracts,reference and tests are directly authored. Final combined QA is recorded in validation/task-audit.json;manual art/balance scores are not inferred from functional passing.
