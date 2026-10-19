# Contributing

Use [Issues](https://github.com/OriginAI-ORG/gamedev-bench/issues) for bugs,
task proposals and license evidence. English and Chinese reports are welcome.
Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

Create a local branch (or fork) and open a focused pull request against `main`.
Describe the problem, changed behavior, task IDs and local validation. Use
`Fixes #123` only for an issue fully resolved by the PR. Maintainers review
correctness, evidence and licensing before merging; proposals may be declined.

Develop and test locally. Do not commit credentials, personal configuration,
AGENTS.md files, session records, upstream clones, browser binaries or artifacts.
The allowlisted release script packages the project; it never uploads it.

A task change must include its English prompt.md, matching Chinese prompt_zh.md,
public interface, starter, independent
reference, private scenarios, public example, at least two behavioral mutations,
source attribution, media records and task-specific comparison in the review documents. Starters must
not embed a disabled reference algorithm or private expected geometry.

Run `npm test`, `npm run cohort:qa -- --tasks TASK --concurrency 1`, and
`npm run cohort:audit` for task changes. Replace TASK with an actual task ID.
Documentation-only changes need link/command checks rather than a model run.
Any changed task, verifier, shared QA engine or dependency
invalidates its old evidence. A new task/version also invalidates prior model
results for that scope. Keep failed evidence; do not overwrite it with a success.

Reviewers compare task requirements with scenario assertions, replay the reference,
inspect public feedback and negative cases, and examine whether a simpler incorrect
implementation could pass. Review every family and inspect variant-specific rules.
Record source comparison and unresolved equivalence limitations in the review documents.
Solver prompts use browser terminology and state required behavior directly.
Author task content directly; retired generators must not overwrite reviewed files.
The fixed cohort stays in configs/OriginGameDevBench.json; audit writes only its separate
validation/task-audit.json receipt and cannot filter out failures.

## Contribution rights

Submit work you authored or have permission to contribute. Intentionally submitted
original code contributions use Apache-2.0 as described in section 5 of LICENSE.
Identify third-party material separately and retain its original license and
copyright. No separate CLA or signed-off-by requirement is currently imposed.

For media, include author/source, matching file hash, exact license, redistribution
permission, modifications and credit. An upstream benchmark's code license alone
does not establish rights to its bundled media. Read the
[media audit](docs/MEDIA-LICENSE-AUDIT.md), update
`configs/media-license-evidence.json` after reviewing evidence, then run
`python -B scripts/audit-media-licenses.py --write` and verify by running it without
`--write`. Unlisted media remain unresolved automatically.

## Validation and releases

Record local checks and unresolved failures in the PR template. There is no
required hosted CI or automated model evaluation. Review contribution scripts
before running them with access to personal accounts.

Release checks: `npm run validate:tests`, `npm run isolation:check`,
`npm run cohort:qa -- --concurrency 3 --resume`, `npm run cohort:audit`, and
`npm run release:check`. These technical checks do not establish license clearance.
Source packaging also requires
`python -B scripts/audit-media-licenses.py --require-cleared`.
Final release additionally requires `npm run release:final` and a complete,
matching model baseline. Follow the [release guide](docs/OPEN-SOURCE-MAINTENANCE.md).
