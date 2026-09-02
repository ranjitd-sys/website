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
//#region src/pages/integrations/marketplaces.astro
var marketplaces_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Marketplaces,
	file: () => $$file,
	url: () => $$url
});
var $$Marketplaces = createComponent(($$result, $$props, $$slots) => {
	const channels = [
		{
			name: "Amazon",
			href: "/integrations/amazon",
			desc: "Settlements, fees, GST and TCS/TDS accounted"
		},
		{
			name: "Flipkart",
			href: "/integrations/flipkart",
			desc: "Settlements, commissions and GST-ready accounting"
		},
		{
			name: "Shopify",
			href: "/integrations/shopify",
			desc: "Store sales and payouts brought into one financial picture"
		},
		{
			name: "Meesho",
			href: "/integrations",
			desc: "Channel data aggregated into the same layer"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Marketplace Integrations — Amazon, Flipkart, Shopify and more",
		"description": "DeepEcom connects Amazon, Flipkart, Shopify, Meesho and other marketplaces to your business intelligence and ERP accounting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "INTEGRATIONS · MARKETPLACES",
		"title": "Your marketplaces, connected.",
		"lead": "DeepEcom pulls order, settlement, fee and tax data from the marketplaces you sell on — and turns it into intelligence, reconciliation and ERP-ready accounting."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/integrations"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>All Integrations</a></div>` })}<section class="mx-auto max-w-6xl px-6 py-16">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "CHANNELS",
		"title": "Marketplace data, in one layer.",
		"lead": "Each marketplace sends orders, settlements, fees and taxes differently. DeepEcom brings them together so you see one financial picture.",
		"center": true
	})}<div class="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">${channels.map((c) => renderTemplate`<a${addAttribute(c.href, "href")} class="group flex items-start gap-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"><span class="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-sm font-bold text-brand-600">${c.name[0]}</span><span><span class="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink-900">${c.name}<span class="text-brand-500 transition-transform group-hover:translate-x-0.5">→</span></span><span class="mt-1 block text-sm text-muted-foreground">${c.desc}</span></span></a>`)}</div></section>${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "CAPABILITIES",
		"title": "Built for multi-channel ecommerce.",
		"lead": "Whatever combination of channels you sell on, the accounting layer stays the same.",
		"features": [
			{
				title: "Settlement Reconciliation",
				description: "Match marketplace settlements to your bank, order by order.",
				icon: "wallet"
			},
			{
				title: "Fee Extraction",
				description: "Commissions, shipping, storage and advertising, line by line.",
				icon: "receipt"
			},
			{
				title: "GST & TCS/TDS",
				description: "Output GST and withholding tax, accounted correctly.",
				icon: "calculator"
			},
			{
				title: "Order-wise Accounting",
				description: "Every order accounted individually, ready for your ERP.",
				icon: "layers"
			},
			{
				title: "Channel Profitability",
				description: "Net profit per channel, SKU and order.",
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
		"title": "Connect your marketplaces to your books.",
		"lead": "See how DeepEcom brings every channel into one accounting layer."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/integrations/marketplaces.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/integrations/marketplaces.astro";
var $$url = "/integrations/marketplaces";
//#endregion
//#region \0virtual:astro:page:src/pages/integrations/marketplaces@_@astro
var page = () => marketplaces_exports;
//#endregion
export { page };
