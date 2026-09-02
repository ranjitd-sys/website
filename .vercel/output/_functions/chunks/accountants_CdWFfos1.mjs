import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/solutions/accountants.astro
var accountants_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Accountants,
	file: () => $$file,
	url: () => $$url
});
var $$Accountants = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Accountants — Detailed ecommerce accounting and ERP posting | DeepEcom",
		"description": "DeepEcom gives accountants order-level accounting, GST, marketplace fees, TCS/TDS, returns, warehouse accounting, stock transfers and ERP posting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "SOLUTIONS · BY ROLE",
		"title": "Accounting detail your ERP actually needs.",
		"lead": "Ecommerce accounting is about detail — order by order, fee by fee, return by return. DeepEcom turns that complexity into entries you can post with confidence."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "ACCOUNTANTS",
		"title": "Every ecommerce transaction, correctly accounted.",
		"lead": "From order-level entries to ERP posting, DeepEcom handles the detail that manual ecommerce accounting struggles to keep up with.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "Detailed accounting",
				description: "Complete, structured entries instead of vague summary postings.",
				icon: "table"
			},
			{
				title: "Order-level accounting",
				description: "Each order accounted individually, with the revenue and charges that belong to it.",
				icon: "receipt"
			},
			{
				title: "GST",
				description: "GST-wise accounting that keeps tax reporting accurate.",
				icon: "scale"
			},
			{
				title: "Marketplace fees",
				description: "Commissions and deductions captured as distinct, accurate accounting entries.",
				icon: "wallet"
			},
			{
				title: "TCS/TDS",
				description: "TCS and TDS-related accounting handled precisely.",
				icon: "calculator"
			},
			{
				title: "Returns and refunds",
				description: "Returns accounted accurately, keeping receivables and ledgers aligned.",
				icon: "refresh"
			},
			{
				title: "Warehouse accounting",
				description: "Inventory and stock accounted at the warehouse level.",
				icon: "boxes"
			},
			{
				title: "Stock transfers",
				description: "Movements between warehouses accounted accurately.",
				icon: "truck"
			},
			{
				title: "ERP posting",
				description: "Prepared entries posted directly into your ERP, ready for review.",
				icon: "bank"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE ACCOUNTANT OUTCOME",
		"title": "Entries you can post without second-guessing.",
		"lead": "DeepEcom prepares the detail — GST, fees, TCS/TDS, returns and stock transfers — so your ERP posting is accurate and complete.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Turn ecommerce complexity into clean accounting.",
		"lead": "Order-level detail, GST, fees and stock transfers — ready for your ERP."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/solutions/accountants.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/solutions/accountants.astro";
var $$url = "/solutions/accountants";
//#endregion
//#region \0virtual:astro:page:src/pages/solutions/accountants@_@astro
var page = () => accountants_exports;
//#endregion
export { page };
