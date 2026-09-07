import type { RelatedLink } from "./types"

export interface Guide {
  id: string
  title: string
  description: string
  topic: string
  level: "Foundational" | "Intermediate"
  readingTime: string
  chapters: string[]
  related: RelatedLink[]
  body: string
}

export const GUIDES: Guide[] = [
  {
    id: "ecommerce-accounting",
    title: "Ecommerce accounting for marketplaces",
    description:
      "A practical foundation: how orders, charges, GST, refunds, settlements and inventory each become accounting events — and how they land in an ERP.",
    topic: "Ecommerce Accounting",
    level: "Foundational",
    readingTime: "10 min read",
    chapters: [
      "Why an order is not a sale",
      "The event map of an order",
      "Order-wise accounting",
      "GST-wise accounting",
      "Warehouse-wise accounting",
      "Settlement and payout accounting",
      "Posting into your ERP",
    ],
    related: [
      { label: "Ecommerce Accounting", href: "/resources/ecommerce-accounting", kind: "hub" },
      { label: "Why ecommerce accounting is different", href: "/resources/blog/why-ecommerce-accounting-is-different", kind: "blog" },
      { label: "Order-wise accounting, explained", href: "/resources/blog/order-wise-accounting-explained", kind: "blog" },
    ],
    body: `
This guide lays out the working model of ecommerce accounting that marketplace sellers operate under. Read it with a real order in mind and the concepts become concrete quickly.

## Why an order is not a sale

A sale is one economic fact. An ecommerce order is a bundle of facts: the sale, the charges the marketplace applies, the GST on several components, TCS or TDS, and later a refund, a settlement and a payout.

The marketplace reports these facts across different feeds and different times. Accounting for ecommerce therefore means decomposing each order into its events and mapping each event to its accounting treatment.

## The event map of an order

| Event | Accounting treatment |
| --- | --- |
| Order and sale | Revenue at selling price |
| Commission, fees, logistics | Selling or operating expenses |
| GST on sale and charges | Output / input tax per head |
| TCS / TDS | Tax collected / tax deducted ledger positions |
| Refund and return | Revenue and charge reversals; stock-in |
| Settlement | Receivable movement against orders |
| Payout | Bank against settlement receivable |
| Inventory out | COGS and stock movement |
| Stock transfer | Movement between warehouses |

Keep this map. Every entry in a clean ecommerce close is one of these lines, traceable to an order.

## Order-wise accounting

Account per order, not per day. Each order produces its own revenue ledger line, charge lines, tax lines, settlement receivable and COGS movement. Summaries at month-end hide nothing but also answer nothing.

The defining property: the journal entries refer to the marketplace order, so the books can always be questioned down to a specific transaction and the settlement report will agree by construction.

## GST-wise accounting

Marketplace tax data must be restated per head: output GST by rate on sales, input GST on charges, GST on refunds, and TCS and TDS mapped to the marketplace's own filings. Aggregate tax totals are not enough — returns, input credits and TCS statements are reconciled per head and per rate.

## Warehouse-wise accounting

Inventory moves between warehouses and fulfilment centres, and a transfer is not a sale. Capture source and destination per movement, recognise COGS against the shipping warehouse, and post stock transfers between warehouse ledgers so the ERP mirrors physical movement.

## Settlement and payout accounting

A settlement pools many orders into a net payable. Track settlement receivables per marketplace, match payouts to bank deposits, and resolve the residue — unanticipated charges, refunds, TCS/TDS, corrections — until marketplaces, books and bank agree. This is the reconciliation discipline described in its own guide.

## Posting into your ERP

The ERP is the system of record and it expects structured postings. Order-wise accounting becomes ERP posting by mapping each line to ledger accounts, tax heads, warehouse masters and GST structures in Tally, SAP or Zoho. Detailed posting — not a monthly sales summary — is what keeps the ERP trustworthy.

## Where DeepEcom fits

DeepEcom automates this entire chain: it connects marketplaces, decomposes their data into order-wise events, reconciles settlements and payouts, builds GST-wise, warehouse-wise accounting, and posts the result into your ERP. The ERP remains your system of record.
`,
  },
  {
    id: "payment-reconciliation",
    title: "Reconciling marketplace payments and payouts",
    description:
      "From expected to received: how to match orders, settlements and bank deposits, find the residue, and reach a position where nothing is unexplained.",
    topic: "Reconciliation",
    level: "Intermediate",
    readingTime: "9 min read",
    chapters: [
      "The three numbers that must agree",
      "Expected — from orders",
      "Received — settlements and payouts",
      "Matching orders to settlements",
      "Matching settlements to bank",
      "Explaining the residue",
      "Reconciliation at scale",
    ],
    related: [
      { label: "Payment Reconciliation", href: "/resources/reconciliation", kind: "hub" },
      { label: "What payment reconciliation really means", href: "/resources/blog/what-payment-reconciliation-means", kind: "blog" },
      { label: "Ecommerce accounting for marketplaces", href: "/resources/guides/ecommerce-accounting", kind: "guide" },
    ],
    body: `
Reconciliation answers one question precisely: does the money you expected equal the money you received, and if not, have you explained every part of the difference?

## The three numbers that must agree

1. **Expected.** What the orders say you are owed.
2. **Settled.** What the marketplace says it paid you for the period.
3. **Received.** What actually landed in your bank.

The gap between 1 and 3 is the sum of everything that happened in between — charges, refunds, taxes, timing. Reconciliation is closing that gap line by line.

## Expected — from orders

Expected starts from the order feed: selling prices per order. It already differs from "received" because it is gross of the charges you owe and the taxes the marketplace handles.

## Received — settlements and payouts

The settlement report restates your sales minus charges, refunds with their reversals, GST, and TCS/TDS. The payout is the net amount the marketplace actually remits, sometimes minus additional items like TDS and processing adjustments.

## Matching orders to settlements

Each settlement line refers to orders. Link them:

| Settlement line | Matches to |
| --- | --- |
| Order value | Expected sales per order |
| Commission and fees | Charge lines per order |
| Refund value | Reversal of prior order entries |
| TCS / TDS | Tax positions per order and period |
| Net amount | The settlement total |

When the settlement and the order-level view refer to the same identifiers, the two numbers agree by construction.

## Matching settlements to bank

Larger movements, per-period and per-currency deposits, payment-processing differences, and fractions of a period can split a settlement across multiple bank lines. Match each deposit to its settlement, and flag why one expected payment is split.

## Explaining the residue

Even after matching, a residue usually remains. The goal is not zero residue — it is residue that is fully explained:

- A refund that arrived after the original settlement.
- A charge introduced by a marketplace policy change.
- TDS on the payout not visible in the order feed.
- A correction or clawback of a prior period.

Track each residual bucket with counts and amounts. When every bucket is explained, the close can be trusted.

## Reconciliation at scale

At hundreds or thousands of orders, do this algorithmically:

1. Import settlement and payout data from each marketplace.
2. Link settlement lines to orders.
3. Match expected to settled.
4. Match settled to bank.
5. Report the residue, with every residual line flagged for review.

## What comes after reconciliation

Reconciled data is the input for trustworthy accounting. Once events are explained at order level, GST-wise and warehouse-wise accounting and ERP posting rest on facts instead of guesses.
`,
  },
  {
    id: "gst-for-ecommerce",
    title: "GST for ecommerce marketplaces",
    description:
      "Taxable value, rates, TCS, TDS, refunds and return data — how GST behaves in marketplace selling and what that means for your accounting and your returns.",
    topic: "GST",
    level: "Foundational",
    readingTime: "9 min read",
    chapters: [
      "GST events in a marketplace sale",
      "Taxable value and rates",
      "GST on marketplace charges",
      "TCS on ecommerce sales",
      "TDS on marketplace payments",
      "Refunds and return data",
      "From GST data to GST-wise accounting",
    ],
    related: [
      { label: "GST for Ecommerce", href: "/resources/gst", kind: "hub" },
      { label: "How GST flows from an order to your ERP", href: "/resources/blog/how-gst-flows-from-order-to-erp", kind: "blog" },
      { label: "How TCS and TDS appear in marketplace accounting", href: "/resources/blog/tcs-and-tds-in-marketplace-accounting", kind: "blog" },
    ],
    body: `
Marketplace GST is complicated because one order produces several tax-relevant components, reported by the marketplace in its own format. This guide maps each component to the accounting it needs.

## GST events in a marketplace sale

A typical marketplace sale attracts GST on more than the goods:

- Output GST on the sale of goods.
- GST on marketplace charges such as commission, where applicable.
- Taxable events on reverse-charge situations.
- TCS collected by the marketplace on eligible sales.
- TDS withheld by the marketplace on payment to you.

Each has its own taxable value, rate and GST head.

## Taxable value and rates

The taxable value is the value on which tax is charged, and the rate is per the applicable HSN/SAC. Both must be captured per order and per charge. A blended or averaged rate is not usable for returns; per-rate totals per head are what your books need.

## GST on marketplace charges

Marketplace fees, commission and logistics can carry their own GST. If treated as a lump sum without per-charge tax, input credit is misstated and reconciliations fail. Capture the charge, its taxable value and its GST head for each order.

## TCS on ecommerce sales

Under the ecommerce TCS regime, the marketplace collects Tax Collected at Source from the buyer on eligible sales, remits it, and reports it against your PAN. In your books TCS is a tax-collected position that must reconcile against the marketplace's filings and your returns.

## TDS on marketplace payments

When the marketplace settles to you, it may withhold TDS as a payer. The payout is lower than the settlement; the withheld amount is a tax-receivable backed by a TDS certificate. It is not a cost.

## Refunds and return data

A refund reverses the original sale and its GST, and any recharge of charges and taxes on the return depends on the marketplace's rules. Because the original entries are per order, the reversal is a clean set of negative or reversing lines, including the tax.

## From GST data to GST-wise accounting

The end state is accounting that is structured by GST head and rate, traceable per order, and posted into the ERP with the correct tax accounts and GST structures — ready for return data extraction and reconciliation against marketplace filings.

DeepEcom captures TCS and TDS as first-class data and produces order-wise, GST-wise accounting your books and your returns can agree on.
`,
  },
  {
    id: "marketplace-profitability",
    title: "Measuring true marketplace profitability",
    description:
      "Sales minus product cost is not profit. How to reach order-level and product-level margin after platform charges, GST, returns and fulfilment.",
    topic: "Profitability",
    level: "Intermediate",
    readingTime: "8 min read",
    chapters: [
      "Where margin actually disappears",
      "The true profitability formula",
      "Order-level profitability",
      "Product and SKU profitability",
      "Marketplace channel views",
      "Warehouse-level cost",
      "From numbers to decisions",
    ],
    related: [
      { label: "Platform", href: "/platform/profitability", kind: "hub" },
      { label: "How marketplace charges change your profitability", href: "/resources/blog/how-marketplace-charges-affect-profitability", kind: "blog" },
      { label: "What payment reconciliation really means", href: "/resources/blog/what-payment-reconciliation-means", kind: "blog" },
    ],
    body: `
The gap between "sales" and "money in the bank" is filled with platform charges, taxes and timing. Profitability that ignores them is optimism. This guide sets out the numbers that actually drive decisions.

## Where margin actually disappears

Gross margin disappears in the layers between the selling price and cash:

- Commission and referral fees.
- Shipping and logistics (you or the marketplace).
- Collection and payment-handling charges.
- Ad spend tied to orders.
- GST impact on returns and charges.
- Refund reversals that claw back prior margin.

Each layer is small until it is quantified per order — then it is usually the biggest single cost after product cost.

## The true profitability formula

Order-level profit needs this chain:

| Component | Source |
| --- | --- |
| Selling price | Order feed |
| minus Product cost (COGS) | Your item cost |
| minus Platform charges | Settlement, linked per order |
| minus Shipping / logistics | Per-order fulfilment cost |
| minus Ad spend (if allocatable) | Marketplace ad data |
| minus / plus GST and refund effects | Tax and return data |
| equals Order profit | The number decisions need |

## Order-level profitability

Once charges are attached per order, every order gets a real profit. That makes it possible to answer: which orders, products and customers earn their keep.

## Product and SKU profitability

Roll order-level profit up per product and per SKU. Listings that are heavily discounted, returns-heavy, or commission-heavy surface immediately. Gross margin hides them.

## Marketplace channel views

The same product on two marketplaces usually carries different commission, logistics and ad economics. Channel-level profitability — after all platform costs — tells you where to invest supply and where to negotiate.

## Warehouse-level cost

Fulfilment cost and stock-transfer expenses are keyed to warehouses. Profitability by warehouse separates the decisions you control (where you stock) from marketplace economics you negotiate.

## From numbers to decisions

Useful profitability answers, in order:

1. Which SKUs are profitable after platform cost?
2. Which marketplaces are cheapest after all charges?
3. Which warehouses cost the most to fulfil from?
4. What is true margin on any given order?

When these are current and per order, pricing, inventory and channel decisions stop being guesses.
`,
  },
  {
    id: "erp-integration",
    title: "Making your ERP ecommerce-ready",
    description:
      "Why ERP posting fails with raw marketplace data, what detail the ERP actually needs, and how order-wise, GST-wise, warehouse-wise entries get posted into Tally, SAP and Zoho.",
    topic: "ERP",
    level: "Intermediate",
    readingTime: "10 min read",
    chapters: [
      "The ERP's language versus the marketplace's",
      "What the ERP needs from ecommerce",
      "Preparing order-wise entries",
      "GST-wise and tax-ready posting",
      "Warehouse and inventory masters",
      "Working with Tally, SAP and Zoho",
      "Daily, not month-end",
    ],
    related: [
      { label: "ERP Integration", href: "/resources/erp", kind: "hub" },
      { label: "Why ecommerce needs an accounting layer", href: "/resources/blog/why-ecommerce-needs-an-accounting-layer", kind: "blog" },
      { label: "Order-wise accounting, explained", href: "/resources/blog/order-wise-accounting-explained", kind: "blog" },
    ],
    body: `
An ERP is the system of record. The obstacle to ecommerce is translation: marketplace data arrives in the marketplace's vocabulary, while the ERP posts in yours. This guide covers the translation.

## The ERP's language versus the marketplace's

| ERP vocabulary | Marketplace vocabulary |
| --- | --- |
| Ledger accounts, tax heads | Order, settlement and charge types |
| Invoice and voucher numbers | Order IDs, statement IDs, settlement IDs |
| GST structures per return | GST values embedded in reports |
| Warehouse master | Fulfilment centres |

Posting fails when the two are merged instead of translated.

## What the ERP needs from ecommerce

Before anything reaches the ERP, it must be:

- **Order-wise** — each order as its own set of entries.
- **GST-wise** — tax per head and rate, not totals.
- **Warehouse-wise** — movement and COGS at the location level.
- **Traceable** — every entry points at the marketplace order.
- **Reconciled** — receivable, settlement and bank agree.

## Preparing order-wise entries

Build per-order: revenue, marketplace charges, GST lines, TCS/TDS positions, settlement receivable, COGS and stock movement. Each maps to an ERP ledger. Verified against the settlement report, the set of entries is complete.

## GST-wise and tax-ready posting

Entries carry the correct GST head and rate per line, so the ERP's own GST structures accept them. Return data can be extracted from the ERP because the detail is already there at the right granularity.

## Warehouse and inventory masters

Inventory and stock-transfer lines post against your ERP's warehouse masters. COGS is recognised at the shipping warehouse; transfers move stock between locations without creating false revenue.

## Working with Tally, SAP and Zoho

Each ERP receives the same accounting in its own structure:

| ERP | Posting shape |
| --- | --- |
| Tally | GST-ready ledgers, entry vouchers per order |
| SAP | Mapping to your chart of accounts and tax structures |
| Zoho | Postings to ledgers, tax profiles and warehouse masters |

The mapping differences are handled in the layer that posts, keeping source accounting identical.

## Daily, not month-end

The effect of the layer is that the ERP is current continuously: every order accounted, every settlement reconciled, every stock movement posted. Month-end becomes a review of completed work — not a reconstruction of the month.

DeepEcom plays exactly this role: it does not replace your ERP; it makes your ERP ecommerce-ready.
`,
  },
]