# Dice Throne

Build a complete browser dice-combat roguelike with keep/reroll decisions, visible enemy dice, equipment that changes real die faces, a branching dungeon and a custom-dice boss. Deliver a local self-contained `index.html` package without external services. The supplied fantasy and dice atlases are optional.

- **R1 — Rolls and tactical choices.** A new run starts with 50/50 health, 30 gold and 5 independent dice, each containing sword,sword,shield,heart,skull,blank. Each combat turn rolls all player and enemy dice, visibly tumbling and landing face-up. During the choice phase, lock/unlock individual player dice and reroll only unlocked dice, at most 2 times. Locked faces and enemy results remain unchanged during rerolls. Reject rerolling all-locked dice without spending a reroll. Finalizing ends that choice phase; the next turn resets locks and the reroll allowance. Use seeded uniform face sampling, not a canned result sequence. For repeatable traces use unsigned 32-bit xorshift with shifts 13,17,5, divide by 4294967296, and default seed 42; replace zero seed with 1. Modified dice sample all their actual faces uniformly.
- **R2 — Face effects and visible enemy intent.** Keep both sides' rolled faces visible before resolution. Effects add across each side. Ordinary attack is reduced by the opposing block and weaken totals, with minimum 0; piercing ignores those defenses. Apply healing to both sides first, capped at maximum health; apply player damage next; only a surviving enemy attacks. Clamp health to 0. Record actual health removed as turn damage and update the run's best single-roll damage. Show attack,block,heal,pierce,weaken and the resulting damage/healing visibly.

|Face|Effect|
|---|---|
|sword|3 attack|
|shield|3 block|
|heart|3 healing|
|skull|5 piercing special attack|
|blank|No effect|
|fire|6 attack|
|ice|2 attack and 2 weaken|
|guard|6 block|
|renew|6 healing|
|drain|2 piercing and 2 healing|
|inferno|8 attack; boss-only face|
|carapace|8 block; boss-only face|
|devour|4 attack and 4 healing; boss-only face|

- **R3 — Real face modifications.** Offer all 8 items below. A player chooses the target die. Replacements modify the first matching face; if none exists, reject the action without payment. Added faces increase the die's sampling space. Keep changes across encounters and show an inspectable list of every die's actual faces. Record collected items and their target dice. Loot offers one free item choice; shops sell items and a new standard die for 35 gold, up to 8 player dice. Reject unaffordable purchases, invalid targets and purchases outside a shop.

|Item ID|Modification|Shop cost|
|---|---|---|
|flame|sword → fire|18|
|frost|sword → ice|18|
|armor|blank → guard|16|
|healer|heart → renew|16|
|bone|blank → skull|20|
|vampire|skull → drain|14|
|lucky|blank → sword|12|
|ward|Append one shield face|15|

- **R4 — Enemies and boss.** Include the 6 ordinary enemy types and boss below, each with a distinct illustrated identity and the specified dice. Each enemy die samples its listed face array. Elite versions multiply maximum/current health by 1.6, rounded up, and add 1 die. Ordinary victories award 10 gold; elites award 20; the boss awards 40. Defeating an ordinary or elite encounter leads to loot; defeating the boss ends the run in victory. Death ends the run in defeat. Terminal outcomes cannot continue combat.

|Enemy ID|Health|Dice|Faces on each die|
|---|---|---|---|
|goblin|16|2|sword,sword,sword,blank,shield,blank|
|skeleton|20|3|sword,skull,blank,shield,blank,skull|
|witch|22|3|skull,heart,drain,blank,ice,shield|
|golem|30|3|shield,guard,sword,shield,blank,sword|
|slime|24|3|heart,heart,shield,sword,skull,blank|
|wraith|26|3|ice,skull,sword,blank,drain,shield|
|dragon|65|3|inferno,inferno,carapace,devour,skull,sword|

- **R5 — Branching run.** Use this connected map; each chosen row opens both choices on the next row after its encounter/room is completed. Unreachable and already visited nodes cannot be entered. Start with the first row available. Preserve health,gold,dice,equipment and statistics between nodes. Shops allow multiple affordable purchases before leaving. Rest heals up to 18 health once, then advances; skipping is allowed. After each non-boss victory offer 3 free equipment choices: take the item-ID order in the table above, start at visited-node count modulo 8, then offsets 0,2,4 modulo 8. The player may skip loot. Taking a reward or leaving advances the map.

