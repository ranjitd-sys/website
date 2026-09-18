# Amazon.in Fee Data — Sources & Refresh Runbook

How the Revenue Calculator (`/revcalpublic`) gets its Amazon.in fee data, where every
number comes from, and how to refresh it.

**No SP-API, no runtime API calls, no secrets.** All rates are static data compiled into
the site; only the arithmetic runs in the browser.

---

## 1. Where the data lives in the repo

| File | Contents |
| --- | --- |
| `src/data/amazon-in-rate-card.ts` | **Generated.** 234 categories: referral bands, FC closing-fee group membership (`fcLow`, `fcMid`, `fcStar`), data version + effective dates + source URL. |
| `src/data/amazon-fees.ts` | All fee logic and the transcribed rate tables: closing fee per channel, weight handling (STEP × zone), pick & pack, storage, GST, size/volumetric rules, provenance notes. |
| `src/components/pages/revcalpublic/RevenueCalculator.tsx` | Inputs, "How Amazon reads this package" panel, channel comparison, presets. |
| `src/pages/revcalpublic.astro` | Page shell + "Sources & method" copy. |

Exported metadata:

```
RATE_CARD_SOURCE   = 'https://sell.amazon.in/fees-and-pricing'
RATE_CARD_EFFECTIVE = 'Referral schedule 2026 (Tyres & Rims, Fans updated June 10, 2026);
                       closing fees effective September 7, 2026'
RATE_CARD_VERSION  = '2026-09-17'
FEE_DATA_VERSION   = RATE_CARD_VERSION   // shown on the Define-product panel
```

---

## 2. Source inventory

### 2.1 Public pages (text, machine-readable)

| Source | URL | Yields |
| --- | --- | --- |
| Fees & Pricing (master) | `https://sell.amazon.in/fees-and-pricing` | Referral table (234 categories + price bands); FC closing-fee **group membership lists** (`#`, `##`, `A`, `B`, `C`, `D`, `*`); per-channel closing **worked examples**; weight-handling rules (volumetric ÷5000, minimum 500 g, zones, Heavy & Bulky criteria); pick & pack, storage, removal; GST 18% note; profit formula; payment cycles |
| Fee Changes / fee schedule | `https://sell.amazon.in/fees-and-pricing/fee-schedule` | Closing-fee change announcement (+₹1 up to ₹500, +₹3 above ₹500); zero-referral expansion; Easy Ship / Self Ship reductions; referral-rate revisions with effective dates |

### 2.2 Published rate-card images (vision transcription)

The exact grids are published **only as images** on the Amazon media CDN.

**From the master page** (`m.media-amazon.com/images/G/31/amazonservices/`) — these are the
ones transcribed into `amazon-fees.ts`:

| Image | Used for |
| --- | --- |
| `Closing_feeFulfilment_center_excluding_Seller_Flex_Sept_26.jpg` | FC closing fee grid |
| `Closing_Fee_for_Easy_shipEasyship_Prime_Sept2026.jpg` | Easy Ship closing fee grid |
| `Closing_fee_SelfShip_Sept26.pngV2.jpg` | Self Ship closing fee grid |
| `Closing_FeeSeller_Flex_Sept26.jpg` | Seller Flex closing fee grid |
| `FC_WHF_FeePricing26.jpg` | FC weight handling (Regional / National × STEP) |
| `FC_HB_WHF_FeePricing26.jpg` | FC Heavy & Bulky weight handling (Local / Regional / National × STEP) |
| `ES_WHF_FeePricing26.jpg` | Easy Ship weight handling (flat fee × STEP) |
| `SF_WHF_FeePricing26.jpg` | Seller Flex weight handling (flat fee × STEP) |
| `SF_HB_WHF_FPS26.jpg` | Seller Flex Heavy & Bulky weight handling |
| `IXD_WHF_FeePricing26.jpg` | Inbound Cross Dock — **out of scope** (inbound fee, not per-order) |

**From the fee-schedule page** — newer/alternate revisions, **not yet reconciled**:

