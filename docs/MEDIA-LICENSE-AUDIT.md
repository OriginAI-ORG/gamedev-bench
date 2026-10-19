# 素材授权证据审计：2026-10-19

**完整素材集合尚未核清再分发授权。** 本次审计发现 40 份不同内容的素材仍缺充分许可证据。下表及 `validation/media-license-audit.json` 列出了全部本地路径和完整 SHA-256；这些缺口解决前，源码打包会被阻止。

本次审计没有重写既有公开 Git 历史或冻结源码标签。已经公开的副本同样涉及这里披露的授权缺口。

## 范围与结果

扫描覆盖 `tasks/`、`taskkits/`、`samples/` 中指定扩展名的独立图片、音频、视频、字体和模型文件，共 **2,924 个路径、450 份去重内容**，并以哈希绑定全部 230 份任务素材记录和来源索引。

本审计不认证内嵌图形、商标、生成美术版权或所有上游权属链。技术完整性与授权证据是两项不同检查。

| 分类 | 去重数量 | 结论 |
|---|---:|---|
| 已记录项目创作来源 | 15 | 6 张生成插图、9 个自行编写的 SVG 测试素材，有任务记录与生成提示词支持 |
| 已找到许可证据 | 7 | 3 种字体、4 张精灵图，证据见下文 |
| 附有限制性许可证 | 388 | Bleed Crusader 角色序列帧及图集，保留自定义条款 |
| 待核实 | 40 | 有上游基准的来源记录，但尚未确立匹配原素材的再分发许可 |

## 已补充的证据