|Row|Floor|Reachable choices|
|---|---|---|
|0|1|`goblin` combat or `slime` combat|
|1|1|`shop-1` or `rest-1`|
|2|2|`skeleton` combat or `witch` combat|
|3|2|`elite-golem` or `shop-2`|
|4|3|`wraith` combat or `rest-2`|
|5|3|`elite-witch` or `shop-3`|
|6|4|`boss` using dragon custom dice|

- **R6 — Complete flow and presentation.** Connect an illustrated title with tumbling dice, map, combat, loot, shops, rest and victory/death results without restarting. Results show floor reached,best single-roll damage,equipment collected and encounters won. Offer a fresh expedition that clears previous run state. Use coherent fantasy dice artwork,distinct face icons,enemy sprites,equipment illustrations,themed health/reroll/map/shop widgets,locked-die glow,roll animation and visible slash/shield/heal/damage feedback. At 1280 by 720, both combat trays,health bars,rerolls and action controls must be readable simultaneously. At 390 by 844 scrolling is allowed; long inventories may scroll at either size.
- **R7 — Testable simulation.** Export `DiceRun`, `FACES`, `STANDARD`, `ITEMS`, `ENEMIES`, `NODES`, `effects` from `game.js`. `new DiceRun(seed,scenario)` exposes `screen`, `phase`, `hp`, `maxHp`, `gold`, `dice`, `rolls`, `enemyRolls`, `enemy`, `rerolls`, `equipment`, `available`, `visited`, `current`, `floor`, `wins`, `bestDamage`, `result`, `loot`, `lastEffects`, and methods `start()`, `enter(id)`, `roll()`, `lock(index)`, `reroll()`, `resolve()`, `canEquip(item,index)`, `equip(item,index,source)`, `buyDie()`, `rest()`, `leave()`, `summary()`. A player roll has `face`, `index`, `locked`; enemy rolls are face IDs. Equipment source is `shop` or `loot`. Combat phases are `await-roll` and `choose`; screens are `title`, `map`, `combat`, `loot`, `shop`, `rest`, `result`. The UI uses this same engine. Acceptance can set independent health/roll fixtures to verify general face resolution rather than a scripted encounter.
- **R8 — Scenarios, controls and demos.** Support `?seed=` and deterministic `?scenario=combat` (initial goblin encounter), `?scenario=shop` (first shop,150 gold,32 health), `?scenario=loot` (first goblin defeated), `?scenario=near-victory` (boss at 6 health; player has 5 rolled swords,enemy has 3 rolled swords), and `?scenario=near-defeat` (goblin combat,player at 1 health with 5 blanks,enemy has 2 swords). Use visible `#start`, `#node-ID`, `#roll`, `#die-N`, `#reroll`, `#rerolls`, `#resolve`, `#player-dice`, `#enemy-dice`, `#enemy-hp`, `#enemy-preview`, `#hp`, `#gold`, `#floor`, `#dice-count`, `#selected-die`, `#buy-ITEM`, `#loot-ITEM`, `#buy-die`, `#faces-N`, `#continue`, `#rest`, `#status`, `#outcome`, `#result-floor`, `#best-damage`, `#wins`, `#item-count`, `#restart`, `#title`. Include 1–10 real input traces in `demo_outputs/`, indexed by `demos.json`, showing normal play,face modification and a terminal result. Traces have optional `scenario`, `duration_frames` up to 600 and ordered `events` with `frame`, `type`, pointer `x`, `y`, `button` or keyboard `keycode`. Playback is deterministic at 30 frames per second and 1280 by 720.
- **R9 — Full assessment.** Preserve the launch gate and all 18 criteria in `rubric.md`: mechanics 15%, content depth 35%, functional visuals 15%, presentation/art 35%. Automatic checks cover sampling,locks/limits,effects,actual equipment changes,enemy variety,branch legality,economy,run progression,results,UI and trace replay. Artistic quality,build diversity and animation polish require recorded review; passing functionality does not fill unreviewed scores.
