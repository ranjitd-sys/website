import {
  RATE_CARD_CATEGORIES,
  RATE_CARD_EFFECTIVE,
  RATE_CARD_SOURCE,
  RATE_CARD_VERSION,
} from "./amazon-in-rate-card"

export const AMAZON_IN_SOURCES = {
  referral: RATE_CARD_SOURCE,
  feeSchedule: RATE_CARD_SOURCE,
  zones: "https://sell.amazon.in/fees-and-pricing",
  gst: RATE_CARD_SOURCE,
  formula: "https://sell.amazon.in/fees-and-pricing",
  referedDate: RATE_CARD_EFFECTIVE,
  closingDate: "Closing fees effective September 7, 2026",
}

export const FEE_DATA_VERSION = RATE_CARD_VERSION

export const GST_RATE = 0.18
export const STORAGE_PER_CUFT_MONTH = 50
export const VOLUMETRIC_DIVISOR = 5000
export const MIN_CHARGEABLE_KG = 0.5
export const HEAVY_BULKY_KG = 22.5
export const HEAVY_BULKY_MAX_CM = 183
export const HEAVY_BULKY_GIRTH_CM = 300

export const KG_PER_WEIGHT_UNIT: Record<"kg" | "g" | "lb", number> = {
  kg: 1,
  g: 0.001,
  lb: 0.45359237,
}

export const CM_PER_LENGTH_UNIT: Record<"cm" | "in", number> = {
  cm: 1,
  in: 2.54,
}

export const HEAVY_BULKY_CATEGORY_IDS = new Set([
  "television",
  "refrigerators",
  "chimneys",
  "large-furniture-sofa-beds-wardrobes-recliners-living-and-dining-room-chairs-and-tables",
])

export type Zone = "local" | "regional" | "national"
export type ChannelId = "fc" | "easy-ship" | "self-ship" | "seller-flex"

export interface Provenance {
  /** 'verified' = value taken literally from a public Amazon.in datum */
  /** 'estimate' = modelled from Amazon's published worked examples / structure */
  /** 'sp-api' = only derivable at order level via SP-API */
  /** 'input' = a value you entered yourself */
  kind: "verified" | "estimate" | "sp-api" | "input"
  note: string
}

export interface PriceStep {
  /** applies to item price > min (and <= next min when a next step exists) */
  min: number
  pct: number
}

export type FcLowGroup = "#" | "A" | "B"
export type FcMidGroup = "##" | "C" | "D"

export interface FeeCategory {
  id: string
  label: string
  group: string
  fcLow: FcLowGroup | null
  fcMid: FcMidGroup | null
  fcStar: boolean
  referral: PriceStep[]
}

export const CATEGORIES: FeeCategory[] = RATE_CARD_CATEGORIES.map((c) => ({
  id: c.id,
  label: c.label,
  group: c.group,
  fcLow: c.fcLow,
  fcMid: c.fcMid,
  fcStar: c.fcStar,
  referral: c.referral.map((s) => ({ min: s.min, pct: s.pct })),
}))

export function referralFor(category: FeeCategory, price: number): { pct: number; prov: Provenance } {
  const step = [...category.referral].reverse().find((s) => price > s.min) ?? category.referral[0]
  return {
    pct: step.pct,
    prov: {
      kind: "verified",
      note: `Amazon.in referral rate card (${RATE_CARD_EFFECTIVE}) — ${step.pct}% for item price above ₹${step.min} in "${category.label}".`,
    },
  }
}

