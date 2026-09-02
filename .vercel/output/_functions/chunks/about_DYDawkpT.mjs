import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/about.astro
var about_exports = /* @__PURE__ */ __exportAll({
	default: () => $$About,
	file: () => $$file,
	url: () => $$url
});
var $$About = createComponent(($$result, $$props, $$slots) => {
	const facts = [
		{
			title: "The problem we exist for",
			body: "Ecommerce sellers operate across fragmented marketplaces, payment channels and ERPs. Each order creates many accounting events, and none of them line up by default."
		},
		{
			title: "What DeepEcom does",
			body: "DeepEcom is the accounting layer for ecommerce. It connects marketplace data, reconciles payments and posts detailed, GST-ready accounting into the ERP your finance team already runs on."
		},
		{
			title: "What we believe",
			body: "DeepEcom does not replace your ERP. DeepEcom makes your ERP ecommerce-ready — order by order, GST by GST, warehouse by warehouse."
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "About DeepEcom — Your Accounting Layer for Ecommerce",
		"description": "DeepEcom connects ecommerce marketplaces to business intelligence, payment reconciliation and detailed ERP accounting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "ABOUT",
		"title": "The accounting layer for ecommerce.",
		"lead": "DeepEcom connects the marketplaces you sell on to the ERP you close your books in — turning fragmented ecommerce activity into intelligence, reconciliation and accounting."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a></div>` })}<section class="mx-auto max-w-3xl px-6 py-16"><div class="divide-y divide-border">${facts.map((f) => renderTemplate`<div class="grid gap-3 py-8 sm:grid-cols-[1fr_2fr] sm:gap-10"><h2 class="text-lg font-semibold tracking-tight text-ink-900">${f.title}</h2><p class="text-[15px]/relaxed text-muted-foreground">${f.body}</p></div>`)}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "See DeepEcom on your own marketplace data.",
		"lead": "Book a walkthrough with the team behind the accounting layer."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/about.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/about.astro";
var $$url = "/about";
//#endregion
//#region \0virtual:astro:page:src/pages/about@_@astro
var page = () => about_exports;
//#endregion
export { page };
