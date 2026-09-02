import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/platform/index.astro
var platform_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const title = "Understand your ecommerce business.";
	const features = [
		{
			title: "Business Dashboards",
			description: "See your ecommerce business across marketplaces in one connected view.",
			icon: "chart",
			href: "/platform/dashboard"
		},
		{
			title: "Profitability Analysis",
			description: "Understand margins at the SKU and channel level and what drives your profit.",
			icon: "trend",
			href: "/platform/profitability"
		},
		{
			title: "Payment Reconciliation",
			description: "Match expected settlements to actual payments and flag discrepancies.",
			icon: "wallet",
			href: "/platform/payment-reconciliation"
		},
		{
			title: "Marketplace Data Aggregation",
			description: "Amazon, Flipkart, Shopify and other channels consolidated into one layer.",
			icon: "layers"
		},
		{
			title: "Marketplace Performance",
			description: "Compare orders, revenue and profitability across every channel you sell on.",
			icon: "grid"
		},
		{
			title: "Reports & Exports",
			description: "Pull clean, structured reports and GST-ready data for your finance team.",
			icon: "file",
			href: "/platform/reports"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": `Platform — ${title}`,
		"description": "DeepEcom Platform connects your ecommerce marketplaces and turns marketplace data into usable business intelligence, reconciliation and reporting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "PLATFORM",
		"title": title,
		"lead": "Connect your marketplaces, turn marketplace data into usable business information, reconcile your payments and understand your profitability — all in one layer."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform/dashboard"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>See the Dashboard</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "THE PLATFORM",
		"title": "Everything your ecommerce business needs, understood.",
		"lead": "DeepEcom Platform aggregates marketplace data and turns it into intelligence you can act on — dashboards, profitability, reconciliation and reports.",
		"features": features,
		"columns": 3,
		"center": true
	})}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "ONE LAYER",
		"title": "From fragmented marketplace data to usable business information.",
		"lead": "Orders, payments, returns, GST and fees arrive separately from each marketplace. DeepEcom brings them into one connected view so you can see what is actually happening across your ecommerce business.",
		"center": true
	})}</section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Bring your ecommerce business and accounting together.",
		"lead": "See the Platform in action on your own marketplace data."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/platform/index.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/platform/index.astro";
var $$url = "/platform";
//#endregion
//#region \0virtual:astro:page:src/pages/platform/index@_@astro
var page = () => platform_exports;
//#endregion
export { page };