const VERIFIED_CLOSING_NOTES: Record<string, string> = {
  "#lo": "Fulfilment Centre closing fee, Group #, item price ₹0–300 — ₹27.",
  "#hi": "Fulfilment Centre closing fee, Group #, item price ₹301–500 — ₹23.",
  "Alo": "Fulfilment Centre closing fee, Group A, item price ₹0–300 — ₹21.",
  "Ahi": "Fulfilment Centre closing fee, Group A, item price ₹301–500 — ₹19.",
  "Blo": "Fulfilment Centre closing fee, Group B, item price ₹0–300 — ₹14.",
  "Bhi": "Fulfilment Centre closing fee, Group B, item price ₹301–500 — ₹15.",
  "##hi": "Fulfilment Centre closing fee, Group ##, item price ₹301–500 — ₹23.",
  Chi: "Fulfilment Centre closing fee, Group C, item price ₹301–500 — ₹19.",
  Dhi: "Fulfilment Centre closing fee, Group D, item price ₹301–500 — ₹15.",
  star: "Fulfilment Centre closing fee — ₹75 for items above ₹1,000 in select categories (Chimneys, Refrigerators, Major Appliances – Other, Home Entertainment – Other).",
  unlisted:
    "Category not listed in Amazon's published closing-fee groups; using the Standard track as an estimate.",
  esLow: "Easy Ship closing fee, items ₹0–300 — ₹2 (all categories).",
  esMid: "Easy Ship closing fee, items ₹301–500 — ₹23 (all categories).",
  esHigh: "Easy Ship closing fee, items ₹501–1,000 — ₹48 (all categories).",
  esTop: "Easy Ship closing fee, items above ₹1,000 — ₹79 (all categories).",
  sfLow: "Seller Flex closing fee, items ₹0–300 — ₹7 (all categories).",
  sfMid: "Seller Flex closing fee, items ₹301–500 — ₹13 (all categories).",
  sfHigh: "Seller Flex closing fee, items ₹501–1,000 — ₹38 (all categories).",
  sfTop: "Seller Flex closing fee, items above ₹1,000 — ₹69 (all categories).",
  ssLow: "Self Ship closing fee, items ₹0–300 — ₹20 (all categories).",
  ssMid: "Self Ship closing fee, items ₹301–500 — ₹26 (all categories).",
  ssHigh: "Self Ship closing fee, items ₹501–1,000 — ₹51 (all categories).",
  ssTop: "Self Ship closing fee, items above ₹1,000 — ₹101 (all categories).",
  fcMid1000: "Fulfilment Centre closing fee, items ₹501–1,000 — ₹30 flat, all categories.",
  fcTop: "Fulfilment Centre closing fee, items above ₹1,000 — ₹55 (₹75 for select categories).",
}

const FC_LOW_FEES: Record<FcLowGroup, { fee: number; note: string }> = {
  "#": { fee: 27, note: VERIFIED_CLOSING_NOTES["#lo"] },
  A: { fee: 21, note: VERIFIED_CLOSING_NOTES.Alo },
  B: { fee: 14, note: VERIFIED_CLOSING_NOTES.Blo },
}

const FC_MID_FEES: Record<FcMidGroup, { fee: number; note: string }> = {
  "##": { fee: 23, note: VERIFIED_CLOSING_NOTES["##hi"] },
  C: { fee: 19, note: VERIFIED_CLOSING_NOTES.Chi },
  D: { fee: 15, note: VERIFIED_CLOSING_NOTES.Dhi },
}

interface ClosingBand {
  max: number
  fee: number
  noteKey: keyof typeof VERIFIED_CLOSING_NOTES
}

function closingFromBands(bands: ClosingBand[], price: number): { fee: number; prov: Provenance } {
  const row = bands.find((b) => price <= b.max) ?? bands[bands.length - 1]
  return { fee: row.fee, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES[row.noteKey] } }
}

const ES_CLOSING: ClosingBand[] = [
  { max: 300, fee: 2, noteKey: "esLow" },
  { max: 500, fee: 23, noteKey: "esMid" },
  { max: 1000, fee: 48, noteKey: "esHigh" },
  { max: Infinity, fee: 79, noteKey: "esTop" },
]

const SS_CLOSING: ClosingBand[] = [
  { max: 300, fee: 20, noteKey: "ssLow" },
  { max: 500, fee: 26, noteKey: "ssMid" },
  { max: 1000, fee: 51, noteKey: "ssHigh" },
  { max: Infinity, fee: 101, noteKey: "ssTop" },
]

const SF_CLOSING: ClosingBand[] = [
  { max: 300, fee: 7, noteKey: "sfLow" },
  { max: 500, fee: 13, noteKey: "sfMid" },
  { max: 1000, fee: 38, noteKey: "sfHigh" },
  { max: Infinity, fee: 69, noteKey: "sfTop" },
]

