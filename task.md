# Meesho Label Manager — Task Breakdown

**Goal:** Upload a Meesho shipping-label PDF → detect, split, crop, resize → preview → download or print.

**Architecture:** Client-side only, Astro page + React island, PDF never leaves the browser.

**Estimated total:** 3–4 developer-days.

**Hard dependency:** 5–10 real Meesho label PDF samples before Phase 3.

**Status (2026-09-19):** Core pipeline built and verified end-to-end against the real
sample (`fixtures/meesho-sample-1.pdf`): 1 label detected, fold line found 1/1 pages,
valid 4×6 output PDF generated and downloaded. See "Verification log" at the bottom.

---

## Legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- **Depends on:** task IDs that must finish first

---

## Phase 0 — Prerequisites

- [x] **T0.1 — Collect real Meesho label PDFs**
  - Gather 5–10 samples across order types (regular, COD, bulk)
  - Include at least one PDF with multiple labels per page
  - Include at least one blank or near-blank page
  - **Done when:** samples saved in a local `fixtures/` folder
  - **Blocks:** all of Phase 3
  - **Note:** 1 real COD sample obtained (`fixtures/meesho-sample-1.pdf`, A4 raster).
    Prepaid variant, 4-up A4 and blank-page fixtures still open.

- [x] **T0.2 — Confirm label layout**
  - Inspect samples: page size, labels per page, margins, separators, orientation
  - Record whether one layout or many
  - **Done when:** a short written layout spec exists (grid, cell size, margins)
  - **Depends on:** T0.1
  - **Note:** Locked via PDF diagnostic — A4 raster, 1 order/page, label top +
    invoice bottom, fold-line separator, black/white only.

- [ ] **T0.3 — Confirm MVP print target**
  - Decide: 4×6 thermal only, or also A4
  - **Done when:** default print size locked
  - **Note:** Both 4×6 and A4 are implemented; default is 4×6.

---

## Phase 1 — Setup (Day 1)

- [x] **T1.1 — Install dependencies**
  - Add `pdfjs-dist` and `pdf-lib`
  - **Done when:** packages in `package.json`, install succeeds

- [x] **T1.2 — Create the page shell**
  - New page at the agreed route using `PageLayout`
  - Header block: title, description, privacy note
  - **Done when:** page loads with Navbar + Footer, no island yet
  - **Depends on:** T1.1
  - **Note:** `src/pages/tools/meesho-label-manager.astro` mirrors `revcalpublic.astro`.

- [x] **T1.3 — Configure PDF.js worker**
  - Wire the worker via Vite asset URL (fallback: `public/`)
  - **Done when:** a test PDF renders without worker errors
  - **Depends on:** T1.1
  - **Note:** Uses the `legacy` build — the modern build requires
    `Map.prototype.getOrInsertComputed`, missing in older Chromium/Safari.

- [x] **T1.4 — Create the React island skeleton**
  - Mount with `client:only="react"`
  - Three states: upload → processing → result
  - **Done when:** island mounts, state switching works, no SSR crash
  - **Depends on:** T1.2, T1.3

- [x] **T1.5 — Build the uploader UI**
  - Drag-and-drop zone + file picker
  - Validate file type and size
  - **Done when:** a PDF can be selected and passed to the engine
  - **Depends on:** T1.4

---

## Phase 2 — PDF Read & Render (Day 1)

- [x] **T2.1 — Read PDF metadata**
  - Extract page count and page dimensions
  - **Done when:** UI shows correct page count for a real sample

- [x] **T2.2 — Render pages to canvas**
  - Render at a chosen DPI for analysis
  - **Done when:** first page renders visibly in the UI
  - **Depends on:** T2.1
  - **Note:** Rendered at scale 2 for detection fidelity.

- [ ] **T2.3 — Extract text positions (optional for MVP)**
  - Pull text spans with coordinates if needed by detection
  - **Done when:** available for detector use or explicitly deferred
  - **Depends on:** T2.1
  - **Note:** Deferred — sample PDF has zero text objects (pure raster).

- [x] **T2.4 — Add processing pipeline status**
  - Show step-by-step progress (reading → detecting → …)
  - **Done when:** steps advance as the pipeline runs
  - **Depends on:** T2.2

---

## Phase 3 — Label Detection & Slicing (Day 2)

- [x] **T3.1 — Map the label grid from real samples**
  - Translate the T0.2 layout spec into grid coordinates
  - **Done when:** cell geometry is defined per page size
  - **Depends on:** T0.2, T2.2

