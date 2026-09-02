import { D as createAstro, T as unescapeHTML, _ as maybeRenderHead, b as createRenderInstruction, c as renderComponent, g as renderTemplate, p as renderSlot, u as Fragment$2, v as renderHead, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent, n as $$Font } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants, n as Navbar, t as $$SiteFooter } from "./site-footer_CIM149FG.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ArrowRight, ArrowUp, Bell, Calendar, Search } from "lucide-react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { jsx, jsxs } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/components/landing/sections/Hero.astro
var $$Hero = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<header class="hero" id="hero"><div class="hero-inner mt-25"><a href="#platform" class="hero-eyebrow  group inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-10 py-1 text-xs font-semibold text-slate-700 backdrop-blur-md transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm"><span class="relative flex size-2 items-center justify-center" aria-hidden="true"><span class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span><span class="relative size-1.5 rounded-full bg-emerald-500"></span></span><span>The accounting layer for ecommerce</span><svg class="size-3 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></a><h1 class="hero-title reveal">Your ecommerce business,<span class="grad">connected.</span></h1><p class="hero-lead reveal">Connect your marketplaces, understand your profitability, reconcile your payments, and automatically account every transaction in your ERP.</p><div class="hero-actions reveal "><a href="#contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="#platform"${addAttribute(buttonVariants({
		variant: "outline",
		size: "lg"
	}), "class")}>Explore Platform</a></div><div class="hero-stage reveal "><div class="hero-stage-glow" aria-hidden="true"></div><div class="hero-visual mt-10"><!-- floating panels --><div class="hero-float fl-1" aria-hidden="true"><span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg></span><div class="meta"><strong>Reconciled</strong><span>Amazon settlement</span></div></div><div class="hero-float fl-2" aria-hidden="true"><span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16M7 13l4-4 4 3 5-6"></path></svg></span><div class="meta"><strong>Profitability</strong><span>Gross &amp; net margin</span></div></div><div class="hero-float fl-3" aria-hidden="true"><span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6M9 16h6M6 3h12a2 2 0 0 1 2 2v16l-3-2-3 2-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2z"></path></svg></span><div class="meta"><strong>GST voucher</strong><span>Ready to post</span></div></div><div class="hero-float fl-4" aria-hidden="true"><span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M7 8h10M7 12h6"></path></svg></span><div class="meta"><strong>ERP synced</strong><span>Tally · Zoho · SAP</span></div></div><!-- main console --><div class="hero-console"><div class="console-topbar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="addr">DeepEcom <span>· Finance control center</span></span><span class="live"><span class="pulse" aria-hidden="true"></span> Live</span></div><div class="console-body"><!-- pipeline --><div class="pipeline-pane"><div class="flow" role="img" aria-label="Marketplace data flows through DeepEcom intelligence, reconciliation and accounting into the ERP"><div class="flow-node"><span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"></path></svg></span><span class="cap">Marketplace</span></div><span class="flow-link"><span class="track"></span></span><div class="flow-node is-core"><span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="13" width="4.5" height="8" rx="1"></rect><rect x="9.75" y="8" width="4.5" height="13" rx="1"></rect><rect x="16.5" y="3" width="4.5" height="18" rx="1"></rect></svg></span><span class="cap">DeepEcom</span></div><span class="flow-link"><span class="track"></span></span><div class="flow-node"><span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 3"></path></svg></span><span class="cap">Intelligence</span></div><span class="flow-link"><span class="track"></span></span><div class="flow-node"><span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8 12h8M12 8v8"></path></svg></span><span class="cap">Reconcile</span></div><span class="flow-link"><span class="track"></span></span><div class="flow-node"><span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6M9 16h6M6 3h12a2 2 0 0 1 2 2v16l-3-2-3 2-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2z"></path></svg></span><span class="cap">Accounting</span></div><span class="flow-link"><span class="track"></span></span><div class="flow-node"><span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M7 8h10M7 12h6"></path></svg></span><span class="cap">ERP</span></div></div><!-- ledger --><div class="ledger"><div class="ledger-head"><span>Settlement · order-level</span><span>Status</span></div><div class="ledger-row"><span class="logo">Am</span><div class="who"><strong>Amazon settlement</strong><span>Recent settlement · orders + fees</span></div><span class="status ok">Matched</span></div><div class="ledger-row"><span class="logo">Fk</span><div class="who"><strong>Flipkart payout</strong><span>Recent payout · orders + fees</span></div><span class="status ok">Matched</span></div><div class="ledger-row"><span class="logo">Me</span><div class="who"><strong>Meesho settlement</strong><span>Recent settlement · commission variance</span></div><span class="status warn">Review</span></div></div></div><!-- insight panel --><div class="insight-pane"><div class="insight-head"><strong>Net revenue</strong><span>This year</span></div><div class="spark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="insight-stats"><div class="stat"><span class="k">Net margin</span><span class="v">•••</span></div><div class="stat"><span class="k">Reconciled</span><span class="v">Live</span></div><div class="stat"><span class="k">Vouchers</span><span class="v">Ready</span></div><div class="stat"><span class="k">ERP</span><span class="v">Posted</span></div></div></div></div></div></div></div></div></header>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Hero.astro", void 0);
