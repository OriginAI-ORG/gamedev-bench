# Contributing

Develop and test locally. Do not commit credentials, personal configuration,
AGENTS.md files, session records, upstream clones, browser binaries or artifacts.
The allowlisted release script packages the project; it never uploads it.

A task change must include its English prompt.md, matching Chinese prompt_zh.md,
public interface, starter, independent
reference, private scenarios, public example, at least two behavioral mutations,
source attribution, media records and task-specific comparison in the review documents. Starters must
not embed a disabled reference algorithm or private expected geometry.

Run `npm test`, `npm run v1:qa -- --task TASK --concurrency 1`, and
`npm run v1:audit`. Any changed task, verifier, shared QA engine or dependency
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

Release checks: `npm run validate:tests`, `npm run isolation:check`,
`npm run v1:qa -- --concurrency 3 --resume`, `npm run v1:audit`,
`npm run release:check`. Final release additionally requires `npm run release:final`.
