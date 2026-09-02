import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { t as $$PageLayout } from "./PageLayout_BkYIvqyx.mjs";
import { t as $$PageHero } from "./PageHero_Dx5xDG6F.mjs";
import { t as $$CtaBand } from "./CtaBand_BN-4eFGP.mjs";
import { t as __exportAll } from "./index_iApByinR.mjs";
import { createContext, useContext, useState } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/landing/ui/accordion.tsx
var AccordionContext = createContext(null);
function useAccordion() {
	const ctx = useContext(AccordionContext);
	if (!ctx) throw new Error("Accordion components must be used inside <Accordion>");
	return ctx;
}
var ItemContext = createContext(null);
function useItem() {
	const ctx = useContext(ItemContext);
	if (!ctx) throw new Error("AccordionItem/Trigger/Panel must be used inside <AccordionItem>");
	return ctx;
}
function Accordion({ multiple = false, className, children, ...props }) {
	const [openValue, setOpenValue] = useState(null);
	const toggle = (value) => setOpenValue((prev) => prev === value ? null : value);
	return /* @__PURE__ */ jsx(AccordionContext.Provider, {
		value: {
			openValue,
			toggle
		},
		children: /* @__PURE__ */ jsx("div", {
			className,
			...props,
			children
		})
	});
}
function AccordionItem({ value, className, children, ...props }) {
	const { openValue, toggle } = useAccordion();
	const expanded = openValue === value;
	return /* @__PURE__ */ jsx(ItemContext.Provider, {
		value: {
			value,
			expanded
		},
		children: /* @__PURE__ */ jsx("div", {
			className: twMerge(clsx("border-b border-ink-200 last:border-0", expanded && "bg-white", className)),
			...props,
			children
		})
	});
}
function AccordionTrigger({ className, children, ...props }) {
	const { value, expanded } = useItem();
	const { toggle } = useAccordion();
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		"aria-expanded": expanded,
		onClick: () => toggle(value),
		className: twMerge(clsx("flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-ink-900 transition-colors hover:text-primary", className)),
		...props,
		children: [children, /* @__PURE__ */ jsx(ChevronDown, {
			size: 16,
			strokeWidth: 2,
			className: twMerge(clsx("shrink-0 text-muted-foreground transition-transform duration-200", expanded && "rotate-180")),
			"aria-hidden": true
		})]
	});
}
function AccordionPanel({ className, children, ...props }) {
	const { expanded } = useItem();
	return /* @__PURE__ */ jsx("div", {
		className: twMerge(clsx("grid transition-all duration-200 ease-out", expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0", className)),
		...props,
		children: /* @__PURE__ */ jsx("div", {
			className: "overflow-hidden",
			children: /* @__PURE__ */ jsx("div", {
				className: "pb-4",
				children
			})
		})
	});
}
//#endregion
//#region src/components/landing/faq-accordion.tsx
var FAQS = [
	["Can DeepEcom integrate with Amazon, Flipkart and other marketplaces?", "Yes. DeepEcom integrates with Amazon, Flipkart, Shopify, Meesho and other supported channels through secure read-only APIs. New marketplaces are added based on customer demand — tell us which one you need."],
	["Is it possible to integrate multiple warehouses into Tally using DeepEcom?", "Absolutely. DeepEcom supports multi-warehouse inventory tracking with proper stock allocation and location mapping, so every warehouse syncs cleanly into Tally."],
	["My business operates in multiple states with different GST numbers. Can DeepEcom accommodate this?", "Yes. DeepEcom supports multiple GST numbers with state-wise reporting, so multi-state operations stay compliant without extra spreadsheets."],
	["Will I need to manually upload files for accounting purposes?", "No manual uploads required. Settlement reports, order data and commission details are fetched automatically from your connected marketplaces via API. For backdated data, you can also drag-and-drop PDF or CSV reports."],
	["Can I sync data from previous fiscal years into Tally with DeepEcom?", "Yes. Import historical settlement reports and DeepEcom will reconcile them order-by-order and generate vouchers you can bulk-sync to Tally for any past period."],
	["How is pricing determined for DeepEcom?", "Plans are sized by monthly order volume, billed quarterly. You can upgrade or downgrade as you grow, and there are no per-seat fees or hidden charges."],
	["How does DeepEcom handle products with different names across Amazon, Flipkart, and Tally?", "Intelligent SKU mapping links listings that differ across platforms. Set mapping rules once and DeepEcom applies them everywhere, surfacing exceptions for review instead of guessing."],
	["Does DeepEcom account for all the expenses charged by Amazon and other marketplaces?", "Yes — commissions, shipping, storage fees, advertising, refunds and compensation are extracted line-by-line from each settlement and categorized automatically, so your true net payout is always accurate."],
	["Can I reconcile marketplace warehouse inventory with my Tally accounts?", "Yes. Periodic stock summaries sync from each marketplace warehouse into Tally with valuation and location mapping, keeping physical and book inventory aligned."],
	["Is it possible to analyze profit and loss within DeepEcom?", "Absolutely. DeepEcom provides full P&L analysis at the SKU, order, channel and business level, with visual dashboards and exportable reports your CA will actually enjoy reading."]
];
function FaqAccordion() {
	return /* @__PURE__ */ jsx(Accordion, {
		className: "mx-auto max-w-3xl",
		children: FAQS.map(([q, a], i) => /* @__PURE__ */ jsxs(AccordionItem, {
			value: `faq-${i}`,
			children: [/* @__PURE__ */ jsx(AccordionTrigger, { children: q }), /* @__PURE__ */ jsx(AccordionPanel, {
				className: "text-sm/relaxed text-muted-foreground",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-2xl",
					children: a
				})
			})]
		}, i))
	});
}
//#endregion
//#region src/pages/resources/faqs.astro
var faqs_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Faqs,
	file: () => $$file,
	url: () => $$url
});
var $$Faqs = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "FAQs — Frequently asked questions | DeepEcom",
		"description": "Frequently asked questions about DeepEcom — marketplace integrations, GST numbers, historical data, SKU mapping, pricing and multi-warehouse accounting."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "FAQS",
		"title": "Frequently asked questions.",
		"lead": "Straight answers on integrations, GST, reconciliation, historical data, SKU mapping and how pricing works."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-3xl px-6 pb-20">${renderComponent($$result, "FaqAccordion", FaqAccordion, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "@/components/landing/faq-accordion",
		"client:component-export": "default"
	})}</section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Question not answered here?",
		"lead": "Talk to a real person — we respond within one business day."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/resources/faqs.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/resources/faqs.astro";
var $$url = "/resources/faqs";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/faqs@_@astro
var page = () => faqs_exports;
//#endregion
export { page };
