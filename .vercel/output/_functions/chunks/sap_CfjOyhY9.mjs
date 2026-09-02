import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/integrations/sap.astro
var sap_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Sap,
	file: () => $$file,
	url: () => $$url
});
var $$Sap = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "SAP Ecommerce Accounting — DeepEcom ERP Connector",
		"description": "Automate detailed ecommerce accounting inside SAP with DeepEcom — order-wise, GST-wise, warehouse-wise, with TCS/TDS and stock transfers."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "INTEGRATIONS · SAP",
		"title": "Enterprise ecommerce accounting inside SAP.",
		"lead": "DeepEcom posts detailed, order-level ecommerce accounting into SAP — GST-wise, warehouse-wise, and ready for high-volume operations."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "SAP · CAPABILITIES",
		"title": "What the ERP Connector posts into SAP.",
		"lead": "Detailed ecommerce accounting at enterprise scale.",
		"features": [
			{
				title: "ERP Posting",
				description: "Structured accounting entries generated for SAP.",
				icon: "building"
			},
			{
				title: "Order-wise Accounting",
				description: "Every transaction accounted individually for full audit trails.",
				icon: "layers"
			},
			{
				title: "GST-wise Accounting",
				description: "State-wise IGST, CGST, SGST mapped to your ledgers.",
				icon: "calculator"
			},
			{
				title: "Warehouse-wise",
				description: "Inventory and stock transfers accounted across fulfilment centres.",
				icon: "boxes"
			},
			{
				title: "Marketplace Charges",
				description: "Fees, commissions and deductions posted correctly.",
				icon: "receipt"
			},
			{
				title: "Returns & Refunds",
				description: "Returns, refunds and credit notes handled cleanly.",
				icon: "refresh"
			}
		],
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Ecommerce accounting, engineered for scale.",
		"lead": "See how DeepEcom posts detailed accounting into SAP."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/integrations/sap.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/integrations/sap.astro";
var $$url = "/integrations/sap";
//#endregion
//#region \0virtual:astro:page:src/pages/integrations/sap@_@astro
var page = () => sap_exports;
//#endregion
export { page };
