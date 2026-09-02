import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/partners.astro
var partners_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Partners,
	file: () => $$file,
	url: () => $$url
});
var $$Partners = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Partners — DeepEcom",
		"description": "Partner with DeepEcom to bring ecommerce accounting to the businesses you serve."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "PARTNERS",
		"title": "Bring ecommerce accounting to the businesses you serve.",
		"lead": "Accountants, CAs, consultants and ecommerce agencies — work with DeepEcom to give your clients a connected accounting layer."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Talk to Us${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a></div>` })}<section class="mx-auto max-w-3xl px-6 py-16"><p class="text-center text-[15px]/relaxed text-muted-foreground">If you help ecommerce businesses close their books, reach out at${" "}<a href="mailto:partners@deepecom.com" class="font-semibold text-brand-600">partners@deepecom.com</a>${" "}and we will share how we can work together.</p></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Partner with the accounting layer.",
		"lead": "Let's talk about what we can build together for your clients."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/partners.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/partners.astro";
var $$url = "/partners";
//#endregion
//#region \0virtual:astro:page:src/pages/partners@_@astro
var page = () => partners_exports;
//#endregion
export { page };
