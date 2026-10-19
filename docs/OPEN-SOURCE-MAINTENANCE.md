# Open-source maintenance

Repository: https://github.com/OriginAI-ORG/gamedev-bench

## Issues and contributions

Use the bug, task/scoring proposal, or license-evidence Issue forms. Confirm the
reported version and task before triage. Ask for a minimal reproduction, preserve
failed evidence, and link duplicate reports to the original. Use a PR to review
code changes; an Issue itself is closed, not merged. A `Fixes #N` reference closes
the linked issue when the PR is merged into the default branch.

Review contributions and run appropriate checks locally. Attach sanitized command
results to the PR. New tasks and changes to scoring require a documented contract,
reference, negative cases, rights evidence and a version/comparability decision.
Do not run paid model evaluations automatically for outside contributions.

## Repository settings

Verified on 2026-10-19:

- [Protect main history](https://github.com/OriginAI-ORG/gamedev-bench/rules/25376648)
  is active: deletion and non-fast-forward pushes to `main` are blocked, with no
  bypass actors. The intended configuration is in `.github/main-ruleset.json`.
- Normal fast-forward pushes and maintainer merges remain possible. The current
  single-maintainer policy does not require another person's approval or hosted
  CI status checks. Review via PR is the documented contribution workflow.
- [Private vulnerability reporting](https://github.com/OriginAI-ORG/gamedev-bench/security/advisories/new)
  is enabled. See `SECURITY.md` for reporting and disclosure handling.

Settings are server-side; the JSON file does not enforce rules by itself. Admins
can verify current state with `gh api repos/OriginAI-ORG/gamedev-bench/rules/branches/main`
and `gh api repos/OriginAI-ORG/gamedev-bench/private-vulnerability-reporting`.
Store credentials in local credential storage, never in the repository.

## Releases and citations

1. Resolve the outstanding permissions in [the media audit](MEDIA-LICENSE-AUDIT.md).
   Check with `python -B scripts/audit-media-licenses.py --require-cleared`.
   An unresolved file blocks packaging; a recorded license still has obligations.
2. Run the local technical checks in `CONTRIBUTING.md`. A documentation-only
   update does not create new task or model-performance evidence.
3. For a source candidate, clearly describe its scope and missing model/review
   gates, and mark any GitHub Release as a prerelease. Package with
   `python -B scripts/package_release.py` only after the media gate passes.
4. For a validated-baseline release, require a complete isolated baseline bound
   to current task/harness hashes, disclosed technical review, archive smoke
   evidence, `npm run release:final`, and packaging with `--final`.
5. Assign a new immutable tag/version for changed release content. Do not move
   the historical `v1.0.0` tag or overwrite an existing archive to disguise a
   correction. Update CHANGELOG and CITATION together with the chosen version.
6. Record the repository commit, release series/version and archive SHA-256.
   Publish only approved source/validation artifacts. Model conversations,
   personal configuration and credentials are excluded. A release upload is a
   separate explicit maintainer action; none is performed by local packaging.

Task or verifier changes invalidate prior evidence for the affected scope.
Keep old and corrected scores distinguishable. Report model ID, effort, budgets,
task version, environment, failures and score aggregation with each result.
A QA pass is not a model score, license certification or independent peer review.

`CITATION.cff` identifies the 1.0.0 source series. Cite the exact commit as well;
current `main` documentation may be newer than that frozen source tag. A DOI can
be added if an archival release is explicitly arranged later; none is claimed.
