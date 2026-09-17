export const AMAZON_IN_SOURCES = {
  referral: "https://sell.amazon.in/fees-and-pricing/fee-schedule",
  feeSchedule: "https://sell.amazon.in/fees-and-pricing/fee-schedule",
  zones: "https://sell.amazon.in/fees-and-pricing",
  gst: "https://sell.amazon.in/fees-and-pricing/fee-schedule",
  formula: "https://sell.amazon.in/fees-and-pricing",
  referedDate: "Effective new referral fee rate card",
  closingDate: "Closing fees effective September 7, 2026",
}

export const GST_RATE = 0.18
export const STORAGE_PER_CUFT_MONTH = 50
export const PICK_PACK_FEE = 17

export type Zone = "local" | "regional" | "national"
export type ChannelId = "fc" | "easy-ship" | "self-ship" | "seller-flex"

export interface Provenance {
  /** 'verified' = value taken literally from a public Amazon.in datum */
  /** 'estimate' = modelled from Amazon's published worked examples / structure */
  /** 'sp-api' = only derivable at order level via SP-API */
  kind: "verified" | "estimate" | "sp-api"
  note: string
}

export interface PriceStep {
  /** applies to item price > min (and <= next min when a next step exists) */
  min: number
  pct: number
}

export interface FeeCategory {
  id: string
  label: string
  /** fulfilment-centre closing-fee column letter */
  fc: "#" | "A" | "B"
  referral: PriceStep[]
}

