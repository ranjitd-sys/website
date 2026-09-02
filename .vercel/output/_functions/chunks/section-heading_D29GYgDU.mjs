import { D as createAstro, _ as maybeRenderHead, g as renderTemplate, p as renderSlot, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
//#region src/components/landing/section-heading.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$SectionHeading = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SectionHeading;
	const { eyebrow, title, lead, center = false } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["reveal", center && "mx-auto max-w-3xl text-center"], "class:list")}><span${addAttribute(["eyebrow", center && "eyebrow-center"], "class:list")}>${eyebrow}</span><h2 class="h2 mt-1">${title}</h2>${lead && renderTemplate`<p class="lead mt-4"${addAttribute(center, "class:max-w-xl")}>${lead}</p>`}${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/section-heading.astro", void 0);
//#endregion
export { $$SectionHeading as t };
