import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/integrations/shopify.astro
var shopify_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Shopify,
	file: () => $$file,
	url: () => $$url
});
var $$Shopify = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Shopify Accounting — DeepEcom",
		"description": "Bring Shopify store sales, payouts and fees into one financial picture with DeepEcom — profitability, reconciliation and ERP accounting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "INTEGRATIONS · SHOPIFY",
		"title": "Your store, accounted like every other channel.",
		"lead": "DeepEcom connects your Shopify store and brings website sales, payouts and fees into the same accounting layer as your marketplaces."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/integrations/marketplaces"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>All Marketplaces</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "SHOPIFY · CAPABILITIES",
		"title": "What DeepEcom handles for D2C stores.",
		"lead": "Website and marketplace financial data, brought together.",
		"features": [
			{
				title: "Order & Payout Reconciliation",
				description: "Match Shopify payouts to orders and flag discrepancies.",
				icon: "wallet"
			},
			{
				title: "Fee Extraction",
				description: "Payment gateway fees, shipping and discounts, line by line.",
				icon: "receipt"
			},
			{
				title: "GST Accounting",
				description: "Output GST on store sales, accounted correctly.",
				icon: "calculator"
			},
			{
				title: "Order-wise Accounting",
				description: "Every store order accounted individually, ERP-ready.",
				icon: "layers"
			},
			{
				title: "Channel Profitability",
				description: "Compare your store against marketplace channels.",
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
		"title": "Bring your store and your books together.",
		"lead": "See how DeepEcom accounts your Shopify sales alongside your marketplaces."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/integrations/shopify.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/integrations/shopify.astro";
var $$url = "/integrations/shopify";
//#endregion
//#region \0virtual:astro:page:src/pages/integrations/shopify@_@astro
var page = () => shopify_exports;
//#endregion
export { page };