export const CATEGORIES: FeeCategory[] = [
  { id: "mobile-phones", label: "Mobile Phones", fc: "A", referral: [{ min: 0, pct: 5 }] },
  { id: "laptops", label: "Laptops", fc: "A", referral: [{ min: 0, pct: 6 }] },
  { id: "desktops", label: "Desktops", fc: "A", referral: [{ min: 0, pct: 8 }] },
  { id: "television", label: "Television", fc: "#", referral: [{ min: 0, pct: 6 }] },
  { id: "tablets", label: "Tablets", fc: "A", referral: [{ min: 0, pct: 6 }, { min: 12000, pct: 10 }] },
  { id: "headphones", label: "Headphones & Earphones", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 18 }] },
  { id: "smart-watches", label: "Smart Watches", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 300, pct: 5 }, { min: 1000, pct: 17 }] },
  { id: "power-banks", label: "Power Banks & Chargers", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 20.5 }] },
  { id: "cases-covers", label: "Cases, Covers & Screen Guards", fc: "A", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 25 }] },
  { id: "cables-adapters", label: "Cables & Adapters", fc: "B", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 20 }] },
  { id: "speakers", label: "Speakers", fc: "#", referral: [{ min: 0, pct: 11 }, { min: 500, pct: 11.5 }, { min: 1000, pct: 14 }] },
  { id: "keyboards-mice", label: "Keyboards & Mouse", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 300, pct: 5 }, { min: 1000, pct: 17 }] },
  { id: "hard-disks", label: "Hard Disks", fc: "#", referral: [{ min: 0, pct: 9.5 }, { min: 1000, pct: 12.5 }] },
  { id: "memory-cards", label: "Memory Cards", fc: "#", referral: [{ min: 0, pct: 16 }, { min: 500, pct: 5 }, { min: 1000, pct: 16 }] },
  { id: "monitors", label: "Monitors", fc: "A", referral: [{ min: 0, pct: 6.5 }, { min: 1000, pct: 8 }] },
  { id: "cameras", label: "Camera & Camcorder", fc: "#", referral: [{ min: 0, pct: 5 }, { min: 1000, pct: 7 }, { min: 19000, pct: 9 }, { min: 49000, pct: 7 }] },
  { id: "electronic-devices", label: "Electronic Devices (other)", fc: "#", referral: [{ min: 0, pct: 9 }, { min: 1000, pct: 11 }] },
  { id: "books", label: "Books", fc: "B", referral: [{ min: 0, pct: 0 }, { min: 250, pct: 2 }, { min: 500, pct: 4 }, { min: 1000, pct: 13.5 }] },
  { id: "movies", label: "Movies", fc: "#", referral: [{ min: 0, pct: 6.5 }, { min: 500, pct: 0 }, { min: 1000, pct: 6.5 }] },
  { id: "music", label: "Music", fc: "#", referral: [{ min: 0, pct: 6.5 }, { min: 500, pct: 0 }, { min: 1000, pct: 6.5 }] },
  { id: "videogame-consoles", label: "Video Game Consoles", fc: "#", referral: [{ min: 0, pct: 7 }, { min: 500, pct: 5 }, { min: 1000, pct: 9 }] },
  { id: "videogame-accessories", label: "Video Game Accessories", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 300, pct: 5 }, { min: 1000, pct: 13.5 }] },
  { id: "shoes", label: "Shoes", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 8 }] },
  { id: "kids-shoes", label: "Kids Shoes", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 16 }] },
  { id: "flip-flops", label: "Flip Flops & Slippers", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 15 }] },
  { id: "apparel-tshirts", label: "Apparel — Men's T-shirts", fc: "A", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 23 }] },
  { id: "apparel-shirts", label: "Apparel — Shirts", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 21 }] },
  { id: "apparel-ethnic", label: "Apparel — Ethnic Wear", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 16.5 }] },
  { id: "apparel-sarees", label: "Apparel — Sarees & Dress Materials", fc: "B", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 15 }] },
  { id: "apparel-pants", label: "Apparel — Pants & Jeans", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 19 }] },
  { id: "apparel-shorts", label: "Apparel — Shorts", fc: "A", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 24 }] },
  { id: "apparel-baby", label: "Apparel — Baby", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 7 }] },
  { id: "apparel-jackets", label: "Apparel — Sweatshirts & Jackets", fc: "A", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 18 }] },
  { id: "apparel-innerwear", label: "Apparel — Innerwear", fc: "A", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 18.5 }] },
  { id: "watches", label: "Watches", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 15 }] },
  { id: "eyewear", label: "Eyewear", fc: "A", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 18.5 }] },
  { id: "handbags", label: "Handbags", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 12 }] },
  { id: "backpacks", label: "Backpacks", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 14.5 }] },
  { id: "wallets", label: "Wallets", fc: "B", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 14 }] },
  { id: "fashion-jewellery", label: "Fashion Jewellery", fc: "B", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 22.5 }] },
  { id: "luggage", label: "Luggage — Suitcases & Trolleys", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 5.5 }] },
  { id: "baby-diapers", label: "Baby — Diapers", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 9.5 }] },
  { id: "baby-hardlines", label: "Baby Hardlines", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 6.5 }] },
  { id: "toys-drones", label: "Toys — Drones", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 30 }] },
  { id: "toys-games", label: "Toys — Games & Puzzles", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 12.5 }] },
  { id: "toys-plush", label: "Toys — Plush & Action Figures", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 10.5 }] },
  { id: "toys-outdoor", label: "Toys — Outdoor & Sports", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 10.5 }] },
  { id: "grocery-herbs", label: "Grocery — Herbs & Spices", fc: "B", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 8 }] },
  { id: "grocery-dryfruits", label: "Grocery — Dried Fruits & Nuts", fc: "B", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 9 }] },
  { id: "grocery-beverages", label: "Grocery — Beverages", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 10 }] },
  { id: "grocery-oils", label: "Grocery — Oils", fc: "B", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 5 }] },
  { id: "beauty-makeup", label: "Beauty — Makeup", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 7 }] },
  { id: "beauty-haircare", label: "Beauty — Haircare & Bath", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 8 }] },
  { id: "beauty-fragrance", label: "Beauty — Fragrance", fc: "A", referral: [{ min: 0, pct: 0 }, { min: 500, pct: 14 }, { min: 1000, pct: 10 }] },
  { id: "personal-care-grooming", label: "Personal Care — Grooming & Styling", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 9.5 }] },
  { id: "face-wash", label: "Personal Care — Face Wash", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 500, pct: 9 }, { min: 1000, pct: 9.5 }] },
  { id: "office-supplies", label: "Office Products — Office Supplies", fc: "A", referral: [{ min: 0, pct: 0 }, { min: 1000, pct: 13 }] },
  { id: "pet-food", label: "Pet Food", fc: "#", referral: [{ min: 0, pct: 0 }, { min: 300, pct: 6.5 }, { min: 1000, pct: 9.5 }] },
]

