export interface NavLink {
  label: string
  href: string
  description?: string
  icon?: string
}

export interface NavGroup {
  title: string
  description?: string
  icon?: string
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

import { PLANS } from "@/data/pricing"

export const NAV_ITEMS: NavItem[] = [
  {
    id: "products",
    label: "Products",
    type: "menu",
    groups: [
      {
        title: "DeepEcom Platform",
        description: "Understand your ecommerce business",
        icon: "platform",
        links: [
          { label: "Overview", href: "/platform", description: "The connected view across your marketplaces" },
          { label: "Profitability", href: "/platform/profitability", description: "Actual margins per order, channel and SKU" },
          { label: "Payment Reconciliation", href: "/platform/payment-reconciliation", description: "Match settlements and payouts at order level" },
          { label: "Dashboard", href: "/platform/dashboard", description: "Marketplace performance at a glance" },
          { label: "Reports", href: "/platform/reports", description: "Structured exports for your business" },
        ],
      },
      {
        title: "ERP Connector",
        description: "Make your ERP ecommerce-ready",
        icon: "erp connector",
        links: [
          { label: "Overview", href: "/erp-connector", description: "Detailed ecommerce accounting inside your ERP" },
          { label: "Accounting", href: "/erp-connector/accounting", description: "Order-wise, GST-wise, warehouse-wise entries" },
          { label: "GST", href: "/erp-connector/gst", description: "GST-ready vouchers posted automatically" },
          { label: "Inventory & Stock Transfers", href: "/erp-connector/inventory", description: "Stock moves accounted across warehouses" },
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
        description: "Built around how your business sells online",
        icon: "by business",
        links: [
          { label: "Amazon Sellers", href: "/solutions/amazon-sellers", description: "Profitability, reconciliation and accounting for marketplaces" },
          { label: "D2C Brands", href: "/solutions/d2c-brands", description: "Website and marketplace finance in one view" },
          { label: "Enterprise", href: "/solutions/enterprise", description: "High-volume ecommerce accounting at scale" },
        ],
      },
      {
        title: "By Role",
        description: "Purpose-built for the people running the books",
        icon: "by role",
        links: [
          { label: "CFOs", href: "/solutions/cfos", description: "Financial visibility, reconciliation and control" },
          { label: "Accountants", href: "/solutions/accountants", description: "Automated ecommerce accounting and ERP posting" },
          { label: "Business Owners", href: "/solutions/business-owners", description: "Know what you sold, received and actually made" },
        ],
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    type: "menu",
    groups: [
      {
        title: "Marketplaces",
        links: [
          { label: "Amazon", href: "/integrations/amazon" },
          { label: "Flipkart", href: "/integrations/flipkart" },
          { label: "Shopify", href: "/integrations/shopify" },
          { label: "Meesho", href: "/integrations/meesho" },
          { label: "Myntra", href: "/integrations/myntra" },
          { label: "Ajio", href: "/integrations/ajio" },
          { label: "JioMart", href: "/integrations/jiomart" },
          { label: "Nykaa", href: "/integrations/nykaa" },
        ],
      },
      {
        title: "Payments",
        links: [
          { label: "Razorpay", href: "/integrations/razorpay" },
          { label: "PayU", href: "/integrations/payu" },
          { label: "Cashfree", href: "/integrations/cashfree" },
          { label: "PhonePe", href: "/integrations/phonepe" },
          { label: "Paytm", href: "/integrations/paytm" },
        ],
      },
      {
        title: "Shipping Partners",
        links: [
          { label: "Shiprocket", href: "/integrations/shiprocket" },
          { label: "Delhivery", href: "/integrations/delhivery" },
          { label: "Ekart", href: "/integrations/ekart" },
          { label: "Blue Dart", href: "/integrations/blue-dart" },
          { label: "Xpressbees", href: "/integrations/xpressbees" },
        ],
      },
      {
        title: "ERP",
        links: [
          { label: "Tally", href: "/integrations/tally" },
          { label: "SAP", href: "/integrations/sap" },
          { label: "Zoho Books", href: "/integrations/zoho-books" },
        ],
      },
    ],
  },
  {
    id: "case-studies",
    label: "Case Studies",
    type: "menu",
    groups: [
      {
        title: "Case Studies",
        links: [
          { label: "Gati", href: "/case-studies/gati" },
          { label: "Vanalaya", href: "/case-studies/vanalaya" },
          { label: "Zeneme", href: "/case-studies/zeneme" },
        ],
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    type: "menu",
    groups: [
      {
        title: "Learn",
        description: "Build your ecommerce finance toolkit",
        icon: "learn",
        links: [
          { label: "Blog", href: "/resources/blog", description: "Stories, updates and deep dives" },
          { label: "Guides", href: "/resources/guides", description: "Step-by-step playbooks" },
          { label: "FAQs", href: "/resources/faqs", description: "Answers to common questions" },
          { label: "Help Center", href: "/resources/help-center", description: "Docs and self-serve support" },
        ],
      },
      {
        title: "Topics",
        description: "Ecommerce finance, made clear",
        icon: "topics",
        links: [
          { label: "Ecommerce Accounting", href: "/resources/ecommerce-accounting", description: "How online orders become finance" },
          { label: "Reconciliation", href: "/resources/reconciliation", description: "Expected versus received, at order level" },
          { label: "GST", href: "/resources/gst", description: "GST, TCS and TDS for ecommerce" },
          { label: "ERP", href: "/resources/erp", description: "Making your ERP ecommerce-ready" },
        ],
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    type: "menu",
    groups: [
      {
        title: "Plans",
        description: "Sized by monthly order volume, billed quarterly",
        icon: "pricing",
        links: [
          ...PLANS.map((plan) => ({
            label: plan.name,
            href: `/pricing#${plan.id}`,
            description: plan.volume,
          })),
          { label: "Compare all plans", href: "/pricing#compare", description: "See every plan side by side" },
        ],
      },
    ],
  },
]

export const BOOK_DEMO_URL = "/contact"
export const LOGIN_URL = "https://app.deepecom.com/"