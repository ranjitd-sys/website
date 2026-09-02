import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/resources/help-center.astro
var help_center_exports = /* @__PURE__ */ __exportAll({
	default: () => $$HelpCenter,
	file: () => $$file,
	url: () => $$url
});
var $$HelpCenter = createComponent(($$result, $$props, $$slots) => {
	const paths = [{
		title: "Browse the FAQs",
		description: "Straight answers on integrations, GST numbers, historical data, SKU mapping and more.",
		href: "/resources/faqs",
		cta: "Read the FAQs"
	}, {
		title: "Talk to us directly",
		description: "Tell us about your store and we'll show you exactly how DeepEcom fits your workflow.",
		href: "/contact",
		cta: "Book a Demo"
	}];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Help Center — Get help with DeepEcom | DeepEcom",
		"description": "Get help with DeepEcom. Browse the FAQs, or book a guided demo and talk to the team directly."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "HELP CENTER",
		"title": "How can we help?",
		"lead": "Start with the FAQs for quick answers. If you need more, talk to a real person — we respond within one business day."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "GET STARTED",
		"title": "Two ways to get help.",
		"lead": "Fast answers on your own, or a guided conversation with the team.",
		"center": true
	})}<div class="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">${paths.map((p) => renderTemplate`<article class="flex flex-col justify-between gap-6 rounded-2xl border border-ink-200 bg-white p-7 shadow-card"><div><h3 class="text-lg font-semibold text-ink-900">${p.title}</h3><p class="mt-2 text-sm leading-relaxed text-muted-foreground">${p.description}</p></div><a${addAttribute(p.href, "href")}${addAttribute(buttonVariants({ variant: "outline" }), "class")}>${p.cta}${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a></article>`)}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Still stuck?",
		"lead": "Real humans, no ticket black holes."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/resources/help-center.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/resources/help-center.astro";
var $$url = "/resources/help-center";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/help-center@_@astro
var page = () => help_center_exports;
//#endregion
export { page };
