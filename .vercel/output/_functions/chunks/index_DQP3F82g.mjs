import { c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
//#region src/pages/resources/index.astro
var resources_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const resources = [
		{
			title: "Blog",
			description: "Notes on ecommerce finance, marketplace reconciliation and accounting.",
			icon: "book",
			href: "/resources/blog"
		},
		{
			title: "Guides",
			description: "Step-by-step guides for setting up and using DeepEcom.",
			icon: "file",
			href: "/resources/guides"
		},
		{
			title: "FAQs",
			description: "Straight answers to the questions sellers ask most.",
			icon: "help",
			href: "/resources/faqs"
		},
		{
			title: "Help Center",
			description: "Find answers, or talk to a real person.",
			icon: "search",
			href: "/resources/help-center"
		},
		{
			title: "Ecommerce Accounting",
			description: "How marketplace transactions become structured accounting entries.",
			icon: "calculator",
			href: "/resources/ecommerce-accounting"
		},
		{
			title: "Reconciliation",
			description: "Expected vs actual — marketplace settlement reconciliation.",
			icon: "wallet",
			href: "/resources/reconciliation"
		},
		{
			title: "GST",
			description: "GST-wise accounting, TCS/TDS and ecommerce compliance.",
			icon: "shield",
			href: "/resources/gst"
		},
		{
			title: "ERP",
			description: "Tally, SAP and Zoho — making your ERP ecommerce-ready.",
			icon: "building",
			href: "/resources/erp"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Resources — Learn how DeepEcom works | DeepEcom",
		"description": "Resources on ecommerce accounting, marketplace reconciliation, GST and ERP integration — plus FAQs, guides and help from the DeepEcom team."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "RESOURCES",
		"title": "Learn how ecommerce finance works.",
		"lead": "From marketplace settlement reconciliation to GST and ERP posting, the resources hub covers the topics that matter for ecommerce accounting — with guides, FAQs and direct help."
	})}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "EXPLORE",
		"title": "Everything worth knowing, in one place.",
		"lead": "Choose a topic to get started.",
		"features": resources,
		"columns": 4,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Questions the resources don't cover?",
		"lead": "Talk to us directly and we'll show you how DeepEcom fits your business."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/resources/index.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/resources/index.astro";
var $$url = "/resources";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/index@_@astro
var page = () => resources_exports;
//#endregion
export { page };