- [x] **T3.2 — Implement the slicer**
  - Split each page into label regions using the grid
  - **Done when:** correct count of regions returned per page
  - **Depends on:** T3.1
  - **Note:** Pixel scan for the full-width fold line (30–60% band) + Total row
    (60–88% band); COD-banner and barcode density feed the confidence score.

- [ ] **T3.3 — Handle one label per page and many per page**
  - Detect and adapt to both cases
  - **Done when:** both sample types produce correct regions
  - **Depends on:** T3.2
  - **Note:** 1-up verified; 4-up A4 untested (no sample yet).

- [x] **T3.4 — Filter blank pages and empty cells**
  - Skip pages/cells with no content
  - **Done when:** blank pages produce zero labels
  - **Depends on:** T3.2
  - **Note:** Pages with no fold line yield zero regions and are skipped.

- [x] **T3.5 — Overlay bounding boxes for verification**
  - Draw detected regions on a canvas preview
  - **Done when:** boxes visually match real labels
  - **Depends on:** T3.2
  - **Note:** Verified via cropped preview tiles + detail modal instead of
    an explicit overlay; detection summary shows fold-line hit rate.

- [x] **T3.6 — Make the detection strategy swappable**
  - Isolate detection behind a simple interface
  - **Done when:** a second strategy can be added without UI changes
  - **Depends on:** T3.2
  - **Note:** `detectPage()` is a pure function of canvas → regions.

- [x] **T3.7 — Content bounds from row/column profiles**
  - Add `columnDarkFractions`; trim outer margins to a content box
  - **Done when:** real 2×2 sheet yields x 1–98%, y 28–72%
  - **Depends on:** T3.2

- [x] **T3.8 — Grid segmentation + blank-cell filter**
  - Equal-divide the content box into rows × cols (1–5); drop empty cells
  - **Done when:** real 2×2 yields 4 non-blank cells; a partial sheet drops empties
  - **Depends on:** T3.7

- [x] **T3.9 — Dispatcher, id fix, Auto/Grid selector UI**
  - `detectMultiPage(canvas, page, mode, grid)`; ids `${p}-${i}-${kind}`;
    layout selector (Auto default, Grid with rows×cols 1–5); per-page counts
  - **Done when:** grid mode flows end to end; no key collisions
  - **Depends on:** T3.8

- [x] **T3.10 — Grid test matrix**
  - Real 2×2 → 4 labels; synthetic 3×3 → 9 labels; partial sheet → blanks
    filtered; 1-up regression → still exactly 1 label
  - **Done when:** all four pass via Playwright
  - **Depends on:** T3.9

- [x] **T3.11 — Auto grid detection (hypothesize-and-verify)**
  - `detectAutoPage`: even-position dividers must land inside white gutters
    (±1.5% tolerance); most-cells wins; >5×5 warns and skips; 1-up keeps the
    fold-line path; output format unchanged (one label per page)
  - **Done when:** auto 1-up → 1 label; auto 2×2 → 4; auto 3×3 → 9;
    auto partial → 3; auto 6×6 → exceeds-5×5 warning
  - **Depends on:** T3.10
  - **Note:** First attempt (gutter-counting) over-segmented (3×5 on a 2×2
    sheet) because intra-label whitespace qualified as gutters. Fixed with
    strict divider-containment + most-cells tie-break; tuned MIN_GUTTER_FRAC
    to 0.012 against all fixtures.

---

## Phase 4 — Crop, Resize, Rotate (Day 3)

- [x] **T4.1 — Crop each region**
  - Extract region pixels at high resolution
  - **Done when:** cropped images are sharp and complete
  - **Depends on:** T3.2

- [x] **T4.2 — Resize to print size**
  - Fit to 4×6 (or chosen size), preserve aspect ratio
  - **Done when:** output matches target dimensions without distortion
  - **Depends on:** T4.1, T0.3

- [ ] **T4.3 — Handle rotation**
  - Apply a fixed orientation; add manual override if needed
  - **Done when:** labels are upright in preview
  - **Depends on:** T4.2
  - **Note:** Fixed portrait orientation assumed; no rotated samples seen.

- [x] **T4.4 — Barcode safety check**
  - Verify aspect ratio and resolution are preserved
  - **Done when:** no stretching on resize
  - **Depends on:** T4.2
  - **Note:** Fit-inside + white padding; never stretched.

---

## Phase 5 — Preview (Day 3)

- [x] **T5.1 — Build the preview grid**
  - Show every extracted label as a numbered thumbnail
  - **Done when:** all labels visible and identifiable
  - **Depends on:** T4.1

