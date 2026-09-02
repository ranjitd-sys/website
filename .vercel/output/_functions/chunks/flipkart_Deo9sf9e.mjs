import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/integrations/flipkart.astro
var flipkart_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Flipkart,
	file: () => $$file,
	url: () => $$url
});
var $$Flipkart = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Flipkart Seller Accounting — DeepEcom",
		"description": "Reconcile Flipkart settlements, understand profitability and automate GST and ERP accounting with DeepEcom."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "INTEGRATIONS · FLIPKART",
		"title": "Flipkart settlements, reconciled to the rupee.",
		"lead": "DeepEcom connects your Flipkart seller account and turns orders, commissions and settlements into profitability and ERP-ready accounting."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/integrations/marketplaces"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>All Marketplaces</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "FLIPKART · CAPABILITIES",
		"title": "What DeepEcom handles for Flipkart sellers.",
		"lead": "From settlement to books, the Flipkart side of your business is connected end to end.",
		"features": [
			{
				title: "Settlement Reconciliation",
				description: "Match Flipkart settlements to your bank and flag discrepancies.",
				icon: "wallet"
			},
			{
				title: "Commission & Fee Extraction",
				description: "Commissions, shipping and deductions, line by line.",
				icon: "receipt"
			},
			{
				title: "GST & TCS/TDS",
				description: "Output GST and withholding tax on Flipkart sales, accounted correctly.",
				icon: "calculator"
			},
			{
				title: "Order-wise Accounting",
				description: "Every Flipkart order accounted individually, ERP-ready.",
				icon: "layers"
			},
			{
				title: "Profitability",
				description: "Net profit per SKU, order and channel.",
				icon: "trend"
			},
			{
				title: "ERP Posting",
				description: "Detailed entries posted into Tally, SAP or Zoho.",
				icon: "building"
			}
		],
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Connect Flipkart to your books.",
		"lead": "See how DeepEcom reconciles and accounts your Flipkart settlements."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/integrations/flipkart.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/integrations/flipkart.astro";
var $$url = "/integrations/flipkart";
//#endregion
//#region \0virtual:astro:page:src/pages/integrations/flipkart@_@astro
var page = () => flipkart_exports;
//#endregion
export { page };
