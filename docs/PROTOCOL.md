# OriginGameDevBench 1.0.0 protocol

The frozen cohort contains 228 Web tasks: 10 complete-game tasks
and 218 component tasks. Another 245 source entries and the
two original pilot tasks are outside this revision and every score denominator.
All scored tasks are version 1.0.0 in the standalone origin-gamedev-bench release series. English `prompt.md` remains the solver input;
`prompt_zh.md` is the corresponding translation. Prior results are invalid for this version.

## What is measured

An agent implements browser game components or complete campaigns in a supplied
starter. Published browser interfaces allow the verifier to replay inputs and
inspect outputs. Functional QA does not automatically award artistic scores.
Parameter variants remain separate tasks but are also grouped into families.
Adapted scores are not directly comparable with either upstream leaderboard.

The collectible-overlay tasks preserve the original image content and precise
alignment requirements. Other tasks document their individual retained media or
substitutions in assets.json. The ten complete-game tasks retain their source
rubric categories and weights; manual aesthetic criteria remain null until reviewed.
Fixed APIs, data, levels and numerical rules improve reproducibility but constrain
some original design freedom. Native editor work becomes browser engineering.
These differences are documented per task; empirical equal difficulty is unproven.

The task list is fixed in configs/OriginGameDevBench.json. Validation writes a separate
hash-bound receipt in validation/task-audit.json. A missing, stale or failing
receipt blocks formal runs; it never silently removes a task from the denominator.

## One attempt

1. Create a fresh workspace from the hashed public task and a new ephemeral model session.
2. Require the native sandbox preflight to permit public reads and game/request writes,
   deny reads of references, private verifiers and the parent attempt, deny parent
   listing/writes, and deny writes to the public instruction. Use the same permission
   profile for the model. Unsupported hosts stop before a model call.
3. Permit local editing plus public `test`, `observe`, and `submit` tools. Commands
   have network access disabled. Plugins, external apps, memory, remote control,
   browser automation tools, and subagents are disabled for the solver.
4. Freeze the first explicit submission and its SHA-256 digest. A timeout or missing
   submission is an unsuccessful attempt; a retained final draft is diagnostic only.
5. Run private acceptance in a separate process, with a fresh browser context per
   scenario, blocked external requests and WebSockets, and screenshots/video.
6. Require every functional scenario and the shared rendered-surface check to pass.
   Compare submission hashes before and after acceptance.

The sandbox evidence is scoped to tested native command boundaries and explicit
probes. It is not a claim of protection against operating-system vulnerabilities
or a supported untrusted multi-tenant service.

"Private" means withheld from the solver workspace during an attempt. The source
release contains the verifiers and references for reproducibility. Filesystem
isolation does not establish that a model has never encountered these tasks or
their upstream sources during training.

## Budgets and retries

Generation wall budget: 1,200 seconds per task. Acceptance wall budget is 180
seconds by default; eight complete-game tasks declare 240 seconds in task.json.
The task's published metadata is authoritative for both budgets.
The adapter also stops at 30 observed tool calls. CLI events are observed after
dispatch, so this is an observed-call stop condition, not an exact pre-dispatch
30-call guarantee. Wall time is the primary comparable budget. Record observed
calls and any overshoot; never describe them as model response rounds.

Model identifier, reasoning effort, CLI version, dependency lock, task hashes,
harness hashes and feedback configuration are recorded. Repeat runs use separate
batches; do not select the best outcome across retries. Resuming a batch reuses
completed attempts only when task and harness hashes match. Infrastructure errors
are recorded separately and may be retried with their earlier evidence retained.
Functional failure and model timeout are completed unsuccessful attempts.

On Windows, the solver is instructed to explicitly select `cmd.exe` with login
disabled on each shell call: PowerShell's location provider cannot enter this
strictly isolated workspace. `NODE_OPTIONS=--preserve-symlinks
--preserve-symlinks-main` avoids Node canonicalizing denied ancestors before
loading permitted script files. Native file access restrictions still apply.
Preflight loads an actual Node script through cmd.exe and verifies relative
workspace reads/writes and the same denied paths. Personal config remains denied.
An invalid intermediate game tree skips a revision snapshot and records the gap;
it does not abort the solver. Public tests and final submission still reject
hidden files, symlinks and oversized projects. An invalid final draft retains
generation metadata and counts as unsuccessful unless generation itself was
interrupted by infrastructure.

`--diagnostic-continuation` with `--resume` explicitly allows a changed harness
while requiring identical tasks, model and effort. It preserves completed
outcomes, records each execution phase's harness hashes and concurrency, and
permanently labels the batch diagnostic. The baseline exporter rejects it.
Use a fresh batch after repairs for a comparable formal release baseline.

## Scores

- `pass@1`: successful explicit submissions / all 228 frozen tasks.
- Family macro score: unweighted mean of the 42 current source/family pass rates.
- Also report completion, submission, timeout, infrastructure failures, time and
  actual returned token counts. Missing usage is unknown, not zero.
- Publish the exact model/harness pairing; do not infer monetary cost from tokens.
- Confidence intervals must account for family dependence. Do not treat all
  parameter variants as independent samples when interpreting uncertainty.

`formal_eligible` denotes successful isolation checks for the attempt. A final
release additionally requires a complete baseline and disclosed task-review sign-off.
Reference-solution QA is never counted as a model score. Human visual/aesthetic
review is reported separately from the deterministic functional verdict.

## Release gates

`npm run release:check` requires every frozen task's current QA hash, three
reference repetitions, public checks, behavior mutations, four rendered-surface
mutations, starter rejection, task licenses, tests and isolation receipts.

`npm run release:final` additionally requires a signed technical task review covering
the current manifest and a complete isolated model baseline with matching hashes.
The project owner requested AI task-by-task review for this revision. The record
names the reviewer as AI; it is not human sign-off or an independent expert review.
Candidate packages are explicitly
labeled `release-candidate`; they are not releases with a validated independent model baseline.

The final gate also requires an archive integrity check, a fresh dependency install
from that archive, and local runtime tests bound to the same harness/task hashes.
Reusing a locally installed matching Chromium is disclosed in the receipt; it is
not described as a browser download on a new machine.

Coverage limits: visual guards reject blank, transparent, fully clipped and
covered game surfaces, and required actors/outputs are checked for visibility.
These are not aesthetic scores or a proof against every adversarial rendering
trick. Material and visual tasks inspect actual rendered pixels where specified.
Audio tasks test actual decoded output energy, natural completion and bus isolation
alongside pool/queue behavior. They do not assess subjective sound quality or exact
waveform fidelity. Behavior outside the published browser contract is not claimed.
Human/technical review should consider these limits explicitly.

## Provenance and data

Source commit identities are in `configs/source-index.json`; helper provenance is
in `configs/upstream-lock.json`. Project code and directly authored adaptations
use Apache-2.0. Per-task assets.json records retained source media, replacements,
hashes and license evidence. Retained media keep their own terms; a repository
license is not asserted to establish missing independent media permissions.
Optional generated game artwork has prompt records in docs/art-generation-prompts.md.

Local attempts retain observable commands, outputs, code revisions, public
feedback, submission hashes and acceptance evidence. Private reasoning is omitted.
Model trajectories are excluded from source archives and require separate rights
review before redistribution or training. A code license does not grant those rights.
