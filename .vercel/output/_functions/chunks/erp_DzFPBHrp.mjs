import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
//#region src/pages/resources/erp.astro
var erp_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Erp,
	file: () => $$file,
	url: () => $$url
});
var $$Erp = createComponent(($$result, $$props, $$slots) => {
	const topics = [
		{
			title: "Tally connectivity",
			description: "Detailed ecommerce vouchers synced cleanly into Tally.",
			icon: "calculator"
		},
		{
			title: "SAP connectivity",
			description: "Structured, audit-ready entries for enterprise SAP environments.",
			icon: "building"
		},
		{
			title: "Zoho connectivity",
			description: "Ecommerce accounting posted into Zoho the way your team expects.",
			icon: "bank"
		},
		{
			title: "ERP posting",
			description: "Prepared entries posted directly into your ERP, ready for finance.",
			icon: "table"
		},
		{
			title: "Order-wise entries",
			description: "Each transaction accounted individually, not as a summary batch.",
			icon: "receipt"
		},
		{
			title: "Inventory accounting",
			description: "Stock movements and transfers accounted alongside the ledger.",
			icon: "boxes"
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "ERP — Make your ERP ecommerce-ready | DeepEcom",
		"description": "ERP integration for ecommerce: detailed accounting posted into Tally, SAP and Zoho, with order-wise entries, GST and inventory accounting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "ERP",
		"title": "Make your ERP ecommerce-ready.",
		"lead": "Your ERP is built for accounting, not for marketplaces. DeepEcom converts complex ecommerce transactions into detailed accounting entries inside the ERP you already run — Tally, SAP or Zoho."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-6xl px-6 py-20">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE SCOPE",
		"title": "More than an integration.",
		"lead": "A generic data sync isn't accounting. The ERP Connector carries each transaction through sale, GST, charges, receivable, payment, return and inventory — into your ERP as structured entries.",
		"center": true
	})}</section>${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "TOPICS",
		"title": "Detailed accounting, posted where you work.",
		"lead": "Your ERP stays your system of record — now ecommerce-ready.",
		"features": topics,
		"columns": 3,
		"center": true
	})}${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Your ERP, ready for ecommerce.",
		"lead": "See how detailed ecommerce accounting lands in Tally, SAP or Zoho."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/resources/erp.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/resources/erp.astro";
var $$url = "/resources/erp";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/erp@_@astro
var page = () => erp_exports;
//#endregion
export { page };
