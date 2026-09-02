import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CKJGCi14.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_DV03to9n.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_CUpFIrI5.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_BNdLphpM.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/solutions/cfos.astro
var cfos_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Cfos,
	file: () => $$file,
	url: () => $$url
});
var $$Cfos = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "CFOs — Financial visibility and ERP integrity | DeepEcom",
		"description": "DeepEcom gives CFOs clear profitability, cash realization, reconciliation and ERP integrity across their ecommerce business."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "SOLUTIONS · BY ROLE",
		"title": "A clear financial picture of your ecommerce business.",
		"lead": "Ecommerce spreads money and data across many systems. DeepEcom gives you the visibility, reconciliation and control you need to report with confidence."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "CFOs",
		"title": "Financial leadership built on real data.",
		"lead": "The questions finance leaders ask need answers that come from reconciled, accounted and controlled data.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "Profitability",
				description: "See true profitability across your business, after fees, deductions and returns.",
				icon: "trend"
			},
			{
				title: "Cash realization",
				description: "Understand what you should be paid and confirm what you actually receive.",
				icon: "bank"
			},
			{
				title: "Financial visibility",
				description: "One reliable view of revenue, receivables and accounting across channels.",
				icon: "gauge"
			},
			{
				title: "Reconciliation",
				description: "Reconcile expected versus actual payments and surface every discrepancy.",
				icon: "refresh"
			},
			{
				title: "Controls",
				description: "Structured, audit-ready records that support your control environment.",
				icon: "shield"
			},
			{
				title: "Reporting",
				description: "Reports and exports that support management and financial reporting.",
				icon: "file"
			},
			{
				title: "ERP integrity",
				description: "Keep your ERP accurate with detailed, posted accounting you can trust.",
				icon: "check"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE CFO OUTCOME",
		"title": "Confidence in the numbers you report.",
		"lead": "DeepEcom ties marketplace data to reconciled cash and your ERP, so the picture you present is the one that is actually true.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Report on a business you actually understand.",
		"lead": "Clear profitability, reconciled payments and an ERP that reflects reality."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/solutions/cfos.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/solutions/cfos.astro";
var $$url = "/solutions/cfos";
//#endregion
//#region \0virtual:astro:page:src/pages/solutions/cfos@_@astro
var page = () => cfos_exports;
//#endregion
export { page };
