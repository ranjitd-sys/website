import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_Do70HOEA.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/platform/payment-reconciliation.astro
var payment_reconciliation_exports = /* @__PURE__ */ __exportAll({
	default: () => $$PaymentReconciliation,
	file: () => $$file,
	url: () => $$url
});
var $$PaymentReconciliation = createComponent(($$result, $$props, $$slots) => {
	const title = "Reconcile every settlement to the rupee.";
	const features = [
		{
			title: "Expected vs Actual",
			description: "Compare the payments you expect against the payments you actually receive.",
			icon: "wallet"
		},
		{
			title: "Settlement Matching",
			description: "Match marketplace settlements to orders and payments automatically.",
			icon: "refresh"
		},
		{
			title: "Discrepancy Flags",
			description: "Surface every difference so nothing slips through unreconciled.",
			icon: "shield"
		},
		{
			title: "Net Settlement Visibility",
			description: "See the impact of fees, returns and adjustments on each settlement.",
			icon: "scale"
		},
		{
			title: "Settlement Register",
			description: "A structured record of settlements across every marketplace and period.",
			icon: "table"
		},
		{
			title: "Payment Reconciliation",
			description: "Confirm money received matches money expected across your channels.",
			icon: "bank"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": `Payment Reconciliation — ${title}`,
		"description": "DeepEcom Platform payment reconciliation matches expected settlements to actual payments and flags every discrepancy so your cash position is clear."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "PLATFORM · PAYMENT RECONCILIATION",
		"title": title,
		"lead": "What you get paid rarely matches what you expect. Understand expected versus actual payments, identify discrepancies and keep your cash position clear."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "PAYMENT RECONCILIATION",
		"title": "Know exactly what you should have been paid.",
		"lead": "Settlements from marketplaces rarely match expectations after fees, returns and adjustments. DeepEcom reconciles every settlement and flags what does not add up.",
		"features": features,
		"columns": 3,
		"center": true
	})}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "NO DISCREPANCY LEFT BEHIND",
		"title": "Reconciliation is the difference between hoping and knowing.",
		"lead": "Every settlement that does not match expectations is surfaced, so you understand your true cash position and the reasons behind every difference.",
		"center": true
	})}</section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Bring your ecommerce business and accounting together.",
		"lead": "See expected versus actual payments reconciled across your marketplaces."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/platform/payment-reconciliation.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/platform/payment-reconciliation.astro";
var $$url = "/platform/payment-reconciliation";
//#endregion
//#region \0virtual:astro:page:src/pages/platform/payment-reconciliation@_@astro
var page = () => payment_reconciliation_exports;
//#endregion
export { page };
