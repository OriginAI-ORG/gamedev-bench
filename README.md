# OriginGameDevBench

**1.0.0：首个独立源码仓库。** 这是一个本机运行的智能体游戏开发基准，评测浏览器游戏组件和完整游戏：全新起始项目 → 公开反馈 → 冻结提交 → 私有验收。

**素材授权审查尚未完成。** 代码使用 Apache-2.0，随附素材分别适用自身条款，包括有限制的 Bleed 美术及尚未核清授权的内容。再分发完整集合前，请阅读 [素材授权审计](docs/MEDIA-LICENSE-AUDIT.md)。缺口解决前，源码打包会被阻止。

固定题库为 `og-web-0001` 至 `og-web-0228`，覆盖 42 个具体任务族。英文 `prompt.md` 是正式任务输入，`prompt_zh.md` 是对应中文说明。内部试点 `og-web-9001`、`og-web-9002` 不计分。

本仓库由开发版 3.0.0 拆分，独立版本历史从 1.0.0 开始。全部 456 个题面文件与来源发布保持字节一致；版本元数据更新后，在本仓库重新执行运行时验证。详情见 [仓库身份与范围](docs/REPOSITORY-1.0.0.md)。

源码包含运行器、任务、参考实现及验收工具。公开站、管理站、凭据和模型结果在独立项目中。测试不需要 Cloudflare 账号或网站数据库。

参考实现与验收器 QA 不等于模型成绩。本发布系列尚无独立模型基线。`npm run release:final` 仍要求完整的当前基线及已披露技术审查；这些证据条件通过前，默认源码归档保持 `release-candidate` 标签。

## 本机快速开始

已测试的依赖组合：Node.js 22.17.0、Python 3.11+、Playwright 1.64.0 及配套 Chromium。运行模型还需要已经登录的本地 Codex CLI、自定义权限配置和 Windows MXC 沙箱。其他平台须另行验证运行时与隔离。

```powershell
npm.cmd ci --ignore-scripts
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $PWD '.browsers'
npx.cmd playwright install chromium
npm.cmd run doctor
npm.cmd test
npm.cmd run cohort:qa -- --tasks og-web-0011 --concurrency 1
```

验收现有游戏而不调用模型：

```powershell
npm.cmd run evaluate -- og-web-0011 E:\path\to\game
npm.cmd run report
npm.cmd run serve
```

报告服务监听 `http://127.0.0.1:8080/`，按 Ctrl+C 停止。验收器只提供静态文件服务，不安装或构建提交项目。

## 模型开发

```powershell
npm.cmd run isolation:check
npm.cmd run attempt -- run og-web-0011
npm.cmd run attempt -- prepare og-web-0011
npm.cmd run attempt -- reset ATTEMPT_ID
```

适配器复用现有登录和模型偏好。可设置 `BENCHMARK_MODEL`、`BENCHMARK_REASONING_EFFORT` 显式覆盖，或通过 `CODEX_BIN` 指定可执行文件；不会复制凭据和个人配置。调用会使用模型服务与账号配额，本地执行不等于完全离线。

解题命令使用进程级权限配置：可以读取公开任务与反馈，写入游戏、请求及任务临时目录；不能访问参考实现、私有验收器、父尝试目录和个人配置。每次模型调用前，用同一权限配置执行读写探针。命令不能联网，远程控制、插件、外部应用、记忆、浏览器控制工具及子代理均被禁用。预检失败即停止。

公开任务工具为 `node bench.mjs test`、`observe` 和 `submit`。第一次明确提交即冻结，后续修改不会改变它。没有执行 `submit` 的最终草稿仅保留用于诊断，不能计为成功。

## 完整题库与评分

```powershell
npm.cmd run cohort:qa -- --concurrency 3 --resume
npm.cmd run cohort:audit
npm.cmd run cohort:plan -- --concurrency 1
npm.cmd run cohort:run -- --model MODEL_ID --effort high --concurrency 1
```

将 `MODEL_ID` 替换为准确模型标识。规划阶段不调用模型。`--limit 10` 选择开发子集，其成绩不代表完整基线。`--resume BATCH_PATH` 保留既有证据，只恢复任务、模型、推理强度及框架版本匹配的运行。结果位于 `artifacts/batches/`。

查看正在运行的批次：执行 `node scripts/progress.mjs BATCH_PATH`，打开 `http://127.0.0.1:8081/`。这是每五秒刷新的本机只读视图，关闭页面不会停止模型批次。批次中的静态 `index.html` 在运行器退出后才更新，执行中应使用实时视图。

在同一服务打开 `/review`，可试玩已完成提交、查看题面与验收截图／录像，并保存人工审阅标注。游戏运行在独立来源和沙箱 iframe 中。审阅修订保存在 `BATCH_PATH/human-reviews/`，绑定尝试、任务和提交哈希，不覆盖自动分数，也不等于正式发布的技术审查签署。关闭页面不会停止模型批次。

打开 `/reaccept` 可比较同一冻结提交的原始验收与修正验收，包括两组截图和录像。`node scripts/reaccept.mjs prepare BATCH_PATH` 为旧验收器创建快照；`node scripts/reaccept.mjs run REACCEPT_PATH` 不调用模型，直接验收既有提交，中断后可恢复已完成检查。原始批次成绩不变，详见 [验收勘误](docs/ACCEPTANCE-ERRATA-2026-10-15.md)。

