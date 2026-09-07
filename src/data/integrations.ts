export type IntegrationCategoryId = "marketplaces" | "payments" | "shipping" | "erp"

export interface IntegrationCategory {
  id: IntegrationCategoryId
  label: string
  description: string
}

export interface Integration {
  slug: string
  name: string
  mark: string
  category: IntegrationCategoryId
  description: string
  capabilities: string[]
}

export const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  {
    id: "marketplaces",
    label: "Marketplaces",
    description: "The platforms where orders and settlements originate.",
  },
  {
    id: "payments",
    label: "Payments",
    description: "Gateways and marketplace settlements that move the money.",
  },
  {
    id: "shipping",
    label: "Shipping Partners",
    description: "Logistics and fulfilment partners that create shipping costs.",
  },
  {
    id: "erp",
    label: "ERP",
    description: "The systems your finance team runs the books on.",
  },
]

export const INTEGRATIONS: Integration[] = [
  // -------- Marketplaces --------
  {
    slug: "amazon",
    name: "Amazon",
    mark: "amazon",
    category: "marketplaces",
    description: "Orders, settlements, fees and TCS/TDS into profitability, reconciliation and accounting.",
    capabilities: ["Profitability", "Reconciliation", "Accounting"],
  },
  {
    slug: "flipkart",
    name: "Flipkart",
    mark: "flipkart",
    category: "marketplaces",
    description: "Orders, settlements and commissions into the same financial layer.",
    capabilities: ["Profitability", "Reconciliation", "Accounting"],
  },
  {
    slug: "shopify",
    name: "Shopify",
    mark: "shopify",
    category: "marketplaces",
    description: "Store sales and payouts brought into one financial picture.",
    capabilities: ["Sales", "Payments", "Accounting"],
  },
  {
    slug: "meesho",
    name: "Meesho",
    mark: "meesho",
    category: "marketplaces",
    description: "Channel data aggregated into the same connected layer.",
    capabilities: ["Sales", "Payments", "Accounting"],
  },
  {
    slug: "myntra",
    name: "Myntra",
    mark: "myntra",
    category: "marketplaces",
    description: "Myntra seller data into the same connected financial layer.",
    capabilities: ["Profitability", "Reconciliation", "Accounting"],
  },
  {
    slug: "ajio",
    name: "Ajio",
    mark: "ajio",
    category: "marketplaces",
    description: "Ajio orders and settlements into the same financial layer.",
    capabilities: ["Profitability", "Reconciliation", "Accounting"],
  },
  {
    slug: "jiomart",
    name: "JioMart",
    mark: "jiomart",
    category: "marketplaces",
    description: "JioMart channel data aggregated into the same layer.",
    capabilities: ["Sales", "Payments", "Accounting"],
  },
  {
    slug: "nykaa",
    name: "Nykaa",
    mark: "nykaa",
    category: "marketplaces",
    description: "Nykaa seller data into the same connected financial layer.",
    capabilities: ["Profitability", "Reconciliation", "Accounting"],
  },
  // -------- Payments --------
  {
    slug: "razorpay",
    name: "Razorpay",
    mark: "razorpay",
    category: "payments",
    description: "Gateway payments into reconciliation and accounting.",
    capabilities: ["Reconciliation", "Accounting"],
  },
  {
    slug: "payu",
    name: "PayU",
    mark: "payu",
    category: "payments",
    description: "Payment data into expected-vs-received matching.",
    capabilities: ["Reconciliation", "Accounting"],
  },
  {
    slug: "cashfree",
    name: "Cashfree Payments",
    mark: "cashfree",
    category: "payments",
    description: "Gateway settlements into one financial view.",
    capabilities: ["Reconciliation", "Accounting"],
  },
  {
    slug: "phonepe",
    name: "PhonePe",
    mark: "phonepe",
    category: "payments",
    description: "UPI and payment data into reconciliation.",
    capabilities: ["Reconciliation"],
  },
  {
    slug: "paytm",
    name: "Paytm",
    mark: "paytm",
    category: "payments",
    description: "Payments and settlements into reconciliation.",
    capabilities: ["Reconciliation"],
  },
  {
    slug: "marketplace-settlements",
    name: "Marketplace Settlements",
    mark: "mps",
    category: "payments",
    description: "Settlement to bank matching at order level.",
    capabilities: ["Reconciliation"],
  },
  // -------- Shipping partners --------
  {
    slug: "shiprocket",
    name: "Shiprocket",
    mark: "shiprocket",
    category: "shipping",
    description: "Shipping partner data into fulfilment cost visibility.",
    capabilities: ["Costs", "Profitability"],
  },
  {
    slug: "delhivery",
    name: "Delhivery",
    mark: "delhivery",
    category: "shipping",
    description: "Fulfilment costs reflected in profitability and accounting.",
    capabilities: ["Costs", "Profitability"],
  },
  {
    slug: "ekart",
    name: "Ekart",
    mark: "ekart",
    category: "shipping",
    description: "Marketplace logistics data into cost visibility.",
    capabilities: ["Costs"],
  },
  {
    slug: "blue-dart",
    name: "Blue Dart",
    mark: "bluedart",
    category: "shipping",
    description: "Express shipping costs connected to their orders.",
    capabilities: ["Costs"],
  },
  {
    slug: "xpressbees",
    name: "Xpressbees",
    mark: "xpressbees",
    category: "shipping",
    description: "Fulfilment and logistics costs into the financial picture.",
    capabilities: ["Costs"],
  },
  // -------- ERP --------
  {
    slug: "tally",
    name: "Tally",
    mark: "tally",
    category: "erp",
    description: "Detailed ecommerce vouchers posted into Tally — order-wise, GST-wise, warehouse-wise.",
    capabilities: ["Voucher posting", "GST", "Inventory"],
  },
  {
    slug: "sap",
    name: "SAP",
    mark: "sap",
    category: "erp",
    description: "Ecommerce transactions structured for SAP accounting.",
    capabilities: ["Accounting", "Posting"],
  },
  {
    slug: "zoho-books",
    name: "Zoho Books",
    mark: "zoho",
    category: "erp",
    description: "Ecommerce transactions accounted inside Zoho Books.",
    capabilities: ["Accounting", "Posting"],
  },
  {
    slug: "microsoft-dynamics",
    name: "Microsoft Dynamics",
    mark: "dynamics",
    category: "erp",
    description: "Ecommerce transactions structured for Microsoft Dynamics finance and operations.",
    capabilities: ["Accounting", "Posting"],
  },
]

export const POPULAR_INTEGRATIONS = ["amazon", "flipkart", "shopify", "meesho", "tally", "sap", "zoho-books"]

export function integrationBySlug(slug: string): Integration | undefined {
  return INTEGRATIONS.find((i) => i.slug === slug)
}

export function categoryById(id: IntegrationCategoryId): IntegrationCategory | undefined {
  return INTEGRATION_CATEGORIES.find((c) => c.id === id)
}

export function integrationsByCategory(id: IntegrationCategoryId): Integration[] {
  return INTEGRATIONS.filter((i) => i.category === id)
}