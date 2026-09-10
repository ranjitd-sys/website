# Foundations — Typography

## Workflows decision

Three font stacks are loaded in the docs app:

| Stack | Font | Variable | Weights |
|-------|------|----------|---------|
| Sans | Geist | `--font-sans` | 400, 500, 600, 700 (inferred) |
| Heading | IBM Plex Sans | `--font-heading` | 400 |
| Mono | System monospace | `--font-mono` | — | 

IBM Plex Sans is used at a single weight (400) for headings. Geist handles body, UI, and labels.

Typography serves language, not the convenience of a system. Workflows keeps a restrained product type system because the main job of typography here is to support task flow, density, and hierarchy in app UI rather than to demonstrate a large display scale.

## Product type roles

| Role | Classes | Primitive slots |
| --- | --- | --- |
| Input text | `text-base/5 sm:text-sm` | input, field control, textarea shell, select trigger, combobox, number-field group |
| Field label | `text-sm/4` | label, FieldLabel |
| Helper / description | `text-sm/relaxed text-muted-foreground` | FieldDescription, dialog/card/sheet/drawer/popover/alert descriptions |
| Error / compact meta | `text-xs/4` | FieldError, chooser group labels |
| List / chooser item | `text-base sm:text-sm` | menu, select, combobox, autocomplete, command items |
| Chooser empty | `text-base/relaxed sm:text-sm/relaxed text-muted-foreground` | combobox/autocomplete empty |
| Overlay title | `font-heading text-xl/tight` | dialog, alert-dialog, empty-title |
| Panel title | `font-semibold text-lg/tight` | card, popover |
| Sheet / drawer title | `font-semibold text-base/tight` | sheet, drawer |
| Shortcut hint | `text-xs text-muted-foreground/64` | menu, command shortcuts |
| Data readout | `font-mono text-sm tabular-nums` | callers; table stays `text-sm` |

## Primitive defaults

| Primitive | Size classes | Notes |
| --- | --- | --- |
| `button.tsx` | `text-base`, `sm:text-sm`, `xl:text-lg` | Size variant driven |
| `input.tsx` | `text-base/5`, `sm:text-sm` | Input text role |
| `textarea.tsx` | `text-base/5`, `sm:text-sm` | Input text role |
| `number-field.tsx` | `text-base/5`, `sm:text-sm` | Input text role on group |
| `label.tsx` | `text-sm/4` | Field label role |
| `field.tsx` | `text-sm/relaxed` description, `text-xs/4` error | Helper + error roles |
| `table.tsx` | `text-sm` | Cell text |
| `badge.tsx` | `text-xs` | Compact labels |
| `alert.tsx` | `text-sm/relaxed` body | Explanatory copy |
| `tabs.tsx` | `text-sm` | Tab labels |
| `dialog.tsx` | `text-xl/tight` title, `text-sm/relaxed` description | Overlay title role |
| `command.tsx` | `text-base sm:text-sm` items | Matches menu list density |

Marketing display sizes (`text-4xl`, `text-5xl`) are rare in app UI and not primitive defaults.

## Contextual type

| Context | Workflows default | Why |
| --- | --- | --- |
| Body and UI copy | Geist | the main product lane needs a stable, readable UI voice |
| Headings | IBM Plex Sans at restrained sizes | headings should separate sections without turning the app into a marketing surface |
| Dense labels and metadata | smaller Tailwind text steps | compact UI needs predictable hierarchy more than expressive flourish |
| Data and code | monospace and `tabular-nums` where needed | numbers and code need alignment and scan stability |

This is a contextual system, not a giant abstract scale. Primitive defaults should keep matching their role and task density first.

## Font weight glide (Fluid influence)

Fluid-functionalism uses variable font weight glide for proximity hover. Workflows **does not** ship this as a default behavior because:

- Geist is not a variable-weight font in the current configuration.
- IBM Plex Sans variable is available but loaded at a single weight.

Where variable weight glide is desired (e.g. `comp-field-proximity-demo`), use `font-variation-settings` directly in the particle, not in the primitive.

## What we intentionally do not adopt

- **Carbon type tokens (`heading-01…06`, `body-01…02`, etc.)**: Too granular for current needs. Tailwind text scale is sufficient.
- **Fluid type scale plugins**: Not a runtime dependency.
- **Display/italic/marketing sizes**: Brutalist policy keeps typography restrained.
- **A parallel typography token lattice**: the repo needs clear role defaults and documentation, not a second token system detached from real usage.

## Wave 3 demo hypothesis

The typography foundations page proves that role-based product typography is easier to scan than a larger, more decorative scale in both light and dark mode.font-geist