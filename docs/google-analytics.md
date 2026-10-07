# Google Analytics 4 (GA4) — Setup & Tool Usage Tracking

**Status:** Not implemented. This doc is the plan.
**Last updated:** 2026-10-01

---

## 1. Why

We need to know how many people use the free tools, and which ones.

Right now we have **zero analytics** — no page views, no events, no tracking. We can
see Vercel bandwidth numbers, but not who visits which tool or whether they
actually used it.

GA4 answers three questions:

| Question | GA4 report |
|---|---|
| How many people land on a tool page? | Engagement → Pages |
| How many actually *use* the tool (upload, download)? | Events (custom, see §7) |
| Where did they come from? | Acquisition → Traffic acquisition |

### Tools we're tracking

| Tool | Route | Status |
|---|---|---|
| Amazon Revenue Calculator | `/revcalpublic` | live |
| Meesho Label Manager | `/tools/meesho-label-manager` | live |

Source of truth for the tool list: `src/data/tools.ts` (`FREE_TOOLS`).

---

## 2. Prerequisites

### 2.1 Create the GA4 property

1. Go to https://analytics.google.com
2. **Admin → Create property**
3. Property name: `DeepEcom`
4. Website URL: `https://deepecom.com`
5. Copy the **Measurement ID** — it looks like `G-XXXXXXXXXX`

> If you also run the Vercel preview domain (`deepecom-app.vercel.app`), add it as a
> second domain under **Admin → Data streams → Web → Add domain**. Don't create a
> separate property for it — one property, two domains.

### 2.2 Add the Measurement ID to env

The Measurement ID is public (it ships in client JS), so it uses Astro's `PUBLIC_`
prefix — the same convention already used by the project for
`VITE_GITHUB_CLIENT_ID`.

**`.env`** (local dev):

