# Collectible overlay review

All33 original instructions, main scenes and validator differences were read. Both original JPEGs were inspected visually and their bytes were compared across the variants. The old Web adaptation preserved geometric targets and transforms but replaced the illustrated levels with generated raster fixtures and expressly excluded the original image's visual complexity. That replacement is not equivalent for a visual localization and contour-fitting task.

The repair restores original images, independently editable polygons, hierarchy, semi-transparency and original IoU thresholds. Supplied native scene services become a supplied SVG renderer driven by level.json and overlays.json. The solver still determines the geometry visually; target coordinates remain private and are not placed in the starter or prompt. Shared wording is directly authored once for variants whose substantive requirements are the same, and copied without a content generator; their individually transcribed scene data and private target differences remain separate.

Removed: generated raster replacements, blanket asset/visual-complexity exemptions and the adaptation's arbitrary cyan fill / fixed0.45 alpha. Replaced: native scene hierarchy/shape resources with SVG groups/polygons and declarative data. Added: original-asset hashes, actual overlay pixel checks, inherited group transforms in geometric acceptance and deterministic one-to-one target matching. Visibility/reset and responsive presentation are supplied inspection services, not additional solver programming requirements. Native editor manipulation is replaced by text configuration, so tool-use difficulty is not claimed identical. No empirical model difficulty baseline has been rerun.

The six-coin tests retain analytic polygon clipping at90% IoU. The single-star and gemstone tests retain source pixel-center sampling at85% IoU, including concave stars. Coin numbering can match any target bijectively. The source used greedy matching and ignored the containing highlight group's transform; the repaired check searches a complete one-to-one matching and measures transformed geometry. This avoids false rejection from numbering and false success from a displaced group. Vertex lists need not exactly match the oracle.

| Task | Subject | Parent position | Uniform scale | Rotation radians | Individual review / repair |
| --- | --- | --- | --- | --- | --- |
| og-web-0110 | Six circular coin highlights |55.5,5|1|0|Original529×350 image; six shapes, at least8 vertices and90% IoU. Source has no explicit scale assertion; retain supplied unit scale. Passed staged QA. |
| og-web-0111 | Six circular coin highlights |55.5,5|0.55|0|Retain smaller scene scale and six targets. Passed staged QA. |
| og-web-0112 | Six circular coin highlights |55.5,5|0.65|0|Retain its distinct scene scale. Passed staged QA. |
| og-web-0113 | Six circular coin highlights |55.5,5|0.75|0|Retain its distinct scene scale. Passed staged QA. |
| og-web-0114 | Six circular coin highlights |55.5,5|0.85|0|Retain its distinct scene scale. Passed staged QA. |
| og-web-0115 | Six circular coin highlights |55.5,5|0.95|0|Retain its distinct scene scale. Passed staged QA. |
| og-web-0116 | Six circular coin highlights |219.175,37.657|0.55|0.37|Targets5/6 have different positions/scales from216; retained individually. Passed staged QA. |
| og-web-0117 | Six circular coin highlights |116.307,148.276|0.65|-0.43|Targets4/5/6 have different positions/scales from216; retained individually. Passed staged QA. |
| og-web-0118 | Six circular coin highlights |155.049,8.622|0.75|0.22|Base targets with this inherited rotation. Passed staged QA. |
| og-web-0119 | Six circular coin highlights |80.204,56.83|0.85|-0.11|Base targets with this inherited rotation. Passed staged QA. |
| og-web-0120 | Six circular coin highlights |75.574,3.835|0.95|0.04|Base targets with this inherited rotation. Passed staged QA. |
| og-web-0121 | Single star |53,5.5|0.65|0|Original1610×980 image; image offset[0,-0.76923084], concave outline with at least10 vertices,85% IoU. Passed staged QA. |
| og-web-0122 | Single star |147.06,123.832|0.58|-0.1|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0123 | Single star |182.04,28.342|0.6|0.08|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0124 | Single star |163.975,154.92|0.55|-0.14|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0125 | Single star |184.431,4.461|0.61|0.12|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0126 | Single star |165.228,108.717|0.57|-0.06|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0127 | Single star |213.586,3.171|0.59|0.15|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0128 | Single star |173.749,180.879|0.53|-0.18|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0129 | Single star |161.296,41.702|0.61|0.04|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0130 | Single star |211.163,22.665|0.55|0.16|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0131 | Single star |115.625,61.995|0.64|-0.03|Same local target and image offset; distinct parent transform retained. Passed staged QA. |
| og-web-0132 | Gemstone |53,5.5|0.65|0|Original1610×980 image; image offset[1.5384617,11.538463], at least4 vertices,85% IoU and purple tint. Passed staged QA. |
| og-web-0133 | Gemstone |142.435,133.737|0.58|-0.12|Same local target/tint/offset; distinct parent transform retained. Passed staged QA. |
| og-web-0134 | Gemstone |170.225,12.571|0.62|0.09|Same local target/tint/offset; distinct parent transform retained. Passed staged QA. |
| og-web-0135 | Gemstone |168.697,168.035|0.54|-0.16|Same local target/tint/offset; distinct parent transform retained. Passed staged QA. |
| og-web-0136 | Gemstone |202.751,1.477|0.6|0.14|Same local target/tint/offset; distinct parent transform retained. Passed staged QA. |
| og-web-0137 | Gemstone |176.049,108.474|0.56|-0.05|Same local target/tint/offset; distinct parent transform retained. Passed staged QA. |
| og-web-0138 | Gemstone |188.509,-25.555|0.63|0.16|Negative parent y is intentional and retained. Passed staged QA. |
| og-web-0139 | Gemstone |180.812,188.842|0.52|-0.19|Same local target/tint/offset; distinct parent transform retained. Passed staged QA. |
| og-web-0140 | Gemstone |158.137,46.505|0.61|0.03|Same local target/tint/offset; distinct parent transform retained. Passed staged QA. |
| og-web-0141 | Gemstone |252.652,15.589|0.55|0.18|Same local target/tint/offset; distinct parent transform retained. Passed staged QA. |
| og-web-0142 | Gemstone |118.631,56.766|0.64|-0.02|Same local target/tint/offset; distinct parent transform retained. Passed staged QA. |

Coin scenes use a supplied640×360 inspection viewport; star/gem scenes use1152×648. These are browser presentation choices, not inferred original explicit viewport requirements. All parent transforms and image-local positions remain as supplied. The source rotated-coin scenes already contain their requested rotations; they are retained in the starter rather than turned into an extra programming task.

The gemstone source validator requires effective normalized red0.35–1, green0.05–0.75, blue0.45–1 and blue>green although the short instruction omits that tint restriction. The repaired prompt must disclose it. The source star image offset and gemstone image offset are different and must not be normalized away.

QA evidence for all33 variants: three-repeat reference checks, targeted geometry/opacity/tint/image-position mutations, four visual faults and starter rejection. Browser JPEG resampling can change a few pixels between show/hide/reset; the reset screenshot uses a small mean error tolerance, while asset bytes, transform data and geometric IoU are checked independently. The navigation guard now briefly retries blank pixels while asynchronous scene/image loading completes; delayed rendering and permanently blank rejection have separate passing regression tests. Final evidence is bound to current task/shared-harness hashes in validation/task-audit.json.
