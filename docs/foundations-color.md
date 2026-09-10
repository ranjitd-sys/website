# Foundations — Color

## Workflows decision

All color tokens live in `packages/components/src/theme.css`. No ad-hoc hex, OKLCH, or RGB values are permitted outside this file.

- **Color space**: OKLCH for all shipped semantic tokens.
- **Mode**: Light (default) and `.dark` class-based dark mode.
- **Semantic interaction lanes**: `accent` is persistent emphasis, `hover` is transient preview, `active` is stronger transient press/engaged feedback.
- **8-level surface ladder**: `--surface-1` through `--surface-8` with per-level borders, shadows, rings, backdrops, and radius. See [foundations-elevation.md](foundations-elevation.md).
- **Status colors**: `destructive`, `info`, `success`, `warning` — each with `-foreground` (on-fill) and `-text` (on-substrate) roles.
- **Special lanes**: `chart-1…5`, `chart-positive`, `chart-negative`, `chart-caution`, `chart-accent-lime`, `chart-highlight`, fill-mechanics (`chart-gradient-*`, `chart-link-opacity`, `chart-scatter-fill-opacity`, `chart-gauge-inactive-opacity`), pattern tokens (`chart-pattern-*`), `chart-series-muted`, `chart-spark-stroke`, `chart-spark-fill`, `chart-area-fill-opacity`, `chart-grid`, `chart-label`, `chart-crosshair`, `chart-tooltip-*`, `sidebar-*`, `code-*`, `tooltip-bg/fg/border`.

## Brand lane

DeepEcom’s identity blue is `--primary` (`oklch(0.55 0.215 262)` / `#2165EC`), the **600** step of the design-time ramp (not 500). Carbon’s interactive blue also anchors at blue-60.

- `--primary` is mode-invariant.
- `--primary-text` is mode-aware substrate text (light = primary, dark = lighter blue).
- `--ring` uses the same blue family; it repairs the prior non-text contrast failure on focus rings.
- `--info` is a darker sibling (`oklch(0.47 0.195 262)` / `#124FC6`) so status and action remain distinguishable by value, not hue.
- `--accent` remains a neutral alpha overlay; selection/open states do not compete with data colors.
- `--chart-1` anchors the chart palette on brand hue 262 with per-block lightness (light `0.623` / dark `0.69` / skeuo `0.74`).
- `--destructive` is red-orange (`oklch(0.55 0.193 35)`); `--chart-negative` keeps the accounting red so error and money-out stay distinct.
- No `--blue-*` primitive ramp ships in `theme.css`; design-time tints are documented here only.

Design-time ramp (reference, not runtime tokens; **600 = brand anchor**):

| Step | Hex | Use |
| --- | --- | --- |
| 50 | `#F2F7FF` | soft backgrounds |
| 100 | `#E3EDFF` | hover/selected surfaces |
| 200 | `#CADDFF` | disabled tints |
| 300 | `#A4C5FF` | secondary accents |
| 400 | `#5C94FF` | dark-mode text / ring |
| 500 | `#3D7EFC` | mid accent (not brand) |
| 600 | `#2165EC` | **brand / `--primary`** |
| 700 | `#1253D2` | pressed / deep accent |
| 800 | `#0D42AA` | dark surfaces |
| 900 | `#0A317C` | deepest text on light |

## Three-role status contract

| Role | Token | Use |
| --- | --- | --- |
| Fill | `--X` | Solid fill / indicator |
| On-fill | `--X-foreground` | Content **on** `--X` |
| On-substrate | `--X-text` | Same-hue text on page / tinted wash |

The class `text-primary-text` is intentionally literal. Do not use `text-primary` for body or link text on a substrate in dark mode.

## Chart lane (blue-first)

