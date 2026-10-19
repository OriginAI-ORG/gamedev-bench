# 本地保存的参考游戏美术

2026-10-16 使用内置 image_gen 工具和 [imagegen 技能](C:/Users/Crayon/.codex/skills/.system/imagegen/SKILL.md) 创建。未使用命令行生成脚本、参考照片、外部素材下载或发布步骤。最初返回的四张图集均经目视检查，原样复制到本工作区。精灵通过 CSS 图集坐标选择，图像未编辑或切片。生成图片不意味着已获得人工评分批准。

| 图集 | 本地主文件 | 布局 | 预期用途 |
| --- | --- | --- | --- |
| 法庭 | artifacts/task-revision-20261016/game-art/courtroom-atlas.png | 4×4 | 法庭场景、角色表情对和证据；已打包至法庭任务 |
| 奇幻 | artifacts/task-revision-20261016/game-art/fantasy-atlas.png | 6×6 | 骰子／单词战斗、王国、药店和规则解谜；本记录创建时待打包 |
| 工业 | artifacts/task-revision-20261016/game-art/industrial-atlas.png | 6×6 | 电路、管道和工厂游戏；本记录创建时待打包 |
| 边检 | artifacts/task-revision-20261016/game-art/border-atlas.png | 4×4 | 检查站环境、肖像和证件；本记录创建时待打包 |

工具实际返回正方形图像，使用方采用比例图集坐标，不假设请求的像素尺寸。以下为中文译文；每节折叠区保留实际提交的英文原文，作为生成来源证据。

## 法庭图集提示词

制作一张可用于游戏的美术图集：2048×2048 正方形，严格四列四行，每格 512×512，无边框、文字或字母。采用绘画式二维视觉小说风格，以柔和胡桃木、羊皮纸、酒红和深青色构成统一的法庭悬疑氛围。每格可通过 CSS background-position 独立使用。

第一行：空旷而富戏剧性的木质法庭全景；中心留白、右下带红蜡封的精致奶油色案卷纸；俯视深色雕花木桌纹理；带四个空白照片标签的证据文件夹。第二行：同一位严肃灰发法官的正常与震惊半身像；同一位年轻棕发女辩护律师的平静与强烈反对姿态。第三行：同一位戴眼镜、穿灰夹克男证人的平静与冒汗惊讶状态；同一位银发女检察官的自信与受挫状态。第四行：显示晚上八点的模拟挂钟及停电记录表；放大镜下的保险柜门与指纹；带码头小景的旧渡船票；仓库黄铜钥匙与仓库平面图。证据中不得出现可读文字。

肖像均以纯深青色为背景，完整显示头肩，不越过单元边界。每张图准确占据统一单元，缩至 128 px 仍可辨识。不要界面截图、文字或排版。这是本地基准参考游戏的视觉素材。

<details>
<summary>实际提交的英文原始提示词（留存证据）</summary>

```text
Create a production game art atlas as ONE image, 2048x2048 square, exactly four equal columns and four equal rows (each cell512x512), no borders, no text, no letters. Illustrated painterly 2D visual novel style, muted walnut, parchment, burgundy and deep teal, coherent courtroom mystery. Each cell is separately usable via CSS background-position. Row1: cell1 wide-view empty dramatic wooden courtroom interior; cell2 detailed cream case file paper with red wax seal in lower right and blank center; cell3 textured dark carved wooden tabletop top down; cell4 illustrated evidence folder with four blank photograph tabs. Row2 bust portrait same stern gray-haired judge normal, then shocked; same young brown-haired female defense lawyer calm, then emphatic objection pose. Row3 same bespectacled male witness in gray jacket calm then sweating startled; same silver-haired female prosecutor confident then frustrated. Row4 evidence illustrations: analog wall clock showing 8pm with electrical outage record sheet(no readable text); close up safe door and fingerprint under magnifying glass; old ferry ticket with dock vignette(no readable text); brass warehouse key beside warehouse floor map(no readable text). Every portrait fills its cell with dark teal plain background, entire head and shoulders visible, no crop over cell boundaries. Every image must occupy exactly its uniform cell, recognizable at128px. No UI screenshot, no words, no typography. This atlas is a local benchmark reference game's visual asset.
```

