import { useCallback, useRef, useState } from "react"
import { FileUp, Loader2, Download, Printer, RotateCcw, ShieldCheck, PackageSearch, AlertTriangle, ZoomIn, X } from "lucide-react"
import { loadPdf, renderPageToCanvas } from "./lib/pdf"
import { detectPage } from "./lib/detect"
import { cropRegion, resizeForPrint, printTargetPx, canvasToPngDataUrl } from "./lib/crop"
import { generatePdf, downloadBytes } from "./lib/generate"
import type { LabelImage, ProcessStatus, PrintSizeId } from "./types"

const MAX_BYTES = 50 * 1024 * 1024

const STEPS: { id: ProcessStatus; label: string }[] = [
  { id: "reading", label: "Reading PDF" },
  { id: "detecting", label: "Detecting labels" },
  { id: "cropping", label: "Cropping & resizing" },
  { id: "generating", label: "Preparing preview" },
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
  const [fileName, setFileName] = useState("")
  const [busy, setBusy] = useState(false)
  const [detail, setDetail] = useState<LabelImage | null>(null)
  const [foldInfo, setFoldInfo] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setStatus("idle")
    setError(null)
    setLabels([])
    setPageCount(0)
    setProgress({ current: 0, total: 0 })
    setFileName("")
    setDetail(null)
    setFoldInfo(null)
  }, [])

  const processFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.")
      return
    }
    if (file.size > MAX_BYTES) {
      setError("File is too large (max 50 MB).")
      return
    }
    setError(null)
    setLabels([])
    setFileName(file.name)
    try {
      setStatus("reading")
      const buf = await file.arrayBuffer()
      const pdf = await loadPdf(buf)
      setPageCount(pdf.numPages)

      setStatus("detecting")
      const target = printTargetPx(size)
      const out: LabelImage[] = []
      let folds = 0
      for (let p = 1; p <= pdf.numPages; p++) {
        setProgress({ current: p, total: pdf.numPages })
        const canvas = await renderPageToCanvas(pdf, p, 2)
        const det = detectPage(canvas, p)
        if (det.foldY != null) folds++
        if (det.regions.length === 0) continue
        setStatus("cropping")
        for (const r of det.regions) {
          const cropped = cropRegion(canvas, r)
          const resized = resizeForPrint(cropped, target.w, target.h)
          out.push({
            id: `${p}-${r.kind}`,
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
      if (out.length === 0) {
        setStatus("error")
        setError("No labels detected. This file may use a different Meesho layout.")
        return
      }
      setLabels(out)
      setFoldInfo(`${folds}/${pdf.numPages} pages: fold line found`)
      setStatus("done")
    } catch (e) {
      setStatus("error")
      setError(e instanceof Error ? e.message : "Failed to process the PDF.")
    }
  }, [size])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) void processFile(f)
  }, [processFile])

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) void processFile(f)
    e.target.value = ""
  }, [processFile])

  const handleDownload = useCallback(async () => {
    setBusy(true)
    try {
      const bytes = await generatePdf(labels, size, includeInvoices)
      downloadBytes(bytes, fileName.replace(/\.pdf$/i, "") + "-labels.pdf")
    } finally {
      setBusy(false)
    }
  }, [labels, size, includeInvoices, fileName])

  const handlePrint = useCallback(async () => {
    setBusy(true)
    try {
      const bytes = await generatePdf(labels, size, includeInvoices)
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank", "noopener")
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } finally {
      setBusy(false)
    }
  }, [labels, size, includeInvoices])

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
            <p className="mt-3 text-base font-semibold text-ink-900">Drop your Meesho label PDF here</p>
            <p className="mt-1 text-sm text-ink-500">or click to browse · PDF only · max 50 MB</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-500">
              <ShieldCheck size={13} className="text-brand-500" />
              Files stay in your browser — nothing is uploaded
            </p>
          </div>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onPick} />
          {error && (
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-danger-600">
              <AlertTriangle size={15} /> {error}
            </p>
          )}
        </div>
      ) : null}

      {["reading", "detecting", "cropping", "generating"].includes(status) ? (
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
              const order = ["reading", "detecting", "cropping", "generating"]
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
              {labelCount} label{labelCount === 1 ? "" : "s"} detected
              <span className="ml-2 text-sm font-medium text-ink-500">
                {pageCount} page{pageCount === 1 ? "" : "s"} · {fileName}
              </span>
            </p>
            <button onClick={reset} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-50">
              <RotateCcw size={14} /> New file
            </button>
          </div>
          {foldInfo && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-500">
              <PackageSearch size={13} className="text-brand-500" /> {foldInfo}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-ink-200 bg-ink-50/50 p-4">
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
            Changing size re-processes on next upload. Print at 100% scale with no margins for correct 4×6 output.
          </p>

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