- **Hue anchor**: brand-hue blue `#4380F8` → `--chart-1` light (`oklch(0.623 0.19 262)`).
- **Categorical slots**: `--chart-1`…`--chart-5` are a cool blue-family set (blue, violet, cyan, azure, teal)—not rainbow defaults.
- **Financial semantics**: `--chart-positive`, `--chart-negative`, `--chart-caution` for P&amp;L, candlestick, and financial gauge paths.
- **Parity accents**: `--chart-accent-lime` and `--chart-highlight` are parity-docs only—not dashboard defaults.
- **Fill precedence**: solid → same-hue tonal gradient → semantic cross-hue gradient → pattern overlay. Cross-hue decorative gradients (e.g. bar `--chart-1`→`--chart-2`) are parity-docs only.
- **Chrome**: `--chart-label` is explicit (not `muted-foreground` alias); tooltip shell uses `--chart-tooltip-*`.
- **Spark**: `--chart-spark-stroke`, `--chart-spark-fill` for single-series micro charts; `--chart-series-muted` for compact dual-series comparison.
- **Patterns**: `--chart-pattern-bg`, `--chart-pattern-fg-opacity`, `--chart-pattern-stroke-width`.
- **Interaction accent**: `--accent` stays neutral wash; chart series keep chroma so dashboards do not confuse data color with row selection.

Dark skeuo runtime overrides the same `--chart-*` names inside `.dark.skeuo-dark` with exact per-token values—no transform rules and no `--skeuo-chart-*` API.

## Inventory resolved in this ship

| In-repo pattern inspected | Problem | Canonical decision |
| --- | --- | --- |
| `packages/components/src/components/ui/accordion-proximity-group.tsx` used `bg-accent/*` for both expanded rows and the proximity pill | Open and hover collapsed into one token family | Expanded rows use `bg-accent`; transient pill uses `bg-hover` |
| `packages/components/src/components/ui/tabs.tsx`, `toggle-group.tsx`, `pagination-proximity.tsx`, `toolbar-proximity.tsx`, `tab-navigation.tsx` use `bg-accent/*` for hover pills | Hover state is visually coupled to selected/open state | New canonical hover lane is `bg-hover`; existing families migrate as touched |
| `packages/components/src/components/ui/menu.tsx`, `select.tsx`, `combobox.tsx`, `autocomplete.tsx` layer `bg-accent/*` for highlight and selected states | Highlight and selected affordances share one color family | Canonical split is `hover` for transient preview and `accent` for persistent selection |
| Current docs listed `background`, `foreground`, `muted`, `secondary`, `border`, `ring` but not `accent`, `hover`, or `active` | Developers could not answer which token owns hover vs open | This doc now defines the semantic interaction map and Tailwind aliases |

## Reference crosswalk

| Workflows choice | Fluid source inspected | Carbon source inspected | Rationale | Rejected alternative |
| --- | --- | --- | --- | --- |
| Semantic base API stays `background`, `foreground`, `primary`, `secondary`, `muted`, `accent` in `theme.css` | `app/globals.css` | `packages/styles/scss/_theme.scss` | Workflows keeps one shadcn-style semantic API with OKLCH values in a single CSS file | Adopting Carbon `text-*`, `support-*`, or zone token families directly |
| Add dedicated `--hover` and `--active` tokens with Tailwind aliases `bg-hover` and `bg-active` | `app/globals.css`, `registry/radix/tabs.tsx`, `registry/radix/checkbox-group.tsx`, `registry/radix/accordion.tsx` | `packages/styles/scss/layer/_layer-sets.scss`, `packages/styles/scss/components/list-box/_list-box.scss` | Fluid already separates hover/active overlays from open state, and Carbon separates hover/active fields and layers; workflows needs the same split to keep proximity and open states legible | Reusing `accent` or `muted` for transient hover and pressed states |
| Keep `accent` as the persistent selected/open wash | `registry/radix/accordion.tsx` | `packages/styles/scss/layer/_layer-sets.scss` | Open and selected states should stay semantic and persistent instead of reading like pointer hover | Using `hover` for expanded/open or using surface levels for row state |
| Keep the workflows 8-level surface ladder and map Carbon's 3 contextual layers into it | `app/globals.css` | `packages/styles/scss/layer/_layer-sets.scss` | Carbon's layer model is useful, but workflows needs more than 3 container levels and ships border, shadow, ring, radius, and backdrop with each level | Replacing workflows surfaces with Carbon's 3-layer stack |
| Keep status colors limited to `destructive`, `info`, `success`, `warning` | `app/globals.css` destructive lane | `packages/styles/scss/_theme.scss` | Four status lanes cover current product needs without importing Carbon's larger support taxonomy | Adding Carbon's full support/status matrix to the runtime theme |

