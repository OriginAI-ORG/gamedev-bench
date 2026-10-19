# Security boundaries

## Private reports

Use [GitHub private vulnerability reporting](https://github.com/OriginAI-ORG/gamedev-bench/security/advisories/new)
(**Security → Advisories → Report a vulnerability**). A GitHub login is required.
Private reporting is enabled. Do not post exploitable vulnerabilities, credentials,
personal configuration or model conversations in a public Issue or PR.
If the form is unavailable, open an Issue requesting restoration of the private
channel without any vulnerability details; wait for a private channel to report.

Include the commit/release, OS and dependency versions, affected task or boundary,
minimal sanitized reproduction, expected/actual behavior and impact. Keep local
evidence and hashes; share only what is necessary. Do not attach live credentials.

Maintainers assess reports on current `main` and the latest source release series
(currently 1.0.0), coordinate fixes/disclosure with the reporter and identify affected
versions in advisories. Older development snapshots have no promised backports.
Response times are best effort; no SLA or bounty is offered.

## Execution boundaries

This is a local benchmark harness. Use the native restricted permission profile
and the per-attempt preflight; never disable confinement to obtain a score.
References, private tests, prior attempts and personal configuration must not be
readable by solver commands. The benchmark host retains the existing login;
credentials are neither staged in task workspaces nor included in release archives.

The supported tested model-run host is Windows with the Codex MXC sandbox.
Other platforms require their own successful isolation and runtime validation.
Browser execution is headless, local, sandboxed and restricted to the submission
origin. Submissions are served as static files; dependency/build scripts are not run.
The harness is not an untrusted multi-tenant hosting service.

Coordinate disclosure through the private report so users can receive a fix or
mitigation before exploit details are published.
