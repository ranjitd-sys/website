# Why Astro and Why Not `@deepecom/ui`

> A short engineering note for the DeepEcom marketing website team.
> Last updated: 2026-09-08

---

## 1. Why we use Astro

### What `.astro` files are
`.astro` is Astro's own component format. A `.astro` file runs its logic in a `---` frontmatter block **at build time**, then renders **plain static HTML**. By default, almost **zero JavaScript ships to the browser**.

### What that gives us

| Benefit | Explanation |
| --- | --- |
| **SEO** | Every page is fully server-rendered HTML at build time. Crawlers (Google, Bing, and LLM/AI crawlers) read the whole page without executing JS. |
| **Speed / Core Web Vitals** | Minimal client JS means fast LCP, low CLS, quick TTI — real ranking factors. |
| **Reliability** | Content is never gated behind hydration. No "blank page until JS runs" failures. |
| **SEO metadata** | Per-page `<title>`, meta description, canonical, Open Graph, sitemap, RSS — all generated statically. |
| **Performance budget** | Per AGENTS.md: *Astro-first, minimal JS, no heavy frontend libraries unless necessary.* |

The DeepEcom marketing site is deliberately Astro-first:

- `199` `.astro` files — all landing sections (Hero, Platform, ERP Connector, Customers, Final CTA, footer), all SEO/landing pages (Amazon, Flipkart, Tally, SAP, GST, D2C, Enterprise, ...).
- Only `12` `.tsx` files — used **only** where real browser interactivity is required, and hydrated lazily via Astro `client:` directives:
  - `contact-form.tsx`, `faq-accordion.tsx`, `integrations-tabs.tsx`, `site-nav.tsx` (mobile drawer), `BillingSelector.tsx`, plus small `ui/` primitives they rely on.

### The rule of thumb

> If a component is **presentational** (a section, card, table, diagram, banner) → write it in `.astro`.
> If a component **must stay alive and interactive in the browser** (state, effects, event handlers, forms) → write it in `.tsx` and hydrate it lazily.

Astro renders `.tsx` components to HTML first, so a React widget is not inherently bad for SEO. The damage comes only when **content is rendered exclusively in the browser** or **hydration payloads become large enough to slow the page**.

---

## 2. Which `@deepecom/ui` pieces can hurt our SEO

`@deepecom/ui` is a **React 19 + Tailwind 4 component kit** installed at `node_modules/@deepecom/ui` but **not imported anywhere in `src/`** today. It is organized into ~150 `dist/components/ui/*` widgets plus dashboard-level components.

The following categories are problematic if used on the marketing site:

### 2.1 Content clients render only in the browser
Components that fetch/render data client-side put content **behind JS execution**:

- `autocomplete`, `combobox`, `select`, `command`
- `calendar`, `date-picker`, `color-picker`
- `dialog`, `alert-dialog`, `drawer`, `sheet`, `popover` (content only appears after interaction)
- `tree-explorer`, `table`, `bar-list`, `category-bar`, `tracker`
- `conversation` (Lexical rich-text / AI chat UI)

If we embedded the *actual content* (headlines, case studies, tech details) inside these, search engines and AI crawlers could see empty shells.

### 2.2 Chart components pulling a very heavy bundle
Charts are the biggest SEO/performance risk on a marketing page:

- `spark-chart`, `chart-legend`, `chart-tooltip`, `bar-list`, `category-bar`
- Backed by `recharts` + the `@visx/*` suite (`shape`, `scale`, `axis`, `responsive`, `sankey`, `geo`) + `d3-*` + `topojson-client`

These add **hundreds of kilobytes of client JS** for visuals our SVG/CSS diagrams already do — for free, in static HTML.

