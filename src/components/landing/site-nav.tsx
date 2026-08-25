import { useEffect, useState } from "react"
import { MenuIcon, XIcon } from "@deepecom/ui/icons"
import { Button } from "@deepecom/ui/ui/button"
import { LogoMark } from "./icons"

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#integrations", label: "Integrations" },
  { href: "#why", label: "Why DeepEcom" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
]

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-white/85 backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow] ${
          scrolled ? "border-border shadow-xs" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-17 max-w-6xl items-center gap-6 px-6">
          <a href="#" className="inline-flex items-center gap-2.5 text-[17.5px] font-extrabold tracking-tight text-ink no-underline">
            <LogoMark />
            DeepEcom
          </a>

          <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/5 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <a href="#" className="hidden rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-ink sm:block">
              Sign in
            </a>
            <Button render={<a href="#contact" />} size="sm">
              Start free trial
            </Button>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-lg border border-border text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <XIcon size={17} /> : <MenuIcon size={17} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 top-17 z-40 border-b border-border bg-white px-6 pt-3 pb-5 shadow-lg lg:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-subtle py-3 text-base font-semibold text-ink no-underline"
            >
              {l.label}
            </a>
          ))}
          <Button render={<a href="#contact" />} className="mt-4 w-full">
            Start free trial
          </Button>
        </div>
      )}
    </>
  )
}
