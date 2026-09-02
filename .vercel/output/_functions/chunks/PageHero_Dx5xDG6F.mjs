import { D as createAstro, _ as maybeRenderHead, g as renderTemplate, p as renderSlot } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
//#region src/components/pages/PageHero.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$PageHero = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PageHero;
	const { eyebrow, title, lead, center = true } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section class="page-hero" data-hero><div class="page-hero-inner">${eyebrow && renderTemplate`<span class="page-hero-eyebrow">${eyebrow}</span>`}<h1 class="page-hero-title">${title}</h1>${lead && renderTemplate`<p class="page-hero-lead">${lead}</p>`}<div class="page-hero-ctas">${renderSlot($$result, $$slots["default"])}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/pages/PageHero.astro", void 0);
//#endregion
export { $$PageHero as t };