</details>

## 奇幻图集提示词

制作一张统一的二维奇幻游戏精灵图集，正方形，严格六列六行，共 36 个正方形单元，无间隔、分隔线或文字。采用丰富的绘画式游戏美术，轮廓清晰，以暖羊皮纸、青铜、青色和绯红为主。除环境图外，各格使用独立深炭色背景，物体居中且不越界。

第一行六个大型技能徽记：钢剑、塔盾、红色治疗心、象牙骷髅、燃烧之剑、冰蓝水晶。第二行六种完整敌人：持刀哥布林、装甲骷髅、紫色女巫、石魔像、红角巨龙首领、绿色沼泽史莱姆。第三行六张中世纪地图瓦片：山丘石堡、金色麦田、兵营、多彩集市城镇、带溪流的密林、岩山矿场。第四行五种炼金原料：鼠尾草束、红蘑菇、蓝水晶碎片、银色月花、金色龙鳞；第六格是冒泡坩埚。第五行：圆形红色治疗瓶、细长蓝色治病瓶、方形金色力量瓶、球形绿色解毒瓶、打开的法术书、金币宝箱。第六行：符文地下城大厅、带货架的温暖木质炼金店、羊皮纸王国地图、魔法森林解谜空地、带无字象牙字母块的魔法桌、带无点数骰子的烛光赌桌。

细节在 96 px 下仍可辨识；应是真正的插画素材表，不是几何界面或截图。

<details>
<summary>实际提交的英文原始提示词（留存证据）</summary>

```text
Create ONE cohesive 2D fantasy game art sprite atlas. Perfect square image, exactly6 equal columns and6 equal rows, all36cells square, no gaps, no dividing lines, no typography, no text. Rich illustrated painterly game art with readable silhouettes, warm parchment bronze teal crimson. Each cell has own dark charcoal background except environments; objects centered and do not cross cell borders. Row1 six polished large ability emblems: steel sword, tower shield, red healing heart, ivory skull, flaming sword, icy blue crystal. Row2 six distinct full-body enemy portraits: goblin knife fighter, armored skeleton, violet witch, stone golem, red horned dragon boss, green swamp slime. Row3 six medieval cartography tile illustrations: stone castle on hill, golden wheat farm, military barracks, colorful market town, dense forest with stream, rocky mountain mine. Row4 five separate detailed alchemy ingredient icons: sage herb bundle, red mushroom, blue crystal shards, silver moon flower, golden dragon scale; sixth cell detailed bubbling cauldron. Row5 four separate distinct potion vials: red healing round flask, blue curing slender bottle, gold strength squared bottle, green antidote bulb bottle; fifth an open spellbook; sixth treasure chest of coins. Row6 six illustrated environments: arcane dungeon hall with runes, cozy wooden alchemist shop with shelves, parchment medieval kingdom map, enchanted forest puzzle clearing, magical letter tile table with blank ivory tile(no letters), candlelit dice gambling table with blank dice(no pips). Detailed artwork recognizable at96pixels. Real illustrated asset sheet, not geometric UI or screenshot.
```

</details>

## 工业图集提示词

为工业解谜与工厂网页游戏制作一张高质量插画精灵图集。正方形、严格六列六行、均匀方格，不要文字、标签、页边距。物体在各格居中，80 px 下可辨认，不跨边界。采用青铜、铜、钢和深电路板绿色的精细机械绘画，带细微金属纹理；物体格使用深背景。

