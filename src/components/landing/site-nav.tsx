import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent as ReactMouseEvent } from "react"
import {
  ArrowRight,
  Boxes,
  Calculator,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Command,
  FileBarChart2,
  FileSpreadsheet,
  Gauge,
  Landmark,
  LayoutDashboard,
  Menu,
  Receipt,
  ScrollText,
  ServerCog,
  Store,
  Truck,
  Building2,
  Globe,
  Code2,
  PieChart,
  UserCheck,
  ShieldCheck,
  ShoppingBag,
  Briefcase,
  BarChart3,
  PenLine,
  BookOpen,
  HelpCircle,
  LifeBuoy,
  Scale,
  Server,
  CreditCard,
  X,
  type LucideIcon,
  TrendingUp,
  Clock,
} from "lucide-react"
import { AnimatePresence, motion, MotionConfig, type Variants } from "framer-motion"
import { LogoMark } from "./icons"
import { BOOK_DEMO_URL, LOGIN_URL, NAV_ITEMS, type NavGroup, type NavItem, type NavLink } from "@/data/navigation"
import { INTEGRATION_CATEGORIES, integrationsByCategory, type IntegrationCategoryId } from "@/data/integrations"
import { customers } from "@/data/customers"
import { Button } from "./ui/button"

const OPEN_DELAY = 100
const CLOSE_DELAY = 180

const CARD_ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  profitability: TrendingUp,
  "payment reconciliation": Landmark,
  dashboard: Gauge,
  reports: FileBarChart2,
  accounting: Calculator,
  gst: Receipt,
  "inventory & stock transfers": Boxes,
  tally: ScrollText,
  sap: ServerCog,
  zoho: FileSpreadsheet,
  "dtc brands": Store,
  enterprise: Building2,
  marketplaces: Globe,
  "3pl & warehouses": Truck,
  "founders & cxos": Clock,
  "finance teams": Calculator,
  operations: UserCheck,
  developers: Code2,
  compliance: ShieldCheck,
  "amazon sellers": ShoppingBag,
  cfos: BarChart3,
  "business owners": Briefcase,
  blog: PenLine,
  guides: BookOpen,
  faqs: HelpCircle,
  "help center": LifeBuoy,
  reconciliation: Scale,
  erp: Server,
}

function iconFor(key?: string): LucideIcon {
  if (!key) return Command
  const normalized = key.toLowerCase()
  if (CARD_ICONS[normalized]) return CARD_ICONS[normalized]

  if (normalized.includes("brand") || normalized.includes("dtc")) return Store
  if (normalized.includes("enterprise") || normalized.includes("scale")) return Building2
  if (normalized.includes("marketplace") || normalized.includes("channel")) return Globe
  if (normalized.includes("3pl") || normalized.includes("warehouse") || normalized.includes("fulfillment")) return Truck
  if (normalized.includes("founder") || normalized.includes("cxo") || normalized.includes("executive")) return PieChart
  if (normalized.includes("finance") || normalized.includes("account")) return Calculator
  if (normalized.includes("operation") || normalized.includes("manager")) return UserCheck
  if (normalized.includes("developer") || normalized.includes("engineer")) return Code2
  if (normalized.includes("compliance") || normalized.includes("legal") || normalized.includes("audit")) return ShieldCheck

  return Command
}

// --- Enhanced Hover & Pin State Controller ---

