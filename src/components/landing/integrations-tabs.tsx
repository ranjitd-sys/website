import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/landing/ui/tabs"

const GROUPS: Record<string, { init: string; name: string }[]> = {
  marketplace: [
    { init: "Az", name: "Amazon" },
    { init: "Fk", name: "Flipkart" },
    { init: "Sy", name: "Shopify" },
    { init: "Me", name: "Meesho" },
    { init: "+", name: "More channels" },
  ],
  erp: [
    { init: "Tp", name: "Tally" },
    { init: "Sap", name: "SAP" },
    { init: "Zb", name: "Zoho Books" },
    { init: "+", name: "More ERP systems" },
  ],
}

const tile =
  "flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-[14.5px] font-semibold tracking-tight text-ink-900 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-sm"
const tileLogo =
  "grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-xs font-extrabold text-brand-600"

export default function IntegrationsTabs() {
  return (
    <Tabs defaultValue="marketplace">
      <div className="flex justify-center">
        <TabsList className="flex-wrap">
          <TabsTab value="marketplace">Marketplaces</TabsTab>
          <TabsTab value="erp">ERP</TabsTab>
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