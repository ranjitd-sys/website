import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_DV03to9n.mjs";
import { t as $$CtaBand } from "./CtaBand_CUpFIrI5.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_BNdLphpM.mjs";
//#region src/pages/resources/blog.astro
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Blog,
	file: () => $$file,
	url: () => $$url
});
var $$Blog = createComponent(($$result, $$props, $$slots) => {
	const posts = [
		{
			title: "Understanding marketplace settlement reports",
			label: "Reconciliation"
		},
		{
			title: "How to read Amazon settlement fees",
			label: "Amazon Accounting"
		},
		{
			title: "Ecommerce profitability, SKU by SKU",
			label: "Profitability"
		},
		{
			title: "GST for ecommerce sellers in India",
			label: "GST"
		},
		{
			title: "Making Tally ecommerce-ready",
			label: "ERP"
		},
		{
			title: "TCS and TDS on marketplace sales",
			label: "Tax"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Blog — Notes on ecommerce finance | DeepEcom",
		"description": "Practical notes on ecommerce accounting, marketplace settlement reconciliation, Amazon accounting, GST and ERP integration from the DeepEcom team."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "BLOG",
		"title": "Notes on ecommerce finance.",
		"lead": "Short, practical reads on the topics that trip up ecommerce businesses: settlements, fees, GST, reconciliation and ERP accounting."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "COMING SOON",
		"title": "What we're writing about.",
		"lead": "New posts are on the way. These are the topics we're starting with — none are published yet.",
		"center": true
	})}<div class="mt-14 grid gap-4 md:grid-cols-3">${posts.map((post) => renderTemplate`<article class="flex flex-col justify-between gap-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm"><div><span class="text-xs font-semibold tracking-widest text-brand-600 uppercase">${post.label}</span><h3 class="mt-2 text-base font-semibold text-ink-900">${post.title}</h3></div><span class="inline-flex w-fit items-center rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-500">Coming soon</span></article>`)}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Rather see it than read about it?",
		"lead": "Book a demo and we'll walk through reconciliation and accounting on your own data."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/resources/blog.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/resources/blog.astro";
var $$url = "/resources/blog";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/blog@_@astro
var page = () => blog_exports;
//#endregion
export { page };
