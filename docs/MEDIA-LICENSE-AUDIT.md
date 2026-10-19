# Media license evidence audit — 2026-10-19

**The complete media collection is not cleared for redistribution.** This audit
finds 40 unique media contents with unresolved permission evidence. They are
listed below and in `validation/media-license-audit.json` with every local path
and full SHA-256. Packaging is blocked until the evidence gaps are resolved.
The existing public Git history and frozen source tag are not rewritten by this
audit; the disclosed gaps also need consideration for those existing copies.

## Scope and findings

The scan covers standalone image, audio, video, font and model extensions under
`tasks/`, `taskkits/` and `samples/`: **2,924 paths, 450 unique contents**. It also
binds all 230 task asset records and the source index to hashes. It does not
certify inline graphics, trademarks, generated-art copyright or every upstream
ownership chain. Technical integrity and recorded permission are separate checks.

| Classification | Unique contents | Finding |
|---|---:|---|
| Project provenance recorded | 15 | 6 generated illustrations and 9 authored SVG fixtures, supported by task records and generation prompts |
| License evidence identified | 7 | 3 fonts and 4 sprite sheets; evidence below |
| Restricted license | 388 | Bleed Crusader sequence frames/atlases; custom terms retained |
| Unresolved | 40 | Upstream benchmark attribution exists, but matching original media permission is not established |

## Evidence added

- **Poppins Medium 4.004:** the font name table records the 2020 Poppins Project
  Authors copyright and OFL-1.1. The matching copyright/license notice is preserved
  from [Google Fonts at a pinned commit](https://github.com/google/fonts/blob/47d54ca1ebb14fd864695f1d39dc734f39017c33/ofl/poppins/OFL.txt)
  in `vendor/licenses/Poppins-OFL-1.1.txt`.
- **Roboto Medium 2.137 (2017):** the bundled font explicitly records Copyright
  2011 Google Inc. and Apache-2.0 in its name table. Keep the copyright in
  `THIRD_PARTY_NOTICES.md` and the text in `vendor/licenses/Roboto-Apache-2.0.txt`.
  A newer Roboto release's license is not substituted for this font's metadata.
- **Early GameBoy 1.0:** the bundled font records Copyright LDEJRuff 2012 and
  [CC-BY-SA-3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode).
  Attribution and the license link are in `vendor/licenses/Early-GameBoy-NOTICE.txt`.
- **Ninja lower/upper:** Git blob hashes match the original
  [Heart Gamedev project](https://github.com/uheartbeast/ninja-platformer/tree/5c1473f68f2da1941e3c93856c9d88fc365c9c50)
  exactly. Its MIT notice is retained in `vendor/licenses/ninja-platformer-MIT.txt`.
- **Fists of Fury player/player_knife:** Git blob hashes match the original
  [Nicolas Bize project](https://github.com/nicolasbize/fists-of-fury-course/tree/0f353aea614cf57e43fb3776667c26dd3ce7714c)
  exactly. Its MIT notice is retained in `vendor/licenses/fists-of-fury-MIT.txt`.
- **Bleed:** the original license already permits distribution and modification,
  subject to attribution and its restrictions. It forbids sublicensing and resale
  of the assets, including modified assets, and imposes use restrictions. Keep
  `vendor/licenses/Bleed.txt` and the original notices. Do not label this artwork
  Apache-2.0 or unrestricted open-source content.

Exact reviewed hashes, source URLs, evidence-file hashes and obligations are in
`configs/media-license-evidence.json`. These findings supplement historical task
records without changing frozen task contents or claiming a new model baseline.
Original-project licensing plus a byte match is evidence, not an independent
certification of the author's ownership chain.

## Resolving gaps

For each unresolved content hash, obtain a matching author license or written
permission covering redistribution, and preserve its source/version and notices.
A filename, download availability, or a benchmark repository's Apache license
alone does not resolve the gap. No rights-holder messages were sent by this audit.

If evidence cannot be obtained, replace the material through a versioned task
revision with newly authored or appropriately licensed assets. Recheck dimensions,
behavior and scoring; rerun affected QA and invalidate stale model evidence.
Do not silently remove tasks from the fixed cohort or relabel unknown media as
Apache-2.0. Keep any confidential permission document private and publish only
the approved attribution/permission statement.

## Reproduction

```powershell
python -B scripts/audit-media-licenses.py
python -B scripts/audit-media-licenses.py --require-cleared
```

The first command checks that the recorded inventory/evidence is current. The
second also fails while any content is unresolved. After reviewing a change,
update the evidence file and regenerate with `--write`. This never changes media
or task files. Source packaging runs the stricter check before creating an archive.

## Unresolved content

Each row represents unique bytes; the JSON report lists all duplicates and all
affected task IDs. The example path is for locating the asset, not a license claim.

| SHA-256 prefix | Example file | Copies |
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