//#endregion
//#region src/components/landing/sections/Problem.astro
var $$Problem = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="problem" id="problem"><div class="problem-inner"><div class="problem-grid"><div class="reveal">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "The problem",
		"title": "Ecommerce data is scattered.",
		"lead": "Orders live in marketplaces, payouts in payment providers, returns in one place, GST in another, inventory in yet another — and your ERP is disconnected from all of it."
	})}<div class="problem-note"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v4M12 16h.01"></path></svg><span>Every month, finance teams stitch this together by hand.</span></div></div><div class="reveal"><div class="fragments">${[
		{
			label: "Marketplaces",
			note: "Orders, fees, deductions"
		},
		{
			label: "Payments",
			note: "Settlements, payouts"
		},
		{
			label: "Returns",
			note: "Refunds, cancellations"
		},
		{
			label: "GST",
			note: "Rates, filing, credits"
		},
		{
			label: "Inventory",
			note: "Warehouses, stock"
		},
		{
			label: "ERP",
			note: "Tally · SAP · Zoho"
		}
	].map((f) => renderTemplate`<div class="fragment"><strong>${f.label}</strong><span>${f.note}</span></div>`)}</div></div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Problem.astro", void 0);
//#endregion
//#region src/components/landing/sections/DeepEcomLayer.astro
var $$DeepEcomLayer = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="layer" id="layer"><div class="layer-inner">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "The DeepEcom layer",
		"title": "One layer between your ecommerce business and your books.",
		"lead": "DeepEcom sits between the marketplaces you sell on and the ERP you close your books in — turning raw ecommerce activity into intelligence, reconciliation and accounting.",
		"center": true
	})}<!-- Desktop / tablet SVG data-flow --><div class="layer-diagram layer-svg-wrap"><svg class="layer-svg" viewBox="0 0 960 460" fill="none" role="img" aria-label="Marketplace data flows through DeepEcom, which turns it into business intelligence, reconciliation and accounting before posting to your ERP"><defs><filter id="coreShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#635bff" flood-opacity="0.35"></feDropShadow></filter></defs><!-- connectors --><g><path class="connector" d="M240 230 H352"></path><path class="connector" d="M448 230 C 505 230, 505 120, 560 120"></path><path class="connector" d="M448 230 L560 230"></path><path class="connector" d="M448 230 C 505 230, 505 340, 560 340"></path><path class="connector" d="M760 120 C 795 120, 795 230, 820 230"></path><path class="connector" d="M760 230 L820 230"></path><path class="connector" d="M760 340 C 795 340, 795 230, 820 230"></path></g><!-- active (animated) connector overlay --><g><path class="connector-active" d="M240 230 H352"></path><path class="connector-active" d="M448 230 C 505 230, 505 120, 560 120"></path><path class="connector-active" d="M448 230 L560 230"></path><path class="connector-active" d="M448 230 C 505 230, 505 340, 560 340"></path><path class="connector-active" d="M760 120 C 795 120, 795 230, 820 230"></path><path class="connector-active" d="M760 230 L820 230"></path><path class="connector-active" d="M760 340 C 795 340, 795 230, 820 230"></path></g><!-- flowing data packets --><g class="packets"><circle class="packet" r="4"><animateMotion dur="2.4s" begin="0s" repeatCount="indefinite"><mpath href="#p-mp-core"></mpath></animateMotion></circle><circle class="packet" r="4"><animateMotion dur="2.4s" begin="0.3s" repeatCount="indefinite"><mpath href="#p-core-bi"></mpath></animateMotion></circle><circle class="packet" r="4"><animateMotion dur="2.4s" begin="0.6s" repeatCount="indefinite"><mpath href="#p-core-rec"></mpath></animateMotion></circle><circle class="packet" r="4"><animateMotion dur="2.4s" begin="0.9s" repeatCount="indefinite"><mpath href="#p-core-acc"></mpath></animateMotion></circle><circle class="packet" r="4"><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite"><mpath href="#p-bi-erp"></mpath></animateMotion></circle><circle class="packet" r="4"><animateMotion dur="2.4s" begin="1.5s" repeatCount="indefinite"><mpath href="#p-rec-erp"></mpath></animateMotion></circle><circle class="packet" r="4"><animateMotion dur="2.4s" begin="1.8s" repeatCount="indefinite"><mpath href="#p-acc-erp"></mpath></animateMotion></circle></g><!-- hidden path definitions for mpath --><path id="p-mp-core" d="M240 230 H352"></path><path id="p-core-bi" d="M448 230 C 505 230, 505 120, 560 120"></path><path id="p-core-rec" d="M448 230 L560 230"></path><path id="p-core-acc" d="M448 230 C 505 230, 505 340, 560 340"></path><path id="p-bi-erp" d="M760 120 C 795 120, 795 230, 820 230"></path><path id="p-rec-erp" d="M760 230 L820 230"></path><path id="p-acc-erp" d="M760 340 C 795 340, 795 230, 820 230"></path><!-- LEFT: Marketplaces --><g><rect class="node-card" x="40" y="150" width="200" height="160" rx="16"></rect><text class="node-title" x="140" y="180" text-anchor="middle">Marketplaces</text><g transform="translate(56, 196)"><rect class="tile" x="0" y="0" width="168" height="30"></rect><text class="tile-letter" x="14" y="19">Am</text><text class="tile-name" x="34" y="19">Amazon</text></g><g transform="translate(56, 236)"><rect class="tile" x="0" y="0" width="168" height="30"></rect><text class="tile-letter" x="14" y="19">Fk</text><text class="tile-name" x="34" y="19">Flipkart</text></g><g transform="translate(56, 276)"><rect class="tile" x="0" y="0" width="168" height="30"></rect><text class="tile-letter" x="14" y="19">Sy</text><text class="tile-name" x="34" y="19">Shopify</text></g></g><!-- CENTER: DeepEcom core --><g><circle class="core-glow" cx="400" cy="230" r="72"></circle><rect class="core-rect" x="352" y="182" width="96" height="96" rx="24" filter="url(#coreShadow)"></rect><g transform="translate(400, 230)"><rect x="-22" y="-16" width="8" height="32" rx="2" fill="#fff"></rect><rect x="-7" y="-26" width="8" height="52" rx="2" fill="#fff"></rect><rect x="8" y="-34" width="8" height="68" rx="2" fill="#fff" opacity="0.95"></rect></g><text class="core-label" x="400" y="308" text-anchor="middle">DeepEcom</text></g><!-- MID-RIGHT: capabilities --><g><g transform="translate(560, 84)"><rect class="node-card" x="0" y="0" width="200" height="72" rx="14"></rect><g transform="translate(18, 36)"><path class="cap-icon" d="M3 3v16a2 2 0 0 0 2 2h16M7 13l4-4 4 3 5-6" transform="scale(1.4)"></path></g><text class="cap-title" x="52" y="40" text-anchor="middle">Business</text><text class="cap-title" x="52" y="56" text-anchor="middle">Intelligence</text></g><g transform="translate(560, 194)"><rect class="node-card" x="0" y="0" width="200" height="72" rx="14"></rect><g transform="translate(18, 34)"><circle class="cap-icon" cx="0" cy="0" r="8" transform="scale(1.4)"></circle><path class="cap-icon" d="M-3.5 0h7M0 -3.5v7"></path></g><text class="cap-title" x="52" y="40" text-anchor="middle">Reconciliation</text></g><g transform="translate(560, 304)"><rect class="node-card" x="0" y="0" width="200" height="72" rx="14"></rect><g transform="translate(18, 34)"><path class="cap-icon" d="M6 2h8a2 2 0 0 1 2 2v16l-3-2-3 2-3-2-3 2-3-2-3 2V4a2 2 0 0 1 2-2zM8 7h6M8 11h6" transform="scale(1.1)"></path></g><text class="cap-title" x="52" y="40" text-anchor="middle">Accounting</text></g></g><!-- RIGHT: ERP --><g><rect class="node-card" x="820" y="150" width="100" height="160" rx="16"></rect><text class="node-title" x="870" y="180" text-anchor="middle">ERP</text><g transform="translate(836, 196)"><rect class="tile" x="0" y="0" width="68" height="30"></rect><text class="tile-letter" x="12" y="19">Tp</text><text class="tile-name" x="30" y="19">Tally</text></g><g transform="translate(836, 236)"><rect class="tile" x="0" y="0" width="68" height="30"></rect><text class="tile-letter" x="12" y="19">Se</text><text class="tile-name" x="30" y="19">SAP</text></g><g transform="translate(836, 276)"><rect class="tile" x="0" y="0" width="68" height="30"></rect><text class="tile-letter" x="12" y="19">Zo</text><text class="tile-name" x="30" y="19">Zoho</text></g></g></svg></div><!-- Mobile vertical stack --><div class="layer-stack-mobile" role="img" aria-label="Marketplaces connect through DeepEcom into business intelligence, reconciliation and accounting, then into your ERP"><div class="layer-tier-m"><span class="tier-node-m">Marketplaces</span><span class="tier-sub-m">Amazon · Flipkart · Shopify · and more</span></div><span class="layer-link-m" aria-hidden="true"></span><div class="layer-tier-m is-core-m"><span class="tier-node-m">DeepEcom</span></div><span class="layer-link-m" aria-hidden="true"></span><div class="layer-tier-m"><div class="layer-trio-m"><span class="tier-node-m">Business Intelligence</span><span class="tier-node-m">Reconciliation</span><span class="tier-node-m">Accounting</span></div></div><span class="layer-link-m" aria-hidden="true"></span><div class="layer-tier-m"><span class="tier-node-m">ERP</span><span class="tier-sub-m">Tally · SAP · Zoho</span></div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/DeepEcomLayer.astro", void 0);