export function closingFor(category: FeeCategory, channel: ChannelId, price: number): { fee: number; prov: Provenance } {
  if (channel === "self-ship") return closingFromBands(SS_CLOSING, price)
  if (channel === "easy-ship") return closingFromBands(ES_CLOSING, price)
  if (channel === "seller-flex") return closingFromBands(SF_CLOSING, price)
  if (price <= 300) {
    if (category.fcLow) {
      const row = FC_LOW_FEES[category.fcLow]
      return { fee: row.fee, prov: { kind: "verified", note: row.note } }
    }
    return { fee: 27, prov: { kind: "estimate", note: VERIFIED_CLOSING_NOTES.unlisted } }
  }
  if (price <= 500) {
    if (category.fcMid) {
      const row = FC_MID_FEES[category.fcMid]
      return { fee: row.fee, prov: { kind: "verified", note: row.note } }
    }
    return { fee: 23, prov: { kind: "estimate", note: VERIFIED_CLOSING_NOTES.unlisted } }
  }
  if (price <= 1000) {
    return { fee: 30, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES.fcMid1000 } }
  }
  if (category.fcStar) {
    return { fee: 75, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES.star } }
  }
  return { fee: 55, prov: { kind: "verified", note: VERIFIED_CLOSING_NOTES.fcTop } }
}

export type StepLevel = "premium" | "standard" | "basic"

export const STEP_LEVELS: Array<{ id: StepLevel; label: string }> = [
  { id: "premium", label: "Premium / Advanced" },
  { id: "standard", label: "Standard" },
  { id: "basic", label: "Basic" },
]

interface WhfBands {
  first500: number
  to1kg: number
  to2kg: number
  after2kg: number
  after5kg: number
}

const WHF_FC: Record<StepLevel, { regional: WhfBands; national: WhfBands }> = {
  premium: {
    regional: { first500: 37, to1kg: 52, to2kg: 76, after2kg: 24, after5kg: 13 },
    national: { first500: 63, to1kg: 83, to2kg: 120, after2kg: 34, after5kg: 18 },
  },
  standard: {
    regional: { first500: 39, to1kg: 54, to2kg: 78, after2kg: 24, after5kg: 13 },
    national: { first500: 65, to1kg: 85, to2kg: 122, after2kg: 34, after5kg: 18 },
  },
  basic: {
    regional: { first500: 42, to1kg: 58, to2kg: 82, after2kg: 24, after5kg: 13 },
    national: { first500: 69, to1kg: 89, to2kg: 126, after2kg: 34, after5kg: 18 },
  },
}

const WHF_FLAT: Record<"easy-ship" | "seller-flex", Record<StepLevel, WhfBands>> = {
  "easy-ship": {
    premium: { first500: 53, to1kg: 73, to2kg: 110, after2kg: 34, after5kg: 18 },
    standard: { first500: 55, to1kg: 75, to2kg: 112, after2kg: 34, after5kg: 18 },
    basic: { first500: 59, to1kg: 79, to2kg: 116, after2kg: 34, after5kg: 18 },
  },
  "seller-flex": {
    premium: { first500: 49, to1kg: 69, to2kg: 106, after2kg: 34, after5kg: 18 },
    standard: { first500: 51, to1kg: 71, to2kg: 108, after2kg: 34, after5kg: 18 },
    basic: { first500: 55, to1kg: 75, to2kg: 112, after2kg: 34, after5kg: 18 },
  },
}

interface WhfHeavyBulky {
  first12: number
  k12to25: number
  above25: number
}

const WHF_HB: Record<"fc" | "seller-flex", Record<StepLevel, Record<Zone, WhfHeavyBulky>>> = {
  fc: {
    premium: {
      local: { first12: 108, k12to25: 6, above25: 5 },
      regional: { first12: 158, k12to25: 10, above25: 6 },
      national: { first12: 298, k12to25: 18, above25: 12 },
    },
    standard: {
      local: { first12: 110, k12to25: 6, above25: 5 },
      regional: { first12: 160, k12to25: 10, above25: 6 },
      national: { first12: 300, k12to25: 18, above25: 12 },
    },
    basic: {
      local: { first12: 114, k12to25: 6, above25: 5 },
      regional: { first12: 164, k12to25: 10, above25: 6 },
      national: { first12: 304, k12to25: 18, above25: 12 },
    },
  },
  "seller-flex": {
    premium: {
      local: { first12: 148, k12to25: 8, above25: 5 },
      regional: { first12: 198, k12to25: 12, above25: 6 },
      national: { first12: 298, k12to25: 18, above25: 12 },
    },
    standard: {
      local: { first12: 150, k12to25: 8, above25: 5 },
      regional: { first12: 200, k12to25: 12, above25: 6 },
      national: { first12: 300, k12to25: 18, above25: 12 },
    },
    basic: {
      local: { first12: 154, k12to25: 8, above25: 5 },
      regional: { first12: 204, k12to25: 12, above25: 6 },
      national: { first12: 304, k12to25: 18, above25: 12 },
    },
  },
}

