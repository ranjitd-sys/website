import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/careers.astro
var careers_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Careers,
	file: () => $$file,
	url: () => $$url
});
var $$Careers = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Careers at DeepEcom",
		"description": "Join the team building the accounting layer for ecommerce."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "CAREERS",
		"title": "Build the accounting layer for ecommerce.",
		"lead": "We are a team working on hard, real problems at the intersection of ecommerce, finance and software."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Get in Touch${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a></div>` })}<section class="mx-auto max-w-3xl px-6 py-16"><p class="text-center text-[15px]/relaxed text-muted-foreground">Open roles are shared directly with candidates. Email${" "}<a href="mailto:careers@deepecom.com" class="font-semibold text-brand-600">careers@deepecom.com</a>${" "}and we will get back to you.</p></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Want to build this with us?",
		"lead": "Tell us what you do best — we would love to hear from you."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/careers.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/careers.astro";
var $$url = "/careers";
//#endregion
//#region \0virtual:astro:page:src/pages/careers@_@astro
var page = () => careers_exports;
//#endregion
export { page };
