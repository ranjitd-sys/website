import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/customers.astro
var customers_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Customers,
	file: () => $$file,
	url: () => $$url
});
var $$Customers = createComponent(($$result, $$props, $$slots) => {
	const features = [
		{
			title: "Connected Profitability",
			description: "See actual margins across channels and SKUs instead of guessing.",
			icon: "trend"
		},
		{
			title: "Clearer Reconciliation",
			description: "Understand money received vs expected and close the gaps faster.",
			icon: "wallet"
		},
		{
			title: "Trustworthy Books",
			description: "ERP-ready accounting your auditors and finance team can rely on.",
			icon: "shield"
		},
		{
			title: "Reduced Finance Dependency",
			description: "Business owners get answers without waiting on the finance team.",
			icon: "users"
		},
		{
			title: "Control & Auditability",
			description: "Detailed, order-level accounting with full visibility into every entry.",
			icon: "scale"
		},
		{
			title: "Multi-Entity Ready",
			description: "Accounting that scales across marketplaces, entities and warehouses.",
			icon: "building"
		}
	];
	const caseStudies = [
		{
			label: "AMAZON SELLER",
			title: "Three marketplaces, one set of books.",
			problem: "An Amazon seller selling across multiple marketplaces juggled separate settlement files, payment cycles and fee structures for each channel.",
			process: "Finance rebuilt reconciliations from scratch every cycle. Profitability was estimated, accounting was posted manually, and matching expected payments to actual settlements took days.",
			deepecom: "DeepEcom aggregated the marketplaces into one layer, reconciled expected vs actual payments automatically, and posted detailed, order-level accounting into the ERP.",
			outcome: "Reconciliation effort dropped sharply and profitability became clearer per channel and per SKU."
		},
		{
			label: "D2C BRAND",
			title: "Website and marketplace, understood together.",
			problem: "A D2C brand selling through its own website and marketplaces saw fragmented orders, returns, GST and payments across every channel.",
			process: "The team combined exports manually, reconciled payments by hand and relied on the ERP for accounting that rarely matched the marketplace reality.",
			deepecom: "DeepEcom consolidated website and marketplace data, reconciled payments, and produced GST-ready accounting that posted cleanly into the ERP.",
			outcome: "Consolidated profitability and payment visibility improved, and the books reflected the business more accurately."
		},
		{
			label: "ENTERPRISE",
			title: "High volume, multi-entity accounting.",
			problem: "An enterprise seller operated at high transaction volume across multiple marketplaces, entities and warehouses, with complex GST and ERP requirements.",
			process: "Manual reconciliation and posting could not keep pace with volume, and control over order-level detail and stock transfers was limited.",
			deepecom: "DeepEcom automated reconciliation and accounting at scale, handling multi-entity, multi-warehouse and GST complexity while posting to the enterprise ERP.",
			outcome: "Accounting became more consistent and auditable, with clearer control across entities and warehouses."
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Customers — Built for ecommerce finance teams.",
		"description": "How ecommerce sellers and finance teams use DeepEcom to connect marketplaces to business intelligence, reconciliation and ERP accounting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "CUSTOMERS",
		"title": "Built for ecommerce finance teams.",
		"lead": "From Amazon sellers to D2C brands and enterprises, DeepEcom turns fragmented ecommerce activity into usable intelligence and trusted accounting."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div>` })}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "CASE STUDIES",
		"title": "Real problems, clearly resolved.",
		"lead": "Every business that works with DeepEcom starts with the same pattern: fragmented ecommerce data that is hard to reconcile and hard to account for.",
		"center": true
	})}<div class="mt-14 flex flex-col gap-8">${caseStudies.map((cs) => renderTemplate`<article class="rounded-2xl border border-ink-200 bg-white p-8 shadow-sm"><span class="text-xs font-semibold uppercase tracking-widest text-brand-600">${cs.label}</span><h3 class="mt-2 text-2xl font-bold tracking-tight text-ink-900">${cs.title}</h3><div class="mt-6 grid gap-6 lg:grid-cols-4"><div class="lg:col-span-1"><p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Problem</p><p class="mt-2 text-sm leading-relaxed text-ink-900">${cs.problem}</p></div><div class="lg:col-span-1"><p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Existing Process</p><p class="mt-2 text-sm leading-relaxed text-ink-900">${cs.process}</p></div><div class="lg:col-span-1"><p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">DeepEcom</p><p class="mt-2 text-sm leading-relaxed text-ink-900">${cs.deepecom}</p></div><div class="rounded-xl bg-brand-50 p-4 lg:col-span-1"><p class="text-xs font-semibold uppercase tracking-widest text-brand-600">Outcome</p><p class="mt-2 text-sm leading-relaxed text-ink-900">${cs.outcome}</p></div></div></article>`)}</div></section>${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "WHY DEEPECOM",
		"title": "Outcomes that matter to finance teams.",
		"lead": "DeepEcom is built around the results that matter: connected profitability, clearer reconciliation and accounting your ERP can trust.",
		"features": features,
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Bring your ecommerce business and accounting together.",
		"lead": "See how DeepEcom works on your own marketplace data."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/customers.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/customers.astro";
var $$url = "/customers";
//#endregion
//#region \0virtual:astro:page:src/pages/customers@_@astro
var page = () => customers_exports;
//#endregion
export { page };
