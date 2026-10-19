# Standalone repository 1.0.0

The 2026-10-19 local split starts the `origin-gamedev-bench` release series at
1.0.0. Its predecessor is development 3.0.0, source archive SHA-256
`dc850c8eac25f88388384e3f58c41fa2f8c5336513e8f1892b7576b0d988f50b`.
The exact source manifest is retained in local import evidence; the public split
receipt records the unchanged bilingual prompt hashes.

## Scope and identity

- 228 scored tasks, 42 concrete families, canonical `og-web-*` IDs.
- Runner, environment, references, private acceptance, public checks, licenses and
  task-review documentation are source-controlled. Solver workspaces receive only
  public task inputs; the model must not receive this entire evaluation repository.
- `validation/` contains current validation evidence, never model leaderboard scores.
- Source-control Git contains no installed dependencies, browser binaries, model
  attempts, website applications, credentials, personal configuration or uploads.
- Deployment histories, historical model data and the old combined project are
  not Git history of this new repository.

A benchmark release must be identified by release series + version + content
hash/commit. Historical development 1.0.0 and standalone 1.0.0 are different
releases even though their version strings match. No old model record is rewritten
to claim execution on this repository. The old task-review documents retain their
original dates and explicitly historical development-version context.

## Local testing copies

Use `bench-test/<version>/<model>/<run-id>/bench` for a separate checkout per run.
For example, from the common parent directory after the local tag exists:

```powershell
git clone --no-hardlinks --branch v1.0.0 ./origin-gamedev-bench ./bench-test/1.0.0/gpt-6-astra/RUN_ID/bench
```

Install locked dependencies and Chromium in that copy, then follow README's local
run commands. Each copy writes only its own attempts and artifacts. Model calls
require an explicitly selected model and an authorized local CLI account.

## Website boundary

`bench-admin-site` owns future private imports, experiments, review and acceptance.
`game-benchmark-site` consumes approved immutable snapshots. They use separate
D1 databases and separate R2 buckets; no cloud resource is needed to run this bench.
Publishing and model evaluation are separate operations. This split performs no
Cloudflare upload, cloud provisioning, remote Git push or model generation.

Source archives use the package version. A 1.0.0 source tag does not imply that
the independent model-baseline release gate has passed. Validation receipts and
their scopes disclose what was actually executed.
