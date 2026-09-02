import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
//#region src/pages/security.astro
var security_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Security,
	file: () => $$file,
	url: () => $$url
});
var $$Security = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Security — DeepEcom",
		"description": "How DeepEcom keeps your marketplace and accounting data secure."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "SECURITY",
		"title": "Security built into the layer.",
		"lead": "DeepEcom handles sensitive financial data. Security is a core part of how we build and operate the product."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-3xl px-6 py-16"><div class="space-y-8"><div><h2 class="text-lg font-semibold tracking-tight text-ink-900">Access</h2><p class="mt-2 text-[15px]/relaxed text-muted-foreground">Marketplace and ERP connections use secure, read-only access wherever the platform supports it, scoped to what the product needs to function.</p></div><div><h2 class="text-lg font-semibold tracking-tight text-ink-900">Data handling</h2><p class="mt-2 text-[15px]/relaxed text-muted-foreground">Your business data is used to operate the product for you and is never resold. Details of storage, encryption and retention are covered in the agreement with your account.</p></div><div><h2 class="text-lg font-semibold tracking-tight text-ink-900">Contact</h2><p class="mt-2 text-[15px]/relaxed text-muted-foreground">For security questions, write to${" "}<a href="mailto:security@deepecom.com" class="font-semibold text-brand-600">security@deepecom.com</a>.</p></div><p class="rounded-xl border border-ink-200 bg-brand-50/40 px-4 py-3 text-sm text-muted-foreground">TODO: Full security documentation and certifications to be added as they are verified.</p></div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "See DeepEcom on your own data.",
		"cta": "Book a Demo",
		"ctaHref": "/contact"
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/security.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/security.astro";
var $$url = "/security";
//#endregion
//#region \0virtual:astro:page:src/pages/security@_@astro
var page = () => security_exports;
//#endregion
export { page };
