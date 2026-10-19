# Potion Shop assessment

BUILD requires a clean local browser launch without fatal errors. Score = BUILD × (0.15 mean(M1–M5) +0.35 mean(D1–D5) +0.15 mean(V1–V3) +0.35 mean(A1–A5)). Retain all18 criteria,scored0–1 with evidence. Automated functional passing does not assign unreviewed artistic values;those remain null.

|ID|Criterion|Evidence / aggregation|
|---|---|---|
|M1|Choose ingredients at the cauldron,combine by recipe,and add the resulting potion to shelves;known recipes show requirements.|All recipes,real consumption,brew timing,capacity,quality and live discovery; maximum. Missing brewing/combination/crafting scores0.|
|M2|Customers enter with visible ailments,browse,buy matching potions for gold,or leave unhappy.|Automatic arrivals,browsing,patience,sales,wrong recommendation and stockout tests; maximum. Missing customers/ailments/payment scores0.|
|M3|Player-set prices affect sales and satisfaction;lower prices change customer volume.|Actual waiting-customer repricing,budget/quality limits and low/base/high traffic/sales comparisons; maximum. Missing/effectless pricing scores0.|
|M4|Finite ingredients are consumed and bought from a supplier;gold tracks revenue and spending.|Atomic affordability,exact restock/book/upgrade costs and complete-week accounting; maximum. Infinite ingredients,free restocks or no economy scores0.|
|M5|Connected title→brew/sell/restock→daily report→next day loop with reputation and weekly results.|Legal seven-day business,UI report transitions,reset and real traces; maximum. Missing transitions/day cycle scores0.|
|D1|At least4 potions with distinct sprites,recipes and demand:heal,cure,buff,antidote.|Recipe/customer tables and manual sprite review; maximum. Fewer than3 or visually identical potions scores0.|
|D2|At least5 illustrated ingredients with different uses and common/rare price tiers.|Independent inventory,consumption,freshness,prices and asset review; maximum. Fewer than3 or identical ingredients scores0.|
|D3|At least3 customer types vary in ailments,budget,patience and appearance.|Four actual customer configurations,automatic behavior and portraits; maximum. Identical people or a single need scores0.|
|D4|At least3 real shop upgrades improve capacity or efficiency.|Four purchases;capacity12,half brew time,fresh garden output and decor reputation checks; maximum. No improvement scores0.|
|D5|Recipes are discovered by experimenting or purchasing books and collection grows.|Unknown matching-pair discovery,books,repeat guards and live journal update; maximum. All initially known or no discovery scores0.|
|V1|Gold,reputation,ingredients,potions and day/time are readable without overlap.|Desktop/narrow HUD/inventory checks and manual readability; maximum. Missing money/reputation/inventory scores0.|
|V2|Distinct visible cauldron,shelves,cabinet,counter and customers.|Shop-area layout and illustration review; maximum. Indistinguishable zones or invisible customers scores0.|
|V3|Brewing animation,bottle creation,purchases/disappointment,restocking and prices show visible feedback.|Live brewing/supplier/prices and input recordings; maximum. Silent actions score0.|
|A1|Coherent warm,rich magical apothecary style across interior,potions,ingredients,customers,cauldron and UI.|Manual; mean. Incompatible/default styles score0.|
|A2|Recognizable illustrated vials,herbs,crystals and mushrooms with distinct identities.|Manual; mean. Plain colored shapes score0.|
|A3|Illustrated shelves,wood,herbs,lighting and detailed cauldron form a real shop interior.|Manual; mean. Flat colored background scores0.|
|A4|Themed illustrated recipe cards,handwritten-style prices and shelf/wood menus.|Manual; mean. Unstyled primary UI scores0.|
|A5|Bubbles,glowing potions,walking/browsing customers,sparkling ingredients and ambient magic.|Manual motion review; mean. Entirely static scenes score0.|

Applicable original authored-art full-credit requirements remain:plain programmatic shapes,solid fills,untextured geometry,default widgets and text/color-only variants cap the relevant score at0.5. Optional supplied art does not automatically earn full marks. Fixed recipes,quality/price/traffic formulas,discard controls,upgrades,timing and public interfaces are reproducibility additions. Full restored systems and weights do not prove identical creative difficulty or interchangeable platform scores. The source does not explicitly require daily narrative events;none is fabricated as a missing requirement.