```
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**`.env.example`** (committed — leave the value empty):

```
# Google Analytics 4 measurement ID (https://analytics.google.com).
# Leave empty to disable analytics locally.
PUBLIC_GA_MEASUREMENT_ID=
```

**Vercel** (production — the `deepecom` project, all environments, or at least
Production + Preview):

```bash
vercel env add PUBLIC_GA_MEASUREMENT_ID production
```

Or via the dashboard: **Project → Settings → Environment Variables**.

> **Important:** Astro inlines `import.meta.env.*` at **build** time. After adding or
> changing this variable on Vercel you must **redeploy** — an env var added to an
> existing deployment will not appear until you redeploy.

### 2.3 Gate dev traffic

Local development hits would pollute the data. We only inject the snippet when the
variable is set *and* we're not in dev:

```astro
const gaId = import.meta.env.PROD ? import.meta.env.PUBLIC_GA_MEASUREMENT_ID : undefined
```

With that, local `npm run dev` is silent, and previews only report if you explicitly
set the variable in the Preview environment.

---

## 3. Where the code goes

Two layouts render every page, so the snippet goes in both:

| File | Insert before |
|---|---|
| `src/layouts/PageLayout.astro` | `</head>` (currently line 76) |
| `src/layouts/LandingLayout.astro` | `</head>` (currently line 104) |

**Why not a shared component?** Both layouts are already independent Astro files
with their own `<head>`. A single `GA.astro` component included by each layout would
work too and avoids duplicating the snippet — that's the better option once the
snippet needs to grow. Two copies of four lines is acceptable; two copies of a
custom-event bootstrap is not.

> **Pages that bypass both layouts:** check `src/pages/og/[key].png.ts` and any page
> that sets its own `<html>`. Those don't need GA.

---

## 4. The snippet

Add to `src/layouts/PageLayout.astro`, in the frontmatter:

```astro
---
const gaId = import.meta.env.PROD ? import.meta.env.PUBLIC_GA_MEASUREMENT_ID : undefined
---
```

Then in `<head>`, immediately before `</head>`:

```astro
{gaId && (
  <Fragment>
    <script is:inline async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
    <script is:inline define:vars={{ gaId }}>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", gaId);
    </script>
  </Fragment>
)}
```

Mirror both into `src/layouts/LandingLayout.astro`.

### Why these Astro directives matter

Getting these wrong is the most common reason GA silently records nothing:

- **`is:inline`** — Astro bundles `<script>` tags by default. A bundled script is
  deferred and re-emitted per page as a module, which breaks the inline
  `dataLayer` setup. `is:inline` keeps the code exactly as written.
- **`define:vars={{ gaId }}`** — this is how you inject the measurement ID into an
  inline script. Plain string interpolation (`${gaId}`) inside an `is:inline` script
  is **not** substituted.
- **`async`** — GA loads off the critical path. Don't remove it.
- **`{gaId && ...}`** — renders nothing when the ID is absent, so there is no request
  to `googletagmanager.com` and no console noise.

---

## 5. Verifying it works

After deploying, before trusting any number:

1. Open the live site in a **fresh incognito window** (ad blockers and extensions
   commonly block GA — this is the #1 cause of "no data").
2. GA4 → **Realtime** should show the visit within ~5 seconds.
3. GA4 → **DebugView** shows each hit with its payload. `page_location` must be the
   real URL, not `localhost`.
4. Confirm in the browser: **Network tab → filter `collect`** → one
   `google-analytics.com/g/collect` request per page view.

If Realtime is empty, work through this in order:

| Cause | Check |
|---|---|
| `gtag.js` blocked | Ad blocker / incognito |
| Env var not set on Vercel | Project → Settings → Environment Variables |
| Site not redeployed after setting the var | Redeploy — inlining happens at build |
| `PUBLIC_` prefix missing | Must be `PUBLIC_`, not `GA_ID` |
| Measurement ID wrong | Must start with `G-` |
| Filtered by `noindex` | GA still fires; check you're not confusing this with Search Console |

---

## 6. Privacy & consent

**Read this before going to production.** `src/pages/privacy-policy.astro` currently
describes data handling but does **not** mention Google Analytics. Adding GA4
without updating it puts the site out of step with its own privacy policy.

GA4 sets first-party cookies and, depending on your Consent Mode configuration,
can enable Google Signals / ad-personalisation features.

### Required work

1. **Update `src/pages/privacy-policy.astro`** — disclose Google Analytics as a
   third-party processor, name the data collected (page views, device/browser,
   approximate location, referring site), link Google's
   [privacy policy](https://policies.google.com/privacy), and state the retention
   period (GA4 default: 14 months; you can shorten this under
   **Admin → Data retention**).
2. **Decide on Consent Mode.** Two options:
   - *Basic* (default): load GA4 immediately. Acceptable only with the policy
     disclosure above, and only where your jurisdiction doesn't require prior
     consent for analytics cookies.
   - *Consent Mode v2* (`default: 'denied'`, updated on accept) — the safer default
     and what you'd want for EU/EEA visitors. Requires a cookie banner and an
     update to the snippet in §4.
3. **Set data-retention to 14 months or less** under **Admin → Data retention**.
4. **Keep IP anonymisation on** (GA4 default — do not disable).
5. Consider **turning off Google Signals** (**Admin → Data settings**) — it is off by
   default in recent GA4 properties, but verify.

### India-specific

DeepEcom's audience is largely Indian sellers. If you collect data from users in
the **EU/EEA**, GDPR applies. Google's standard GA4 terms are covered by the
[Google Data Processing Terms](https://business.safety.google/adsprocessorterms/),
and using GA4 with a **Google Ads** account is treated as "Google advertising
features", which needs an explicit notice. If you never link the GA4 property to a
Google Ads account, you avoid that classification — keep it that way unless the
marketing team decides otherwise.

### Recommendation

Ship §4 with the privacy-policy update, Consent Mode set to `denied` by default
pending a banner, and confirm the DPDP Act position (India's data-protection law)
with counsel before relying on any consent-free basis.

---

## 7. Custom events — tracking real tool usage

Page views tell you someone *opened* the tool. Events tell you they *used* it.
This is the part that answers "how many people are actually using the tools".

### 7.1 Helper

New file — `src/lib/ga.ts`:

```ts
type GaProps = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, props?: GaProps): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("event", name, props)
}
```

The `typeof` guard matters: the tool islands run client-only, but keeping the
helper SSR-safe means it can be called from anywhere without a guard at each call
site.

### 7.2 Event taxonomy

Keep this list short and stable — GA4 custom dimensions have to be registered before
they show up in reports, so adding parameters ad hoc is expensive.

| Event | Parameters | Tool | Fires when |
|---|---|---|---|
| `tool_view` | `tool_id`, `tool_name` | both | Island mounts (use `useEffect` once) |
| `tool_upload` | `tool_id`, `file_count`, `file_size_kb` | Label Manager | Files drop / picked |
| `tool_process` | `tool_id`, `label_count`, `page_count`, `duration_ms` | Label Manager | Detection succeeds |
| `tool_download` | `tool_id`, `output` (`a4` \| `thermal`), `label_count` | Label Manager | PDF download |
| `tool_print` | `tool_id`, `output` | Label Manager | Print invoked |
| `tool_error` | `tool_id`, `stage`, `message` | both | Any caught failure |
| `calculator_change` | `tool_id`, `field` | Revenue Calculator | Any input change (**do not** send values) |
| `calculator_copy` | `tool_id` | Revenue Calculator | Result copied |

`tool_id` uses the `id` from `src/data/tools.ts` (`amazon-revenue-calculator`,
`meesho-label-manager`) so events join cleanly to the tool list.

### 7.3 Wiring — Label Manager

Relevant files:

- `src/components/tools/label-manager/LabelManager.tsx` (island root)
- `src/lib/labelbox.ts`, `src/lib/impose.ts` (processing)
- `src/lib/thermal.ts`, `src/lib/invoices.ts` (outputs)

```tsx
import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/ga"

const TOOL_ID = "meesho-label-manager"