function whfFromBands(bands: WhfBands, weightKg: number): number {
  if (weightKg <= 0.5) return bands.first500
  if (weightKg <= 1) return bands.to1kg
  if (weightKg <= 2) return bands.to2kg
  let fee = bands.to2kg + Math.min(Math.ceil(weightKg - 2), 3) * bands.after2kg
  if (weightKg > 5) fee += Math.ceil(weightKg - 5) * bands.after5kg
  return fee
}

function whfHeavyBulky(table: WhfHeavyBulky, weightKg: number): number {
  let fee = table.first12
  if (weightKg > 12) fee += Math.min(Math.ceil(weightKg - 12), 13) * table.k12to25
  if (weightKg > 25) fee += Math.ceil(weightKg - 25) * table.above25
  return fee
}

export interface DimsCm {
  l: number
  w: number
  h: number
}

export function volumetricWeightKg(dims: DimsCm): number {
  if (dims.l <= 0 || dims.w <= 0 || dims.h <= 0) return 0
  return (dims.l * dims.w * dims.h) / VOLUMETRIC_DIVISOR
}

export function chargeableWeightKg(actualKg: number, dims?: DimsCm): number {
  const volumetric = dims ? volumetricWeightKg(dims) : 0
  return Math.max(0, actualKg, volumetric)
}

export function chargeableSlabs(weightKg: number): number {
  return Math.max(1, Math.ceil(Math.max(0, weightKg) * 2))
}

export function girthCm(dims: DimsCm): number {
  return dims.l + 2 * (dims.w + dims.h)
}

export function sizeTier(
  categoryId: string,
  actualKg: number,
  dims?: DimsCm,
): { tier: "standard" | "heavy-bulky"; reasons: string[] } {
  const reasons: string[] = []
  if (HEAVY_BULKY_CATEGORY_IDS.has(categoryId)) reasons.push("heavy & bulky category")
  if (actualKg > HEAVY_BULKY_KG) reasons.push(`package over ${HEAVY_BULKY_KG} kg`)
  if (dims && dims.l > 0 && dims.w > 0 && dims.h > 0) {
    if (Math.max(dims.l, dims.w, dims.h) > HEAVY_BULKY_MAX_CM)
      reasons.push(`side over ${HEAVY_BULKY_MAX_CM} cm`)
    if (girthCm(dims) > HEAVY_BULKY_GIRTH_CM) reasons.push(`girth over ${HEAVY_BULKY_GIRTH_CM} cm`)
  }
  return reasons.length > 0 ? { tier: "heavy-bulky", reasons } : { tier: "standard", reasons: [] }
}

export function pickPackFee(
  channel: ChannelId,
  chargeableKg: number,
  tier: "standard" | "heavy-bulky",
): { fee: number; prov: Provenance } {
  if (channel !== "fc") {
    return { fee: 0, prov: { kind: "verified", note: "Pick & pack applies to Fulfilment Centre orders only." } }
  }
  if (tier === "heavy-bulky") {
    return {
      fee: 26,
      prov: { kind: "verified", note: "Pick & Pack fee (Fulfilment Centre): ₹26 per heavy & bulky unit sold." },
    }
  }
  if (chargeableKg <= 1) {
    return {
      fee: 17,
      prov: { kind: "verified", note: "Pick & Pack fee (Fulfilment Centre): ₹17 per standard unit up to 1 kg." },
    }
  }
  if (chargeableKg <= 5) {
    const fee = 17 + 5 * Math.ceil(chargeableKg - 1)
    return {
      fee,
      prov: {
        kind: "verified",
        note: `Pick & Pack fee (Fulfilment Centre): ₹17 up to 1 kg + ₹5 per additional kg to 5 kg — ₹${fee} at ${chargeableKg.toFixed(2)} kg chargeable.`,
      },
    }
  }
  const fee = 37 + 2 * Math.ceil((chargeableKg - 5) / 5)
  return {
    fee,
    prov: {
      kind: "verified",
      note: `Pick & Pack fee (Fulfilment Centre): ₹37 to 5 kg + ₹2 per additional 5 kg — ₹${fee} at ${chargeableKg.toFixed(2)} kg chargeable.`,
    },
  }
}

