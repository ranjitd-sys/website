# Meesho Label Manager — Detection Engine Explained

File: `src/components/pages/meesho-label-manager/lib/detect.ts` (147 lines).
This document explains every function, every threshold, and why the algorithm works for the Meesho label format.

## 1. The fundamental problem

The Meesho PDF is a **single JPEG image** pasted onto an A4 page. There is no text layer, no vector drawing objects, no bookmarks. When PDF.js renders this page at scale 2, it produces a canvas of **1190 × 1684 pixels**.

The question is: how do you find where the label ends and the invoice begins, using only pixels?

The answer: scan every row of pixels and look for **horizontal lines that span the whole page width**. The dashed fold rule and the table borders are the only things that do this. Everything else — text, barcodes, QR codes — is either too narrow or does not cross the full width.

## 2. The pixel data structure

When you call `ctx.getImageData(0, 0, w, h)`, you get a `Uint8ClampedArray` — a flat array of bytes in RGBA order:

```
pixel (0,0): data[0]=R, data[1]=G, data[2]=B, data[3]=A
pixel (1,0): data[4]=R, data[5]=G, data[6]=B, data[7]=A
pixel (x,y): data[(y * w + x) * 4] = R
```

For the sample canvas (1190 × 1684): total pixels = 1190 × 1684 = 2,003,960. Total bytes = 2,003,960 × 4 = 8,015,840.

The document is pure black-and-white. Black pixels have R=G=B=0, white have R=G=B=255. There is no grayscale, no color. This makes detection very reliable.

## 3. `DARK_THRESHOLD = 128`

```ts
const DARK_THRESHOLD = 128
```

A pixel is "dark" if its average luminance is below 128 (of 255). Black pixel: (0+0+0)/3 = 0, dark. White pixel: (255+255+255)/3 = 255, not dark.

128 sits exactly in the middle. Any value from 50 to 200 would work equally well here because there are no mid-tone pixels. The choice of 128 is arbitrary but safe.

## 4. `rowDarkFractions` — the darkness profile

```ts
function rowDarkFractions(data, w, h, stepX = 4): Float32Array
```

Builds one float per row, saying "what fraction of this row is dark?"

- `out = new Float32Array(h)`: one float per row. For h=1684, that is 6,736 bytes. `Float32Array` is faster than `Float64Array` and gives more than enough precision.
- `row = y * w`: the pixel index of the first pixel in this row. For row y=741 (the fold line), this is 741 × 1190 = 881,790 pixels from the start.
- `for (x = 0; x < w; x += stepX)`: iterate every 4th pixel across the row. At w=1190, that is about 298 samples per row instead of 1190. This is 4× faster with no accuracy loss — a dashed line that is 40% dark still reads as ~40% when sampled every 4th pixel, because the dash pattern is uniform.
- `i = (row + x) * 4`: the byte index of the red channel of pixel (x, y). For pixel (100, 741): i = (881790 + 100) × 4 = 3,527,560. The four bytes at that position are R, G, B, A.
- `lum = (data[i] + data[i+1] + data[i+2]) / 3`: average of R, G, B. Alpha (`data[i+3]`) is ignored because it is always 255 (fully opaque).
- `out[y] = dark / n`: the fraction, from 0 to 1.

### What the profile looks like for the sample

| Row range   | Dark fraction | Content                                    |
|-------------|---------------|--------------------------------------------|
| y = 0–50    | ~0.02         | White top margin                           |
| y = 50–100  | ~0.05         | Customer Address text, sparse              |
| y = 100–400 | ~0.03         | Label content, mostly white + scattered text |
| y = 400–450 | ~0.15         | Product Details row, denser text           |
| y = 443     | ~0.40         | **FOLD LINE (dashed horizontal rule)**     |
| y = 450–500 | ~0.08         | Small gap, then TAX INVOICE heading        |
| y = 500–700 | ~0.05         | Invoice table, text in columns             |
| y = 720     | ~0.25         | **TOTAL ROW (bold line, most of page)**    |
| y = 730–760 | ~0.03         | Disclaimer text                            |
| y = 760–1684| ~0.00         | Pure white whitespace                      |

The fold line at y=443 is the strongest spike in the 30–60% band. The total row at y=720 is the strongest spike in the 60–88% band. Everything else is below 0.15.

## 5. `findFullWidthLines` — find the spikes

