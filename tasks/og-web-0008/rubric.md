# Kingdom Cards assessment

BUILD gates a clean local browser launch without fatal errors. Score = BUILD × (0.15 mean(M1–M5) +0.35 mean(D1–D5) +0.15 mean(V1–V3) +0.35 mean(A1–A5)). All18 source criteria remain,each scored0–1 with evidence. Automatic functional passing does not fill unreviewed artistic values;those stay null.

|ID|Criterion|Evidence / aggregation|
|---|---|---|
|M1|Real deck draws into hand;clicking plays cards,applies effects and removes them;subsequent turns draw again.|Card identity,seeded piles,play limits,costs,keep/discard/reshuffle tests and real UI; maximum. Missing draw/play/effects scores0.|
|M2|Farms,markets and barracks visibly appear on holdings,produce food/gold/troops and support spending.|Exact construction costs,local defense,income and building-art checks; maximum. No map structure,production or accumulation scores0.|
|M3|Attack cards spend actual troops and resolve against defense,changing territory or losing troops.|Strict threshold,commitment,casualty,capture and history tests; maximum. Missing attack,resolution or ownership change scores0.|
|M4|Choose unplayed cards to permanently trash;deck size changes and future draws exclude them.|Keep/trash disjointness,twenty-turn conservation and visible removal; maximum. No deck thinning scores0.|
|M5|Title→campaign turns→victory/defeat→new game;all territory wins,no territory loses.|Three legal complete campaigns,terminal fixtures,history review and restart; maximum. Missing flow or unreachable endings scores0.|
|D1|At least4 card categories with at least2 different cost/effect cards per category.|Build/recruit/attack/diplomacy tables,actual effects and manual distinct-art review; maximum. Fewer than3 categories or identical variants scores0.|
|D2|At least4 holdings with different yields,strategic positions and visible ownership.|Six-territory adjacency/yield/ownership tests and map review; maximum. Fewer than3 or identical holdings scores0.|
|D3|At least2 AI kingdoms actively play cards,expand and attack,with visible growth.|Real rival hand consumption,build/recruit/expansion,simultaneous contested capture and tie tests; maximum. Missing/passive opponents scores0.|
|D4|Buildings and victories permanently add stronger cards,creating power progression.|Fresh card IDs,acquisition counts,harvest/tax/veteran/siege effects and legal full runs; maximum. Fixed deck or no acquisition scores0.|
|D5|Truces,trade and betrayal have real mechanical consequences.|Two-way peace,duration,economy transfers,affordability and conditional betrayal; maximum. No meaningful diplomacy scores0.|
|V1|Hand,gold,food,troops,deck size and turn appear clearly without overlap.|Desktop/narrow layout and live UI checks; maximum. Missing hand/resources/deck info scores0.|
|V2|Map clearly shows ownership colors,structures and rivals;cards show type,cost,effect.|Map/card visibility and manual readability review; maximum. Indistinguishable holdings or unreadable cards scores0.|
|V3|Card actions visibly change buildings,resources,battles,trash and ownership.|Live cards,diplomacy,results,history and input demos; maximum. No observable feedback scores0.|
|A1|Coherent parchment-and-ink medieval visual language across cards,map,UI and effects.|Manual; mean. Incompatible/default styles score0.|
|A2|Illustrated decree cards with thematic frames,icons and different category treatments.|Manual; mean. Plain unstyled text boxes score0.|
|A3|Illustrated terrain,castles,farms and borders resemble medieval cartography.|Manual; mean. Plain colored regions/flat grid scores0.|
|A4|Themed resource icons,wax-seal turn controls and parchment menus.|Manual; mean. Unstyled UI scores0.|
|A5|Animated card plays,combat,captures,buildings and turns;ambient flags/chimneys enliven the map.|Manual motion review; mean. Entirely instantaneous/static changes score0.|

Applicable original authored-art conditions remain:programmatic shapes,solid fills,untextured geometry,default controls and color/text-only variants cap the relevant criteria at0.5. Supplying optional art does not earn automatic full marks. Fixed card/map/economy values,precise simultaneous-resolution policy and public interfaces are reproducibility additions;retained systems/weights do not establish identical difficulty or interchangeable source-platform scores. The hand rule explicitly allows keeping cards plus up to5 fresh draws,with no artificial card duplication when piles are exhausted.
