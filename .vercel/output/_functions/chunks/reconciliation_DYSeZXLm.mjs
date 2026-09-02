import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
//#region src/pages/resources/reconciliation.astro
var reconciliation_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Reconciliation,
	file: () => $$file,
	url: () => $$url
});
var $$Reconciliation = createComponent(($$result, $$props, $$slots) => {
	const topics = [
		{
			title: "Settlement reconciliation",
			description: "Matching expected settlements from each marketplace to actual payments received.",
			icon: "wallet"
		},
		{
			title: "Expected vs actual",
			description: "Comparing what a marketplace said it would pay with what landed in your account.",
			icon: "scale"
		},
		{
			title: "Discrepancy flagging",
			description: "Surfacing mismatches — missing payouts, unexplained deductions — for review.",
			icon: "target"
		},
		{
			title: "Amazon settlement reconciliation",
			description: "Amazon settlement reports reconciled order-by-order, fee by fee.",
			icon: "package"
		},
		{
			title: "Multi-channel reconciliation",
			description: "One reconciliation view across Amazon, Flipkart, Shopify and other channels.",
			icon: "layers"
		},
		{
			title: "Historical imports",
			description: "Backdated settlements imported and reconciled for any past period.",
			icon: "refresh2"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Reconciliation — Marketplace settlement reconciliation | DeepEcom",
		"description": "Marketplace settlement reconciliation: matching expected settlements to actual payments, flagging discrepancies, and reconciling Amazon and other channels."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "RECONCILIATION",
		"title": "Where money received meets money expected.",
		"lead": "Every marketplace settles differently. Reconciliation is the work of matching what each channel said it would pay with what actually landed in your account — and finding the difference."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE SCOPE",
		"title": "Why settlements rarely match.",
		"lead": "Fees, refunds, reversals and timing differences mean the payout in your bank almost never equals the settlement report. Reconciliation turns that gap into something you understand.",
		"center": true
	})}</section>${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "TOPICS",
		"title": "Reconciliation, made methodical.",
		"lead": "The same rigor a finance team would apply, applied to every settlement automatically.",
		"features": topics,
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Know exactly what you're owed.",
		"lead": "See reconciliation running on sample settlements."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/resources/reconciliation.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/resources/reconciliation.astro";
var $$url = "/resources/reconciliation";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/reconciliation@_@astro
var page = () => reconciliation_exports;
//#endregion
export { page };