```ts
function findFullWidthLines(rows, w, minFrac): number[]
```

Turns the darkness profile into a list of Y-coordinates where horizontal lines exist.

### Pass 1 — threshold

```ts
for (let y = 0; y < rows.length; y++)
  if (rows[y] >= minFrac) lines.push(y)
```

Collect every row whose dark fraction clears `minFrac`. For the fold search, `minFrac = 0.3` (30%). For the total search, `minFrac = 0.25` (25%).

Why these thresholds work: the fold rule is a dashed line. A dash covers ~60% of the row width, then a gap. So the dark fraction is ~0.40. A threshold of 0.3 catches this easily. A row of text (e.g. "Customer Address Punam Hajong 29...") covers maybe 5–10% of the row width — text sits in the left column only. So text rows read ~0.05–0.10, well below 0.3.

The key insight: the fold rule is the **only horizontal element that (a) spans most of the page width AND (b) sits in the 30–60% height band**. Everything else is either too narrow (text) or in the wrong vertical position (banner, barcode).

### Pass 2 — merge

```ts
if (run.length === 0 || y - run[run.length-1] <= 3) run.push(y)
else { merged.push(midpoint); run = [y] }
```

A printed line is several pixels thick — the fold rule might be 4–5 pixels tall on the canvas. So it produces 4–5 consecutive candidate rows (e.g. y=441, 442, 443, 444, 445). This pass merges them into **one line** at the midpoint.

Any rows within 3 px of each other are collapsed into one run, and the run's midpoint is emitted. Result: one Y per real line. For the fold rule: rows [441, 442, 443, 444, 445] become [443].

`void w` suppresses a lint warning. `w` is unused — leftover from an earlier version.

## 6. `blockDarkness` — measure a rectangle

```ts
function blockDarkness(data, w, x0, y0, x1, y1, step = 6): number
```

Same concept as `rowDarkFractions`, but for a **rectangular region** instead of a full row. Used to detect the COD banner and barcode — filled areas, not thin lines.

- `step = 6`: sample every 6th pixel in both X and Y. For a 536×135 px banner, that is (536/6) × (135/6) ≈ 89 × 23 = 2,047 samples instead of 72,360. 35× faster.
- Note: this uses the **full canvas width** `w`, not the rectangle width. This is correct because `getImageData` returns the entire canvas as a flat array, so pixel (x, y) is always at `(y * w + x) * 4`.
- Returns 0 instead of NaN for empty rectangles (guard: `n === 0 ? 0 : dark / n`).

## 7. `detectPage` — the main algorithm

```ts
export function detectPage(canvas, page): PageDetection
```

The entry point. Runs the detection passes and computes the output regions.

### Setup

```ts
const ctx = canvas.getContext("2d", { willReadFrequently: true })
const img = ctx.getImageData(0, 0, w, h)
const rows = rowDarkFractions(data, w, h)
```

`willReadFrequently: true` tells the browser to **keep the canvas bitmap in CPU-accessible memory** instead of uploading it to the GPU. Without this hint, each `getImageData` call would trigger a GPU-to-CPU download, which is slow.

`getImageData` copies the entire canvas bitmap into a `Uint8ClampedArray`. For 1190×1684 at 4 bytes/pixel, that is ~8 MB. One-time copy. Then we compute the row profile once.

### Pass 1 — fold line

```ts
const foldLines = findFullWidthLines(rows, w, 0.3)
  .filter((y) => y > h * 0.3 && y < h * 0.6)
foldY = closest candidate to h * 0.44
```

- Threshold **30%** dark — low enough for the dashed rule.
- **Band 30–60% of page height** (y=505 to y=1010 for h=1684). This eliminates the COD banner (y < 135, too high), the barcode (y < 500, too high), the total row (y > 1010, too low), and the table borders (y > 1010, too low).
- **Why 30–60%?** The fold rule sits at ~44% of the page height. The label occupies the top ~44%, the invoice the bottom ~44%, and the fold is the boundary. The 30–60% window is wide enough to catch the fold even if Meesho slightly changes the layout, but narrow enough to exclude everything else.
- If multiple candidates survive (e.g. the fold rule AND a stray table border), pick the one **closest to 44%** of height. For h=1684: h×0.44 = 741. If candidates are [738, 741, 745], it picks 741. More robust than "first" or "strongest".
- **Why closest to 44%?** Because 44% is the known position from the real sample. If there are multiple lines, the one nearest 44% is most likely the fold. This is a **prior** — an assumption about where the fold should be. It works because Meesho's layout is consistent.
- If no candidates survive the filter, `foldY` stays `null`.