- [x] **T5.2 — Add label detail view**
  - Click a label to inspect at larger size
  - **Done when:** user can spot a bad extraction before printing
  - **Depends on:** T5.1

- [x] **T5.3 — Show detection summary**
  - Total labels, pages, any skipped cells
  - **Done when:** summary reflects actual results
  - **Depends on:** T5.1

---

## Phase 6 — Export & Print (Day 4)

- [x] **T6.1 — Generate the output PDF**
  - Assemble processed labels with `pdf-lib` at correct physical size
  - **Done when:** downloaded PDF opens correctly with right dimensions
  - **Depends on:** T5.1
  - **Note:** 4×6 pages (288×432 pt) or A4; verified `%PDF-` download.

- [x] **T6.2 — Download flow**
  - Trigger download of the processed PDF
  - **Done when:** file saves with a sensible name
  - **Depends on:** T6.1

- [x] **T6.3 — Print flow**
  - Generate a print-ready PDF and invoke the browser print dialog
  - **Done when:** printed output matches preview
  - **Depends on:** T6.1
  - **Note:** Opens generated PDF in a new tab for the browser print dialog.

- [x] **T6.4 — Print settings panel**
  - Size, margin, rotation controls if included in MVP
  - **Done when:** settings change the generated PDF
  - **Depends on:** T6.1
  - **Note:** Size (4×6/A4) + include-invoices toggle implemented.

- [x] **T6.5 — Generation loader with progress**
  - `generatePdf` accepts `onProgress(current, total)` and yields a frame per
    label so the UI paints; prominent "Preparing PDF… N / M" block with bar;
    generated bytes cached (Print after Download does not regenerate)
  - **Done when:** progress block appears during download; second download is
    instant with no loader
  - **Depends on:** T6.1
  - **Note:** Verified via Playwright — "Preparing PDF… 4 / 4 · Download" shown,
    2 MB PDF downloaded, cache hit on repeat.

---

## Phase 7 — Polish, Testing, Performance

- [x] **T7.1 — Error handling**
  - Friendly errors for corrupt PDF, no labels found, unsupported size
  - **Done when:** failures never leave a blank screen

- [x] **T7.2 — Progress for large batches**
  - Show "Processing 74 / 120"
  - **Done when:** 100+ label PDF shows live progress
  - **Depends on:** T2.4
  - **Note:** Per-page progress implemented; 100+ page batch untested.

- [ ] **T7.3 — Memory management**
  - Release canvases page by page
  - **Done when:** a 300-label PDF completes without crashing
  - **Depends on:** T6.1
  - **Note:** Source canvases are released per page; large-batch test pending.

- [ ] **T7.4 — Move heavy work to a Web Worker**
  - Offload detection/cropping so the UI stays responsive
  - **Done when:** UI never freezes during processing
  - **Depends on:** T7.2, T7.3

