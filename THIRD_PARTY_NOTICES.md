# Third-party sources and modifications

Project code, task adaptations and project-generated fixtures are Apache-2.0.
See `LICENSE` and `NOTICE`. The original upstream projects retain their copyright.

| Source | Included work | License evidence |
|---|---|---|
| [GameDevBench](https://github.com/waynchi/gamedevbench) | Adapted instructions/test geometry and selected `ValidationResult` helper | `vendor/gamedevbench.LICENSE` |
| [GameCraft-Bench](https://github.com/FreedomIntelligence/gamecraft-bench) | Scoped task adaptations and selected arithmetic formula parser | `vendor/gamecraft-bench.LICENSE` |
| [Analog Design Bench](https://github.com/Arcadia-1/analog-design-bench) | Selected `write_results` software helper only | `vendor/analog-design-bench.LICENSE` |

Helper origins, commits, original/modified hashes and retained symbols are recorded
in `configs/upstream-lock.json`. Catalog source commits are separately recorded in
`configs/source-index.json`. Every task records its source identifier and scope
changes in `provenance.json`; asset records are in `assets.json` and the aggregate
`configs/task-licenses.json`.

Version 2.0 replaces source-runtime operations with browser interfaces while
restoring component obligations and complete-game systems. Per-task comparisons
describe remaining scope and workflow differences. Several tasks retain source
images, sounds and fonts, including all 33 collectible-overlay tasks; the previous
claim that no original image pixels were included no longer applies.

Retained media are identified and hashed in each assets.json. The sprite artwork
by Bleed retains its supplied custom license and attribution. Where an archive
contains only the repository license and no separate media license, that limitation
is recorded without inventing broader rights. Optional generated game atlases have
their prompt records in docs/art-generation-prompts.md. The 3.0.0 identity migration does not change the recorded media origins.

Analog's separately licensed non-software task dataset is excluded. The complete
upstream repositories, unselected datasets, their results, model logins and remote-control
components are excluded from the release archive. The three result helper formats
are exports of one acceptance result, not independent judges or voting systems.

Playwright and playwright-core use Apache-2.0. Chromium and FFmpeg are installed
separately with the license notices included in their distributions; their binaries
are not included in the project archive. No model trajectory redistribution or
training rights are implied by this source-code license.