//#endregion
//#region src/components/landing/ui/badge.tsx
var badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-5 whitespace-nowrap", {
	variants: { variant: {
		default: "bg-ink-100 text-ink-600",
		outline: "border border-ink-200 text-ink-600",
		success: "bg-success-50 text-success-600",
		warning: "bg-warning-50 text-warning-600",
		error: "bg-danger-50 text-danger-600"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		className: twMerge(clsx(badgeVariants({ variant }), className)),
		...props
	});
}
//#endregion
//#region src/components/landing/kpi-value.tsx
var fmt = (n, d) => n.toLocaleString("en-IN", {
	minimumFractionDigits: d,
	maximumFractionDigits: d
});
function KpiValue({ target, decimals = 0 }) {
	const ref = useRef(null);
	const [text, setText] = useState(fmt(0, decimals));
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver((entries) => {
			if (!entries[0].isIntersecting) return;
			io.disconnect();
			const start = performance.now();
			const dur = 1300;
			const tick = (t) => {
				const p = Math.min((t - start) / dur, 1);
				setText(fmt(target * (1 - Math.pow(1 - p, 3)), decimals));
				if (p < 1) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		}, { threshold: .5 });
		io.observe(el);
		return () => io.disconnect();
	}, [target, decimals]);
	return /* @__PURE__ */ jsx("span", {
		ref,
		className: "num text-[clamp(21px,2vw,26px)] font-[660] tracking-tight text-ink",
		children: text
	});
}
//#endregion
//#region src/components/landing/sections/DashboardPreview.astro
var $$DashboardPreview = createComponent(($$result, $$props, $$slots) => {
	const kpis = [
		{
			label: "Revenue",
			target: 24.8,
			decimals: 1,
			unit: "₹L",
			delta: "+18.2% vs Jul",
			spark: [
				32,
				41,
				37,
				52,
				47,
				63,
				59,
				78,
				100
			]
		},
		{
			label: "Orders",
			target: 18429,
			decimals: 0,
			unit: "",
			delta: "+9.4% vs Jul",
			spark: [
				44,
				39,
				48,
				43,
				57,
				52,
				66,
				61,
				82
			]
		},
		{
			label: "Profit",
			target: 6.2,
			decimals: 1,
			unit: "₹L",
			delta: "+21.7% vs Jul",
			spark: [
				28,
				36,
				33,
				46,
				42,
				58,
				54,
				71,
				96
			]
		},
		{
			label: "Margin",
			target: 25.1,
			decimals: 1,
			unit: "%",
			delta: "+1.9pp vs Jul",
			spark: [
				52,
				49,
				55,
				53,
				60,
				58,
				64,
				67,
				74
			]
		}
	];
	const feed = [
		{
			init: "Az",
			name: "Amazon",
			time: "Aug W3 · 2m ago",
			amt: "₹4,20,000",
			status: "Reconciled",
			variant: "success"
		},
		{
			init: "Fk",
			name: "Flipkart",
			time: "Aug W3 · 5m ago",
			amt: "₹3,15,000",
			status: "Reconciled",
			variant: "success"
		},
		{
			init: "Me",
			name: "Meesho",
			time: "Aug W2 · 12m ago",
			amt: "₹1,80,000",
			status: "Pending",
			variant: "warning"
		},
		{
			init: "Jm",
			name: "JioMart",
			time: "Aug W2 · 1h ago",
			amt: "₹95,000",
			status: "Mismatch",
			variant: "error"
		},
		{
			init: "Sy",
			name: "Shopify",
			time: "Jul · 2h ago",
			amt: "₹2,10,000",
			status: "Reconciled",
			variant: "success"
		}
	];
	const line = "M72,149 C112,149 120,137 160,137 C200,137 208,142 248,142 C288,142 296,124 336,124 C376,124 384,114 424,114 C464,114 472,95 512,95 C552,95 560,71 600,71 C640,71 648,48 688,48";
	return renderTemplate`${maybeRenderHead($$result)}<div class="dash-stage mt-14 border-y border-border py-14 md:mt-20 md:py-20"><div class="mx-auto max-w-6xl px-6"><div class="reveal overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card" role="img" aria-label="DeepEcom dashboard preview showing revenue metrics and recent marketplace settlements"><!-- topbar --><div class="flex items-center gap-3.5 border-b border-border bg-zinc-50/70 px-5 py-3"><div class="flex min-w-0 items-center gap-2 text-[13.5px] font-semibold text-ink"><span class="org inline-flex min-w-0 items-center gap-2"><span class="grid size-5.5 shrink-0 place-items-center rounded-md bg-ink text-[10px] font-bold tracking-wide text-white">AR</span><span class="truncate">Paragon Retail Pvt Ltd</span></span><span class="text-zinc-300">/</span><span class="font-normal text-muted-foreground">Overview</span></div><div class="ml-auto hidden min-w-52 items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-zinc-400 md:flex">${renderComponent($$result, "Search", Search, { "size": 13 })}Search orders, SKUs…<kbd class="ml-auto rounded border border-border bg-subtle px-1.5 py-px font-sans text-[10.5px]">⌘K</kbd></div><button type="button" class="relative grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-subtle" aria-label="Notifications">${renderComponent($$result, "Bell", Bell, { "size": 15 })}<span class="absolute top-1.5 right-2 size-1.5 rounded-full border-[1.5px] border-white bg-amber-500"></span></button><div class="hidden sm:flex" aria-hidden="true"><span class="grid size-7 place-items-center rounded-full border-[1.5px] border-accent bg-accent text-[10.5px] font-bold text-accent-foreground">RM</span><span class="-ml-1.5 grid size-7 place-items-center rounded-full border-[1.5px] border-white bg-subtle text-[10.5px] font-bold text-muted-foreground">AN</span><span class="-ml-1.5 grid size-7 place-items-center rounded-full border-[1.5px] border-white bg-subtle text-[10.5px] font-bold text-muted-foreground">+6</span></div></div><!-- body --><div class="flex flex-col gap-4 p-4 md:p-6"><!-- KPIs --><div class="grid grid-cols-2 gap-3.5 lg:grid-cols-4">${kpis.map((k) => renderTemplate`<div class="rounded-xl border border-border bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"><div class="text-[12.5px] font-medium text-muted-foreground">${k.label}</div><div class="mt-1.5 flex items-baseline gap-1.5">${renderComponent($$result, "KpiValue", KpiValue, {
		"target": k.target,
		"decimals": k.decimals,
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/ranjit/Documents/deepecom/website/src/components/landing/kpi-value.tsx",
		"client:component-export": "default"
	})}${k.unit && renderTemplate`<span class="text-sm font-semibold text-zinc-400">${k.unit}</span>`}</div><span class="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11.5px] font-semibold text-emerald-700">${renderComponent($$result, "ArrowUp", ArrowUp, {
		"size": 11,
		"strokeWidth": 2.5
	})}${k.delta}</span><div class="spark mt-3 flex h-[30px] items-end gap-[3px]" aria-hidden="true">${k.spark.map((h) => renderTemplate`<i${addAttribute(`height:${h}%`, "style")}></i>`)}</div></div>`)}</div><div class="grid gap-3.5 xl:grid-cols-[1fr_340px]"><!-- chart --><div class="overflow-hidden rounded-xl border border-border bg-white"><div class="flex items-center gap-2.5 border-b border-border px-4 py-3"><span class="text-sm font-bold tracking-tight text-ink">Net revenue</span><div class="ml-auto hidden items-center gap-3.5 text-[11.5px] font-medium text-muted-foreground sm:flex"><span><i class="mr-1.5 inline-block size-2 rounded-full bg-primary align-middle"></i>This year</span><span><i class="mr-1.5 inline-block size-2 rounded-full bg-zinc-300 align-middle"></i>Last year</span></div><span class="chip ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-muted-foreground sm:ml-0">${renderComponent($$result, "Calendar", Calendar, {
		"size": "12",
		"className": "text-zinc-400"
	})}Last 8 months</span></div><div class="relative px-2.5 pt-3 pb-1.5"><div class="pointer-events-none absolute top-[4%] right-[3.5%] rounded-lg bg-ink px-3 py-2 text-left leading-tight shadow-md"><div class="text-[10.5px] font-semibold tracking-wide text-zinc-400 uppercase">Aug 2026</div><div class="num text-sm font-bold">₹24.8L</div><div class="text-[11px] font-medium text-emerald-300">▲ 14.3% MoM</div></div><svg viewBox="0 0 720 264" fill="none" class="h-auto w-full" aria-hidden="true"><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4f46e5" stop-opacity="0.14"></stop><stop offset="100%" stop-color="#4f46e5" stop-opacity="0"></stop></linearGradient></defs><g stroke="#eeeef2"><line x1="64" y1="232" x2="704" y2="232"></line><line x1="64" y1="180" x2="704" y2="180"></line><line x1="64" y1="128" x2="704" y2="128"></line><line x1="64" y1="76" x2="704" y2="76"></line><line x1="64" y1="24" x2="704" y2="24"></line></g><g fill="#8b8b94" font-family="Inter, sans-serif" font-size="10.5"><text x="54" y="236" text-anchor="end">₹0</text><text x="54" y="184" text-anchor="end">₹7L</text><text x="54" y="132" text-anchor="end">₹14L</text><text x="54" y="80" text-anchor="end">₹21L</text><text x="54" y="28" text-anchor="end">₹28L</text><text x="72" y="256" text-anchor="middle">Jan</text><text x="160" y="256" text-anchor="middle">Feb</text><text x="248" y="256" text-anchor="middle">Mar</text><text x="336" y="256" text-anchor="middle">Apr</text><text x="424" y="256" text-anchor="middle">May</text><text x="512" y="256" text-anchor="middle">Jun</text><text x="600" y="256" text-anchor="middle">Jul</text><text x="688" y="256" text-anchor="middle" fill="#18181b" font-weight="600">Aug</text></g><path${addAttribute("M72,159 C112,159 120,151 160,151 C200,151 208,156 248,156 C288,156 296,140 336,140 C376,140 384,135 424,135 C464,135 472,119 512,119 C552,119 560,99 600,99 C640,99 648,79 688,79", "d")} stroke="#d4d4d8" stroke-width="1.75" stroke-dasharray="4 4" stroke-linecap="round"></path><path${addAttribute(`${line} L688,232 L72,232 Z`, "d")} fill="url(#areaFill)"></path><path${addAttribute(line, "d")} stroke="#4f46e5" stroke-width="2.25" stroke-linecap="round"></path><line x1="688" y1="48" x2="688" y2="232" stroke="#c7d2fe" stroke-dasharray="3 3"></line><circle cx="688" cy="48" r="8" fill="#4f46e5" fill-opacity="0.14"></circle><circle cx="688" cy="48" r="4" fill="#4f46e5" stroke="#fff" stroke-width="2"></circle></svg></div></div><!-- settlements feed --><aside class="hidden overflow-hidden rounded-xl border border-border bg-white xl:flex xl:flex-col"><div class="flex items-center gap-2.5 border-b border-border px-4 py-3"><span class="text-sm font-bold tracking-tight text-ink">Latest settlements</span><span class="live-dot ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-emerald-700 uppercase"><i class="size-[7px] rounded-full bg-emerald-600"></i>Live</span></div><div class="flex-1 divide-y divide-subtle">${feed.map((f) => renderTemplate`<div class="flex items-center gap-3 px-4 py-2.5"><span class="grid size-8.5 shrink-0 place-items-center rounded-[9px] border border-border bg-subtle text-xs font-bold text-muted-foreground">${f.init}</span><div class="min-w-0"><div class="truncate text-[13.5px] font-semibold text-ink">${f.name}</div><div class="text-[11.5px] text-zinc-400">${f.time}</div></div><div class="ml-auto text-right"><div class="num text-[13.5px] font-bold tracking-tight text-ink">${f.amt}</div>${renderComponent($$result, "Badge", Badge, {
		"variant": f.variant,
		"className": "mt-0.5"
	}, { "default": ($$result) => renderTemplate`${f.status}` })}</div></div>`)}</div><a href="#analytics" class="flex items-center gap-1.5 border-t border-border bg-zinc-50/70 px-4 py-2.5 text-[12.5px] font-semibold text-primary no-underline hover:text-indigo-700">View all settlements<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg></a></aside></div></div></div></div></div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/DashboardPreview.astro", void 0);
//#endregion
//#region src/components/landing/sections/Platform.astro
var $$Platform = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="platform-section" id="platform"><div class="platform-inner">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Platform",
		"title": "Understand your ecommerce business.",
		"lead": "DeepEcom Platform brings every marketplace into one place — so you see real profitability, reconciled payments, and reports your team can act on."
	})}<div class="reveal">${renderComponent($$result, "DashboardPreview", $$DashboardPreview, {})}</div><div class="platform-pillars reveal">${[
		{
			title: "Dashboard",
			desc: "Your ecommerce business at a glance.",
			href: "/platform/dashboard"
		},
		{
			title: "Profitability",
			desc: "Margins by SKU, order and channel.",
			href: "/platform/profitability"
		},
		{
			title: "Payment Reconciliation",
			desc: "Expected vs actual, matched line-by-line.",
			href: "/platform/payment-reconciliation"
		},
		{
			title: "Reports",
			desc: "GST-ready exports for your finance team.",
			href: "/platform/reports"
		}
	].map((p) => renderTemplate`<a${addAttribute(p.href, "href")} class="platform-pillar"><strong>${p.title}</strong><span>${p.desc}</span></a>`)}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Platform.astro", void 0);
//#endregion
//#region src/components/landing/sections/ErpConnector.astro
var $$ErpConnector = createComponent(($$result, $$props, $$slots) => {
	const flow = [
		"Order",
		"Sale",
		"GST",
		"Marketplace Charges",
		"TCS/TDS",
		"Receivable",
		"Payment",
		"Return",
		"Inventory",
		"Stock Transfer",
		"ERP"
	];
	return renderTemplate`${maybeRenderHead($$result)}<section class="erp-section" id="erp-connector"><div class="erp-inner">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "ERP Connector",
		"title": "Make your ERP ecommerce-ready.",
		"lead": "DeepEcom converts complex ecommerce transactions into detailed accounting inside your ERP — order by order, GST by GST, warehouse by warehouse.",
		"center": true
	})}<div class="erp-flow reveal" role="img" aria-label="The detailed accounting flow from order to ERP: order, sale, GST, marketplace charges, TCS TDS, receivable, payment, return, inventory, stock transfer, ERP">${flow.map((step, i) => renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<span${addAttribute(["erp-step", i === flow.length - 1 && "is-final"], "class:list")}>${step}</span>${i < flow.length - 1 && renderTemplate`<span class="erp-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span>`}` })}`)}</div><div class="erp-note reveal"><span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>Order-wise entries</span><span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>GST-wise entries</span><span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>Warehouse-wise entries</span><span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>Tally · SAP · Zoho</span></div><div class="erp-cta reveal"><a href="/erp-connector"${addAttribute(buttonVariants({
		variant: "white",
		size: "lg"
	}), "class")}>Explore ERP Connector</a></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/ErpConnector.astro", void 0);