第一行六种电子元件，有金属引脚及不同外壳：只标小曲线逻辑符号的 AND 芯片、曲线符号 OR 芯片、三角与圆符号反相器、双曲线符号 XOR 芯片、信号分路接头、延时钟元件；不得出现字母。第二行六台等距视角工厂设备：矿石钻机、发光冶炼炉、机器人零件制造机、运输／销售站、仓库、多输入高级组装机。第三行六张俯视金属管道：水平直管、左至下弯管、左／右／下 T 管、左右在上且上下在下的隔离双通道交叉管、水平进出的储水箱、绿色搪瓷耐酸直管。第四行六种资源：矿石块、钢锭、齿轮零件、金色货币、红色化学桶、蓝色冷却罐。第五行六种障碍／控件：开裂混凝土堵塞、挂锁固定管、荧光绿酸罐、蒸汽压力阀、带铜接头的线缆、发光电源端口。第六行六种环境：带小工厂的轨道星球表面、俯视绿色电路板工作台、工业管道设施、锈蚀工厂控制室、干净实验室管网背景、无字机械研究蓝图工作台。

每格独立绘制，不要截图、界面面板或文字。

<details>
<summary>实际提交的英文原始提示词（留存证据）</summary>

```text
Create ONE high-quality illustrated sprite atlas for industrial puzzle and factory web games. Square image, exactly6 equal columns and6 equal rows, uniform square cells, no text, no typography, no labels, no margins. Each object centered within its own cell, recognizable at80pixels, does not cross cell boundaries. Detailed painted mechanical art with bronze copper steel and deep PCB green, subtle metallic texture. Dark background in object cells. Row1 six electronic components, visible metal pins and different detailed housings: AND gate chip marked only with tiny curved gate symbol(no letters), OR gate chip with curved symbol, inverter chip with triangle and circle symbol, XOR chip with doubled curved symbol, signal splitter junction, delay clock component. Row2 six factory machines seen isometrically: ore drilling rig, glowing metal smelter, robotic parts fabricator, shipping/sales depot, storage warehouse, advanced multi-input assembly machine. Row3 six top-down metal pipe tiles with large clear openings on a dark background: straight horizontal pipe, elbow pipe left-to-bottom, T-junction left-right-bottom, separated two-channel crossing pipe left-right above top-bottom(no mixing), reservoir water tank with horizontal in/out, green enamel acid-resistant straight pipe. Row4 six resource icons: rocky ore chunk, steel ingot, metal cog parts, gold credit coins, red chemical barrel, blue coolant tank. Row5 six obstacle/control icons: cracked concrete blockage, padlocked fixed pipe, neon green acid tank, steam pressure valve, illustrated wire cable with copper connectors, power supply terminal with glowing light. Row6 six separate detailed environments: orbital planet surface with tiny factories, green PCB workbench texture overhead, industrial plumbing facility interior, rusty factory control room, clean laboratory pipe grid background, machine research blueprint workbench with no words. Every tile distinctly painted, no screenshot, no UI panels, no text.
```

</details>

## 边检图集提示词

为虚构边境检查模拟制作一张二维插画图集，正方形，严格四列四行，共 16 格；没有可读文字、界面截图或边框。统一手绘图像小说风格，柔和橄榄绿、烟草棕、奶油纸色与灰蓝色，呈现沉郁官僚氛围和有人情味的人物。

第一行四种环境：雨中边境检查亭外景；可摆放证件的俯视木质检查桌；带炉子的狭小家庭公寓；带档案抽屉的市政办公室。第二行四张灰蓝纯背景半身像：神情坚定的戴头巾中年女性；戴帽青年码头工；穿旧大衣老人；短黑发、肩背包带的女医生。第三行四张肖像：留胡子的严肃制服守卫；戴红围巾的疲惫母亲；戴圆眼镜的年轻信使；戴眼镜的年长检查员。人物族裔外貌多样，国家虚构，不使用真实徽记。第四行四张完整证件：深蓝护照打开到空白奶油表格和通用小剪影照片；带琥珀印章的空白工作许可；带医疗十字的淡绿空白疫苗卡；带齿孔边和红圆印的棕色入境票。

