import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/landing/ui/tabs"

const GROUPS: Record<string, { init: string; name: string }[]> = {
  marketplace: [
    { init: "Az", name: "Amazon" },
    { init: "Fk", name: "Flipkart" },
    { init: "My", name: "Myntra" },
    { init: "Me", name: "Meesho" },
    { init: "Ny", name: "Nykaa" },
    { init: "Sy", name: "Shopify" },
    { init: "Jm", name: "JioMart" },
  ],
  erp: [
    { init: "Tp", name: "Tally Prime" },
    { init: "Zb", name: "Zoho Books" },
    { init: "MD", name: "MS Dynamics" },
    { init: "SE", name: "Sap Erp" },
  ],
  logistics: [
    { init: "Dt", name: "DTDC" },
    { init: "Sr", name: "Shiprocket" },
    { init: "Dv", name: "Delhivery" },
  ],
  payments: [
    { init: "Rz", name: "Razorpay" },
    { init: "Cf", name: "Cashfree" },
    { init: "Ph", name: "PhonePe" },
  ],
}

const tile =
  "flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-[14.5px] font-semibold tracking-tight text-ink-900 shadow-xs transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-sm"
const tileLogo =
  "grid size-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-xs font-extrabold text-ink-600"

export default function IntegrationsTabs() {
  return (
    <Tabs defaultValue="marketplace">
      <div className="flex justify-center">
        <TabsList className="flex-wrap">
          <TabsTab value="marketplace">Marketplaces</TabsTab>
          <TabsTab value="erp">ERP</TabsTab>
          <TabsTab value="logistics">Logistics</TabsTab>
          <TabsTab value="payments">Payment gateway</TabsTab>
        </TabsList>
      </div>

      <div className="mt-8">
        {Object.entries(GROUPS).map(([key, items]) => (
          <TabsPanel key={key} value={key} keepMounted className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-3">
            {items.map((it) => (
              <div key={it.name} className={tile}>
                <span className={tileLogo}>{it.init}</span>
                {it.name}
              </div>
            ))}
          </TabsPanel>
        ))}
      </div>
    </Tabs>
  )
}
