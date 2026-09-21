import { useCallback, useRef, useState } from "react"
import { FileUp, Loader2, Download, Printer, RotateCcw, ShieldCheck, PackageSearch, AlertTriangle, ZoomIn, X } from "lucide-react"
import { loadPdf, renderPageToCanvas, labelBoxByText, type PdfBox } from "./lib/pdf"
import { detectMultiPage } from "./lib/detect"
import { cropRegion, resizeForPrint, printTargetPx, canvasToPngDataUrl } from "./lib/crop"
import { generatePdf, downloadBytes, selectOutputLabels, nextFrame } from "./lib/generate"
import { imposePdf, sheetCount, chooseGrid, type ImposeSource, type ImposeGrid } from "./lib/impose"
import type { LabelImage, ProcessStatus, PrintSizeId, LayoutMode, PerSheet } from "./types"

const MAX_BYTES = 50 * 1024 * 1024

const STEPS: { id: ProcessStatus; label: string }[] = [
  { id: "reading", label: "Reading PDF" },
  { id: "detecting", label: "Detecting labels" },
  { id: "cropping", label: "Cropping & resizing" },
]

function downscale(canvas: HTMLCanvasElement, maxW = 420): string {
  const scale = Math.min(1, maxW / canvas.width)
  if (scale >= 1) return canvasToPngDataUrl(canvas)
  const c = document.createElement("canvas")
  c.width = Math.floor(canvas.width * scale)
  c.height = Math.floor(canvas.height * scale)
  const ctx = c.getContext("2d")
  if (!ctx) return canvasToPngDataUrl(canvas)
  ctx.drawImage(canvas, 0, 0, c.width, c.height)
  return canvasToPngDataUrl(c)
}

