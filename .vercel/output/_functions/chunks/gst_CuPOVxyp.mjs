import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/erp-connector/gst.astro
var gst_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Gst,
	file: () => $$file,
	url: () => $$url
});
var $$Gst = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "GST — GST-wise Ecommerce Accounting for ERP | DeepEcom",
		"description": "GST-wise accounting and GST-ready exports for returns in the DeepEcom ERP Connector, so tax ledgers stay accurate inside your ERP."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "ERP CONNECTOR · GST",
		"title": "GST-wise accounting, ready for your ERP.",
		"lead": "Separate GST by head and account it correctly across orders and returns — with exports prepared for filing."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "GST",
		"title": "Tax accounting that stays accurate.",
		"lead": "GST handled at the level of detail your returns require.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "GST-wise accounting",
				description: "GST is isolated and accounted by head, so tax ledgers stay clean and accurate.",
				icon: "scale"
			},
			{
				title: "GST-ready exports",
				description: "Data is prepared for GST returns, structured for filing.",
				icon: "file"
			},
			{
				title: "Returns and refunds",
				description: "GST on returns and refunds is adjusted accurately within the accounting.",
				icon: "refresh"
			},
			{
				title: "Marketplace charges",
				description: "Tax treatment of marketplace charges is accounted distinctly.",
				icon: "wallet"
			},
			{
				title: "Detailed accounting entries",
				description: "Each GST head lands in the right place in your ledgers.",
				icon: "table"
			},
			{
				title: "ERP posting",
				description: "GST-wise entries post into your ERP alongside the transactions they belong to.",
				icon: "bank"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "COMPLIANCE",
		"title": "Tax detail that belongs in your books.",
		"lead": "GST-wise accounting keeps your ecommerce tax position clear and your ERP ready for returns.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Make your ERP ecommerce-ready.",
		"lead": "Account GST by head and prepare exports for returns inside your ERP."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/erp-connector/gst.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/erp-connector/gst.astro";
var $$url = "/erp-connector/gst";
//#endregion
//#region \0virtual:astro:page:src/pages/erp-connector/gst@_@astro
var page = () => gst_exports;
//#endregion
export { page };
