# Foundations — Theming & tokens

Do not redefine token values in this doc. OKLCH values and semantic lanes live in [foundations-color.md](foundations-color.md). Per-topic policy lives in linked depth docs below.

## Workflows decision

All design tokens ship from a single runtime file: `packages/components/src/theme.css`. Components and apps consume tokens through Tailwind aliases declared in `@theme inline`. No ad-hoc hex, OKLCH, or RGB in component source.

## Light and dark

- Default: `:root` and `.light`
- Dark: `.dark` class on an ancestor
- Mode-specific values are set in `theme.css`; primitives do not branch on mode in TSX

## Token families

| Family | CSS prefix (representative) | Depth doc |
| --- | --- | --- |
| Semantic colors | `--background`, `--foreground`, `--primary`, `--primary-text`, `--secondary`, `--muted`, `--border`, `--input`, `--ring` | [foundations-color.md](foundations-color.md) |
| Interaction lanes | `--hover`, `--active`, `--accent` (+ foreground pairs) | [foundations-color.md](foundations-color.md), [foundations-states.md](foundations-states.md) |
| Surface ladder | `--surface-1` … `--surface-8`, `--surface-bg`, `[data-surface]` | [foundations-elevation.md](foundations-elevation.md) |
| Surface chrome per level | `--surface-border-*`, `--surface-shadow-*`, `--surface-ring-*`, `--surface-backdrop-*`, `--surface-radius-*`, `--surface-radius-interior-*`, `--surface-radius`, `--surface-radius-interior`, `--surface-radius-nested`, `--surface-nest-gap` | [foundations-elevation.md](foundations-elevation.md), [foundations-radius.md](foundations-radius.md) |
| Radius scale | `--radius`, `--radius-sm` … `--radius-xl` | [foundations-radius.md](foundations-radius.md) |
| Motion | `--motion-duration-*`, `--motion-ease-*`, `--motion-hover-strength`, `--motion-active-strength` | [foundations-motion.md](foundations-motion.md) |
| Proximity | `--proximity-scale-max`, `--proximity-falloff-px`, `--proximity-highlight-max` | [composition-principles.md](composition-principles.md) |
| Tooltip inverted | `--tooltip-bg`, `--tooltip-fg`, `--tooltip-border` | [foundations-elevation.md](foundations-elevation.md) |
| Status | `--destructive`, `--info`, `--success`, `--warning` (+ `-foreground` on-fill, `-text` on-substrate) | [foundations-color.md](foundations-color.md) |
| Sidebar, chart, code | `--sidebar-*`, `--chart-*`, `--code-*` | [foundations-color.md](foundations-color.md) |
| Typography | `--font-sans`, `--font-heading`, `--font-mono` | [foundations-typography.md](foundations-typography.md) |

Layout and spacing tokens are documented under [foundations-index.md](foundations-index.md) § Layout ([grid](foundations-grid.md), [spacing](foundations-spacing.md)).

Live inventory table: `/docs/foundations/tokens` (mirrors this family list; row count must match).

## Tailwind aliases

`@theme inline` in `theme.css` maps semantic CSS variables to `--color-*` and radius utilities (`rounded-sm`, etc.). Use Tailwind utilities (`bg-background`, `bg-hover`, `ring-ring`) in components — not raw `var(--hover)` unless required for non-Tailwind CSS.

## Forbidden patterns

- Ad-hoc color or radius in `packages/components` or registry UI outside `theme.css`
- `--radius-2xl` or `rounded-2xl` in product-lane components (see `audit-surface-shadow-policy.mts`)
- Carbon `support-*`, `text-*`, zone families, or Fluid solid neutrals as runtime API
- Carbon `layer-hover-*` / `layer-selected-*` names in product-lane primitives
- Marketing gradients, glass, or decorative blur on product content

## Skeuomorphic lane

Dark runtime defaults to `html.dark.skeuo-dark`, which remaps shared semantic tokens in `theme.css`. Opt-in material tokens (`--skeuo-*`) and `[data-skeuo]` scene wrappers are documented in [foundations-skeuomorphic-material.md](foundations-skeuomorphic-material.md). Never mix skeuo gradients on product-lane primitive class lists.

## Live demos

- `/docs/foundations/tokens`
- Full index: [foundations-index.md](foundations-index.md)