重验完成后若要继续未完成任务，执行 `node scripts/continue-reaccepted.mjs REACCEPT_PATH 2`。它核对冻结提交与修正结论，建立独立诊断续跑批次并输出路径；重复执行会复用同一续跑批次。用 `node scripts/cohort/batch.mjs --execute --resume NEW_BATCH_PATH --model MODEL_ID --effort high --concurrency 2` 启动，保持原模型和推理强度。已完成任务（包括保留的失败）不会重新生成。

诊断续跑可用 `node scripts/elastic-batch.mjs BATCH_PATH 8` 同时运行最多八题。启动后，把 `BATCH_PATH/control.json` 改为 `{"concurrency": 6}`，可在 1–8 之间调整并发而不停控制器；降低数值时，已运行任务会自然完成。Windows 上不要为了调并发而杀死旧控制器，其子进程可能同时终止。模型会话中断后需要新的尝试，可能产生额外用量；完成任务仍被排除。并发数不能保证截止时间。

完整批次结束后，执行 `node scripts/export-baseline.mjs BATCH_PATH` 导出脱敏基线。子集、隔离不完整、任务版本变化或框架变化都会被拒绝。

如果修复了运行器，可用 `--resume BATCH_PATH --diagnostic-continuation` 继续未完成任务，同时保留旧结果供检查。每阶段记录运行时哈希，两处本地面板都将混合批次标为诊断，不能导出正式基线。不加该参数时，框架变化仍阻止正常恢复。任务或验收器变化始终要求新批次。中断任务从全新工作区和模型上下文开始，已完成任务（包括失败）不重跑。

主要预算是生成 1,200 秒、验收 180 秒。适配器还会在观察到 30 次工具调用时停止，事件流派发限制见 [评测协议](docs/PROTOCOL.md)。报告任务 `pass@1` 和任务族宏平均，以各题的准确预算为准。Web 改编分数不能与上游成绩或历史 legacy-webgame 1.0 成绩直接比较。

QA 对每个参考场景运行三次，检查公开反馈、行为负例、透明／裁切／遮挡表面负例，以及起始项目拒绝。它记录任务和共享引擎哈希，文件变化会使旧证据失效。QA 不代表模型性能、专家认证或审美评估。

## 源码归档与发布检查

```powershell
npm.cmd run validate:tests
npm.cmd run isolation:check
npm.cmd run cohort:qa -- --concurrency 3 --resume
npm.cmd run cohort:audit
npm.cmd run release:check
python -B scripts/audit-media-licenses.py --require-cleared
python -B scripts/package_release.py
node scripts/package-smoke.mjs
```

归档包含任务工具包、规范题库清单、许可证和脱敏验证回执；排除个人配置、`AGENTS.md`、会话、模型轨迹、上游仓库副本、已安装运行时及停用的远端部署脚本。归档仅在本地创建，不上传。解压后在该目录执行快速开始命令，验证独立安装。

冒烟命令使用本机 npm 缓存和已安装的匹配 Chromium，测试三个代表性任务入口，不等于在新机器下载浏览器。若 Node 和 npm 分别安装，将 `NPM_CLI` 设为 `npm-cli.js`。运行或审计随附任务不需要上游仓库副本。

`npm run release:final` 额外检查当前已披露技术审查签署和完整隔离基线。通过后才可使用 `python -B scripts/package_release.py --final`。候选归档的清单标为 `release-candidate`。

## 目录与直接编辑

- `tasks/`：题面、起始项目、参考实现、公开与私有检查、负例和权利记录。
- `taskkits/OriginGameDevBench/`：直接编写的随附运行时与验收辅助模块。
- `core/`、`agents/`、`environments/`、`runner/`：生命周期、解题与验收逻辑。
- `validation/`：可移植测试、QA 和隔离回执；`artifacts/`：本地运行证据。
- `configs/source-index.json`：题库来源提交；`configs/upstream-lock.json`：辅助代码来源。

直接编辑各题。英文 `prompt.md` 是解题输入，中文 `prompt_zh.md` 是配套说明，不会作为任务输入暂存。旧任务生成器已停用。审计只验证内容并写 `validation/task-audit.json`，不能重写题面或移除失败题。修改任务后运行 QA 与审计。

修订前的历史规范保存在原本地项目备份，不包含在本独立源码仓库。逐题审查表记录删减、替换、新增及剩余等价性限制。固定 API 和确定性流程会限制部分设计自由；恢复核心机制不代表已证明实际难度相等。

## 许可与贡献

项目代码和直接编写的任务改编使用 [Apache-2.0](LICENSE)。保留素材沿用记录的来源条款，不作全体素材统一授权的声明。详见 [项目声明](NOTICE)、[第三方声明](THIRD_PARTY_NOTICES.md)、各题来源记录及 `configs/task-licenses.json`。模型轨迹另有授权要求，不包含在源码发布中。

当前 [素材审计](docs/MEDIA-LICENSE-AUDIT.md) 在历史逐题记录之外补充字体和原项目许可证据，并列出待核实文件。技术 QA 不会解决素材授权。素材须随附 `vendor/licenses/` 中相关声明。

相关文档：[贡献指南](CONTRIBUTING.md)、[安全说明](SECURITY.md)、[更新记录](CHANGELOG.md)、[引用信息](CITATION.cff)、[开源维护指南](docs/OPEN-SOURCE-MAINTENANCE.md)。
