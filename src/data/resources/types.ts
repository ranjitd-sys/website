export type ResourceKind = "blog" | "guide" | "hub" | "faq" | "help"

export type TopicId = "accounting" | "reconciliation" | "gst" | "erp" | "profitability"

export type PostCategory =
  | "Accounting"
  | "Reconciliation"
  | "GST"
  | "ERP"
  | "Profitability"
  | "Reports"
  | "Inventory"

export interface RelatedLink {
  label: string
  href: string
  kind: "blog" | "guide" | "hub" | "help"
}

/** A filterable entry in the shared resource catalogue. */
export interface CatalogItem {
  id: string
  title: string
  description: string
  kind: ResourceKind
  /** Single filter bucket matched by the category nav (one of Filter.id). */
  filter: string
  /** Human category label shown on the card chip. */
  category: string
  /** Secondary metadata line (reading time, chapter count, …). */
  meta: string
  href: string
  date?: string
  featured?: boolean
  highlight?: string
}

export interface FilterDef {
  id: string
  label: string
  /** Topic hubs link out instead of filtering, so they can carry a href. */
  href?: string
}

export const FILTERS: FilterDef[] = [
  { id: "all", label: "All" },
  { id: "blog", label: "Blog" },
  { id: "guides", label: "Guides" },
  { id: "accounting", label: "Ecommerce Accounting", href: "/resources/ecommerce-accounting" },
  { id: "reconciliation", label: "Reconciliation", href: "/resources/reconciliation" },
  { id: "gst", label: "GST", href: "/resources/gst" },
  { id: "erp", label: "ERP", href: "/resources/erp" },
  { id: "faqs", label: "FAQs", href: "/resources/faqs" },
  { id: "help", label: "Help Center", href: "/resources/help-center" },
]

export interface Hub {
  id: TopicId
  title: string
  description: string
  href: string
  filterLabel: string
}

export const HUBS: Hub[] = [
  {
    id: "accounting",
    title: "Ecommerce Accounting",
    description:
      "How orders, marketplace charges, taxes, settlements, returns, inventory and stock movements become accounting data.",
    href: "/resources/ecommerce-accounting",
    filterLabel: "Ecommerce Accounting",
  },
  {
    id: "reconciliation",
    title: "Payment Reconciliation",
    description:
      "Expected vs actual — how marketplace settlements, fees, returns and payouts are matched and explained.",
    href: "/resources/reconciliation",
    filterLabel: "Reconciliation",
  },
  {
    id: "gst",
    title: "GST for Ecommerce",
    description:
      "How GST, TCS and TDS flow from an order through marketplace data and into GST-wise accounting.",
    href: "/resources/gst",
    filterLabel: "GST",
  },
  {
    id: "erp",
    title: "ERP Integration",
    description:
      "What your ERP needs from ecommerce data, and how detailed accounting gets there — Tally, SAP, Zoho.",
    href: "/resources/erp",
    filterLabel: "ERP",
  },
]

export function postTopic(category: PostCategory): TopicId | undefined {
  switch (category) {
    case "Accounting":
      return "accounting"
    case "Reconciliation":
      return "reconciliation"
    case "GST":
      return "gst"
    case "ERP":
      return "erp"
    case "Profitability":
    case "Reports":
      return "profitability"
    case "Inventory":
      return "accounting"
  }
}

export function guideTopic(topic: string): TopicId | undefined {
  switch (topic) {
    case "Ecommerce Accounting":
      return "accounting"
    case "Reconciliation":
      return "reconciliation"
    case "GST":
      return "gst"
    case "ERP":
      return "erp"
    case "Profitability":
      return "profitability"
  }
}