export function referralFor(category: FeeCategory, price: number): { pct: number; prov: Provenance } {
  const step = [...category.referral].reverse().find((s) => price >= s.min) ?? category.referral[0]
  return {
    pct: step.pct,
    prov: {
      kind: "verified",
      note: `Amazon.in ${AMAZON_IN_SOURCES.referedDate} referral rate card — ${step.pct}% for item price above ₹${step.min} in "${category.label}".`,
    },
  }
}

export interface ClosingChart {
  column: string
  bands: Array<{ max: number; fee: number; prov: Provenance }>
}

const VERIFIED_CLOSING_NOTES: Record<string, string> = {
  "#lo": "Fulfilment Centre closing fee, Group #, item price ₹0–300 — ₹27.",
  "#hi": "Fulfilment Centre closing fee, Group #, item price ₹301–500 — ₹23.",
  "Alo": "Fulfilment Centre closing fee, Group A, item price ₹0–300 — ₹21.",
  "Ahi": "Fulfilment Centre closing fee, Group A, item price ₹301–500 — ₹19.",
  "Blo": "Fulfilment Centre closing fee, Group B, item price ₹0–300 — ₹14.",
  "Bhi": "Fulfilment Centre closing fee, Group B, item price ₹301–500 — ₹15.",
  esLow: "Easy Ship closing fee, item ≤ ₹300, after the published ₹5 reduction — ₹2.",
  esMid: "Easy Ship closing fee, item ₹301–500 — ₹23.",
  sfLow: "Seller Flex closing fee example for a ₹299 item — ₹7.",
  sfMid: "Seller Flex closing fee example for a ₹499 item — ₹13.",
  ssLow: "Self Ship closing fee, items under ₹300 — ₹20 (reduced from ₹45).",
  ssMid: "Self Ship closing fee, items ₹300–500 — ₹26 (reduced from ₹35).",
}

const EST_NOTE =
  "Closing fee grids publish as images on Amazon's rate card; per-order values above the verified bands are modelled. Exact fees (incl. account fee overrides) require SP-API."

/** FC per column: verified bands then estimate continuation above ₹500. */
export const FC_CLOSING: Record<string, ClosingChart> = {
  "#": {
    column: "#",
    bands: [
      { max: 300, fee: 27, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES["#lo"] } },
      { max: 500, fee: 23, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES["#hi"] } },
      { max: 1000, fee: 26, prov: { kind: "estimate", note: EST_NOTE } },
      { max: 2000, fee: 35, prov: { kind: "estimate", note: EST_NOTE } },
      { max: 5000, fee: 45, prov: { kind: "estimate", note: EST_NOTE } },
      { max: 10000, fee: 60, prov: { kind: "estimate", note: EST_NOTE } },
      { max: Infinity, fee: 75, prov: { kind: "estimate", note: EST_NOTE } },
    ],
  },
  A: {
    column: "A",
    bands: [
      { max: 300, fee: 21, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES.Alo } },
      { max: 500, fee: 19, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES.Ahi } },
      { max: 1000, fee: 22, prov: { kind: "estimate", note: EST_NOTE } },
      { max: 2000, fee: 30, prov: { kind: "estimate", note: EST_NOTE } },
      { max: 5000, fee: 40, prov: { kind: "estimate", note: EST_NOTE } },
      { max: 10000, fee: 55, prov: { kind: "estimate", note: EST_NOTE } },
      { max: Infinity, fee: 70, prov: { kind: "estimate", note: EST_NOTE } },
    ],
  },
  B: {
    column: "B",
    bands: [
      { max: 300, fee: 14, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES.Blo } },
      { max: 500, fee: 15, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES.Bhi } },
      { max: 1000, fee: 18, prov: { kind: "estimate", note: EST_NOTE } },
      { max: 2000, fee: 25, prov: { kind: "estimate", note: EST_NOTE } },
      { max: 5000, fee: 32, prov: { kind: "estimate", note: EST_NOTE } },
      { max: 10000, fee: 40, prov: { kind: "estimate", note: EST_NOTE } },
      { max: Infinity, fee: 50, prov: { kind: "estimate", note: EST_NOTE } },
    ],
  },
}

