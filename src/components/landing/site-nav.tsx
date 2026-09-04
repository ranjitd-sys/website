import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { LogoMark } from "./icons"
import { BOOK_DEMO_URL, LOGIN_URL, NAV_ITEMS, type NavItem } from "@/data/navigation"
import { Button } from "./ui/button"

const OPEN_DELAY = 90
const CLOSE_DELAY = 140

// --- Hooks & Helpers ---

function useHoverNav() {
  const [open, setOpen] = useState<string | null>(null)
  const timers = useRef({ open: null as any, close: null as any })
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const clearTimers = useCallback(() => {
    if (timers.current.open) clearTimeout(timers.current.open)
    if (timers.current.close) clearTimeout(timers.current.close)
  }, [])

  const openSoon = useCallback((id: string) => {
    clearTimers()
    timers.current.open = setTimeout(() => setOpen(id), OPEN_DELAY)
  }, [clearTimers])

  const closeSoon = useCallback(() => {
    clearTimers()
    timers.current.close = setTimeout(() => setOpen(null), CLOSE_DELAY)
  }, [clearTimers])

  const openNow = useCallback((id: string, focusFirst = false) => {
    clearTimers()
    setOpen(id)
    if (focusFirst) {
      requestAnimationFrame(() => {
        panelRefs.current[id]?.querySelector<HTMLAnchorElement>("a")?.focus()
      })
    }
  }, [clearTimers])

  const closeNow = useCallback((refocusTrigger?: string) => {
    clearTimers()
    setOpen(null)
    if (refocusTrigger) triggerRefs.current[refocusTrigger]?.focus()
  }, [clearTimers])

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (open && !(e.target as HTMLElement).closest("[data-nav-root]")) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKey)
      clearTimers()
    }
  }, [open, clearTimers])

  return { open, openSoon, closeSoon, keepOpen: clearTimers, openNow, closeNow, triggerRefs, panelRefs }
}

function focusNextLink(panel: HTMLDivElement | null, dir: 1 | -1) {
  if (!panel) return
  const links = Array.from(panel.querySelectorAll<HTMLAnchorElement>("a"))
  if (!links.length) return
  const active = document.activeElement as HTMLElement | null
  const idx = active ? links.indexOf(active as HTMLAnchorElement) : -1
  const next = idx === -1 ? (dir === 1 ? 0 : links.length - 1) : (idx + dir + links.length) % links.length
  links[next].focus()
}

// --- Sub-Components ---