| Image | Label on page | Status |
| --- | --- | --- |
| `ES_WHFV1_Aug26.jpg` | Easy ship Weight Handling fee (**Revised**) | ⚠️ **To verify** — our ES rates came from the March 16, 2026 table |
| `FC_WHFV1_Aug26.jpg` | FC Weight Handling fee (**unchanged**) | Cross-check only |
| `SF_WHFV1_Aug26.jpg` | Seller Flex Weight Handling fee (**unchanged**) | Cross-check only |
| `Closing_fee_for_fullfilment_Sept2026V2.png` | FC closing | ⚠️ Alternate revision — to verify |
| `Closing_Fee_for_Easy_ship_Sept2026.png` | Easy Ship closing | ⚠️ Alternate revision — to verify |
| `closing_fee_for_selfship_Sept2026.png` | Self Ship closing | ⚠️ Alternate revision — to verify |
| `Closing_Fee_for_Seller_flex_Sept2026.png` | Seller Flex closing | ⚠️ Alternate revision — to verify |

### 2.3 Login-gated (authoritative, unread)

| Source | URL | Notes |
| --- | --- | --- |
| Selling on Amazon fee schedule (India) | `sellercentral.amazon.in/help/hub/reference/G200336920` | Canonical fee schedule. Anonymous fetches return only the sign-in shell. |
| FBA Revenue Calculator | `sellercentral.amazon.in/fba/profitabilitycalculator` | Amazon's own calculator — best cross-check oracle. |
| Fee category guidelines | Seller Central Help | Searchable product → fee-category list; needed for exact category mapping. |

### 2.4 Corroborating / secondary

- Seller Forums announcement: *"Amazon.in fee updates, effective March 16, 2026"* — corroborated
  the zero-referral expansion, Easy Ship reductions and Self Ship closing fees.
- Amazon "Fee Dashboard" prototype link surfaced on the master page
  (`protozoa.dev/prototypes/…/amazon-fee-dashboard V8.html`) — a possible future source for
  the unpublished grids.

---

## 3. Effective dates

| Area | Effective |
| --- | --- |
| Referral rate card | 2026 schedule; **Automotive – Tyres & Rims** and **Fans and Robotic Vacuums** updated **10 June 2026** |
| Closing fees (all channels) | **7 September 2026** — +₹1 for items ≤ ₹500, +₹3 for items > ₹500 |
| Weight handling (FC / ES / SF) | **16 March 2026** table (headed "Effective March 16, 2026"); fee-schedule page shows a **revised Easy Ship** table dated Aug 2026 — unverified |
| GST on fees | 18% |

---

## 4. Extraction method

1. **Discovery** — fetch the master page and the fee-schedule page; enumerate every
   `![…](…)` image URL and every section (Types of fees, Compare fulfilment channels, Fee Changes).
2. **Text extraction** — save the fetched page, then parse it with the build-time script
   `parse_fees.py` (lives outside the repo, at `/tmp/opencode/parse_fees.py`). The parser
   emits `src/data/amazon-in-rate-card.ts` and **reports unmatched rows instead of guessing**.
3. **Image extraction** — download the grid images, read them visually, transcribe into the
   tables in `amazon-fees.ts` (`FC_LOW_FEES`, `FC_MID_FEES`, `ES_CLOSING`, `SS_CLOSING`,
   `SF_CLOSING`, `WHF_FC`, `WHF_FLAT`, `WHF_HB`).
4. **Verification** — assert against Amazon's own worked examples (see §6) and the published
   deltas.
5. **Coverage check** — compare parsed counts against the page (see §5).

---

## 5. Coverage

| Check | Value |
| --- | --- |
| Categories parsed | **234** |
| FC closing group members | `#` 153 · `##` 146 · `A` 59 · `B` 20 · `C` 55 · `D` 32 · `*` 4 |
| Categories with **no** published closing group | **6** (`fcLow: null`) — Musical Instruments – Keyboards, Business & Industrial Supplies – Scientific Supplies, Kindle Accessories, Entertainment Collectibles, Consumable Physical Gift Card, E-mail Gift Card |
| Categories with the `*` ₹75 above ₹1,000 override | **3** (Chimneys, Refrigerators, Major Appliances – Other) |

