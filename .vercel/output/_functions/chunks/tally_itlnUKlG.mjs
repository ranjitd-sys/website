import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/integrations/tally.astro
var tally_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Tally,
	file: () => $$file,
	url: () => $$url
});
var $$Tally = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Tally Ecommerce Accounting — DeepEcom ERP Connector",
		"description": "Automate detailed ecommerce accounting in Tally with DeepEcom — order-wise, GST-wise, warehouse-wise, with TCS/TDS and stock transfers."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "INTEGRATIONS · TALLY",
		"title": "Make your Tally ecommerce-ready.",
		"lead": "DeepEcom converts ecommerce transactions into detailed accounting entries inside Tally — order by order, GST by GST, warehouse by warehouse."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "TALLY · CAPABILITIES",
		"title": "What the ERP Connector posts into Tally.",
		"lead": "Complete, detailed accounting without re-keying a single line.",
		"features": [
			{
				title: "Voucher Generation",
				description: "Detailed ecommerce vouchers generated automatically for Tally.",
				icon: "building"
			},
			{
				title: "GST-wise Accounting",
				description: "IGST, CGST, SGST splits mapped to your Tally GST ledgers.",
				icon: "calculator"
			},
			{
				title: "Order-wise Accounting",
				description: "Every order accounted individually, never lumped into summaries.",
				icon: "layers"
			},
			{
				title: "Warehouse-wise",
				description: "Inventory and stock transfers accounted per warehouse.",
				icon: "boxes"
			},
			{
				title: "TCS / TDS",
				description: "Marketplace withholding tax posted to the right heads.",
				icon: "shield"
			},
			{
				title: "Returns & Refunds",
				description: "Returns and credit notes flow into Tally automatically.",
				icon: "refresh"
			}
		],
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Close your books faster in Tally.",
		"lead": "See how DeepEcom posts detailed ecommerce accounting into Tally."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/integrations/tally.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/integrations/tally.astro";
var $$url = "/integrations/tally";
//#endregion
//#region \0virtual:astro:page:src/pages/integrations/tally@_@astro
var page = () => tally_exports;
//#endregion
export { page };
