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
    name: "Gati",
    slug: "gati",
    industry: "Ecommerce Business",
    logoText: "Gati",
    businessType: "enterprise",
    headline: "How Gati moved from settlement complexity to complete order-level accounting.",
    problem:
      "Gati received settlements and payments from marketplaces, but had no complete, order-level view of its ecommerce finances. It was difficult to determine exactly which orders had been paid, verify whether the amounts received were accurate, or validate the fees, commissions, shipping charges and deductions applied to each order. Sales and refunds were not accounted for order-by-order in the ERP, making reconciliation between marketplaces, settlements and books extremely difficult.",
    before: [
      "No complete order-level view of settlements",
      "Complex marketplace settlement reports impossible to verify independently",
      "Marketplace fees, commissions and deductions hard to validate per order",
      "Sales and refunds not accounted order-by-order in the ERP",
      "Reconciliation between marketplaces, settlements and books was manual and slow",
    ],
    implementation: [
      { label: "Platform", detail: "Order-wise payment reconciliation of settlements against orders" },
      { label: "ERP Connector", detail: "Complete order-level ecommerce accounting posted to the ERP" },
    ],
    after: [
      "Full financial trail for every order — from sale to settlement",
      "Orders paid and orders pending identified instantly",
      "Settlement amounts reconciled and validated against individual orders",
      "Expenses and deductions verified at the order level",
      "Discrepancies and unexplained differences surfaced automatically",
      "Sales and refunds accounted order-wise in the ERP",
    ],
    outcome:
      "Gati moved from relying on complex settlement reports to having a complete financial trail for every order. The finance team can trace an order from the original sale or refund through marketplace deductions to the final settlement received — every order accounted for, every payment traceable, every deduction validated.",
    quote: "",
    quoteAuthor: "",
    quoteRole: "",
    products: ["Payment Reconciliation", "Order-wise Accounting", "Reports", "GST"],
    categories: ["Payment Reconciliation", "Ecommerce Accounting", "Order-wise Accounting"],
    featured: true,
  },
  {
    name: "Vanalaya",
    slug: "vanalaya",
    industry: "Ecommerce Seller",
    logoText: "Vanalaya",
    businessType: "amazon-seller",
    headline: "How Vanalaya replaced manual data entry with GST-ready accounting in seconds.",
    problem:
      "Vijay, a solopreneur at Vanalaya, was struggling to keep up with ecommerce accounting and GST filing requirements. A major part of the process was manually punching ecommerce transaction data into the ERP, which was time-consuming and prone to errors. Reports generated internally were often inaccurate or did not match the data on the TCS portal, creating additional reconciliation work and uncertainty during GST filing.",
    before: [
      "Manual entry of ecommerce transactions into the ERP",
      "Time-consuming accounting that was prone to errors",
      "Internal reports that did not match the TCS portal",
      "Uncertainty and pressure during every GST filing cycle",
    ],
    implementation: [
      { label: "ERP Connector", detail: "DeepEcom Tally Connector — brings ecommerce data into Tally in seconds" },
      { label: "Platform", detail: "GST-ready reports and TCS reconciliation" },
    ],
    after: [
      "Ecommerce data brought into Tally within seconds",
      "Repetitive manual data entry eliminated",
      "GST-ready reports generated automatically",
      "Ecommerce data reconciled against TCS portal figures",
      "Fewer errors in GST reporting and faster filing cycles",
    ],
    outcome:
      "Vijay no longer spends hours manually entering ecommerce transactions. Ecommerce data lands in Tally in seconds, structured and ready for GST reconciliation and filing. What was once a stressful, manual process became a faster, more accurate and streamlined workflow.",
    quote: "",
    quoteAuthor: "",
    quoteRole: "",
    products: ["Tally", "GST", "Payment Reconciliation", "Reports"],
    categories: ["Ecommerce Accounting", "GST", "ERP Integration"],
    featured: false,
  },
  {
    name: "Zeneme",
    slug: "zeneme",
    industry: "Ecommerce Brand",
    logoText: "Zeneme",
    businessType: "d2c-brand",
    headline: "How Zeneme turned unclear margins into confident product pricing.",
    problem:
      "Gaurav from Zeneme was struggling to understand the actual profitability of individual products. While sales numbers were available, it was difficult to determine how much profit each product truly generated after accounting for the costs involved in selling online. Without clear product-level profitability, pricing decisions were largely based on assumptions.",
    before: [
      "Product-level profitability was unclear",
      "Revenue costs and deductions not visible per product",
      "Pricing decisions based on assumptions",
      "Difficult to identify which products needed repricing vs genuinely profitable ones",
    ],
    implementation: [
      { label: "Platform", detail: "Detailed profitability dashboard at product level" },
    ],
    after: [
      "Product-level revenue, costs and deductions brought together",
      "Net profitability visible for every product",
      "Products with weak or negative margins identified",
      "Clear, data-driven view of repricing opportunities",
    ],
    outcome:
      "With a clear understanding of the actual profit per product, Gaurav could make informed pricing decisions and reprice his product portfolio with confidence. Profitability analysis went from a complex exercise into a clear, actionable pricing strategy.",
    quote: "",
    quoteAuthor: "",
    quoteRole: "",
    products: ["Profitability", "Dashboard", "Reports"],
    categories: ["Profitability", "Pricing", "Reports"],
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
    a: "Customers use different combinations of the Platform (Profitability, Payment Reconciliation, Dashboard, Reports) and the ERP Connector (Order-wise Accounting, GST, Tally) depending on their needs.",
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