const WHF_NOTE =
  "Weight handling from Amazon's published rate card (effective March 16, 2026). Billed on chargeable weight: higher of actual and volumetric (L×W×H/5000), minimum 500 g."

export function weightHandlingFor(
  channel: ChannelId,
  chargeableKg: number,
  zone: Zone,
  step: StepLevel = "standard",
  tier: "standard" | "heavy-bulky" = "standard",
): { fee: number; prov: Provenance } {
  if (channel === "self-ship") {
    return { fee: 0, prov: { kind: "verified", note: "Self Ship — no weight handling fee; the seller bears its own shipping cost." } }
  }
  const stepLabel = STEP_LEVELS.find((s) => s.id === step)?.label ?? "Standard"
  if (tier === "heavy-bulky" && (channel === "fc" || channel === "seller-flex")) {
    const table = WHF_HB[channel][step][zone]
    const fee = whfHeavyBulky(table, chargeableKg)
    return {
      fee,
      prov: {
        kind: "verified",
        note: `${channel === "fc" ? "FC" : "Seller Flex"} Heavy & Bulky, ${stepLabel} STEP, ${zone} — ₹${table.first12} first 12 kg, +₹${table.k12to25}/kg to 25 kg, +₹${table.above25}/kg after. ${WHF_NOTE}`,
      },
    }
  }
  if (tier === "heavy-bulky") {
    const bands = WHF_FLAT["easy-ship"][step]
    return {
      fee: whfFromBands(bands, chargeableKg),
      prov: {
        kind: "estimate",
        note: `Heavy & bulky Easy Ship rates are unpublished; showing standard Easy Ship bands (${stepLabel} STEP) as an estimate. ${WHF_NOTE}`,
      },
    }
  }
  if (channel === "fc") {
    if (zone === "local") {
      const fee = whfFromBands(WHF_FC[step].regional, chargeableKg)
      return {
        fee,
        prov: {
          kind: "estimate",
          note: `Local FC rates for standard sizes are unpublished; showing the Regional ${stepLabel} STEP rate as an estimate. ${WHF_NOTE}`,
        },
      }
    }
    const fee = whfFromBands(WHF_FC[step][zone], chargeableKg)
    return {
      fee,
      prov: { kind: "verified", note: `FC weight handling, ${stepLabel} STEP, ${zone} — ${chargeableSlabs(chargeableKg)} × 500 g slabs. ${WHF_NOTE}` },
    }
  }
  const fee = whfFromBands(WHF_FLAT[channel][step], chargeableKg)
  return {
    fee,
    prov: {
      kind: "verified",
      note: `${channel === "easy-ship" ? "Easy Ship" : "Seller Flex"} weight handling is a flat fee — ${stepLabel} STEP, ${chargeableSlabs(chargeableKg)} × 500 g slabs. ${WHF_NOTE}`,
    },
  }
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
    name: "Merchant Fulfilment",
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
  /** seller STEP level (weight-handling rates) */
  step?: StepLevel
  /** your own extra costs per order: promotions, deal fees */
  otherCosts?: number
  /** average inventory units stored (storage allocation) */
  avgInventory?: number
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
  packageRead: PackageRead
}

export interface PackageRead {
  volumetricKg: number
  chargeableKg: number
  slabs: number
  tier: "standard" | "heavy-bulky"
  tierReasons: string[]
  pickPack: number
  cubicFeet: number
}

const r2 = (n: number) => Math.round(n * 100) / 100

