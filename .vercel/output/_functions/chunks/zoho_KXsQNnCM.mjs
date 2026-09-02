import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/integrations/zoho.astro
var zoho_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Zoho,
	file: () => $$file,
	url: () => $$url
});
var $$Zoho = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Zoho Books Ecommerce Accounting — DeepEcom ERP Connector",
		"description": "Automate detailed ecommerce accounting in Zoho Books with DeepEcom — order-wise, GST-wise, warehouse-wise, with TCS/TDS and stock transfers."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "INTEGRATIONS · ZOHO BOOKS",
		"title": "Ecommerce accounting that posts straight into Zoho Books.",
		"lead": "DeepEcom converts marketplace transactions into detailed, GST-ready accounting entries inside Zoho Books — order by order."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "ZOHO BOOKS · CAPABILITIES",
		"title": "What the ERP Connector posts into Zoho Books.",
		"lead": "Detailed accounting without re-keying, ready for your finance team.",
		"features": [
			{
				title: "ERP Posting",
				description: "Structured ecommerce entries generated for Zoho Books.",
				icon: "building"
			},
			{
				title: "Order-wise Accounting",
				description: "Every order accounted individually, ERP-ready.",
				icon: "layers"
			},
			{
				title: "GST-wise Accounting",
				description: "IGST, CGST, SGST splits mapped to your ledgers.",
				icon: "calculator"
			},
			{
				title: "Warehouse-wise",
				description: "Inventory and stock transfers accounted per warehouse.",
				icon: "boxes"
			},
			{
				title: "TCS / TDS",
				description: "Marketplace withholding tax posted correctly.",
				icon: "shield"
			},
			{
				title: "Returns & Refunds",
				description: "Returns and credit notes handled automatically.",
				icon: "refresh"
			}
		],
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Keep Zoho Books accurate, automatically.",
		"lead": "See how DeepEcom posts detailed ecommerce accounting into Zoho Books."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/integrations/zoho.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/integrations/zoho.astro";
var $$url = "/integrations/zoho";
//#endregion
//#region \0virtual:astro:page:src/pages/integrations/zoho@_@astro
var page = () => zoho_exports;
//#endregion
export { page };
