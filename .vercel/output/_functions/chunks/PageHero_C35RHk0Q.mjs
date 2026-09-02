import { D as createAstro, _ as maybeRenderHead, c as renderComponent, g as renderTemplate, p as renderSlot, v as renderHead, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent, n as $$Font } from "./_astro_assets_DbfyT0-S.mjs";
import { n as Navbar, t as $$SiteFooter } from "./site-footer_CIM149FG.mjs";
//#region src/layouts/PageLayout.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$PageLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PageLayout;
	const { title = "DeepEcom — Ecommerce Finance Control Center", description = "DeepEcom connects ecommerce marketplaces to business intelligence, payment reconciliation and detailed ERP accounting.", ogKey = "landing" } = Astro.props;
	const site = Astro.site ?? new URL("http://localhost:4321");
	const canonical = new URL(Astro.url.pathname, site);
	const ogImage = new URL(`/og/${ogKey}.png`, site);
	const isHome = (Astro.url.pathname.replace(/\/+$/, "") || "/") === "/";
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonical, "href")}><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(ogImage, "content")}><link rel="icon" href="/logo.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,450;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet">${renderComponent($$result, "Font", $$Font, {
		"cssVariable": "--font-inter",
		"preload": true
	})}${renderHead($$result)}</head><body${addAttribute(["min-h-screen overflow-x-hidden bg-background text-foreground antialiased", isHome && "home-page"], "class:list")}>${renderComponent($$result, "SiteNav", Navbar, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "@/components/landing/site-nav",
		"client:component-export": "default"
	})}<main>${renderSlot($$result, $$slots["default"])}</main>${renderComponent($$result, "SiteFooter", $$SiteFooter, {})}</body></html>`;
}, "/home/ranjit/Documents/deepecom/website/src/layouts/PageLayout.astro", void 0);
//#endregion
//#region src/components/pages/PageHero.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$PageHero = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PageHero;
	const { eyebrow, title, lead, center = true } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section class="page-hero" data-hero><div class="page-hero-inner">${eyebrow && renderTemplate`<span class="page-hero-eyebrow">${eyebrow}</span>`}<h1 class="page-hero-title">${title}</h1>${lead && renderTemplate`<p class="page-hero-lead">${lead}</p>`}<div class="page-hero-ctas">${renderSlot($$result, $$slots["default"])}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/pages/PageHero.astro", void 0);
//#endregion
export { $$PageLayout as n, $$PageHero as t };