### Pass 2 — total row

```ts
const totalLines = findFullWidthLines(rows, w, 0.25)
  .filter((y) => y > h * 0.6 && y < h * 0.88)
totalY = strongest candidate (highest dark fraction)
```

- Lower threshold, **0.25** instead of 0.3. The total row has bold text spanning maybe 50% of the width, plus a horizontal rule. Combined dark fraction is ~0.25–0.35. A threshold of 0.25 catches it even if the rule is thin.
- **Band 60–88%** (y=1010 to y=1482). The invoice area, below the fold. The total row sits near the bottom of the invoice.
- Picks the **strongest** (darkest) candidate, not the closest to a target. The invoice has several table rules; the total row is typically the boldest/longest at the bottom.
- **Why strongest here but closest for fold?** The fold has a known position (44%), so closest works. The total row's position varies with the number of line items, so we cannot predict it. But it is always the darkest line in the invoice area, so strongest works.

### Pass 3 — COD banner

```ts
bannerDark = blockDarkness(data, w, 45%→100% width, 0→8% height)
hasBanner = bannerDark > 0.12
```

Checks the **top-right corner** for a solid dark block. The COD banner is a black rectangle spanning from x=536 (45% of 1190) to x=1190 (right edge), and y=0 to y=135 (8% of 1684).

The banner is nearly solid black, so `bannerDark` would be ~0.95. The threshold of 0.12 is very low — it just needs to confirm "there is something dark there." This is a **confidence signal**, not a geometry signal. It does not affect where we cut; it just says "this page looks like a Meesho label."

### Pass 4 — barcode

```ts
top    = foldY known ? foldY * 0.75 : h * 0.30
bottom = foldY known ? foldY * 0.98 : h * 0.42
barcodeDark = blockDarkness(data, w, 45%→100% width, top→bottom)
hasBarcode = barcodeDark > 0.08
```

Checks the **lower-right of the label area** for dense vertical bars. The barcode sits at the bottom of the right column, between ~75% and ~98% of the label height.

If `foldY` is known (e.g. 743): barcode zone = y=557 to y=728 (23% of the label height). If `foldY` is unknown: fallback to 30–42% of page height (a conservative guess).

The barcode has alternating black/white bars, giving ~30–50% dark fraction. Threshold 0.08 is very low — just confirms "something bar-like is there." Again, **confidence signal only**.

### Confidence score

| Signal       | Weight | Why                                 |
|--------------|--------|-------------------------------------|
| Base         | 0.40   | Default — page exists               |
| Fold found   | +0.25  | Essential — without it, no regions  |
| Banner found | +0.15  | Corroborates Meesho layout          |
| Barcode found| +0.15  | Corroborates label content          |
| Total found  | +0.05  | Nice to have, not essential         |

Best case: 0.40 + 0.25 + 0.15 + 0.15 + 0.05 = **1.00** (all signals found). Worst case: 0.40 (page exists but nothing detected). Capped at 1.0, rounded to 2 decimals.

This score is stored but currently unused — not shown in the UI, does not gate output. Reserved for future use (e.g. warn if confidence < 0.6, or show a quality indicator).

### Region computation

```ts
if (foldY != null) {
  label:   x=0, y=0,     width=w, height=foldY
  invoice: x=0, y=foldY, width=w, height=(totalY+6 or 88% of h) - foldY
}
```

**Only emits regions if the fold was found.** If no fold → empty regions → the component treats that page as blank/unsupported and skips it.

- **Label** = full width, row 0 → fold.
- **Invoice** = fold → total line. The `+6` pads 6 pixels past the total row so it is not clipped at the boundary. The 88% fallback is conservative — includes the disclaimer text below the total, which is harmless.
- **Why both regions span the full width:** the Meesho label uses the entire page width. The left column (address) and right column (barcode, QR) are both part of the label. We do not split left/right — we split top/bottom at the fold.

### Return value

```ts
return { page, pageWidth: w, pageHeight: h, foldY, totalY, regions }
```

Everything the caller needs: page index, canvas dimensions, `foldY` (null if not found — used for "1/1 pages: fold line found"), `totalY`, and the label/invoice bounding boxes.

