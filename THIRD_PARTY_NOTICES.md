# 第三方来源与修改声明

2026-10-19 的 [素材审计](docs/MEDIA-LICENSE-AUDIT.md) 及 `configs/media-license-evidence.json` 补充了原始逐题记录，标明已核实文件的准确哈希和剩余授权缺口。完整素材集合并非统一适用 Apache-2.0，也尚未全部核清发布授权。

项目代码、任务改编及项目生成的测试素材使用 Apache-2.0，详见 `LICENSE`、`NOTICE`。上游原项目保留其版权。

| 来源 | 纳入内容 | 许可证据 |
|---|---|---|
| [GameDevBench](https://github.com/waynchi/gamedevbench) | 改编题面、测试几何及选取的 `ValidationResult` 辅助代码 | `vendor/gamedevbench.LICENSE` |
| [GameCraft-Bench](https://github.com/FreedomIntelligence/gamecraft-bench) | 限定范围的任务改编及选取的算术公式解析器 | `vendor/gamecraft-bench.LICENSE` |
| [Analog Design Bench](https://github.com/Arcadia-1/analog-design-bench) | 仅选取 `write_results` 软件辅助代码 | `vendor/analog-design-bench.LICENSE` |

辅助代码来源、提交号、原始与修改后的哈希及保留符号记录在 `configs/upstream-lock.json`。题库来源提交另记于 `configs/source-index.json`。每题 `provenance.json` 记录来源标识及范围变化，素材记录位于 `assets.json`，并在 `configs/task-licenses.json` 汇总。

2.0 版将来源运行时操作改成浏览器接口，同时恢复组件职责与完整游戏系统。逐题比较说明剩余的范围和工作流程差异。多道题保留来源图片、音效及字体，包括全部 33 道收集物覆盖层题；此前“不包含原始图像像素”的说法不再适用。

每份保留素材均在 `assets.json` 中标识并记录哈希。Bleed 精灵美术保留随附的自定义许可及署名。若归档只有仓库许可证而没有独立素材许可，会如实记录该限制，不推定更广泛权利。可选生成图集的提示词见 `docs/art-generation-prompts.md`。3.0.0 编号迁移不改变已记录的素材来源。

Analog 单独授权的非软件任务数据集不包含在本项目。完整上游仓库、未选数据集、其运行结果、模型登录和远程控制组件不进入发布归档。三种结果辅助格式都是同一次验收结果的导出，不是三个独立裁判或投票系统。

Playwright 与 playwright-core 使用 Apache-2.0。Chromium 和 FFmpeg 单独安装，许可证声明随各自发行包提供，其二进制不包含在项目归档中。源码许可证不隐含授予模型轨迹再分发或训练权利。

## 2026-10-19 核实并补充的素材声明

| 素材 | 署名及许可证 | 本仓库保存的证据 |
|---|---|---|
| Crusader 序列帧与图集 | Bleed - http://remusprites.carbonmade.com/；Copyright 2017 Remos Turcuman；自定义条款 | `vendor/licenses/Bleed.txt` 及各题原有 `assets/License.txt` |
| Poppins Medium 4.004 | Copyright 2020 The Poppins Project Authors (https://github.com/itfoundry/Poppins)；OFL-1.1 | 字体内嵌元数据及 `vendor/licenses/Poppins-OFL-1.1.txt` |
| Roboto Medium 2.137（2017） | Copyright 2011 Google Inc. All Rights Reserved.；Apache-2.0 | 字体内嵌元数据及 `vendor/licenses/Roboto-Apache-2.0.txt` |
| Early GameBoy 1.0 | Copyright LDEJRuff 2012；CC-BY-SA-3.0 | 字体内嵌元数据及 `vendor/licenses/Early-GameBoy-NOTICE.txt` |
| Ninja lower/upper 精灵图 | Copyright (c) 2025 Heart Gamedev LLC；MIT | 匹配的原项目 blob 及 `vendor/licenses/ninja-platformer-MIT.txt` |
| Fists of Fury player/player_knife 精灵图 | Copyright (c) 2025 Nicolas Bize；MIT | 匹配的原项目 blob 及 `vendor/licenses/fists-of-fury-MIT.txt` |

Bleed 许可允许按条款分发和用于项目，但禁止转授权、转售素材（包括修改版），并包含用途限制。它不是 Apache-2.0，也不是无额外限制的开源美术。OFL 字体仍适用 OFL；Early GameBoy 字体的改编继续履行相应相同方式共享义务。这些条款不改变基准代码的许可。此次准备工作未修改已核实字体和精灵图的字节。

单独导出某道任务时，应将本节相关署名和 `vendor/licenses/` 中相应许可文本随素材一起提供，并保留所有原始声明。完整源码归档自动包含该目录。许可证原文及版权署名保持原文，以免中文说明替代具有约束力的条款。
