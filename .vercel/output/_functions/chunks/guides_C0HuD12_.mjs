import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
//#region src/pages/resources/guides.astro
var guides_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Guides,
	file: () => $$file,
	url: () => $$url
});
var $$Guides = createComponent(($$result, $$props, $$slots) => {
	const guides = [
		{
			title: "Getting started with DeepEcom",
			label: "Setup"
		},
		{
			title: "Connecting your marketplaces",
			label: "Connect"
		},
		{
			title: "Running your first reconciliation",
			label: "Reconcile"
		},
		{
			title: "Posting accounting to Tally",
			label: "ERP"
		},
		{
			title: "Setting up multi-warehouse accounting",
			label: "Inventory"
		},
		{
			title: "Handling returns and refunds",
			label: "Accounting"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Guides — Step-by-step how-tos | DeepEcom",
		"description": "Step-by-step guides for connecting marketplaces, reconciling settlements, and posting detailed ecommerce accounting into your ERP with DeepEcom."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "GUIDES",
		"title": "Step-by-step, without the guesswork.",
		"lead": "Guided walkthroughs for setting up DeepEcom — from connecting your marketplaces to posting clean accounting into your ERP."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "COMING SOON",
		"title": "The guides we're building.",
		"lead": "Each guide walks through a real workflow end to end. None are published yet.",
		"center": true
	})}<div class="mt-14 grid gap-4 md:grid-cols-3">${guides.map((guide) => renderTemplate`<article class="flex flex-col justify-between gap-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm"><div><span class="text-xs font-semibold tracking-widest text-brand-600 uppercase">${guide.label}</span><h3 class="mt-2 text-base font-semibold text-ink-900">${guide.title}</h3></div><span class="inline-flex w-fit items-center rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-500">Coming soon</span></article>`)}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Skip the setup entirely.",
		"lead": "Our team will import your backdated settlements and map your SKUs for you."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/resources/guides.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/resources/guides.astro";
var $$url = "/resources/guides";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/guides@_@astro
var page = () => guides_exports;
//#endregion
export { page };
