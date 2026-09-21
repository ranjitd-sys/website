import { useCallback, useRef, useState, type ReactNode } from "react"
import { FileUp, Loader2, Download, Printer, RotateCcw, ShieldCheck, PackageSearch, PackageCheck, AlertTriangle, ZoomIn, X, FileText, ArrowDownUp, Settings2, ChevronDown, Scissors, Minus, Wand2 } from "lucide-react"
import { loadPdf, renderPageToCanvas } from "./lib/pdf"
import { analyzePage } from "./lib/labelbox"
import { cropRegion, canvasToPngDataUrl, downloadBytes } from "./lib/crop"
import { imposePdf, chooseGrid, sheetCount, nextFrame, computeLayout, type ImposeUnit, type A4Layout } from "./lib/impose"
import { thermalPdf } from "./lib/thermal"
import { invoicesPdf } from "./lib/invoices"
import { picklistPdf } from "./lib/picklist"
import { sortUnits } from "./lib/sort"
import type { ProcessStatus, OutputMode, ThermalPresetId, FitMode, SortKey, InvoiceMode, PerSheet, LabelImage } from "./types"
import { THERMAL_PRESETS } from "./types"

const MAX_BYTES = 50 * 1024 * 1024

const STEPS: { id: ProcessStatus; label: string }[] = [
  { id: "reading", label: "Reading PDF" },
  { id: "analyzing", label: "Locating each label" },
  { id: "preparing", label: "Building previews" },
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

const FIT_LABELS: Record<FitMode, string> = {
  auto: "Auto (rotate to fill)",
  contain: "Contain (no stretch)",
  "fit-width": "Stretch to page",
  actual: "Actual size",
}

function Field({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-bold uppercase tracking-wide text-ink-500">{title}</span>
      {children}
    </div>
  )
}

interface SegOption<T extends string> {
  value: T
  label: string
  caption?: string
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: SegOption<T>[]
  value: T
  onChange: (v: T) => void
  ariaLabel?: string
}) {
  return (
    <div
      className="inline-flex gap-0.5 overflow-hidden rounded-lg border border-ink-200 bg-ink-50/70 p-0.5"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            aria-label={o.label}
            className={`flex flex-col items-start rounded-md px-3 py-1.5 text-left transition ${
              active ? "bg-white text-ink-950 shadow-sm" : "text-ink-500 hover:text-ink-800"
            }`}
          >
            <span className="text-sm font-semibold leading-tight">{o.label}</span>
            {o.caption ? (
              <span className={`text-[11px] leading-tight ${active ? "text-ink-500" : "text-ink-400"}`}>
                {o.caption}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function Switch({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-brand-600" : "bg-ink-300"}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
          checked ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-ink-700">
      <Switch checked={checked} onChange={onChange} ariaLabel={label} />
      {label}
    </label>
  )
}

function OptionCard({
  title,
  description,
  icon,
  checked,
  onChange,
}: {
  title: string
  description: string
  icon: ReactNode
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex h-full cursor-pointer select-none items-start gap-3 rounded-xl border border-ink-200 bg-white p-3 transition hover:border-brand-300">
      <span
        className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
          checked ? "bg-brand-50 text-brand-600" : "bg-ink-100 text-ink-400"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold leading-tight text-ink-900">{title}</span>
          <Switch checked={checked} onChange={onChange} ariaLabel={title} />
        </span>
        <span className="mt-1 block text-xs leading-snug text-ink-400">{description}</span>
      </span>
    </label>
  )
}

function PrintSchematic({
  outputMode,
  perSheet,
  grid,
}: {
  outputMode: OutputMode
  perSheet: PerSheet
  grid: { rows: number; cols: number }
}) {
  const cells = Array.from({ length: grid.rows * grid.cols })
  const shrinkLine =
    "pointer-events-none absolute border-dashed border-brand-500"
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div
        className="relative w-32 shrink-0 rounded-md border border-ink-300 bg-white p-1.5 shadow-sm"
        style={{ aspectRatio: outputMode === "a4" ? "210 / 297" : "2 / 3" }}
      >
        <div
          className="grid h-full w-full gap-1 p-1"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
            gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
          }}
        >
          {cells.map((_, i) => (
            <div key={i} className="flex items-center justify-center rounded-[3px] border border-ink-200 bg-white">
              <div className="flex w-3/4 flex-col items-center gap-[3px]">
                <span className="h-[3px] w-full rounded-full bg-ink-800" />
                <span className="h-[3px] w-2/3 rounded-full bg-ink-400" />
                <span className="h-[3px] w-1/2 rounded-full bg-ink-300" />
              </div>
              {outputMode !== "a4" && (
                <span className="absolute inset-x-1.5 bottom-1.5 h-[3px] rounded-full bg-ink-900" />
              )}
            </div>
          ))}
        </div>
        {grid.cols > 1 &&
          Array.from({ length: grid.cols - 1 }).map((_, i) => (
            <span
              key={`c${i}`}
              className={`${shrinkLine} inset-y-0 border-l`}
              style={{ left: `${((i + 1) / grid.cols) * 100}%` }}
            />
          ))}
        {grid.rows > 1 &&
          Array.from({ length: grid.rows - 1 }).map((_, i) => (
            <span
              key={`r${i}`}
              className={`${shrinkLine} inset-x-0 border-t`}
              style={{ top: `${((i + 1) / grid.rows) * 100}%` }}
            />
          ))}
      </div>
      <div className="text-sm">
        <p className="font-semibold text-ink-900">
          {outputMode === "a4"
            ? `${perSheet} label${perSheet === 1 ? "" : "s"} on each A4 page`
            : "One label per page"}
        </p>
        <p className="mt-0.5 text-ink-500">
          {outputMode === "a4"
            ? "Cut along the dashed lines to separate."
            : "Sized for your thermal printer."}
        </p>
      </div>
    </div>
  )
}

function SheetPreview({
  layout,
  labels,
  cutGuides,
}: {
  layout: A4Layout
  labels: (LabelImage | null)[]
  cutGuides: boolean
}) {
  const S = 0.16
  const W = 595.28 * S
  const H = 841.89 * S
  const PAD = 8 * S
  const MAX_SHOWN = 2
  const shown = Math.min(layout.sheets, MAX_SHOWN)
  const more = Math.max(0, layout.sheets - MAX_SHOWN)
  return (
    <div className="flex flex-wrap items-start gap-4">
      {Array.from({ length: shown }).map((_, si) => {
        const cells = layout.cells.filter((c) => c.sheet === si)
        return (
          <div key={si} className="flex flex-col gap-1.5">
            <div
              className="relative overflow-hidden rounded-md border border-ink-300 bg-white shadow-sm"
              style={{ width: W, height: H }}
            >
              {cutGuides
                ? cells.map((c) => (
                    <span
                      key={`g${c.unit}`}
                      className="pointer-events-none absolute rounded-[2px] border border-dashed border-brand-400"
                      style={{
                        left: c.left * S - PAD,
                        top: H - (c.y + c.height) * S - PAD,
                        width: c.width * S + PAD * 2,
                        height: c.height * S + PAD * 2,
                      }}
                    />
                  ))
                : null}
              {cells.map((c) => {
                const img = labels[c.unit]?.previewUrl
                return (
                  <div
                    key={c.unit}
                    className="absolute overflow-hidden rounded-[2px] border border-ink-100"
                    style={{
                      left: c.left * S,
                      top: H - (c.y + c.height) * S,
                      width: c.width * S,
                      height: c.height * S,
                    }}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`Label ${c.unit + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>
            <p className="text-center text-[11px] font-medium text-ink-500">
              {layout.sheets > 1 ? `Sheet ${si + 1} of ${layout.sheets}` : "Sheet"}
            </p>
          </div>
        )
      })}
      {more > 0 && (
        <div
          className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-ink-300 px-4 text-center"
          style={{ height: H * 0.6 }}
        >
          <span className="text-lg font-bold text-ink-600">+{more}</span>
          <span className="text-[11px] leading-tight text-ink-400">
            more sheet{more === 1 ? "" : "s"}
          </span>
        </div>
      )}
    </div>
  )
}

function Select({
  value,
  onChange,
  children,
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  children: ReactNode
  ariaLabel: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-ink-700"
    >
      {children}
    </select>
  )
}

export default function LabelManager() {
  const [status, setStatus] = useState<ProcessStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [labels, setLabels] = useState<LabelImage[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [outputMode, setOutputMode] = useState<OutputMode>("a4")
  const [perSheet, setPerSheet] = useState<PerSheet>(4)
  const [cutGuides, setCutGuides] = useState(true)
  const [cutGap, setCutGap] = useState(0)
  const [endLine, setEndLine] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [overlay, setOverlay] = useState(false)
  const [thermalPreset, setThermalPreset] = useState<ThermalPresetId>("4x6")
  const [thermalFit, setThermalFit] = useState<FitMode>("auto")
  const [invoiceMode, setInvoiceMode] = useState<InvoiceMode>("off")
  const [picklist, setPicklist] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>("default")
  const [rasterCount, setRasterCount] = useState(0)
  const imposeUnits = useRef<ImposeUnit[]>([])
  const imposeAspect = useRef(1)
  const [fileName, setFileName] = useState("")
  const [busy, setBusy] = useState(false)
  const [genTask, setGenTask] = useState<"download" | "print" | null>(null)
  const [genProgress, setGenProgress] = useState<{ current: number; total: number } | null>(null)
  const pdfCache = useRef<{ key: string; bytes: Uint8Array } | null>(null)
  const pdfInvoiceCache = useRef<{ key: string; bytes: Uint8Array } | null>(null)
  const pdfPicklistCache = useRef<{ key: string; bytes: Uint8Array } | null>(null)
  const [detail, setDetail] = useState<LabelImage | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setStatus("idle")
    setError(null)
    setLabels([])
    setPageCount(0)
    setProgress({ current: 0, total: 0 })
    setFileName("")
    setRasterCount(0)
    setDetail(null)
    setShowAdvanced(false)
    setGenTask(null)
    setGenProgress(null)
    pdfCache.current = null
    pdfInvoiceCache.current = null
    pdfPicklistCache.current = null
    imposeUnits.current = []
    imposeAspect.current = 1
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
    pdfCache.current = null
    pdfInvoiceCache.current = null
    pdfPicklistCache.current = null
    imposeUnits.current = []
    try {
      setStatus("reading")
      const docs: { bytes: ArrayBuffer; pdf: Awaited<ReturnType<typeof loadPdf>> }[] = []
      for (const f of files) {
        const buf = await f.arrayBuffer()
        const pdf = await loadPdf(buf.slice(0))
        docs.push({ bytes: buf, pdf })
      }
      const totalPages = docs.reduce((a, d) => a + d.pdf.numPages, 0)
      setPageCount(totalPages)

      setStatus("analyzing")
      const out: LabelImage[] = []
      const units: ImposeUnit[] = []
      let raster = 0
      let n = 0
      for (let fi = 0; fi < docs.length; fi++) {
        const { bytes, pdf } = docs[fi]
        for (let p = 1; p <= pdf.numPages; p++) {
          n++
          setProgress({ current: n, total: totalPages })
          const full = await renderPageToCanvas(pdf, p, 1)
          const analyzed = await analyzePage(pdf, p, full)
          if (analyzed.box.fromRaster) raster++
          const sw = analyzed.box.labelBox.right - analyzed.box.labelBox.left
          const sh = analyzed.box.labelBox.top - analyzed.box.labelBox.bottom
          units.push({
            bytes,
            pageIndex: p,
            box: analyzed.box.labelBox,
            invoice: analyzed.box.invoiceBox,
            meta: analyzed.meta,
          })
          const H = full.height
          const cropped = cropRegion(full, {
            page: p,
            x: analyzed.box.labelBox.left,
            y: H - analyzed.box.labelBox.top,
            width: sw,
            height: sh,
          })
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
      }
      imposeUnits.current = units
      const first = units.find((u) => u.box.right - u.box.left > 1)
      imposeAspect.current = first
        ? (first.box.right - first.box.left) / (first.box.top - first.box.bottom)
        : 1
      setRasterCount(raster)
      setStatus("preparing")
      setLabels(out)
      setStatus("done")
    } catch (e) {
      setStatus("error")
      setError(e instanceof Error ? e.message : "Failed to process the PDF.")
    }
  }, [])

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

  const buildPrimary = useCallback(async (kind: "download" | "print") => {
    const units = sortUnits(imposeUnits.current, sortKey)
    const qualifiers = [
      fileName,
      outputMode,
      perSheet,
      cutGuides,
      cutGap,
      endLine,
      autoRotate,
      overlay,
      thermalPreset,
      thermalFit,
      sortKey,
      units.length,
    ].join("|")
    if (pdfCache.current && pdfCache.current.key === qualifiers && pdfCache.current.bytes.byteLength > 0) {
      return pdfCache.current.bytes
    }
    setBusy(true)
    setGenTask(kind)
    setGenProgress({ current: 0, total: units.length })
    await nextFrame()
    try {
      let bytes: Uint8Array
      if (outputMode === "a4") {
        const grid = chooseGrid(perSheet, imposeAspect.current)
        bytes = await imposePdf(
          units,
          perSheet,
          grid,
          { cutGuides, overlay, endLine, autoRotate, cutGap },
          (c, t) => setGenProgress({ current: c, total: t }),
        )
      } else {
        bytes = await thermalPdf(
          units,
          { preset: thermalPreset, fit: thermalFit, overlay, endLine },
          (c, t) => setGenProgress({ current: c, total: t }),
        )
      }
      pdfCache.current = { key: qualifiers, bytes }
      return bytes
    } finally {
      setBusy(false)
      setGenTask(null)
      setGenProgress(null)
    }
  }, [sortKey, fileName, outputMode, perSheet, cutGuides, cutGap, endLine, autoRotate, overlay, thermalPreset, thermalFit])

  const buildInvoices = useCallback(async () => {
    if (invoiceMode !== "a4") return null
    const units = sortUnits(imposeUnits.current, sortKey)
    const key = `inv|${fileName}|${sortKey}|${units.length}`
    if (pdfInvoiceCache.current && pdfInvoiceCache.current.key === key) return pdfInvoiceCache.current.bytes
    setBusy(true)
    setGenTask("download")
    setGenProgress({ current: 0, total: units.length })
    await nextFrame()
    try {
      const bytes = await invoicesPdf(units, { mode: invoiceMode }, (c, t) =>
        setGenProgress({ current: c, total: t }),
      )
      pdfInvoiceCache.current = { key, bytes }
      return bytes
    } finally {
      setBusy(false)
      setGenTask(null)
      setGenProgress(null)
    }
  }, [invoiceMode, sortKey, fileName])

  const buildPicklist = useCallback(async () => {
    if (!picklist) return null
    const units = sortUnits(imposeUnits.current, sortKey)
    const key = `pick|${fileName}|${sortKey}|${units.length}`
    if (pdfPicklistCache.current && pdfPicklistCache.current.key === key) return pdfPicklistCache.current.bytes
    setBusy(true)
    setGenTask("download")
    setGenProgress({ current: 0, total: units.length })
    await nextFrame()
    try {
      const bytes = await picklistPdf(units, fileName.replace(/\.pdf$/i, "") || "Picklist")
      pdfPicklistCache.current = { key, bytes }
      return bytes
    } finally {
      setBusy(false)
      setGenTask(null)
      setGenProgress(null)
    }
  }, [picklist, sortKey, fileName])

  const buildOverlaySummary = (): string => {
    const couriers = new Set<string>()
    const skus = new Set<string>()
    for (const u of imposeUnits.current) {
      if (u.meta?.courier) couriers.add(u.meta.courier)
      if (u.meta?.sku) skus.add(u.meta.sku)
    }
    const parts: string[] = []
    if (couriers.size > 0) parts.push(`${couriers.size} courier${couriers.size === 1 ? "" : "s"}`)
    if (skus.size > 0) parts.push(`${skus.size} SKU${skus.size === 1 ? "" : "s"}`)
    return parts.join(" · ")
  }

  const handleDownload = useCallback(async () => {
    const bytes = await buildPrimary("download")
    const base = fileName.replace(/\.pdf$/i, "")
    const name = fileName.includes("files") ? "meesho-labels.pdf" : `${base}-labels.pdf`
    downloadBytes(bytes, name)
    const inv = await buildInvoices()
    if (inv) downloadBytes(inv, fileName.includes("files") ? "meesho-invoices.pdf" : `${base}-invoices.pdf`)
    const pick = await buildPicklist()
    if (pick) downloadBytes(pick, fileName.includes("files") ? "meesho-picklist.pdf" : `${base}-picklist.pdf`)
  }, [buildPrimary, buildInvoices, buildPicklist, fileName])

  const handlePrint = useCallback(async () => {
    const bytes = await buildPrimary("print")
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank", "noopener")
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }, [buildPrimary])

  const labelCount = labels.filter((l) => l.kind === "label").length
  const listEnd = (
    <span className="flex flex-wrap items-center gap-1.5">
      <PackageSearch size={14} className="mr-0.5 text-brand-500" />
      {labels.length} label{labels.length === 1 ? "" : "s"} · label only
      {outputMode === "a4"
        ? ` → ${sheetCount(labels.length, perSheet)} A4 sheet${sheetCount(labels.length, perSheet) === 1 ? "" : "s"} · ${chooseGrid(perSheet, imposeAspect.current).cols}×${chooseGrid(perSheet, imposeAspect.current).rows}`
        : ` → ${labels.length} × ${THERMAL_PRESETS[thermalPreset].label}`}
      {rasterCount > 0 && ` · ${rasterCount} raster page${rasterCount === 1 ? "" : "s"} (pixel-detected)`}
      {overlay && ` · SKU overlay`}
      {picklist && ` · + picklist`}
      {invoiceMode === "a4" && ` · + separate invoices PDF`}
    </span>
  )

  const perSheetHint =
    perSheet === 1
      ? "One label per page."
      : perSheet === 2
        ? "Two labels per page."
        : "Four labels per page, arranged 2×2."

  const controlRow = (
    <div className="flex flex-col gap-5">
      <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        <Field title="Output">
          <Segmented
            ariaLabel="Output type"
            value={outputMode}
            onChange={setOutputMode}
            options={[
              { value: "a4", label: "A4 sheets", caption: "regular printer" },
              { value: "thermal", label: "Thermal", caption: "label printer" },
            ]}
          />
        </Field>

        {outputMode === "a4" ? (
          <Field title="Labels per sheet">
            <div className="flex flex-col gap-1.5">
              <Segmented
                ariaLabel="Labels per sheet"
                value={String(perSheet)}
                onChange={(v) => setPerSheet(Number(v) as PerSheet)}
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "4", label: "4" },
                ]}
              />
              <span className="text-[11px] text-ink-400">{perSheetHint}</span>
            </div>
          </Field>
        ) : (
          <Field title="Label size">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Select value={thermalPreset} onChange={(v) => setThermalPreset(v as ThermalPresetId)} ariaLabel="Thermal label size">
                {(Object.keys(THERMAL_PRESETS) as ThermalPresetId[]).map((id) => (
                  <option key={id} value={id}>{THERMAL_PRESETS[id].label}</option>
                ))}
              </Select>
              <Select value={thermalFit} onChange={(v) => setThermalFit(v as FitMode)} ariaLabel="Thermal fit mode">
                {(Object.keys(FIT_LABELS) as FitMode[]).map((m) => (
                  <option key={m} value={m}>{FIT_LABELS[m]}</option>
                ))}
              </Select>
              <Toggle label="Label end line" checked={endLine} onChange={setEndLine} />
            </div>
          </Field>
        )}

        {outputMode === "a4" && (
          <>
            <Field title="Cutting &amp; fitting">
              <div className="flex flex-col gap-2">
                <OptionCard
                  title="Cut guides"
                  description="Dashed lines showing where to cut"
                  icon={<Scissors size={15} />}
                  checked={cutGuides}
                  onChange={setCutGuides}
                />
                <OptionCard
                  title="Rotate to fill"
                  description="Turn labels that fit better sideways"
                  icon={<RotateCcw size={15} />}
                  checked={autoRotate}
                  onChange={setAutoRotate}
                />
                <OptionCard
                  title="Label end line"
                  description="A line marking the end of each label"
                  icon={<Minus size={15} />}
                  checked={endLine}
                  onChange={setEndLine}
                />
              </div>
            </Field>
            <Field title="Space between labels">
              <label className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={cutGap}
                  onChange={(e) => setCutGap(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-ink-200 accent-brand-600"
                  aria-label="Space between labels"
                />
                <span className="w-9 rounded-md bg-ink-100 px-1 py-0.5 text-center text-xs font-bold text-ink-700">
                  {cutGap}
                </span>
              </label>
            </Field>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-ink-100 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-wide text-ink-500">More options</span>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2">
            <ArrowDownUp size={14} className="text-ink-400" />
            <Select value={sortKey} onChange={(v) => setSortKey(v as SortKey)} ariaLabel="Sort labels">
              <option value="default">As uploaded</option>
              <option value="courier">By courier</option>
              <option value="sku">By SKU</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-ink-400" />
            <Select value={invoiceMode} onChange={(v) => setInvoiceMode(v as InvoiceMode)} ariaLabel="Invoice output">
              <option value="off">Invoices · Off</option>
              <option value="a4">Invoices · Separate A4 PDF</option>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Toggle label="SKU-qty chip" checked={overlay} onChange={setOverlay} />
            <Toggle label="Picklist" checked={picklist} onChange={setPicklist} />
          </div>
        </div>
      </div>
    </div>
  )

  const metaSummary = buildOverlaySummary()

  const sheets = sheetCount(labels.length, perSheet)
  const readyLine =
    outputMode === "a4"
      ? `Prints on ${sheets} A4 sheet${sheets === 1 ? "" : "s"} with ${perSheet} label${perSheet === 1 ? "" : "s"} on each page. Cut once down the middle, then once across, to get ${labels.length} label${labels.length === 1 ? "" : "s"}.`
      : `${labels.length} label${labels.length === 1 ? "" : "s"}, one per page on ${THERMAL_PRESETS[thermalPreset].label}. Print at 100% size, no scaling.`

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
          {error && (
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-danger-600">
              <AlertTriangle size={15} /> {error}
            </p>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { Icon: FileUp, title: "Upload your PDF", desc: "The one from your Meesho supplier panel" },
              { Icon: Wand2, title: "We arrange it", desc: "Split, crop and lay your labels out" },
              { Icon: Printer, title: "Download & print", desc: "A4 sheets or 4×6 thermal stickers" },
            ].map((s) => (
              <div key={s.title} className="flex items-start gap-2.5 rounded-lg border border-ink-100 bg-white px-3 py-2.5">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <s.Icon size={14} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{s.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-ink-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {["reading", "analyzing", "preparing"].includes(status) ? (
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
              const order = ["reading", "analyzing", "preparing"]
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
          <p className="mt-4 text-xs text-ink-400">This usually takes just a few seconds.</p>
        </div>
      ) : null}

      {status === "done" ? (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base font-bold text-ink-950">
              {labelCount} label{labelCount === 1 ? "" : "s"}
              <span className="ml-2 text-sm font-medium text-ink-500">
                {pageCount} page{pageCount === 1 ? "" : "s"} · {fileName}
              </span>
            </p>
            <button onClick={reset} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-50">
              <RotateCcw size={14} /> New file
            </button>
          </div>
          <p className="mt-2 inline-flex items-start gap-2 text-xs text-ink-500">
            <span className="mt-0.5">{listEnd}</span>
          </p>
          {metaSummary && (
            <span className="mt-1 inline-block text-xs text-ink-500">{metaSummary}</span>
          )}

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-ink-200 bg-ink-50/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
                <PackageCheck size={18} />
              </span>
              <div>
                <p className="text-base font-bold text-ink-950">Your labels are ready</p>
                <p className="mt-0.5 text-sm text-ink-500">{readyLine}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={handlePrint}
                disabled={busy || labels.length === 0}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50 disabled:opacity-50 sm:flex-none"
              >
                {busy && genTask === "print" ? <Loader2 size={15} className="animate-spin" /> : <Printer size={15} />} Print
              </button>
              <button
                onClick={handleDownload}
                disabled={busy || labels.length === 0}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 sm:flex-none"
              >
                {busy && genTask === "download" ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} Download PDF
              </button>
            </div>
          </div>

          <div className="mt-4 flex w-fit flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-brand-600">Here's what you'll get</span>
            {outputMode === "a4" ? (
              <SheetPreview
                layout={computeLayout(
                  sortUnits(imposeUnits.current, sortKey),
                  perSheet,
                  chooseGrid(perSheet, imposeAspect.current),
                  { cutGuides, overlay, endLine, autoRotate, cutGap },
                )}
                labels={sortUnits(imposeUnits.current, sortKey).map(
                  (u) => labels[imposeUnits.current.indexOf(u)] ?? null,
                )}
                cutGuides={cutGuides}
              />
            ) : (
              <PrintSchematic outputMode={outputMode} perSheet={perSheet} grid={{ rows: 1, cols: 1 }} />
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-ink-200 bg-white">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-expanded={showAdvanced}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ink-50/60"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-ink-900">
                <Settings2 size={15} className="text-ink-400" />
                Customize print
                <span className="font-normal text-ink-400">(optional)</span>
              </span>
              <span className="flex items-center gap-2">
                {showAdvanced && (
                  <span className="hidden text-xs text-ink-400 sm:inline">
                    {outputMode === "a4" ? "cut guides · rotate · end line" : "label size · fit · end line"}
                  </span>
                )}
                <ChevronDown size={16} className={`text-ink-400 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              </span>
            </button>
            {showAdvanced && <div className="border-t border-ink-100 px-4 py-4">{controlRow}</div>}
          </div>

          <p className="mt-3 text-xs text-ink-500">
            {outputMode === "a4"
              ? "Print this PDF on A4 paper at 100% scale with no margins. The dashed lines show where to cut."
              : "Print each label at 100% scale with no margins, and pick a matching sticker size in the print dialog."}
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
            {labels.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setDetail(l)}
                className="group relative overflow-hidden rounded-lg border border-ink-200 bg-white text-left hover:border-brand-300"
              >
                <img src={l.previewUrl} alt={`Label ${i + 1}`} className="block w-full" loading="lazy" />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-ink-950/80 px-1.5 py-0.5 text-[11px] font-bold text-white">
                  {i + 1}
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
              <p className="text-sm font-semibold text-ink-900">Page {detail.page}</p>
              <button onClick={() => setDetail(null)} className="ml-auto rounded-lg border border-ink-200 p-1.5 text-ink-600 hover:bg-ink-50" aria-label="Close preview">
                <X size={16} />
              </button>
            </div>
            <img src={detail.fullUrl} alt={`Detail of label on page ${detail.page}`} className="block w-full rounded-lg border border-ink-200" />
          </div>
        </div>
      )}
    </div>
  )
}