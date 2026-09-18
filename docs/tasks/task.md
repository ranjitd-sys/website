# Meesho Label Manager — Task Breakdown

**Goal:** Upload a Meesho shipping-label PDF → detect, split, crop, resize → preview → download or print.

**Architecture:** Client-side only, Astro page + React island, PDF never leaves the browser.

**Estimated total:** 3–4 developer-days.

**Hard dependency:** 5–10 real Meesho label PDF samples before Phase 3.

---

## Legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- **Depends on:** task IDs that must finish first

---

## Phase 0 — Prerequisites

- [ ] **T0.1 — Collect real Meesho label PDFs**
  - Gather 5–10 samples across order types (regular, COD, bulk)
  - Include at least one PDF with multiple labels per page
  - Include at least one blank or near-blank page
  - **Done when:** samples saved in a local `fixtures/` folder
  - **Blocks:** all of Phase 3

- [ ] **T0.2 — Confirm label layout**
  - Inspect samples: page size, labels per page, margins, separators, orientation
  - Record whether one layout or many
  - **Done when:** a short written layout spec exists (grid, cell size, margins)
  - **Depends on:** T0.1

- [ ] **T0.3 — Confirm MVP print target**
  - Decide: 4×6 thermal only, or also A4
  - **Done when:** default print size locked

---

## Phase 1 — Setup (Day 1)

- [ ] **T1.1 — Install dependencies**
  - Add `pdfjs-dist` and `pdf-lib`
  - **Done when:** packages in `package.json`, install succeeds

- [ ] **T1.2 — Create the page shell**
  - New page at the agreed route using `PageLayout`
  - Header block: title, description, privacy note
  - **Done when:** page loads with Navbar + Footer, no island yet
  - **Depends on:** T1.1

- [ ] **T1.3 — Configure PDF.js worker**
  - Wire the worker via Vite asset URL (fallback: `public/`)
  - **Done when:** a test PDF renders without worker errors
  - **Depends on:** T1.1

- [ ] **T1.4 — Create the React island skeleton**
  - Mount with `client:only="react"`
  - Three states: upload → processing → result
  - **Done when:** island mounts, state switching works, no SSR crash
  - **Depends on:** T1.2, T1.3

- [ ] **T1.5 — Build the uploader UI**
  - Drag-and-drop zone + file picker
  - Validate file type and size
  - **Done when:** a PDF can be selected and passed to the engine
  - **Depends on:** T1.4

---

## Phase 2 — PDF Read & Render (Day 1)

- [ ] **T2.1 — Read PDF metadata**
  - Extract page count and page dimensions
  - **Done when:** UI shows correct page count for a real sample

- [ ] **T2.2 — Render pages to canvas**
  - Render at a chosen DPI for analysis
  - **Done when:** first page renders visibly in the UI
  - **Depends on:** T2.1

- [ ] **T2.3 — Extract text positions (optional for MVP)**
  - Pull text spans with coordinates if needed by detection
  - **Done when:** available for detector use or explicitly deferred
  - **Depends on:** T2.1

- [ ] **T2.4 — Add processing pipeline status**
  - Show step-by-step progress (reading → detecting → …)
  - **Done when:** steps advance as the pipeline runs
  - **Depends on:** T2.2

---

## Phase 3 — Label Detection & Slicing (Day 2)

- [ ] **T3.1 — Map the label grid from real samples**
  - Translate the T0.2 layout spec into grid coordinates
  - **Done when:** cell geometry is defined per page size
  - **Depends on:** T0.2, T2.2

- [ ] **T3.2 — Implement the slicer**
  - Split each page into label regions using the grid
  - **Done when:** correct count of regions returned per page
  - **Depends on:** T3.1

- [ ] **T3.3 — Handle one label per page and many per page**
  - Detect and adapt to both cases
  - **Done when:** both sample types produce correct regions
  - **Depends on:** T3.2

- [ ] **T3.4 — Filter blank pages and empty cells**
  - Skip pages/cells with no content
  - **Done when:** blank pages produce zero labels
  - **Depends on:** T3.2

- [ ] **T3.5 — Overlay bounding boxes for verification**
  - Draw detected regions on a canvas preview
  - **Done when:** boxes visually match real labels
  - **Depends on:** T3.2