不要可读字母、真实官方标志或血腥暴力。各格准确填满统一方形，肖像完整显示头肩，可作本地游戏精灵和背景。

<details>
<summary>实际提交的英文原始提示词（留存证据）</summary>

```text
Create ONE illustrated2D game art atlas for a fictional border inspection simulation, square image exactly4 equal columns and4 equal rows, 16equal square cells, no text or readable words, no UI screenshot, no borders. Cohesive hand-painted graphic novel art muted olive, tobacco brown, cream paper, slate blue; somber bureaucracy but humane characters. Row1 four environments: exterior rainy border checkpoint booth, overhead wooden inspector desk with space to arrange documents, cramped family apartment with stove, municipal office archive with filing drawers. Row2 four bust portraits against plain slate background: middle-aged woman in headscarf with determined expression, young male dockworker with cap, elderly man in a worn overcoat, female physician with short dark hair and bag strap. Row3 four portraits: stern uniformed guard with mustache, exhausted mother in red scarf, young courier with round glasses, older inspector wearing spectacles. Different ethnic appearances, fictional country no real emblems. Row4 four distinct document illustrations each entire paper visible inside cell: dark-blue passport open to blank cream fields and tiny generic silhouette photo, cream work permit with amber seal and blank form fields, pale green vaccination card with medical cross and blank fields, tan entry ticket with simple perforated edge and red circular stamp. No readable lettering, no official real emblems, no graphic violence. Each cell exactly fills its uniform square, portraits show full head and shoulders. Suitable for local game sprites and backgrounds.
```

</details>

## 《Dice Throne》补充图集

生成模式：全新生成，不透明 4×4 图集，无参考图片。主文件为 `artifacts/task-revision-20261016/game-art/dice-atlas.png`；原工具输出为 `C:/Users/Crayon/.codex/generated_images/01a1426f-b716-7683-bc6b-8d80f7280026/exec-c1d62d52-2f05-4b8f-9ae7-0a4f3e3a9ec1.png`。原样复制到 Dice Throne 参考实现／起始项目素材中，16 格均经目视检查。补充了独立的第六种普通敌人、八件单独绘制的装备，以及特殊／首领骰面。

为轻松奇幻骰子地下城浏览器游戏制作可用的 4×4 正方形精灵图集，恰好 16 个等大方格，无沟槽、说明、字母、数字或网格线。每格图标单独居中，保留充足安全边距；统一浓郁手绘童话风，深青炭色背景，暖铜与羊皮纸高光，小尺寸轮廓清晰，不跨边界。

第一行从左至右：破斗篷、发光眼和冰爪的全身幽灵霜魂；火焰附魔剑；冰霜附魔剑；华丽重型塔甲。第二行：带红宝石心的发光治疗腕带；雕骨护符；带红滴的吸血鬼獠牙吊坠；带四叶徽记的幸运金币。第三行：石刻发光蓝色防护符文；无点数、带装饰斜边的空白象牙骰面纹理；三卷火焰的龙炎徽记；龙甲鳞盾。第四行：龙口吞噬徽记；幽灵骷髅灵魂打击徽记；带闪光的大治疗心；由獠牙和红色能量组成的吸血徽记。

细节干净，光照和材质统一，不要截图模型或文字。

<details>
<summary>实际提交的英文原始提示词（留存证据）</summary>

