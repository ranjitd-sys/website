export type PlanId =
  | "beginner"
  | "emerging"
  | "scaling"
  | "established"
  | "high-volume"
  | "power"
  | "enterprise"
export type BillingCycleId = "quarterly" | "halfYearly" | "yearly"

export interface BillingCycle {
  id: BillingCycleId
  /** Short control label, e.g. "Quarterly" */
  label: string
  /** Full plan-option label, e.g. "Quarterly Plan" */
  planLabel: string
  /** Billing period in months (only used for verified amounts) */
  months: number
}

export const BILLING_CYCLES: BillingCycle[] = [
  { id: "quarterly", label: "Quarterly", planLabel: "Quarterly Plan", months: 3 },
  { id: "halfYearly", label: "Half-Yearly", planLabel: "Half-Yearly Plan", months: 6 },
  { id: "yearly", label: "Yearly", planLabel: "Yearly Plan", months: 12 },
]

export interface Plan {
  id: PlanId
  name: string
  /** Monthly price — always shown (verified). null for custom/enterprise plans. */
  monthly: number | null
  /** Human order-volume line, e.g. "Up to 500 orders/month" */
  volume: string
  /** Billed amounts per cycle. Only cycles present in the source carry a value. */
  billed: Partial<Record<BillingCycleId, number>>
  features: string[]
  /** Editorial guidance line shown in the plan-guidance section */
  tagline: string
  /** Marks plans priced by conversation instead of a fixed monthly rate */
  custom?: boolean
}

export const PLANS: Plan[] = [
  {
    id: "beginner",
    name: "Beginner Seller",
    monthly: 1000,
    volume: "Up to 500 orders/month",
    billed: { quarterly: 3000 },
    features: [
      "Up to 500 Orders/Month",
      "2 Marketplace",
      "1 GST No.",
      "Tally Sync",
      "Reports",
    ],
    tagline: "For sellers getting started with structured ecommerce reporting and accounting.",
  },
  {
    id: "emerging",
    name: "Emerging Seller",
    monthly: 2000,
    volume: "Up to 1,000 orders/month",
    billed: { quarterly: 6000 },
    features: [
      "Up to 1000 Orders/Month",
      "4 Marketplace",
      "2 or more GST No.",
      "Tally Sync",
      "Reports",
      "Data Insights",
      "Profit Tracking",
    ],
    tagline: "For growing sellers managing more marketplaces and deeper financial visibility.",
  },
  {
    id: "scaling",
    name: "Scaling Seller",
    monthly: 3000,
    volume: "Up to 2,000 orders/month",
    billed: { quarterly: 9000 },
    features: [
      "Up to 2000 Orders/Month",
      "4 Marketplace",
      "2 or more GST No.",
      "Tally Sync",
      "Reports",
      "Data Insights",
      "Profit Tracking",
    ],
    tagline: "For businesses handling higher order volumes and broader financial insight.",
  },
  {
    id: "established",
    name: "Established Seller",
    monthly: 4000,
    volume: "Up to 4,000 orders/month",
    billed: { quarterly: 12000 },
    features: [
      "Up to 4000 Orders/Month",
      "4 Marketplace",
      "2 or more GST No.",
      "Tally Sync",
      "Reports",
      "Data Insights",
      "Profit Tracking",
    ],
    tagline: "For established brands that need steady scale with complete financial control.",
  },
  {
    id: "high-volume",
    name: "High-Volume Seller",
    monthly: 5000,
    volume: "Up to 6,000 orders/month",
    billed: { quarterly: 15000 },
    features: [
      "Up to 6000 Orders/Month",
      "4 Marketplace",
      "2 or more GST No.",
      "Tally Sync",
      "Reports",
      "Data Insights",
      "Profit Tracking",
    ],
    tagline: "For high-volume sellers who need accounting to keep pace with order growth.",
  },
  {
    id: "power",
    name: "Power Seller",
    monthly: 6000,
    volume: "Up to 8,000 orders/month",
    billed: { quarterly: 18000 },
    features: [
      "Up to 8000 Orders/Month",
      "4 Marketplace",
      "2 or more GST No.",
      "Tally Sync",
      "Reports",
      "Data Insights",
      "Profit Tracking",
    ],
    tagline: "For power sellers running large order flows with full dependence on automation.",
  },
  {
    id: "enterprise",
    name: "Enterprise Seller",
    monthly: null,
    volume: "Above 8,000 orders/month",
    billed: {},
    features: [],
    custom: true,
    tagline: "For multi-entity operations, custom volumes and ERP accounting at scale.",
  },
]

