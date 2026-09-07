export interface HelpItem {
  title: string
  description: string
  href: string
}

export interface HelpGroup {
  id: string
  label: string
  description: string
  items: HelpItem[]
}

export const HELP_GROUPS: HelpGroup[] = [
  {
    id: "getting-started",
    label: "Getting started",
    description: "Connect your marketplaces and see your business for the first time.",
    items: [
      {
        title: "Connect your first marketplace",
        description:
          "How to connect Amazon, Flipkart, Shopify, Meesho or other supported channels with secure, read-only credentials — and what data starts flowing.",
        href: "/resources/help-center#connect-a-marketplace",
      },
      {
        title: "Understanding your dashboard",
        description:
          "A walkthrough of the dashboard: revenue, costs, profitability, trends and the channel and category breakdowns behind every number.",
        href: "/platform/dashboard",
      },
      {
        title: "Set up your ERP for the first time",
        description:
          "Preparing your Tally, SAP or Zoho structure — ledgers, GST heads and warehouses — so ERP Connector posts cleanly from day one.",
        href: "/resources/help-center#set-up-your-erp",
      },
      {
        title: "Create an account and invite your team",
        description:
          "How to create a DeepEcom account, invite your accountant or business partners, and control what each role can see.",
        href: "/resources/help-center#managing-your-team",
      },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    description: "Dashboards, profitability and reporting on the DeepEcom Platform.",
    items: [
      {
        title: "Dashboard",
        description:
          "See revenue, costs and profitability at a glance, with trend lines and channel, category and warehouse breakdowns.",
        href: "/platform/dashboard",
      },
      {
        title: "Profitability",
        description:
          "Order-level and product-level margin computed after marketplace charges, GST, refunds and fulfilment.",
        href: "/platform/profitability",
      },
      {
        title: "Payment reconciliation",
        description:
          "Match orders to settlements and settlements to bank deposits until receivables, settlements and payouts agree.",
        href: "/platform/payment-reconciliation",
      },
      {
        title: "Reports and exports",
        description:
          "Export dashboards and reports for your team and your CA — financial and marketplace views, in formats they can use.",
        href: "/platform/reports",
      },
    ],
  },
  {
    id: "erp-connector",
    label: "ERP Connector",
    description: "Turning ecommerce transactions into detailed accounting inside your ERP.",
    items: [
      {
        title: "Order-wise accounting",
        description:
          "How each order becomes a complete set of accounting entries — revenue, charges, tax, receivable and COGS — posted to the ERP.",
        href: "/resources/help-center#orderwise-accounting",
      },
      {
        title: "GST-wise accounting",
        description:
          "How GST, TCS and TDS are captured per order and posted with the correct heads and rates inside the ERP's GST structure.",
        href: "/resources/help-center#gstwise-accounting",
      },
      {
        title: "Warehouse-wise accounting and stock transfers",
        description:
          "How inventory, COGS and stock transfers post against your ERP's warehouse masters without creating false revenue.",
        href: "/resources/help-center#warehousewise-accounting",
      },
      {
        title: "Returns and refunds",
        description:
          "How refunds reverse revenue, charges and tax at the order level, keeping the books aligned with the marketplace.",
        href: "/resources/help-center#returns-and-refunds",
      },
      {
        title: "TCS / TDS",
        description:
          "How tax collected on sales and tax deducted on payouts are captured and posted for reconciliation against marketplace statements.",
        href: "/resources/help-center#tcs-and-tds",
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    description: "Connect the marketplaces and ERP systems you already use.",
    items: [
      {
        title: "Amazon",
        description:
          "Connect Amazon seller data — orders, settlements, charges, refunds and inventory — for understanding and accounting.",
        href: "/integrations",
      },
      {
        title: "Flipkart",
        description:
          "Connect Flipkart order and settlement data and bring Flipkart accounting into your ERP in order-wise detail.",
        href: "/integrations",
      },
      {
        title: "Shopify",
        description:
          "Bring Shopify store and payment financial data together with your other marketplaces.",
        href: "/integrations",
      },
      {
        title: "Tally",
        description:
          "Post detailed, GST-ready entry vouchers into Tally with warehouse and tax mappings.",
        href: "/integrations",
      },
      {
        title: "SAP",
        description:
          "Map ecommerce accounting into your SAP chart of accounts, tax structures and warehouse masters.",
        href: "/integrations",
      },
      {
        title: "Zoho Books",
        description:
          "Post order-wise accounting to Zoho ledgers, tax profiles and warehouses.",
        href: "/integrations",
      },
    ],
  },
  {
    id: "support",
    label: "Support & billing",
    description: "Plans, billing and getting help.",
    items: [
      {
        title: "Pricing and plans",
        description:
          "How plans are sized by order volume, how billing cycles work, and what the no-per-seat model means for your team.",
        href: "/pricing",
      },
      {
        title: "Frequently asked questions",
        description:
          "Answers to common questions about the Platform, ERP Connector, reconciliation, GST, inventory and ERP integrations.",
        href: "/resources/faqs",
      },
      {
        title: "Contact support",
        description:
          "Reach DeepEcom for help with connections, reconciliations, ERP posting or anything else on the platform.",
        href: "/resources/help-center#contact-support",
      },
    ],
  },
]

export const HELP_FLAT: HelpItem[] = HELP_GROUPS.flatMap((g) => g.items)

export const HELP_HERO: HelpItem[] = [
  {
    title: "Connect a marketplace",
    description: "Amazon, Flipkart, Shopify, Meesho and more in a few minutes.",
    href: "/resources/help-center#connect-a-marketplace",
  },
  {
    title: "Set up your ERP",
    description: "Prepare Tally, SAP or Zoho for order-wise, GST-wise posting.",
    href: "/resources/help-center#set-up-your-erp",
  },
  {
    title: "Understand profitability",
    description: "Read product-level margin after charges, GST and refunds.",
    href: "/platform/profitability",
  },
  {
    title: "Reconcile payments",
    description: "Get settlements matched to orders and bank to a balance.",
    href: "/platform/payment-reconciliation",
  },
]