# OriginGameDevBench

**Version 1.0.0 — first standalone source repository.** A local benchmark for
agents implementing browser game components and complete games: fresh starter →
public feedback → frozen submission → private acceptance.

**Media authorization review remains incomplete.** Code is Apache-2.0; bundled
media have separate terms, including restricted Bleed artwork and unresolved
permissions. Read the [media audit](docs/MEDIA-LICENSE-AUDIT.md) before redistributing
the complete collection. Source packaging is blocked while these gaps remain.

The fixed cohort is `og-web-0001` through `og-web-0228`, covering 42 concrete
families. English `prompt.md` is the task input; `prompt_zh.md` is its matching
Chinese translation. Internal pilots `og-web-9001` and `og-web-9002` are unscored.

This repository starts its own version history at 1.0.0 from development 3.0.0.
All 456 task prompt files are byte-identical to that source release. Version
metadata is updated and runtime validation is rerun in this repository. See
[repository identity and scope](docs/REPOSITORY-1.0.0.md).

This source release includes the runner, tasks, references and acceptance tools.
Public-site and admin-site applications, credentials and model results live in
separate projects. Tests do not require a Cloudflare account or a website database.

Reference/verifier QA is not a model score. There is no independent model baseline
for this new release series yet. `npm run release:final` still requires a complete
current baseline and a disclosed technical review; default source archives retain
the `release-candidate` label until those evidence gates pass.

## Quick start / 本机运行

Tested dependency set: Node.js 22.17.0, Python 3.11+, Playwright 1.64.0 and its
matching Chromium. Model runs additionally require an already authenticated local
Codex CLI with custom permission profiles and the Windows MXC sandbox.
Other platforms require separate runtime and isolation validation.

```powershell
npm.cmd ci --ignore-scripts
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $PWD '.browsers'
npx.cmd playwright install chromium
npm.cmd run doctor
npm.cmd test
npm.cmd run cohort:qa -- --tasks og-web-0011 --concurrency 1
```

Evaluate a supplied game without calling a model:

```powershell
npm.cmd run evaluate -- og-web-0011 E:\path\to\game
npm.cmd run report
npm.cmd run serve
```

The report listens on `http://127.0.0.1:8080/`. Ctrl+C stops it.
The evaluator serves static files; it never installs or builds a submission.

## Model development

```powershell
npm.cmd run isolation:check
npm.cmd run attempt -- run og-web-0011
npm.cmd run attempt -- prepare og-web-0011
npm.cmd run attempt -- reset ATTEMPT_ID
```

The adapter reuses the existing login and selected model preferences. Set
`BENCHMARK_MODEL` and `BENCHMARK_REASONING_EFFORT` for explicit overrides, or
`CODEX_BIN` for the executable. It does not copy credentials or personal config.
Calls use the model service and account quota; local execution is not fully offline.

Solver commands use a process-scoped permission profile: public task files and
feedback are readable; game, request and task-temporary directories are writable;
references, private verifiers, parent attempts and personal configuration are
denied. The same profile passes read/write probes before each model call.
Commands cannot use the network. Remote control, plugins, external apps, memory,
browser-control tools and subagents are disabled. Preflight failure stops the run.

`node bench.mjs test`, `observe`, and `submit` are the public task tools.
The first explicit submission is frozen. Later edits do not change it. A final
draft without `submit` is retained for diagnosis and cannot count as success.

## Full cohort and scoring

```powershell
npm.cmd run cohort:qa -- --concurrency 3 --resume
npm.cmd run cohort:audit
npm.cmd run cohort:plan -- --concurrency 1
npm.cmd run cohort:run -- --model MODEL_ID --effort high --concurrency 1
```

Replace `MODEL_ID` with the chosen exact model. Planning makes no model calls.
`--limit 10` selects a development subset; its score is not the complete baseline.
`--resume BATCH_PATH` preserves earlier evidence and only resumes matching task,
model, effort and harness versions. Results are in `artifacts/batches/`.
To watch a running batch, use `node scripts/progress.mjs BATCH_PATH` and open
`http://127.0.0.1:8081/`. This read-only local view refreshes every five seconds;
closing the page does not stop the model batch. The batch's static `index.html`
is updated when the runner exits, so use the live view during execution.
Open `/review` on the same local server to play completed model submissions,
inspect task instructions and acceptance screenshots/videos, and save human
review annotations. Games run in a separate origin and a sandboxed iframe.
Review revisions are stored in `BATCH_PATH/human-reviews/`, bound to the attempt,
task and submission hashes. They do not overwrite automated scores or constitute
the technical release sign-off. Closing the page does not stop the model batch.
Open `/reaccept` to compare original and corrected acceptance results for the
same frozen submissions, including both sets of screenshots and recordings.
`node scripts/reaccept.mjs prepare BATCH_PATH` snapshots the old verifier;
`node scripts/reaccept.mjs run REACCEPT_PATH` evaluates existing submissions
without model calls and resumes completed checks after interruption. Original
batch scores stay unchanged. See [acceptance errata](docs/ACCEPTANCE-ERRATA-2026-10-15.md).
To continue unfinished tasks after a completed reacceptance, run
`node scripts/continue-reaccepted.mjs REACCEPT_PATH 2`. It verifies the frozen
submissions and corrected verdicts, creates a separate diagnostic continuation,
and prints its batch path. Repeating it reuses that same continuation. Start it
with `node scripts/cohort/batch.mjs --execute --resume NEW_BATCH_PATH --model MODEL_ID
--effort high --concurrency 2`, preserving the original model and effort.
Finished tasks, including retained failures, are excluded from model generation.
For the diagnostic continuation, `node scripts/elastic-batch.mjs BATCH_PATH 8`
runs up to eight tasks. After it starts, change `BATCH_PATH/control.json` to
`{"concurrency": 6}` (1–8) to resize the pool without stopping the controller;
lowering the value lets running tasks finish. Never kill the legacy controller
to resize it on Windows: its child processes can terminate with it. An interrupted
model session needs a new attempt and may incur additional usage; completed tasks
remain excluded. Concurrency alone does not guarantee a completion deadline.
After a full batch completes, run `node scripts/export-baseline.mjs BATCH_PATH`
to produce the sanitized baseline. It rejects subsets, incomplete isolation,
changed task versions and changed harnesses.

