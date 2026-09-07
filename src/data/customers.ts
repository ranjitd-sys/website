export interface Customer {
  name: string
  slug: string
  industry: string
  logoText: string
  businessType: string
  headline: string
  problem: string
  before: string[]
  implementation: { label: string; detail: string }[]
  after: string[]
  outcome: string
  quote: string
  quoteAuthor: string
  quoteRole: string
  products: string[]
  categories: string[]
  featured: boolean
}

export const customers: Customer[] = [
  {
    name: "GlobalBees",
    slug: "globalbees",
    industry: "Multi-brand D2C",
    logoText: "GlobalBees",
    businessType: "enterprise",
    headline: "How GlobalBees automated accounting across marketplaces and warehouses.",
    problem:
      "GlobalBees operates multiple brands across Amazon, Flipkart and their own D2C stores. Each marketplace reports settlements, fees, returns and GST differently. Reconciliation across entities and warehouses required significant manual effort.",
    before: [
      "Multiple marketplace settlement files in different formats",
      "Manual reconciliation across 5+ brands and entities",
      "ERP posting built from scratch every cycle",
      "Profitability estimated, not actual",
      "Warehouse stock transfers disconnected from accounting",
    ],
    implementation: [
      { label: "Platform", detail: "Profitability, Payment Reconciliation, Dashboard" },
      { label: "ERP Connector", detail: "Order-wise Accounting, GST, Warehouse Accounting, Stock Transfers" },
    ],
    after: [
      "Settlements reconciled automatically across entities",
      "Order-level accounting posted to ERP",
      "Stock transfers accounted across warehouses",
      "Profitability visible per brand, channel and SKU",
    ],
    outcome:
      "Reconciliation effort dropped sharply. Profitability became visible per brand, per channel and per SKU. Month-end closing became faster and more reliable.",
    quote: "DeepEcom replaced what was a manually intensive process across marketplaces and warehouses with one structured financial layer.",
    quoteAuthor: "CONTENT NEEDED",
    quoteRole: "CONTENT NEEDED — GlobalBees finance team member",
    products: ["Profitability", "Payment Reconciliation", "Dashboard", "Order-wise Accounting", "GST", "Warehouse Accounting"],
    categories: ["Marketplace Complexity", "Payment Reconciliation", "Ecommerce Accounting", "ERP Integration"],
    featured: true,
  },
  {
    name: "Sampatti",
    slug: "sampatti",
    industry: "Fashion & Lifestyle",
    logoText: "Sampatti",
    businessType: "d2c-brand",
    headline: "How Sampatti consolidated marketplace and D2C data into one financial picture.",
    problem:
      "Sampatti sold through its own D2C website and marketplaces, but the financial data was fragmented across every channel. Orders, returns, payments and GST context lived in separate systems.",
    before: [
      "Website and marketplace data in separate silos",
      "Returns and refunds tracked manually across channels",
      "GST accounting built from exported reports",
      "No single view of channel-level profitability",
    ],
    implementation: [
      { label: "Platform", detail: "Profitability, Dashboard" },
      { label: "ERP Connector", detail: "Order-wise Accounting, GST" },
    ],
    after: [
      "Website and marketplace data in one layer",
      "Returns and refunds reconciled automatically",
      "GST-ready accounting posted to ERP",
      "Channel-level profitability visible",
    ],
    outcome:
      "The finance team could see the full picture across D2C and marketplaces without merging exports manually.",
    quote: "CONTENT NEEDED",
    quoteAuthor: "CONTENT NEEDED",
    quoteRole: "CONTENT NEEDED — Sampatti team",
    products: ["Profitability", "Dashboard", "Order-wise Accounting", "GST"],
    categories: ["Marketplace Complexity", "Profitability Visibility", "Ecommerce Accounting"],
    featured: false,
  },
  {
    name: "Shree Maa Group",
    slug: "shree-maa-group",
    industry: "FMCG / Consumer Goods",
    logoText: "Shree Maa",
    businessType: "enterprise",
    headline: "How Shree Maa Group streamlined high-volume marketplace accounting.",
    problem:
      "At high transaction volume across multiple marketplaces, Shree Maa Group faced reconciliation and accounting challenges that manual processes could not keep pace with.",
    before: [
      "High volume reconciliation across marketplaces",
      "Settlement differences hard to identify",
      "Manual ERP posting at scale",
      "Limited visibility into order-level detail",
    ],
    implementation: [
      { label: "Platform", detail: "Payment Reconciliation, Reports" },
      { label: "ERP Connector", detail: "Order-wise Accounting, GST" },
    ],
    after: [
      "Settlement differences identified automatically",
      "Order-level accounting posted at scale",
      "Reports consolidated across marketplaces",
      "Finance team had clearer control over entries",
    ],
    outcome:
      "Accounting became more consistent. The finance team could focus on analysis rather than data wrangling.",
    quote: "CONTENT NEEDED",
    quoteAuthor: "CONTENT NEEDED",
    quoteRole: "CONTENT NEEDED — Shree Maa Group finance lead",
    products: ["Payment Reconciliation", "Reports", "Order-wise Accounting", "GST"],
    categories: ["Payment Reconciliation", "Ecommerce Accounting", "Marketplace Complexity"],
    featured: false,
  },
  {
    name: "PEE SAFE",
    slug: "pee-safe",
    industry: "D2C / Personal Care",
    logoText: "PEE SAFE",
    businessType: "d2c-brand",
    headline: "How PEE SAFE connected marketplace sales to accurate accounting.",
    problem:
      "PEE SAFE sold across marketplaces and its own D2C channel. Reconciling payments and posting detailed accounting into the ERP required significant manual effort.",
    before: [
      "Marketplace settlements reconciled manually",
      "Payment gateway data disconnected from order data",
      "ERP accounting posted with gaps in detail",
      "GST and TCS/TDS tracking was complex",
    ],
    implementation: [
      { label: "Platform", detail: "Payment Reconciliation, Profitability" },
      { label: "ERP Connector", detail: "Order-wise Accounting, GST, TCS/TDS" },
    ],
    after: [
      "Payment reconciliation automated",
      "GST and TCS/TDS accounted correctly",
      "Order-level accounting posted to ERP",
      "Profitability visible per channel",
    ],
    outcome:
      "The finance team spent less time on reconciliation and more time on understanding the business.",
    quote: "CONTENT NEEDED",
    quoteAuthor: "CONTENT NEEDED",
    quoteRole: "CONTENT NEEDED — PEE SAFE team",
    products: ["Payment Reconciliation", "Profitability", "Order-wise Accounting", "GST", "TCS/TDS"],
    categories: ["Payment Reconciliation", "Ecommerce Accounting", "Profitability Visibility"],
    featured: false,
  },
]