function NavTrigger({ item, open, onFocus, onKeyDown, onMouseEnter, onMouseLeave, registerTrigger }: any) {
  const baseClasses = "relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
  const stateClasses = open ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
  const cls = `${baseClasses} ${stateClasses}`

  if (item.type === "menu") {
    return (
      <button
        type="button"
        ref={(el) => registerTrigger(item.id, el)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={`nav-panel-${item.id}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onClick={onFocus}
        className={cls}
      >
        {item.label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden={true} />
      </button>
    )
  }
  return (
    <a href={item.href} onFocus={onFocus} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={cls}>
      {item.label}
    </a>
  )
}

function ProductsPanel({ item }: { item: NavItem }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-border/60 bg-popover">
      {item.groups?.map((g) => (
        <div key={g.title} className="p-5">
          <div className="px-2 pb-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{g.description ?? g.title}</p>
            {g.description && <h3 className="mt-0.5 text-sm font-semibold text-foreground">{g.title}</h3>}
          </div>
          <ul className="mt-1 space-y-0.5">
            {g.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group/link -mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-muted/60 hover:text-foreground">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary opacity-0 scale-0 transition-all duration-150 group-hover/link:scale-100 group-hover/link:opacity-100" />
                  <span className="truncate">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {item.featured && (
        <div className="col-span-2 flex items-center justify-between gap-4 border-t border-border/60 bg-muted/40 px-5 py-3.5 transition-colors hover:bg-muted/60">
          <span className="text-xs font-semibold text-foreground">{item.featured.label}</span>
          <a href={item.featured.href} className="group/feat inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80">
            <span>{item.featured.description}</span>
            <span aria-hidden="true" className="transition-transform duration-150 group-hover/feat:translate-x-0.5">→</span>
          </a>
        </div>
      )}
    </div>
  )
}

function SolutionsPanel({ item }: { item: NavItem }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-border/60 bg-popover">
      {item.groups?.map((g, idx) => (
        <div key={g.title} className={`p-5 ${idx % 2 !== 0 ? "bg-muted/30" : ""}`}>
          <div className="px-2 pb-1.5">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              <span aria-hidden="true" className="h-px w-3.5 bg-primary/70" />
              {g.title}
            </p>
          </div>
          <ul className="mt-1 space-y-0.5">
            {g.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group/link -mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-background hover:text-foreground hover:shadow-xs">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary opacity-0 scale-0 transition-all duration-150 group-hover/link:scale-100 group-hover/link:opacity-100" />
                  <span className="truncate">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ResourcesPanel({ item }: { item: NavItem }) {
  return (
    <div className="p-4 bg-popover">
      <div className="grid grid-cols-2 gap-2">
        {item.groups?.map((g) => (
          <div key={g.title}>
            <p className="px-2.5 pb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.title}</p>
            <ul className="space-y-0.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="block rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground transition-colors hover:bg-muted hover:font-medium hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-sm font-semibold text-foreground">Browse the help center</p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">Guides, FAQs and how-to guides across ecommerce accounting, GST and ERP.</p>
        <a href="/resources/help-center" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline">
          Explore guides →
        </a>
      </div>
    </div>
  )
}

function NavPanel({ item, open, registerPanel, onKeyDown, onClose, onKeepOpen }: any) {
  if (item.type !== "menu" || !item.groups) return null

  const widthMap: Record<string, string> = { products: "w-[680px]", solutions: "w-[560px]" }
  const width = widthMap[item.id] || "w-[500px]"
  const visibility = open ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-1 opacity-0"

  return (
    <div
      id={`nav-panel-${item.id}`}
      ref={(el) => registerPanel(item.id, el)}
      role="group"
      aria-label={item.label}
      onMouseEnter={onKeepOpen}
      onMouseLeave={onClose}
      onKeyDown={onKeyDown}
      className={`absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 transition-all duration-200 ease-out ${visibility} ${width}`}
    >
      <div className="nav-panel overflow-hidden rounded-2xl border border-border bg-popover shadow-xl ring-1 ring-black/5">
        {item.id === "products" && <ProductsPanel item={item} />}
        {item.id === "solutions" && <SolutionsPanel item={item} />}
        {item.id === "resources" && <ResourcesPanel item={item} />}
      </div>
    </div>
  )
}

function MobileAccordion({ item, expanded, onToggle, onNavigate }: any) {
  if (item.type !== "menu" || !item.groups) {
    return (
      <a href={item.href} onClick={onNavigate} className="block rounded-lg px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-muted">
        {item.label}
      </a>
    )
  }
  return (
    <div className="border-b border-border/70 last:border-0">
      <button type="button" aria-expanded={expanded} onClick={onToggle} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[15px] font-medium text-foreground transition-colors hover:bg-muted">
        {item.label}
        <ChevronDown size={15} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} aria-hidden={true} />
      </button>
      <div className={`grid transition-all duration-200 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden pb-3 pl-3">
          {item.groups.map((g: any) => (
            <div key={g.title} className="mb-3 last:mb-0">
              <p className="px-2.5 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.title}</p>
              <ul className="space-y-1">
                {g.links.map((l: any) => (
                  <li key={l.href}>
                    <a href={l.href} onClick={onNavigate} className="block rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Main Navbar ---

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string[]>([])
  const { open, openSoon, closeSoon, keepOpen, openNow, closeNow, triggerRefs, panelRefs } = useHoverNav()
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const moveIndicator = useCallback((id: string) => {
    const el = triggerRefs.current[id]
    const track = el?.parentElement
    if (el && track) {
      setIndicator({ x: el.getBoundingClientRect().left - track.getBoundingClientRect().left, w: el.getBoundingClientRect().width })
    }
  }, [triggerRefs])

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (["ArrowDown", "Enter", " "].includes(e.key)) {
      e.preventDefault()
      openNow(id, true)
    } else if (e.key === "Escape") closeNow()
  }

  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === "Escape") {
      e.preventDefault()
      closeNow(id)
    } else if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault()
      focusNextLink(panelRefs.current[id], e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1)
    }
  }

  const navHeaderClasses = `fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 ${
    scrolled || open ? "border-border bg-background/85 shadow-sm backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-transparent"
  }`

  return (
    <header data-nav-root className={navHeaderClasses}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6 lg:h-17" aria-label="Primary">
        <a href="/" onFocus={() => closeNow()} className="inline-flex items-center gap-2.5 text-[17.5px] font-bold tracking-tight text-foreground no-underline">
          <LogoMark />
          <div><span className="font-medium">Deep</span><span>Ecom</span></div>
        </a>

        <div className="relative ml-4 hidden items-center gap-1 lg:flex" onMouseLeave={() => setIndicator(null)}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 z-0 h-9 -translate-y-1/2 rounded-lg bg-muted/80 ring-1 ring-border transition-[left,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ left: indicator?.x || 0, width: indicator?.w || 0, opacity: indicator ? 1 : 0 }}
          />
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className="relative z-10"
              onMouseEnter={() => {
                if (item.type === "menu") openSoon(item.id)
                moveIndicator(item.id)
              }}
              onMouseLeave={() => item.type === "menu" && closeSoon()}
              onFocusCapture={() => moveIndicator(item.id)}
            >
              <NavTrigger
                item={item}
                open={open === item.id}
                onFocus={() => {
                  item.type === "menu" ? openNow(item.id) : closeNow()
                  moveIndicator(item.id)
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => handleTriggerKeyDown(e, item.id)}
                onMouseEnter={() => {
                  if (item.type === "menu") openSoon(item.id)
                  moveIndicator(item.id)
                }}
                onMouseLeave={() => item.type === "menu" && closeSoon()}
                registerTrigger={(id: string, el: HTMLButtonElement | null) => { triggerRefs.current[id] = el }}
              />
              {item.type === "menu" && (
                <NavPanel
                  item={item}
                  open={open === item.id}
                  registerPanel={(id: string, el: HTMLDivElement | null) => { panelRefs.current[id] = el }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handlePanelKeyDown(e, item.id)}
                  onClose={closeSoon}
                  onKeepOpen={keepOpen}
                />
              )}
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <a href={LOGIN_URL} onFocus={() => closeNow()} className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Login
          </a>
          <Button variant="primary" render={<a href={BOOK_DEMO_URL} />} size="sm">
            Book a Demo
          </Button>

          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-nav" className="fixed inset-x-0 top-16 bottom-0 z-40 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto border-t border-border bg-background px-4 pb-24 pt-3 lg:hidden">
          <div className="grid gap-1">
            {NAV_ITEMS.map((item) => (
              <MobileAccordion
                key={item.id}
                item={item}
                expanded={mobileExpanded.includes(item.id)}
                onToggle={() => setMobileExpanded(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </div>
          <div className="mt-6 grid gap-2.5 border-t border-border pt-5">
            <a href={LOGIN_URL} onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              Login
            </a>
            <Button variant="outline" render={<a href={BOOK_DEMO_URL} />} onClick={() => setMobileOpen(false)} className="w-full">
              Book a Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}