- [ ] **T3.6 — Make the detection strategy swappable**
  - Isolate detection behind a simple interface
  - **Done when:** a second strategy can be added without UI changes
  - **Depends on:** T3.2

---

## Phase 4 — Crop, Resize, Rotate (Day 3)

- [ ] **T4.1 — Crop each region**
  - Extract region pixels at high resolution
  - **Done when:** cropped images are sharp and complete
  - **Depends on:** T3.2

- [ ] **T4.2 — Resize to print size**
  - Fit to 4×6 (or chosen size), preserve aspect ratio
  - **Done when:** output matches target dimensions without distortion
  - **Depends on:** T4.1, T0.3

- [ ] **T4.3 — Handle rotation**
  - Apply a fixed orientation; add manual override if needed
  - **Done when:** labels are upright in preview
  - **Depends on:** T4.2

- [ ] **T4.4 — Barcode safety check**
  - Verify aspect ratio and resolution are preserved
  - **Done when:** no stretching on resize
  - **Depends on:** T4.2

---

## Phase 5 — Preview (Day 3)

- [ ] **T5.1 — Build the preview grid**
  - Show every extracted label as a numbered thumbnail
  - **Done when:** all labels visible and identifiable
  - **Depends on:** T4.1

- [ ] **T5.2 — Add label detail view**
  - Click a label to inspect at larger size
  - **Done when:** user can spot a bad extraction before printing
  - **Depends on:** T5.1

- [ ] **T5.3 — Show detection summary**
  - Total labels, pages, any skipped cells
  - **Done when:** summary reflects actual results
  - **Depends on:** T5.1

---

## Phase 6 — Export & Print (Day 4)

- [ ] **T6.1 — Generate the output PDF**
  - Assemble processed labels with `pdf-lib` at correct physical size
  - **Done when:** downloaded PDF opens correctly with right dimensions
  - **Depends on:** T5.1

- [ ] **T6.2 — Download flow**
  - Trigger download of the processed PDF
  - **Done when:** file saves with a sensible name
  - **Depends on:** T6.1

- [ ] **T6.3 — Print flow**
  - Generate a print-ready PDF and invoke the browser print dialog
  - **Done when:** printed output matches preview
  - **Depends on:** T6.1

- [ ] **T6.4 — Print settings panel**
  - Size, margin, rotation controls if included in MVP
  - **Done when:** settings change the generated PDF
  - **Depends on:** T6.1

---

## Phase 7 — Polish, Testing, Performance

- [ ] **T7.1 — Error handling**
  - Friendly errors for corrupt PDF, no labels found, unsupported size
  - **Done when:** failures never leave a blank screen

- [ ] **T7.2 — Progress for large batches**
  - Show "Processing 74 / 120"
  - **Done when:** 100+ label PDF shows live progress
  - **Depends on:** T2.4

- [ ] **T7.3 — Memory management**
  - Release canvases page by page
  - **Done when:** a 300-label PDF completes without crashing
  - **Depends on:** T6.1

- [ ] **T7.4 — Move heavy work to a Web Worker**
  - Offload detection/cropping so the UI stays responsive
  - **Done when:** UI never freezes during processing
  - **Depends on:** T7.2, T7.3

- [ ] **T7.5 — Playwright smoke test**
  - Upload fixture → assert label count → assert download triggers
  - **Done when:** test passes in CI
  - **Depends on:** T6.2

- [ ] **T7.6 — Quality gate**
  - Run `npm run check` and `npm run lint`
  - **Done when:** both pass clean

- [ ] **T7.7 — SEO and docs**
  - Add keywords from `tools.csv`, finalize title/description
  - Decide index vs noindex
  - **Done when:** metadata finalized

---

## Backlog (Post-MVP)

- [ ] Multiple Meesho layout templates
- [ ] Manual bounding-box editor for failed detections
- [ ] Mixed label + invoice PDF splitting
- [ ] Auto-orientation detection
- [ ] Barcode scanability validation
- [ ] ZIP batch download (note: `@zip.js/zip.js` already installed)
- [ ] Preset saving for print settings
- [ ] A4 / A5 / custom sizes
- [ ] Offline PWA support

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