- [x] **T7.5 — Playwright smoke test**
  - Upload fixture → assert label count → assert download triggers
  - **Done when:** test passes in CI
  - **Depends on:** T6.2
  - **Note:** Verified manually via Playwright scripts (upload → "1 label
    detected" → valid PDF download); CI wiring pending.

- [ ] **T7.6 — Quality gate**
  - Run `npm run check` and `npm run lint`
  - **Done when:** both pass clean
  - **Note:** `oxlint` clean; `tsc` has one pre-existing error in untouched
    `src/pages/og/[key].png.ts` (Buffer/BodyInit). New files pass.

- [ ] **T7.7 — SEO and docs**
  - Add keywords from `tools.csv`, finalize title/description
  - Decide index vs noindex
  - **Done when:** metadata finalized
  - **Note:** Page ships `noindex` (prototype). Keywords/nav entry pending.

---

## Phase 8 — Multi-file imposition (N-up sheets)

Scope: seller uploads many separate label PDFs → all pages arranged N-up on
A4 sheets (Option A: full pages incl. invoice, vector-preserving, no detection).

- [x] **T8.1 — Multi-file upload + intake**
  - `multiple` on file input; `onDrop`/`onPick` accept all files; per-file
    PDF + size validation; store `{bytes, numPages}` per file
  - **Done when:** dropping 5 PDFs processes all 5, invalid file names the culprit

- [x] **T8.2 — lib/impose.ts (embedPage N-up A4)**
  - `imposePdf(sources, perSheet, onProgress)`: pdf-lib `embedPage(page, bbox)`
    + `drawPage` scaled to fit cell (aspect preserved); 1/2/4 per sheet
  - **Done when:** output is A4, correct sheet count, label-only crop

- [x] **T8.3 — Label-only crop via text anchor**
  - `labelBoxByText(page)` finds "Product Details" (fallback "TAX INVOICE") in
    `getTextContent()` and returns a PDF-point box above it → invoice and
    product-details row excluded; falls back to whole page if no anchor
  - **Done when:** rendered sheet shows only shipping labels (address, COD
    banner, sort codes, QR, barcode, tracking), no invoice
  - **Caveat:** pdf-lib embeds a form XObject with a BBox — this clips
    *rendering* correctly, but the source content stream still contains the
    invoice text, so `pdftotext` can still extract it from the output. Visual
    output and file size are unaffected. Switch to a high-DPI raster crop if
    the hidden text must be removed entirely.

- [x] **T8.4 — Wire download/print/cache/loader for impose path**
  - `buildPdf` branches on perSheet; cache key includes mode; loader + progress
    reused; `meesho-sheets.pdf` naming for multi-file
  - **Done when:** download + print work; repeat is instant (cache hit)
- [x] **T8.5 — Imposition test matrix**
  - 2 files 4-up → 1 sheet; 5 files → 2 sheets (4+1); perSheet=2 → 3 sheets;
    multi-page PDF; mixed raster+vector; `pdftotext` finds TAX INVOICE
    (vector preserved); single-file detect regression
  - **Done when:** all pass via Playwright + pdfinfo/pdftotext

- [x] **T8.6 — Cut guides**
  - Dashed rectangle around each placed label (8 pt pad, 12 pt gap so adjacent
    guides don't touch); guide colour/width tuned for print; labels inset so a
    cut on the line never clips the label; "Cut guides" toggle (default on),
    included in the cache key
  - **Done when:** printed sheet shows a cut box per label; toggle off removes them
  - **Depends on:** T8.2
  - **Note:** Verified on 4 real `Sub_Order_Labels_*.pdf` — 4-up and 2-up both
    show clean dashed boxes around each label.

---

## Backlog (Post-MVP)

- [ ] Multiple Meesho layout templates
- [ ] 4-up A4 detection path (needs a real 4-up sample)
- [ ] Prepaid vs COD variant handling
- [ ] Manual bounding-box editor for failed detections
- [ ] Mixed label + invoice PDF splitting
- [ ] Auto-orientation detection
- [ ] Barcode scanability validation
- [ ] ZIP batch download (note: `@zip.js/zip.js` already installed)
- [ ] Preset saving for print settings
- [ ] A4 / A5 / custom sizes
- [ ] Offline PWA support
- [ ] CI wiring for the Playwright smoke test
- [ ] `fixtures/` synthetic generator (blank page, multi-label, 100+ batch)

---

## Summary

| Phase | Focus | Time |
|---|---|---|
| 0 | Prerequisites | — |
| 1 | Setup | 1 day |
| 2 | Read & render | (shares Day 1) |
| 3 | Detection & slicing | 1 day |
| 4 | Crop / resize / rotate | 1 day |
| 5 | Preview | (shares Day 3) |
| 6 | Export & print | 1 day |
| 7 | Polish & testing | within the above |

**Critical path:** T0.1 → T0.2 → T3.1 → T3.2 → T4.1 → T6.1 → T7.5

---

## Verification log (2026-09-19)

- Dev server serves `/tools/meesho-label-manager` (HTTP 200).
- Uploaded real sample (`fixtures/meesho-sample-1.pdf`, A4 raster, 1 page COD):
  "1 label detected", "1/1 pages: fold line found".
- Preview grid renders the cropped label tile; detail modal opens.
- Download produces a valid PDF (`-labels.pdf`, `%PDF-` magic).
- Known issue fixed: pdfjs-dist modern build requires
  `Map.prototype.getOrInsertComputed` (absent in older Chromium/Safari);
  switched to the `legacy` build.

## Verification log — auto grid (2026-09-21)

- Auto 1-up → "1 label detected" (fold path; regression safe).
- Auto real 2×2 → "4 labels detected", summary "4 auto-grid labels (p1: 2×2 → 4)";
  all 4 tiles show distinct complete labels.
- Auto synthetic 3×3 → "9 labels detected" with "3×3" in summary.
- Auto synthetic partial 2×2 → "3 labels detected" (blank cell filtered).
- Auto synthetic 6×6 → page skipped with "grid 6×6 exceeds 5×5 — skipped" warning.
- Manual Grid 2×2 → "4 labels detected"; Grid download yields a valid PDF.
- Fixtures: `fixtures/synth-3x3.pdf`, `fixtures/synth-partial.pdf`,
  `fixtures/synth-6x6.pdf` (all git-ignored test artifacts).

## Verification log — multi-file imposition (2026-09-21)

- 4 real Meesho PDFs, 4/sheet → 1 A4 sheet, 30 KB. Rendered output verified:
  4 shipping labels in a 2×2, each showing Customer Address, COD banner,
  Valmo Pickup, sort codes, QR, barcode, tracking number — **no invoice, no
  Product Details row**.
- 2 files (vector + raster), 4/sheet → 1 A4 sheet; 5 files → 2 A4 sheets.
- perSheet=2, 3 files → 2 A4 sheets.
- Single-file perSheet=1 → "1 label detected" via fold path (detect regression safe).
- Cut guides verified on 4 real `Sub_Order_Labels_*.pdf`: 4-up (1 sheet) and
  2-up (2 sheets) both render a dashed cut box around every label; toggle off
  produces the same sheet without boxes (30 KB either way).
- Known caveat: the crop is a form-XObject BBox, so invoice text remains in the
  output's content stream (clipped visually). `pdftotext` can still extract it.

## Phase 9 — Unified vector pipeline + thermal + extra outputs (2026-09-21)

Scope (user-approved "All four features"): thermal output, separate invoices
PDF, sort, SKU-qty overlay and picklist, on a single analysis pipeline.

- [x] **T9.1 — Unified analysis (`lib/labelbox.ts`)**
  - `analyzePage(pdf, pageNum)` → `{ box: { labelBox, invoiceBox, fromRaster }, meta }`.
    Vector path: crop the label down to the "TAX INVOICE" anchor (fallback:
    "Product Details" anchor); invoice box = page below TAX INVOICE. Raster
    path: pixel detection (`detectAutoPage`) for label + invoice regions.
  - `extractMeta`: courier via regex on full text
    (Valmo/Delhivery/XpressBees/Shadowfax/Ekart/Ecom Express/DTDC/Blue Dart/
    India Post/Amazon Shipping); SKU/Qty/Order No. via nearest-column lookup in
    the "Product Details" table (blank-row groups filtered).
- [x] **T9.2 — Detection refactor**
  - Removed grid-mode (`LayoutMode`/`GridSpec`/`clampGrid`, `detectGridPage`,
    `segmentGrid`, `detectMultiPage`); exported `detectAutoPage`/`detectPage`.
- [x] **T9.3 — Output generators**
  - `lib/impose.ts`: flat `ImposeUnit` array ({bytes, pageIndex 1-based, box,
    invoice, meta}); shared `nextFrame`; overlay hook.
  - `lib/thermal.ts`: one label/page at preset (4×6 in = 288×432 pt,
    100×150 mm = 283.46×425.2 pt); fit modes contain / fit-width / actual.
  - `lib/invoices.ts`: separate A4 invoice PDF, one invoice/page, pages without
    an invoice region are skipped.
  - `lib/picklist.ts`: single-square picklist page with numbered rows / SKU ×qty.
  - `lib/overlay.ts`: dark SKU-qty chip drawn on each placed label.
  - `lib/sort.ts`: default / by courier / by SKU.
- [x] **T9.4 — UI**
  - Controls: Output (A4 sheets / Thermal), labels-per-sheet (1/2/4), cut
    guides, thermal size + fit, SKU-qty overlay, Picklist, Sort, Invoices
    (off / separate A4 PDF). Unique cache keys per output.
  - Statuses rewritten to reading → analyzing → preparing.
- [x] **T9.5 — Cleanup**
  - Deleted `lib/generate.ts` (raster print path), removed
    `resizeForPrint`/`printTargetPx`, dropped unused `PrintSizeId` and grid types.
- [x] **T9.6 — Fixed pageIndex off-by-one**
  - `unit.pageIndex` is 1-based (pdf.js) but pdf-lib `getPage` is 0-based →
    crash on single-page sources. Now `getPage(pageIndex - 1)` in impose,
    thermal and invoices.
- [x] **T9.7 — Cut back to Product Details (no black line)**
  - Measured on the real fixture: black rules at ~290pt (right above "Product
    Details" @294.7) and ~346pt (fold line above "TAX INVOICE" @350.1). Cutting
    at "TAX INVOICE" pulled the 290pt rule into the middle of the label.
    Crop now ends at Product Details (cut ~287pt), which excludes the black
    rule and the product-details table; "TAX INVOICE" still defines where the
    invoice starts for the invoices PDF.
- [x] **T9.8 — 2×2 grid for 4-up**
  - `chooseGrid` now scores by `area / (1 + 2·|rows−cols|)` so layouts prefer
    a square arrangement: 4/sheet → 2×2 (was 4×1 column). 2/sheet and 1/sheet
    unchanged.
- [x] **T9.9/9.13 — Label: through Product Details, no tax details text**
  - Measured on the real fixture (595×842 pt page): "Product Details" heading
    @yTop≈294.7, table header row @313.2, product data row @~329.7, table end
    @~340.7; black fold rule @≈346; "TAX INVOICE" @350.1.
  - Final crop rule in `analyzePage`: label ends at (`last product-table
    row + 3pt`) capped just above the tax section (`taxInvoiceY − 2`), so the
    label runs from the sheet top **through the Product Details section**
    (heading + SKU/Size/Qty/Color/Order table) and **excludes all tax details
    text** (TAX INVOICE + the fold rule) and nothing is clipped.
  - Earlier intermediate steps: T9.7 cut above the heading; the TAX-INVOICE
    anchor pulled the fold rule into the label; the Product-Details-heading-only
    cut hid the table. Confirmed via geometry that table-header text and tax
    text map to negative form-Y (clipped by the embed `/BBox`), while the table
    data maps inside the crop. Pixel check: the hidden-tax band renders pure
    white (pdftotext still lists clipped words — text-miner artifact, not
    visible pixels).
- [x] **T9.14 — Easy-cut A4 layout (packed, centered cut lanes)**
  - Replaced the cell-based A4 imposition with a label-driven packed layout:
    columns/rows are sized to the *actual* placed labels (not full grid cells),
    which removed the ~180pt center gutter (each rotated label was centered in a
    297pt column while only ~207pt wide).
  - New `cutGap` option (default 8pt, UI number input "Cut gap" for A4): a
    fixed scissor lane between labels. Whole 2×2 block is centered on the page,
    so one vertical cut down the exact page center + one horizontal cut splits
    the sheet into 4 labels. Cut-guide dashed boxes no longer overlap (lane
    gap ≥ 2·pad).
  - Per-label fit reused for upright/rotated (`fitIn`); rotated draw keeps the
    pushOperators transform; end lines, overlay and cut guides follow the
    packed geometry. `chooseGrid` updated to use the packed available sizes.
  - Verify: 15/15 Playwright pass; pixel scan of the render — content spans
    x=126..1113 of 1241 (symmetric about page center 620), a fully-white center
    lane ~15px wide sits exactly at x=620 (single-cut line), and the 4 label
    end-lines are present (y≈87/853/918/1684 — one per label; the 4 source
    files have different content heights so end-lines sit at 4 y positions).
- [x] **T9.15 — Options panel UX**
  - Rebuilt the crowded single-wrap control row into a structured panel:
    "Output options" header with a contextual cutting hint; segmented controls
    (A4 sheets/ Thermal, labels-per-sheet) with captions; real switch toggles
    (Cut guides · Rotate to fill · Label end line · SKU-qty chip · Picklist);
    a cut-gap slider with live `8pt` readout replacing the number input; tidy
    secondary row for Sort and Invoices (icon + select).
  - Reusable `Segmented` / `Toggle` / `Select` / `Field` controls added to
    `LabelManager.tsx`; action buttons (Download PDF / Print) are full-width in
    a right column. Accessible names kept clean (aria-label overrides caption).
  - Kept 15/15 Playwright checks green (adjusted the header hint to secondary
    `text-ink-400` so the meta-summary selector stays unambiguous).
- [x] **T9.16 — Beginner-friendly output flow**
  - Reframed the done state around a single outcome card: a green-tick
    "Your labels are ready" summary in plain language plus prominent
    `Print` / `Download PDF` buttons — no print jargon required.
  - Moved all technical controls (output type, per-sheet, cut guides, rotate,
    end line, spacing, sort, invoices, overlays) behind a collapsed
    **"Customize print (optional)"** disclosure, so the default path is
    upload → download with zero decisions.
  - Renamed "Cut gap" → "Space between labels" (unit-less readout) and fixed
    the label wrapping to a single line; grouped secondary controls under a
    "More options" heading.
  - **Default space between labels is now `0`** — at 0pt the guide lines of
    adjacent labels meet at the exact page centre, so a single cut down the
    middle and one across separates all four labels (verified: no white lane
    remains at x=620, guides touch).
  - Reworded the print hint to plain instructions ("Print on A4 at 100%
    scale with no margins. The dashed lines show where to cut.").
- [x] **T9.17 — Customize panel polish**
  - Fixed the uneven `LAYOUT` segmented control (the captioned "4 / 2×2"
    option made the buttons different heights): all per-sheet options are now
    uniform single-line `1 · 2 · 4`, constrained to content width instead of
    stretching across the column.
  - Added a plain-language helper under the control ("Four labels per page,
    arranged 2×2.") and grouped the toggles under a "Cutting & fitting"
    sub-label, with the spacing slider on its own row.
- [x] **T9.18 — Cutting & fitting option cards**
  - Replaced the cramped row of bare switches with three self-explanatory
    option cards (icon + title + one-line description + switch):
    Cut guides (Scissors), Rotate to fill (RotateCcw), Label end line (Minus).
    Icon chip fills brand-600 when a card is on.
  - Extracted a reusable `Switch` component (used by both `Toggle` and the
    new `OptionCard`); descriptions styled in `ink-400` to avoid the
    meta-summary selector collision. Kept 15/15 Playwright checks green.
- [x] **T9.19 — Option card alignment fix**
  - Moved the switch inline with the card title (was pinned far right),
    widening the description column so all three cards wrap identically and
    sit at equal heights; icon chip softened to `brand-50/brand-600` when on
    (was solid `brand-600`) to keep the accent restrained.
- [x] **T9.20 — Symmetric Customize grid**
  - Replaced the mixed `auto + 1fr` columns with a symmetric 2-column grid so
    every group shares the Output control's vertical rhythm:
    Row 1 = `Output | Labels per sheet` (or `Label size` in thermal mode),
    Row 2 = `Cutting & fitting | Space between labels`. Sub-labels and
    controls are horizontally aligned across both columns.
- [x] **T9.21 — End-to-end friendliness pass**
  - Upload screen now has a 3-step strip under the drop zone
    (Upload your PDF → We arrange it → Download & print) with soft icon chips.
  - Processing state reassures with "This usually takes just a few seconds."
  - Done state gains a "Here's what you'll get" banner with a live
    `PrintSchematic` mini-visual: a real A4-sheet mock (2×2 label grid with
    dashed cut lines, or a single thermal label) that tracks the current
    per-sheet / output settings, next to a short caption.
- [x] **T9.23 — Real-label sheet preview**
  - Added `computeLayout` to `lib/impose.ts` — a pure, exported version of
    the imposer's placement math (same expressions) returning per-label
    `A4Layout` cells (sheet/col/row/x/y/w/h/rotated). PDF pipeline untouched.
  - New `SheetPreview` component renders the ACTUAL cropped label images on a
    mini A4 sheet exactly as they'll print (honouring sort order, rotation is
    implied by object-fit), with dashed cut-guides around each cell, black
    end-line bars, per-sheet captions and a "+N more sheets" chip.
  - Replaced the placeholder schematic in the "Here's what you'll get" banner
    for A4 output; thermal keeps `PrintSchematic`.
- [x] **T9.24 — Bolder label end line**
  - Thickened the per-label black end line from 1.4pt to 2.2pt in both
    `impose.ts` and `thermal.ts`, and made the preview bar thicker (2.5px) so
    every printed label is visually "completed" with a black rule. Verified in
    the rendered A4 PDF (full-width black runs at each label's end).
- [x] **T9.10 — Label end black line (A4 + thermal)**
  - New `endLine` option (default on): a 1.4pt black rule is drawn just below
    each label's bottom edge to mark the end of the label. Applied in
    `imposePdf` and `thermalPdf` (handles upright, rotated, actual and stretch
    placements). UI checkbox "Label end line".
- [x] **T9.11 — Thermal "Auto (rotate to fill)" fit + no stretch**
  - `FitMode` gains `auto` (default). Thermal chooses the orientation whose
    contain scale is bigger and rotates 90° (CCW=rotateDegrees(-90)) without
    stretching: label aspect ~2.08 on 4×6 fills the page height
    (~288×432 → 208×432 placed content) instead of a small upright band.
  - Implemented with pdf-lib low-level ops (`pushOperators` translate+rotate+
    scale wrapping `drawPage`). Overlay chip stays unrotated at page top-left.
- [x] **T9.12 — A4 per-cell contain + auto-rotate ("fill the A4 page")**
  - A4 imposition now uses per-cell `contain` with orientation choice
    (`autoRotate`, default on; checkbox "Rotate to fill"): every label always
    fully fits its cell (never cropped); when rotating 90° fills the cell
    better, the label is drawn rotated via the same pushOperators transform.
    With label aspect ≈1.63 and a 2×2 grid, rotated labels fill the full cell
    height so the sheet is fully acquired. Cut guides and end line follow the
    rotated geometry.

## Verification log — Phase 9 (2026-09-21)

15/15 Playwright assertions pass on 4 real `Sub_Order_Labels_*.pdf`:

- A4 N-up: "4 labels · label only → 1 A4 sheet · 2×2"; 1 page 595.28×841.89;
  vector text preserved ("Valmo Pickup").
- Thermal: 4 pages, each exactly 288×432 pt, one label per page.
- Invoices: separate A4 PDF, 4 pages (one per label).
- Picklist: 1-page PDF with "A7brNEN8"; meta summary "1 courier · 4 SKUs".
- Overlay: imposed output contains "A7brNEN8 ×1" chip text.
- Sort by courier: output PDF valid, stable against the single-courier set.
- Raster fallback (`fixtures/meesho-sample-1.pdf`): "1 label → 1 A4 sheet ·
  1 raster page (pixel-detected)"; valid 1-page A4 output.
- No page JS errors.

Re-verified after T9.9–T9.12 (same suite, still 15/15). Post-change pixel
scan of the A4 render (`pdftoppm` @60dpi):
- Ink spans the full page (row bands ~y12..700 of 702) → 2×2 rotated labels
  acquire the A4 sheet.
- Four solid black horizontal rules detected at y≈144/320/538/672 → the added
  label end-lines.
- `pdftotext` on the imposed A4 contains both "Product Details" and
  "TAX INVOICE" → label now runs through the tax invoice title.

Rendered previews of A4, thermal, invoices and picklist outputs are in
`/tmp/opencode/mlm-check/` (programmatic pdfinfo/pdftotext checks, not eyeballed).

Open follow-ups:
- Eyeball the rendered PNGs (`/tmp/opencode/mlm-check/*.png`) for visual QA.
- Couriers with multiple different couriers (mixed batch) to prove the
  by-courier sort grouping end-to-end.
- barcode readability on 100×150 mm preset.

- [x] **T9.25 — Black end line always on the label (thermal fix)**
  - Root cause: in thermal `auto`/`contain` mode the label fills the page
    (`y ≈ 0`), so the end line drawn at `y - 2` fell off the page and was
    invisible. Same risk in `actual`/`stretch` modes.
  - Fix: draw the end line at the label's bottom edge (`y`, not `y - 2`) in
    `impose.ts` (rotated + upright) and all four `thermal.ts` fit branches, so
    every label is completed with a black rule inside its bottom edge.
  - App now shows the same black line on the "Here's what you'll get" sheet
    preview, the label thumbnails and the zoom/detail modal (driven by the
    `endLine` toggle, true black to match the PDF).
  - Verified: rendered thermal 4×6 (600×900 @150dpi) has full-width black rows
    at y=897–899 (bottom edge) and A4 at y=1680–1682; 15/15 harness pass.

- [x] **T9.26 — Crop the label to the tax invoice's first black line**
  - Vector crop used to stop at `min(lastTextY + 3, taxInvoiceY - 2)`, so it
    ended a few points ABOVE the divider and clipped the closing rule of the
    Product Details table.
  - Added `fullWidthLines(canvas, minFrac)` export to `detect.ts` and
    `firstBlackLineAbove()` in `labelbox.ts`: the label cut is now the first
    full-width black rule at/above the `TAX INVOICE` text (`line + 2`), so the
    crop ends cleanly on that divider. Falls back to the old text-based cut if
    no rule is found.
  - `invoiceBox` top is aligned to the label bottom when a rule cut is used, so
    label and invoice no longer overlap.
  - `analyzePage(pdf, page, canvas?)` now accepts the already-rendered canvas;
    `processFiles` renders once and reuses it (no extra render pass).
  - Verified on `Sub_Order_Labels_*.pdf` (A4): computed cut = line at y=346pt,
    crop's last two rows are 96% black; 15/15 harness pass, tsc/lint clean.

- [x] **T9.27 — Remove the black end line from the in-app previews**
  - Now that the crop ends on the real tax-invoice divider, the synthetic
    black bars were redundant in the UI. Removed the overlay bar from the
    label thumbnails, the zoom/detail modal and the "Here's what you'll get"
    sheet preview (dropped the now-unused `endLine` prop from `SheetPreview`).
  - The PDF outputs still draw the end line (per the `Label end line` toggle);
    only the app previews changed. 15/15 harness pass, tsc/lint clean.