export function estimateChannel(input: FeeEstimate, channel: ChannelId): ChannelEstimate {
  const { sellingPrice, category, weightKg, zone, productCost, unitsPerMonth, shippingCharge = 0, selfShipCost = 0, dimensions, includeGst = false, step = "standard", otherCosts = 0, avgInventory = 1 } = input
  const meta = OPTIONS.find((o) => o.id === channel) ?? OPTIONS[0]

  const isSelf = channel === "self-ship"
  const ship = isSelf ? shippingCharge : 0
  const salesPrice = sellingPrice + ship

  const ref = referralFor(category, sellingPrice)
  const referralAmt = r2((sellingPrice * ref.pct) / 100)
  const close = closingFor(category, channel, salesPrice)

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
    prov: { kind: "verified", note: "₹0 for most categories on Amazon.in; assumed zero here." },
  }

  const chargeableKg = chargeableWeightKg(weightKg, dimensions)
  const tier = sizeTier(category.id, weightKg, dimensions)
  const whf = weightHandlingFor(channel, chargeableKg, zone, step, tier.tier)
  const pick = pickPackFee(channel, chargeableKg, tier.tier)
  let fulfilment: FeeLine
  if (isSelf) {
    fulfilment = {
      id: "fulfilment",
      label: "Your shipping cost",
      amount: selfShipCost,
      prov: { kind: "input", note: "Your own courier cost — you entered this. Amazon does not charge weight handling on Self Ship." },
    }
  } else {
    fulfilment = {
      id: "fulfilment",
      label: channel === "fc" ? "Fulfilment cost" : "Weight handling",
      amount: r2(whf.fee + pick.fee),
      prov: whf.prov,
      hint:
        channel === "fc"
          ? `Weight handling (${chargeableSlabs(chargeableKg)} × 500 g) + pick & pack ₹${pick.fee}`
          : `Weight handling (${chargeableSlabs(chargeableKg)} × 500 g)`,
    }
  }

  const hasDims = dimensions && dimensions.l > 0 && dimensions.w > 0 && dimensions.h > 0
  const cuft = hasDims ? (dimensions.l * dimensions.w * dimensions.h) / 28316.8 : 0
  let storage: FeeLine
  if (channel === "fc" || channel === "seller-flex") {
    if (hasDims) {
      const perUnit = unitsPerMonth > 0 ? (cuft * STORAGE_PER_CUFT_MONTH * Math.max(0, avgInventory)) / unitsPerMonth : 0
      storage = {
        id: "storage",
        label: "Storage / unit sold",
        amount: r2(perUnit),
        prov: { kind: "estimate", note: `₹${STORAGE_PER_CUFT_MONTH}/cu ft/month × ${cuft.toFixed(2)} cu ft × ${avgInventory} avg units ÷ ${unitsPerMonth} sold = ₹${r2(perUnit)} per unit sold. Amazon bills monthly storage on average inventory.` },
      }
    } else {  
      storage = {
        id: "storage",
        label: "Storage cost",
        amount: null,
        prov: { kind: "estimate", note: "Enter package dimensions to estimate FC storage (₹50/cu ft/month on average inventory)." },
      }
    }
  } else {
    storage = { id: "storage", label: "Storage cost", amount: 0, prov: { kind: "verified", note: "No Amazon storage fee on this channel." } }
  }

  const otherFees: FeeLine = {
    id: "other",
    label: "Other fees & promotions",
    amount: r2(Math.max(0, otherCosts)),
    prov: { kind: "input", note: "Your own extra costs per order — promotions, deal fees, packaging extras. You entered this." },
  }

  const base = r2(referralAmt + close.fee + (fulfilment.amount ?? 0) + (storage.amount ?? 0) + (otherFees.amount ?? 0))
  const gstOnFees: FeeLine | null = includeGst
    ? { id: "gst", label: "GST on fees (18%)", amount: r2(base * GST_RATE), prov: { kind: "verified", note: "Amazon applies 18% GST to all fees displayed." } }
    : null

  const costPerUnit = r2(base + (gstOnFees?.amount ?? 0))
  const netProceeds = r2(salesPrice - costPerUnit)
  const profit = r2(netProceeds - productCost)
  const marginPct = salesPrice > 0 ? (profit / salesPrice) * 100 : 0

  const packageRead: PackageRead = {
    volumetricKg: r2(hasDims ? volumetricWeightKg(dimensions) : 0),
    chargeableKg: r2(chargeableKg),
    slabs: chargeableSlabs(chargeableKg),
    tier: tier.tier,
    tierReasons: tier.reasons,
    pickPack: pick.fee,
    cubicFeet: r2(hasDims ? (dimensions.l * dimensions.w * dimensions.h) / 28316.8 : 0),
  }

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
    packageRead,
  }
}

export function estimateComparison(input: FeeEstimate, channels: ChannelId[]): ChannelEstimate[] {
  return channels.map((c) => estimateChannel(input, c))
}