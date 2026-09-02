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
//#region src/pages/solutions/business-owners.astro
var business_owners_exports = /* @__PURE__ */ __exportAll({
	default: () => $$BusinessOwners,
	file: () => $$file,
	url: () => $$url
});
var $$BusinessOwners = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Business Owners — Understand your ecommerce business | DeepEcom",
		"description": "DeepEcom helps business owners see actual profitability, marketplace performance and money received vs expected, reducing dependence on finance teams."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "SOLUTIONS · BY ROLE",
		"title": "Know what your ecommerce business is really making.",
		"lead": "Marketplace numbers rarely tell you your true profit. DeepEcom shows actual profitability, what you get paid versus what you expect, and how each product and channel performs."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "BUSINESS OWNERS",
		"title": "Run your business on what actually happened.",
		"lead": "Instead of waiting on reports you can't verify, get the answers you need directly — from data that is reconciled and accounted.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "Actual profitability",
				description: "See real profit after marketplace fees, deductions and returns.",
				icon: "trend"
			},
			{
				title: "Marketplace performance",
				description: "Understand how each marketplace performs and contributes to the business.",
				icon: "chart"
			},
			{
				title: "Money received vs expected",
				description: "Confirm what you should have been paid against what you actually received.",
				icon: "wallet"
			},
			{
				title: "Product & channel performance",
				description: "See which products and channels actually drive profit.",
				icon: "package"
			},
			{
				title: "Business visibility",
				description: "A clear, current picture of the whole business, without digging through data.",
				icon: "gauge"
			},
			{
				title: "Less finance dependency",
				description: "Get the numbers you need directly, instead of waiting on finance.",
				icon: "zap"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "THE OWNER OUTCOME",
		"title": "Run the business, not the spreadsheets.",
		"lead": "DeepEcom turns marketplace data into the answers you need — profitability, payments and performance — so you can act on what is true.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "See your business the way it actually is.",
		"lead": "Real profitability, reconciled payments and clear performance — on your own."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/solutions/business-owners.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/solutions/business-owners.astro";
var $$url = "/solutions/business-owners";
//#endregion
//#region \0virtual:astro:page:src/pages/solutions/business-owners@_@astro
var page = () => business_owners_exports;
//#endregion
export { page };
