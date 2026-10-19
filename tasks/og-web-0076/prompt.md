# Bind a Julia material to a full-viewport panel

Complete `createPanel(root,{TexturePanel,material,texture})` in `component.js` and update `material.json`. The supplied WebGL renderer and `julia.frag` already implement the image effect. Configure the panel and material without editing that shader or the supplied rendering services.

- **R1 — Panel assembly.** Create a `TexturePanel`, append its `element` to the supplied root, and return the panel. Set its `anchors` to [0,0,1,1] and `offsets` to [0,0,0,0], filling the viewport with no border offset.
- **R2 — Exact resource binding.** Assign the provided material object to the panel's `material` and the provided image object to its `texture`. Preserve their identities. The image is the supplied `icon.png`; the material uses `julia.frag`. Do not replace them with unrelated resources or a pre-rendered picture.
- **R3 — Material seed.** Change only the material's `seed` value in `material.json` to [0.40,-0.20]. Keep every other material parameter and the shader source unchanged, including the shader's default seed [-0.794084,0.136444]. The material override must drive actual rendered output.
- **R4 — Growth and resizing.** Set `growX` and `growY` to `both`. Follow viewport resizing. If a minimum width or height exceeds the allocated size, the supplied layout service must expand the panel equally in both directions on that axis.
- **R5 — Working preview.** Preserve the minimum-width/height controls and Reset size. Render the actual material across the full panel, using the supplied shader and image resource. Reset size restores viewport filling.

The texture panel, shader compilation, drawing and layout calculations are provided. Acceptance checks resource identity, the material file, unchanged shader bytes, independent fractal pixel calculations, changed uniforms, resizing and centered minimum-size growth. Keep the page runnable through `index.html`.
