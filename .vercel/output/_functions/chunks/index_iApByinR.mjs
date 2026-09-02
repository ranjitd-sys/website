import { D as createAstro, T as unescapeHTML, _ as maybeRenderHead, b as createRenderInstruction, c as renderComponent, g as renderTemplate, p as renderSlot, u as Fragment$2, v as renderHead, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent, n as $$Font } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants, n as Navbar, t as $$SiteFooter } from "./site-footer_Do70HOEA.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ArrowRight, ArrowUp, BarChart3, Bell, Calendar, ChevronDown, CreditCard, DollarSign, FileText, LayoutDashboard, Search, Settings, ShieldCheck, ShoppingBag } from "lucide-react";
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
//#region src/components/landing/HeroDiagram.astro
var $$HeroDiagram = createComponent(($$result, $$props, $$slots) => {
	const leftLevels = [
		170,
		220,
		270,
		320,
		370
	];
	const centerHubY = 270;
	return renderTemplate`${maybeRenderHead($$result)}<div class="hero-diagram-wrap" data-astro-cid-tj3dqhhm><svg class="hero-diagram" viewBox="0 0 1100 540" role="img" aria-label="Marketplaces and channels connect into DeepEcom central hub, which processes data and posts into your ERP" data-astro-cid-tj3dqhhm><defs data-astro-cid-tj3dqhhm><!-- Glowing soft shadows matching the image design --><filter id="card-shadow" x="-30%" y="-30%" width="160%" height="160%" data-astro-cid-tj3dqhhm><feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.06" data-astro-cid-tj3dqhhm></feDropShadow><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.03" data-astro-cid-tj3dqhhm></feDropShadow></filter><filter id="center-shadow" x="-40%" y="-40%" width="180%" height="180%" data-astro-cid-tj3dqhhm><feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#533afd" flood-opacity="0.18" data-astro-cid-tj3dqhhm></feDropShadow><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#3d25c9" flood-opacity="0.12" data-astro-cid-tj3dqhhm></feDropShadow></filter><!-- Arrow Markers --><marker id="blue-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto" data-astro-cid-tj3dqhhm><path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#533afd" data-astro-cid-tj3dqhhm></path></marker></defs><!-- LEFT CARD: Marketplaces & Channels --><g transform="translate(40, 40)" data-astro-cid-tj3dqhhm><rect width="210" height="460" rx="28" fill="#ffffff" filter="url(#card-shadow)" data-astro-cid-tj3dqhhm></rect><text x="105" y="55" text-anchor="middle" class="title-main" data-astro-cid-tj3dqhhm>Marketplaces</text><text x="105" y="77" text-anchor="middle" class="title-main" data-astro-cid-tj3dqhhm>&amp; Channels</text><!-- Amazon Logo Placeholder / Text --><g transform="translate(35, 120)" data-astro-cid-tj3dqhhm><text x="70" y="24" text-anchor="middle" class="brand-text amazon-logo" data-astro-cid-tj3dqhhm>amazon</text><path d="M 35 30 Q 70 42 105 30" fill="none" stroke="#ff9900" stroke-width="2.5" stroke-linecap="round" data-astro-cid-tj3dqhhm></path></g><!-- Flipkart Logo --><g transform="translate(35, 195)" data-astro-cid-tj3dqhhm><text x="18" y="24" class="brand-text flipkart-blue" data-astro-cid-tj3dqhhm>Flipkart</text><rect x="108" y="7" width="24" height="22" rx="3" fill="#ffe11b" data-astro-cid-tj3dqhhm></rect><path d="M 116 12 L 122 12 M 116 16 L 124 16 M 118 16 L 121 23" stroke="#2874f0" stroke-width="2" stroke-linecap="round" data-astro-cid-tj3dqhhm></path></g><!-- Shopify Logo --><g transform="translate(35, 275)" data-astro-cid-tj3dqhhm><path d="M 22 8 C 22 8 20 4 15 4 C 11 4 8 8 8 13 C 8 21 22 28 22 28 C 22 28 36 21 36 13 C 36 8 33 4 29 4 C 24 4 22 8 22 8 Z" fill="#95bf47" data-astro-cid-tj3dqhhm></path><text x="46" y="22" class="brand-text shopify-text" data-astro-cid-tj3dqhhm>shopify</text></g><!-- + More Footer --><text x="50" y="390" class="more-text" data-astro-cid-tj3dqhhm>+ More</text></g><!-- CENTER CARD: DeepEcom Engine --><g transform="translate(410, 30)" data-astro-cid-tj3dqhhm><rect width="320" height="480" rx="36" fill="#ffffff" filter="url(#center-shadow)" data-astro-cid-tj3dqhhm></rect><!-- DeepEcom Header Logo --><g transform="translate(70, 52)" data-astro-cid-tj3dqhhm><!-- Custom Blue Symbol --><path d="M 0 4 C 0 1.8 1.8 0 4 0 L 22 0 C 27.5 0 32 4.5 32 10 C 32 15.5 27.5 20 22 20 L 12 20 L 12 26 L 26 26 C 31.5 26 36 30.5 36 36 C 36 41.5 31.5 46 26 46 L 4 46 C 1.8 46 0 44.2 0 42 Z" fill="#533afd" data-astro-cid-tj3dqhhm></path><circle cx="6" cy="10" r="3" fill="#ffffff" data-astro-cid-tj3dqhhm></circle><circle cx="6" cy="36" r="3" fill="#ffffff" data-astro-cid-tj3dqhhm></circle><text x="48" y="33" class="deepecom-logo-text" data-astro-cid-tj3dqhhm>DeepEcom</text></g><!-- Feature 1: Understand --><g transform="translate(50, 150)" data-astro-cid-tj3dqhhm><rect width="40" height="40" rx="10" fill="none" stroke="#533afd" stroke-width="2" data-astro-cid-tj3dqhhm></rect><path d="M 12 20 L 18 14 L 24 20 L 28 16" fill="none" stroke="#533afd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-tj3dqhhm></path><circle cx="28" cy="16" r="2" fill="#533afd" data-astro-cid-tj3dqhhm></circle><text x="56" y="20" class="feature-title" data-astro-cid-tj3dqhhm>Understand</text><text x="56" y="36" class="feature-sub" data-astro-cid-tj3dqhhm>Business &amp; Profitability</text></g><!-- Feature 2: Reconcile --><g transform="translate(50, 250)" data-astro-cid-tj3dqhhm><rect width="40" height="40" rx="10" fill="none" stroke="#533afd" stroke-width="2" data-astro-cid-tj3dqhhm></rect><path d="M 20 12 L 28 16 L 28 24 C 28 29 20 32 20 32 C 20 32 12 29 12 24 L 12 16 Z" fill="none" stroke="#533afd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-tj3dqhhm></path><text x="56" y="20" class="feature-title" data-astro-cid-tj3dqhhm>Reconcile</text><text x="56" y="36" class="feature-sub" data-astro-cid-tj3dqhhm>Payments &amp; Settlements</text></g><!-- Feature 3: Account --><g transform="translate(50, 350)" data-astro-cid-tj3dqhhm><rect width="40" height="40" rx="10" fill="none" stroke="#533afd" stroke-width="2" data-astro-cid-tj3dqhhm></rect><path d="M 15 14 H 25 M 15 20 H 25 M 15 26 H 21" stroke="#533afd" stroke-width="2" stroke-linecap="round" data-astro-cid-tj3dqhhm></path><text x="56" y="20" class="feature-title" data-astro-cid-tj3dqhhm>Account</text><text x="56" y="36" class="feature-sub" data-astro-cid-tj3dqhhm>In-depth Accounting</text></g></g><!-- RIGHT CARD: Your ERP --><g transform="translate(850, 80)" data-astro-cid-tj3dqhhm><rect width="210" height="380" rx="28" fill="#ffffff" filter="url(#card-shadow)" data-astro-cid-tj3dqhhm></rect><text x="105" y="60" text-anchor="middle" class="title-main" data-astro-cid-tj3dqhhm>Your ERP</text><!-- Tally Logo --><g transform="translate(45, 110)" data-astro-cid-tj3dqhhm><text x="60" y="30" text-anchor="middle" class="brand-text tally-text" data-astro-cid-tj3dqhhm>Tally</text></g><!-- SAP Logo --><g transform="translate(55, 190)" data-astro-cid-tj3dqhhm><rect width="90" height="40" fill="#008fd3" rx="4" data-astro-cid-tj3dqhhm></rect><text x="45" y="26" text-anchor="middle" class="sap-text" data-astro-cid-tj3dqhhm>SAP</text></g><!-- Zoho / Custom Logo --><g transform="translate(45, 270)" data-astro-cid-tj3dqhhm><g transform="translate(15, 0)" data-astro-cid-tj3dqhhm><rect x="0" y="0" width="22" height="22" rx="4" fill="#e52e2d" data-astro-cid-tj3dqhhm></rect><rect x="25" y="0" width="22" height="22" rx="4" fill="#22a06b" data-astro-cid-tj3dqhhm></rect><rect x="50" y="0" width="22" height="22" rx="4" fill="#009adf" data-astro-cid-tj3dqhhm></rect><rect x="75" y="0" width="22" height="22" rx="4" fill="#e58a00" data-astro-cid-tj3dqhhm></rect></g></g><!-- + More Footer --><text x="50" y="340" class="more-text" data-astro-cid-tj3dqhhm>+ More</text></g><!-- CONVERGING LEFT CONNECTORS (Flowing inwards) --><g class="connector-group" data-astro-cid-tj3dqhhm>${leftLevels.map((y) => {
		const pathData = `M 250 ${y} C 330 ${y}, 340 ${centerHubY}, 410 ${centerHubY}`;
		return renderTemplate`<g data-astro-cid-tj3dqhhm><path${addAttribute(pathData, "d")} class="line-back" data-astro-cid-tj3dqhhm></path><path${addAttribute(pathData, "d")} class="line-pulse" data-astro-cid-tj3dqhhm></path><circle cx="250"${addAttribute(y, "cy")} r="3.5" fill="#533afd" data-astro-cid-tj3dqhhm></circle></g>`;
	})}<!-- Dynamic dots along connectors --><circle cx="310" cy="185" r="3" fill="#533afd" opacity="0.8" data-astro-cid-tj3dqhhm></circle><circle cx="340" cy="235" r="3.5" fill="#533afd" data-astro-cid-tj3dqhhm></circle><circle cx="370" cy="305" r="3" fill="#533afd" opacity="0.8" data-astro-cid-tj3dqhhm></circle></g><!-- DIVERGING RIGHT CONNECTORS (Flowing outwards) --><g class="connector-group" data-astro-cid-tj3dqhhm>${[
		190,
		270,
		350
	].map((y) => {
		const pathData = `M 730 ${centerHubY} C 780 ${centerHubY}, 790 ${y}, 850 ${y}`;
		return renderTemplate`<g data-astro-cid-tj3dqhhm><path${addAttribute(pathData, "d")} class="line-back" data-astro-cid-tj3dqhhm></path><path${addAttribute(pathData, "d")} class="line-pulse-right" marker-end="url(#blue-arrow)" data-astro-cid-tj3dqhhm></path></g>`;
	})}</g></svg></div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/HeroDiagram.astro", void 0);
//#endregion
//#region src/components/landing/HeroDashboard.astro
var $$HeroDashboard = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="dash-3d-stage"><div class="dash-container"><div class="dash-layout"><aside class="dash-sidebar"><div class="dash-brand"><span class="dash-brand-icon">D</span><span>DeepEcom</span></div><nav class="dash-nav"><a href="#" class="dash-nav-link active">${renderComponent($$result, "LayoutDashboard", LayoutDashboard, { "size": 12 })} Overview</a><a href="#" class="dash-nav-link">${renderComponent($$result, "ShoppingBag", ShoppingBag, { "size": 12 })} Sales</a><a href="#" class="dash-nav-link">${renderComponent($$result, "DollarSign", DollarSign, { "size": 12 })} Profitability</a><a href="#" class="dash-nav-link">${renderComponent($$result, "CreditCard", CreditCard, { "size": 12 })} Payments</a><a href="#" class="dash-nav-link">${renderComponent($$result, "ShieldCheck", ShieldCheck, { "size": 12 })} Reconciliation</a><a href="#" class="dash-nav-link">${renderComponent($$result, "FileText", FileText, { "size": 12 })} Accounting</a><a href="#" class="dash-nav-link">${renderComponent($$result, "BarChart3", BarChart3, { "size": 12 })} Reports</a><a href="#" class="dash-nav-link">${renderComponent($$result, "Settings", Settings, { "size": 12 })} Settings</a></nav></aside><main class="dash-content"><header class="dash-header"><h1 class="dash-title">Business Overview</h1><div class="dash-controls"><button class="dash-select" type="button">All Marketplaces${renderComponent($$result, "ChevronDown", ChevronDown, {
		"size": 10,
		"color": "#64748b"
	})}</button><button class="dash-select" type="button">01 Apr - 30 Apr${renderComponent($$result, "ChevronDown", ChevronDown, {
		"size": 10,
		"color": "#64748b"
	})}</button><div style="display: flex; align-items: center; gap: 0.5rem; margin-left: 0.2rem;">${renderComponent($$result, "Bell", Bell, {
		"size": 13,
		"color": "#64748b",
		"className": "cursor: pointer;"
	})}<div class="dash-avatar">A</div></div></div></header><section class="dash-metrics-grid">${[
		{
			label: "Total Sales",
			value: "₹ 1.26 Cr",
			change: "↑ 18.6%",
			color: "#533afd",
			path: "M0 20 Q 25 18, 50 12 T 75 10 T 100 4"
		},
		{
			label: "Net Profit",
			value: "₹ 18.7 L",
			change: "↑ 24.3%",
			color: "#7f7dfc",
			path: "M0 20 Q 25 17, 50 14 T 75 8 T 100 3"
		},
		{
			label: "Orders",
			value: "12,542",
			change: "↑ 15.4%",
			color: "#f59e0b",
			path: "M0 16 Q 25 18, 50 14 T 75 12 T 100 8"
		},
		{
			label: "Pending Payout",
			value: "₹ 12.4 L",
			change: "↑ 8.7%",
			color: "#a29bff",
			path: "M0 22 Q 25 16, 50 18 T 75 10 T 100 6"
		}
	].map((metric) => renderTemplate`<div class="metric-card"><span class="metric-header">${metric.label}</span><div class="metric-body"><span class="metric-value">${metric.value}</span><span class="metric-trend">${metric.change}</span></div><svg class="metric-sparkline" viewBox="0 0 100 24" preserveAspectRatio="none" style="width: 100%; height: 28px;"><path${addAttribute(metric.path, "d")} fill="none"${addAttribute(metric.color, "stroke")} stroke-width="1.5"></path></svg></div>`)}</section><div class="dash-charts-grid"><section class="chart-card"><h2 class="chart-title">Payment Reconciliation</h2><p class="chart-subtitle">April 2025</p><div class="donut-container"><div class="donut-wrapper"><svg width="64" height="64" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" stroke-width="5.5"></circle><circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#533afd" stroke-width="5.5" stroke-dasharray="91.5 8.5" stroke-dashoffset="25"></circle><circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" stroke-width="5.5" stroke-dasharray="3.3 96.7" stroke-dashoffset="33.5"></circle><circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" stroke-width="5.5" stroke-dasharray="3.1 96.9" stroke-dashoffset="30.2"></circle></svg><div class="donut-center-text"><div class="donut-value">₹ 1.26 Cr</div><div class="donut-caption">Total Payout</div></div></div><div class="legend-list"><div class="legend-item"><span class="legend-dot" style="background: #533afd;"></span><span>Matched</span><strong class="legend-value">₹ 1.18 Cr (93.6%)</strong></div><div class="legend-item"><span class="legend-dot" style="background: #f59e0b;"></span><span>Partial</span><strong class="legend-value">₹ 4.2 L (3.3%)</strong></div><div class="legend-item"><span class="legend-dot" style="background: #ef4444;"></span><span>Mismatched</span><strong class="legend-value">₹ 3.8 L (3.1%)</strong></div></div></div><a href="#" class="chart-action">View Reconciliation${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 10 })}</a></section><section class="chart-card"><h2 class="chart-title">Top Marketplaces by Profit</h2><p class="chart-subtitle">April 2025</p><div class="table-header"><span>Net Profit</span><span>Margin</span></div><div class="mp-list">${[
		{
			initial: "a",
			name: "Amazon",
			color: "#0f172a",
			profit: "₹ 12.6 L",
			margin: "18.3%",
			width: "85%"
		},
		{
			initial: "f",
			name: "Flipkart",
			color: "#2874f0",
			profit: "₹ 4.8 L",
			margin: "16.2%",
			width: "45%"
		},
		{
			initial: "s",
			name: "Shopify",
			color: "#96bf48",
			profit: "₹ 1.3 L",
			margin: "22.1%",
			width: "18%"
		}
	].map((mp) => renderTemplate`<div><div class="mp-item-info"><span class="mp-badge"${addAttribute(`color: ${mp.color};`, "style")}>${mp.initial}</span><span style="flex: 1; font-weight: 500; color: #334155;">${mp.name}</span><strong style="color: #0f172a; font-size: 0.625rem;">${mp.profit}</strong><span style="color: #475569; width: 32px; text-align: right; font-size: 0.6rem;">${mp.margin}</span></div><div class="mp-bar-track"><div class="mp-bar-fill"${addAttribute(`width: ${mp.width};`, "style")}></div></div></div>`)}</div></section></div></main></div></div></div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/HeroDashboard.astro", void 0);
//#endregion
//#region src/components/landing/sections/Hero.astro
var $$Hero = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="hero-section" id="hero"><div class="hero-container"><div class="hero-grid"><!-- Left column: copy + CTAs --><div class="hero-copy"><span class="hero-eyebrow"><span class="dot" aria-hidden="true"></span>The accounting layer built for ecommerce business</span><h1 class="hero-title">The accounting layer built for ecommerce businesses<span class="dot">.</span></h1><p class="hero-lead">Connect your marketplaces, understand your profitability, reconcile your payments, and automatically account every transaction in your ERP.</p><div class="hero-actions"><a href="/contact" class="btn-primary-de">Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, {
		"size": 16,
		"aria-hidden": "true"
	})}</a><a href="/platform" class="btn-secondary-de">Explore Platform</a></div><p class="hero-note"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"></path></svg>Marketplace data in. ERP-ready accounting out.</p></div><!-- Right column: pipeline + dashboard composition --><div class="hero-visual">${renderComponent($$result, "HeroDiagram", $$HeroDiagram, {})}${renderComponent($$result, "HeroDashboard", $$HeroDashboard, {})}</div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Hero.astro", void 0);
//#endregion
//#region src/components/landing/sections/TrustBar.astro
var $$TrustBar = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="trust-bar" aria-label="DeepEcom at a glance"><div class="trust-inner"><div class="trust-grid">${[
		{
			value: "500+",
			label: "Businesses connected",
			note: "Sellers, brands, CFOs and accountants"
		},
		{
			value: "10M+",
			label: "Transactions / Orders",
			note: "Processed and reconciled"
		},
		{
			value: "99.9%",
			label: "Security & Reliability",
			note: "Enterprise-grade uptime"
		},
		{
			value: "100%",
			label: "Accounted in your ERP",
			note: "Line by line, automatically"
		}
	].map((s) => renderTemplate`<div class="trust-cell"><div class="trust-value">${s.value}</div><div class="trust-label">${s.label}</div><div class="trust-note">${s.note}</div></div>`)}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/TrustBar.astro", void 0);
//#endregion
//#region src/components/landing/sections/Problem.astro
var $$Problem = createComponent(($$result, $$props, $$slots) => {
	const points = [
		{
			title: "An order isn't just an order.",
			icon: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"
		},
		{
			title: "A payment isn't just a payment.",
			icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
		},
		{
			title: "And your settlement isn't just a payout.",
			icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"
		}
	];
	const events = [
		"Order",
		"GST",
		"Fee",
		"TCS / TDS",
		"Returns",
		"Inventory",
		"Settlements",
		"Payouts"
	];
	return renderTemplate`${maybeRenderHead($$result)}<div class="problem"><div class="problem-inner"><div class="problem-grid reveal"><!-- Left: title --><div><span class="problem-eyebrow">The problem</span><h2 class="problem-title">Ecommerce accounting is complicated.</h2><p class="problem-copy">An order doesn't just create a sale. It creates fees, taxes, returns, inventory movements and settlements — all of which have to reach your books.</p></div><!-- Right: 3 points --><div class="problem-points">${points.map((p) => renderTemplate`<div class="problem-point"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(p.icon, "d")}></path></svg></span><p>${p.title}</p></div>`)}</div></div><!-- accounting events strip --><div class="problem-events reveal">${events.map((e, i) => renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<span class="chip">${e}</span>${i < events.length - 1 && renderTemplate`<span class="sep" aria-hidden="true"></span>`}` })}`)}<span class="multiply"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 17l-10-10M17 7L7 17"></path></svg>Multiply this by 100,000 orders</span></div></div></div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Problem.astro", void 0);
//#endregion
//#region src/components/landing/PipelineVisual.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$PipelineVisual = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PipelineVisual;
	const { class: className } = Astro.props;
	const markets = [
		"Amazon",
		"Flipkart",
		"Shopify"
	];
	const intelligence = [
		"Profitability",
		"Reports",
		"Business visibility"
	];
	const reconciliation = [
		"Expected",
		"Received",
		"Matched",
		"Difference"
	];
	const accounting = [
		"Order",
		"GST",
		"Fees",
		"Receivable",
		"Inventory",
		"Stock Transfer"
	];
	const erps = [
		"Tally",
		"SAP",
		"Zoho"
	];
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["pv", className], "class:list")}><!-- ===================== DESKTOP (horizontal hub) ===================== --><div class="hidden lg:block" role="img" aria-label="Marketplaces flow into DeepEcom, which turns them into intelligence, reconciliation and accounting, and finally posts to your ERP"><svg viewBox="0 0 1200 640" fill="none" xmlns="http://www.w3.org/2000/svg" class="pv-svg"><defs><pattern id="pv-grid" width="22" height="22" patternUnits="userSpaceOnUse"><circle class="pv-grid-dot" cx="1.2" cy="1.2" r="1.1"></circle></pattern></defs><!-- faint grid backdrop --><rect x="0" y="0" width="1200" height="640" fill="url(#pv-grid)" opacity="0.5"></rect><!-- connector tracks + live overlay --><g><path class="pv-track" d="M250 280 H342"></path><path class="pv-track" d="M458 255 C 515 255, 515 120, 570 120"></path><path class="pv-track" d="M458 280 H570"></path><path class="pv-track" d="M458 305 C 515 305, 515 545, 570 545"></path><path class="pv-track" d="M790 120 C 860 120, 860 270, 930 270"></path><path class="pv-track" d="M790 335 C 850 335, 850 320, 930 320"></path><path class="pv-track" d="M790 545 C 860 545, 860 370, 930 370"></path></g><g><path class="pv-track-live" d="M250 280 H342"></path><path class="pv-track-live" d="M458 255 C 515 255, 515 120, 570 120"></path><path class="pv-track-live" d="M458 280 H570"></path><path class="pv-track-live" d="M458 305 C 515 305, 515 545, 570 545"></path><path class="pv-track-live" d="M790 120 C 860 120, 860 270, 930 270"></path><path class="pv-track-live" d="M790 335 C 850 335, 850 320, 930 320"></path><path class="pv-track-live" d="M790 545 C 860 545, 860 370, 930 370"></path></g><!-- mpath targets --><path id="pv-p1" d="M250 280 H342"></path><path id="pv-p2" d="M458 255 C 515 255, 515 120, 570 120"></path><path id="pv-p3" d="M458 280 H570"></path><path id="pv-p4" d="M458 305 C 515 305, 515 545, 570 545"></path><path id="pv-p5" d="M790 120 C 860 120, 860 270, 930 270"></path><path id="pv-p6" d="M790 335 C 850 335, 850 320, 930 320"></path><path id="pv-p7" d="M790 545 C 860 545, 860 370, 930 370"></path><!-- data dots --><g class="pv-dots"><circle class="pv-dot" r="3.5"><animateMotion dur="2.4s" begin="0s" repeatCount="indefinite"><mpath href="#pv-p1"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.4s" begin="0.4s" repeatCount="indefinite"><mpath href="#pv-p2"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite"><mpath href="#pv-p3"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite"><mpath href="#pv-p4"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.4s" begin="1.6s" repeatCount="indefinite"><mpath href="#pv-p5"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.4s" begin="2s" repeatCount="indefinite"><mpath href="#pv-p6"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.4s" begin="2.4s" repeatCount="indefinite"><mpath href="#pv-p7"></mpath></animateMotion></circle></g><!-- MARKETPLACES --><g transform="translate(40, 170)"><rect class="pv-card" x="0" y="0" width="210" height="260" rx="16"></rect><text class="pv-head" x="18" y="32">Marketplaces</text><line x1="18" y1="46" x2="192" y2="46" stroke="var(--border)" stroke-width="1"></line>${markets.map((m, i) => renderTemplate`<g${addAttribute(`translate(18, ${64 + i * 38})`, "transform")}><rect class="pv-row-tile" x="0" y="0" width="40" height="26" rx="7"></rect><text class="pv-row-note" x="20" y="17" text-anchor="middle">${m.slice(0, 2)}</text><text class="pv-row-label" x="52" y="17">${m}</text></g>`)}<text class="pv-cap" x="105" y="238" text-anchor="middle">→ Data</text></g><!-- DEEPECOM (core) --><g transform="translate(342, 222)"><circle class="pv-glow" cx="58" cy="58" r="70"></circle><rect class="pv-core" x="0" y="0" width="116" height="116" rx="28"></rect><g transform="translate(58, 58)"><rect class="pv-core-bar" x="-22" y="-14" width="9" height="34" rx="2"></rect><rect class="pv-core-bar" x="-6.5" y="-24" width="9" height="52" rx="2"></rect><rect class="pv-core-bar" x="9" y="-32" width="9" height="68" rx="2" opacity="0.92"></rect></g><text class="pv-core-name" x="58" y="150" text-anchor="middle">DeepEcom</text><text class="pv-core-sub" x="58" y="170" text-anchor="middle">Your Accounting Layer</text><text class="pv-core-sub" x="58" y="184" text-anchor="middle">for Ecommerce</text></g><!-- INTELLIGENCE --><g transform="translate(570, 30)"><rect class="pv-card" x="0" y="0" width="220" height="190" rx="16"></rect><text class="pv-head" x="18" y="32">Intelligence</text><line x1="18" y1="46" x2="202" y2="46" stroke="var(--border)" stroke-width="1"></line>${intelligence.map((item, i) => renderTemplate`<g${addAttribute(`translate(18, ${64 + i * 40})`, "transform")}><rect class="pv-row-tile" x="0" y="0" width="40" height="26" rx="7"></rect><text class="pv-row-label" x="52" y="17">${item}</text></g>`)}</g><!-- RECONCILIATION --><g transform="translate(570, 240)"><rect class="pv-card" x="0" y="0" width="220" height="190" rx="16"></rect><text class="pv-head" x="18" y="32">Reconciliation</text><line x1="18" y1="46" x2="202" y2="46" stroke="var(--border)" stroke-width="1"></line>${reconciliation.map((r, i) => renderTemplate`<g${addAttribute(`translate(18, ${60 + i * 34})`, "transform")}><rect class="pv-row-tile" x="0" y="0" width="40" height="26" rx="7"></rect><text class="pv-row-note" x="20" y="17" text-anchor="middle">${r.slice(0, 2)}</text><text${addAttribute(r === "Matched" ? "pv-ok-label" : "pv-row-label", "class")} x="52" y="17">${r}</text>${r === "Matched" && renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<circle class="pv-ok" cx="160" cy="13" r="4"></circle><path class="pv-ok" d="M157.5 13 l2 2 3.5-3.5" stroke="var(--success-500)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>` })}`}</g>`)}</g><!-- ACCOUNTING --><g transform="translate(570, 450)"><rect class="pv-card" x="0" y="0" width="220" height="190" rx="16"></rect><text class="pv-head" x="18" y="32">Accounting</text><line x1="18" y1="46" x2="202" y2="46" stroke="var(--border)" stroke-width="1"></line>${accounting.map((a, i) => {
		const col = i % 2;
		const row = Math.floor(i / 2);
		return renderTemplate`<g${addAttribute(`translate(${18 + col * 100}, ${62 + row * 42})`, "transform")} class="pv-enter"${addAttribute(`animation-delay: ${i * 90}ms`, "style")}><rect class="pv-chip" x="0" y="0" width="86" height="30" rx="8"></rect><text class="pv-chip-label" x="43" y="19" text-anchor="middle">${a}</text></g>`;
	})}</g><!-- ERP --><g transform="translate(930, 200)"><rect class="pv-card" x="0" y="0" width="230" height="240" rx="16"></rect><text class="pv-head" x="18" y="32">ERP</text><line x1="18" y1="46" x2="212" y2="46" stroke="var(--border)" stroke-width="1"></line>${erps.map((e, i) => renderTemplate`<g${addAttribute(`translate(18, ${66 + i * 40})`, "transform")}><rect class="pv-row-tile" x="0" y="0" width="40" height="26" rx="7"></rect><text class="pv-row-note" x="20" y="17" text-anchor="middle">${e.slice(0, 2)}</text><text class="pv-row-label" x="52" y="17">${e}</text></g>`)}<circle class="pv-ok" cx="18" cy="204" r="4"></circle><path class="pv-ok" d="M15.5 204 l2 2 3.5-3.5" stroke="var(--success-500)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><text class="pv-row-note" x="30" y="208">Vouchers posted</text></g></svg></div><!-- ===================== MOBILE (vertical) ===================== --><div class="lg:hidden" role="img" aria-label="Vertical pipeline: marketplaces to DeepEcom to intelligence, reconciliation, accounting, then ERP"><svg viewBox="0 0 360 1120" fill="none" xmlns="http://www.w3.org/2000/svg" class="pv-svg"><defs><pattern id="pv-grid-m" width="20" height="20" patternUnits="userSpaceOnUse"><circle class="pv-grid-dot" cx="1.1" cy="1.1" r="1"></circle></pattern></defs><rect x="0" y="0" width="360" height="1120" fill="url(#pv-grid-m)" opacity="0.5"></rect><!-- vertical connector tracks --><g><path class="pv-track" d="M180 170 V202"></path><path class="pv-track" d="M180 302 V390"></path><path class="pv-track" d="M180 532 V570"></path><path class="pv-track" d="M180 722 V760"></path><path class="pv-track" d="M180 912 V950"></path></g><g><path class="pv-track-live" d="M180 170 V202"></path><path class="pv-track-live" d="M180 302 V390"></path><path class="pv-track-live" d="M180 532 V570"></path><path class="pv-track-live" d="M180 722 V760"></path><path class="pv-track-live" d="M180 912 V950"></path></g><path id="pv-m1" d="M180 170 V202"></path><path id="pv-m2" d="M180 302 V390"></path><path id="pv-m3" d="M180 532 V570"></path><path id="pv-m4" d="M180 722 V760"></path><path id="pv-m5" d="M180 912 V950"></path><g class="pv-dots"><circle class="pv-dot" r="3.5"><animateMotion dur="2.2s" begin="0s" repeatCount="indefinite"><mpath href="#pv-m1"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.2s" begin="0.5s" repeatCount="indefinite"><mpath href="#pv-m2"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.2s" begin="1s" repeatCount="indefinite"><mpath href="#pv-m3"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.2s" begin="1.5s" repeatCount="indefinite"><mpath href="#pv-m4"></mpath></animateMotion></circle><circle class="pv-dot" r="3.5"><animateMotion dur="2.2s" begin="2s" repeatCount="indefinite"><mpath href="#pv-m5"></mpath></animateMotion></circle></g><!-- MARKETPLACES --><g transform="translate(40, 20)"><rect class="pv-card" x="0" y="0" width="280" height="150" rx="16"></rect><text class="pv-head" x="18" y="32">Marketplaces</text><line x1="18" y1="46" x2="262" y2="46" stroke="var(--border)" stroke-width="1"></line>${markets.map((m, i) => renderTemplate`<g${addAttribute(`translate(18, ${62 + i * 30})`, "transform")}><rect class="pv-row-tile" x="0" y="0" width="34" height="22" rx="6"></rect><text class="pv-row-note" x="17" y="14" text-anchor="middle">${m.slice(0, 2)}</text><text class="pv-row-label" x="44" y="15">${m}</text></g>`)}</g><!-- DEEPECOM core --><g transform="translate(130, 202)"><circle class="pv-glow" cx="50" cy="50" r="64"></circle><rect class="pv-core" x="0" y="0" width="100" height="100" rx="26"></rect><g transform="translate(50, 50)"><rect class="pv-core-bar" x="-19" y="-12" width="8" height="29" rx="2"></rect><rect class="pv-core-bar" x="-5.5" y="-21" width="8" height="45" rx="2"></rect><rect class="pv-core-bar" x="8" y="-28" width="8" height="59" rx="2" opacity="0.92"></rect></g><text class="pv-core-name" x="50" y="128" text-anchor="middle">DeepEcom</text><text class="pv-core-sub" x="50" y="146" text-anchor="middle">Your Accounting Layer for Ecommerce</text></g><!-- INTELLIGENCE --><g transform="translate(40, 390)"><rect class="pv-card" x="0" y="0" width="280" height="142" rx="16"></rect><text class="pv-head" x="18" y="30">Intelligence</text><line x1="18" y1="42" x2="262" y2="42" stroke="var(--border)" stroke-width="1"></line>${intelligence.map((item, i) => renderTemplate`<g${addAttribute(`translate(18, ${56 + i * 30})`, "transform")}><rect class="pv-row-tile" x="0" y="0" width="34" height="22" rx="6"></rect><text class="pv-row-label" x="44" y="15">${item}</text></g>`)}</g><!-- RECONCILIATION --><g transform="translate(40, 570)"><rect class="pv-card" x="0" y="0" width="280" height="152" rx="16"></rect><text class="pv-head" x="18" y="30">Reconciliation</text><line x1="18" y1="42" x2="262" y2="42" stroke="var(--border)" stroke-width="1"></line>${reconciliation.map((r, i) => renderTemplate`<g${addAttribute(`translate(18, ${54 + i * 26})`, "transform")}><rect class="pv-row-tile" x="0" y="0" width="34" height="22" rx="6"></rect><text class="pv-row-note" x="17" y="14" text-anchor="middle">${r.slice(0, 2)}</text><text${addAttribute(r === "Matched" ? "pv-ok-label" : "pv-row-label", "class")} x="44" y="15">${r}</text>${r === "Matched" && renderTemplate`<path class="pv-ok" d="M244 15 l2 2 3.5-3.5" stroke="var(--success-500)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>`}</g>`)}</g><!-- ACCOUNTING --><g transform="translate(40, 760)"><rect class="pv-card" x="0" y="0" width="280" height="152" rx="16"></rect><text class="pv-head" x="18" y="30">Accounting</text><line x1="18" y1="42" x2="262" y2="42" stroke="var(--border)" stroke-width="1"></line>${accounting.map((a, i) => {
		const col = i % 2;
		const row = Math.floor(i / 2);
		return renderTemplate`<g${addAttribute(`translate(${18 + col * 132}, ${56 + row * 34})`, "transform")} class="pv-enter"${addAttribute(`animation-delay: ${i * 90}ms`, "style")}><rect class="pv-chip" x="0" y="0" width="116" height="26" rx="7"></rect><text class="pv-chip-label" x="58" y="17" text-anchor="middle">${a}</text></g>`;
	})}</g><!-- ERP --><g transform="translate(40, 950)"><rect class="pv-card" x="0" y="0" width="280" height="140" rx="16"></rect><text class="pv-head" x="18" y="30">ERP</text><line x1="18" y1="42" x2="262" y2="42" stroke="var(--border)" stroke-width="1"></line>${erps.map((e, i) => renderTemplate`<g${addAttribute(`translate(18, ${56 + i * 30})`, "transform")}><rect class="pv-row-tile" x="0" y="0" width="34" height="22" rx="6"></rect><text class="pv-row-note" x="17" y="14" text-anchor="middle">${e.slice(0, 2)}</text><text class="pv-row-label" x="44" y="15">${e}</text></g>`)}</g></svg></div></div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/PipelineVisual.astro", void 0);
