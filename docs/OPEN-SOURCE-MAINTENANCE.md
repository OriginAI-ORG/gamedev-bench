# 开源维护指南

仓库：[OriginAI-ORG/gamedev-bench](https://github.com/OriginAI-ORG/gamedev-bench)

## Issue 与贡献处理

使用问题反馈、任务与评分建议、许可与署名三类 Issue 表单。先确认报告涉及的版本和任务，再分类处理。要求最小复现，保留失败证据；重复报告应链接到原始问题。代码通过 PR 审查和合并，Issue 在处理完成后关闭。PR 合并到默认分支时，`Fixes #N` 会关闭关联 Issue。

在本机审查贡献并运行适用检查，将脱敏后的命令结果附在 PR 中。新增任务或评分规则变化必须有明确合同、参考实现、负例、授权证据，以及版本和成绩可比性的处理决定。不要为外部贡献自动启动付费模型评测。

## 仓库设置

以下状态已于 2026-10-19 核验：

- [主分支历史保护规则](https://github.com/OriginAI-ORG/gamedev-bench/rules/25376648) 已生效：禁止删除 `main`，禁止对其进行非快进推送，没有例外绕过主体。预期配置保存在 `.github/main-ruleset.json`。
- 普通快进推送和维护者合并仍可执行。目前按单维护者模式，不强制另一人批准或云端 CI 状态检查；贡献流程仍要求通过 PR 审查。
- [私密漏洞报告](https://github.com/OriginAI-ORG/gamedev-bench/security/advisories/new) 已启用。报告与披露方式见 `SECURITY.md`。

规则由 GitHub 服务端执行，JSON 文件本身不能强制生效。管理员可用以下命令查询当前状态：

```powershell
gh api repos/OriginAI-ORG/gamedev-bench/rules/branches/main
gh api repos/OriginAI-ORG/gamedev-bench/private-vulnerability-reporting
```

凭据应保存在本机凭据存储中，不得写入仓库。

## 发布与引用

1. 先解决 [素材审计](MEDIA-LICENSE-AUDIT.md) 中的授权缺口，运行 `python -B scripts/audit-media-licenses.py --require-cleared` 检查。有未核清文件就会阻止打包；已有许可证的素材仍须履行其条款。
2. 按 `CONTRIBUTING.md` 完成本地技术检查。纯文档更新不会产生新的任务验证或模型性能证据。
3. 发布源码候选版时，明确范围及尚缺的模型或审查条件，并将 GitHub Release 标为预发布版。只有素材检查通过后才运行 `python -B scripts/package_release.py`。
4. 发布具有已验证模型基线的正式版时，必须具备与当前任务和框架哈希绑定的完整隔离基线、已披露技术审查、归档冒烟证据，且 `npm run release:final` 通过，打包时使用 `--final`。
5. 发布内容发生变化时使用新的不可变标签和版本。不得移动历史 `v1.0.0` 标签，也不得覆盖旧归档来掩盖修正。版本确定后同步更新 CHANGELOG 和 CITATION。
6. 记录提交号、发布系列、版本和归档 SHA-256。只发布明确获准的源码与验证产物，不包含模型对话、个人配置和凭据。上传 Release 是维护者单独明确执行的动作，本地打包不会上传。

任务或验收器变化会使相应范围的旧证据失效。应区分原始成绩与修正后的成绩。每份结果披露模型 ID、推理强度、预算、任务版本、环境、失败情况和分数聚合方式。QA 通过不等于模型成绩、授权认证或独立同行评审。

`CITATION.cff` 标识 1.0.0 源码系列；引用时同时注明准确提交号，因为 `main` 文档可能比冻结的源码标签更新。今后若明确安排存档发布，可再补 DOI；目前未声明 DOI。
