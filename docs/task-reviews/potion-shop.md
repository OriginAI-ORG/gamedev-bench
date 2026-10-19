# Potion Shop — 2.0.0 review

The original instruction and all 18 weighted rubric criteria were compared with the previous Web package. The old two-recipe, two-customer slice was not equivalent to the requested shop simulation.

| Change | Previous adaptation | Repaired requirement and acceptance |
| --- | --- | --- |
| Removed | Morning/afternoon/evening and week progression | Seven actual days, sales deadlines, daily ledgers and a final aggregate. A legal complete week brews and sells 51 bottles, buys stock and all four upgrades. |
| Removed | Ingredient freshness and operation-dependent quality | Five finite ingredient types, oldest-lot consumption, three temperatures, stirring, timed brewing, bounded quality, daily aging and expiry. Independent boundary tests verify ingredients are consumed once and occupied/full stations reject brewing. |
| Replaced | Recipe experimentation and books became two fixed buttons | Four recipes, unknown-recipe discovery from successful mixtures and paid recipe books. Invalid pairs waste ingredients; discovery is recorded only once. |
| Replaced | Autonomous customers became a manual customer button | Four illustrated customer types with distinct requests, budgets and patience; timed arrival, browsing, automatic purchase and unhappy departures. Wrong offers and repeated purchases are independently rejected. |
| Removed | Pricing, reputation and demand feedback | Editable per-potion prices, quality-adjusted affordability, reputation changes and traffic calculated when opening. Tests compare cheap/fair/expensive prices and quality boundaries. |
| Removed | Restocking, rare materials and functional upgrades | Paid evening supplies and four one-time upgrades: capacity, brew speed, next-day garden supplies and reputation. Check funds, duplicate purchase, timing and actual effects. |
| Removed | Coherent shop areas, polish and complete scoring | Illustrated shop/ingredients/potions/customers, recipe journal, progress and feedback, daily/week review. All original category weights remain 15/35/15/35. Artistic criteria require a recorded review and remain unscored until then. |
| Replaced | Native launch and recordings | Browser entry and three playable input traces exercising brewing/sales, purchases/upgrades and the week result. |
| Added | No exact original formulas | Published recipes, prices, timing, aging, discard controls, state interfaces and deterministic scenarios. These constrain open-ended balancing and are disclosed additions. |

The old provenance said daily events had been removed, but the source does not explicitly require such a system. No daily narrative-event requirement was invented. Optional generated artwork substitutes for unavailable mounted asset libraries. A browser implementation cannot preserve native-editor workflow, and fixed balancing reduces some design freedom; identical empirical difficulty and interchangeable scores are not claimed.

Staged validation passed all 11 scenarios with three reference repetitions, six behavioral mutants, four rendering mutants, starter rejection, the public example and three real input demos. The complete-week test uses actual brewing, automatic sales, stock purchases and every upgrade without directly rewriting campaign state. The final cohort audit records current task and harness hashes.