// in the component body:
const viewTracked = useRef(false)
useEffect(() => {
  if (viewTracked.current) return
  viewTracked.current = true
  trackEvent("tool_view", { tool_id: TOOL_ID, tool_name: "Meesho Label Manager" })
}, [])
```

The `useRef` guard is necessary — React 18 StrictMode double-invokes effects in
dev, which would double-count every event.

Then at each call site:

```tsx
// after files are accepted
trackEvent("tool_upload", {
  tool_id: TOOL_ID,
  file_count: files.length,
  file_size_kb: Math.round(totalBytes / 1024),
})

// after detection succeeds
trackEvent("tool_process", {
  tool_id: TOOL_ID,
  label_count: labels.length,
  page_count: pageCount,
  duration_ms: Math.round(performance.now() - t0),
})

// on download / print
trackEvent("tool_download", { tool_id: TOOL_ID, output: "a4", label_count: n })
```

### 7.4 Wiring — Revenue Calculator

`src/pages/revcalpublic.astro` mounts `RevenueCalculator` with `client:load`. Fire
`calculator_change` from a debounced effect on the form state, and `calculator_copy`
from the copy button. Do not send the numeric inputs — the calculator is about
product specs and fees, and those are commercially sensitive.

### 7.5 Registering custom dimensions

After events have been flowing for a few days, register the parameters so GA4
reports can break them down:

**Admin → Custom definitions → Create custom dimension**, one per row of the
parameters above. **Scope: Event.** Without this, `file_count` and `output` are
collected but not reportable.

---

## 8. Reading the data

The reports that actually answer the question:

### "How many people use each tool?"

**Reports → Engagement → Pages**, filter `Page path begins with /tools/` plus
`/revcalpublic`. Compare against the page path breakdown to see the drop-off from
tool page to next page.

Better: use the events from §7 as a funnel.

```
tool_view  →  tool_upload  →  tool_process  →  tool_download
```

Any step with a big drop tells you where the tool is losing people. "Lots of
`tool_view`, almost no `tool_upload`" means the drop zone isn't obvious.

### Useful comparisons

| Compare | Why |
|---|---|
| `tool_upload` per `tool_view` | Landing-page → intent rate |
| `tool_download` per `tool_process` | Is the output good enough to keep? |
| Downloads by `output` (`a4` vs `thermal`) | Which print path people actually need |
| `tool_error` by `stage` | Bugs, ranked by frequency |
| Tool page views over time | Whether the tool is earning its SEO position |
| New vs returning users | Are people coming back, or bouncing once? |

### Don't measure these

Page views on `/`, `/privacy-policy`, or `/terms` are noise. Consider setting up a
filter (**Admin → Data → Filters**) to exclude internal traffic if you have a
staging deployment that receives hits.

---

## 9. Files touched

| File | Change |
|---|---|
| `.env` | Add `PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` (uncommitted) |
| `.env.example` | Add empty `PUBLIC_GA_MEASUREMENT_ID=` |
| `src/layouts/PageLayout.astro` | `gaId` in frontmatter + snippet before `</head>` |
| `src/layouts/LandingLayout.astro` | Same |
| `src/lib/ga.ts` | **New** — `trackEvent` helper |
| `src/components/tools/label-manager/LabelManager.tsx` | `tool_view`, `tool_upload`, `tool_process`, `tool_download`, `tool_print`, `tool_error` |
| `src/components/tools/revenue-calculator/*` | `tool_view`, `calculator_change`, `calculator_copy` |
| `src/pages/privacy-policy.astro` | Disclose Google Analytics (§6) |

No new npm dependencies.

---

## 10. Implementation order

| # | Step | Done when |
|---|---|---|
| 1 | Create GA4 property, get Measurement ID | `G-…` in hand |
| 2 | Add env var locally + Vercel | Redeployed, var visible in build |
| 3 | Snippet in both layouts | Realtime shows a hit |
| 4 | Update privacy policy | Policy mentions GA4 |
| 5 | Decide + implement Consent Mode | No cookies before consent (if v2) |
| 6 | `src/lib/ga.ts` helper | Type-checks clean |
| 7 | Events in Label Manager | Events appear in GA4 DebugView |
| 8 | Events in Revenue Calculator | Same |
| 9 | Register custom dimensions | Parameters reportable in UI |
| 10 | Build the funnel view | One saved report you actually look at |

Steps 1–3 are ~15 minutes of work. Steps 6–9 are the real work. Step 4 is the one
that is easy to forget and annoying to have to retrofit.

---

## 11. Open questions

- **Consent Mode or Basic?** Affects §4 and whether we need a banner dependency.
  Recommend v2/denied-by-default.
- **Property vs. rollup?** One property for all domains, or separate properties per
  environment? Recommend one property, two domains.
- **Google Signals / ad personalisation?** Recommend off. Revisit if a paid channel
  ever gets created.
- **Data retention?** 14 months is the default. Consider 3 months — we don't need
  year-over-year user counts.
- **Alternative to GA4?** Plausible or a privacy-first tool avoids the consent
  complexity in §6 entirely. GA4 is the default choice only because the team already
  lives in the Google ecosystem (Search Console is wired into the SEO agent).
