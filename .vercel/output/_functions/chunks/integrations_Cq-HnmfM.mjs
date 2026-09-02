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
//#region src/pages/integrations.astro
var integrations_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Integrations,
	file: () => $$file,
	url: () => $$url
});
var $$Integrations = createComponent(($$result, $$props, $$slots) => {
	const features = [
		{
			title: "Marketplace Data Aggregation",
			description: "Connect Amazon, Flipkart, Shopify and other channels into a single layer.",
			icon: "layers"
		},
		{
			title: "Payment Reconciliation",
			description: "Match expected settlements to actual payments and flag discrepancies.",
			icon: "wallet"
		},
		{
			title: "GST-Ready Accounting",
			description: "Detailed, order-level accounting entries that map to your ERP.",
			icon: "calculator"
		},
		{
			title: "ERP Posting",
			description: "Post complete accounting entries directly into Tally, SAP or Zoho.",
			icon: "building"
		},
		{
			title: "Warehouse & Stock Transfers",
			description: "Track inventory movement and stock transfers between warehouses.",
			icon: "boxes"
		},
		{
			title: "TCS & TDS Handling",
			description: "Ecommerce tax deductions captured and accounted correctly.",
			icon: "shield"
		}
	];
	const marketplaces = [
		"Amazon",
		"Flipkart",
		"Shopify",
		"Other Channels"
	];
	const erps = [
		"Tally",
		"SAP",
		"Zoho"
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Integrations — Your stack, connected.",
		"description": "DeepEcom connects ecommerce marketplaces to your ERP. Amazon, Flipkart, Shopify and other channels in, detailed accounting out to Tally, SAP and Zoho."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "INTEGRATIONS",
		"title": "Your stack, connected.",
		"lead": "DeepEcom sits between your ecommerce marketplaces and your ERP. Marketplace data flows in, and detailed accounting flows out to the systems your finance team already runs on."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div>` })}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "ONE LAYER",
		"title": "Your marketplaces in, your ERP accounting out.",
		"lead": "DeepEcom is the layer between ecommerce channels and the ERP. It brings marketplace data together, makes it understandable, and posts detailed accounting into the systems you already use.",
		"center": true
	})}<div class="mt-14 grid gap-8 lg:grid-cols-3"><div class="flex flex-col gap-4"><div class="flex flex-wrap gap-3">${marketplaces.map((name) => renderTemplate`<div class="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-sm"><span class="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-sm font-semibold text-brand-600">${name[0]}</span><span class="text-sm font-medium text-ink-900">${name}</span></div>`)}</div><p class="text-sm text-muted-foreground">Ecommerce channels &amp; marketplaces</p></div><div class="flex flex-col items-center justify-center gap-3"><span class="text-2xl font-bold tracking-tight text-brand-600">DeepEcom</span><span class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Intelligence · Reconciliation · Accounting</span></div><div class="flex flex-col gap-4"><div class="flex flex-wrap gap-3">${erps.map((name) => renderTemplate`<div class="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-sm"><span class="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-sm font-semibold text-brand-600">${name[0]}</span><span class="text-sm font-medium text-ink-900">${name}</span></div>`)}</div><p class="text-sm text-muted-foreground">ERP systems</p></div></div></section>${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "CAPABILITIES",
		"title": "Everything connects, nothing is rebuilt.",
		"lead": "DeepEcom handles the heavy lifting of ecommerce data and accounting so your marketplaces and ERP work together without custom glue.",
		"features": features,
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Connect your marketplaces to your books.",
		"lead": "See how DeepEcom brings your channels and ERP together."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/integrations.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/integrations.astro";
var $$url = "/integrations";
//#endregion
//#region \0virtual:astro:page:src/pages/integrations@_@astro
var page = () => integrations_exports;
//#endregion
export { page };
