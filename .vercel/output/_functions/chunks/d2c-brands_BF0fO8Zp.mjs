import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/solutions/d2c-brands.astro
var d2c_brands_exports = /* @__PURE__ */ __exportAll({
	default: () => $$D2cBrands,
	file: () => $$file,
	url: () => $$url
});
var $$D2cBrands = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "D2C Brands — Multi-channel visibility and accounting | DeepEcom",
		"description": "DeepEcom gives D2C brands multi-channel visibility across website and marketplaces, with consolidated profitability, payment reconciliation and ERP accounting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "SOLUTIONS · BY BUSINESS",
		"title": "One clear view across every channel you sell on.",
		"lead": "Selling on your own site and multiple marketplaces spreads your money across many places. DeepEcom consolidates it into one understandable, accountable picture."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/integrations"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Integrations</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "D2C BRANDS",
		"title": "Consolidate the complexity of selling everywhere.",
		"lead": "Website and marketplace data live in different systems. DeepEcom brings them into one layer of intelligence, reconciliation and accounting.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "Multi-channel visibility",
				description: "See your whole business across website and every marketplace you sell on.",
				icon: "globe"
			},
			{
				title: "Website + marketplace data",
				description: "Combine direct and marketplace sales into a single, consistent data view.",
				icon: "layers"
			},
			{
				title: "Consolidated profitability",
				description: "Understand true profitability across every channel, not just one platform.",
				icon: "trend"
			},
			{
				title: "Payment reconciliation",
				description: "Reconcile payments across direct and marketplace channels against expectations.",
				icon: "wallet"
			},
			{
				title: "Returns management",
				description: "Account returns and refunds accurately across every channel.",
				icon: "refresh"
			},
			{
				title: "ERP accounting",
				description: "Consolidate every channel's transactions into detailed ERP accounting.",
				icon: "receipt"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE D2C OUTCOME",
		"title": "Every channel, one financial layer.",
		"lead": "DeepEcom becomes the layer between your channels and your books — so profitability and GST are accurate no matter where you sell.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Bring every channel together in one financial layer.",
		"lead": "Consolidated profitability, reconciled payments and accurate accounting."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/solutions/d2c-brands.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/solutions/d2c-brands.astro";
var $$url = "/solutions/d2c-brands";
//#endregion
//#region \0virtual:astro:page:src/pages/solutions/d2c-brands@_@astro
var page = () => d2c_brands_exports;
//#endregion
export { page };
