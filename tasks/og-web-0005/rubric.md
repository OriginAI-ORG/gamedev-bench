# Dice Throne assessment

BUILD gates the score on local browser launch without fatal errors. Total = BUILD × (0.15 mean(M1–M5) +0.35 mean(D1–D5) +0.15 mean(V1–V4) +0.35 mean(A1–A4)). Rate all18 retained criteria0–1 with evidence. Automated functional passing does not assign artistic scores; unreviewed values remain null.

|ID|Criterion|Evidence / aggregation|
|---|---|---|
|M1|Roll at least5 dice each turn with tumble animation and readable ability icons.|Sampling/UI tests and animation review; maximum. No animation or unreadable faces at most0.5.|
|M2|Select kept dice,lock them and reroll only others,at most2 times per turn.|Lock/limit/all-locked tests and real demo; maximum.|
|M3|Sword damage,shield defense,heart healing and skull specials produce distinct visible effects.|Independent face/effect-order tests; maximum. Fewer than4 functional types at most0.5.|
|M4|Visible enemy dice with independent configurations and results shown before resolution alongside player dice.|Enemy sampling/visibility tests; maximum. Hidden-until-resolution results at most0.5.|
|M5|Equipment changes actual die faces,including flame-sword upgrades and at least3 modifying items.|All-item mutation and persistence tests; maximum. Cosmetic-only equipment cannot receive full credit.|
|D1|At least6 distinct ordinary enemy types with different attack/defense/special face configurations.|Enemy-table and reachable-route checks; manual visual/strategy review; maximum. Fewer than3 scores0.|
|D2|At least8 equipment items modify faces in meaningfully different ways and support different builds.|Exact die-face/cost tests and manual build review; maximum. Fewer than4 scores0.|
|D3|Branching map includes combat,elite,shop and rest; shops sell modifications and new dice.|Route legality,economy,rest and complete legal runs; maximum.|
|D4|A final boss uses powerful unique face types and rewards improved dice builds.|Custom-face checks and legal complete-run wins; manual balance review; maximum.|
|D5|Victory/death reports floor,best damage,equipment and encounters won.|Terminal summary/UI tests; maximum.|
|V1|Styled illustrated title with tumbling dice,glowing face icons and the game name.|Title demo/manual review; maximum.|
|V2|Connected title→map→combat→loot→next-node flow without restart.|Real input demo and complete legal run; maximum.|
|V3|Simultaneously visible player/enemy dice,health,reroll count and resolved effects.|UI layout and independent outcomes; maximum.|
|V4|At1280×720,dice are large,face types readable,locks clear and enemy dice visible.|Bounds/pixels and manual readability; mean across demos.|
|A1|Coherent fantasy dice aesthetic across title,map,combat,equipment and UI.|Manual; mean.|
|A2|Illustrated or dimensional dice icons,distinct character sprites and equipment illustrations.|Manual; mean.|
|A3|Themed health bars,reroll counters,map,shop and loot displays.|Manual; mean.|
|A4|Tumbling dice,lock glow,slash/shield/heal effects and floating damage feedback.|Manual motion review; mean.|

For criteria requiring authored visuals for full credit,plain geometry,solid fills,default widgets,color swaps or text-only variants are capped at0.5. Some original rubric entries also cap sparse/minimal presentation at0.5; those limits remain applicable. Exact stats,seed algorithm,map and interfaces are reproducibility additions that constrain open-ended balancing and architecture. Full systems are restored,not a claim that the work or score is identical to a different engine environment.