export function closingFor(category: FeeCategory, channel: ChannelId, price: number): { fee: number; prov: Provenance } {
  if (channel === "self-ship") {
    const fee = price <= 300 ? 20 : 26
    return { fee, prov: { kind: "verified", note: price <= 300 ? VERIFIED_CLOSING_NOTES.ssLow : VERIFIED_CLOSING_NOTES.ssMid } }
  }
  if (channel === "easy-ship") {
    if (price <= 300) return { fee: 2, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES.esLow } }
    if (price <= 500) return { fee: 23, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES.esMid } }
    return { fee: 25 + Math.ceil((price - 500) / 500) * 2, prov: { kind: "estimate", note: EST_NOTE } }
  }
  if (channel === "seller-flex") {
    const fee = price <= 300 ? 7 : 13
    return { fee, prov: { kind: "verified", note: price <= 300 ? VERIFIED_CLOSING_NOTES.sfLow : VERIFIED_CLOSING_NOTES.sfMid } }
  }
  const chart = FC_CLOSING[category.fc]
  const row = chart.bands.find((b) => price <= b.max) ?? chart.bands[chart.bands.length - 1]
  return { fee: row.fee, prov: row.prov }
}

const WHF_ZONE_FACTOR: Record<Zone, number> = { local: 0.882, regional: 1, national: 1.176 }

export function weightHandlingFor(channel: ChannelId, weightKg: number, zone: Zone): { fee: number; prov: Provenance } {
  if (channel === "self-ship") {
    return { fee: 0, prov: { kind: "verified", note: "Self Ship — no weight handling fee; the seller bears its own shipping cost." } }
  }
  const factor = WHF_ZONE_FACTOR[zone]
  let fee: number
  let note: string
  if (weightKg <= 0.5) {
    fee = Math.round((channel === "fc" ? 37 : 55) * factor)
    note = channel === "fc"
      ? "FC shipping example: 700 g book, Regional — ₹54 (first 500 g ₹37 + next 500 g ₹17), scaled for this weight/zone."
      : "Easy Ship shipping example: 350 g — flat ₹55, scaled for zone."
  } else {
    const slabs = Math.ceil(weightKg * 2)
    const first = channel === "fc" ? 37 : 51
    const per = 17
    fee = Math.round((first + (slabs - 1) * per) * factor)
    note = `Weight handling per 500 g — ₹${first} for first 500 g, +₹${per} per additional 500 g, scaled for zone. Basis: 800 g Easy Ship Regional = ₹51 + ₹17 = ₹68.`
  }
  return { fee, prov: { kind: "estimate", note } }
}

export interface OptionMeta {
  id: ChannelId
  name: string
  short: string
  blurb: string
  bullets: string[]
}

export const OPTIONS: OptionMeta[] = [
  {
    id: "fc",
    name: "Amazon Fulfilment",
    short: "FBA",
    blurb: "Fulfilment by Amazon (FBA)",
    bullets: [
      "Products eligible for Amazon Prime",
      "Amazon handles pick, pack, ship and returns",
      "Scale quickly without your own warehouse",
      "Cost-effective fulfilment rates",
    ],
  },
  {
    id: "easy-ship",
    name: "Easy Ship",
    short: "Easy Ship",
    blurb: "You pack; Amazon picks up and delivers",
    bullets: [
      "Amazon picks up from your location",
      "Amazon delivers to the customer",
      "Faster delivery promises",
      "Weight handling fee applies",
    ],
  },
  {
    id: "self-ship",
    name: "Your Fulfilment",
    short: "Self Ship",
    blurb: "You pack and ship via your own courier",
    bullets: [
      "No Amazon weight handling fee",
      "You control your delivery cost and SLA",
      "Ship with any courier partner",
      "Lower closing fee for low-price items",
    ],
  },
  {
    id: "seller-flex",
    name: "Seller Flex",
    short: "Seller Flex",
    blurb: "Invite-only; ship from your own warehouse",
    bullets: [
      "Fulfil orders directly from your warehouse",
      "Selection stays Prime ready",
      "Amazon pickup from your location",
      "FBA-style rates apply",
    ],
  },
]

export const ZONES: Array<{ id: Zone; label: string }> = [
  { id: "local", label: "Local" },
  { id: "regional", label: "Regional" },
  { id: "national", label: "National" },
]

export interface FeeEstimate {
  sellingPrice: number
  category: FeeCategory
  weightKg: number
  zone: Zone
  productCost: number
  unitsPerMonth: number
  /** self-ship only: shipping charged to the buyer */
  shippingCharge?: number
  /** self-ship only: your own courier cost per order */
  selfShipCost?: number
  /** optional packed dimensions, used to estimate FC storage */
  dimensions?: { l: number; w: number; h: number }
  includeGst?: boolean
}