## Semantic token map

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `oklch(1 0 0)` | `oklch(0.141 0.005 285.823)` | App substrate |
| `--foreground` | `oklch(0.21 0.006 285.885)` | `oklch(0.967 0.001 286.375)` | Primary text |
| `--primary` | `oklch(0.55 0.215 262)` | `oklch(0.55 0.215 262)` | Brand action fill (mode-invariant) |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` | Content on primary |
| `--primary-text` | `oklch(0.55 0.215 262)` | `oklch(0.68 0.169 262)` | Brand text on substrate |
| `--secondary` | `oklch(0 0 0 / 4%)` | `oklch(1 0 0 / 8%)` | Quiet alternative fills |
| `--muted` | `oklch(0 0 0 / 4%)` | `oklch(1 0 0 / 8%)` | Sunken, disabled, or background-adjacent fills |
| `--accent` | `oklch(0 0 0 / 4%)` | `oklch(1 0 0 / 8%)` | Persistent selected/open wash |
| `--hover` | `oklch(0 0 0 / 6%)` | `oklch(1 0 0 / 10%)` | Transient hover or focus preview |
| `--active` | `oklch(0 0 0 / 10%)` | `oklch(1 0 0 / 14%)` | Stronger transient press/engaged feedback |
| `--border` | `oklch(0 0 0 / 10%)` | `oklch(1 0 0 / 12%)` | Default borders |
| `--input` | `oklch(0 0 0 / 10%)` | `oklch(1 0 0 / 12%)` | Form borders |
| `--ring` | `oklch(0.55 0.215 262)` | `oklch(0.68 0.169 262)` | Focus rings |
| `--destructive` | `oklch(0.55 0.193 35)` | `oklch(0.55 0.193 35)` | Error/destructive fill |
| `--destructive-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` | Content on destructive |
| `--destructive-text` | `oklch(0.45 0.158 35)` | `oklch(0.75 0.15 35)` | Error text on substrate |
| `--info` | `oklch(0.47 0.195 262)` | `oklch(0.47 0.195 262)` | Informational fill |
| `--info-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` | Content on info |
| `--info-text` | `oklch(0.42 0.175 262)` | `oklch(0.72 0.145 262)` | Info text on substrate |
| `--success` | `oklch(0.696 0.17 162.48)` | `oklch(0.696 0.17 162.48)` | Success fill |
| `--success-foreground` | `oklch(0.21 0.006 285.885)` | `oklch(0.21 0.006 285.885)` | Content on success |
| `--success-text` | `oklch(0.47 0.102 162.48)` | `oklch(0.765 0.166 162.48)` | Success text on substrate |
| `--warning` | `oklch(0.769 0.188 70.08)` | `oklch(0.769 0.188 70.08)` | Warning fill |
| `--warning-foreground` | `oklch(0.21 0.006 285.885)` | `oklch(0.21 0.006 285.885)` | Content on warning |
| `--warning-text` | `oklch(0.47 0.101 70.08)` | `oklch(0.828 0.137 70.08)` | Warning text on substrate |

Tailwind aliases come from `@theme inline`: `bg-background`, `bg-muted`, `bg-accent`, `bg-hover`, `bg-active`, `text-foreground`, `text-primary-text`, `text-destructive-text`, `border-border`, `ring-ring`.

## Consumer patterns

### 1. Primary action

```tsx
<Button>Book a Demo</Button>
```

Maps to `bg-primary text-primary-foreground`. Hover uses `hover:brightness-[0.94]`. Focus uses `focus-visible:ring-ring`. Never use `text-primary` for CTA labels.

### 2. Brand text

```tsx
<a className="text-primary-text hover:underline">Explore Platform</a>
<span className="text-primary-text uppercase tracking-widest text-xs">The Accounting Layer</span>
```

Use `text-primary-text` for brand-colored text or links on a substrate. In dark sections it resolves to the lighter blue.

### 3. Status tint

```tsx
<Badge variant="info">Reconciled</Badge>
<Callout variant="info">Payment matched</Callout>
```

Tinted surfaces use the `-text` lane: `bg-info/8 text-info-text`, `bg-info/10 text-info-text`, form errors `text-destructive-text`.

### 4. Status solid

```tsx
<Button variant="destructive">Delete</Button>
<Badge variant="error">Failed</Badge>
```

Solid fills use `-foreground`: `bg-destructive text-destructive-foreground`, `bg-info text-info-foreground`.

### 5. Surface elevation

```tsx
<div className="bg-card border border-border shadow-xs">…</div>
<div data-surface="5" className="surface-layer surface-shadow surface-clip">…</div>
```

Product overlays use the 8-level surface ladder via `surface-layer`, `surface-shadow`, `surface-clip` (also `surface-backdrop`, `surface-focus-ring`). Marketing cards may use `bg-card border-border shadow-xs`.

### 6. Marketing gradient

Gradients stay outside `theme.css` and outside the docs app CSS scan (skeuo isolation forbids product/docs `linear-gradient` outside an allowlist). Marketing sites own a separate `marketing-theme.css`. Because `--primary` is mode-invariant, declare light-section and dark-section gradients separately — prefer explicit per-mode values over deriving dark gradients from `--primary-text` (that couples marketing surfaces to a text-accessibility token). Relative color requires Safari 16.4+, Chrome 119+, Firefox 128+. Verified with `lightningcss` that relative color inside `@utility` (not `@theme inline`) compiles.
### 7. Data / chart

```tsx
<SparkLineChart data={rows} index="date" categories={['revenue']} />
```

Series colors resolve through chart tokens (`--chart-1`…`--chart-5`, `--chart-spark-stroke`, `--chart-spark-fill`). Primary series anchors on brand hue 262.

### 8. Focus ring

```tsx
<button className="focus-visible:ring-2 focus-visible:ring-ring">…</button>
```

Blue `--ring` meets non-text contrast and ties focus to brand identity.

## Website / consumer guidance

- CTAs and filled controls: `bg-primary text-primary-foreground`
- Brand-colored text or links on a substrate: `text-primary-text`
- Status `-text` when rendering callouts, badges, or form validation
- Never blue for “you are here” — active nav uses weight, an indicator, or `bg-active`

## Migrating from `@deepecom/ui` v0.1.0

- `--primary` is blue, not near-black.
- `--destructive-foreground` is now on-fill white; substrate error text must use `text-destructive-text` (same for info / success / warning).
- `--destructive` hue moved off accounting red; `--chart-negative` kept the old red.
- `--info` darkened two lightness steps.
- Active nav: drop `text-primary`; keep structural indicators.
- Copied button styles: `shadow-primary/24` → `shadow-black/16`; opacity-lighten hover → brightness darken.

## Interaction surfaces

| Use this | When | Do not use it for |
| --- | --- | --- |
| `bg-background` / surface background | App substrate and base container background | Selected, hovered, or pressed state |
| `bg-muted` | Sunken trays, disabled fills, quiet grouping shells | Hover preview or persistent open/selected state |
| `bg-hover` | Pointer hover, list preview, proximity pill, transient focus preview | Persistent open, checked, selected, or expanded state |
| `bg-active` | Pressed state, drag/engaged feedback, stronger transient active feedback | Long-lived open/selected state or container background |
| `bg-accent` | Open, selected, checked, or semantic emphasis wash | Pointer-only hover feedback |
| `[data-surface]` ladder | Container elevation and overlay shells | Row hover, item selected/open, or button pressed state |

Minimal shipped proof: `packages/components/src/components/ui/accordion-proximity-group.tsx` now uses `bg-hover` for the L1 proximity pill and `bg-accent` for expanded rows.

Full interaction state matrix (focus, disabled, L2 highlight vs selected): [foundations-states.md](foundations-states.md).

## Persistent-state rule

Perceptual separation is not guaranteed by opacity delta alone. `bg-accent` may be close to `bg-hover` in some contexts, especially when the control geometry and surrounding surface are identical. Persistent state should therefore keep a second cue whenever hover and selected or open state share the same visual footprint.

Allowed second cues:

- a border or contour change
- icon or check indicator
- text weight or text color shift
- structural change such as expansion, disclosure, or selection pill persistence

Do not solve this by adding a second accent family. Keep the semantic lanes small and prove the distinction in demos instead.

## 8-level surface ladder

Per-level token values live in `theme.css`. Elevation policy and overlay contract: [foundations-elevation.md](foundations-elevation.md).

| Level | Light BG | Dark BG | Border | Shadow | Use |
| --- | --- | --- | --- | --- | --- |
| 1 | `oklch(1 0 0)` | `oklch(0.141 0.005 285.823)` | `--surface-border-1` | `--shadow-1` | App background |
| 2 | `oklch(0.995 0 0)` | `oklch(0.17 0.005 285.823)` | `--surface-border-2` | `--shadow-2` | Subtle cards and substrate-adjacent panels |
| 3 | `oklch(0.99 0 0)` | `oklch(0.2 0.006 285.823)` | `--surface-border-3` | `--shadow-3` | Raised panels |
| 4 | `oklch(0.985 0 0)` | `oklch(0.23 0.006 285.823)` | `--surface-border-4` | `--shadow-4` | Sidebars, lists |
| 5 | `oklch(0.98 0 0)` | `oklch(0.26 0.006 285.823)` | `--surface-border-5` | `--shadow-5` | Dialog, sheet, drawer overlay shells |
| 6 | `oklch(0.975 0 0)` | `oklch(0.3 0.006 285.823)` | `--surface-border-6` | `--shadow-6` | Floats inside overlays |
| 7 | `oklch(0.97 0 0)` | `oklch(0.34 0.006 285.823)` | `--surface-border-7` | `--shadow-7` | Deep nested floats |
| 8 | `oklch(0.965 0 0)` | `oklch(0.38 0.006 285.823)` | `--surface-border-8` | `--shadow-8` | Deepest nested floats |

## Carbon `layer-*` crosswalk

| Carbon | Workflows | Use |
| --- | --- | --- |
| `layer-01` | surfaces 1–2 | App substrate and sunken shells |
| `layer-02` | surfaces 3–4 | Raised panels |
| `layer-03` | surfaces 5–8 | Overlay shells and nested floats |

Field-stack policy: base controls (`field`, `input`, `textarea`, `checkbox`, `radio-group`, `switch`, `label`) stay on substrate tokens, while `select` / `combobox` / `autocomplete` popup shells use `data-surface` ladder levels.

## Tooltip exception

Tooltips do not use the surface ladder. They use the locked `tooltip-inverted` lane (`--tooltip-bg`, `--tooltip-fg`, `--tooltip-border`) for guaranteed contrast against any substrate.

## Intentional non-adoptions

- Carbon `support-*`, `text-*`, and zone token families
- Carbon `layer-selected-*` and `layer-hover-*` names as runtime API
- Fluid's solid neutral `accent` values (`#E5E5E5`, `#525252`) in shipped theme tokens
- Reusing `bg-muted` as the hover token for proximity and list preview
- Marketing gradients, glass, or decorative blur