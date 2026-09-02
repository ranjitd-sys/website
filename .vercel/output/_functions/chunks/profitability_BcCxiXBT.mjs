import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/platform/profitability.astro
var profitability_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Profitability,
	file: () => $$file,
	url: () => $$url
});
var $$Profitability = createComponent(($$result, $$props, $$slots) => {
	const title = "Know what your ecommerce business actually earns.";
	const features = [
		{
			title: "Channel Profitability",
			description: "See profitability per marketplace so you know where you genuinely make money.",
			icon: "trend"
		},
		{
			title: "SKU-Level Profitability",
			description: "Break profitability down to the SKU to identify your strongest and weakest products.",
			icon: "package"
		},
		{
			title: "Margin & Cost Breakdown",
			description: "Understand the cost of every order — marketplace fees, shipping and ads included.",
			icon: "calculator"
		},
		{
			title: "Net Margin Clarity",
			description: "See revenue after deductions so gross numbers never hide the true picture.",
			icon: "scale"
		},
		{
			title: "P&L View",
			description: "A structured profit-and-loss view built from real ecommerce transactions.",
			icon: "receipt"
		},
		{
			title: "Cost Allocation",
			description: "Attribute fees and charges to the right orders, SKUs and channels.",
			icon: "tag"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": `Profitability — ${title}`,
		"description": "DeepEcom Platform profitability analysis shows SKU and channel-level margins, the cost of every order, and a clear P&L built from real marketplace transactions."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "PLATFORM · PROFITABILITY",
		"title": title,
		"lead": "Revenue figures only tell part of the story. Understand margins at the SKU and channel level and see exactly what drives — or erodes — your profit."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "PROFITABILITY",
		"title": "Profitability that reflects the real cost of ecommerce.",
		"lead": "Marketplace fees, shipping and ads quietly eat into margins. DeepEcom attributes every cost to the right order, SKU and channel so your profitability is accurate.",
		"features": features,
		"columns": 3,
		"center": true
	})}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "BEYOND REVENUE",
		"title": "Gross revenue hides more than it reveals.",
		"lead": "Ecommerce revenue rarely equals what you keep. Deductions, fees and returns all shape the real picture — DeepEcom surfaces profitability after those costs, not before them.",
		"center": true
	})}</section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Bring your ecommerce business and accounting together.",
		"lead": "See accurate profitability across your SKUs and channels."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/platform/profitability.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/platform/profitability.astro";
var $$url = "/platform/profitability";
//#endregion
//#region \0virtual:astro:page:src/pages/platform/profitability@_@astro
var page = () => profitability_exports;
//#endregion
export { page };
