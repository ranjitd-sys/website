export type ToolStatus = "live" | "planned"

export interface FreeTool {
  id: string
  name: string
  tagline: string
  description: string
  tier: string
  href: string | null
  status: ToolStatus
  keywords: string[]
}

export const FREE_TOOLS: FreeTool[] = [
  {
    id: "asin-fee-lookup",
    name: "ASIN Fee Lookup",
    tagline: "Real dimensions, real fees",
    description: "Type an ASIN to pull real weight, dimensions and category, then estimate the full fee breakdown.",
    tier: "Tier 1 — Calculator Extensions",
    href: null,
    status: "planned",
    keywords: ["amazon asin fee calculator", "amazon fee calculator by asin", "asin fee estimator"],
  },
  {
    id: "break-even-price",
    name: "Break-even Price Calculator",
    tagline: "What should you charge?",
    description: "Find the selling price you need to hit your target margin after fees and costs.",
    tier: "Tier 1 — Calculator Extensions",
    href: null,
    status: "planned",
    keywords: ["amazon break even calculator", "minimum selling price amazon"],
  },
  {
    id: "pricing-optimizer",
    name: "Pricing Optimizer",
    tagline: "Sweep the price range",
    description: "See the margin curve across a price range and find the profit-maximizing price.",
    tier: "Tier 1 — Calculator Extensions",
    href: null,
    status: "planned",
    keywords: ["amazon pricing calculator", "amazon profit calculator price range"],
  },
  {
    id: "amazon-revenue-calculator",
    name: "Amazon Revenue Calculator",
    tagline: "Fees, profit and margin per order",
    description: "Define a product and compare Amazon Fulfilment, Easy Ship, Self Ship and Seller Flex — referral, closing, weight handling, storage and GST, side by side.",
    tier: "Tier 1 — Calculator Extensions",
    href: "/revcalpublic",
    status: "live",
    keywords: ["amazon fba fee calculator india", "amazon referral fee calculator", "fba vs easy ship vs self ship", "amazon fulfillment fee comparison"],
  },
  {
    id: "gst-ecommerce",
    name: "GST on Ecommerce Calculator",
    tagline: "GST on fees and sales",
    description: "18% GST on marketplace fees plus GST on the sale versus input credit, and the net outgo.",
    tier: "Tier 1 — Calculator Extensions",
    href: null,
    status: "planned",
    keywords: ["gst calculator for amazon sellers", "gst on amazon fees"],
  },
  {
    id: "settlement-analyzer",
    name: "Settlement Report Analyzer",
    tagline: "Upload, understand, reconcile",
    description: "Upload an Amazon settlement file for a clean per-order breakdown of fees, GST, TCS/TDS and payouts.",
    tier: "Tier 2 — Reconciliation",
    href: null,
    status: "planned",
    keywords: ["amazon settlement report analyzer", "amazon settlement reconciliation tool"],
  },
  {
    id: "tcs-tds-tracker",
    name: "TCS/TDS Tracker",
    tagline: "Track deductions for ITR",
    description: "Track the 1% TCS and 0.1% TDS Amazon deducts and total it for your ITR claim.",
    tier: "Tier 2 — Reconciliation",
    href: null,
    status: "planned",
    keywords: ["amazon tcs tds calculator", "tcs on amazon sales 1%"],
  },
  {
    id: "payout-reconciliation",
    name: "Payout Reconciliation",
    tagline: "Expected versus received",
    description: "Match expected payouts against actuals and flag mismatches, returns and reimbursements.",
    tier: "Tier 2 — Reconciliation",
    href: null,
    status: "planned",
    keywords: ["amazon payout reconciliation", "amazon payment reconciliation tool"],
  },
  {
    id: "profitability-demo",
    name: "Profitability Dashboard",
    tagline: "See the platform",
    description: "An interactive preview of the DeepEcom Platform — revenue, costs and margin by channel.",
    tier: "Tier 3 — Understand",
    href: null,
    status: "planned",
    keywords: ["amazon profitability dashboard", "ecommerce profit dashboard"],
  },
  {
    id: "category-benchmark",
    name: "Category Margin Benchmark",
    tagline: "Fees by category",
    description: "Typical fees and margins across Amazon.in categories, from mobile accessories to apparel.",
    tier: "Tier 3 — Understand",
    href: null,
    status: "planned",
    keywords: ["amazon category fees comparison", "amazon referral fee by category"],
  },
  {
    id: "accounting-entry",
    name: "Accounting Entry Generator",
    tagline: "Order to journal",
    description: "Take an order and produce the actual ERP journal with debit and credit lines, GST-wise.",
    tier: "Tier 4 — ERP Connector Proof",
    href: null,
    status: "planned",
    keywords: ["amazon accounting entries generator", "ecommerce accounting journal entries"],
  },
  {
    id: "tally-zoho-preview",
    name: "Tally/Zoho Import Preview",
    tagline: "See the ERP posting",
    description: "Preview what a reconciled transaction looks like before importing it into Tally or Zoho.",
    tier: "Tier 4 — ERP Connector Proof",
    href: null,
    status: "planned",
    keywords: ["tally integration for amazon", "zoho books amazon integration"],
  },
  {
    id: "meesho-label-manager",
    name: "Meesho Label Manager",
    tagline: "Print-ready labels in seconds",
    description: "Upload your Meesho shipping-label PDF. We detect each label, split it from the invoice, crop whitespace and size it for your printer.",
    tier: "Tier 1 — Calculator Extensions",
    href: "/tools/meesho-label-manager",
    status: "live",
    keywords: ["meesho label cropper", "meesho shipping label printer", "meesho label pdf crop"],
  },
]

export const LIVE_TOOLS = FREE_TOOLS.filter((t) => t.status === "live")
export const PLANNED_TOOLS = FREE_TOOLS.filter((t) => t.status === "planned")
