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

## Website boundary — updated decision, 2026-10-19

`bench-admin-site` owns future imports, experiments, review, acceptance and snapshot
export. The admin and `game-benchmark-site` share one D1 database and one R2 bucket
per environment; the admin maintains the shared migration chain. After approval,
only the admin exports immutable snapshots. The public site consumes published
exports through the backend public read-only interface, with field/artifact and
publication-state checks. Export does not automatically publish a snapshot.

This replaces the initial split's separate-store plan. Shared storage wiring and
export services are still future work; existing local bindings have not changed.
The benchmark runner itself still needs no Cloudflare account or website database.
Publishing and model evaluation remain separate operations. This documentation
update performs no cloud provisioning/upload, remote Git push or benchmark model run.
The frozen v1.0.0 tag, source archives and validation receipts retain their original
bytes and historical design; current documentation records this later decision.

Source archives use the package version. A 1.0.0 source tag does not imply that
the independent model-baseline release gate has passed. Validation receipts and
their scopes disclose what was actually executed.
