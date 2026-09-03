export interface NavLink {
  label: string
  href: string
  description?: string
  icon?: string
}

export interface NavGroup {
  title: string
  description?: string
  links: NavLink[]
}

export interface NavItem {
  id: string
  label: string
  type: "link" | "menu"
  href?: string
  groups?: NavGroup[]
  featured?: NavLink
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "products",
    label: "Products",
    type: "menu",
    groups: [
      {
        title: "DeepEcom Platform",
        description: "Understand your ecommerce business",
        links: [
          { label: "Overview", href: "/platform" },
          { label: "Profitability", href: "/platform/profitability" },
          { label: "Payment Reconciliation", href: "/platform/payment-reconciliation" },
          { label: "Dashboard", href: "/platform/dashboard" },
          { label: "Reports", href: "/platform/reports" },
        ],
      },
      {
        title: "ERP Connector",
        description: "Make your ERP ecommerce-ready",
        links: [
          { label: "Overview", href: "/erp-connector" },
          { label: "Accounting", href: "/erp-connector/accounting" },
          { label: "GST", href: "/erp-connector/gst" },
          { label: "Inventory & Stock Transfers", href: "/erp-connector/inventory" },
        ],
      },
    ],
    featured: {
      label: "ERP Integrations",
      description: "Tally · SAP · Zoho",
      href: "/integrations",
    },
  },
  {
    id: "solutions",
    label: "Solutions",
    type: "menu",
    groups: [
      {
        title: "By Business",
        links: [
          { label: "Amazon Sellers", href: "/solutions/amazon-sellers" },
          { label: "D2C Brands", href: "/solutions/d2c-brands" },
          { label: "Enterprise", href: "/solutions/enterprise" },
        ],
      },
      {
        title: "By Role",
        links: [
          { label: "CFOs", href: "/solutions/cfos" },
          { label: "Accountants", href: "/solutions/accountants" },
          { label: "Business Owners", href: "/solutions/business-owners" },
        ],
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    type: "link",
    href: "/integrations",
  },
  {
    id: "customers",
    label: "Customers",
    type: "link",
    href: "/customers",
  },
  {
    id: "resources",
    label: "Resources",
    type: "menu",
    groups: [
      {
        title: "Learn",
        links: [
          { label: "Blog", href: "/resources/blog" },
          { label: "Guides", href: "/resources/guides" },
          { label: "FAQs", href: "/resources/faqs" },
          { label: "Help Center", href: "/resources/help-center" },
        ],
      },
      {
        title: "Topics",
        links: [
          { label: "Ecommerce Accounting", href: "/resources/ecommerce-accounting" },
          { label: "Reconciliation", href: "/resources/reconciliation" },
          { label: "GST", href: "/resources/gst" },
          { label: "ERP", href: "/resources/erp" },
        ],
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    type: "link",
    href: "/pricing",
  },
]

export const BOOK_DEMO_URL = "/contact"
export const LOGIN_URL = "/login"