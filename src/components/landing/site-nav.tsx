import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/landing/ui/button"
import { LogoMark } from "./icons"
import { BOOK_DEMO_URL, LOGIN_URL, NAV_ITEMS, type NavItem } from "@/data/navigation"

const OPEN_DELAY = 90
const CLOSE_DELAY = 140

function useHoverNav() {
  const [open, setOpen] = useState<string | null>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const clearTimers = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current)
      openTimer.current = null
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openSoon = useCallback((id: string) => {
    clearTimers()
    openTimer.current = setTimeout(() => setOpen(id), OPEN_DELAY)
  }, [])

  const closeSoon = useCallback(() => {
    clearTimers()
    closeTimer.current = setTimeout(() => setOpen(null), CLOSE_DELAY)
  }, [])

  const openNow = useCallback((id: string, focusFirst = false) => {
    clearTimers()
    setOpen(id)
    if (focusFirst) {
      requestAnimationFrame(() => {
        const first = panelRefs.current[id]?.querySelector<HTMLAnchorElement>("a")
        first?.focus()
      })
    }
  }, [])

  const closeNow = useCallback((refocusTrigger?: string) => {
    clearTimers()
    setOpen(null)
    if (refocusTrigger) triggerRefs.current[refocusTrigger]?.focus()
  }, [])

  const keepOpen = useCallback(() => clearTimers(), [])

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
  }, [open])

  return { open, openSoon, closeSoon, keepOpen, openNow, closeNow, triggerRefs, panelRefs }
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

