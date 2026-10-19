# Third-party sources and modifications

The 2026-10-19 [media audit](docs/MEDIA-LICENSE-AUDIT.md) and
`configs/media-license-evidence.json` supplement the original per-task records.
They identify exact reviewed hashes and outstanding permission gaps. The complete
media collection is not uniformly Apache-2.0 or cleared for release.

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

## Additional media notices verified on 2026-10-19

| Material | Attribution and license | Evidence shipped here |
|---|---|---|
| Crusader frames and atlases | Bleed - http://remusprites.carbonmade.com/; Copyright 2017 Remos Turcuman; custom terms | `vendor/licenses/Bleed.txt` and original task `assets/License.txt` files |
| Poppins Medium 4.004 | Copyright 2020 The Poppins Project Authors (https://github.com/itfoundry/Poppins); OFL-1.1 | Embedded font metadata and `vendor/licenses/Poppins-OFL-1.1.txt` |
| Roboto Medium 2.137 (2017) | Copyright 2011 Google Inc. All Rights Reserved.; Apache-2.0 | Embedded font metadata and `vendor/licenses/Roboto-Apache-2.0.txt` |
| Early GameBoy 1.0 | Copyright LDEJRuff 2012; CC-BY-SA-3.0 | Embedded font metadata and `vendor/licenses/Early-GameBoy-NOTICE.txt` |
| Ninja lower/upper sprite sheets | Copyright (c) 2025 Heart Gamedev LLC; MIT | Matching original-project blobs and `vendor/licenses/ninja-platformer-MIT.txt` |
| Fists of Fury player/player_knife sheets | Copyright (c) 2025 Nicolas Bize; MIT | Matching original-project blobs and `vendor/licenses/fists-of-fury-MIT.txt` |

The Bleed license permits distribution and project use subject to its terms, but
prohibits sublicensing and resale of the assets (even modified), and contains use
restrictions. It is not Apache-2.0 or unrestricted open-source art. OFL fonts remain
OFL; Early GameBoy font adaptations retain the applicable share-alike obligations.
These terms do not relicense the benchmark code. Reviewed font/sprite bytes are
unchanged by this preparation update.

For an isolated task export, copy its relevant license text and attribution from
this section and `vendor/licenses/` alongside the assets. Keep original notices.
Full source archives include this directory automatically.
