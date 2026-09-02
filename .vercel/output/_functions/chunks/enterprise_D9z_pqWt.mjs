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
//#region src/pages/solutions/enterprise.astro
var enterprise_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Enterprise,
	file: () => $$file,
	url: () => $$url
});
var $$Enterprise = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Enterprise — Ecommerce accounting at scale | DeepEcom",
		"description": "DeepEcom Enterprise handles high transaction volume, multi-entity and multi-warehouse complexity, GST and enterprise ERP — with the controls and auditability finance requires."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "SOLUTIONS · BY BUSINESS",
		"title": "Ecommerce accounting engineered for scale.",
		"lead": "High volume, multiple entities, warehouses and marketplaces, and enterprise ERP. DeepEcom brings order to the complexity and the controls finance depends on."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "ENTERPRISE",
		"title": "Built for the complexity that breaks generic tools.",
		"lead": "Enterprise ecommerce is a matter of scale, entities and control. DeepEcom is designed around that reality.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "High transaction volume",
				description: "Detailed accounting that holds up at enterprise order volumes.",
				icon: "zap"
			},
			{
				title: "Multi-entity complexity",
				description: "Account across entities with the structure and separation you need.",
				icon: "building"
			},
			{
				title: "Multi-warehouse operations",
				description: "Warehouse-wise accounting and stock transfers across locations.",
				icon: "boxes"
			},
			{
				title: "Multiple marketplaces",
				description: "Consolidate many marketplaces into one accountable financial layer.",
				icon: "globe"
			},
			{
				title: "GST complexity",
				description: "GST-wise accounting that keeps tax reporting accurate and auditable.",
				icon: "scale"
			},
			{
				title: "Enterprise ERP & SAP",
				description: "Post detailed accounting into enterprise ERP, including SAP connectivity.",
				icon: "bank"
			},
			{
				title: "Controls and auditability",
				description: "Structured entries and clear records that support your control environment.",
				icon: "shield"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE ENTERPRISE OUTCOME",
		"title": "Your ERP, ecommerce-ready at scale.",
		"lead": "DeepEcom makes your ERP ecommerce-ready — with the detail, controls and auditability an enterprise finance team expects.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Bring enterprise-scale ecommerce into your books.",
		"lead": "Detailed accounting and control across entities, warehouses, marketplaces and your ERP."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/solutions/enterprise.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/solutions/enterprise.astro";
var $$url = "/solutions/enterprise";
//#endregion
//#region \0virtual:astro:page:src/pages/solutions/enterprise@_@astro
var page = () => enterprise_exports;
//#endregion
export { page };
