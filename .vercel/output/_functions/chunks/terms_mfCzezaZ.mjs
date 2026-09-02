import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
//#region src/pages/terms.astro
var terms_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Terms,
	file: () => $$file,
	url: () => $$url
});
var $$Terms = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Terms of Service — DeepEcom",
		"description": "The terms that apply when you use DeepEcom."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "LEGAL",
		"title": "Terms of Service",
		"lead": "The terms that govern your use of DeepEcom and the services we provide."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-3xl px-6 py-16"><div class="space-y-8"><div><h2 class="text-lg font-semibold tracking-tight text-ink-900">The service</h2><p class="mt-2 text-[15px]/relaxed text-muted-foreground">DeepEcom provides marketplace data aggregation, profitability, payment reconciliation and detailed ERP accounting. Use of the service is subject to the agreement entered into with DeepEcom when your account is set up.</p></div><div><h2 class="text-lg font-semibold tracking-tight text-ink-900">Your accounts</h2><p class="mt-2 text-[15px]/relaxed text-muted-foreground">You are responsible for maintaining the marketplace and ERP credentials used to operate your account, and for the accuracy of the information you provide.</p></div><div><h2 class="text-lg font-semibold tracking-tight text-ink-900">Contact</h2><p class="mt-2 text-[15px]/relaxed text-muted-foreground">For any question about these terms, write to${" "}<a href="mailto:legal@deepecom.com" class="font-semibold text-brand-600">legal@deepecom.com</a>.</p></div><p class="rounded-xl border border-ink-200 bg-brand-50/40 px-4 py-3 text-sm text-muted-foreground">TODO: Full legal terms text to be provided by the DeepEcom legal team.</p></div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Questions about using DeepEcom?",
		"cta": "Talk to Us",
		"ctaHref": "/contact"
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/terms.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/terms.astro";
var $$url = "/terms";
//#endregion
//#region \0virtual:astro:page:src/pages/terms@_@astro
var page = () => terms_exports;
//#endregion
export { page };