export default function LabelManager() {
  const [status, setStatus] = useState<ProcessStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [labels, setLabels] = useState<LabelImage[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [size, setSize] = useState<PrintSizeId>("4x6")
  const [includeInvoices, setIncludeInvoices] = useState(false)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("auto")
  const [gridRows, setGridRows] = useState(2)
  const [gridCols, setGridCols] = useState(2)
  const [perSheet, setPerSheet] = useState<PerSheet>(4)
  const [cutGuides, setCutGuides] = useState(true)
  const [multiCount, setMultiCount] = useState(1)
  const [sheetGrid, setSheetGrid] = useState<ImposeGrid>({ rows: 1, cols: 1 })
  const [labelOnlyInfo, setLabelOnlyInfo] = useState(0)
  const imposeSources = useRef<ImposeSource[]>([])
  const [fileName, setFileName] = useState("")
  const [busy, setBusy] = useState(false)
  const [genTask, setGenTask] = useState<"download" | "print" | null>(null)
  const [genProgress, setGenProgress] = useState<{ current: number; total: number } | null>(null)
  const pdfCache = useRef<{ key: string; bytes: Uint8Array } | null>(null)
  const [detail, setDetail] = useState<LabelImage | null>(null)
  const [foldInfo, setFoldInfo] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const layoutPicker = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm font-semibold text-ink-700">Labels per page</span>
      {(["auto", "grid"] as LayoutMode[]).map((m) => (
        <button
          key={m}
          onClick={(e) => { e.stopPropagation(); setLayoutMode(m) }}
          className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${layoutMode === m ? "border-brand-600 bg-brand-600 text-white" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"}`}
        >
          {m === "auto" ? "Auto" : "Grid"}
        </button>
      ))}
      {layoutMode === "grid" && (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-700" onClick={(e) => e.stopPropagation()}>
          <select
            value={gridRows}
            onChange={(e) => setGridRows(Number(e.target.value))}
            className="rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-sm font-semibold text-ink-700"
            aria-label="Grid rows"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          ×
          <select
            value={gridCols}
            onChange={(e) => setGridCols(Number(e.target.value))}
            className="rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-sm font-semibold text-ink-700"
            aria-label="Grid columns"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </span>
      )}
    </div>
  )

  const perSheetPicker = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm font-semibold text-ink-700">Labels per sheet</span>
      {([1, 2, 4] as PerSheet[]).map((n) => (
        <button
          key={n}
          onClick={(e) => { e.stopPropagation(); setPerSheet(n) }}
          className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${perSheet === n ? "border-brand-600 bg-brand-600 text-white" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"}`}
        >
          {n}
        </button>
      ))}
    </div>
  )

  const reset = useCallback(() => {
    setStatus("idle")
    setError(null)
    setLabels([])
    setPageCount(0)
    setProgress({ current: 0, total: 0 })
    setFileName("")
    setMultiCount(1)
    setLabelOnlyInfo(0)
    setSheetGrid({ rows: 1, cols: 1 })
    setDetail(null)
    setFoldInfo(null)
    setGenTask(null)
    setGenProgress(null)
    pdfCache.current = null
    imposeSources.current = []
  }, [])

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return
    for (const f of files) {
      if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
        setError(`"${f.name}" is not a PDF. Please upload PDF files only.`)
        return
      }
      if (f.size > MAX_BYTES) {
        setError(`"${f.name}" is too large (max 50 MB per file).`)
        return
      }
    }
    setError(null)
    setLabels([])
    setFileName(files.length === 1 ? files[0].name : `${files.length} files`)
    setMultiCount(files.length)
    pdfCache.current = null
    imposeSources.current = []
    try {
      setStatus("reading")
      const docs: { bytes: ArrayBuffer; pdf: Awaited<ReturnType<typeof loadPdf>>; name: string }[] = []
      for (const f of files) {
        const buf = await f.arrayBuffer()
        const pdf = await loadPdf(buf.slice(0))
        docs.push({ bytes: buf, pdf, name: f.name })
      }
      const totalPages = docs.reduce((a, d) => a + d.pdf.numPages, 0)
      setPageCount(totalPages)

      if (perSheet > 1) {
        setStatus("cropping")
        const out: LabelImage[] = []
        const sources: ImposeSource[] = []
        let n = 0
        let croppedCount = 0
        for (let fi = 0; fi < docs.length; fi++) {
          const { bytes, pdf } = docs[fi]
          const boxes: (PdfBox | null)[] = []
          for (let p = 1; p <= pdf.numPages; p++) {
            n++
            setProgress({ current: n, total: totalPages })
            const page = await pdf.getPage(p)
            const box = await labelBoxByText(page)
            boxes.push(box)
            if (box) croppedCount++
            const full = await renderPageToCanvas(pdf, p, 1)
            const H = full.height
            const rect = box
              ? {
                  page: p,
                  x: box.left,
                  y: H - box.top,
                  width: box.right - box.left,
                  height: box.top - box.bottom,
                }
              : { page: p, x: 0, y: 0, width: full.width, height: full.height }
            const cropped = cropRegion(full, rect)
            const url = downscale(cropped)
            out.push({
              id: `src-${fi}-${p}`,
              page: p,
              kind: "label",
              previewUrl: url,
              fullUrl: url,
              width: cropped.width,
              height: cropped.height,
            })
            full.width = 0
            full.height = 0
            cropped.width = 0
            cropped.height = 0
          }
          sources.push({ bytes, numPages: pdf.numPages, boxes })
        }
        imposeSources.current = sources
        const firstBox = sources.flatMap((s) => s.boxes).find((b) => b) ?? null
        const aspect = firstBox
          ? (firstBox.right - firstBox.left) / (firstBox.top - firstBox.bottom)
          : 1.414
        setSheetGrid(chooseGrid(perSheet, aspect))
        setLabels(out)
        setLabelOnlyInfo(croppedCount)
        setStatus("done")
        return
      }

      setStatus("detecting")
      const target = printTargetPx(size)
      const out: LabelImage[] = []
      let folds = 0
      const gridCounts: number[] = []
      const autoGridNotes: string[] = []
      const autoWarnings: string[] = []
      let autoGridLabels = 0
      let done = 0
      for (let fi = 0; fi < docs.length; fi++) {
        const { pdf } = docs[fi]
        for (let p = 1; p <= pdf.numPages; p++) {
          done++
          setProgress({ current: done, total: totalPages })
          const canvas = await renderPageToCanvas(pdf, p, 2)
          const det = detectMultiPage(canvas, p, layoutMode, { rows: gridRows, cols: gridCols })
          if (det.foldY != null) folds++
          if (layoutMode === "grid") gridCounts.push(det.regions.length)
          else {
            if (det.warning) autoWarnings.push(`p${p}: ${det.warning}`)
            else if (
              det.detectedRows != null &&
              det.detectedCols != null &&
              det.detectedRows * det.detectedCols > 1
            ) {
              autoGridLabels += det.regions.length
              autoGridNotes.push(`p${p}: ${det.detectedRows}×${det.detectedCols} → ${det.regions.length}`)
            }
          }
          if (det.regions.length === 0) continue
          setStatus("cropping")
          for (let i = 0; i < det.regions.length; i++) {
            const r = det.regions[i]
            const cropped = cropRegion(canvas, r)
            const resized = resizeForPrint(cropped, target.w, target.h)
            out.push({
              id: `${fi}-${p}-${i}-${r.kind}`,
              page: p,
              kind: r.kind,
              previewUrl: downscale(resized),
              fullUrl: canvasToPngDataUrl(resized),
              width: resized.width,
              height: resized.height,
            })
          }
          canvas.width = 0
          canvas.height = 0
        }
      }
      if (out.length === 0) {
        setStatus("error")
        if (layoutMode === "grid") {
          setError(`No labels found with the ${gridRows}×${gridCols} grid. Try a different grid or Auto.`)
        } else if (autoWarnings.length > 0) {
          setError(`No labels detected. ${autoWarnings[0]}.`)
        } else {
          setError("No labels detected. This file may use a different Meesho layout.")
        }
        return
      }
      setLabels(out)
      if (layoutMode === "grid") {
        const total = gridCounts.reduce((a, b) => a + b, 0)
        setFoldInfo(`${gridRows}×${gridCols} grid · ${total} labels across ${totalPages} pages`)
      } else {
        const parts: string[] = []
        if (folds > 0) parts.push(`${folds}/${totalPages} fold pages`)
        if (autoGridNotes.length > 0) {
          const shown = autoGridNotes.slice(0, 5).join(", ")
          parts.push(`${autoGridLabels} auto-grid labels (${shown}${autoGridNotes.length > 5 ? "…" : ""})`)
        }
        if (autoWarnings.length > 0) parts.push(...autoWarnings.slice(0, 3))
        if (parts.length === 0) parts.push("no structure found")
        setFoldInfo(parts.join(" · "))
      }
      setStatus("done")
    } catch (e) {
      setStatus("error")
      setError(e instanceof Error ? e.message : "Failed to process the PDF.")
    }
  }, [perSheet, size, layoutMode, gridRows, gridCols])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const fs = Array.from(e.dataTransfer.files ?? [])
    if (fs.length > 0) void processFiles(fs)
  }, [processFiles])

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? [])
    if (fs.length > 0) void processFiles(fs)
    e.target.value = ""
  }, [processFiles])

  const buildPdf = useCallback(async (kind: "download" | "print") => {
    if (perSheet === 1) {
      const key = `single|${fileName}|${size}|${includeInvoices}|${labels.length}`
      if (pdfCache.current && pdfCache.current.key === key) return pdfCache.current.bytes
      const total = selectOutputLabels(labels, includeInvoices).length
      setBusy(true)
      setGenTask(kind)
      setGenProgress({ current: 0, total })
      await nextFrame()
      try {
        const bytes = await generatePdf(labels, size, includeInvoices, (current, t) =>
          setGenProgress({ current, total: t }),
        )
        pdfCache.current = { key, bytes }
        return bytes
      } finally {
        setBusy(false)
        setGenTask(null)
        setGenProgress(null)
      }
    }
    const key = `impose|${perSheet}|${cutGuides}|${fileName}|${labels.length}`
    if (pdfCache.current && pdfCache.current.key === key) return pdfCache.current.bytes
    setBusy(true)
    setGenTask(kind)
    setGenProgress({ current: 0, total: labels.length })
    await nextFrame()
    try {
      const bytes = await imposePdf(imposeSources.current, perSheet, sheetGrid, { cutGuides }, (current, t) =>
        setGenProgress({ current, total: t }),
      )
      pdfCache.current = { key, bytes }
      return bytes
    } finally {
      setBusy(false)
      setGenTask(null)
      setGenProgress(null)
    }
  }, [perSheet, cutGuides, sheetGrid, fileName, size, includeInvoices, labels])

  const handleDownload = useCallback(async () => {
    const bytes = await buildPdf("download")
    const name = multiCount > 1 ? "meesho-sheets.pdf" : fileName.replace(/\.pdf$/i, "") + "-labels.pdf"
    downloadBytes(bytes, name)
  }, [buildPdf, fileName, multiCount])

  const handlePrint = useCallback(async () => {
    const bytes = await buildPdf("print")
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank", "noopener")
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }, [buildPdf])

  const shown = includeInvoices ? labels : labels.filter((l) => l.kind === "label")
  const labelCount = labels.filter((l) => l.kind === "label").length

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 sm:p-7">
      {status === "idle" || status === "error" ? (
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/50 px-6 py-14 text-center transition hover:border-brand-300 hover:bg-brand-50/40"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") inputRef.current?.click() }}
            aria-label="Upload Meesho label PDF"
          >
            <FileUp size={36} className="text-brand-600" />
            <p className="mt-3 text-base font-semibold text-ink-900">Drop your Meesho label PDFs here</p>
            <p className="mt-1 text-sm text-ink-500">or click to browse · one or more PDFs · max 50 MB each</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-500">
              <ShieldCheck size={13} className="text-brand-500" />
              Files stay in your browser — nothing is uploaded
            </p>
          </div>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple className="hidden" onChange={onPick} />
          <div className="mt-4 flex flex-col items-center gap-3">
            {perSheetPicker}
            {perSheet === 1 && layoutPicker}
          </div>
          {error && (
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-danger-600">
              <AlertTriangle size={15} /> {error}
            </p>
          )}
        </div>
      ) : null}

      {["reading", "detecting", "cropping"].includes(status) ? (
        <div className="py-6">
          <p className="flex items-center gap-2 text-base font-semibold text-ink-900">
            <Loader2 size={18} className="animate-spin text-brand-600" />
            Processing {fileName}
            {progress.total > 0 && (
              <span className="ml-auto text-sm font-medium text-ink-500">
                {progress.current} / {progress.total} pages
              </span>
            )}
          </p>
          <ul className="mt-4 space-y-2">
            {STEPS.map((s) => {
              const order = ["reading", "detecting", "cropping"]
              const active = order.indexOf(status) >= order.indexOf(s.id)
              return (
                <li key={s.id} className="flex items-center gap-2 text-sm text-ink-600">
                  <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${active ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-400"}`}>
                    {active ? "✓" : "·"}
                  </span>
                  {s.label}
                  {s.id === status && <Loader2 size={14} className="animate-spin text-brand-600" />}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      {status === "done" ? (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base font-bold text-ink-950">
              {perSheet > 1
                ? `${labels.length} label${labels.length === 1 ? "" : "s"}`
                : `${labelCount} label${labelCount === 1 ? "" : "s"} detected`}
              <span className="ml-2 text-sm font-medium text-ink-500">
                {pageCount} page{pageCount === 1 ? "" : "s"} · {fileName}
              </span>
            </p>
            <button onClick={reset} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-50">
              <RotateCcw size={14} /> New file
            </button>
          </div>
          {perSheet === 1 ? (
            foldInfo && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-500">
                <PackageSearch size={13} className="text-brand-500" /> {foldInfo}
              </p>
            )
          ) : (
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-500">
              <PackageSearch size={13} className="text-brand-500" />
              {labels.length} label{labels.length === 1 ? "" : "s"} (label only) from {multiCount} file{multiCount === 1 ? "" : "s"} → {sheetCount(labels.length, perSheet)} A4 sheet{sheetCount(labels.length, perSheet) === 1 ? "" : "s"} · {sheetGrid.cols}×{sheetGrid.rows}
              {labelOnlyInfo < labels.length && ` · ${labels.length - labelOnlyInfo} full page(s) (no label marker found)`}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-ink-200 bg-ink-50/50 p-4">
            {perSheet === 1 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink-700">Size</span>
                  {(["4x6", "a4"] as PrintSizeId[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${size === s ? "border-brand-600 bg-brand-600 text-white" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"}`}
                    >
                      {s === "4x6" ? "4 × 6 in" : "A4"}
                    </button>
                  ))}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
                  <input type="checkbox" checked={includeInvoices} onChange={(e) => setIncludeInvoices(e.target.checked)} className="h-4 w-4 accent-brand-600" />
                  Include invoices in output
                </label>
                {layoutPicker}
              </>
            ) : (
              <p className="text-sm font-semibold text-ink-700">
                Output: {perSheet} per sheet ({sheetGrid.cols}×{sheetGrid.rows}) · label only on A4
              </p>
            )}
            {perSheet > 1 && (
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
                <input type="checkbox" checked={cutGuides} onChange={(e) => setCutGuides(e.target.checked)} className="h-4 w-4 accent-brand-600" />
                Cut guides
              </label>
            )}
            <div className="ml-auto flex gap-2">
              <button onClick={handleDownload} disabled={busy || shown.length === 0} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} Download PDF
              </button>
              <button onClick={handlePrint} disabled={busy || shown.length === 0} className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50 disabled:opacity-50">
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Printer size={15} />} Print
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-500">
            {perSheet === 1
              ? "Changing size or layout re-processes on next upload. Print at 100% scale with no margins for correct 4×6 output."
              : "Labels cropped to the shipping label (invoice and product details removed) and arranged on A4 sheets. Cut along the dashed guides. Print at 100% scale with no margins."}
          </p>
          {genProgress && (
            <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50/60 p-4" role="status" aria-live="polite">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Loader2 size={16} className="animate-spin text-brand-600" />
                Preparing PDF… {genProgress.current} / {genProgress.total}
                <span className="ml-auto text-xs font-medium capitalize text-ink-500">{genTask}</span>
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-brand-600 transition-[width]"
                  style={{ width: `${genProgress.total > 0 ? Math.round((genProgress.current / genProgress.total) * 100) : 0}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setDetail(l)}
                className="group relative overflow-hidden rounded-lg border border-ink-200 bg-white text-left hover:border-brand-300"
              >
                <img src={l.previewUrl} alt={`${l.kind} ${i + 1}`} className="block w-full" loading="lazy" />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-ink-950/80 px-1.5 py-0.5 text-[11px] font-bold text-white">
                  {i + 1}
                  <span className={`ml-1 rounded px-1 text-[10px] uppercase ${l.kind === "label" ? "bg-brand-600" : "bg-ink-500"}`}>{l.kind}</span>
                </span>
                <span className="absolute bottom-2 right-2 rounded-md bg-ink-950/70 p-1 text-white opacity-0 transition group-hover:opacity-100">
                  <ZoomIn size={14} />
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4" onClick={() => setDetail(null)} role="dialog" aria-modal="true">
          <div className="max-h-[90vh] max-w-2xl overflow-auto rounded-xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center">
              <p className="text-sm font-semibold text-ink-900">Page {detail.page} · {detail.kind}</p>
              <button onClick={() => setDetail(null)} className="ml-auto rounded-lg border border-ink-200 p-1.5 text-ink-600 hover:bg-ink-50" aria-label="Close preview">
                <X size={16} />
              </button>
            </div>
            <img src={detail.fullUrl} alt={`Detail of ${detail.kind} on page ${detail.page}`} className="block w-full rounded-lg border border-ink-200" />
          </div>
        </div>
      )}
    </div>
  )
}