//#endregion
//#region src/components/landing/sections/Solutions.astro
var $$Solutions = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="solutions-section" id="solutions"><div class="solutions-inner">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Solutions",
		"title": "Outcomes for how you sell — and who you are.",
		"lead": "DeepEcom is built around the specific problems of ecommerce sellers and the finance teams behind them."
	})}<div class="sol-group reveal"><span class="sol-group-label">By business</span><div class="sol-list">${[
		{
			label: "Amazon Sellers",
			desc: "Profitability, settlements and GST for the Amazon seller.",
			href: "/solutions/amazon-sellers"
		},
		{
			label: "D2C Brands",
			desc: "One clear view across your store and marketplaces.",
			href: "/solutions/d2c-brands"
		},
		{
			label: "Enterprise",
			desc: "Multi-entity, multi-warehouse accounting at scale.",
			href: "/solutions/enterprise"
		}
	].map((s) => renderTemplate`<a${addAttribute(s.href, "href")} class="sol-card"><strong>${s.label}</strong><span>${s.desc}</span><span class="go">Learn more →</span></a>`)}</div></div><div class="sol-group reveal"><span class="sol-group-label">By role</span><div class="sol-list">${[
		{
			label: "CFOs",
			desc: "Profitability, cash realization and financial visibility.",
			href: "/solutions/cfos"
		},
		{
			label: "Accountants",
			desc: "Order-level, GST-wise accounting that ERP-ready.",
			href: "/solutions/accountants"
		},
		{
			label: "Business Owners",
			desc: "What you actually earned, without the spreadsheets.",
			href: "/solutions/business-owners"
		}
	].map((s) => renderTemplate`<a${addAttribute(s.href, "href")} class="sol-card"><strong>${s.label}</strong><span>${s.desc}</span><span class="go">Learn more →</span></a>`)}</div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Solutions.astro", void 0);
