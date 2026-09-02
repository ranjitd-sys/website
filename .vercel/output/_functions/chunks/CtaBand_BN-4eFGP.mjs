import { D as createAstro, _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { ArrowRight } from "lucide-react";
//#region src/components/pages/CtaBand.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$CtaBand = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CtaBand;
	const { title, lead, cta = "Book a Demo", ctaHref = "/contact", secondary, secondaryHref } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section class="cta-band"><div class="cta-band-card"><h2 class="cta-band-title">${title}</h2>${lead && renderTemplate`<p class="cta-band-lead">${lead}</p>`}<div class="cta-band-actions"><a${addAttribute(ctaHref, "href")}${addAttribute(buttonVariants({ size: "lg" }), "class")}>${cta}${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a>${secondary && secondaryHref && renderTemplate`<a${addAttribute(secondaryHref, "href")}${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>${secondary}</a>`}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/pages/CtaBand.astro", void 0);
//#endregion
export { $$CtaBand as t };
