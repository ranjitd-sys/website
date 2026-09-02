import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight, Check } from "lucide-react";
//#region src/pages/pricing.astro
var pricing_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Pricing,
	file: () => $$file,
	url: () => $$url
});
var $$Pricing = createComponent(($$result, $$props, $$slots) => {
	const products = [{
		name: "Platform",
		tagline: "Understand your ecommerce business.",
		price: "Contact us",
		description: "Marketplace intelligence, profitability and payment reconciliation for sellers.",
		features: [
			"Marketplace data aggregation",
			"Profitability analysis",
			"Payment reconciliation",
			"Business dashboards",
			"Reports and exports"
		],
		href: "/platform",
		cta: "Explore Platform"
	}, {
		name: "ERP Connector",
		tagline: "Make your ERP ecommerce-ready.",
		price: "Contact us",
		description: "Automated ecommerce accounting and ERP posting into Tally, SAP or Zoho.",
		features: [
			"Order-wise accounting",
			"GST-wise accounting",
			"Warehouse-wise accounting",
			"Marketplace charges, returns and refunds",
			"TCS / TDS-related accounting",
			"ERP posting — Tally, SAP, Zoho"
		],
		href: "/erp-connector",
		cta: "Explore ERP Connector"
	}];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Pricing — Platform and ERP Connector | DeepEcom",
		"description": "DeepEcom pricing covers two products: the Platform for marketplace intelligence, profitability and payment reconciliation, and the ERP Connector for automated ecommerce accounting and ERP posting into Tally, SAP or Zoho."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "PRICING",
		"title": "Simple, outcome-based pricing.",
		"lead": "DeepEcom has two primary products — the Platform and the ERP Connector — sized to your monthly order volume and billed quarterly. No per-seat fees, no hidden charges. Contact us for a plan that fits your business."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a></div>` })}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE TWO PRODUCTS",
		"title": "Priced around the work you need done.",
		"lead": "Plans are sized by monthly order volume and billed quarterly. You can upgrade or downgrade as you grow.",
		"center": true
	})}<div class="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">${products.map((p) => renderTemplate`<article class="flex flex-col rounded-2xl border border-border bg-white p-7 shadow-card"><span class="text-xs font-semibold tracking-widest text-brand-600 uppercase">${p.name}</span><h3 class="mt-2 text-xl font-bold text-ink-900">${p.tagline}</h3><p class="mt-2 text-sm leading-relaxed text-muted-foreground">${p.description}</p><div class="mt-6 flex items-baseline gap-1.5"><span class="num text-3xl font-extrabold tracking-tight text-ink-900">${p.price}</span></div><p class="mt-1.5 text-xs text-zinc-400">Pricing sized to your monthly order volume</p><ul class="mt-6 flex flex-col gap-2.5 border-t border-subtle pt-6 pb-7">${p.features.map((f) => renderTemplate`<li class="flex gap-2.5 text-sm/relaxed text-muted-foreground">${renderComponent($$result, "Check", Check, {
		"size": 16,
		"className": "mt-0.5 shrink-0 text-primary"
	})}${f}</li>`)}</ul><a${addAttribute(p.href, "href")}${addAttribute(`${buttonVariants({ variant: "outline" })} mt-auto w-full`, "class")}>${p.cta}</a></article>`)}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Enterprise — the complex stuff, handled.",
		"lead": "Custom requirements, high-volume operations and enterprise ERP needs. Multi-entity, multi-warehouse and multi-marketplace accounting at scale.",
		"secondary": "Explore ERP Connector",
		"secondaryHref": "/erp-connector"
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/pricing.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/pricing.astro";
var $$url = "/pricing";
//#endregion
//#region \0virtual:astro:page:src/pages/pricing@_@astro
var page = () => pricing_exports;
//#endregion
export { page };
