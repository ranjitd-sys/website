import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
//#region src/pages/resources/gst.astro
var gst_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Gst,
	file: () => $$file,
	url: () => $$url
});
var $$Gst = createComponent(($$result, $$props, $$slots) => {
	const topics = [
		{
			title: "GST-wise accounting",
			description: "GST captured, classified and reported the way compliance requires.",
			icon: "calculator"
		},
		{
			title: "Ecommerce GST",
			description: "How marketplace sales, deductions and settlements interact with GST.",
			icon: "receipt"
		},
		{
			title: "TCS and TDS",
			description: "Ecommerce tax collection and deduction, accounted correctly.",
			icon: "shield"
		},
		{
			title: "Multi-state GST",
			description: "Multiple GST numbers and state-wise reporting for multi-state operations.",
			icon: "globe"
		},
		{
			title: "GST-ready reports",
			description: "Structured reports your finance team can use directly.",
			icon: "file"
		},
		{
			title: "Marketplace GST deductions",
			description: "GST components within marketplace charges, isolated from the rest.",
			icon: "layers"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "GST — Ecommerce GST, explained | DeepEcom",
		"description": "Ecommerce GST for sellers: GST-wise accounting, TCS/TDS, multi-state GST numbers and GST-ready reports across marketplaces."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "GST",
		"title": "Ecommerce GST, without the spreadsheet gymnastics.",
		"lead": "Marketplaces, GST and settlements interact in ways that rarely line up on their own. GST-wise accounting keeps the tax side of ecommerce clean and reportable."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE SCOPE",
		"title": "What ecommerce GST involves.",
		"lead": "Every sale, charge and settlement carries GST components. The accounting layer has to classify them correctly and make them reportable — across states, GST numbers and marketplaces.",
		"center": true
	})}</section>${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "TOPICS",
		"title": "GST, handled at the transaction level.",
		"lead": "Tax detail your compliance team can rely on.",
		"features": topics,
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Keep GST on the right side of your books.",
		"lead": "Talk to us about GST-wise accounting for your business."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/resources/gst.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/resources/gst.astro";
var $$url = "/resources/gst";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/gst@_@astro
var page = () => gst_exports;
//#endregion
export { page };
