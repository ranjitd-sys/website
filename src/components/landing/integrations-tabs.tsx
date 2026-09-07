import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/landing/ui/tabs"
import { logoAsset } from "@/data/logoAssets"

const GROUPS: Record<string, { mark?: string; init: string; name: string }[]> = {
  marketplace: [
    { mark: "amazon", init: "Az", name: "Amazon" },
    { mark: "flipkart", init: "Fk", name: "Flipkart" },
    { mark: "shopify", init: "Sy", name: "Shopify" },
    { mark: "meesho", init: "Me", name: "Meesho" },
    { mark: "myntra", init: "My", name: "Myntra" },
    { mark: "ajio", init: "Aj", name: "Ajio" },
    { mark: "jiomart", init: "Jm", name: "JioMart" },
    { mark: "nykaa", init: "Nk", name: "Nykaa" },
    { init: "+", name: "More channels" },
  ],
  erp: [
    { mark: "tally", init: "Tp", name: "Tally" },
    { mark: "sap", init: "Sap", name: "SAP" },
    { mark: "zoho-books", init: "Zb", name: "Zoho Books" },
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
            {items.map((it) => {
              const asset = it.mark ? logoAsset(it.mark) : undefined
              return (
                <div key={it.name} className={tile}>
                  {asset ? (
                    <img src={asset.src} alt="" aria-hidden="true" className="size-8 shrink-0 rounded-lg border border-ink-100 bg-white object-contain p-1" loading="lazy" decoding="async" />
                  ) : (
                    <span className={tileLogo}>{it.init}</span>
                  )}
                  {it.name}
                </div>
              )
            })}
          </TabsPanel>
        ))}
      </div>
    </Tabs>
  )
}