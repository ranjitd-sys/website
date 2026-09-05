import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react"
import {
  ArrowRight,
  Boxes,
  Calculator,
  ChevronDown,
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
  X,
  type LucideIcon,
  TrendingUp,
  Clock,
} from "lucide-react"
import { AnimatePresence, motion, MotionConfig, type Variants } from "framer-motion"
import { LogoMark } from "./icons"
import { BOOK_DEMO_URL, LOGIN_URL, NAV_ITEMS, type NavGroup, type NavItem, type NavLink } from "@/data/navigation"
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

// --- Hooks & State Controller ---

function useHoverNav() {
  const [open, setOpen] = useState<string | null>(null)
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
      clearTimers()
      setOpen((currentOpen) => {
        if (currentOpen && currentOpen !== id) {
          return id
        }
        timers.current.open = setTimeout(() => setOpen(id), OPEN_DELAY)
        return currentOpen
      })
    },
    [clearTimers],
  )

  const closeSoon = useCallback(() => {
    clearTimers()
    timers.current.close = setTimeout(() => setOpen(null), CLOSE_DELAY)
  }, [clearTimers])

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
      if (open && !(e.target as HTMLElement).closest("[data-nav-root]")) setOpen(null)
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

  return { open, openSoon, closeSoon, keepOpen: clearTimers, openNow, closeNow, isFocusSuppressed, triggerRefs, panelRefs }
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
        className="group flex items-center justify-between rounded-xl px-3.5 py-3 transition-colors hover:bg-muted/80"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">{link.label}</span>
            {link.description && <span className="mt-0.5 text-xs text-muted-foreground">{link.description}</span>}
          </div>
        </div>
        <ArrowRight size={13} className="-translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary" />
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
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all hover:scale-105"
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
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-primary"
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
}

type NavPanelProps = {
  item: NavItem
  open: boolean
  registerPanel: (id: string, el: HTMLDivElement | null) => void
  onKeyDown: (e: KeyboardEvent<HTMLElement>, item: NavItem) => void
  onFocusOut: (e: FocusEvent<HTMLElement>, item: NavItem) => void
  onClose: () => void
  onKeepOpen: () => void
}

function NavPanel({ item, open, registerPanel, onKeyDown, onFocusOut, onClose, onKeepOpen }: NavPanelProps) {
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
          onMouseLeave={onClose}
          onKeyDown={(e) => onKeyDown(e, item)}
          onBlur={(e) => onFocusOut(e, item)}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 ${width}`}
        >
          <div className="overflow-hidden rounded-[24px] border border-border/80 bg-popover/95 shadow-[0_25px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/5 backdrop-blur-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
            {item.id === "products" && <ProductsPanel item={item} variants={itemVariants} />}
            {item.id === "solutions" && <SolutionsPanel item={item} variants={itemVariants} />}
            {item.id === "resources" && <ResourcesPanel item={item} variants={itemVariants} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type NavTriggerProps = {
  item: NavItem
  open: boolean
  onFocus?: () => void
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void
  registerTrigger?: (id: string, el: HTMLButtonElement | null) => void
}

function NavTrigger({ item, open, onFocus, onKeyDown, registerTrigger }: NavTriggerProps) {
  const isMenu = item.type === "menu"
  const baseCls = "relative z-10 inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg"
  const stateCls = open ? "text-foreground font-semibold bg-muted/60" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"

  if (isMenu) {
    return (
      <button
        ref={(el) => registerTrigger?.(item.id, el)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `nav-panel-${item.id}` : undefined}
        data-nav-trigger={item.id}
        onMouseEnter={onFocus}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className={`${baseCls} ${stateCls}`}
      >
        {item.label}
        <ChevronDown size={13} className={`transition-transform duration-300 ${open ? "rotate-180 text-primary" : "opacity-50"}`} />
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

  const { open, openSoon, closeSoon, keepOpen, openNow, closeNow, isFocusSuppressed, triggerRefs, panelRefs } = useHoverNav()

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
    if (e.key === "ArrowDown") {
      e.preventDefault()
      openAndFocus(item.id)
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
    if (!e.currentTarget.contains(next)) closeNow(item.id)
  }

  return (
    <MotionConfig reducedMotion="user">
      <header
        data-nav-root
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open ? "border-b border-border/40 bg-background shadow-xs" : "border-transparent bg-transparent"
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
                    if (isMenu) {
                      openSoon(item.id)
                    } else {
                      closeSoon()
                    }
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
                    onFocus={() => {
                      setHovered(item.id)
                      if (isMenu && !isFocusSuppressed()) openNow(item.id)
                      else closeNow()
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