export interface FeeLine {
  id: string
  label: string
  amount: number | null
  prov: Provenance
  hint?: string
}

export interface ChannelEstimate {
  channel: ChannelId
  meta: OptionMeta
  itemPrice: number
  shippingCharge: number
  salesPrice: number
  referral: FeeLine
  closing: FeeLine
  variableClosing: FeeLine
  amazonFees: number
  fulfilment: FeeLine
  storage: FeeLine
  otherFees: FeeLine
  gstOnFees: FeeLine | null
  costPerUnit: number
  netProceeds: number
  productCost: number
  profit: number
  marginPct: number
  estimatedSales30: number
  includeGst: boolean
}

const r2 = (n: number) => Math.round(n * 100) / 100

const SP_API_LINE = (label: string, note: string): FeeLine => ({
  id: label.toLowerCase().replace(/[^a-z]+/g, "-"),
  label,
  amount: null,
  prov: { kind: "sp-api", note },
})

export function estimateChannel(input: FeeEstimate, channel: ChannelId): ChannelEstimate {
  const { sellingPrice, category, weightKg, zone, productCost, unitsPerMonth, shippingCharge = 0, selfShipCost = 0, dimensions, includeGst = false } = input
  const meta = OPTIONS.find((o) => o.id === channel) ?? OPTIONS[0]

  const isSelf = channel === "self-ship"
  const ship = isSelf ? shippingCharge : 0
  const salesPrice = sellingPrice + ship

  const ref = referralFor(category, sellingPrice)
  const referralAmt = r2((sellingPrice * ref.pct) / 100)
  const close = closingFor(category, channel, sellingPrice)

  const referral: FeeLine = {
    id: "referral",
    label: "Referral fee",
    amount: referralAmt,
    prov: ref.prov,
    hint: `${ref.pct}% of item price`,
  }
  const closing: FeeLine = { id: "closing", label: "Closing fee", amount: close.fee, prov: close.prov, hint: channel }
  const variableClosing: FeeLine = {
    id: "variable-closing",
    label: "Variable closing fee",
    amount: 0,
    prov: { kind: "verified", note: "₹0 for most categories; media categories may carry a variable closing fee — exact value via SP-API." },
  }

  const whf = weightHandlingFor(channel, weightKg, zone)
  let fulfilment: FeeLine
  if (isSelf) {
    fulfilment = {
      id: "fulfilment",
      label: "Your shipping cost",
      amount: selfShipCost,
      prov: { kind: "estimate", note: "Your own courier cost — you control this, Amazon does not charge weight handling on Self Ship." },
    }
  } else {
    const pick = channel === "fc" ? PICK_PACK_FEE : 0
    fulfilment = {
      id: "fulfilment",
      label: channel === "fc" ? "Fulfilment cost" : "Weight handling",
      amount: r2(whf.fee + pick),
      prov: whf.prov,
      hint: pick ? "Weight handling + ₹17 pick & pack" : "Weight handling",
    }
  }

  let storage: FeeLine
  if (channel === "fc" || channel === "seller-flex") {
    if (dimensions && dimensions.l > 0 && dimensions.w > 0 && dimensions.h > 0) {
      const cuft = (dimensions.l * dimensions.w * dimensions.h) / 28316.8
      storage = {
        id: "storage",
        label: "Storage (monthly)",
        amount: r2(cuft * STORAGE_PER_CUFT_MONTH),
        prov: { kind: "estimate", note: `₹${STORAGE_PER_CUFT_MONTH}/cu ft/month × ${cuft.toFixed(2)} cu ft — per unit stored. Actual storage is billed on average inventory.` },
      }
    } else {
      storage = SP_API_LINE("Storage cost", "FC storage is ₹50/cu ft/month on average inventory — needs your inventory data (SP-API).")
    }
  } else {
    storage = { id: "storage", label: "Storage cost", amount: 0, prov: { kind: "verified", note: "No Amazon storage fee on this channel." } }
  }

  const otherFees = SP_API_LINE(
    "Other fees, discounts, taxes",
    "Promotions, deal fees, reimbursements and account-level adjustments appear only in your order/settlement data (SP-API).",
  )

  const base = r2(referralAmt + close.fee + (fulfilment.amount ?? 0) + (storage.amount ?? 0))
  const gstOnFees: FeeLine | null = includeGst
    ? { id: "gst", label: "GST on fees (18%)", amount: r2(base * GST_RATE), prov: { kind: "verified", note: "Amazon applies 18% GST to all fees displayed." } }
    : null

  const costPerUnit = r2(base + (gstOnFees?.amount ?? 0))
  const netProceeds = r2(salesPrice - costPerUnit)
  const profit = r2(netProceeds - productCost)
  const marginPct = salesPrice > 0 ? (profit / salesPrice) * 100 : 0

  return {
    channel,
    meta,
    itemPrice: sellingPrice,
    shippingCharge: ship,
    salesPrice,
    referral,
    closing,
    variableClosing,
    amazonFees: r2(referralAmt + close.fee),
    fulfilment,
    storage,
    otherFees,
    gstOnFees,
    costPerUnit,
    netProceeds,
    productCost,
    profit,
    marginPct,
    estimatedSales30: unitsPerMonth,
    includeGst,
  }
}