//#endregion
//#region src/components/landing/ui/tabs.tsx
var TabsContext = createContext(null);
function useTabs() {
	const ctx = useContext(TabsContext);
	if (!ctx) throw new Error("Tabs components must be used inside <Tabs>");
	return ctx;
}
function Tabs({ defaultValue, value, onValueChange, className, children, ...props }) {
	const [internal, setInternal] = useState(defaultValue);
	const current = value ?? internal;
	const setValue = (v) => {
		setInternal(v);
		onValueChange?.(v);
	};
	return /* @__PURE__ */ jsx(TabsContext.Provider, {
		value: {
			value: current,
			setValue
		},
		children: /* @__PURE__ */ jsx("div", {
			className,
			...props,
			children
		})
	});
}
function TabsList({ className, children, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		role: "tablist",
		className: twMerge(clsx("inline-flex flex-wrap items-center gap-1 rounded-lg border border-ink-200 bg-ink-50 p-1", className)),
		...props,
		children
	});
}
function TabsTab({ value, className, children, ...props }) {
	const { value: current, setValue } = useTabs();
	const active = current === value;
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		role: "tab",
		"aria-selected": active,
		"aria-controls": `tab-panel-${value}`,
		onClick: () => setValue(value),
		className: twMerge(clsx("inline-flex items-center rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors", active ? "bg-white text-ink-900 shadow-sm" : "text-muted-foreground hover:text-ink-900", className)),
		...props,
		children
	});
}
function TabsPanel({ value, keepMounted, className, children, ...props }) {
	const { value: current } = useTabs();
	const active = current === value;
	if (!keepMounted && !active) return null;
	return /* @__PURE__ */ jsx("div", {
		role: "tabpanel",
		id: `tab-panel-${value}`,
		"aria-hidden": !active,
		className: twMerge(clsx(className, !active && "hidden")),
		...props,
		children
	});
}
//#endregion
//#region src/components/landing/integrations-tabs.tsx
var GROUPS = {
	marketplace: [
		{
			init: "Az",
			name: "Amazon"
		},
		{
			init: "Fk",
			name: "Flipkart"
		},
		{
			init: "My",
			name: "Myntra"
		},
		{
			init: "Me",
			name: "Meesho"
		},
		{
			init: "Ny",
			name: "Nykaa"
		},
		{
			init: "Sy",
			name: "Shopify"
		},
		{
			init: "Jm",
			name: "JioMart"
		}
	],
	erp: [
		{
			init: "Tp",
			name: "Tally Prime"
		},
		{
			init: "Zb",
			name: "Zoho Books"
		},
		{
			init: "MD",
			name: "MS Dynamics"
		},
		{
			init: "SE",
			name: "Sap Erp"
		}
	],
	logistics: [
		{
			init: "Dt",
			name: "DTDC"
		},
		{
			init: "Sr",
			name: "Shiprocket"
		},
		{
			init: "Dv",
			name: "Delhivery"
		}
	],
	payments: [
		{
			init: "Rz",
			name: "Razorpay"
		},
		{
			init: "Cf",
			name: "Cashfree"
		},
		{
			init: "Ph",
			name: "PhonePe"
		}
	]
};
var tile = "flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-[14.5px] font-semibold tracking-tight text-ink-900 shadow-xs transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-sm";
var tileLogo = "grid size-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-xs font-extrabold text-ink-600";
function IntegrationsTabs() {
	return /* @__PURE__ */ jsxs(Tabs, {
		defaultValue: "marketplace",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex justify-center",
			children: /* @__PURE__ */ jsxs(TabsList, {
				className: "flex-wrap",
				children: [
					/* @__PURE__ */ jsx(TabsTab, {
						value: "marketplace",
						children: "Marketplaces"
					}),
					/* @__PURE__ */ jsx(TabsTab, {
						value: "erp",
						children: "ERP"
					}),
					/* @__PURE__ */ jsx(TabsTab, {
						value: "logistics",
						children: "Logistics"
					}),
					/* @__PURE__ */ jsx(TabsTab, {
						value: "payments",
						children: "Payment gateway"
					})
				]
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-8",
			children: Object.entries(GROUPS).map(([key, items]) => /* @__PURE__ */ jsx(TabsPanel, {
				value: key,
				keepMounted: true,
				className: "grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-3",
				children: items.map((it) => /* @__PURE__ */ jsxs("div", {
					className: tile,
					children: [/* @__PURE__ */ jsx("span", {
						className: tileLogo,
						children: it.init
					}), it.name]
				}, it.name))
			}, key))
		})]
	});
}
//#endregion
//#region src/components/landing/sections/Integrations.astro
var $$Integrations = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="integrations-section" id="integrations"><div class="integrations-inner">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Integrations",
		"title": "Your stack, connected as one system.",
		"lead": "Marketplace activity flows into DeepEcom, and DeepEcom posts detailed accounting into your ERP — no walls of disconnected logos.",
		"center": true
	})}<div class="int-rel reveal" role="img" aria-label="Amazon, Flipkart and Shopify connect into DeepEcom, which connects into Tally, SAP and Zoho"><div class="int-node"><span class="n-title">Marketplaces</span><div class="n-items"><span class="pill">Amazon</span><span class="pill">Flipkart</span><span class="pill">Shopify</span><span class="pill">More channels</span></div></div><span class="int-flow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span><div class="int-node is-core"><span class="n-title">DeepEcom</span><div class="n-items"><span class="pill">Intelligence</span><span class="pill">Reconciliation</span><span class="pill">Accounting</span></div></div><span class="int-flow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span><div class="int-node"><span class="n-title">ERP</span><div class="n-items"><span class="pill">Tally</span><span class="pill">SAP</span><span class="pill">Zoho</span></div></div></div><div class="int-tabs reveal">${renderComponent($$result, "IntegrationsTabs", IntegrationsTabs, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/ranjit/Documents/deepecom/website/src/components/landing/integrations-tabs.tsx",
		"client:component-export": "default"
	})}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Integrations.astro", void 0);
