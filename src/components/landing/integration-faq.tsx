import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "@/components/landing/ui/accordion"

const FAQS: [string, string][] = [
  [
    "What systems can I connect to DeepEcom?",
    "DeepEcom connects the systems verified on this page: marketplaces like Amazon, Flipkart, Shopify and Meesho, and ERPs like Tally, SAP and Zoho Books. The ecosystem is designed to grow — new connections are added based on what customers actually run on.",
  ],
  [
    "Which marketplaces are supported?",
    "Amazon, Flipkart, Shopify and Meesho are supported today. Each marketplace sends its data into DeepEcom in its own format, and DeepEcom turns it into one consistent financial layer.",
  ],
  [
    "Does DeepEcom integrate with payment gateways?",
    "Yes. DeepEcom connects payment settlement data so you can match what you expected to receive against what actually arrived — the core of the Payment Reconciliation product.",
  ],
  [
    "Does DeepEcom connect with Tally?",
    "Yes. DeepEcom posts detailed ecommerce accounting into Tally — order-wise, GST-wise and warehouse-wise, including TCS/TDS and stock transfers.",
  ],
  [
    "Does DeepEcom connect with SAP?",
    "Yes. DeepEcom structures ecommerce transactions into detailed accounting for SAP systems.",
  ],
  [
    "Does DeepEcom connect with Zoho Books?",
    "Yes. DeepEcom accounts ecommerce transactions inside Zoho Books with the same detail and structure.",
  ],
  [
    "What data flows into DeepEcom after a system is connected?",
    "Orders, settlements, fees, returns, inventory movement, taxes and payment records — the transaction data those systems already hold. DeepEcom doesn't ask you to re-enter anything.",
  ],
  [
    "What happens after a system is connected?",
    "The data comes together, then it becomes useful: sales and profitability on the Platform dashboard, expected-vs-received reconciliation, reports, and detailed accounting through the ERP Connector.",
  ],
  [
    "Does DeepEcom replace my ERP?",
    "No. DeepEcom is the layer that makes your ERP ecommerce-ready. Your ERP stays the system of record — DeepEcom puts the right ecommerce transactions into it, in detail.",
  ],
  [
    "How is an integration different from ERP accounting?",
    "Connecting a system brings data in. Accounting is what DeepEcom does with it: classifying revenue, fees, taxes and payouts into correct, ERP-ready entries rather than a raw stream of records.",
  ],
  [
    "Can I connect multiple systems at the same time?",
    "Yes. Most DeepEcom customers run several marketplaces and one ERP together. Every addition lands in the same financial layer, so nothing fragments as you grow.",
  ],
  [
    "Does DeepEcom connect to shipping or logistics platforms?",
    "Not yet. Logistics costs show up in your financial picture through fees and settlements, but DeepEcom isn't positioned as a shipping or tracking platform. If a logistics integration matters to you, tell us.",
  ],
  [
    "Are the integration details and data fields always up to date?",
    "Each integration page describes what that system connects and what DeepEcom does with the data. Capabilities are only listed where they're verified — nothing is advertised before it exists.",
  ],
]

export default function IntegrationFaq() {
  return (
    <Accordion className="mx-auto max-w-3xl">
      {FAQS.map(([q, a], i) => (
        <AccordionItem key={i} value={`int-faq-${i}`}>
          <AccordionTrigger className="py-3 text-sm font-semibold text-ink-900 hover:text-primary">
            {q}
          </AccordionTrigger>
          <AccordionPanel className="text-sm/relaxed text-muted-foreground">
            <div className="max-w-2xl pb-1">{a}</div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}