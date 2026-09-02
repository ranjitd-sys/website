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
//#region src/pages/erp-connector/accounting.astro
var accounting_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Accounting,
	file: () => $$file,
	url: () => $$url
});
var $$Accounting = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Accounting — Detailed Ecommerce Accounting for ERP | DeepEcom",
		"description": "Order-wise, GST-wise and warehouse-wise accounting with detailed accounting entries, TCS/TDS and ERP posting inside the DeepEcom ERP Connector."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "ERP CONNECTOR · ACCOUNTING",
		"title": "Detailed ecommerce accounting inside your ERP.",
		"lead": "Account every order, GST head and warehouse precisely. DeepEcom turns complex ecommerce transactions into detailed, ERP-ready accounting entries."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "ACCOUNTING",
		"title": "Account with precision, at every level.",
		"lead": "Detailed accounting that reflects how your ecommerce business actually runs.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "Order-wise accounting",
				description: "Revenue, charges and fees are accounted at the level of each individual order.",
				icon: "receipt"
			},
			{
				title: "GST-wise accounting",
				description: "GST is separated and accounted by head, so your tax ledgers stay accurate.",
				icon: "scale"
			},
			{
				title: "Warehouse-wise accounting",
				description: "Accounting is kept distinct across warehouses, matching your operations.",
				icon: "boxes"
			},
			{
				title: "Detailed accounting entries",
				description: "Complete, audit-ready entries replace thin summary postings.",
				icon: "table"
			},
			{
				title: "TCS / TDS accounting",
				description: "TCS and TDS-related accounting is captured within the entries it applies to.",
				icon: "file"
			},
			{
				title: "ERP posting",
				description: "Prepared entries post directly into your ERP, ready for your finance team.",
				icon: "bank"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "PRECISION",
		"title": "Accounting that reflects real ecommerce complexity.",
		"lead": "Marketplace fees, GST, TCS/TDS, returns and warehouses — accounted in the detail your ERP needs.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Make your ERP ecommerce-ready.",
		"lead": "Bring order-level, GST-wise and warehouse-wise accounting into your ERP."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/erp-connector/accounting.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/erp-connector/accounting.astro";
var $$url = "/erp-connector/accounting";
//#endregion
//#region \0virtual:astro:page:src/pages/erp-connector/accounting@_@astro
var page = () => accounting_exports;
//#endregion
export { page };
