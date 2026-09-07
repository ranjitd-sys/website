import type { PostCategory, RelatedLink } from "./types"

export interface Post {
  id: string
  title: string
  description: string
  category: PostCategory
  date: string
  readingTime: string
  featured?: boolean
  highlight?: string
  related: RelatedLink[]
  body: string
}

export const POSTS: Post[] = [
  {
    id: "why-ecommerce-accounting-is-different",
    title: "Why ecommerce accounting is different from regular accounting",
    description:
      "An ecommerce order is never just a sale. It carries fees, taxes, returns, settlements and inventory events. Here is how one order becomes many accounting events.",
    category: "Accounting",
    date: "2026-02-02",
    readingTime: "6 min read",
    featured: true,
    highlight:
      "One order creates a sale, a set of marketplace charges, GST events, settlement and payouts, and inventory movements — each with its own accounting treatment.",
    related: [
      { label: "Ecommerce Accounting", href: "/resources/ecommerce-accounting", kind: "hub" },
      { label: "Order-wise accounting, explained", href: "/resources/blog/order-wise-accounting-explained", kind: "blog" },
      { label: "How GST flows from an order to your ERP", href: "/resources/blog/how-gst-flows-from-order-to-erp", kind: "blog" },
      { label: "Why ecommerce needs an accounting layer", href: "/resources/blog/why-ecommerce-needs-an-accounting-layer", kind: "blog" },
    ],
    body: `
A traditional sale is simple. You sell something, you record revenue, you record the cash that comes in, and you move on.

An ecommerce order is not simple. The marketplace that hosts your order slides a chain of events between the sale and the money that actually lands in your bank account. Fees are deducted, taxes are collected on your behalf, refunds move money around, and inventory is pulled from warehouses you may not even own.

None of this shows up in a single accounting entry. Each event is its own economic fact, and each fact needs its own accounting treatment.

## One order is many events

A single order can create all of the following:

| Event | What actually happens | Accounting effect |
| --- | --- | --- |
| Order and sale | The customer buys; the marketplace confirms the order. | Revenue recognised for accounting at the selling price. |
| Marketplace charges | The marketplace deducts fees, commission, and logistics charges. | Fees recorded as selling or operating expenses. |
| GST events | GST is charged on the sale and on several charges. | GST collected and input/output GST tracked for return data. |
| TCS / TDS | The marketplace deducts tax at source for eligible sales, and TDS applies to certain marketplace payments. | Tax liabilities and receivables recorded. |
| Refunds and returns | The customer returns; the marketplace reverses some or all of the sale. | Revenue reversal, charge reversals, and inventory-in accounting. |
| Settlement | The marketplace settles a net amount for the period. | A settlement receivable vs the amount received. |
| Payout | The net amount is paid to your bank. | Bank matched against settlement receivable. |
| Inventory out | Stock leaves fulfilment stock. | Cost of goods sold and stock movement recorded. |
| Stock transfers | Stock moves between warehouses. | A warehouse-wise stock movement, not a sale. |

Multiply that by thousands of orders a month, and the accounting surface grows far beyond what a sales register can describe.

## Why the events don't arrive together

The second complication is timing. The events for a single order do not reach you at the same time, from the same source, or in the same format.

- The sale event arrives from the marketplace order feed.
- Fee and tax data usually arrives with the settlement report.
- Settlement and payout arrive separately, and a settlement pools hundreds of orders.
- Returns arrive later, sometimes weeks after the original sale.

If you reconcile an order by expecting the sale, the fees, and the cash to arrive together, the books never quite balance. The sale exists today, the settlement arrives in a week, and a refund arrives after that.

## What "keeping the books" has to mean for ecommerce

Because of all this, ecommerce accounting is not just recording sales. It is:

- **Order-wise accounting** — each order produces a complete set of entries, not a daily sales total.
- **GST-wise accounting** — tax data is captured per order and per charge, so returns data can be reconstructed.
- **Marketplace-wise accounting** — deductions and charges are grouped so you can see what the platform actually cost you.
- **Warehouse-wise accounting** — inventory and stock transfer events are tracked at the location level.
- **Settlement awareness** — receivables from marketplaces are tracked and matched against payouts.

Entries also have to be posted into an ERP in a form the ERP can actually process — with the right ledgers, tax accounts, and GST heads for Tally, SAP, or Zoho.

## The bottom line

The order is the smallest unit of truth in ecommerce finance. Every other number — profitability, GST, cash received, inventory position — is derived from the events that order generates.

That is why ecommerce accounting needs an accounting layer rather than a sales register. The order has to be decomposed into its events, the events have to be reconciled, and the reconciled story has to land in your ERP as entries, not summaries.

DeepEcom is built around exactly that flow: connect the marketplaces, understand every order as a set of accounting events, reconcile the money, and post detailed accounting into your ERP.
`,
  },
  {
    id: "order-wise-accounting-explained",
    title: "Order-wise accounting, explained in plain words",
    description:
      "What it means to account every ecommerce order as its own set of journal entries — and why it beats daily sales summaries.",
    category: "Accounting",
    date: "2026-01-27",
    readingTime: "5 min read",
    highlight:
      "Instead of a daily sales total, each order produces its own revenue, charge, tax and settlement entries that can be traced back to the marketplace order.",
    related: [
      { label: "Ecommerce Accounting", href: "/resources/ecommerce-accounting", kind: "hub" },
      { label: "Why ecommerce accounting is different", href: "/resources/blog/why-ecommerce-accounting-is-different", kind: "blog" },
      { label: "What payment reconciliation really means", href: "/resources/blog/what-payment-reconciliation-means", kind: "blog" },
    ],
    body: `
A lot of accounting systems treat ecommerce like a cash register. Sales for the day become a single entry, marketplace remittances become another single entry, and the gap between them is left unexplained.

Order-wise accounting is a different discipline. Every order produces its own complete set of accounting entries, derived from that order's data.

## What an order actually generates

For one order, the entries typically cover:

- Revenue at the selling price.
- Marketplace charges — commission, fees, logistics, and other deductions.
- GST on the sale and on the charges.
- TCS / TDS where the rules apply.
- The receivable from the marketplace.
- Cost of goods sold and the inventory movement.

Each of these is traceable to the marketplace order ID. That traceability is the entire point.

## Revenue, but net of nothing

Under order-wise accounting, revenue is recorded at the selling price first. The marketplace charges are recorded as expenses against that revenue — they are not silently netted off the top.

Why does the distinction matter?

- GST is applied on the selling price and on several of the charges, so each component has to be visible.
- Gross margin shows up correctly: revenue, platform costs, and product costs are each line items.
- Reversals on returns are possible, because the original entry exists per order.

## Each charge is a line, not a black box

A marketplace remittance is usually a net number. Order-wise accounting decomposes that remittance back into its parts:

| Settlement line | What it maps to |
| --- | --- |
| Order value | Revenue recognised at order time |
| Commission and fees | Selling expense per order |
| GST collected | Output GST per charge |
| TCS / TDS | Respective ledgers and tax accounts |
| Refund value | Reversal of the original order entries |
| Net payout | Settlement receivable matched to bank |

The accounting and the settlement report refer to the same order, so the numbers agree by construction.

## What this means in an ERP

Inside the ERP, order-wise accounting means posting entries per order with full detail:

- Ledger accounts per order and per charge type.
- Tax accounts and GST heads on each affected line.
- Warehouse against inbound, outbound and stock transfer lines.
- Settlement and payout mapping so receivables clear.

For Tally, SAP or Zoho this is detailed, structured posting — not a daily summary pasted in at month-end.

## Why order-wise beats summaries

A summary hides the problem. Two orders can look identical in total and run in opposite directions once fees, refunds and TDS are separated out. Order-wise accounting keeps every discrepancy visible at the order level, which is also where it can actually be investigated.

That is what "account every transaction" means in practice: not a total, but the order, and every event it produced.
`,
  },
  {
    id: "how-marketplace-charges-affect-profitability",
    title: "How marketplace charges quietly change your profitability",
    description:
      "Commission, fees, shipping, and settlement deductions appear after the sale. Here is how to understand the platform's real cost and see true margin.",
    category: "Profitability",
    date: "2026-01-20",
    readingTime: "6 min read",
    highlight:
      "Real platform cost is buried in settlement reports. Breaking charges per order is what turns marketplace data into true product-level profitability.",
    related: [
      { label: "Payment Reconciliation", href: "/resources/reconciliation", kind: "hub" },
      { label: "Order-wise accounting, explained", href: "/resources/blog/order-wise-accounting-explained", kind: "blog" },
      { label: "What payment reconciliation really means", href: "/resources/blog/what-payment-reconciliation-means", kind: "blog" },
    ],
    body: `
The price a customer pays is not the margin you keep. Before any of it reaches you, the marketplace applies commission, fees, taxes and deductions — and the split only appears in the settlement report, days after the sale.

Profitability that ignores these deductions is inventory-level gross margin, not ecommerce profit.

## The charges that decide the margin

Most marketplaces deduct a set of charges per order:

| Charge | What it is |
| --- | --- |
| Commission | A percentage of the selling price for using the marketplace. |
| Fixed / referral fee | Flat fee per successful order. |
| Shipping and logistics | Fulfilment performed or arranged by the marketplace. |
| Collection / payment handling | Fee for collecting and remitting payment. |
| Advertising (optional) | Ad spend tied to the order. |
| Returns-related charges | Fees for reversals and return logistics. |

Each appears at a different place and time, and frequently as part of a pooled settlement.

## The timing problem

You will see the selling price on order day. You will see the charges on settlement day. In between, the dashboard your team looks at usually shows sales that have not yet paid their true cost.

Unless charges are linked back to orders, profitability is systematically overstated until months later — and then corrected by a single scary settlement.

## Per-order = true margin

The fix is to decompose the settlement and attach every charge line to the order that generated it:

- Selling price per order.
- Minus product cost (COGS).
- Minus the order's specific commission, fees, logistics and ad costs.
- Minus the GST impact where it matters to margins.
- Plus or minus returns and refund reversals.

The result is order-level and product-level profitability that actually predicts the cash that will arrive.

## Categories of the profit story

Useful profitability numbers come from the same data with different cuts:

- **Product / SKU level.** Which listings earn their space, after platform cost.
- **Marketplace level.** Which channel is genuinely cheapest to sell on.
- **Warehouse level.** Where fulfilment cost and stock transfers hurt margin.
- **Period level.** Margin trend and settlement lags.

## What DeepEcom does with these numbers

DeepEcom puts the marketplace's own data structure to work: charges are recognised per order, settlements are tied to orders, and profitability is computed from the reconciled view — sales, fees, GST, refunds and payouts — instead of from sales alone.

Platform cost stops being a mystery that appears in settlements. It becomes part of every product, marketplace and warehouse decision.
`,
  },
  {
    id: "what-payment-reconciliation-means",
    title: "What payment reconciliation really means for marketplace sellers",
    description:
      "Settlements pool hundreds of orders into one net payment. Reconciliation is how expected, earned, deducted and received come back into agreement.",
    category: "Reconciliation",
    date: "2026-01-13",
    readingTime: "6 min read",
    featured: true,
    highlight:
      "A settlement is not a payment for one order — it is the net of sales, charges, refunds and taxes across many orders. Reconciling it means explaining every rupee.",
    related: [
      { label: "Payment Reconciliation", href: "/resources/reconciliation", kind: "hub" },
      { label: "Why ecommerce accounting is different", href: "/resources/blog/why-ecommerce-accounting-is-different", kind: "blog" },
      { label: "How TCS and TDS appear in marketplace accounting", href: "/resources/blog/tcs-and-tds-in-marketplace-accounting", kind: "blog" },
    ],
    body: `
When a marketplace pays you, it does not pay you for an order. It settles a net amount for a period, pooling sales, refunds, charges and taxes across many orders into one number.

Living with that net number is why reconciling ecommerce payments feels hard.

## What a settlement contains

A single settlement line can bundle:

- Sales value for orders in the period.
- Commission, fixed fees, logistics and other charges.
- Refunds and their fee reversals.
- GST collected on sales and on charges.
- TCS / TDS where applicable.
- Adjustments, corrections, and clawbacks.

The marketplace reports the breakdown — but it understands the breakdown in terms of its own order and settlement data.

## The reconciliation problem, stated precisely

On one side you have "what you expected": orders sold, at their selling price, minus what you know you owe in charges. On the other side you have "what you received": bank deposits from settlements.

Reconciliation is closing the gap between the two, item by item, until:

- Every expected receivable has a matching settlement.
- Every settlement has a matching bank deposit.
- Every difference — a charge you did not anticipate, a refund, TDS, a correction — is identified and explained.

When nothing is left unexplained, the marketplaces, your books, and your bank all agree.

## What usually causes the gap

| Difference | Cause |
| --- | --- |
| Fees you did not anticipate | Charges appear in settlements, not in the order feed. |
| Refunds and reversals | Returns arrive after the original settlement. |
| TCS / TDS | Tax withheld per marketplace rules. |
| Exchange and payment processing | Bank-level differences on the payout. |
| Corrections and clawbacks | Marketplace adjusts prior period errors. |
| Settlement lags | Orders settle in a later period than the sale. |

None of these are "losses" in themselves. They are timing and classification differences — but they have to be visible and explained, not absorbed into a net total.

## How to actually reconcile at scale

At one or two orders a day, you can read a settlement line by line. At hundreds or thousands of orders, the same process has to be computed:

- Import settlement and payout data from each marketplace.
- Link settlement lines back to the orders they belong to.
- Match expected receivables against settlements.
- Match settlements against bank deposits.
- Flag the residue — differences that no rule produced — for a human to review.

The outcome is a position where receivables, settlements, and bank all reconcile, and the residue is exactly zero or fully explained.

## What reconciliation makes possible further downstream

A reconciled view is the input accounting needs. Once every event is explained at order level, GST-wise and warehouse-wise accounting can be produced from trustworthy data, and ERP entries can be posted without guesswork.

DeepEcom treats reconciliation not as a spreadsheet task but as the engine that turns raw marketplace data into clean accounting data.
`,
  },
  {
    id: "tcs-and-tds-in-marketplace-accounting",
    title: "How TCS and TDS appear in marketplace accounting",
    description:
      "Ecommerce marketplaces collect TCS on sales and deduct TDS on merchant payments. Here is what both mean for your receivable and your GST-ledger reconciliation.",
    category: "GST",
    date: "2026-01-08",
    readingTime: "5 min read",
    highlight:
      "TCS is collected on the sale and remitted to the government; TDS is withheld by the marketplace on payments to you. Both must be captured per order to reconcile GST returns and receivables.",
    related: [
      { label: "GST for Ecommerce", href: "/resources/gst", kind: "hub" },
      { label: "How GST flows from an order to your ERP", href: "/resources/blog/how-gst-flows-from-order-to-erp", kind: "blog" },
      { label: "What payment reconciliation really means", href: "/resources/blog/what-payment-reconciliation-means", kind: "blog" },
    ],
    body: `
Marketplace payments are not paid to you gross. Two kinds of tax flows get subtracted or collected along the way: TCS (collected by the marketplace on sales) and TDS (withheld by the marketplace when it pays you).

Both are real money that never reaches your bank account. Both have to appear in your accounting, or your receivables and your tax registers will silently disagree.

## TCS on ecommerce sales

When a marketplace sells on your behalf, it collects Tax Collected at Source from the buyer on the sale value (where the rules apply). Key facts for accounting:

- TCS is collected by the marketplace, not by you directly.
- It is reflected in the settlement report as a deduction or a pass-through.
- The marketplace files and remits TCS against your PAN.
- You claim it as available TCS in your returns, matching the marketplace's filing.

In your books, TCS shows up as a tax collected account that must reconcile against the marketplace's TCS statement.

## TDS on marketplace payments

Separately, when the marketplace settles money to you, it may withhold Tax Deducted at Source as a payer. The effect:

- The payout is lower than the settlement amount by the TDS.
- The marketplace issues a TDS certificate you can use.
- In your accounting, TDS withheld becomes a tax asset, not a cost.

TDS and TCS are not deductible expenses and not suspense figures. They are tax-related receivables and liabilities that must be tracked per marketplace and per period.

## Where they collide with settlements

Settlements carry both effects as line items:

| Settlement line | Type | Accounting treatment |
| --- | --- | --- |
| Sales value collected | TCS collected on sales | Tax collected account, reconcile to TCS return |
| TDS withheld on payout | TDS deducted by marketplace | Tax deducted at source receivable |
| Net payout | Remitted to bank | Matches after both are recorded |

If either is missing from the books, the payout will appear short and your GST-ledger data will not tie to the marketplace statements.

## What has to be captured per order

To reconcile any of this, the data needs to live at order level:

- Eligible sales with their TCS rates and amounts.
- TDS heads and amounts applied per period or per payment.
- Which orders / settlements each TCS and TDS line belongs to.
- Filing periods so the figures can be cross-checked against GST returns and TDS certificates.

When that detail exists, TCS and TDS stop being reconciliation mysteries and become two more explained rows in a clean monthly close.

## DeepEcom and tax reconciliation

DeepEcom carries TCS and TDS as first-class data: captured from marketplace data, reported per order, and carried into order-wise and GST-wise accounting so the ERP posting remains complete and traceable.
`,
  },
  {
    id: "how-gst-flows-from-order-to-erp",
    title: "How GST flows from an order into your ERP",
    description:
      "Follow one order's GST data — taxable value, rate, output tax, input tax, plus TCS — from the marketplace down to GST-wise accounting and ERP posting.",
    category: "GST",
    date: "2025-12-18",
    readingTime: "5 min read",
    highlight:
      "GST is not a single number per order. Sales, marketplace charges and reverse situations each carry their own taxable value and rate, and each needs its own line in accounting.",
    related: [
      { label: "GST for Ecommerce", href: "/resources/gst", kind: "hub" },
      { label: "Order-wise accounting, explained", href: "/resources/blog/order-wise-accounting-explained", kind: "blog" },
      { label: "How TCS and TDS appear in marketplace accounting", href: "/resources/blog/tcs-and-tds-in-marketplace-accounting", kind: "blog" },
    ],
    body: `
GST is usually where marketplace data and accounting disagrees the most. The marketplace reports tax in its own terms; the ERP needs it in GST terms. Bridging the two is a specific, mechanical job.

Here is the path one order's GST takes.

## Step 1 — The order carries taxable events

A single order typically attracts GST on more than one component:

| Component | What carries GST |
| --- | --- |
| Sale of goods | Output GST on the taxable value. |
| Marketplace charges | GST on commission and fees where applicable. |
| Reverse / unregistered rules | Situations where the recipient accounts for tax. |

Each component has its own rate and its own GST head. A total or a blended rate flattens all of this into something useless for returns.

## Step 2 — Marketplace data records the tax

Marketplace reports capture the GST values at order and settlement level: taxable value, HSN/SAC, rate, and the GST collected. TCS on ecommerce sales is tracked separately.

The data exists — but in the marketplace's format, keyed to its own order and settlement identifiers.

## Step 3 — Accounting needs GST-wise structure

For GST-wise accounting, the captured data must be re-expressed per head:

- Output GST on sales, broken by rate.
- Input GST on marketplace charges, eligible for claim.
- TCS available, mapped to the marketplace's filings.
- GST on refunds, reversing the original tax lines.

Every line must trace back to an order, so a return value or an input credit can be questioned and answered.

## Step 4 — The ERP receives GST-ready entries

The ERP posts entries with the right GST head and tax account per line. For Tally, this means GSTR-ready ledgers; for SAP and Zoho, mapping to their tax structures.

The ERP is not being asked to reinvent the GST data. It is receiving accounting that is already GST-correct and order-traceable.

## Step 5 — Returns and books agree

Because the tax data was captured per order and posted per head:

- GST returns can be reconstructed from the books.
- TCS and TDS statements reconcile to marketplace filings.
- Input credit claims are supported by the underlying invoices and ledger lines.

## What makes the flow survive scale

At low volume, a spreadsheet can hold the GST data. At scale, the flow has to be computed: every order decomposed, every head classified, every posting built and mapped into the ERP.

That is exactly what DeepEcom does between the marketplace and your ERP — turning order-level GST data into GST-wise accounting your books can reconcile.
`,
  },
  {
    id: "why-ecommerce-needs-an-accounting-layer",
    title: "Why ecommerce needs an accounting layer between marketplaces and the ERP",
    description:
      "Your ERP is built for postings, not for marketplace feeds. The accounting layer is what turns raw ecommerce data into ERP-ready accounting.",
    category: "ERP",
    date: "2025-12-08",
    readingTime: "7 min read",
    featured: true,
    highlight:
      "The ERP is the system of record. The accounting layer is what makes the ERP ecommerce-ready — feeding it order-wise, GST-wise, warehouse-wise entries it can actually process.",
    related: [
      { label: "ERP Integration", href: "/resources/erp", kind: "hub" },
      { label: "Order-wise accounting, explained", href: "/resources/blog/order-wise-accounting-explained", kind: "blog" },
      { label: "How GST flows from an order to your ERP", href: "/resources/blog/how-gst-flows-from-order-to-erp", kind: "blog" },
    ],
    body: `
There is a reason so many ecommerce companies run their marketplace finance in spreadsheets next to their ERP. The ERP is very good at postings and bad at marketplace feeds, and the layer that should translate between the two usually does not exist.

## What an ERP is actually good at

An ERP — Tally, SAP, Zoho — is a system of record. It holds chart of accounts, GST ledgers, warehouse masters, and posting rules. It is built to reliably record an accountant's entries.

What it is not built for is the messy, delayed, cross-referenced data that comes out of marketplaces:

- Settlement reports keyed to statement IDs, not invoice numbers.
- Refunds weeks after the original sale.
- Charge types in the marketplace's vocabulary.
- TCS and TDS embedded in payouts.

## The mismatch, made concrete

| Your ERP expects | Marketplaces provide |
| --- | --- |
| A clean sales invoice | An order feed with a settlement later |
| Net revenue | Gross sale minus charges you must decompose |
| Cash on receipt | Payouts pooled across many orders |
| One tax line | GST per charge, TCS and TDS on top |
| Leading inventory | Warehouse stock movements |
| Gradual reconciliation | A monthly settlement mystery |

Pumping the second column unchanged into the first produces books that nobody can reconcile.

## The accounting layer

The accounting layer sits between the marketplaces and the ERP. It does four jobs in sequence:

**Connect.** Aggregate order, settlement, payout, inventory and return data from every marketplace into one structured store.

**Understand.** Turn raw events into order-wise facts: what was sold, what was charged, what tax applies, what inventory moved.

**Reconcile.** Match expected, settled and received money until receivables, settlements and bank agree.

**Account.** Build detailed accounting entries — order-wise, GST-wise, warehouse-wise — and post them into the ERP in the ERP's own structure.

## Why the ERP does not do this itself

Automating it inside the ERP would mean teaching the ERP marketplace semantics: multiple settlement formats, evolving charge types, TCS variants, warehouse-led fulfilment. That work changes monthly and belongs to a layer whose entire job is eating structured ecommerce data.

The ERP stays the canonical ledger. The accounting layer makes the ERP ecommerce-ready.

## What changes when the layer exists

- The books are per order, not monthly summaries.
- GST-wise and warehouse-wise detail exists behind the totals.
- Marketplaces, bank, and ERP reconcile to the same numbers.
- Month-end stops being a chase and becomes a review.

## DeepEcom as that layer

DeepEcom does not replace the ERP. DeepEcom makes the ERP ecommerce-ready — connecting marketplaces, understanding every order, reconciling every payout, and posting detailed accounting into Tally, SAP and Zoho.
`,
  },
  {
    id: "warehouse-wise-inventory-and-stock-transfers",
    title: "Warehouse-wise accounting: why inventory must be tracked where it moves",
    description:
      "Stock transfers and multi-warehouse fulfilment create accounting events that are not sales. Here is how warehouse-wise movement stays traceable.",
    category: "Inventory",
    date: "2025-11-20",
    readingTime: "5 min read",
    highlight:
      "A stock transfer is not revenue and not a cost — it is a movement between locations that still must land accurately in the books and the ERP warehouse masters.",
    related: [
      { label: "Ecommerce Accounting", href: "/resources/ecommerce-accounting", kind: "hub" },
      { label: "Order-wise accounting, explained", href: "/resources/blog/order-wise-accounting-explained", kind: "blog" },
      { label: "Why ecommerce accounting is different", href: "/resources/blog/why-ecommerce-accounting-is-different", kind: "blog" },
    ],
    body: `
Inventory in ecommerce rarely sits in one place. It is distributed across warehouses and fulfilment centres, moves between them, and gets consumed from whichever location actually ships the order.

For accounting, that creates events that have nothing to do with selling.

## Not every inventory event is a sale

| Event | Accounting treatment |
| --- | --- |
| Sale from a warehouse | COGS recognised, stock reduced at that warehouse. |
| Purchase into a warehouse | Stock and payable recorded at the receiving location. |
| Stock transfer out | Asset moves between warehouse locations. |
| Stock transfer in | Asset lands at the destination warehouse. |
| Return to stock | Inventory returns to a warehouse, reversing COGS where applicable. |

A stock transfer, in particular, is not revenue and not a cost. It is the movement of an asset between locations — yet if it is not recorded warehouse-wise, the ERP's stock and the marketplace's fulfilment data drift apart.

## Why warehouse-wise detail matters

- GST data and inventory data both key off locations.
- Fulfilment costs are decided by which warehouse ships.
- P&L by warehouse is only possible if movement is coded to locations.
- Your ERP's warehouse masters stay balanced with reality.

Aggregate it all into "total stock", and none of the above is answerable.

## How the accounting should represent it

Per order and per stock transfer, DeepEcom captures the source warehouse, destination, item, quantity and valuation. That becomes:

- COGS lines against the correct warehouse.
- Stock transfer entries between warehouse ledgers.
- Return-to-stock lines reversing cost where sales reversed.

For Tally, SAP and Zoho, posting respects the ERP's warehouse master so the ERP mirrors physical movement.

## The result

When accounting is warehouse-wise, "stock damage" and "stock transfers" are ordinary, auditable events instead of mystery adjustments. Multi-warehouse ecommerce stops being a reconciliation problem and becomes a routine part of the monthly close.
`,
  },
]