export interface Faq {
  question: string
  answer: string
}

export interface FaqGroup {
  id: string
  label: string
  faqs: Faq[]
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "general",
    label: "General",
    faqs: [
      {
        question: "What is DeepEcom?",
        answer:
          "DeepEcom is an accounting layer for ecommerce. It connects your marketplaces, understands your orders, reconciles your payments, and posts detailed accounting into your ERP. It does not replace your ERP — it makes it ecommerce-ready.",
      },
      {
        question: "How is pricing determined for DeepEcom?",
        answer:
          "Plans are sized by monthly order volume, billed quarterly. You can upgrade or downgrade as you grow, and there are no per-seat fees or hidden charges.",
      },
      {
        question: "Do I need accounting knowledge to use DeepEcom?",
        answer:
          "No. DeepEcom is built for business owners and accountants alike. Business users get dashboards, profitability and reconciliation views; accountants get order-wise, GST-wise accounting and ERP posting.",
      },
      {
        question: "Where is my data stored?",
        answer:
          "Marketplace data is fetched through secure, read-only APIs and stored on DeepEcom servers. You keep full read access at all times — DeepEcom never writes back to your marketplaces.",
      },
      {
        question: "Do you serve D2C brands as well as marketplace sellers?",
        answer:
          "Yes. DeepEcom brings website and marketplace financial data together, so D2C brands can see sales, payments and profitability from every channel in one place.",
      },
    ],
  },
  {
    id: "platform",
    label: "Platform & Profitability",
    faqs: [
      {
        question: "Will I need to manually upload files for accounting purposes?",
        answer:
          "No manual uploads required. Order data, settlement reports and commission details are fetched automatically from your connected marketplaces via API. For backdated data, you can also import historical reports.",
      },
      {
        question: "Is it possible to analyze profit and loss within DeepEcom?",
        answer:
          "Yes. DeepEcom provides P&L analysis at the SKU, order, channel and business level, with dashboards and exportable reports.",
      },
      {
        question: "Can I see which products and marketplaces actually make money?",
        answer:
          "Yes. Profitability is computed after marketplace charges, GST and refunds are attached per order, so product, SKU, marketplace and warehouse views reflect true margin — not just gross sales.",
      },
      {
        question: "How long does marketplace data take to appear in DeepEcom?",
        answer:
          "Order, settlement and payout data is pulled from your connected marketplaces through APIs on an ongoing basis. Dashboard numbers stay current without manual refreshes.",
      },
      {
        question: "Can I export reports from DeepEcom?",
        answer:
          "Yes. Dashboards and reports can be exported for your team and for your CA, so figures leave DeepEcom in a form your stakeholders can use.",
      },
    ],
  },
  {
    id: "reconciliation",
    label: "Payment Reconciliation",
    faqs: [
      {
        question: "How does DeepEcom reconcile marketplace payments?",
        answer:
          "DeepEcom imports settlement and payout data from each marketplace, links settlement lines back to orders, matches expected receivables against settlements, and matches settlements against your bank deposits. Anything unexplained is flagged for review.",
      },
      {
        question: "What happens when a settlement and an order don't match?",
        answer:
          "Differences are classified and surfaced — for example unanticipated fees, refunds, TCS/TDS, corrections or timing lags. Each difference is explained at the order level instead of being absorbed into a net total.",
      },
      {
        question: "Does DeepEcom reconcile refunds and returns?",
        answer:
          "Yes. Refunds are linked to their original orders and reverse the revenue, charge, tax and settlement lines they affect, including the corresponding GST treatment.",
      },
      {
        question: "Can I match settlements against my bank statement?",
        answer:
          "Yes. Payouts are matched against bank deposits, with payment-processing differences and splits handled per period and per currency.",
      },
    ],
  },
  {
    id: "accounting",
    label: "Ecommerce Accounting",
    faqs: [
      {
        question: "What does order-wise accounting mean in practice?",
        answer:
          "Every order produces its own complete set of entries — revenue, marketplace charges, GST, TCS/TDS, settlement receivable and COGS — instead of a single daily sales total. Each entry traces back to the marketplace order ID.",
      },
      {
        question: "Does DeepEcom account for all the expenses charged by Amazon and other marketplaces?",
        answer:
          "Yes — commissions, shipping, storage fees, advertising, refunds and compensation are extracted line-by-line from each settlement and categorized, so your true net payout is accurate.",
      },
      {
        question: "How does DeepEcom handle products with different names across marketplaces and ERP?",
        answer:
          "SKU mapping links listings that differ across platforms. Set mapping rules once and DeepEcom applies them everywhere, surfacing exceptions for review instead of guessing.",
      },
      {
        question: "Can I reconcile marketplace warehouse inventory with my books?",
        answer:
          "Yes. Stock events from each marketplace warehouse sync with valuation and location mapping, and stock transfers are posted warehouse-wise so physical and book inventory stay aligned.",
      },
      {
        question: "Can I sync data from previous fiscal years with DeepEcom?",
        answer:
          "Yes. Historical order and settlement data can be imported and reconciled order-by-order, generating vouchers for any past period.",
      },
    ],
  },
  {
    id: "gst",
    label: "GST, TCS & TDS",
    faqs: [
      {
        question: "Does DeepEcom handle GST for multiple states and GST numbers?",
        answer:
          "Yes. DeepEcom supports multiple GST numbers with state-wise reporting, so multi-state operations stay compliant without extra spreadsheets.",
      },
      {
        question: "How are TCS and TDS captured by DeepEcom?",
        answer:
          "TCS collected by the marketplace on eligible sales and TDS withheld on your payments are captured per order and per period, carried into GST-wise accounting, and posted with the right tax accounts so they reconcile to marketplace filings.",
      },
      {
        question: "Does DeepEcom file GST returns for me?",
        answer:
          "No. DeepEcom keeps accounting and returns data in GST-ready, per-head, per-rate structure so your CA can extract return data from your books and reconcile against marketplace filings quickly and accurately.",
      },
      {
        question: "How does GST on marketplace charges appear in the books?",
        answer:
          "Charges such as commission and fees are captured with their taxable value and GST head per order, so input credit is claimable and the detail supports reconciliation.",
      },
      {
        question: "What happens to GST when an order is returned?",
        answer:
          "The reversal of a refund reverses the original GST lines on the affected components, keeping return data and input/output GST consistent with the marketplace's own figures.",
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory & Warehouses",
    faqs: [
      {
        question: "Is it possible to integrate multiple warehouses into Tally using DeepEcom?",
        answer:
          "Yes. DeepEcom supports multi-warehouse inventory tracking with stock allocation and location mapping, so every warehouse syncs cleanly into Tally.",
      },
      {
        question: "How are stock transfers treated in accounting?",
        answer:
          "A stock transfer is posted as a movement between warehouse ledgers — not a sale. Source and destination locations are recorded so the ERP's warehouse masters mirror physical movement.",
      },
      {
        question: "Is inventory valued on a specific basis?",
        answer:
          "Inventory accounting follows your goods valuation method and is recorded warehouse-wise, so COGS realizes against the warehouse that actually fulfils each order.",
      },
    ],
  },
  {
    id: "erp",
    label: "ERP Connector & Integrations",
    faqs: [
      {
        question: "Which ERP systems does DeepEcom work with?",
        answer:
          "DeepEcom posts detailed accounting into Tally, SAP and Zoho Books, mapping each ERP's ledger, tax and warehouse structures.",
      },
      {
        question: "Does DeepEcom post one-by-one vouchers or monthly totals?",
        answer:
          "Entries are posted with order-level detail — order-wise, GST-wise and warehouse-wise — rather than monthly summaries, so the ERP's postings are traceable to individual orders.",
      },
      {
        question: "Which marketplaces can DeepEcom connect to?",
        answer:
          "DeepEcom connects Amazon, Flipkart, Shopify, Meesho and other supported channels through secure read-only APIs. New marketplaces are added based on customer demand — tell us which one you need.",
      },
      {
        question: "Is DeepEcom a replacement for my ERP?",
        answer:
          "No. DeepEcom does not replace the ERP. It makes the ERP ecommerce-ready: it connects marketplaces, understands each order, reconciles payments, and posts detailed accounting into your ERP.",
      },
      {
        question: "Do marketplace integrations require sharing my passwords?",
        answer:
          "No. Connections use secure, read-only marketplace credentials and APIs. DeepEcom only reads data and never writes back to your marketplaces.",
      },
    ],
  },
]

export const FAQ_FLAT: Faq[] = FAQ_GROUPS.flatMap((g) => g.faqs)

export function searchFaqs(query: string): Faq[] {
  const q = query.trim().toLowerCase()
  if (!q) return FAQ_FLAT
  return FAQ_FLAT.filter(
    (f) =>
      f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
  )
}