export function estimateComparison(input: FeeEstimate, channels: ChannelId[]): ChannelEstimate[] {
  return channels.map((c) => estimateChannel(input, c))
}

export interface SpApiRow {
  data: string
  now: string
  spApi: string
  cost: "free-schedule" | "sp-api"
}

export const SP_API_GAP: SpApiRow[] = [
  {
    data: "Referral fee %",
    now: "Public category rate card",
    spApi: "Category & node-level rate for your exact ASIN",
    cost: "free-schedule",
  },
  {
    data: "Closing fee",
    now: "Band estimate from public rate card",
    spApi: "Actual per-order closing fee",
    cost: "sp-api",
  },
  {
    data: "Weight handling fee",
    now: "Estimate from published examples",
    spApi: "Order-level shipping fee (actual weight / zone)",
    cost: "sp-api",
  },
  {
    data: "Storage / removal / inbound",
    now: "₹50/cu ft/month published; needs inventory",
    spApi: "Storage, removal and inbound fees via fee reports",
    cost: "sp-api",
  },
  {
    data: "Account-specific fee overrides",
    now: "Not visible",
    spApi: "Program-level fee waivers and STEP level",
    cost: "sp-api",
  },
  {
    data: "Promotions, deal fees, reimbursements",
    now: "Not visible",
    spApi: "Per-order transaction events (Finances API)",
    cost: "sp-api",
  },
  {
    data: "TCS on sales (1%) / TDS",
    now: "Statutory, not order-specific",
    spApi: "TCS/TDS amounts in your settlement report",
    cost: "sp-api",
  },
  {
    data: "Actual settlement to bank",
    now: "Derived estimate",
    spApi: "V2 settlement report — actual payout per order",
    cost: "sp-api",
  },
]

export interface SampleProduct {
  asin: string
  name: string
  categoryId: string
  price: number
  weightKg: number
  dims: { l: number; w: number; h: number }
  demo: true
}

export const SAMPLE_CATALOGUE: SampleProduct[] = [
  { asin: "B0D1EMO111", name: "Aurora X5 Smartphone, 128GB, 5G", categoryId: "mobile-phones", price: 12999, weightKg: 0.4, dims: { l: 16, w: 8, h: 6 }, demo: true },
  { asin: "B0D2EMO222", name: "Trailblazer Running Shoes, UK 9", categoryId: "shoes", price: 1899, weightKg: 0.9, dims: { l: 32, w: 20, h: 12 }, demo: true },
  { asin: "B0D3EMO333", name: "Modern Indian Cooking — Hardcover", categoryId: "books", price: 499, weightKg: 0.7, dims: { l: 24, w: 18, h: 4 }, demo: true },
  { asin: "B0D4EMO444", name: "Premium Almonds, 1kg Pack", categoryId: "grocery-dryfruits", price: 899, weightKg: 1.1, dims: { l: 22, w: 15, h: 10 }, demo: true },
  { asin: "B0D5EMO555", name: "Herbal Matte Lipstick Set of 4", categoryId: "beauty-makeup", price: 649, weightKg: 0.2, dims: { l: 12, w: 8, h: 5 }, demo: true },
  { asin: "B0D6EMO666", name: "BuildPro 500-pc Construction Set", categoryId: "toys-games", price: 1499, weightKg: 1.4, dims: { l: 38, w: 26, h: 14 }, demo: true },
]