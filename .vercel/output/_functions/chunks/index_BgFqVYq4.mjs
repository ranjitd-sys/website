import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/solutions/index.astro
var solutions_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Solutions — Outcomes for every ecommerce business and role | DeepEcom",
		"description": "DeepEcom solutions explain the outcomes for ecommerce sellers, brands and the teams that manage their money — by business and by role."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "SOLUTIONS",
		"title": "Ecommerce finance outcomes, made possible.",
		"lead": "Whether you run a marketplace business or a multi-channel brand, or you own the books, DeepEcom is built to deliver a specific outcome: understand your profitability, reconcile your payments and keep your ERP ecommerce-ready."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "BY BUSINESS",
		"title": "The businesses we serve",
		"lead": "From a single Amazon account to a multi-entity enterprise, DeepEcom scales to the shape of your ecommerce operation.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "Amazon Sellers",
				description: "Understand profitability, reconcile settlements, and account every transaction on Amazon.",
				icon: "package",
				href: "/solutions/amazon-sellers"
			},
			{
				title: "D2C Brands",
				description: "Bring website and marketplace data into one view for consolidated profitability and accounting.",
				icon: "globe",
				href: "/solutions/d2c-brands"
			},
			{
				title: "Enterprise",
				description: "Manage high-volume, multi-entity and multi-warehouse ecommerce accounting at scale.",
				icon: "building",
				href: "/solutions/enterprise"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "BY ROLE",
		"title": "The roles we serve",
		"lead": "Different people care about different outcomes. DeepEcom gives each role the answers it actually needs.",
		"center": true
	})}<div class="mt-10 grid gap-4 md:grid-cols-3">${[
		{
			title: "CFOs",
			description: "Financial visibility, cash realization, reconciliation and ERP integrity.",
			href: "/solutions/cfos"
		},
		{
			title: "Accountants",
			description: "Detailed, order-level accounting with GST, fees, returns and ERP posting.",
			href: "/solutions/accountants"
		},
		{
			title: "Business Owners",
			description: "Actual profitability, marketplace performance and money received vs expected.",
			href: "/solutions/business-owners"
		}
	].map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="flex flex-col justify-between gap-3 rounded-2xl border border-ink-200 bg-white p-6 shadow-card transition-colors hover:border-ink-300"><div><h3 class="text-lg font-semibold text-ink-900">${item.title}</h3><p class="mt-2 text-sm leading-relaxed text-ink-500">${item.description}</p></div><span class="text-sm font-semibold text-brand-600">Learn more →</span></a>`)}</div></div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "The right outcome for your business.",
		"lead": "Tell us who you are and we'll show you what DeepEcom delivers for you."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/solutions/index.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/solutions/index.astro";
var $$url = "/solutions";
//#endregion
//#region \0virtual:astro:page:src/pages/solutions/index@_@astro
var page = () => solutions_exports;
//#endregion
export { page };