### 2.3 Feature-heavy interactive widgets that ship large dependencies
- Rich-text/AI: `conversation`, `code-block` → `lexical`, `shiki`, `effect`
- Buttons/forms: `button`, `field`, `combobox`, `slot` → `@base-ui/react`
- Motion: `motion`, `framer-motion` (proximity/spring effects)
- Toolbars/overlays: `toolbar-proximity`, `accordion-proximity-group`, `resizable` → CSS-in-JS + pointer/hover alchemy

Every one of these must be **hydrated as React** in the browser, loading `react-dom` + the widget tree. Hydrating dozens of them on a landing page directly degrades LCP/TTI.

### 2.4 Website shell components designed for a different product
`@deepecom/ui` also ships a full site shell for an app-style site we don't have:

- `site-header`, `site-footer`, `site-cta`, `mobile-nav`, `products-dropdown`, `page-header`, `theme-provider`, `mode-switcher`, `auth-split-layout`

These assume a **Next.js-style SPA** (peer dependency: `next@^15`) and replace our hand-built, brand-specific Astro navbar/footer/mega-menus. Using them would mean re-skinning a generic shell instead of shipping our own semantic markup.

---

## 3. Why `@deepecom/ui` is not a good fit for our current site

### 3.1 It fights AGENTS.md, not complements it
Our build rules are explicit:

- *Astro-first; static HTML; optimized images; minimal JS.*
- *Do not introduce React unnecessarily.*
- *Do not introduce heavy frontend libraries unless necessary.*
- *Product UI dominance; editorial layout; premium financial-infrastructure feel.*

`@deepecom/ui` is **inherently React-heavy**: every used component ships `react-dom` hydration and its dependency tree (`recharts`, `visx`, `lexical`, `cmdk`, `shiki`, `d3-*`, `@base-ui/react`, `motion`). It's the *opposite* of the static-first approach the site is optimized for.

### 3.2 It cannot make the site "look better" — the look is custom CSS
The landing page's visual identity comes from:

- `src/styles/tokens.css` (colors, type scale, spacing, radii, shadows)
- Hand-tuned `.astro` components built to match the reference screenshot and AGENTS.md specs
- QA-verified at 320–1280px with no horizontal overflow

A component kit ships its **own default theme**. Adopting it would mean reconciling two competing design systems (its `theme.css` vs. ours) — stripping back custom work instead of improving polish.

### 3.3 SEO cost is concrete, not theoretical
- Static HTML (our approach): crawlers and AI indexers see the final page immediately.
- Hydrated React (kit approach): users and crawlers wait for JS; content inside client-only widgets may never be indexed.
- Every chart/menu/combobox adds LCP/TTI weight on a page whose entire marketing strategy is "fast, premium, enterprise-grade."

### 3.4 There is a real peer mismatch
`@deepecom/ui` expects `next@^15` as a peer (optional but first-class), `tailwindcss@^4`, and `react@^19`. Our marketing site is Astro SSR/SSG with Vercel. Bolting the kit on means maintaining React islands purely to replicate HTML we already render statically.

---

## 4. Where `@deepecom/ui` *would* belong
It is a **product/dashboard UI kit**. The right place for it is the **actual DeepEcom application** — the logged-in product: the Dashboard, Profitability, Payment Reconciliation, Report table, ERP posting interfaces, charts, drawers, and toasts that need real interactivity.

> Keep the marketing website 100% Astro + custom CSS.
> Reach for `@deepecom/ui` in the product app, where interactive React is the correct tool.

---

## Summary

| Question | Answer |
| --- | --- |
| Is `.astro` better for SEO? | Yes — full static HTML, minimal JS, static metadata. |
| Should we import `@deepecom/ui` on the landing page? | No. |
| Why? | Heavy React hydration + recharts/visx/lexical bundle, client-only content risk, generic theme that fights our tokens, and it violates the project's Astro-first performance rules. |
| What do we use instead? | Existing `.astro` sections, custom CSS tokens, SVG/CSS product previews, and lazy `client:`-hydrated `.tsx` only where interactivity is required. |