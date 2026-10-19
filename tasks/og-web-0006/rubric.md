# Word Spell assessment

BUILD requires a clean local browser launch without fatal errors. Score = BUILD × (0.15 mean(M1–M5) +0.35 mean(D1–D5) +0.15 mean(V1–V4) +0.35 mean(A1–A4)). Retain all18 items,scored0–1 with evidence. Functional tests do not assign unreviewed art scores; those remain null.

|ID|Criterion|Evidence / aggregation|
|---|---|---|
|M1|Draw7 tiles from the actual pool,drag into a word,validate and deal length-scaled damage; invalid words waste turns.|Draw,word,drag and fizzle tests; maximum. Missing word-forming scores0; missing validation or length scaling at most0.5.|
|M2|At least3 distinct word-combination elemental effects with visible icons.|Independent fire/ice/heal order,weakness and deduplication tests; maximum. None scores0; fewer than3 at most0.5.|
|M3|Visible enemy health and next attack damage with an active countdown that creates time pressure.|Countdown boundaries,multiple elapsed turns and live UI; maximum. Missing both scores0; health without telegraph at most0.5.|
|M4|Add,upgrade and remove persistent tiles between encounters,changing future combat.|Actual pool mutations,special draws/rewards/shop tests; maximum. No management scores0; only one operation at most0.5.|
|M5|A branching map supports combat,rest and buy/sell shops with route choices.|Route legality and complete runs; maximum. No map scores0; unbranched map at most0.5.|
|D1|At least6 distinct enemies with different health,attack patterns and elemental weaknesses.|Data/route tests and manual identity/strategy review; maximum. Fewer than3 scores0; identical statistics at most0.5.|
|D2|At least5 special tile variants including double golden vowels,elemental consonants and unused-tile curse penalties.|All-kind effects,costs,compatibility and penalty tests; maximum. Identical tiles score0; fewer than4 variants at most0.5.|
|D3|At least3 increasingly difficult floors culminate in a high-health boss requiring multiple strong words.|Map,enemy values and real seeded complete runs; maximum. One floor scores0; no difficulty increase at most0.5.|
|D4|Combat gold buys specific letters/upgrades; rests heal; at least2 distinct noncombat room types.|Economy,minimum pool,rest and full-route tests; maximum. No noncombat rooms scores0; meaningless rooms at most0.5.|
|D5|Victory/death results show floor,longest word,total damage,collected tiles and elemental triggers.|Summary and terminal UI tests; maximum. No results scores0; incomplete basic results at most0.5.|
|V1|A styled title with letter tiles arranged into a magical effect and game name.|Normal demo/manual review; maximum. No title or raw UI scores0; sparse title at most0.5.|
|V2|Connected title→map→combat→rewards→next-node flow without restarting.|Real traces and legal complete runs; maximum. Missing transitions score0; broken flow at most0.5.|
|V3|Hand,spelling bar,enemy health,attack countdown,elements and player health are visible without overlap.|Desktop bounds and manual UI inspection; maximum. No combat UI scores0; incomplete/overlapping UI at most0.5.|
|V4|Strong readability at1280×720:large letters,distinct enemies,clear elements,navigable map.|Layout/pixel checks and review across recordings; mean. Blended elements score0; shape-dominated visuals at most0.5.|
|A1|Coherent magical word-casting art across title,map,combat,letters,enemies and UI.|Manual across recordings; mean. Default UI/placeholders score0; sparse/generic art at most0.5.|
|A2|Polished letter tiles,special variant art,illustrated enemies and themed map nodes.|Manual; mean. Plain text on white squares scores0.|
|A3|Themed spelling bar,health,map,shop and result widgets.|Manual; mean. Obviously unstyled primary UI scores0.|
|A4|Satisfying tile snap,casting animation,elemental particles,enemy damage reactions and fizzle feedback.|Manual motion review; mean. No feedback scores0; minimal animation at most0.5.|

Full-credit visual conditions apply to the original mechanics,depth,visual and art items:only geometry,solid fills,default controls,color-only variants or text-only assets cap the relevant score at0.5. Optional supplied artwork does not itself earn full credit; actual composition,distinct identities and animation must be reviewed. The fixed2053-word lexicon,exact formulas,enemy values,map and public interfaces are reproducibility additions,not evidence of identical difficulty or creative freedom.