function useHoverNav() {
  const [open, setOpen] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const timers = useRef({ open: null as ReturnType<typeof setTimeout> | null, close: null as ReturnType<typeof setTimeout> | null })
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const suppressFocusUntil = useRef(0)

  const clearTimers = useCallback(() => {
    if (timers.current.open) clearTimeout(timers.current.open)
    if (timers.current.close) clearTimeout(timers.current.close)
    timers.current.open = null
    timers.current.close = null
  }, [])

  const openSoon = useCallback(
    (id: string) => {
      if (pinned) return
      clearTimers()
      setOpen((currentOpen) => {
        if (currentOpen && currentOpen !== id) return id
        timers.current.open = setTimeout(() => setOpen(id), OPEN_DELAY)
        return currentOpen
      })
    },
    [clearTimers, pinned],
  )

  const closeSoon = useCallback(() => {
    if (pinned) return
    clearTimers()
    timers.current.close = setTimeout(() => setOpen(null), CLOSE_DELAY)
  }, [clearTimers, pinned])

  const togglePin = useCallback(
    (id: string) => {
      clearTimers()
      if (pinned === id) {
        setPinned(null)
        setOpen(null)
      } else {
        setPinned(id)
        setOpen(id)
      }
    },
    [clearTimers, pinned],
  )

  const suppressFocusOpen = useCallback(() => {
    suppressFocusUntil.current = Date.now() + 220
  }, [])

  const cancelSuppress = useCallback(() => {
    suppressFocusUntil.current = 0
  }, [])

  const isFocusSuppressed = useCallback(() => Date.now() < suppressFocusUntil.current, [])

  const openNow = useCallback(
    (id: string, focusFirst = false) => {
      clearTimers()
      cancelSuppress()
      setOpen(id)
      if (focusFirst) {
        const tryFocus = (attempt = 0) => {
          const panel = panelRefs.current[id]
          const first = panel?.querySelector<HTMLElement>("a, button")
          if (first) first.focus()
          else if (attempt < 6) requestAnimationFrame(() => tryFocus(attempt + 1))
        }
        requestAnimationFrame(() => tryFocus())
      }
    },
    [clearTimers, cancelSuppress],
  )

  const closeNow = useCallback(
    (refocusTrigger?: string) => {
      clearTimers()
      setPinned(null)
      suppressFocusOpen()
      setOpen(null)
      if (refocusTrigger) {
        const target = panelRefs.current[refocusTrigger] ?? triggerRefs.current[refocusTrigger]
        if (target?.contains(document.activeElement)) triggerRefs.current[refocusTrigger]?.focus()
      }
    },
    [clearTimers, suppressFocusOpen],
  )

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      cancelSuppress()
      if (open && !(e.target as HTMLElement).closest("[data-nav-root]")) {
        setPinned(null)
        setOpen(null)
      }
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape" || !open) return
      const target = document.activeElement as HTMLElement | null
      if (target && target.closest(`[data-nav-trigger="${open}"], [data-nav-panel="${open}"]`)) {
        e.preventDefault()
        closeNow(open)
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKey)
      clearTimers()
    }
  }, [open, clearTimers, closeNow, cancelSuppress])

  return { open, pinned, openSoon, closeSoon, togglePin, keepOpen: clearTimers, openNow, closeNow, isFocusSuppressed, triggerRefs, panelRefs }
}

// --- Smooth GPU-Accelerated Variants ---

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 450, damping: 32, staggerChildren: 0.015 },
  },
  exit: { opacity: 0, y: 4, scale: 0.99, transition: { duration: 0.1, ease: "easeOut" } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 3 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

// --- Panel Subcomponents ---

function PanelListLink({ link, variants = itemVariants }: { link: NavLink; variants?: Variants }) {
  const Icon = iconFor(link.label)
  return (
    <motion.div variants={variants} className="list-none">
      <a
        href={link.href}
        className="group flex items-center justify-between rounded-xl px-3.5 py-3 transition-colors hover:bg-muted/80 focus:bg-muted/80 focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-focus:bg-primary group-focus:text-primary-foreground">
            <Icon size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary group-focus:text-primary">{link.label}</span>
            {link.description && <span className="mt-0.5 text-xs text-muted-foreground">{link.description}</span>}
          </div>
        </div>
        <ArrowRight size={13} className="-translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary group-focus:translate-x-0 group-focus:opacity-100 group-focus:text-primary" />
      </a>
    </motion.div>
  )
}

function ProductsPanel({ item, variants }: { item: NavItem; variants?: Variants }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-5">
      {item.groups?.map((g) => (
        <div key={g.title} className="flex flex-col rounded-2xl border border-border/40 bg-muted/30 p-4">
          <div className="px-3 py-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.title}</h3>
          </div>
          <div className="mt-1 flex flex-col gap-1">
            {g.links.map((l) => (
              <PanelListLink key={l.href} link={l} variants={variants} />
            ))}
          </div>
        </div>
      ))}
      {item.featured && (
        <motion.div variants={variants} className="col-span-2 flex items-center justify-between rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
          <div>
            <span className="mb-1 inline-block rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary ring-1 ring-primary/30">
              {item.featured.label}
            </span>
            <p className="text-sm font-semibold text-foreground">{item.featured.description}</p>
          </div>
          <a
            href={item.featured.href}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold 
            !text-white shadow-md shadow-primary/25 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <span>Explore Platform</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      )}
    </div>
  )
}

