import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CKJGCi14.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_DV03to9n.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_CUpFIrI5.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_BNdLphpM.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/solutions/amazon-sellers.astro
var amazon_sellers_exports = /* @__PURE__ */ __exportAll({
	default: () => $$AmazonSellers,
	file: () => $$file,
	url: () => $$url
});
var $$AmazonSellers = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Amazon Sellers — Profitability, reconciliation and accounting | DeepEcom",
		"description": "DeepEcom helps Amazon sellers understand profitability, reconcile settlements and account every transaction with detailed GST and warehouse accounting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "SOLUTIONS · BY BUSINESS",
		"title": "Run your Amazon business on real numbers.",
		"lead": "Amazon profitability is rarely what it looks like on the surface. DeepEcom turns your marketplace data into clear profitability, reconciled settlements and detailed accounting."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/integrations/amazon"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Amazon Integration</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "AMAZON SELLERS",
		"title": "Understand profitability the way Amazon actually works.",
		"lead": "Amazon deductions, fees and settlements make your real profit hard to see. DeepEcom shows it clearly and keeps your books accurate.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "Amazon profitability",
				description: "See your actual profitability after marketplace fees, deductions and adjustments.",
				icon: "trend"
			},
			{
				title: "Settlement reconciliation",
				description: "Reconcile Amazon settlements against expected payments and flag every difference.",
				icon: "refresh"
			},
			{
				title: "Detailed accounting",
				description: "Every Amazon transaction becomes structured, order-level accounting entries.",
				icon: "receipt"
			},
			{
				title: "GST handling",
				description: "GST-wise accounting that keeps your tax reporting accurate across the marketplace.",
				icon: "scale"
			},
			{
				title: "Marketplace deductions",
				description: "Commissions, referral fees and deductions captured as distinct accounting entries.",
				icon: "wallet"
			},
			{
				title: "Warehouse accounting",
				description: "Inventory and stock movement accounted at the warehouse level.",
				icon: "boxes"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE AMAZON OUTCOME",
		"title": "From marketplace data to a clear financial picture.",
		"lead": "DeepEcom connects Amazon to business intelligence, payment reconciliation and detailed ERP accounting — so your profit is real and your books are ready.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "See your Amazon business on real numbers.",
		"lead": "Understand profitability, reconcile settlements and account every transaction."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/solutions/amazon-sellers.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/solutions/amazon-sellers.astro";
var $$url = "/solutions/amazon-sellers";
//#endregion
//#region \0virtual:astro:page:src/pages/solutions/amazon-sellers@_@astro
var page = () => amazon_sellers_exports;
//#endregion
export { page };
