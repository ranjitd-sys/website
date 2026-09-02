import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants } from "./site-footer_CIM149FG.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_C35RHk0Q.mjs";
import { t as $$FeatureGrid } from "./FeatureGrid_DcQ2MFKb.mjs";
import { t as $$CtaBand } from "./CtaBand_DNmhLnDz.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { t as __exportAll } from "./index_Dxxo_i0p.mjs";
import { ArrowRight } from "lucide-react";
//#region src/pages/erp-connector/inventory-stock-transfers.astro
var inventory_stock_transfers_exports = /* @__PURE__ */ __exportAll({
	default: () => $$InventoryStockTransfers,
	file: () => $$file,
	url: () => $$url
});
var $$InventoryStockTransfers = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Inventory & Stock Transfers — Warehouse Accounting for ERP | DeepEcom",
		"description": "Inventory accounting and stock transfers with warehouse-wise accounting inside the DeepEcom ERP Connector."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "ERP CONNECTOR · INVENTORY",
		"title": "Inventory and stock transfers, accounted.",
		"lead": "Account inventory and stock transfers across warehouses, with the detail your ERP needs to stay in balance."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center justify-center gap-3"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div>` })}${renderComponent($$result, "FeatureGrid", $$FeatureGrid, {
		"eyebrow": "INVENTORY",
		"title": "Stock that flows through your books.",
		"lead": "Inventory and stock transfers accounted warehouse by warehouse.",
		"columns": 3,
		"center": true,
		"features": [
			{
				title: "Inventory accounting",
				description: "Inventory movements are accounted as structured entries in your ERP.",
				icon: "package"
			},
			{
				title: "Stock transfers",
				description: "Transfers between warehouses are captured and accounted correctly.",
				icon: "truck"
			},
			{
				title: "Warehouse-wise accounting",
				description: "Inventory and stock are accounted distinctly for each warehouse.",
				icon: "boxes"
			},
			{
				title: "Detailed accounting entries",
				description: "Each movement becomes a complete entry your finance team can follow.",
				icon: "table"
			},
			{
				title: "Order and return linkage",
				description: "Inventory accounting stays consistent with sales, returns and stock positions.",
				icon: "refresh"
			},
			{
				title: "ERP posting",
				description: "Inventory and transfer entries post directly into your ERP.",
				icon: "bank"
			}
		]
	})}<section class="bg-muted py-20"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "MOVEMENT",
		"title": "Inventory accounted at the same detail as your money.",
		"lead": "Warehouse-wise inventory accounting and stock transfers that keep your ERP in balance.",
		"center": true
	})}</div></section>${renderComponent($$result, "CtaBand", $$CtaBand, {
		"title": "Make your ERP ecommerce-ready.",
		"lead": "Account inventory and stock transfers across warehouses inside your ERP."
	})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/erp-connector/inventory-stock-transfers.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/erp-connector/inventory-stock-transfers.astro";
var $$url = "/erp-connector/inventory-stock-transfers";
//#endregion
//#region \0virtual:astro:page:src/pages/erp-connector/inventory-stock-transfers@_@astro
var page = () => inventory_stock_transfers_exports;
//#endregion
export { page };
