# 贡献指南

欢迎通过 [Issue](https://github.com/OriginAI-ORG/gamedev-bench/issues) 报告问题、提出任务建议或补充许可证据。中文、英文均可。安全漏洞请按 [安全说明](SECURITY.md) 私密报告。

创建本地分支或 Fork，将范围明确的修改以 PR 提交到 `main`。说明问题、修改后的行为、任务编号和本地验证结果。只有完整解决某个 Issue 时才写 `Fixes #123`。维护者会审查正确性、证据和授权情况，再决定是否合并；建议不保证被接受。

开发和测试在本机进行。请勿提交凭据、个人配置、`AGENTS.md`、会话记录、上游仓库副本、浏览器二进制或本地运行产物。发布脚本只打包允许清单内的内容，不会上传。

修改任务时，必须同时提供英文 `prompt.md`、对应的中文 `prompt_zh.md`、公开接口、起始项目、独立参考实现、私有验收场景、公开示例、至少两个行为负例、来源署名、素材记录，以及审查文档中的逐题比较。起始项目不得藏入被禁用的参考算法或私有预期几何数据。

任务修改后运行 `npm test`、`npm run cohort:qa -- --tasks TASK --concurrency 1` 和 `npm run cohort:audit`，将 `TASK` 替换为真实任务编号。纯文档修改只需核对链接和命令，无须运行模型。任务、验收器、共享 QA 引擎或依赖的变化会使旧证据失效；新任务或新版本也会使相应范围内的旧模型结果失效。保留失败证据，不要用成功记录覆盖它。

审查者应逐项比较任务要求与场景断言，重放参考实现，检查公开反馈和负例，并判断更简单但错误的实现是否也能通过。覆盖每个任务族及其变体规则，在审查文档中记录来源对照和仍未解决的等价性限制。模型题面使用浏览器术语，直接说明所需行为。直接编辑任务内容，已停用的生成器不得覆盖审查过的文件。

固定题库保存在 `configs/OriginGameDevBench.json`；审计只写独立回执 `validation/task-audit.json`，不能筛除失败任务。

## 贡献内容的权利

只提交自己创作或有权贡献的内容。主动提交的原创代码贡献按 `LICENSE` 第 5 条适用 Apache-2.0。第三方内容必须单独标明，并保留原许可证和版权声明。目前不另行要求签署 CLA，也不强制 `Signed-off-by`。

素材应附作者、原始来源、匹配的文件哈希、准确许可证、再分发许可、修改说明和署名要求。上游基准仓库的代码许可证不能单独证明其附带素材的授权。

阅读 [素材授权审计](docs/MEDIA-LICENSE-AUDIT.md)，核实证据后更新 `configs/media-license-evidence.json`，运行 `python -B scripts/audit-media-licenses.py --write`，再去掉 `--write` 运行一次，验证清单。未登记的素材自动视为授权待核实。

## 验证与发布

在 PR 模板中记录本地检查结果和未解决的失败项。目前没有必需的云端 CI 或自动模型评测。在允许贡献脚本访问个人账号前，先审查脚本。

发布检查包括 `npm run validate:tests`、`npm run isolation:check`、`npm run cohort:qa -- --concurrency 3 --resume`、`npm run cohort:audit` 和 `npm run release:check`。这些技术检查不等于素材授权核清。

源码打包还要求 `python -B scripts/audit-media-licenses.py --require-cleared` 通过。正式发布额外要求 `npm run release:final` 通过，并具备完整、版本匹配的模型基线。具体流程见 [开源维护指南](docs/OPEN-SOURCE-MAINTENANCE.md)。