//#endregion
//#region src/components/landing/sections/DeepEcomLayer.astro
var $$DeepEcomLayer = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="layer" id="layer"><div class="layer-inner"><div class="layer-head reveal"><div><span class="layer-eyebrow">The DeepEcom difference</span><h2 class="layer-title">We turn all of it into one financial picture.</h2></div><div><p class="layer-lead">DeepEcom connects ecommerce data, payment data and accounting information to create a single, structured financial view of your business.</p><ul class="layer-list"><li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"></path></svg>Fragmented marketplace data in</li><li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"></path></svg>Intelligence, reconciliation and accounting out</li><li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"></path></svg>ERP-ready, line by line</li></ul></div></div><div class="layer-flow reveal">${renderComponent($$result, "PipelineVisual", $$PipelineVisual, {})}</div></div></section>`;
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
createAstro("https://website-lovat-six-11.vercel.app");
var $$DashboardPreview = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DashboardPreview;
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
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["dash-stage", !Astro.props.compact && "mt-14 border-y border-border py-14 md:mt-20 md:py-20"], "class:list")}><div class="mx-auto max-w-6xl px-6"><div${addAttribute(["overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card", Astro.props.compact ? "" : "reveal"], "class:list")} role="img" aria-label="DeepEcom dashboard preview showing revenue metrics and recent marketplace settlements"><!-- topbar --><div class="flex items-center gap-3.5 border-b border-border bg-zinc-50/70 px-5 py-3"><div class="flex min-w-0 items-center gap-2 text-[13.5px] font-semibold text-ink"><span class="org inline-flex min-w-0 items-center gap-2"><span class="grid size-5.5 shrink-0 place-items-center rounded-md bg-ink text-[10px] font-bold tracking-wide text-white">AR</span><span class="truncate">Paragon Retail Pvt Ltd</span></span><span class="text-zinc-300">/</span><span class="font-normal text-muted-foreground">Overview</span></div><div class="ml-auto hidden min-w-52 items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-zinc-400 md:flex">${renderComponent($$result, "Search", Search, { "size": 13 })}Search orders, SKUs…<kbd class="ml-auto rounded border border-border bg-subtle px-1.5 py-px font-sans text-[10.5px]">⌘K</kbd></div><button type="button" class="relative grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-subtle" aria-label="Notifications">${renderComponent($$result, "Bell", Bell, { "size": 15 })}<span class="absolute top-1.5 right-2 size-1.5 rounded-full border-[1.5px] border-white bg-amber-500"></span></button><div class="hidden sm:flex" aria-hidden="true"><span class="grid size-7 place-items-center rounded-full border-[1.5px] border-accent bg-accent text-[10.5px] font-bold text-accent-foreground">RM</span><span class="-ml-1.5 grid size-7 place-items-center rounded-full border-[1.5px] border-white bg-subtle text-[10.5px] font-bold text-muted-foreground">AN</span><span class="-ml-1.5 grid size-7 place-items-center rounded-full border-[1.5px] border-white bg-subtle text-[10.5px] font-bold text-muted-foreground">+6</span></div></div><!-- body --><div class="flex flex-col gap-4 p-4 md:p-6"><!-- KPIs --><div class="grid grid-cols-2 gap-3.5 lg:grid-cols-4">${kpis.map((k) => renderTemplate`<div class="rounded-xl border border-border bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"><div class="text-[12.5px] font-medium text-muted-foreground">${k.label}</div><div class="mt-1.5 flex items-baseline gap-1.5">${renderComponent($$result, "KpiValue", KpiValue, {
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
	})}Last 8 months</span></div><div class="relative px-2.5 pt-3 pb-1.5"><div class="pointer-events-none absolute top-[4%] right-[3.5%] rounded-lg bg-ink px-3 py-2 text-left leading-tight shadow-md"><div class="text-[10.5px] font-semibold tracking-wide text-zinc-400 uppercase">Aug 2026</div><div class="num text-sm font-bold">₹24.8L</div><div class="text-[11px] font-medium text-emerald-300">▲ 14.3% MoM</div></div><svg viewBox="0 0 720 264" fill="none" class="h-auto w-full" aria-hidden="true"><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#533afd" stop-opacity="0.14"></stop><stop offset="100%" stop-color="#533afd" stop-opacity="0"></stop></linearGradient></defs><g stroke="#eeeef2"><line x1="64" y1="232" x2="704" y2="232"></line><line x1="64" y1="180" x2="704" y2="180"></line><line x1="64" y1="128" x2="704" y2="128"></line><line x1="64" y1="76" x2="704" y2="76"></line><line x1="64" y1="24" x2="704" y2="24"></line></g><g fill="#8b8b94" font-family="Inter, sans-serif" font-size="10.5"><text x="54" y="236" text-anchor="end">₹0</text><text x="54" y="184" text-anchor="end">₹7L</text><text x="54" y="132" text-anchor="end">₹14L</text><text x="54" y="80" text-anchor="end">₹21L</text><text x="54" y="28" text-anchor="end">₹28L</text><text x="72" y="256" text-anchor="middle">Jan</text><text x="160" y="256" text-anchor="middle">Feb</text><text x="248" y="256" text-anchor="middle">Mar</text><text x="336" y="256" text-anchor="middle">Apr</text><text x="424" y="256" text-anchor="middle">May</text><text x="512" y="256" text-anchor="middle">Jun</text><text x="600" y="256" text-anchor="middle">Jul</text><text x="688" y="256" text-anchor="middle" fill="#18181b" font-weight="600">Aug</text></g><path${addAttribute("M72,159 C112,159 120,151 160,151 C200,151 208,156 248,156 C288,156 296,140 336,140 C376,140 384,135 424,135 C464,135 472,119 512,119 C552,119 560,99 600,99 C640,99 648,79 688,79", "d")} stroke="#d4d4d8" stroke-width="1.75" stroke-dasharray="4 4" stroke-linecap="round"></path><path${addAttribute(`${line} L688,232 L72,232 Z`, "d")} fill="url(#areaFill)"></path><path${addAttribute(line, "d")} stroke="#533afd" stroke-width="2.25" stroke-linecap="round"></path><line x1="688" y1="48" x2="688" y2="232" stroke="#c7d2fe" stroke-dasharray="3 3"></line><circle cx="688" cy="48" r="8" fill="#533afd" fill-opacity="0.14"></circle><circle cx="688" cy="48" r="4" fill="#533afd" stroke="#fff" stroke-width="2"></circle></svg></div></div><!-- settlements feed --><aside class="hidden overflow-hidden rounded-xl border border-border bg-white xl:flex xl:flex-col"><div class="flex items-center gap-2.5 border-b border-border px-4 py-3"><span class="text-sm font-bold tracking-tight text-ink">Latest settlements</span><span class="live-dot ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-emerald-700 uppercase"><i class="size-[7px] rounded-full bg-emerald-600"></i>Live</span></div><div class="flex-1 divide-y divide-subtle">${feed.map((f) => renderTemplate`<div class="flex items-center gap-3 px-4 py-2.5"><span class="grid size-8.5 shrink-0 place-items-center rounded-[9px] border border-border bg-subtle text-xs font-bold text-muted-foreground">${f.init}</span><div class="min-w-0"><div class="truncate text-[13.5px] font-semibold text-ink">${f.name}</div><div class="text-[11.5px] text-zinc-400">${f.time}</div></div><div class="ml-auto text-right"><div class="num text-[13.5px] font-bold tracking-tight text-ink">${f.amt}</div>${renderComponent($$result, "Badge", Badge, {
		"variant": f.variant,
		"className": "mt-0.5"
	}, { "default": ($$result) => renderTemplate`${f.status}` })}</div></div>`)}</div><a href="#analytics" class="flex items-center gap-1.5 border-t border-border bg-zinc-50/70 px-4 py-2.5 text-[12.5px] font-semibold text-primary no-underline hover:text-brand-700">View all settlements<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg></a></aside></div></div></div></div></div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/DashboardPreview.astro", void 0);
//#endregion
//#region src/components/landing/sections/Platform.astro
var $$Platform = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="showcase" id="platform" aria-label="DeepEcom Platform"><div><span class="kicker">Platform</span><h3>Understand your business. In real time.</h3><p>Bring marketplace data together and see the numbers that actually matter — revenue, costs and profitability per channel.</p><a href="/platform" class="showcase-cta">Explore Platform<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a></div><div class="showcase-media">${renderComponent($$result, "DashboardPreview", $$DashboardPreview, { "compact": true })}</div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Platform.astro", void 0);
//#endregion
//#region src/components/landing/AccountingPreview.astro
var $$AccountingPreview = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="erp-table" role="img" aria-label="DeepEcom accounting entry preview showing order-wise GST and ledger details"><div class="t-head"><span class="dot" aria-hidden="true"></span>Journal entries · Order #458921<span class="sub">GST-ready · Posted to Tally</span></div><div class="t-col"><span class="strong">Sales — Amazon</span><span class="num">₹2,499.00</span><span class="credit">₹2,499.00</span><span class="status"><span class="ic"></span>Posted</span></div><div class="t-col"><span class="strong">Output GST</span><span class="num">₹381.20</span><span class="credit">₹381.20</span><span class="status"><span class="ic"></span>Posted</span></div><div class="t-col"><span class="strong">Marketplace charges</span><span class="num">₹312.00</span><span class="debit">₹312.00</span><span class="status"><span class="ic"></span>Posted</span></div><div class="t-col"><span class="strong">Receivable — Amazon</span><span class="num">₹2,087.80</span><span class="debit">₹2,087.80</span><span class="status"><span class="ic"></span>Pending</span></div></div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/AccountingPreview.astro", void 0);
//#endregion
//#region src/components/landing/sections/ErpConnector.astro
var $$ErpConnector = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="showcase" id="erp-connector" aria-label="DeepEcom ERP Connector"><div><span class="kicker">ERP Connector</span><h3>Account every transaction. Automatically.</h3><p>Convert ecommerce orders into detailed, GST-ready accounting entries and post them into your ERP — order by order, warehouse by warehouse.</p><a href="/erp-connector" class="showcase-cta">Explore ERP Connector<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a></div><div class="showcase-media">${renderComponent($$result, "AccountingPreview", $$AccountingPreview, {})}</div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/ErpConnector.astro", void 0);
//#endregion
//#region src/components/landing/sections/CapabilityStrip.astro
var $$CapabilityStrip = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="capability-band" id="capabilities" aria-label="Accounting capabilities"><div class="capability-inner"><div class="capability-head reveal"><h2 class="capability-title">Accounting built for ecommerce, not adapted to it.</h2><span class="capability-note">Detailed, line-by-line — ready for your ERP</span></div><div class="capability-grid reveal">${[
		{
			title: "Order-wise",
			desc: "Every order accounted individually, never lumped into summaries",
			icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4"
		},
		{
			title: "GST-wise",
			desc: "IGST, CGST, SGST split by type and state, ERP-ready",
			icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
		},
		{
			title: "Warehouse-wise",
			desc: "Stock and values tracked per warehouse and fulfilment centre",
			icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
		},
		{
			title: "Marketplace-wise",
			desc: "Fees, charges and payouts handled separately per marketplace",
			icon: "M3 21V8l9-5 9 5v13M9 21v-6h6v6M9 10h.01M15 10h.01M9 14h.01M15 14h.01"
		},
		{
			title: "Returns",
			desc: "Returns and refunds flow into your books automatically",
			icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
		},
		{
			title: "Stock Transfers",
			desc: "Inter-warehouse movement accounted without inventory drift",
			icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
		},
		{
			title: "TCS / TDS",
			desc: "Withholding tax captured and posted exactly where it belongs",
			icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
		}
	].map((c) => renderTemplate`<div class="capability-cell"><span class="capability-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(c.icon, "d")}></path></svg></span><strong>${c.title}</strong><span>${c.desc}</span></div>`)}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/CapabilityStrip.astro", void 0);
//#endregion
//#region src/components/landing/sections/Solutions.astro
var $$Solutions = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="solutions-section" id="solutions"><div class="solutions-inner">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Solutions",
		"title": "Built around how your business works.",
		"lead": "DeepEcom is designed for the specific problems of ecommerce sellers and the finance teams behind them."
	})}<div class="sol-group reveal"><span class="sol-group-label">By business</span><div class="sol-list">${[
		{
			label: "Amazon Sellers",
			desc: "Understand profitability, reconcile marketplace payments and automate accounting.",
			href: "/solutions/amazon-sellers",
			icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM5 10l2 2 5-6M12 8v6M10 11h4"
		},
		{
			label: "D2C Brands",
			desc: "Bring website and marketplace financial data together.",
			href: "/solutions/d2c-brands",
			icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 21v-6h6v6"
		},
		{
			label: "Enterprise",
			desc: "Handle high-volume ecommerce accounting across warehouses, marketplaces and ERP systems.",
			href: "/solutions/enterprise",
			icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01"
		}
	].map((s) => renderTemplate`<a${addAttribute(s.href, "href")} class="sol-card"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${addAttribute(s.icon, "d")}></path></svg></span><strong>${s.label}</strong><span>${s.desc}</span><span class="go">Learn more →</span></a>`)}</div></div><div class="sol-group reveal"><span class="sol-group-label">By role</span><div class="sol-role-list">${[
		{
			label: "CFOs",
			desc: "Get financial visibility, reconciliation and control.",
			href: "/solutions/cfos",
			icon: "M3 3v16a2 2 0 0 0 2 2h16M7 13l4-4 4 3 5-6"
		},
		{
			label: "Accountants",
			desc: "Automate detailed ecommerce accounting and ERP posting.",
			href: "/solutions/accountants",
			icon: "M6 2h12a2 2 0 0 1 2 2v16l-3-2-3 2-3-2-3 2-3-2-3 2V4a2 2 0 0 1 2-2zM9 8h6M9 12h6"
		},
		{
			label: "Business Owners",
			desc: "Know what you sold, what you received and what you actually made.",
			href: "/solutions/business-owners",
			icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
		}
	].map((r, i) => renderTemplate`<a${addAttribute(r.href, "href")} class="sol-role"><span class="num">${String(i + 1).padStart(2, "0")}</span><span class="body"><strong>${r.label}</strong><span>${r.desc}</span></span><span class="arr" aria-hidden="true">→</span></a>`)}</div></div></div></section>`;
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
			init: "Sy",
			name: "Shopify"
		},
		{
			init: "Me",
			name: "Meesho"
		},
		{
			init: "+",
			name: "More channels"
		}
	],
	erp: [
		{
			init: "Tp",
			name: "Tally"
		},
		{
			init: "Sap",
			name: "SAP"
		},
		{
			init: "Zb",
			name: "Zoho Books"
		},
		{
			init: "+",
			name: "More ERP systems"
		}
	]
};
var tile = "flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-[14.5px] font-semibold tracking-tight text-ink-900 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-sm";
var tileLogo = "grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-xs font-extrabold text-brand-600";
function IntegrationsTabs() {
	return /* @__PURE__ */ jsxs(Tabs, {
		defaultValue: "marketplace",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex justify-center",
			children: /* @__PURE__ */ jsxs(TabsList, {
				className: "flex-wrap",
				children: [/* @__PURE__ */ jsx(TabsTab, {
					value: "marketplace",
					children: "Marketplaces"
				}), /* @__PURE__ */ jsx(TabsTab, {
					value: "erp",
					children: "ERP"
				})]
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
		"title": "Works with the systems you already use.",
		"lead": "Marketplace activity flows into DeepEcom, and DeepEcom posts detailed accounting into your ERP — no walls of disconnected logos.",
		"center": true
	})}<div class="int-flow-container reveal" role="img" aria-label="Data flow integration diagram from Marketplaces to DeepEcom to ERPs"><!-- Input Node --><div class="int-card"><div class="int-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></div><span class="c-title">Marketplaces</span><div class="c-items"><span class="pill">Amazon</span><span class="pill">Flipkart</span><span class="pill">Shopify</span><span class="pill">Meesho</span><span class="pill">More</span></div></div><!-- Connector 1 --><div class="int-connector" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg></div><!-- Central Engine Node --><div class="int-card is-core"><div class="int-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg></div><span class="c-title">DeepEcom</span><div class="c-items"><span class="pill">Intelligence</span><span class="pill">Reconciliation</span><span class="pill">Accounting</span></div></div><!-- Connector 2 --><div class="int-connector" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg></div><!-- Output Node --><div class="int-card"><div class="int-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div><span class="c-title">ERP & Financials</span><div class="c-items"><span class="pill">Tally</span><span class="pill">SAP</span><span class="pill">Zoho</span><span class="pill">More</span></div></div></div><div class="int-tabs reveal">${renderComponent($$result, "IntegrationsTabs", IntegrationsTabs, {
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
	return renderTemplate`${maybeRenderHead($$result)}<section class="final-cta" id="get-started"><div class="final-cta-card reveal"><span class="final-cta-eyebrow">The accounting layer for ecommerce</span><h2 class="final-cta-title">Bring your ecommerce business and your books together.</h2><p class="final-cta-lead">Connect your marketplaces, understand your business and automate ecommerce accounting.</p><div class="final-cta-actions"><a href="/contact"${addAttribute(buttonVariants({
		variant: "white",
		size: "lg"
	}), "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 16 })}</a><a href="/contact" class="final-cta-secondary">Talk to an Expert</a></div><ul class="final-cta-trust">${[
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
	})}<main class="relative">${renderSlot($$result, $$slots["default"])}</main>${renderComponent($$result, "SiteFooter", $$SiteFooter, {})}<!-- spacer so the sticky mobile CTA never covers footer content --><div class="h-18 md:hidden" aria-hidden="true"></div><!-- sticky mobile CTA --><div id="mobile-cta" class="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-border bg-white/95 backdrop-blur transition-transform duration-300 md:hidden"><div class="mx-auto flex max-w-md items-center gap-2.5 px-4 py-3"><a href="/platform"${addAttribute(`${buttonVariants({ variant: "outline" })} flex-1`, "class")}>Explore Platform</a><a href="/contact"${addAttribute(`${buttonVariants()} flex-1 gap-1.5`, "class")}>Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 15 })}</a></div></div>${renderScript($$result, "/home/ranjit/Documents/deepecom/website/src/layouts/LandingLayout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/home/ranjit/Documents/deepecom/website/src/layouts/LandingLayout.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "LandingLayout", $$LandingLayout, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Hero", $$Hero, {})}${renderComponent($$result, "TrustBar", $$TrustBar, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Problem", $$Problem, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "DeepEcomLayer", $$DeepEcomLayer, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${maybeRenderHead($$result)}<div class="showcase-grid">${renderComponent($$result, "Platform", $$Platform, {})}${renderComponent($$result, "ErpConnector", $$ErpConnector, {})}</div>${renderComponent($$result, "CapabilityStrip", $$CapabilityStrip, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Solutions", $$Solutions, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Integrations", $$Integrations, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Customers", $$Customers, {})}${renderComponent($$result, "FinalCta", $$FinalCta, {})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/index.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page, __exportAll as t };