//#endregion
//#region src/components/landing/sections/Customers.astro
var $$Customers = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="customers-section" id="customers"><div class="customers-inner">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Customers",
		"title": "How teams bring ecommerce and accounting together.",
		"lead": "Every business is different — but the pattern is the same: fragmented data in, one connected layer out.",
		"center": true
	})}<div class="case-grid reveal">${[
		{
			label: "A multi-marketplace seller",
			problem: "Settlements from three channels never matched the bank.",
			process: "Monthly reconciliation in spreadsheets, days of manual matching.",
			outcome: "Every settlement reconciled to its orders, automatically."
		},
		{
			label: "A D2C brand",
			problem: "Website and marketplace sales lived in separate systems.",
			process: "Profitability was guessed, not measured, across channels.",
			outcome: "One consolidated view of profit across every channel."
		},
		{
			label: "A finance team",
			problem: "Ecommerce entries had to be re-keyed into the ERP by hand.",
			process: "GST and marketplace charges were mapped manually each close.",
			outcome: "Detailed accounting posts straight into the ERP."
		}
	].map((s) => renderTemplate`<article class="case-card"><span class="case-tag">${s.label}</span><div class="case-step"><strong>Problem</strong><p>${s.problem}</p></div><div class="case-step"><strong>Existing process</strong><p>${s.process}</p></div><div class="case-step is-outcome"><strong>DeepEcom</strong><p>${s.outcome}</p></div></article>`)}</div><p class="customers-note reveal">Case studies use illustrative scenarios — specific customer names and metrics are added as they are verified.</p></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Customers.astro", void 0);
