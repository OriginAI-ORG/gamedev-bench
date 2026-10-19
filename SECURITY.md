# Security boundaries

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

Preserve a local reproduction and the relevant version hashes for a vulnerability.
When a public repository is designated, report privately to its maintainers before
publishing an exploit that exposes credentials or compromises a host. No public
security inbox is configured in this local candidate.
