import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "@/components/landing/ui/accordion"

const FAQS: [string, string][] = [
  [
    "Can DeepEcom integrate with Amazon, Flipkart and other marketplaces?",
    "Yes. DeepEcom integrates with Amazon, Flipkart, Meesho, Myntra, Nykaa, Shopify and JioMart through secure read-only APIs. New marketplaces are added regularly based on customer demand — tell us which one you need.",
  ],
  [
    "Is it possible to integrate multiple warehouses into Tally using DeepEcom?",
    "Absolutely. DeepEcom supports multi-warehouse inventory tracking with proper stock allocation and location mapping, so every warehouse syncs cleanly into Tally.",
  ],
  [
    "My business operates in multiple states with different GST numbers. Can DeepEcom accommodate this?",
    "Yes. The Emerging and Scaling plans support two or more GST numbers with state-wise reporting, so multi-state operations stay compliant without extra spreadsheets.",
  ],
  [
    "Will I need to manually upload files for accounting purposes?",
    "No manual uploads required. Settlement reports, order data and commission details are fetched automatically from your connected marketplaces via API. For backdated data, you can also drag-and-drop PDF or CSV reports.",
  ],
  [
    "Can I sync data from previous fiscal years into Tally with DeepEcom?",
    "Yes. Import historical settlement reports and DeepEcom will reconcile them order-by-order and generate vouchers you can bulk-sync to Tally for any past period.",
  ],
  [
    "How is pricing determined for DeepEcom?",
    "Plans are sized by monthly order volume, billed quarterly. You can upgrade or downgrade as you grow, and there are no per-seat fees or hidden charges.",
  ],
  [
    "How does DeepEcom handle products with different names across Amazon, Flipkart, and Tally?",
    "Intelligent SKU mapping links listings that differ across platforms. Set mapping rules once and DeepEcom applies them everywhere, surfacing exceptions for review instead of guessing.",
  ],
  [
    "Does DeepEcom account for all the expenses charged by Amazon and other marketplaces?",
    "Yes — commissions, shipping, storage fees, advertising, refunds and compensation are extracted line-by-line from each settlement and categorized automatically, so your true net payout is always accurate.",
  ],
  [
    "Can I reconcile marketplace warehouse inventory with my Tally accounts?",
    "Yes. Periodic stock summaries sync from each marketplace warehouse into Tally with valuation and location mapping, keeping physical and book inventory aligned.",
  ],
  [
    "Is it possible to analyze profit and loss within DeepEcom?",
    "Absolutely. DeepEcom provides full P&L analysis at the SKU, order, channel and business level, with visual dashboards and exportable reports your CA will actually enjoy reading.",
  ],
]

export default function FaqAccordion() {
  return (
    <Accordion className="mx-auto max-w-3xl">
      {FAQS.map(([q, a], i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionPanel className="text-sm/relaxed text-muted-foreground">
            <div className="max-w-2xl">{a}</div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