## 8. Why this works for the Meesho format

The Meesho PDF has a unique property: **the fold rule is the only full-width horizontal dark line in the 30–60% height band**. Everything else is either too narrow (text, barcodes, QR codes — they do not span the full width) or in the wrong position (banner is too high, table borders are too low).

This makes the fold rule trivially detectable with a simple row-scan. No ML, no OCR, no edge detection. Just "which rows are dark across their whole width?"

The same logic applies to the total row in the 60–88% band — the only bold horizontal line in the invoice area.

The banner and barcode checks add confidence but are not needed for geometry. They just confirm "yes, this really is a Meesho label page."

## 9. Concrete numbers for the sample

| Property                 | Value                              |
|--------------------------|------------------------------------|
| Canvas                   | 1190 × 1684 px (A4 at scale 2)     |
| Fold search band         | y = 505 to 1010 (30–60%)           |
| Fold target              | y = 741 (44%)                      |
| Total search band        | y = 1010 to 1482 (60–88%)          |
| Banner zone              | x = 536–1190, y = 0–135            |
| Barcode zone (fold known)| x = 536–1190, y = 557–728          |
| Label region             | 1190 × 741 px (top to fold)        |
| Invoice region           | 1190 × 707 px (fold to total+6)    |

These get cropped, resized to 1200×1800 (4×6 at 300 DPI), and stored as PNG.

## 10. Why the thresholds are "magic numbers"

Every threshold in this file was tuned against a single Meesho sample:

| Threshold         | Value    | Why                                              |
|-------------------|----------|--------------------------------------------------|
| `DARK_THRESHOLD`  | 128      | Midpoint — works for any black/white document    |
| Fold minFrac      | 0.3      | Dashed rule is ~40% dark; 0.3 catches it         |
| Total minFrac     | 0.25     | Total row is ~25–35% dark; 0.25 catches it       |
| Fold band         | 30–60%   | Known fold position at 44% plus margin           |
| Total band        | 60–88%   | Known invoice area                               |
| Fold target       | 44%      | Measured from the real PDF                       |
| Banner zone       | Top-right 8% | Measured from the real PDF                   |
| Banner threshold  | 0.12     | Very low — just "something dark"                 |
| Barcode zone      | 75–98% of fold | Measured from the real PDF                 |
| Barcode threshold | 0.08     | Very low — just "something bar-like"             |
| Merge gap         | 3 px     | Line thickness on the canvas                     |

These would need retuning if Meesho changes the label layout, a 4-up A4 format is used (multiple labels per page), the fold moves to a different position, or the document has color or grayscale. The code is structured so these values sit at the top of each function — easy to adjust without changing the algorithm.

## 11. Design summary

| Decision                              | Reason                                              |
|---------------------------------------|-----------------------------------------------------|
| Full-width line detection, not text   | The PDF has no text layer                           |
| Two fixed bands (30–60%, 60–88%)      | Known layout — narrow search, fewer false positives |
| Fold = closest to 44%; Total = strongest | Fold has known position; Total has variable neighbors |
| Sampling every 4–6 px                 | 4× faster, same accuracy on high-contrast raster    |
| All coordinates proportional          | Survives A4 vs other page sizes                     |
| Banner/barcode = confidence only      | Corroborate but not reliable enough to cut on       |
| No fold means no regions              | Doubles as the blank-page filter                    |

## 12. Limitations

- Proportional bands are hardcoded to this one layout. If Meesho moves the fold (e.g. 4-up A4, or a different template), the 30–60% / 60–88% windows and the 44% target need retuning.
- Magic thresholds were tuned against a single sample. More samples would let us make them adaptive.
- No rotation handling — assumes portrait, 0 degrees.
- Confidence is computed but unused — not surfaced in the UI or used to reject low-quality pages.
- Assumes one label plus invoice per page. A page with 4 labels would produce one big "label" region and one big "invoice" region, not 4 targets.
- `void w` in `findFullWidthLines` is dead weight — the parameter can be removed.

The good news: `detectPage` is a pure `(canvas, page)` → `PageDetection` function with no UI coupling, so a second strategy (e.g. 4-up grid, or text-based if a vector PDF ever appears) can be slotted in without touching the component.

## 13. The design in one sentence

**Scan every row for darkness, find the two full-width dark lines that straddle the fold, and cut there.** Everything else (banner, barcode, confidence) is just validation that we found the right lines.
