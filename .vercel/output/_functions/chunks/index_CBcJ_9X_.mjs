import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/erp-connector/index.astro
var erp_connector_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "ERP Connector — Make your ERP ecommerce-ready | DeepEcom",
		"description": "DeepEcom ERP Connector converts complex ecommerce transactions into detailed accounting inside your ERP, with Tally, SAP and Zoho connectivity."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "ERP CONNECTOR",
		"title": "Make your ERP ecommerce-ready.",
		"lead": "Convert complex ecommerce transactions into detailed accounting inside your ERP. Order-wise entries, marketplace charges, returns and refunds — posted into Tally, SAP or Zoho."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "DETAILED ACCOUNTING",
		"title": "More than an integration. A complete accounting layer.",
		"lead": "Every ecommerce transaction becomes structured accounting entries inside your ERP — not a generic data sync.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "Order-wise accounting",
				description: "Each order is accounted individually, with the revenue, charges and fees that belong to it.",
				icon: "receipt"
			},
			{
				title: "Marketplace charges",
				description: "Marketplace fees, commissions and deductions are captured as distinct accounting entries.",
				icon: "wallet"
			},
			{
				title: "Returns and refunds",
				description: "Returns and refunds are accounted accurately, keeping receivables and ledgers aligned.",
				icon: "refresh"
			},
			{
				title: "Detailed accounting entries",
				description: "Transactions become complete, audit-ready entries rather than summary postings.",
				icon: "table"
			},
			{
				title: "ERP posting",
				description: "Prepared entries are posted directly into your ERP, ready for your finance team.",
				icon: "bank"
			},
			{
				title: "Tally, SAP & Zoho connectivity",
				description: "Connect the connector to the ERP you run on — Tally, SAP or Zoho.",
				icon: "building"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "FROM ORDER TO LEDGER",
		"title": "The full transaction lifecycle, accounted.",
		"lead": "The ERP Connector carries each transaction through sale, GST, charges, receivable, payment, return and inventory — into your ERP.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Make your ERP ecommerce-ready.",
		"lead": "Bring the full detail of your ecommerce transactions into your accounting system."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/erp-connector/index.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/erp-connector/index.astro";
var $$url = "/erp-connector";
//#endregion
//#region \0virtual:astro:page:src/pages/erp-connector/index@_@astro
var page = () => erp_connector_exports;
//#endregion
export { page };