function SolutionsPanel({ item, variants }: { item: NavItem; variants?: Variants }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-5">
      {item.groups?.map((g) => (
        <div key={g.title} className="flex flex-col rounded-2xl border border-border/40 bg-muted/30 p-4">
          <div className="px-3 py-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.title}</h3>
          </div>
          <div className="mt-1 flex flex-col gap-1">
            {g.links.map((l) => (
              <PanelListLink key={l.href} link={l} variants={variants} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ResourcesPanel({ item, variants }: { item: NavItem; variants?: Variants }) {
  return (
    <div className="grid grid-cols-[1.3fr_1fr] gap-4 p-5">
      <div className="grid grid-cols-2 gap-3">
        {item.groups?.map((g) => (
          <div key={g.title} className="flex flex-col">
            <h3 className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{g.title}</h3>
            <div className="flex flex-col gap-1">
              {g.links.map((l) => (
                <PanelListLink key={l.href} link={l} variants={variants} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <motion.div
        variants={variants}
        className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-muted/50 to-muted p-5 shadow-inner"
      >
        <div className="relative z-10">
          <div className="mb-3.5 flex size-10 items-center justify-center rounded-xl bg-background shadow-md ring-1 ring-border/80">
            <ArrowRight size={18} className="text-primary" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Masterclass</span>
          <h4 className="mt-1 text-sm font-semibold text-foreground">High-Velocity Operations</h4>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Learn blueprints used by modern tech-forward brands to optimize supply chains.
          </p>
          <a
            href="/resources/webinars"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-primary focus:outline-none focus:underline"
          >
            Watch Session <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </motion.div>
    </div>
  )
}

const PANEL_WIDTHS: Record<string, string> = {
  products: "w-[720px]",
  solutions: "w-[660px]",
  resources: "w-[780px]",
  integrations: "w-[880px]",
  "case-studies": "w-[720px]",
}

// --- Integration brand monograms (kept small & typographic like the ecosystem page) ---

const BRAND_STYLE: Record<string, { text: string; color: string; bold?: boolean; italic?: boolean; serif?: boolean; bg?: string; fs?: string }> = {
  amazon: { text: "amazon", color: "#1b1b1b" },
  flipkart: { text: "Flipkart", color: "#2874f0", italic: true, fs: "0.74rem" },
  shopify: { text: "shopify", color: "#1b1b1b", bold: true },
  meesho: { text: "meesho", color: "#f43f5e", bold: true },
  myntra: { text: "Myntra", color: "#ed174d", bold: true },
  ajio: { text: "Ajio", color: "#000", bold: true },
  jiomart: { text: "JioMart", color: "#0f3cc9", bold: true },
  nykaa: { text: "Nykaa", color: "#ec147c", bold: true },
  razorpay: { text: "Razorpay", color: "#2279f2", bold: true, fs: "0.7rem" },
  payu: { text: "payU", color: "#f15a2a", bold: true },
  cashfree: { text: "cashfree", color: "#28327a", fs: "0.68rem" },
  phonepe: { text: "phonePe", color: "#5f259f", bold: true, fs: "0.72rem" },
  paytm: { text: "Paytm", color: "#00b9f5", bold: true },
  mps: { text: "§", color: "#533afd", bold: true, fs: "1.15rem" },
  shiprocket: { text: "Shiprocket", color: "#14b26a", bold: true, fs: "0.66rem" },
  delhivery: { text: "Delhivery", color: "#00a86b", bold: true, fs: "0.64rem" },
  ekart: { text: "Ekart", color: "#f59f00", bold: true, bg: "#111", fs: "0.68rem" },
  bluedart: { text: "Blue Dart", color: "#0072ce", bold: true, fs: "0.6rem" },
  xpressbees: { text: "Xpressbees", color: "#db1f3c", bold: true, fs: "0.6rem" },
  tally: { text: "Tally", color: "#000", serif: true, fs: "1.05rem" },
  sap: { text: "SAP", color: "#fff", bold: true, bg: "#008fd3", fs: "0.82rem" },
  zoho: { text: "Zoho Books", color: "#27272a", bold: true, fs: "0.6rem" },
  dynamics: { text: "Microsoft Dynamics", color: "#0b53bf", bold: true, fs: "0.5rem" },
}

function BrandLogo({ mark, name, bare = false, className = "" }: { mark: string; name: string; bare?: boolean; className?: string }) {
  const s = BRAND_STYLE[mark] ?? { text: name, color: "#1b1b1b", bold: true }
  const wordmark = (
    <span
      style={{
        color: s.bg ? "#fff" : s.color,
        fontStyle: s.italic ? "italic" : undefined,
        fontFamily: s.serif ? "Georgia, serif" : undefined,
        fontWeight: s.bold || s.bg ? 700 : 600,
        fontSize: s.fs ?? "0.72rem",
        lineHeight: 1,
        letterSpacing: s.text.length > 7 ? "-0.01em" : undefined,
        whiteSpace: "nowrap",
      }}
    >
      {s.text}
    </span>
  )
  if (bare) return <span className={`grid size-full shrink-0 select-none place-items-center ${className}`} style={s.bg ? { background: s.bg } : undefined} aria-hidden="true">{wordmark}</span>
  return (
    <span
      className={`grid shrink-0 select-none place-items-center rounded-lg ${s.bg ? "" : "border border-border/70 bg-white shadow-sm"} ${className}`}
      style={s.bg ? { background: s.bg } : undefined}
      aria-hidden="true"
    >
      {wordmark}
    </span>
  )
}

function IntegrationsPanel({ variants }: { variants?: Variants }) {
  const [active, setActive] = useState<IntegrationCategoryId>("marketplaces")
  const cat = INTEGRATION_CATEGORIES.find((c) => c.id === active) ?? INTEGRATION_CATEGORIES[0]
  const items = integrationsByCategory(active)

  const CATEGORY_ICON: Record<IntegrationCategoryId, LucideIcon> = {
    marketplaces: Store,
    payments: CreditCard,
    shipping: Truck,
    erp: Building2,
  }

return (
    <div className="w-full">
      <div className="grid grid-cols-[0.78fr_1.22fr] gap-5 p-6">
        {/* LEFT — category navigation */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-2.5 pb-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Catalog</h3>
            <a
              href="/integrations"
              className="text-[11px] font-semibold text-primary hover:underline focus:outline-none focus:underline"
            >
              View all
            </a>
          </div>
          {INTEGRATION_CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICON[c.id]
            const count = integrationsByCategory(c.id).length
            const selected = active === c.id
            return (
              <button
                key={c.id}
                type="button"
                onMouseEnter={() => setActive(c.id)}
                onFocus={() => setActive(c.id)}
                onClick={() => setActive(c.id)}
                aria-pressed={selected}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  selected ? "bg-primary/10 ring-1 ring-primary/25" : "hover:bg-muted/70"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg transition-colors ${
                      selected ? "bg-primary text-primary-foreground" : "bg-muted/70 text-muted-foreground"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}>{c.label}</span>
                </span>
                <span className={`text-xs tabular-nums ${selected ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* RIGHT — brands for the active category */}
        <div className="flex flex-col rounded-2xl border border-border/50 bg-muted/25 p-4">
          <div className="mb-3 flex items-start justify-between gap-3 px-1.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{cat.label}</p>
              <h4 className="mt-1 text-[13px] font-medium leading-snug text-foreground">{cat.description}</h4>
            </div>
            <a
              href={`/integrations#ecosystem`}
              className="mt-1 shrink-0 rounded-full border border-border/60 bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              View all {cat.label}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {items.map((b) => (
              <motion.a
                key={b.slug}
                variants={variants}
                href={`/integrations/${b.slug}`}
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-transparent px-2.5 py-2.5 transition-colors hover:border-border/60 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <BrandLogo mark={b.mark} name={b.name} className="h-11 w-auto px-2.5" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {b.name}
                  </span>
                </span>
                <ArrowRight
                  size={12}
                  className="-translate-x-1 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* footer bar */}
      <div className="flex items-center justify-between gap-3 border-t border-border/50 px-8 py-4">
        <p className="hidden text-xs leading-relaxed text-muted-foreground sm:block">
          Connect marketplaces, payments, shipping and ERP into one financial layer.
        </p>
        <a
          href="/integrations"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold !text-white shadow-md shadow-primary/25 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          View all integrations
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  )
}

function CaseStudiesPanel({ variants }: { variants?: Variants }) {
  const total = customers.length
  const [idx, setIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const reduceMotion = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reduceMotion.current = mq.matches
    const onChange = (e: MediaQueryListEvent) => {
      reduceMotion.current = e.matches
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (hovered || reduceMotion.current) return
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 4200)
    return () => clearInterval(t)
  }, [hovered, total])

  const c = customers[idx]

  return (
    <div className="w-full">
      <div className="p-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Inside the books</h3>
            <p className="mt-1 text-[15px] font-semibold text-foreground">
              How finance teams run ecommerce accounting with DeepEcom.
            </p>
          </div>
          <a
            href="/customers"
            className="shrink-0 rounded-full border border-border/60 bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            View all case studies
          </a>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.a
              key={idx}
              variants={variants}
              href={`/case-studies/${c.slug}`}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="group flex min-h-[188px] flex-col rounded-2xl border border-border/50 bg-muted/25 p-5 transition-colors hover:border-border/70 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold tracking-tight text-primary">
                    {c.logoText
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <span className="text-sm font-bold tracking-tight text-foreground">{c.logoText}</span>
                </span>
                <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ring-1 ring-border/50">
                  {c.industry}
                </span>
              </div>
              <h4 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-foreground">{c.headline}</h4>
              <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-muted-foreground">{c.problem}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-primary">
                Read case study
                <ArrowRight size={12} className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </motion.a>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Case study navigation">
            {customers.map((item, i) => (
              <button
                key={item.slug}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`Show ${item.logoText} case study`}
                onClick={() => setIdx(i)}
                onMouseEnter={() => setHovered(true)}
                onFocus={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  i === idx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {[({ direction: -1, icon: ChevronLeft }), ({ direction: 1, icon: ChevronRight })].map(({ direction, icon: Icon }) => (
              <button
                key={direction}
                type="button"
                aria-label={direction < 0 ? "Previous case study" : "Next case study"}
                onMouseEnter={() => setHovered(true)}
                onClick={() => setIdx((prev) => (prev + direction + total) % total)}
                className="grid size-8 place-items-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border/50 px-8 py-4">
        <p className="hidden text-xs leading-relaxed text-muted-foreground sm:block">
          Customer stories that show marketplace data, reconciliation and ERP accounting connected.
        </p>
        <a
          href="/customers"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Read all case studies
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  )
}

type NavPanelProps = {
  item: NavItem
  open: boolean
  pinned: boolean
  registerPanel: (id: string, el: HTMLDivElement | null) => void
  onKeyDown: (e: KeyboardEvent<HTMLElement>, item: NavItem) => void
  onFocusOut: (e: FocusEvent<HTMLElement>, item: NavItem) => void
  onClose: () => void
  onKeepOpen: () => void
}

function NavPanel({ item, open, pinned, registerPanel, onKeyDown, onFocusOut, onClose, onKeepOpen }: NavPanelProps) {
  if (item.type !== "menu" || !item.groups) return null

  const width = PANEL_WIDTHS[item.id] ?? "w-[500px]"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={`nav-panel-${item.id}`}
          ref={(el) => registerPanel(item.id, el)}
          role="group"
          aria-label={item.label}
          data-nav-panel={item.id}
          onMouseEnter={onKeepOpen}
          onMouseLeave={() => !pinned && onClose()}
          onKeyDown={(e) => onKeyDown(e, item)}
          onBlur={(e) => onFocusOut(e, item)}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 ${width}`}
        >
          {/* Changed bg-popover/95 to solid bg-popover for reduced transparency */}
          <div className="overflow-hidden rounded-[24px] border border-border/80 bg-popover shadow-[0_25px_60px_rgba(0,0,0,0.2)] ring-1 ring-border/20 dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
            {item.id === "products" && <ProductsPanel item={item} variants={itemVariants} />}
            {item.id === "solutions" && <SolutionsPanel item={item} variants={itemVariants} />}
            {item.id === "resources" && <ResourcesPanel item={item} variants={itemVariants} />}
            {item.id === "integrations" && <IntegrationsPanel variants={itemVariants} />}
            {item.id === "case-studies" && <CaseStudiesPanel variants={itemVariants} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type NavTriggerProps = {
  item: NavItem
  open: boolean
  pinned: boolean
  onFocus?: () => void
  onClick?: (e: ReactMouseEvent<HTMLButtonElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void
  registerTrigger?: (id: string, el: HTMLButtonElement | null) => void
}

function NavTrigger({ item, open, pinned, onFocus, onClick, onKeyDown, registerTrigger }: NavTriggerProps) {
  const isMenu = item.type === "menu"
  const baseCls = "relative z-10 inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
  const stateCls = open ? "text-foreground font-semibold bg-muted/80 ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"

  if (isMenu) {
    return (
      <button
        ref={(el) => registerTrigger?.(item.id, el)}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `nav-panel-${item.id}` : undefined}
        data-nav-trigger={item.id}
        onMouseEnter={onFocus}
        onFocus={onFocus}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={`${baseCls} ${stateCls}`}
      >
        {item.label}
        <ChevronDown size={13} className={`transition-transform duration-300 ${open ? "rotate-180 text-primary" : "opacity-50"}`} />
        {pinned && <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary" />}
      </button>
    )
  }
  return (
    <a href={item.href} className={`${baseCls} ${stateCls}`}>
      {item.label}
    </a>
  )
}

function MobileAccordion({
  item,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: NavItem
  expanded: boolean
  onToggle: () => void
  onNavigate: () => void
}) {
  if (item.type !== "menu" || !item.groups) {
    return (
      <a
        href={item.href}
        onClick={onNavigate}
        className="block rounded-xl px-4 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        {item.label}
      </a>
    )
  }
  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        {item.label}
        <ChevronDown size={16} className={`transition-transform duration-300 ${expanded ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-4 pt-1">
              {item.groups.map((g: NavGroup) => (
                <div key={g.title} className="mb-5 last:mb-0">
                  <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{g.title}</p>
                  <ul className="space-y-1">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          onClick={onNavigate}
                          className="block rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string[]>([])
  const [hovered, setHovered] = useState<string | null>(null)

  const { open, pinned, openSoon, closeSoon, togglePin, keepOpen, openNow, closeNow, isFocusSuppressed, triggerRefs, panelRefs } = useHoverNav()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const openAndFocus = (id: string) => openNow(id, true)
  const pillId = hovered ?? open

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>, item: NavItem) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (e.key === "ArrowDown") openAndFocus(item.id)
      else togglePin(item.id)
    }
  }

  const onPanelKeyDown = (e: KeyboardEvent<HTMLElement>, item: NavItem) => {
    if (e.key === "Escape") {
      e.preventDefault()
      closeNow(item.id)
    } else if (e.key === "ArrowUp") {
      const panel = panelRefs.current[item.id]
      const first = panel?.querySelector<HTMLElement>("a, button")
      if (first && document.activeElement === first) closeNow(item.id)
    }
  }

  const onPanelFocusOut = (e: FocusEvent<HTMLElement>, item: NavItem) => {
    const next = e.relatedTarget as Node | null
    if (!e.currentTarget.contains(next) && pinned !== item.id) closeNow(item.id)
  }

  return (
    <MotionConfig reducedMotion="user">
      <header
        data-nav-root
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open ? "border-b border-border/40 bg-background/95 backdrop-blur-md shadow-xs" : "border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-6 lg:h-20" aria-label="Primary">
          <a href="/" onFocus={() => closeNow()} className="inline-flex items-center gap-2.5 text-[18px] font-bold tracking-tight text-foreground transition-transform hover:scale-[1.02]">
            <LogoMark />
            <div>
              <span className="font-medium">Deep</span>
              <span>Ecom</span>
            </div>
          </a>

          <div
            className="relative hidden items-center gap-1 lg:flex"
            onMouseLeave={() => {
              setHovered(null)
              closeSoon()
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isMenu = item.type === "menu"
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => {
                    setHovered(item.id)
                    keepOpen()
                    if (isMenu) openSoon(item.id)
                    else closeSoon()
                  }}
                  onFocusCapture={() => setHovered(item.id)}
                >
                  {pillId === item.id && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 z-0 rounded-lg bg-muted/80 shadow-xs"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <NavTrigger
                    item={item}
                    open={open === item.id}
                    pinned={pinned === item.id}
                    onFocus={() => {
                      setHovered(item.id)
                      if (isMenu && !isFocusSuppressed() && !pinned) openNow(item.id)
                    }}
                    onClick={() => {
                      if (isMenu) togglePin(item.id)
                    }}
                    onKeyDown={(e) => isMenu && onTriggerKeyDown(e, item)}
                    registerTrigger={(id: string, el: HTMLButtonElement | null) => {
                      triggerRefs.current[id] = el
                    }}
                  />
                </div>
              )
            })}

            {NAV_ITEMS.filter((item) => item.type === "menu").map((item) => (
              <NavPanel
                key={item.id}
                item={item}
                open={open === item.id}
                pinned={pinned === item.id}
                registerPanel={(id: string, el: HTMLDivElement | null) => {
                  panelRefs.current[id] = el
                }}
                onClose={closeSoon}
                onKeepOpen={keepOpen}
                onKeyDown={onPanelKeyDown}
                onFocusOut={onPanelFocusOut}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={LOGIN_URL}
              onFocus={() => closeNow()}
              className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
            >
              Sign In
            </a>
            <Button variant="primary" render={<a href={BOOK_DEMO_URL} />} className="hidden rounded-full shadow-md shadow-primary/10 sm:inline-flex">
              Book a Demo
            </Button>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
              className="grid size-11 place-items-center rounded-full border border-border/50 bg-background/50 text-foreground transition-colors hover:bg-muted lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-menu"
              role="dialog"
              aria-modal="false"
              aria-label="Site menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-18 bottom-0 z-40 flex h-[calc(100vh-4.5rem)] flex-col overflow-y-auto border-t border-border/50 bg-background px-4 pb-24 pt-4 lg:hidden"
            >
              <nav aria-label="Mobile menu" className="grid gap-1">
                {NAV_ITEMS.map((item) => (
                  <MobileAccordion
                    key={item.id}
                    item={item}
                    expanded={mobileExpanded.includes(item.id)}
                    onToggle={() => setMobileExpanded((p) => (p.includes(item.id) ? p.filter((x) => x !== item.id) : [...p, item.id]))}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
              </nav>
              <div className="mt-auto grid gap-3 border-t border-border/40 pt-6">
                <a
                  href={LOGIN_URL}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-muted/30 px-4 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Sign In
                </a>
                <Button
                  variant="primary"
                  render={<a href={BOOK_DEMO_URL} />}
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-xl py-6 text-base shadow-md shadow-primary/20"
                >
                  Book a Demo
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  )
}