export const customerFaqs = [
  {
    q: "Which types of businesses use DeepEcom?",
    a: "DeepEcom is used by Amazon sellers, D2C brands, multi-brand businesses and enterprise sellers who need marketplace data, reconciliation and ERP accounting connected.",
  },
  {
    q: "Can I see customer case studies?",
    a: "Yes. Each case study explains the customer's problem, what DeepEcom implemented and what changed. Case studies are based on verified customer information.",
  },
  {
    q: "Does DeepEcom work for Amazon sellers?",
    a: "Yes. Amazon sellers use DeepEcom to reconcile settlements, extract fees, account for GST and TCS/TDS, and post detailed accounting into their ERP.",
  },
  {
    q: "Does DeepEcom work for D2C brands?",
    a: "Yes. D2C brands use DeepEcom to consolidate website and marketplace data, reconcile payments, and produce GST-ready accounting.",
  },
  {
    q: "Does DeepEcom work for enterprise businesses?",
    a: "Yes. Enterprise sellers use DeepEcom at high transaction volume across multiple entities, warehouses and marketplaces with complex GST and ERP requirements.",
  },
  {
    q: "What problems do customers typically solve with DeepEcom?",
    a: "Customers typically solve marketplace data fragmentation, manual reconciliation, profitability visibility, and detailed ERP accounting that matches the marketplace reality.",
  },
  {
    q: "Which DeepEcom products do customers use?",
    a: "Customers use different combinations of the Platform (Profitability, Payment Reconciliation, Dashboard, Reports) and the ERP Connector (Order-wise Accounting, GST, Warehouse Accounting) depending on their needs.",
  },
  {
    q: "Can I speak to an existing DeepEcom customer?",
    a: "Yes. Contact us and we can connect you with a customer whose business is similar to yours.",
  },
  {
    q: "How does DeepEcom help with ecommerce accounting?",
    a: "DeepEcom converts ecommerce transactions into detailed accounting entries — order-wise, GST-wise and warehouse-wise — and posts them into your ERP.",
  },
  {
    q: "How does DeepEcom help with payment reconciliation?",
    a: "DeepEcom connects payment and settlement data so you can match what you expected to receive against what actually arrived, at order level.",
  },
]
