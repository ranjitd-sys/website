import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_DV03to9n.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_CUpFIrI5.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_BNdLphpM.mjs";
//#region src/pages/resources/ecommerce-accounting.astro
var ecommerce_accounting_exports = /* @__PURE__ */ __exportAll({
	default: () => $$EcommerceAccounting,
	file: () => $$file,
	url: () => $$url
});
var $$EcommerceAccounting = createComponent(($$result, $$props, $$slots) => {
	const topics = [
		{
			title: "Order-level accounting",
			description: "Each order is accounted individually, with the revenue, charges and fees that belong to it.",
			icon: "receipt"
		},
		{
			title: "Marketplace charges",
			description: "Commissions, shipping, storage fees and deductions captured as distinct accounting entries.",
			icon: "wallet"
		},
		{
			title: "Returns and refunds",
			description: "Returns and refunds accounted accurately, keeping receivables and ledgers aligned.",
			icon: "refresh"
		},
		{
			title: "GST-wise accounting",
			description: "GST captured and reported at the level your finance team and compliance need.",
			icon: "calculator"
		},
		{
			title: "TCS and TDS",
			description: "Ecommerce tax deductions handled and accounted correctly.",
			icon: "shield"
		},
		{
			title: "ERP posting",
			description: "Complete accounting entries posted into Tally, SAP or Zoho.",
			icon: "bank"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Ecommerce Accounting — The guide | DeepEcom",
		"description": "How marketplace transactions become detailed ecommerce accounting: order-level entries, marketplace charges, returns, GST, TCS/TDS and ERP posting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "ECOMMERCE ACCOUNTING",
		"title": "How ecommerce transactions become accounting.",
		"lead": "Ecommerce accounting is the work of turning marketplace activity — orders, fees, refunds, GST, TCS — into structured, audit-ready accounting entries inside your ERP."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE SCOPE",
		"title": "What ecommerce accounting really involves.",
		"lead": "Marketplaces don't hand you clean ledgers. The accounting layer has to carry each transaction through sale, charges, GST, receivable, payment, return and inventory.",
		"center": true
	})}</section>${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "TOPICS",
		"title": "Where DeepEcom does the work.",
		"lead": "The same detail your finance team would want, automated.",
		"features": topics,
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Your books, down to the order.",
		"lead": "See how ecommerce transactions become complete accounting entries."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/resources/ecommerce-accounting.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/resources/ecommerce-accounting.astro";
var $$url = "/resources/ecommerce-accounting";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/ecommerce-accounting@_@astro
var page = () => ecommerce_accounting_exports;
//#endregion
export { page };
