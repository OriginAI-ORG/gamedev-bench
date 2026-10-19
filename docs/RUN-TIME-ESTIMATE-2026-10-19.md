# Version 3.0.0 runtime estimate — 2026-10-19

These estimates concern the fixed 228-task cohort on the current local machine. They do not start a model run and exclude quota waits, service outages, manual interruptions and retries.

| Run type | Concurrency | Expected elapsed time | Basis |
| --- | ---: | --- | --- |
| Complete reference and verifier QA | 3 | 25–30 minutes reserved | Measured complete 3.0.0 run plus local variation |
| Model generation followed by acceptance, once per task | 4 | Approximately 8–16 hours | Planning assumption; not measured 3.0.0 model throughput |
| Model generation followed by acceptance, once per task | 1 (runner default) | Approximately 30–64 hours | Same assumptions, serialized |

The complete 3.0.0 QA first pass took 1,429,261 ms (23 minutes 49.261 seconds),
executing all 228 tasks at concurrency three with no cached task reuse. A browser
`ERR_NO_BUFFER_SPACE` interrupted one scenario in `og-web-0088`; the task passed an
isolated 14.429-second retry without source changes. The final result is 228/228.
The first pass and retry evidence are retained in `validation/qa-execution.json`.
The run covers three repetitions per reference scenario, public tests, behavioral
and rendering fault injection, and starter rejection. Packaging, clean installation
checks, website tests and publication are additional work.

The existing model planner in `scripts/cohort/batch.mjs` assumes 6–12 minutes for generation, 0.5–2 minutes for acceptance, and 20% scheduling allowance. For 228 tasks this gives 7.41–15.96 hours at concurrency four, or 29.64–63.84 hours serialized. The 1.0.0 historical model cohort averaged 5.70 minutes of generation per task, but that older, weaker task set does not establish 3.0.0 throughput.

Current task budgets are 20 minutes of generation per task, plus three minutes of acceptance for 220 tasks and four minutes for eight tasks. Exhausting all these allowances totals 87.53 worker-hours, or roughly 22 hours at concurrency four (87.53 hours serialized), before startup, quota waits and retries. This is a budget-based planning bound, not a guaranteed end-to-end deadline. The reference QA runner and model runner are separate workloads.