//#endregion
//#region src/components/landing/sections/FinalCta.astro
var $$FinalCta = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="final-cta" id="get-started"><div class="final-cta-card reveal"><h2 class="final-cta-title">Bring your ecommerce business and accounting together.</h2><p class="final-cta-lead">See your marketplaces, profitability, reconciliation and ERP accounting — all in one layer.</p><div class="final-cta-actions"><a href="/contact"${addAttribute(buttonVariants({ size: "lg" }), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a></div><ul class="final-cta-trust">${[
		"Read-only API access",
		"GST-compliant exports",
		"Your data is never resold"
	].map((t) => renderTemplate`<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>${t}</li>`)}</ul></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/FinalCta.astro", void 0);
//#endregion
//#region src/components/layout/SectionDivider.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$SectionDivider = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SectionDivider;
	const { class: className } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<hr aria-hidden="true"${addAttribute(["mx-auto max-w-6xl border-t border-hairline", className], "class:list")}>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/layout/SectionDivider.astro", void 0);
//#endregion
//#region src/layouts/LandingLayout.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$LandingLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LandingLayout;
	const { title = "DeepEcom — Ecommerce Finance Control Center", description = "DeepEcom tracks real profits across multiple marketplaces. Automate Tally accounting, reconcile payments effortlessly, and get GST-ready exports." } = Astro.props;
	const site = Astro.site ?? new URL("http://localhost:4321");
	const canonical = new URL(Astro.url.pathname, site);
	const ogImage = new URL("/og/landing.png", site);
	const jsonLd = [{
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "DeepEcom",
		url: site.toString(),
		logo: new URL("/favicon.ico", site).toString(),
		address: {
			"@type": "PostalAddress",
			streetAddress: "Koregaon Park",
			addressLocality: "Pune",
			addressRegion: "Maharashtra",
			postalCode: "411001",
			addressCountry: "IN"
		},
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "sales",
			email: "sales@deepecom.com"
		}
	}, {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "DeepEcom",
		applicationCategory: "FinanceApplication",
		operatingSystem: "Web",
		description,
		offers: {
			"@type": "Offer",
			price: "1000",
			priceCurrency: "INR"
		},
		publisher: {
			"@type": "Organization",
			name: "DeepEcom Technologies Pvt Ltd"
		}
	}];
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonical, "href")}><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(ogImage, "content")}><script type="application/ld+json">${unescapeHTML(JSON.stringify(jsonLd))}<\/script><link rel="icon" href="/logo.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,450;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet">${renderComponent($$result, "Font", $$Font, {
		"cssVariable": "--font-inter",
		"preload": true
	})}${renderHead($$result)}</head><body class="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">${renderComponent($$result, "SiteNav", Navbar, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "@/components/landing/site-nav",
		"client:component-export": "default"
	})}<main class="relative">${renderSlot($$result, $$slots["default"])}</main>${renderComponent($$result, "SiteFooter", $$SiteFooter, {})}<!-- spacer so the sticky mobile CTA never covers footer content --><div class="h-18 md:hidden" aria-hidden="true"></div><!-- sticky mobile CTA --><div id="mobile-cta" class="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-border bg-white/95 backdrop-blur transition-transform duration-300 md:hidden"><div class="mx-auto flex max-w-md items-center gap-2.5 px-4 py-3"><a href="#contact"${addAttribute(`${buttonVariants({ variant: "outline" })} flex-1`, "class")}>Schedule demo</a><a href="#pricing"${addAttribute(`${buttonVariants()} flex-1 gap-1.5`, "class")}>Start free trial${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 15 })}</a></div></div>${renderScript($$result, "/home/ranjit/Documents/deepecom/website/src/layouts/LandingLayout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/home/ranjit/Documents/deepecom/website/src/layouts/LandingLayout.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "LandingLayout", $$LandingLayout, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Hero", $$Hero, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Problem", $$Problem, {})}${renderComponent($$result, "DeepEcomLayer", $$DeepEcomLayer, {})}${renderComponent($$result, "Platform", $$Platform, {})}${renderComponent($$result, "ErpConnector", $$ErpConnector, {})}${renderComponent($$result, "Solutions", $$Solutions, {})}${renderComponent($$result, "Integrations", $$Integrations, {})}${renderComponent($$result, "Customers", $$Customers, {})}${renderComponent($$result, "FinalCta", $$FinalCta, {})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/index.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page, __exportAll as t };
