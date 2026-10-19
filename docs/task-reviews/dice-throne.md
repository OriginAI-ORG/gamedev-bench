# Dice Throne: individual source comparison and repair

The source instruction and18 rubric criteria were read. The previous Web slice kept one repeatable enemy,5 dice,locking,two rerolls and sword/shield/heart arithmetic. It omitted skull specials,visible independently rolled enemy dice,actual random sampling,equipment modifying faces,the branching dungeon,shops/new dice,rest,boss,run results and nearly all full-game presentation.

The directly authored simulation supplies seeded uniform face sampling,five initial six-face dice,sword/shield/heart/skull effects,two limited rerolls with locked dice preserved,eight distinct face-modifying items,six ordinary enemy configurations plus a custom-face dragon,13 branching nodes across four floors,shop/rest/loot and complete run summaries. The full browser UI uses that engine. Optional atlases include six distinct ordinary enemy identities,dragon art,eight individually illustrated items and special face icons.

|Change|Previous loss / non-equivalence|Repair and acceptance|
|---|---|---|
|Removed|Visible enemy rolls and skull special effects.|Independent enemy-face arrays and simultaneous visible intent; separate piercing effects; direct effect-order tests.|
|Replaced incorrectly|Fixed dice sequence removed genuine sampling and equipment probability changes.|Seeded uniform sampling of actual face arrays,including a seven-face modified die; distribution,lock and reroll-limit checks.|
|Removed|Face equipment,new dice,shops and run persistence.|All8 distinct item transformations,selected target die,affordability,invalid-target rejection,new-die limit,free loot and persistent actual face inspector.|
|Removed|Enemy variety,branching dungeon,rest,elites,boss and run statistics.|Six ordinary enemy configurations,13-node map,elite scaling,rest,custom boss faces and complete victory/death reports. Three legal seeded runs reach and defeat the boss using actual rolls and purchases.|
|Removed|Full art/navigation rubric and most presentation.|Illustrated title,dungeon,characters,items,dice,lock glow,tumble/effect feedback and all18 criteria at15/35/15/35 weighting. Manual quality remains separately reviewed.|
|Replaced|Native project/trace protocol and missing mounted art libraries.|Local browser package,actual mouse traces and optional generated artwork.|
|Added|Exact stats,random algorithm,map,scenario fixtures and exported interfaces.|Explicit in both prompts. These constrain balancing/content/architecture freedom; restored scope does not prove identical difficulty.|

Version2.0.0 includes aligned prompts,blank starter,reference,public example,ten private scenarios,five behavior mutants and four real input demos. Private coverage includes1000 sampled seven-face rolls,locked-die preservation,two-reroll limit,all-locked rejection,effects and healing/defense order,all8 exact modifications,route legality,shop/rest/loot economy,fresh-run reset and terminal UI. Final release requires final-file QA receipts; no model run or full artistic score is claimed.
