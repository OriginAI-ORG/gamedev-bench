# Changelog

## 1.0.0 — standalone repository — 2026-10-19

- Start local Git history for the standalone runner and 228-task source release.
- Preserve all authored English/Chinese prompts, reference implementations and acceptance scenarios from development 3.0.0.
- Set scored task and package metadata to 1.0.0; use release series `origin-gamedev-bench` to distinguish the old development 1.0.0.
- Keep model results, website code, production credentials and deployment state outside the repository.
- Run fresh hash-bound validation; retain the independent-model-baseline gate. Historical model scores are not relabeled.

The entries below describe the preceding development project, not tags in this repository.

## Development 3.0.0 — 2026-10-19

- Replace task directories, configurations, shared module paths and references with canonical `og-web-0001`–`og-web-0228` identifiers and OriginGameDevBench. No alias resolution remains.
- Reindex historical QA and model-result metadata while preserving execution dates, outcomes and unchanged playable code.
- Keep the reviewed bilingual task requirements and the English model input unchanged.
- Rerun cohort QA and archive checks; distribute only the current canonical source package.


## Development 2.0.0

- Individually reviewed and directly rewrote all 228 task contracts, references
  and acceptance; added matching Chinese companions while retaining English input.
- Restored reusable components, scene/resource configuration, live event paths,
  precise geometry, original assets where required and complete ten-game campaigns.
- Recorded task-level removed/replaced/added requirements and remaining differences;
  retained original complete-game rubric weights and unscored manual artistic items.
- Retired generation-based catalog maintenance. Frozen cohort validation now writes
  a separate receipt; old scores, signatures and generated specifications are superseded.
- Repaired local review resource loading within each isolated submission and added
  tests for module/JSON/audio loading and cross-package/UI blocking.
- Full-cohort QA passed 228/228: 1,240 private scenarios repeated three times,
  922 behavioral mutants, 912 rendering mutants and all public/starter checks.
  This is reference/verifier evidence, not a new model baseline or artistic score.

## Development 1.0.0 (candidate until release gates pass)

- Frozen candidate cohort: 228 executable adaptations, 39 source/family groups.
- Shared rendered-surface checks in public feedback, acceptance and fixture QA;
  regression mutations for transparent, clipped and covered game surfaces.
- Per-attempt native read/write confinement probes and protected task instructions.
- Replaced upstream raster artwork in 33 tasks with original reproducible fixtures;
  added background integrity checks, project license and per-task asset provenance.
- Complete allowlisted local source packaging with current QA hash gates and
  explicit candidate versus final-release status.
- Documented scoring, budgets, retries, scope, provenance and contribution rules.
- Reject invisible required objects, validate fractal geometry and minimap rotation,
  enforce battle-panel dimensions, and stop chase enemies at their target.
- Distinguish recovered transport reconnects from terminal generation failures.
- Correct private acceptance assumptions about unpublished IDs, text decoration,
  SVG serialization, coordinate origins and animation timing. Add contract-preserving
  implementation variants and wrong-color/stride regression cases.
- Reaccept unchanged submissions without model generation, preserve original scores
  and expose separate old/new evidence at `/reaccept` on the local progress server.

Final v1 remains gated on complete matching model-baseline evidence and disclosed AI technical
review. This file records implementation changes, not a claim those gates passed.
