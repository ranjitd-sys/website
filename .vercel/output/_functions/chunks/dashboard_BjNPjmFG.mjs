import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/platform/dashboard.astro
var dashboard_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Dashboard,
	file: () => $$file,
	url: () => $$url
});
var $$Dashboard = createComponent(($$result, $$props, $$slots) => {
	const title = "Your ecommerce business at a glance.";
	const features = [
		{
			title: "Business Dashboards",
			description: "A single view of your ecommerce business, built from real marketplace data.",
			icon: "chart"
		},
		{
			title: "KPIs That Matter",
			description: "Orders, revenue, profitability and reconciliation status in one place.",
			icon: "gauge"
		},
		{
			title: "Marketplace Comparison",
			description: "Compare performance across Amazon, Flipkart, Shopify and other channels.",
			icon: "grid"
		},
		{
			title: "Performance Trends",
			description: "See how your business is moving over time, not just at a point in time.",
			icon: "trend"
		},
		{
			title: "Across All Channels",
			description: "One dashboard for every marketplace you sell on — no more tab-hopping.",
			icon: "globe"
		},
		{
			title: "Track What Matters",
			description: "Keep the metrics that drive decisions visible and easy to monitor.",
			icon: "target"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": `Dashboard — ${title}`,
		"description": "DeepEcom Platform business dashboards bring orders, revenue, profitability and reconciliation status across your marketplaces into one connected view."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "PLATFORM · DASHBOARD",
		"title": title,
		"lead": "Stop stitching together reports from each marketplace. See orders, revenue, profitability and reconciliation across your entire ecommerce business in one place."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "DASHBOARD",
		"title": "Clarity without the manual work.",
		"lead": "Real marketplace data becomes a dashboard you can actually rely on — performance, profitability and reconciliation in one connected view.",
		"features": features,
		"columns": 3,
		"center": true
	})}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "ONE VIEW",
		"title": "Your whole ecommerce business, on one screen.",
		"lead": "Dashboards pull every channel together so you spend less time gathering numbers and more time acting on them.",
		"center": true
	})}</section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Bring your ecommerce business and accounting together.",
		"lead": "See your entire ecommerce business in one connected dashboard."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/platform/dashboard.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/platform/dashboard.astro";
var $$url = "/platform/dashboard";
//#endregion
//#region \0virtual:astro:page:src/pages/platform/dashboard@_@astro
var page = () => dashboard_exports;
//#endregion
export { page };