If the runner itself needed repairs, `--resume BATCH_PATH
--diagnostic-continuation` can continue unfinished tasks while retaining earlier
results for inspection. Each phase records its runtime hashes; both local panels
label the mixed batch as diagnostic. It cannot be exported as the formal baseline.
Without that flag, changed harnesses still block normal resume. Task or verifier
changes always require a new batch. An interrupted task starts in a fresh workspace
and model context; completed tasks, including failures, are not regenerated.

Primary budgets are 1,200 seconds generation and 180 seconds acceptance. The
adapter also stops at 30 observed tools, with the event-stream dispatch limitation
documented in [PROTOCOL](docs/PROTOCOL.md). Report task pass@1 and family macro score.
The exact per-task budget is authoritative. These Web adaptations cannot be
compared directly with upstream scores or historical legacy-webgame 1.0 results.

QA checks each reference three times, public feedback, behavioral mutations,
transparent/clipped/covered surface mutations, and starter rejection. It records
task/shared-engine hashes and invalidates changed files. QA is not model performance,
expert certification or an aesthetic-quality assessment.

## Source archive and release checks

```powershell
npm.cmd run validate:tests
npm.cmd run isolation:check
npm.cmd run cohort:qa -- --concurrency 3 --resume
npm.cmd run cohort:audit
npm.cmd run release:check
python -B scripts/audit-media-licenses.py --require-cleared
python -B scripts/package_release.py
node scripts/package-smoke.mjs
```

The archive includes taskkits, the canonical cohort manifest, licenses and sanitized
validation receipts. It excludes personal configuration, AGENTS.md, sessions,
trajectories, upstream clones, installed runtimes and obsolete remote-deploy scripts.
It is created locally and is not uploaded. Run the quick start in the extracted
directory to verify an independent install. The smoke command uses the local npm
cache and matching installed Chromium, and tests three representative task entry paths;
it is not a new-machine browser-download test. Set `NPM_CLI` to `npm-cli.js` if
Node and npm are installed separately. Upstream clones are not needed to run
or audit the supplied tasks.

`npm run release:final` additionally checks current disclosed technical-review sign-off and a complete
isolated baseline. Only after it passes use `python -B scripts/package_release.py
--final`. Candidate archives are labeled `release-candidate` in their manifest.

## Layout and direct editing

- `tasks/`: prompts, starters, references, public/private checks, negatives and rights.
- `taskkits/OriginGameDevBench/`: directly authored supplied runtimes and verifier helpers.
- `core/`, `agents/`, `environments/`, `runner/`: lifecycle, solver and acceptance.
- `validation/`: portable test/QA/isolation receipts; `artifacts/`: local run evidence.
- `configs/source-index.json`: catalog source commits; `configs/upstream-lock.json`: helper sources.

Edit each task directly. `prompt.md` is the English solver input;
`prompt_zh.md` is its Chinese companion and is not staged as the task input.
Legacy task builders are retired. The audit validates content and writes only
`validation/task-audit.json`; it cannot rewrite prompts or remove failing tasks.
After editing a task, run QA and the audit. Historical pre-revision specifications remain in the original local project
backup; they are not included in this standalone source repository.
Per-task review tables record removals, substitutions, additions and remaining
equivalence limits. Fixed APIs and deterministic campaigns constrain some design
freedom; restoring core mechanisms does not prove equal empirical difficulty.

## License and contribution

Project code and directly authored task adaptations use [Apache-2.0](LICENSE).
Retained media keep their recorded source terms; no blanket media-license claim is made.
See [NOTICE](NOTICE), [third-party notices](THIRD_PARTY_NOTICES.md), per-task
provenance and `configs/task-licenses.json`. Model trajectories have separate
authorization requirements and are excluded from source releases.

The current [media audit](docs/MEDIA-LICENSE-AUDIT.md) supplements historical
per-task records with verified font and original-project license evidence and
lists unresolved files. Technical QA does not clear media permissions. Keep the
notices in `vendor/licenses/` with the assets.

See [CONTRIBUTING](CONTRIBUTING.md), [SECURITY](SECURITY.md),
[CHANGELOG](CHANGELOG.md), and [CITATION.cff](CITATION.cff).
Maintainers: see [open-source maintenance](docs/OPEN-SOURCE-MAINTENANCE.md).