export function planById(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id)!
}

/** Plans sold at a fixed monthly rate (used by the plan grid and comparison table). */
export const STANDARD_PLANS: Plan[] = PLANS.filter((p) => !p.custom)

export type ComparisonValue = string | boolean

export interface ComparisonRow {
  label: string
  values: ComparisonValue[]
}

/** Reused by both the pricing cards and the comparison table (single source). */
export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Order Volume", values: ["500", "1,000", "2,000", "4,000", "6,000", "8,000"] },
  { label: "Marketplaces", values: ["2", "4", "4", "4", "4", "4"] },
  { label: "GST Numbers", values: ["1", "2 or more", "2 or more", "2 or more", "2 or more", "2 or more"] },
  { label: "Tally Sync", values: [true, true, true, true, true, true] },
  { label: "Reports", values: [true, true, true, true, true, true] },
  { label: "Data Insights", values: [false, true, true, true, true, true] },
  { label: "Profit Tracking", values: [false, true, true, true, true, true] },
]

export interface PricingFaq {
  question: string
  answer: string
}

export const PRICING_FAQS: PricingFaq[] = [
  {
    question: "Which plan is right for a beginner seller?",
    answer:
      "The Beginner Seller plan fits sellers getting started with structured ecommerce reporting and accounting — up to 500 orders a month, 2 marketplaces, 1 GST number, Tally Sync and Reports.",
  },
  {
    question: "How are plans billed?",
    answer:
      "Plans bill in advance, quarterly. Beginner is ₹1,000/month billed ₹3,000 every 3 months, rising to Power Seller at ₹6,000/month billed ₹18,000 every 3 months.",
  },
  {
    question: "How many orders are included in each plan?",
    answer:
      "Beginner covers up to 500 orders a month, Emerging up to 1,000, Scaling up to 2,000, Established up to 4,000, High-Volume up to 6,000 and Power up to 8,000. Above 8,000 orders a month, the Enterprise plan is a custom fit.",
  },
  {
    question: "How many marketplaces can I connect?",
    answer:
      "The Beginner plan supports 2 marketplaces. Every plan from Emerging upward supports 4 marketplaces.",
  },
  {
    question: "What GST limits apply to each plan?",
    answer:
      "The Beginner plan supports 1 GST number. Every plan from Emerging upward supports 2 or more GST numbers.",
  },
  {
    question: "Is Tally Sync included?",
    answer: "Yes. Tally Sync is included in every plan — Beginner, Emerging, Scaling, Established, High-Volume and Power.",
  },
  {
    question: "Are Reports included in all plans?",
    answer: "Yes. Reports are included in every standard plan.",
  },
  {
    question: "Which plans include Data Insights?",
    answer:
      "Data Insights is included from the Emerging plan upward — Emerging, Scaling, Established, High-Volume and Power.",
  },
  {
    question: "Which plans include Profit Tracking?",
    answer:
      "Profit Tracking is included from the Emerging plan upward — Emerging, Scaling, Established, High-Volume and Power.",
  },
  {
    question: "What does the Enterprise plan include?",
    answer:
      "The Enterprise plan is a custom fit for sellers above 8,000 orders a month — talk to us and we'll size the plan around your order volumes, GST structure and ERP requirements.",
  },
]