import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/platform/reports.astro
var reports_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Reports,
	file: () => $$file,
	url: () => $$url
});
var $$Reports = createComponent(($$result, $$props, $$slots) => {
	const title = "Reports your finance team can actually use.";
	const features = [
		{
			title: "Structured Reports",
			description: "Clean, structured reports on orders, settlements, profitability and reconciliation.",
			icon: "file"
		},
		{
			title: "GST-Ready Data",
			description: "Exports structured for GST reporting so finance can move faster.",
			icon: "grid"
		},
		{
			title: "Ledger-Ready Exports",
			description: "Transaction-level exports your accounting workflow can consume.",
			icon: "receipt"
		},
		{
			title: "Customizable Views",
			description: "Reports tailored to the channels, periods and metrics you care about.",
			icon: "book"
		},
		{
			title: "Consistent Format",
			description: "A consistent structure across every marketplace you sell on.",
			icon: "table"
		},
		{
			title: "Fresh Data",
			description: "Exports and reports built from current, aggregated marketplace data.",
			icon: "refresh2"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": `Reports — ${title}`,
		"description": "DeepEcom Platform reports and exports turn marketplace data into structured, GST-ready reports your finance team can use."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "PLATFORM · REPORTS",
		"title": title,
		"lead": "Download clean, structured reports and GST-ready exports built from your marketplace data — no more re-keying numbers out of raw marketplace files."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "REPORTS & EXPORTS",
		"title": "Move from raw files to usable reports.",
		"lead": "Raw marketplace files are hard to use. DeepEcom turns them into structured reports and exports your finance team can work with directly.",
		"features": features,
		"columns": 3,
		"center": true
	})}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "READY TO USE",
		"title": "Export data once, in a format that works.",
		"lead": "Whether it is GST-ready data or transaction-level exports for your books, reports come out structured and consistent across every marketplace.",
		"center": true
	})}</section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Bring your ecommerce business and accounting together.",
		"lead": "Get structured, GST-ready reports from your marketplace data."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/platform/reports.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/platform/reports.astro";
var $$url = "/platform/reports";
//#endregion
//#region \0virtual:astro:page:src/pages/platform/reports@_@astro
var page = () => reports_exports;
//#endregion
export { page };
