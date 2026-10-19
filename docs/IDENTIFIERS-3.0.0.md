# OriginGameDevBench 3.0.0 identifier migration

The scored cohort has exactly 228 tasks, numbered `og-web-0001` through
`og-web-0228` in the existing cohort order. These are the actual directory names,
configuration IDs, result keys and resource paths. Each concrete family retains
its name under the `OriginGameDevBench/` prefix. Internal pilot fixtures are
`og-web-9001` and `og-web-9002` and are excluded from cohort scores.

The migration is intentionally incompatible. The runner, API, task links and
playable resource routes accept only canonical IDs. There is no alias registry,
redirect or fallback for retired identifiers. Only the current canonical source
archive is distributed. Upstream repository URLs and asset copyright notices
remain factual attribution; they are not runtime identifiers.

The 2.0 authored requirements, reference behavior and acceptance scenarios are
preserved. English `prompt.md` remains the model input. `prompt_zh.md` remains the
corresponding Chinese translation. No task-content generator is used. Shared
modules are now under `taskkits/OriginGameDevBench/`; cohort commands are under
`scripts/cohort/`, with the manifest at `configs/OriginGameDevBench.json`.

Current 3.0 QA runs against the renamed directories and configurations. The
reference implementation runs each private scenario three times, and checks
public examples, behavioral and visual faults, and starter rejection. The
release also verifies the archive manifest, clean extraction, locked dependency
installation, local filesystem isolation and website routes.

Historical 2.0 QA and 1.0 model records are reindexed, retaining their original
execution dates, outcomes and execution hashes. Their metadata discloses the
identity migration and original record digest. Snapshot file hashes describe the
reindexed bytes; recorded execution hashes describe the original run. Historical gameplay code is unchanged except 53 `TASK_CONFIG.id` string values;
a digest comparison records these identity-only edits. Screenshots and recordings
are preserved. These records are not
new 3.0 model results. The downloadable current package contains the current
reference/verifier QA and the reindexed historical website data.

A complete independent model baseline for 3.0 has not been run. Reference QA is
not a model score or a human art assessment. The release remains a candidate
under the existing final-release gate.

## 中文说明

3.0.0 使用实际编号 `og-web-0001` 至 `og-web-0228`，任务目录、配置、结果、
资源路径和链接全部一致。具体任务族保留，来源前缀统一为 `OriginGameDevBench/`。
内部试验题 `og-web-9001`、`og-web-9002` 不计入 228 题成绩。

此变更不保留旧编号兼容或跳转，只分发最新统一编号源码包。原仓库链接与素材
版权声明仍作为真实归属信息保留，不参与任务编号解析。

英文 `prompt.md` 仍为任务输入，中文 `prompt_zh.md` 与之对应。编号迁移不改写
2.0 的题目要求、玩法或验收场景，不使用题目生成脚本。3.0 在新目录与配置下
重新执行 QA；2.0 QA 和 1.0 模型成绩保留原日期、结果及执行哈希，明确披露
编号迁移。历史试玩中仅 53 个 `TASK_CONFIG.id` 字符串改名，其他代码和截图、录像保持原样，不能算作 3.0 新模型测试。