- **Poppins Medium 4.004：** 字体名称表记载了 2020 Poppins Project Authors 版权及 OFL-1.1。从 [Google Fonts 的固定提交](https://github.com/google/fonts/blob/47d54ca1ebb14fd864695f1d39dc734f39017c33/ofl/poppins/OFL.txt) 保留匹配的版权和许可文本，文件为 `vendor/licenses/Poppins-OFL-1.1.txt`。
- **Roboto Medium 2.137（2017）：** 随附字体的名称表明确记载 Copyright 2011 Google Inc. 和 Apache-2.0。版权声明保存在 `THIRD_PARTY_NOTICES.md`，许可文本为 `vendor/licenses/Roboto-Apache-2.0.txt`。不使用新版 Roboto 的许可证替代该文件自身元数据。
- **Early GameBoy 1.0：** 字体记载 Copyright LDEJRuff 2012 及 [CC-BY-SA-3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode)。署名及许可链接见 `vendor/licenses/Early-GameBoy-NOTICE.txt`。
- **Ninja lower/upper：** Git blob 哈希与 [Heart Gamedev 原项目](https://github.com/uheartbeast/ninja-platformer/tree/5c1473f68f2da1941e3c93856c9d88fc365c9c50) 完全一致。MIT 声明保存在 `vendor/licenses/ninja-platformer-MIT.txt`。
- **Fists of Fury player/player_knife：** Git blob 哈希与 [Nicolas Bize 原项目](https://github.com/nicolasbize/fists-of-fury-course/tree/0f353aea614cf57e43fb3776667c26dd3ce7714c) 完全一致。MIT 声明保存在 `vendor/licenses/fists-of-fury-MIT.txt`。
- **Bleed：** 原许可允许分发和修改，但须署名并遵守限制。禁止转授权、转售素材（包括修改后的素材），并包含用途限制。必须保留 `vendor/licenses/Bleed.txt` 及原声明，不能将这些美术标为 Apache-2.0 或无额外限制的开源内容。

准确的已审查哈希、来源 URL、证据文件哈希和义务记录在 `configs/media-license-evidence.json`。这些发现补充历史任务记录，不改变冻结任务内容，也不产生新的模型基线。原项目许可证与字节匹配构成证据，但不等于独立认证作者的完整权属链。

## 如何解决缺口

对每个待核实内容哈希，取得与其匹配、允许再分发的作者许可证或书面授权，并保留来源、版本与声明。文件名、可以下载这一事实、基准仓库的 Apache 许可证，均不足以单独解决缺口。本次审计没有向权利人发送消息。

如果无法取得证据，应通过有版本记录的任务修订，将素材替换为新创作或适当授权的内容。重新检查尺寸、行为与评分，重跑受影响 QA，并将过期模型证据标为失效。不得静默删除固定题库中的任务，也不得把未知授权素材重新标成 Apache-2.0。保密授权文件应私下保存，只公开获准披露的署名或许可说明。

## 复现检查

```powershell
python -B scripts/audit-media-licenses.py
python -B scripts/audit-media-licenses.py --require-cleared
```

第一条命令检查清单和证据是否仍然匹配；第二条还会在存在待核实内容时失败。审查修改后更新证据文件，再用 `--write` 重新生成清单。该过程不会修改素材或任务文件。源码打包会在创建归档前执行更严格的检查。

## 待核实素材

每行代表一份不同的文件内容；JSON 报告列出所有副本及受影响任务编号。示例路径只用于定位素材，不代表授权结论。

| SHA-256 前缀 | 示例文件 | 副本数 |
|---|---|---:|
| `03a661bb4072` | `tasks/og-web-0039/reference/assets/Laser_04.wav` | 4 |
| `099c760f4d6a` | `taskkits/OriginGameDevBench/smoke/assets/flamelet.png` | 41 |
| `0db6cfa2b501` | `taskkits/OriginGameDevBench/tank-hud/assets/ammo_ui_icon.png` | 13 |
| `19b8eb88b819` | `tasks/og-web-0039/reference/assets/WarpDrive_02.wav` | 4 |
| `1c7a0baa8b55` | `taskkits/OriginGameDevBench/minimap/assets/panel_woodDetail_blank.png` | 9 |
| `241ec06e72f5` | `taskkits/OriginGameDevBench/minimap/assets/minimapIcon_arrowA.png` | 9 |
| `26060431bd2e` | `taskkits/OriginGameDevBench/navigation/assets/towerDefense_tile245.png` | 15 |
| `29643e05e1f3` | `taskkits/OriginGameDevBench/overlay/assets/platformer_coins.jpg` | 45 |
| `2a04e49aeed7` | `taskkits/OriginGameDevBench/minimap/assets/minimapIcon_exclamationYellow.png` | 9 |
| `31dd55165edb` | `taskkits/OriginGameDevBench/smoke/assets/smokelet.png` | 41 |
| `39c6997cb5c9` | `tasks/og-web-0039/reference/assets/Laser_05.wav` | 4 |
| `402d128f7b8c` | `tasks/og-web-0024/reference/trap.png` | 10 |
| `48122e49b824` | `taskkits/OriginGameDevBench/tank-hud/assets/tank_body.png` | 13 |
| `49d4fc9894d5` | `taskkits/OriginGameDevBench/minimap/assets/pattern_blueprintPaper.png` | 9 |
| `56480f0a6cdd` | `taskkits/OriginGameDevBench/overlay/assets/platformer.jpg` | 23 |
| `5d489eb39fee` | `tasks/og-web-0036/reference/tileYellow_02.png` | 4 |
| `60f962407b26` | `taskkits/OriginGameDevBench/navigation/assets/terrain_tiles_v2.png` | 15 |
| `6b5a6fef622c` | `tasks/og-web-0076/reference/icon.png` | 2 |
| `6e17950809ce` | `taskkits/OriginGameDevBench/tank-hud/assets/tank_weapon.png` | 13 |
| `721ff0d2dd32` | `taskkits/OriginGameDevBench/minimap/assets/minimapIcon_jewelRed.png` | 9 |
| `75c4eb86e8ce` | `tasks/og-web-0063/reference/tilemap.png` | 2 |
| `8a8b7fbc24fa` | `tasks/og-web-0044/reference/tile_0108.png` | 2 |
| `951a99a34634` | `tasks/og-web-0055/reference/sokoban_character.png` | 2 |
| `96ec9e5ed1a5` | `tasks/og-web-0039/reference/assets/Menu_Select_00.wav` | 4 |
| `9d317d0e3d93` | `tasks/og-web-0075/reference/music.ogg` | 2 |
| `a12562e22613` | `taskkits/OriginGameDevBench/tank-hud/assets/crate.png` | 13 |
| `a6c2e74c3419` | `tasks/og-web-0039/reference/assets/Menu_Select_01.wav` | 4 |
| `a7f7b83c05ed` | `tasks/og-web-0035/reference/sokoban_tilesheet.png` | 2 |
| `a9794a168de5` | `taskkits/OriginGameDevBench/navigation/assets/fence_tiles.png` | 15 |
| `bcfda2b005df` | `tasks/og-web-0064/reference/dino.png` | 2 |
| `be3b71c4dbf9` | `tasks/og-web-0039/reference/assets/Jingle_Win_00.wav` | 4 |
| `c8467320182a` | `tasks/og-web-0034/reference/sokoban_character.png` | 10 |
| `d0c7132645fb` | `tasks/og-web-0067/reference/tiles.png` | 4 |
| `d2b46686355d` | `taskkits/OriginGameDevBench/preferences/assets/game_menu_reference.png` | 3 |
| `d55d670fb8ae` | `tasks/og-web-0017/reference/pickup.wav` | 2 |
| `d9991637062c` | `taskkits/OriginGameDevBench/tank-hud/assets/pickups.png` | 15 |
| `e3ef35248e08` | `taskkits/OriginGameDevBench/tank-hud/assets/walls.png` | 13 |
| `e6ebec9dd555` | `tasks/og-web-0039/reference/assets/Robot_Talk_00.wav` | 4 |
| `f4c5879338ca` | `taskkits/OriginGameDevBench/smoke/assets/campfire_base.png` | 41 |
| `f89bf70d55f8` | `tasks/og-web-0039/reference/assets/Alarm_Loop_01.wav` | 4 |
