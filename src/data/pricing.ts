export type PlanId = "beginner" | "emerging" | "scaling"
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
  /** Monthly price — always shown (verified) */
  monthly: number
  /** Billed amounts per cycle. Only cycles present in the source carry a value. */
  billed: Partial<Record<BillingCycleId, number>>
  features: string[]
  /** Editorial guidance line shown in the plan-guidance section */
  tagline: string
}

export const PLANS: Plan[] = [
  {
    id: "beginner",
    name: "Beginner Seller",
    monthly: 1000,
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
    tagline: "For growing sellers managing more marketplaces and looking for deeper financial visibility.",
  },
  {
    id: "scaling",
    name: "Scaling Seller",
    monthly: 3000,
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
    tagline: "For businesses handling higher order volumes and needing broader financial insight.",
  },
]

export function planById(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id)!
}

export type ComparisonValue = string | boolean

export interface ComparisonRow {
  label: string
  values: ComparisonValue[]
}

/** Reused by both the pricing cards and the comparison table (single source). */
export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Order Volume", values: ["500", "1000", "2000"] },
  { label: "Marketplaces", values: ["2", "4", "4"] },
  { label: "GST Numbers", values: ["1", "2 or more", "2 or more"] },
  { label: "Tally Sync", values: [true, true, true] },
  { label: "Reports", values: [true, true, true] },
  { label: "Data Insights", values: [false, true, true] },
  { label: "Profit Tracking", values: [false, true, true] },
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
      "Plans bill in advance for the period you choose. The current published billing is quarterly — the Beginner plan is ₹1,000/month, billed ₹3,000 every 3 months.",
  },
  {
    question: "How many orders are included in each plan?",
    answer:
      "Beginner covers up to 500 orders a month, Emerging up to 1,000 orders a month, and Scaling up to 2,000 orders a month.",
  },
  {
    question: "How many marketplaces can I connect?",
    answer:
      "The Beginner plan supports 2 marketplaces. Emerging and Scaling both support 4 marketplaces.",
  },
  {
    question: "What GST limits apply to each plan?",
    answer:
      "The Beginner plan supports 1 GST number. Emerging and Scaling both support 2 or more GST numbers.",
  },
  {
    question: "Is Tally Sync included?",
    answer: "Yes. Tally Sync is included in every plan — Beginner, Emerging and Scaling.",
  },
  {
    question: "Are Reports included in all plans?",
    answer: "Yes. Reports are included in every plan.",
  },
  {
    question: "Which plans include Data Insights?",
    answer: "Data Insights is included in the Emerging and Scaling plans.",
  },
  {
    question: "Which plans include Profit Tracking?",
    answer: "Profit Tracking is included in the Emerging and Scaling plans.",
  },
]