function NavTrigger({
  item,
  open,
  onFocus,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  registerTrigger,
}: {
  item: NavItem
  open: boolean
  onFocus: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  registerTrigger: (id: string, el: HTMLButtonElement | null) => void
}) {
  const cls = `group inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    open ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
  }`

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
        onClick={() => onFocus()}
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

function NavPanel({
  item,
  open,
  panelRefs,
  onKeyDown,
  onClose,
  onKeepOpen,
}: {
  item: NavItem
  open: boolean
  panelRefs: Record<string, HTMLDivElement | null>
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onClose: () => void
  onKeepOpen: () => void
}) {
  if (item.type !== "menu" || !item.groups) return null

  return (
    <div
      id={`nav-panel-${item.id}`}
      ref={(el) => {
        panelRefs[item.id] = el
      }}
      role="group"
      aria-label={item.label}
      onMouseEnter={onKeepOpen}
      onMouseLeave={onClose}
      onKeyDown={onKeyDown}
      className={`absolute top-full left-1/2 z-50 mt-2.5 -translate-x-1/2 transition-all duration-200 ease-out ${
        open ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-1 opacity-0"
      }${item.id === "products" ? " w-[680px]" : item.id === "solutions" ? " w-[560px]" : " w-[500px]"}`}
    >
      <div className="nav-panel overflow-hidden rounded-2xl border border-border bg-white shadow-card ring-1 ring-ink-950/5">
        <span aria-hidden="true" className="nav-panel-notch" />

        {item.id === "products" && (
  <div className="grid grid-cols-2 divide-x divide-border/60 bg-popover">
    {item.groups.map((g) => (
      <div key={g.title} className="p-5">
        {/* Category Header */}
        <div className="px-2 pb-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {g.description ?? g.title}
          </p>
          {g.description && (
            <h3 className="mt-0.5 text-sm font-semibold text-foreground">
              {g.title}
            </h3>
          )}
        </div>

        {/* Links List - Aligned with Header Text */}
        <ul className="mt-1 space-y-0.5">
          {g.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group/link -mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-muted/60 hover:text-foreground"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-primary opacity-0 scale-0 transition-all duration-150 group-hover/link:scale-100 group-hover/link:opacity-100"
                />
                <span className="truncate">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}

    {/* Featured Footer Bar */}
    <div className="col-span-2 flex items-center justify-between gap-4 border-t border-border/60 bg-muted/40 px-5 py-3.5 transition-colors hover:bg-muted/60">
      <span className="text-xs font-semibold text-foreground">
        {item.featured?.label}
      </span>
      {item.featured && (
        <a
          href={item.featured.href}
          className="group/feat inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
        >
          <span>{item.featured.description}</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover/feat:translate-x-0.5"
          >
            →
          </span>
        </a>
      )}
    </div>
  </div>
)}

        {item.id === "solutions" && (
  <div className="grid grid-cols-2 divide-x divide-border/60 bg-popover">
    {item.groups.map((g, idx) => (
      <div
        key={g.title}
        className={`p-5 ${idx % 2 !== 0 ? "bg-muted/30" : ""}`}
      >
        {/* Category Header */}
        <div className="px-2 pb-1.5">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
            <span aria-hidden="true" className="h-px w-3.5 bg-primary/70" />
            {g.title}
          </p>
        </div>

        {/* Links List - Aligned with Header Text */}
        <ul className="mt-1 space-y-0.5">
          {g.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group/link -mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-background hover:text-foreground hover:shadow-xs"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-primary opacity-0 scale-0 transition-all duration-150 group-hover/link:scale-100 group-hover/link:opacity-100"
                />
                <span className="truncate">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}

        {item.id === "resources" && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {item.groups.map((g) => (
                <div key={g.title}>
                  <p className="px-2.5 pb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.title}</p>
                  <ul className="space-y-0.5">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          className="block rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground transition-colors hover:bg-brand-50 hover:font-medium hover:text-foreground"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-xl border border-border bg-brand-50/40 p-4">
              <p className="text-sm font-semibold text-foreground">Browse the help center</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">Guides, FAQs and how-to guides across ecommerce accounting, GST and ERP.</p>
              <a href="/resources/help-center" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-brand-700">
                Explore guides →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
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
      <a href={item.href} onClick={onNavigate} className="block rounded-lg px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-brand-50">
        {item.label}
      </a>
    )
  }
  return (
    <div className="border-b border-border/70 last:border-0">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[15px] font-medium text-foreground transition-colors hover:bg-brand-50"
      >
        {item.label}
        <ChevronDown size={15} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} aria-hidden={true} />
      </button>
      <div className={`grid transition-all duration-200 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="pb-3 pl-3">
            {item.groups.map((g) => (
              <div key={g.title} className="mb-3 last:mb-0">
                <p className="px-2.5 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.title}</p>
                <ul className="space-y-1">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        onClick={onNavigate}
                        className="block rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-brand-50 hover:text-foreground"
                      >
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
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string[]>([])
  const { open, openSoon, closeSoon, keepOpen, openNow, closeNow, triggerRefs, panelRefs } = useHoverNav()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const toggleMobileAccordion = (id: string) =>
    setMobileExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openNow(id, true)
    } else if (e.key === "Escape") {
      closeNow()
    }
  }

  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === "Escape") {
      e.preventDefault()
      closeNow(id)
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault()
      focusNextLink(panelRefs.current[id], e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1)
    }
  }

  return (
    <header data-nav-root className={`fixed inset-x-0 top-0 z-50 border-b transition-[border-color,box-shadow] duration-200 ${scrolled ? "border-border bg-white/85 shadow-xs backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-white/0"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6 lg:h-17" aria-label="Primary">
        <a href="/" onFocus={() => closeNow()} className="inline-flex items-center gap-2.5 text-[17.5px] font-bold tracking-tight text-foreground no-underline">
          <LogoMark />
          DeepEcom
        </a>

        <div className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => (item.type === "menu" ? openSoon(item.id) : undefined)}
              onMouseLeave={() => (item.type === "menu" ? closeSoon() : undefined)}
            >
              <NavTrigger
                item={item}
                open={open === item.id}
                onFocus={() => (item.type === "menu" ? openNow(item.id) : closeNow())}
                onKeyDown={(e) => handleTriggerKeyDown(e, item.id)}
                onMouseEnter={() => (item.type === "menu" ? openSoon(item.id) : undefined)}
                onMouseLeave={() => (item.type === "menu" ? closeSoon() : undefined)}
                registerTrigger={(id, el) => (triggerRefs.current[id] = el)}
              />
              {item.type === "menu" && (
                <NavPanel
                  item={item}
                  open={open === item.id}
                  panelRefs={panelRefs.current}
                  onKeyDown={(e) => handlePanelKeyDown(e, item.id)}
                  onClose={() => closeSoon()}
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
          <Button render={<a href={BOOK_DEMO_URL} />} size="sm" className="hidden sm:inline-flex">
            Book a Demo
          </Button>

          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-brand-50 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-16 bottom-0 z-40 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto border-t border-border bg-white px-4 pb-24 pt-3 lg:hidden"
        >
          <div className="grid gap-1">
            {NAV_ITEMS.map((item) => (
              <MobileAccordion
                key={item.id}
                item={item}
                expanded={mobileExpanded.includes(item.id)}
                onToggle={() => toggleMobileAccordion(item.id)}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </div>
          <div className="mt-6 grid gap-2.5 border-t border-border pt-5">
            <a
              href={LOGIN_URL}
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-brand-50"
            >
              Login
            </a>
            <Button render={<a href={BOOK_DEMO_URL} />} onClick={() => setMobileOpen(false)} className="w-full">
              Book a Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