---

## 6. Oracle checks (run after any refresh)

Referral (from the master page's worked examples):

- Grocery – Dried fruits and nuts @ ₹750 → **₹0** (0%)
- Apparel – Baby @ ₹1,450 → **₹101.50** (7%)
- Shoes @ ₹1,000 → **₹0** (0% up to ₹1,000)

Closing:

- FC, Grocery & Gourmet – Beverages @ ₹249 → **₹27** (Group #)
- FC, Apparel – Shorts @ ₹450 → **₹15** (Group D)
- FC, any category @ ₹501–1,000 → **₹30**
- FC, starred category @ ₹1,500 → **₹75**; non-starred → **₹55**
- Easy Ship @ ₹799 → **₹48**; Self Ship @ ₹1,200 → **₹101**; Seller Flex @ ₹600 → **₹38**

Weight handling:

- FC Standard, Regional, 0.5 kg → **₹39** (+ pick & pack ₹17 = ₹56 fulfilment)
- Easy Ship 3.5 kg → **₹180** (₹112 + ₹34 + ₹34)
- FC 700 g, Regional (book) → **₹54**

These are asserted in the live UI via Playwright after each refresh.

---

## 7. Refresh runbook

1. Re-fetch the master page **and** the fee-schedule page; save the raw output.
2. Extract all image URLs from both; look for new/renamed grids and effective-date banners.
3. Re-run `parse_fees.py` → diff category count and referral bands against
   `amazon-in-rate-card.ts`.
4. Download any **new or changed** images; re-transcribe the affected tables in `amazon-fees.ts`.
5. **Reconcile the fee-schedule page's alternate revisions** (the ⚠️ rows in §2.2) against the
   tables currently in use.
6. Update `RATE_CARD_EFFECTIVE` / `RATE_CARD_VERSION` in `amazon-in-rate-card.ts`
   (and any provenance note text that cites a date).
7. Re-run the §6 oracle checks, then `npm run check`, `npm run lint`, `npm run build`, and the
   Playwright UI pass.

---

## 8. Known gaps

| Gap | Impact | Where to resolve |
| --- | --- | --- |
| FC **local** standard-size weight handling unpublished | Estimated (Regional rate shown) | Seller Central / Fee Preview report |
| **Easy Ship Heavy & Bulky** unpublished | Estimated (standard ES bands shown) | No published table exists |
| Fee-schedule **revised Easy Ship** WHF table not reconciled | Possible stale ES rates | §2.2 image |
| Fee-schedule alternate closing-fee images not reconciled | Possible stale closing values | §2.2 images |
| `parse_fees.py` not committed to the repo | Refresh depends on an external file | Commit it under `scripts/` |
| No automated drift detection | Refresh is manual | Scheduled fetch + diff |
| Login-gated fee schedule / fee-category guidelines never read | Category mapping is label-based, not node-based | Seller Central access |
| Per-account fee overrides (STEP promotions, category overrides) invisible | Rates are the published standard | SP-API or settlement/Fee Preview reports |
| TCS/TDS, returns, reimbursements, actual settlement | Not modelled | Settlement reports |

---

## 9. Provenance labels in the UI

Every computed line carries a badge (`Provenance.kind` in `amazon-fees.ts`):

- **Public** (`verified`) — read literally from Amazon's published rate card.
- **Est.** (`estimate`) — modelled where Amazon publishes images/unlisted bands, or where a
  rate is genuinely unpublished.
- **You** (`input`) — a number the user entered (product cost, courier cost, other fees).

Storage shows **—** until package dimensions are entered, and pick & pack applies to Fulfilment
Centre orders only.

---

## 10. Out of scope

- **IXD (Inbound Cross Dock)** weight handling — an inbound fee, not a per-order selling fee.
- **Other fees** (removal, long-term storage, inbound placement) — not part of the per-unit
  selling-fee estimate.
- **SP-API** — deliberately excluded from this implementation.
