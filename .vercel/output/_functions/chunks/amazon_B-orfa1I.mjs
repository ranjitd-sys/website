import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/integrations/amazon.astro
var amazon_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Amazon,
	file: () => $$file,
	url: () => $$url
});
var $$Amazon = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Amazon Seller Accounting — DeepEcom",
		"description": "Understand Amazon seller profitability, reconcile settlements and automate GST, TCS/TDS and ERP accounting with DeepEcom."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "INTEGRATIONS · AMAZON",
		"title": "Amazon seller accounting, without the spreadsheet.",
		"lead": "DeepEcom connects your Amazon seller account and turns settlements into profitability, payment reconciliation and detailed accounting your ERP can post."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/integrations/marketplaces"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>All Marketplaces</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "AMAZON · CAPABILITIES",
		"title": "What DeepEcom handles for Amazon sellers.",
		"lead": "From settlement to books, the Amazon side of your business is connected end to end.",
		"features": [
			{
				title: "Settlement Reconciliation",
				description: "Match Amazon settlements to your bank and flag discrepancies.",
				icon: "wallet"
			},
			{
				title: "Fee Extraction",
				description: "Referral fees, FBA charges, shipping and advertising, line by line.",
				icon: "receipt"
			},
			{
				title: "GST & TCS/TDS",
				description: "Output GST and TCS/TDS on Amazon sales, accounted correctly.",
				icon: "calculator"
			},
			{
				title: "Order-wise Accounting",
				description: "Every Amazon order accounted individually, ERP-ready.",
				icon: "layers"
			},
			{
				title: "Profitability",
				description: "Net profit per SKU, order and marketplace.",
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
		"title": "Run your Amazon business on real numbers.",
		"lead": "See how DeepEcom reconciles and accounts your Amazon settlements."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/integrations/amazon.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/integrations/amazon.astro";
var $$url = "/integrations/amazon";
//#endregion
//#region \0virtual:astro:page:src/pages/integrations/amazon@_@astro
var page = () => amazon_exports;
//#endregion
export { page };
