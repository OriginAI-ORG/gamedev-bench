# Assemble an inset control menu

Complete `panel.html` and `panel.css` for the supplied browser layout preview. The task is HTML/CSS control assembly; preview loading, reset and minimum-size inspection are supplied.

- **R1 — Panel.** Make `#ui` a left-aligned panel of width 320 pixels spanning the viewport height. Use the supplied panel color [37,56,76] with background alpha 0.784314. Apply transparency only to the panel background; descendants remain opaque. When the supplied `--minimum-panel-height` exceeds viewport height, grow equally above and below the vertical center.
- **R2 — Menu.** Place `#menu` at panel-local top 0, with left edge 10 and right edge 310 pixels. Arrange its two child rows vertically. Retain these horizontal offsets when the viewport changes or the panel grows; let the rows determine the menu's content height.
- **R3 — Fullscreen row.** Add `#fullscreen-row` as a horizontal row containing `#fullscreen-label` with exact text `(F)ull Screen: ` and a native checkbox `#fullscreen`, checked by default. Associate the label with the checkbox. Preserve native pointer, focus and keyboard toggling.
- **R4 — Fractal row.** Add `#fractal-row` as a horizontal row containing `#fractal-label` with exact text `Select Fractal: `, followed by enabled buttons `#mandelbrot` and `#julia` displaying `Mandelbrot` and `Julia`. Preserve this child order and normal keyboard focus.
- **R5 — Preview.** Use the provided theme and keep the minimum-height input and Reset functional. Reset recreates a single panel with the checkbox checked. These controls form a layout sample; no fractal renderer or fullscreen application logic is required.

Acceptance checks exact text, checked state, offsets, hierarchy, panel-only alpha, viewport resize and centered minimum-height growth. Keep the page runnable through `index.html`.