```text
Create one production-ready 4 by 4 square sprite atlas for a whimsical fantasy dice dungeon browser game. Exactly 16 equally sized square cells, no gutters, no captions, no letters or numbers, no grid lines. Each tile is a separately centered illustrated icon with generous safe padding, consistent richly painted storybook fantasy style, dark teal charcoal background, warm copper and parchment highlights, clear readable silhouettes at small size. Do not include anything crossing tile boundaries. Row 1 left to right: a full-body spectral frost wraith character with ragged cloak, glowing eyes and icy claws; a flaming enchanted sword; an icy enchanted sword; ornate heavy tower armor. Row 2: a radiant healer wristband with ruby heart gem; a carved bone charm amulet; a vampire fang pendant with red drop; a lucky gold coin with four-leaf emblem. Row 3: a luminous blue ward rune carved into stone; a blank ivory die face texture with ornamental beveled frame and no pips; a dragon inferno emblem with three curling flames; a dragon carapace scale shield. Row 4: a dragon jaws devour emblem; a spectral skull soul-strike emblem; a greater-healing luminous heart with sparkles; a vampiric life-drain emblem of fang and red energy. Clean detailed illustrated assets, cohesive lighting and material, no screenshot mockup, no text.
```

</details>

## 《Potion Shop》图集

生成模式：使用内置图像工具全新生成，不透明背景。原输出为 `C:/Users/Crayon/.codex/generated_images/01a1426f-b716-7683-bc6b-8d80f7280026/exec-fe83ef31-f152-4d4b-94e9-44f37d306b37.png`，原样复制至 `artifacts/task-revision-20261016/game-art/potion-atlas.png`。四列四行，索引从零开始：0–3 顾客肖像，4 货架，5 快速坩埚，6 花园，7 装饰，8 配方书，9 空白价签，10 柜子，11 柜台，12–15 病症徽章。生成图集已目视检查。

为温暖的中世纪奇幻药店浏览器游戏制作正方形图集，精确 4×4、十六个等大方格，无沟槽，任何位置都不要词语、字母或数字。各主体居中且完整位于自身格内；统一温暖手绘童话风，金琥珀光、柔和森林绿、旧木、羊皮纸和浓色玻璃，每格背景为温暖深棕。

第一行：友善咳嗽的装甲骑士半身像；戴紫围巾的微笑旅行女商人；带绿色中毒斑点的担忧学徒男孩；疲惫老园丁。第二行：摆放许多不同小瓶的宽木药架升级图标；带发条炉膛的铜制快速酿造坩埚升级图标；茂盛小草药园种植箱升级图标；蜡烛花卉店铺装饰升级图标。第三行：有药瓶插画但无字的羊皮纸配方书；悬挂空白羊皮纸价签；精雕木质原料罐柜；带铃的小柜台。第四行：红色治疗心病症徽章；青绿色咳嗽肺徽章；金色力量星徽章；紫色毒滴徽章。

主体清晰可区分，游戏图标大小下保留细节，以绘画而非几何方式表现；无标志、文字或整体大边框。这是美术素材表，不是界面截图。

<details>
<summary>实际提交的英文原始提示词（留存证据）</summary>

```text
Create one square sprite atlas for a cozy medieval fantasy apothecary browser game, as a precise 4 by 4 grid of sixteen equal square cells, no gutters, no words or letters or numerals anywhere. Each subject is centered and fully inside its own cell, consistent warm hand-painted storybook style, golden amber light, muted forest greens, weathered wood, parchment and rich colored glass. Backgrounds of each individual cell should be warm dark brown. Row 1: friendly coughing armored knight bust; smiling traveling merchant woman bust wearing a purple scarf; worried young apprentice boy bust with green poison spots; tired elderly gardener bust. Row 2: wide wooden potion shelf upgrade icon holding many tiny different vials; copper fast-brewing cauldron upgrade icon with clockwork firebox; small lush herb garden planter upgrade icon; candle-and-flower shop decor upgrade icon. Row 3: parchment recipe book with illustrated vials but absolutely no text; hanging blank parchment price tag; richly carved wooden cabinet of ingredient jars; small counter desk with a bell. Row 4: illustrated red healing-heart ailment badge; turquoise coughing-lungs ailment badge; gold strength-star ailment badge; violet poison-drop ailment badge. Make subjects distinct with refined detail at game icon size, painterly rather than geometric, no logos, no text, no large overall border. This is an art asset sheet, not a UI screenshot.
```

</details>
