import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	url: () => $$url
});
var $$Login = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Login — DeepEcom",
		"description": "Sign in to your DeepEcom workspace."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="relative overflow-hidden px-6 pb-24 pt-28"><div class="pointer-events-none absolute inset-0" aria-hidden="true" style="background:
        radial-gradient(38rem 20rem at 80% -8%, rgba(83, 58, 253, 0.12), transparent 60%),
        radial-gradient(30rem 16rem at 12% -6%, rgba(127, 125, 252, 0.1), transparent 58%)"></div><div class="relative mx-auto w-full max-w-md rounded-2xl border border-ink-200 bg-white p-8 shadow-card"><div class="text-center"><h1 class="text-2xl font-bold tracking-tight text-ink-950">Welcome back</h1><p class="mt-2 text-sm text-muted-foreground">Sign in to your DeepEcom workspace.</p></div><div class="mt-8 grid gap-4"><label class="grid gap-1.5"><span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</span><input type="email" placeholder="you@company.com" class="h-11 rounded-lg border border-ink-200 bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"></label><label class="grid gap-1.5"><span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</span><input type="password" placeholder="••••••••" class="h-11 rounded-lg border border-ink-200 bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"></label><button type="button"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Sign in${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</button></div><p class="mt-6 rounded-lg border border-ink-200 bg-brand-50/40 px-3.5 py-3 text-center text-[13px] leading-relaxed text-muted-foreground">Access to the DeepEcom application is provided to customers during onboarding. Not a customer yet? <a href="/contact" class="font-semibold text-brand-600">Book a demo</a>.</p></div></section>` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/login.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
