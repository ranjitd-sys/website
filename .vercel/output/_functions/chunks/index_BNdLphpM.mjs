import { D as createAstro, T as unescapeHTML, _ as maybeRenderHead, b as createRenderInstruction, c as renderComponent, g as renderTemplate, p as renderSlot, u as Fragment$2, v as renderHead, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent, n as $$Font } from "./_astro_assets_DbfyT0-S.mjs";
import { i as buttonVariants, n as Navbar, t as $$SiteFooter } from "./site-footer_CKJGCi14.mjs";
import { t as $$SectionHeading } from "./section-heading_D29GYgDU.mjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ArrowRight, ArrowUp, BarChart3, Bell, Calendar, Check, ChevronDown, CreditCard, DollarSign, FileText, LayoutDashboard, Play, Search, Settings, ShieldCheck, ShoppingBag } from "lucide-react";
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
	return renderTemplate`${maybeRenderHead($$result)}<div class="hero-diagram-wrap" data-astro-cid-tj3dqhhm><svg class="hero-diagram" viewBox="0 0 1100 540" role="img" aria-label="Marketplaces and channels connect into DeepEcom central hub, which processes data and posts into your ERP" data-astro-cid-tj3dqhhm><defs data-astro-cid-tj3dqhhm><!-- Glowing soft shadows matching the image design --><filter id="card-shadow" x="-30%" y="-30%" width="160%" height="160%" data-astro-cid-tj3dqhhm><feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.06" data-astro-cid-tj3dqhhm></feDropShadow><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.03" data-astro-cid-tj3dqhhm></feDropShadow></filter><filter id="center-shadow" x="-40%" y="-40%" width="180%" height="180%" data-astro-cid-tj3dqhhm><feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#3b82f6" flood-opacity="0.18" data-astro-cid-tj3dqhhm></feDropShadow><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#1d4ed8" flood-opacity="0.12" data-astro-cid-tj3dqhhm></feDropShadow></filter><!-- Arrow Markers --><marker id="blue-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto" data-astro-cid-tj3dqhhm><path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3b82f6" data-astro-cid-tj3dqhhm></path></marker></defs><!-- LEFT CARD: Marketplaces & Channels --><g transform="translate(40, 40)" data-astro-cid-tj3dqhhm><rect width="210" height="460" rx="28" fill="#ffffff" filter="url(#card-shadow)" data-astro-cid-tj3dqhhm></rect><text x="105" y="55" text-anchor="middle" class="title-main" data-astro-cid-tj3dqhhm>Marketplaces</text><text x="105" y="77" text-anchor="middle" class="title-main" data-astro-cid-tj3dqhhm>&amp; Channels</text><!-- Amazon Logo Placeholder / Text --><g transform="translate(35, 120)" data-astro-cid-tj3dqhhm><text x="70" y="24" text-anchor="middle" class="brand-text amazon-logo" data-astro-cid-tj3dqhhm>amazon</text><path d="M 35 30 Q 70 42 105 30" fill="none" stroke="#ff9900" stroke-width="2.5" stroke-linecap="round" data-astro-cid-tj3dqhhm></path></g><!-- Flipkart Logo --><g transform="translate(35, 195)" data-astro-cid-tj3dqhhm><text x="50" y="24" class="brand-text flipkart-blue" data-astro-cid-tj3dqhhm>Flipkart</text><rect x="108" y="7" width="24" height="22" rx="3" fill="#ffe11b" data-astro-cid-tj3dqhhm></rect><path d="M 116 12 L 122 12 M 116 16 L 124 16 M 118 16 L 121 23" stroke="#2874f0" stroke-width="2" stroke-linecap="round" data-astro-cid-tj3dqhhm></path></g><!-- Shopify Logo --><g transform="translate(35, 275)" data-astro-cid-tj3dqhhm><path d="M 22 8 C 22 8 20 4 15 4 C 11 4 8 8 8 13 C 8 21 22 28 22 28 C 22 28 36 21 36 13 C 36 8 33 4 29 4 C 24 4 22 8 22 8 Z" fill="#95bf47" data-astro-cid-tj3dqhhm></path><text x="46" y="22" class="brand-text shopify-text" data-astro-cid-tj3dqhhm>shopify</text></g><!-- + More Footer --><text x="50" y="390" class="more-text" data-astro-cid-tj3dqhhm>+ More</text></g><!-- CENTER CARD: DeepEcom Engine --><g transform="translate(410, 30)" data-astro-cid-tj3dqhhm><rect width="320" height="480" rx="36" fill="#ffffff" filter="url(#center-shadow)" data-astro-cid-tj3dqhhm></rect><!-- DeepEcom Header Logo --><g transform="translate(70, 52)" data-astro-cid-tj3dqhhm><!-- Custom Blue Symbol --><path d="M 0 4 C 0 1.8 1.8 0 4 0 L 22 0 C 27.5 0 32 4.5 32 10 C 32 15.5 27.5 20 22 20 L 12 20 L 12 26 L 26 26 C 31.5 26 36 30.5 36 36 C 36 41.5 31.5 46 26 46 L 4 46 C 1.8 46 0 44.2 0 42 Z" fill="#2563eb" data-astro-cid-tj3dqhhm></path><circle cx="6" cy="10" r="3" fill="#ffffff" data-astro-cid-tj3dqhhm></circle><circle cx="6" cy="36" r="3" fill="#ffffff" data-astro-cid-tj3dqhhm></circle><text x="48" y="33" class="deepecom-logo-text" data-astro-cid-tj3dqhhm>DeepEcom</text></g><!-- Feature 1: Understand --><g transform="translate(50, 150)" data-astro-cid-tj3dqhhm><rect width="40" height="40" rx="10" fill="none" stroke="#2563eb" stroke-width="2" data-astro-cid-tj3dqhhm></rect><path d="M 12 20 L 18 14 L 24 20 L 28 16" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-tj3dqhhm></path><circle cx="28" cy="16" r="2" fill="#2563eb" data-astro-cid-tj3dqhhm></circle><text x="56" y="20" class="feature-title" data-astro-cid-tj3dqhhm>Understand</text><text x="56" y="36" class="feature-sub" data-astro-cid-tj3dqhhm>Business &amp; Profitability</text></g><!-- Feature 2: Reconcile --><g transform="translate(50, 250)" data-astro-cid-tj3dqhhm><rect width="40" height="40" rx="10" fill="none" stroke="#2563eb" stroke-width="2" data-astro-cid-tj3dqhhm></rect><path d="M 20 12 L 28 16 L 28 24 C 28 29 20 32 20 32 C 20 32 12 29 12 24 L 12 16 Z" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-tj3dqhhm></path><text x="56" y="20" class="feature-title" data-astro-cid-tj3dqhhm>Reconcile</text><text x="56" y="36" class="feature-sub" data-astro-cid-tj3dqhhm>Payments &amp; Settlements</text></g><!-- Feature 3: Account --><g transform="translate(50, 350)" data-astro-cid-tj3dqhhm><rect width="40" height="40" rx="10" fill="none" stroke="#2563eb" stroke-width="2" data-astro-cid-tj3dqhhm></rect><path d="M 15 14 H 25 M 15 20 H 25 M 15 26 H 21" stroke="#2563eb" stroke-width="2" stroke-linecap="round" data-astro-cid-tj3dqhhm></path><text x="56" y="20" class="feature-title" data-astro-cid-tj3dqhhm>Account</text><text x="56" y="36" class="feature-sub" data-astro-cid-tj3dqhhm>In-depth Accounting</text></g></g><!-- RIGHT CARD: Your ERP --><g transform="translate(850, 80)" data-astro-cid-tj3dqhhm><rect width="210" height="380" rx="28" fill="#ffffff" filter="url(#card-shadow)" data-astro-cid-tj3dqhhm></rect><text x="105" y="60" text-anchor="middle" class="title-main" data-astro-cid-tj3dqhhm>Your ERP</text><!-- Tally Logo --><g transform="translate(45, 110)" data-astro-cid-tj3dqhhm><text x="60" y="30" text-anchor="middle" class="brand-text tally-text" data-astro-cid-tj3dqhhm>Tally</text></g><!-- SAP Logo --><g transform="translate(55, 190)" data-astro-cid-tj3dqhhm><rect width="90" height="40" fill="#008fd3" rx="4" data-astro-cid-tj3dqhhm></rect><text x="45" y="26" text-anchor="middle" class="sap-text" data-astro-cid-tj3dqhhm>SAP</text></g><!-- Zoho / Custom Logo --><g transform="translate(45, 270)" data-astro-cid-tj3dqhhm><g transform="translate(15, 0)" data-astro-cid-tj3dqhhm><rect x="0" y="0" width="22" height="22" rx="4" fill="#e52e2d" data-astro-cid-tj3dqhhm></rect><rect x="25" y="0" width="22" height="22" rx="4" fill="#22a06b" data-astro-cid-tj3dqhhm></rect><rect x="50" y="0" width="22" height="22" rx="4" fill="#009adf" data-astro-cid-tj3dqhhm></rect><rect x="75" y="0" width="22" height="22" rx="4" fill="#e58a00" data-astro-cid-tj3dqhhm></rect></g></g><!-- + More Footer --><text x="50" y="340" class="more-text" data-astro-cid-tj3dqhhm>+ More</text></g><!-- CONVERGING LEFT CONNECTORS (Flowing inwards) --><g class="connector-group" data-astro-cid-tj3dqhhm>${leftLevels.map((y) => {
		const pathData = `M 250 ${y} C 330 ${y}, 340 ${centerHubY}, 410 ${centerHubY}`;
		return renderTemplate`<g data-astro-cid-tj3dqhhm><path${addAttribute(pathData, "d")} class="line-back" data-astro-cid-tj3dqhhm></path><path${addAttribute(pathData, "d")} class="line-pulse" data-astro-cid-tj3dqhhm></path><circle cx="250"${addAttribute(y, "cy")} r="3.5" fill="#3b82f6" data-astro-cid-tj3dqhhm></circle></g>`;
	})}<!-- Dynamic dots along connectors --><circle cx="310" cy="185" r="3" fill="#3b82f6" opacity="0.8" data-astro-cid-tj3dqhhm></circle><circle cx="340" cy="235" r="3.5" fill="#2563eb" data-astro-cid-tj3dqhhm></circle><circle cx="370" cy="305" r="3" fill="#3b82f6" opacity="0.8" data-astro-cid-tj3dqhhm></circle></g><!-- DIVERGING RIGHT CONNECTORS (Flowing outwards) --><g class="connector-group" data-astro-cid-tj3dqhhm>${[
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
			color: "#3b82f6",
			path: "M0 20 Q 25 18, 50 12 T 75 10 T 100 4"
		},
		{
			label: "Net Profit",
			value: "₹ 18.7 L",
			change: "↑ 24.3%",
			color: "#2563eb",
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
			color: "#a855f7",
			path: "M0 22 Q 25 16, 50 18 T 75 10 T 100 6"
		}
	].map((metric) => renderTemplate`<div class="metric-card"><span class="metric-header">${metric.label}</span><div class="metric-body"><span class="metric-value">${metric.value}</span><span class="metric-trend">${metric.change}</span></div><svg class="metric-sparkline" viewBox="0 0 100 24" preserveAspectRatio="none" style="width: 100%; height: 28px;"><path${addAttribute(metric.path, "d")} fill="none"${addAttribute(metric.color, "stroke")} stroke-width="1.5"></path></svg></div>`)}</section><div class="dash-charts-grid"><section class="chart-card"><h2 class="chart-title">Payment Reconciliation</h2><p class="chart-subtitle">April 2025</p><div class="donut-container"><div class="donut-wrapper"><svg width="64" height="64" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" stroke-width="5.5"></circle><circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" stroke-width="5.5" stroke-dasharray="91.5 8.5" stroke-dashoffset="25"></circle><circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" stroke-width="5.5" stroke-dasharray="3.3 96.7" stroke-dashoffset="33.5"></circle><circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" stroke-width="5.5" stroke-dasharray="3.1 96.9" stroke-dashoffset="30.2"></circle></svg><div class="donut-center-text"><div class="donut-value">₹ 1.26 Cr</div><div class="donut-caption">Total Payout</div></div></div><div class="legend-list"><div class="legend-item"><span class="legend-dot" style="background: #2563eb;"></span><span>Matched</span><strong class="legend-value">₹ 1.18 Cr (93.6%)</strong></div><div class="legend-item"><span class="legend-dot" style="background: #f59e0b;"></span><span>Partial</span><strong class="legend-value">₹ 4.2 L (3.3%)</strong></div><div class="legend-item"><span class="legend-dot" style="background: #ef4444;"></span><span>Mismatched</span><strong class="legend-value">₹ 3.8 L (3.1%)</strong></div></div></div><a href="#" class="chart-action">View Reconciliation${renderComponent($$result, "ArrowRight", ArrowRight, { "size": 10 })}</a></section><section class="chart-card"><h2 class="chart-title">Top Marketplaces by Profit</h2><p class="chart-subtitle">April 2025</p><div class="table-header"><span>Net Profit</span><span>Margin</span></div><div class="mp-list">${[
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
	return renderTemplate`${maybeRenderHead($$result)}<section class="hero-section" id="hero"><div class="hero-container"><div class="hero-grid"><!-- Left Column: Copy & CTAs --><div class="hero-copy"><div class="hero-badge-pill"><span class="pill-dot" aria-hidden="true"></span>Your Accounting Layer for Ecommerce</div><h1 class="hero-main-title">Your accounting<br>layer for ecommerce<span class="dot-blue">.</span></h1><p class="hero-lead-text">Connect your marketplaces, understand your business, reconcile your payments and automatically account every transaction in your ERP.</p><div class="hero-action-group"><a href="/contact" class="btn-blue">Book a Demo${renderComponent($$result, "ArrowRight", ArrowRight, {
		"size": 16,
		"aria-hidden": "true"
	})}</a><a href="#how-it-works" class="btn-outline-play"><span class="play-icon-bubble" aria-hidden="true">${renderComponent($$result, "Play", Play, {
		"size": 10,
		"fill": "#0f172a"
	})}</span>See How It Works</a></div><div class="hero-trust-bar"><div class="trust-check-icon" aria-hidden="true">${renderComponent($$result, "Check", Check, {
		"size": 12,
		"strokeWidth": 3
	})}</div><span>Trusted by 1000+ ecommerce businesses</span></div><div class="hero-brand-section"><p>Loved by finance teams across India</p><div class="brand-logo-grid">${[
		{
			name: "boAt",
			style: "font-weight: 800; font-size: 1.1rem; color: #0f172a;",
			html: "bo<span style=\"color: #ef4444;\">A</span>t"
		},
		{
			name: "SAMPATTI GROUP",
			style: "font-weight: 700; font-size: 0.8rem; letter-spacing: 0.05em; color: #334155; line-height: 1.1;",
			html: "SAMPATTI<br/><small style=\"font-size: 0.55rem; letter-spacing: 0.1em;\">GROUP</small>"
		},
		{
			name: "AGARO",
			style: "font-weight: 800; font-size: 0.95rem; letter-spacing: 0.1em; color: #0f172a;"
		},
		{
			name: "VAHDAM INDIA",
			style: "font-weight: 700; font-size: 0.8rem; letter-spacing: 0.05em; color: #15803d; line-height: 1.1;",
			html: "VAHDAM<br/><small style=\"font-size: 0.55rem; color: #475569;\">INDIA</small>"
		}
	].map((brand) => renderTemplate`<span${addAttribute(brand.style, "style")}>${brand.html ? renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`${unescapeHTML(brand.html)}` })}` : brand.name}</span>`)}</div></div></div><!-- Right Column: Visual Component Overlay --><div class="hero-visual-wrapper">${renderComponent($$result, "HeroDiagram", $$HeroDiagram, {})}${renderComponent($$result, "HeroDashboard", $$HeroDashboard, {})}</div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Hero.astro", void 0);
//#endregion
//#region src/components/landing/sections/MarketplaceMarquee.astro
var $$MarketplaceMarquee = createComponent(($$result, $$props, $$slots) => {
	const row = [
		{
			label: "Amazon",
			icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM5 10l2 2 5-6"
		},
		{
			label: "Flipkart",
			icon: "M3 5h14v14H3zM7 9h6M7 13h4"
		},
		{
			label: "Shopify",
			icon: "M12 2 3 6v12l9 4 9-4V6zM7 9h2l1-2h3l1 2h3"
		},
		{
			label: "Meesho",
			icon: "M12 3 5 8v8l7 5 7-5V8z"
		},
		{
			label: "Myntra",
			icon: "M5 3l2 18h10L19 3M8 7h8"
		},
		{
			label: "Nykaa",
			icon: "M12 3 5 8v8l7 5 7-5V8zM12 3v20"
		},
		{
			label: "JioMart",
			icon: "M3 5h18v14H3zM3 9h18M9 9v10"
		},
		{
			label: "Tally",
			icon: "M3 4h18v16H3zM7 8h10M7 12h10M7 16h6"
		},
		{
			label: "SAP",
			icon: "M4 5h16v14H4zM8 8h8M8 12h8M8 16h8"
		},
		{
			label: "Zoho",
			icon: "M3 6h18M3 12h18M3 18h12"
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<section class="marquee-band" aria-label="DeepEcom connects to marketplaces and ERPs"><div class="marquee-inner"><p class="marquee-label">Connects the marketplaces you sell on to the ERP you close in</p><div class="marquee-track"><div class="marquee-row">${row.map((r) => renderTemplate`<span class="marquee-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path${addAttribute(r.icon, "d")}></path></svg>${r.label}</span>`)}${row.map((r) => renderTemplate`<span class="marquee-item" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path${addAttribute(r.icon, "d")}></path></svg>${r.label}</span>`)}</div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/MarketplaceMarquee.astro", void 0);
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
//#region src/components/landing/sections/FlowDiagram.astro
var $$FlowDiagram = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="relative overflow-hidden bg-white py-20 md:py-32" id="how"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><!-- Header Section --><!-- <div class="mx-auto max-w-3xl text-center">
      <span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/20">
        How it works
      </span>
      <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
        From marketplace payout <br class="hidden sm:block" /> to your books.
      </h2>
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
        DeepEcom collects raw settlements and orders from every channel, reconciles them in one engine, and delivers GST-ready vouchers straight into your ERP.
      </p>
    </div> --><!-- Diagram Section --><div class="relative mx-auto mt-20 max-w-6xl md:mt-24"><!-- Decorative Glow Behind the Card --><div class="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl md:-inset-4 md:opacity-30"></div><!-- Diagram Card --><div class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-2xl shadow-blue-900/5 sm:p-4 md:p-8"><!-- ==================== DESKTOP SVG ==================== --><div class="hidden overflow-x-auto md:block"><svg viewBox="0 0 1120 480" class="h-auto w-full min-w-[700px]" role="img" aria-label="Diagram: settlements flow live from Amazon, Flipkart, Meesho and Shopify into the DeepEcom AI reconciliation engine, which outputs GST-ready vouchers to Tally Prime, Zoho Books and SAP"><defs><pattern id="dotgrid" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1.1" fill="#e5e7eb"></circle></pattern><linearGradient id="coreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"></stop><stop offset="100%" stop-color="#eff6ff"></stop></linearGradient><radialGradient id="logoGrad" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#60a5fa"></stop><stop offset="100%" stop-color="#1d4ed8"></stop></radialGradient><filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.06"></feDropShadow></filter><filter id="softer" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.08"></feDropShadow></filter><!-- UPDATED DESKTOP ARROW MARKER --><marker id="arrw" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 1 1 L 11 6 L 1 11 L 3.5 6 z" fill="#9ca3af" stroke="#9ca3af" stroke-width="1" stroke-linejoin="round"></path></marker></defs><!-- Background Grid --><rect x="10" y="10" width="1100" height="460" rx="24" fill="url(#dotgrid)"></rect><!-- Category Pills --><g fill="#ffffff" stroke="#e5e7eb" filter="url(#soft)" font-family="system-ui, sans-serif" font-size="11px" font-weight="700" letter-spacing="0.1em" fill-opacity="1" text-anchor="middle"><rect x="84" y="32" width="118" height="26" rx="13"></rect><text x="143" y="49" fill="#6b7280" stroke="none">MARKETPLACES</text><rect x="480" y="32" width="160" height="26" rx="13"></rect><text x="560" y="49" fill="#6b7280" stroke="none">DEEPECOM ENGINE</text><rect x="929" y="32" width="96" height="26" rx="13"></rect><text x="977" y="49" fill="#6b7280" stroke="none">YOUR ERP</text></g><!-- Flow Paths --><g fill="none" stroke="#e5e7eb" stroke-width="2" marker-end="url(#arrw)"><path id="plA" d="M238,96 C330,96 352,196 445,196"></path><path id="plB" d="M238,176 C338,176 358,219 445,219"></path><path id="plC" d="M238,256 C338,256 358,242 445,242"></path><path id="plD" d="M238,336 C330,336 352,265 445,265"></path><path id="prA" d="M675,200 C770,200 786,130 882,130"></path><path id="prB" d="M675,230 C782,230 792,235 882,235"></path><path id="prC" d="M675,260 C770,260 786,340 882,340"></path></g><g fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6"><path d="M238,96 C330,96 352,196 443,196"></path><path d="M238,176 C338,176 358,219 443,219"></path><path d="M238,256 C338,256 358,242 443,242"></path><path d="M238,336 C330,336 352,265 443,265"></path><path d="M675,200 C770,200 786,130 880,130"></path><path d="M675,230 C782,230 792,235 880,235"></path><path d="M675,260 C770,260 786,340 880,340"></path></g><!-- Animated Dots --><g fill="#3b82f6"><circle r="3.5"><animateMotion dur="3s" begin="0s" repeatCount="indefinite"><mpath href="#plA"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="0.75s" repeatCount="indefinite"><mpath href="#plB"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="1.5s" repeatCount="indefinite"><mpath href="#plC"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="2.25s" repeatCount="indefinite"><mpath href="#plD"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="0.4s" repeatCount="indefinite"><mpath href="#prA"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="1.4s" repeatCount="indefinite"><mpath href="#prB"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="2.4s" repeatCount="indefinite"><mpath href="#prC"></mpath></animateMotion></circle></g><!-- Connection Points --><g fill="#d1d5db"><circle cx="238" cy="96" r="3.5"></circle><circle cx="238" cy="176" r="3.5"></circle><circle cx="238" cy="256" r="3.5"></circle><circle cx="238" cy="336" r="3.5"></circle></g><g fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"><circle cx="445" cy="196" r="4.5"></circle><circle cx="445" cy="219" r="4.5"></circle><circle cx="445" cy="242" r="4.5"></circle><circle cx="445" cy="265" r="4.5"></circle><circle cx="675" cy="200" r="4.5"></circle><circle cx="675" cy="230" r="4.5"></circle><circle cx="675" cy="260" r="4.5"></circle></g><g fill="#dcfce7" stroke="#34d399" stroke-width="1.5"><circle cx="882" cy="130" r="4.5"></circle><circle cx="882" cy="235" r="4.5"></circle><circle cx="882" cy="340" r="4.5"></circle></g><!-- LEFT NODES (Marketplaces) --><g font-family="system-ui, sans-serif"><!-- Node 1: Amazon --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="48" y="69" width="190" height="54" rx="14"></rect></g><rect x="62" y="82" width="28" height="28" rx="8" fill="#fef3c7"></rect><text x="76" y="101" text-anchor="middle" font-size="11px" font-weight="800" fill="#b45309">Az</text><text x="102" y="94" font-size="14px" font-weight="600" fill="#111827">Amazon</text><text x="102" y="110" font-size="12px" fill="#6b7280">Synced 2 min ago</text><circle cx="223" cy="84" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="223" cy="84" r="3.5" fill="#22c55e"></circle><!-- Node 2: Flipkart --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="48" y="149" width="190" height="54" rx="14"></rect></g><rect x="62" y="162" width="28" height="28" rx="8" fill="#dbeafe"></rect><text x="76" y="181" text-anchor="middle" font-size="11px" font-weight="800" fill="#1d4ed8">Fk</text><text x="102" y="174" font-size="14px" font-weight="600" fill="#111827">Flipkart</text><text x="102" y="190" font-size="12px" fill="#6b7280">Synced 9 min ago</text><circle cx="223" cy="164" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="223" cy="164" r="3.5" fill="#22c55e"></circle><!-- Node 3: Meesho --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="48" y="229" width="190" height="54" rx="14"></rect></g><rect x="62" y="242" width="28" height="28" rx="8" fill="#fce7f3"></rect><text x="76" y="261" text-anchor="middle" font-size="11px" font-weight="800" fill="#be185d">Me</text><text x="102" y="254" font-size="14px" font-weight="600" fill="#111827">Meesho</text><text x="102" y="270" font-size="12px" fill="#6b7280">Payout pending</text><circle cx="223" cy="244" r="7" fill="#f59e0b" opacity="0.16"></circle><circle cx="223" cy="244" r="3.5" fill="#f59e0b"></circle><!-- Node 4: Shopify --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="48" y="309" width="190" height="54" rx="14"></rect></g><rect x="62" y="322" width="28" height="28" rx="8" fill="#dcfce7"></rect><text x="76" y="341" text-anchor="middle" font-size="11px" font-weight="800" fill="#15803d">Sy</text><text x="102" y="334" font-size="14px" font-weight="600" fill="#111827">Shopify</text><text x="102" y="350" font-size="12px" fill="#6b7280">Synced 1 hr ago</text><circle cx="223" cy="324" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="223" cy="324" r="3.5" fill="#22c55e"></circle></g><!-- CENTER ENGINE --><g font-family="system-ui, sans-serif"><rect x="445" y="140" width="230" height="180" rx="20" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.3"></rect><rect x="445" y="140" width="230" height="180" rx="20" fill="url(#coreGrad)" stroke="#bfdbfe" stroke-width="1.5" filter="url(#softer)"></rect><!-- Spinning Aura --><circle cx="560" cy="188" r="31" fill="none" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="4 6"><animateTransform attributeName="transform" type="rotate" from="0 560 188" to="360 560 188" dur="14s" repeatCount="indefinite"></animateTransform></circle><circle cx="560" cy="188" r="23" fill="url(#logoGrad)"></circle><!-- Engine Icon Inside Center --><g transform="translate(547,175)"><rect x="3" y="13" width="4.5" height="8" rx="1.5" fill="#ffffff"></rect><rect x="9.75" y="8" width="4.5" height="13" rx="1.5" fill="#ffffff"></rect><rect x="16.5" y="3" width="4.5" height="18" rx="1.5" fill="#ffffff"></rect></g><text x="560" y="250" text-anchor="middle" font-size="20px" font-weight="700" fill="#111827">DeepEcom</text><text x="560" y="269" text-anchor="middle" font-size="13px" font-weight="500" fill="#6b7280">AI reconciliation engine</text><!-- Chips inside center --><rect x="455" y="280" width="54" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe"></rect><text x="482" y="295" text-anchor="middle" font-size="9px" font-weight="700" letter-spacing="0.05em" fill="#2563eb">MATCH</text><rect x="517" y="280" width="80" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe"></rect><text x="557" y="295" text-anchor="middle" font-size="9px" font-weight="700" letter-spacing="0.05em" fill="#2563eb">CATEGORIZE</text><rect x="605" y="280" width="62" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe"></rect><text x="636" y="295" text-anchor="middle" font-size="9px" font-weight="700" letter-spacing="0.05em" fill="#2563eb">VALIDATE</text><!-- Status Box --><g filter="url(#soft)"><rect x="598" y="308" width="142" height="32" rx="16" fill="#ffffff" stroke="#e5e7eb"></rect></g><circle cx="616" cy="324" r="4.5" fill="#10b981"><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"></animate></circle><text x="630" y="328" font-size="12px" font-weight="600" fill="#1f2937">98.6% auto-match</text></g><!-- RIGHT NODES (ERPs) --><g font-family="system-ui, sans-serif"><!-- Node 1: Tally Prime --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="882" y="103" width="190" height="54" rx="14"></rect></g><rect x="896" y="116" width="28" height="28" rx="8" fill="#eff6ff"></rect><text x="910" y="135" text-anchor="middle" font-size="11px" font-weight="800" fill="#1d4ed8">Tp</text><text x="936" y="128" font-size="14px" font-weight="600" fill="#111827">Tally Prime</text><text x="936" y="144" font-size="12px" fill="#6b7280">214 vouchers synced</text><circle cx="1057" cy="118" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="1057" cy="118" r="3.5" fill="#22c55e"></circle><!-- Node 2: Zoho Books --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="882" y="208" width="190" height="54" rx="14"></rect></g><rect x="896" y="221" width="28" height="28" rx="8" fill="#eff6ff"></rect><text x="910" y="240" text-anchor="middle" font-size="11px" font-weight="800" fill="#1d4ed8">Zb</text><text x="936" y="233" font-size="14px" font-weight="600" fill="#111827">Zoho Books</text><text x="936" y="249" font-size="12px" fill="#6b7280">Ledger · just now</text><circle cx="1057" cy="223" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="1057" cy="223" r="3.5" fill="#22c55e"></circle><!-- Node 3: SAP --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="882" y="313" width="190" height="54" rx="14"></rect></g><rect x="896" y="326" width="28" height="28" rx="8" fill="#eff6ff"></rect><text x="910" y="345" text-anchor="middle" font-size="11px" font-weight="800" fill="#1d4ed8">Se</text><text x="936" y="338" font-size="14px" font-weight="600" fill="#111827">SAP</text><text x="936" y="354" font-size="12px" fill="#6b7280">Synced · 12m ago</text><circle cx="1057" cy="328" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="1057" cy="328" r="3.5" fill="#22c55e"></circle></g><!-- Bottom Labels --><g font-family="system-ui, sans-serif" font-size="12px" font-weight="500" fill="#9ca3af"><text x="143" y="430" text-anchor="middle">Raw settlements · orders · returns</text><circle cx="497" cy="426" r="3.5" fill="#3b82f6" opacity="0.85"></circle><text x="510" y="430">Live data flow · updated every cycle</text><text x="977" y="430" text-anchor="middle">GST-ready vouchers &amp; ledgers</text></g></svg></div><!-- ==================== MOBILE SVG ==================== --><div class="block md:hidden"><svg viewBox="0 0 380 600" class="h-auto w-full" role="img" aria-label="Mobile diagram: settlements flow from marketplaces into the DeepEcom engine, which outputs vouchers to ERPs"><defs><pattern id="mgrid" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1.1" fill="#e5e7eb"></circle></pattern><linearGradient id="mCoreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"></stop><stop offset="100%" stop-color="#eff6ff"></stop></linearGradient><radialGradient id="mLogoGrad" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#60a5fa"></stop><stop offset="100%" stop-color="#1d4ed8"></stop></radialGradient><filter id="mSoft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.06"></feDropShadow></filter><!-- UPDATED MOBILE ARROW MARKER --><marker id="mArrw" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 1 1 L 11 6 L 1 11 L 3.5 6 z" fill="#9ca3af" stroke="#9ca3af" stroke-width="1" stroke-linejoin="round"></path></marker></defs><!-- Background Grid --><rect x="8" y="8" width="364" height="584" rx="20" fill="url(#mgrid)"></rect><!-- Pill top --><rect x="131" y="16" width="118" height="24" rx="12" fill="#ffffff" stroke="#e5e7eb"></rect><text x="190" y="32" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10px" font-weight="700" letter-spacing="0.1em" fill="#6b7280">MARKETPLACES</text><!-- Top Nodes (Marketplaces) --><g font-family="system-ui, sans-serif"><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="48" width="162" height="46" rx="12"></rect></g><rect x="32" y="58" width="26" height="26" rx="8" fill="#fef3c7"></rect><text x="45" y="76" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#b45309">Az</text><text x="68" y="76" font-size="13px" font-weight="600" fill="#111827">Amazon</text><circle cx="344" cy="71" r="6.5" fill="#22c55e" opacity="0.15"></circle><circle cx="344" cy="71" r="3.2" fill="#22c55e"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="198" y="48" width="162" height="46" rx="12"></rect></g><rect x="210" y="58" width="26" height="26" rx="8" fill="#dbeafe"></rect><text x="223" y="76" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#1d4ed8">Fk</text><text x="246" y="76" font-size="13px" font-weight="600" fill="#111827">Flipkart</text><circle cx="344" cy="71" r="6.5" fill="#22c55e" opacity="0.15"></circle><circle cx="344" cy="71" r="3.2" fill="#22c55e"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="102" width="162" height="46" rx="12"></rect></g><rect x="32" y="112" width="26" height="26" rx="8" fill="#fce7f3"></rect><text x="45" y="130" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#be185d">Me</text><text x="68" y="130" font-size="13px" font-weight="600" fill="#111827">Meesho</text><circle cx="344" cy="125" r="6.5" fill="#f59e0b" opacity="0.16"></circle><circle cx="344" cy="125" r="3.2" fill="#f59e0b"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="198" y="102" width="162" height="46" rx="12"></rect></g><rect x="210" y="112" width="26" height="26" rx="8" fill="#dcfce7"></rect><text x="223" y="130" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#15803d">Sy</text><text x="246" y="130" font-size="13px" font-weight="600" fill="#111827">Shopify</text><circle cx="344" cy="125" r="6.5" fill="#22c55e" opacity="0.15"></circle><circle cx="344" cy="125" r="3.2" fill="#22c55e"></circle></g><!-- Flow Paths to Center --><g fill="none" stroke="#e5e7eb" stroke-width="2"><path id="mmA" d="M101,94 C101,118 190,126 190,164"></path><path id="mmB" d="M279,94 C279,118 190,126 190,164"></path><path id="mmC" d="M101,148 C101,158 160,152 188,163"></path><path id="mmD" d="M279,148 C279,158 220,152 192,163"></path></g><g fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6"><path d="M101,94 C101,118 190,126 189,163"></path><path d="M279,94 C279,118 190,126 191,163"></path><path d="M101,148 C101,158 160,152 187,162"></path><path d="M279,148 C279,158 220,152 193,162"></path></g><g fill="#3b82f6"><circle r="3"><animateMotion dur="2.5s" begin="0s" repeatCount="indefinite"><mpath href="#mmA"></mpath></animateMotion></circle><circle r="3"><animateMotion dur="2.5s" begin="0.6s" repeatCount="indefinite"><mpath href="#mmB"></mpath></animateMotion></circle><circle r="3"><animateMotion dur="2.5s" begin="1.2s" repeatCount="indefinite"><mpath href="#mmC"></mpath></animateMotion></circle><circle r="3"><animateMotion dur="2.5s" begin="1.8s" repeatCount="indefinite"><mpath href="#mmD"></mpath></animateMotion></circle></g><circle cx="190" cy="168" r="4" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"></circle><g fill="none"><path id="mt1" stroke="#e5e7eb" stroke-width="2" d="M190,172 L190,204" marker-end="url(#mArrw)"></path><path stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6" d="M190,172 L190,202"></path></g><circle r="3" fill="#3b82f6"><animateMotion dur="1.5s" begin="0.3s" repeatCount="indefinite"><mpath href="#mt1"></mpath></animateMotion></circle><!-- Center Core --><g font-family="system-ui, sans-serif"><rect x="60" y="210" width="260" height="118" rx="18" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.3"></rect><rect x="60" y="210" width="260" height="118" rx="18" fill="url(#mCoreGrad)" stroke="#bfdbfe" stroke-width="1.5" filter="url(#mSoft)"></rect><circle cx="190" cy="248" r="23" fill="none" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="3 5"><animateTransform attributeName="transform" type="rotate" from="0 190 248" to="360 190 248" dur="12s" repeatCount="indefinite"></animateTransform></circle><circle cx="190" cy="248" r="17" fill="url(#mLogoGrad)"></circle><g transform="translate(181.3,239.3) scale(0.72)"><rect x="3" y="13" width="4.5" height="8" rx="1.5" fill="#ffffff"></rect><rect x="9.75" y="8" width="4.5" height="13" rx="1.5" fill="#ffffff"></rect><rect x="16.5" y="3" width="4.5" height="18" rx="1.5" fill="#ffffff"></rect></g><text x="190" y="292" text-anchor="middle" font-size="16px" font-weight="700" fill="#111827">DeepEcom</text><text x="190" y="307" text-anchor="middle" font-size="12px" font-weight="500" fill="#6b7280">AI reconciliation engine</text><text x="190" y="321" text-anchor="middle" font-size="9px" font-weight="700" letter-spacing="0.05em" fill="#2563eb">MATCH · CATEGORIZE · VALIDATE</text></g><!-- Bottom Flow Paths --><circle cx="190" cy="328" r="4" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"></circle><g fill="none"><path id="mt2" stroke="#e5e7eb" stroke-width="2" d="M190,336 L190,372" marker-end="url(#mArrw)"></path><path stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6" d="M190,336 L190,370"></path></g><circle r="3" fill="#3b82f6"><animateMotion dur="1.5s" begin="0.8s" repeatCount="indefinite"><mpath href="#mt2"></mpath></animateMotion></circle><!-- Pill Bottom --><rect x="147" y="380" width="86" height="24" rx="12" fill="#ffffff" stroke="#e5e7eb"></rect><text x="190" y="396" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10px" font-weight="700" letter-spacing="0.1em" fill="#6b7280">YOUR ERP</text><!-- Bottom Nodes (ERPs) --><g font-family="system-ui, sans-serif"><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="412" width="340" height="44" rx="12"></rect></g><rect x="32" y="421" width="26" height="26" rx="8" fill="#eff6ff"></rect><text x="45" y="439" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#1d4ed8">Tp</text><text x="68" y="439" font-size="13px" font-weight="600" fill="#111827">Tally Prime</text><text x="150" y="439" font-size="11px" fill="#6b7280">214 vouchers synced</text><circle cx="344" cy="434" r="3.2" fill="#22c55e"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="464" width="340" height="44" rx="12"></rect></g><rect x="32" y="473" width="26" height="26" rx="8" fill="#eff6ff"></rect><text x="45" y="491" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#1d4ed8">Zb</text><text x="68" y="491" font-size="13px" font-weight="600" fill="#111827">Zoho Books</text><text x="150" y="491" font-size="11px" fill="#6b7280">Ledger · just now</text><circle cx="344" cy="486" r="3.2" fill="#22c55e"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="516" width="340" height="44" rx="12"></rect></g><rect x="32" y="525" width="26" height="26" rx="8" fill="#eff6ff"></rect><text x="45" y="543" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#1d4ed8">Se</text><text x="68" y="543" font-size="13px" font-weight="600" fill="#111827">SAP</text><text x="150" y="543" font-size="11px" fill="#6b7280">Synced · 12m ago</text><circle cx="344" cy="538" r="3.2" fill="#22c55e"></circle></g><!-- Bottom Note --><text x="190" y="584" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11px" font-weight="500" fill="#9ca3af">Live data flow · updated every cycle</text></svg></div></div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/FlowDiagram.astro", void 0);
//#endregion
//#region src/components/landing/sections/DeepEcomLayer.astro
var $$DeepEcomLayer = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="layer" id="layer"><div class="layer-inner"><div class="layer-head reveal"><span class="layer-eyebrow">The DeepEcom layer</span><h2 class="layer-title w-full">One layer between your ecommerce business and your books.</h2><p class="layer-lead">DeepEcom sits between the marketplaces you sell on and the ERP you close your books in — turning raw ecommerce activity into intelligence, reconciliation and accounting.</p></div><div class="layer-flow">${renderComponent($$result, "FlowDiagram", $$FlowDiagram, {})}</div></div></section>`;
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
	})}Last 8 months</span></div><div class="relative px-2.5 pt-3 pb-1.5"><div class="pointer-events-none absolute top-[4%] right-[3.5%] rounded-lg bg-ink px-3 py-2 text-left leading-tight shadow-md"><div class="text-[10.5px] font-semibold tracking-wide text-zinc-400 uppercase">Aug 2026</div><div class="num text-sm font-bold">₹24.8L</div><div class="text-[11px] font-medium text-emerald-300">▲ 14.3% MoM</div></div><svg viewBox="0 0 720 264" fill="none" class="h-auto w-full" aria-hidden="true"><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#533afd" stop-opacity="0.14"></stop><stop offset="100%" stop-color="#533afd" stop-opacity="0"></stop></linearGradient></defs><g stroke="#eeeef2"><line x1="64" y1="232" x2="704" y2="232"></line><line x1="64" y1="180" x2="704" y2="180"></line><line x1="64" y1="128" x2="704" y2="128"></line><line x1="64" y1="76" x2="704" y2="76"></line><line x1="64" y1="24" x2="704" y2="24"></line></g><g fill="#8b8b94" font-family="Inter, sans-serif" font-size="10.5"><text x="54" y="236" text-anchor="end">₹0</text><text x="54" y="184" text-anchor="end">₹7L</text><text x="54" y="132" text-anchor="end">₹14L</text><text x="54" y="80" text-anchor="end">₹21L</text><text x="54" y="28" text-anchor="end">₹28L</text><text x="72" y="256" text-anchor="middle">Jan</text><text x="160" y="256" text-anchor="middle">Feb</text><text x="248" y="256" text-anchor="middle">Mar</text><text x="336" y="256" text-anchor="middle">Apr</text><text x="424" y="256" text-anchor="middle">May</text><text x="512" y="256" text-anchor="middle">Jun</text><text x="600" y="256" text-anchor="middle">Jul</text><text x="688" y="256" text-anchor="middle" fill="#18181b" font-weight="600">Aug</text></g><path${addAttribute("M72,159 C112,159 120,151 160,151 C200,151 208,156 248,156 C288,156 296,140 336,140 C376,140 384,135 424,135 C464,135 472,119 512,119 C552,119 560,99 600,99 C640,99 648,79 688,79", "d")} stroke="#d4d4d8" stroke-width="1.75" stroke-dasharray="4 4" stroke-linecap="round"></path><path${addAttribute(`${line} L688,232 L72,232 Z`, "d")} fill="url(#areaFill)"></path><path${addAttribute(line, "d")} stroke="#533afd" stroke-width="2.25" stroke-linecap="round"></path><line x1="688" y1="48" x2="688" y2="232" stroke="#c7d2fe" stroke-dasharray="3 3"></line><circle cx="688" cy="48" r="8" fill="#533afd" fill-opacity="0.14"></circle><circle cx="688" cy="48" r="4" fill="#533afd" stroke="#fff" stroke-width="2"></circle></svg></div></div><!-- settlements feed --><aside class="hidden overflow-hidden rounded-xl border border-border bg-white xl:flex xl:flex-col"><div class="flex items-center gap-2.5 border-b border-border px-4 py-3"><span class="text-sm font-bold tracking-tight text-ink">Latest settlements</span><span class="live-dot ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-emerald-700 uppercase"><i class="size-[7px] rounded-full bg-emerald-600"></i>Live</span></div><div class="flex-1 divide-y divide-subtle">${feed.map((f) => renderTemplate`<div class="flex items-center gap-3 px-4 py-2.5"><span class="grid size-8.5 shrink-0 place-items-center rounded-[9px] border border-border bg-subtle text-xs font-bold text-muted-foreground">${f.init}</span><div class="min-w-0"><div class="truncate text-[13.5px] font-semibold text-ink">${f.name}</div><div class="text-[11.5px] text-zinc-400">${f.time}</div></div><div class="ml-auto text-right"><div class="num text-[13.5px] font-bold tracking-tight text-ink">${f.amt}</div>${renderComponent($$result, "Badge", Badge, {
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
//#region src/components/landing/LineGrid.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$LineGrid = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LineGrid;
	const { size = "clamp(7rem, 11vw, 11rem)", vertical = false, horizontal = false, side = false, style, class: className } = Astro.props;
	const both = !vertical && !horizontal && !side;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute([
		"boundary-lines",
		(both || vertical) && "v",
		(both || horizontal) && "h",
		className
	], "class:list")} aria-hidden="true"${addAttribute(`--grid-size:${size}${style ? `;${style}` : ""}`, "style")}>${side && renderTemplate`<span class="side-line side-line--l"></span>`}${side && renderTemplate`<span class="side-line side-line--r"></span>`}</div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/LineGrid.astro", void 0);
//#endregion
//#region src/components/landing/sections/BackboneBand.astro
var $$BackboneBand = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="backbone" aria-label="DeepEcom by the numbers">${renderComponent($$result, "LineGrid", $$LineGrid, {
		"size": "clamp(7rem, 11vw, 11rem)",
		"side": true,
		"style": "--side-inset: calc(50% - min(var(--container-content), 100%) / 2 + var(--space-gutter))"
	})}<div class="backbone-inner"><p class="backbone-eyebrow">The accounting layer</p><h2 class="backbone-title">One layer between your marketplaces and your books.</h2><p class="backbone-lead">DeepEcom turns raw marketplace activity into intelligence, reconciliation and complete ERP accounting.</p><div class="backbone-grid">${[
		{
			value: "2",
			label: "Core products"
		},
		{
			value: "3",
			label: "ERPs supported"
		},
		{
			value: "11",
			label: "Accounting stages, order to ERP"
		},
		{
			value: "100%",
			label: "Order-level, line-by-line"
		}
	].map((s) => renderTemplate`<div class="backbone-stat"><span class="v">${s.value}</span><span class="k">${s.label}</span></div>`)}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/BackboneBand.astro", void 0);
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
	})}<div class="int-flow-container reveal" role="img" aria-label="Data flow integration diagram from Marketplaces to DeepEcom to ERPs"><!-- Input Node --><div class="int-card"><div class="int-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></div><span class="c-title">Marketplaces</span><div class="c-items"><span class="pill">Amazon</span><span class="pill">Flipkart</span><span class="pill">Shopify</span></div></div><!-- Connector 1 --><div class="int-connector" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg></div><!-- Central Engine Node --><div class="int-card is-core"><div class="int-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg></div><span class="c-title">DeepEcom</span><div class="c-items"><span class="pill">Intelligence</span><span class="pill">Reconciliation</span><span class="pill">Accounting</span></div></div><!-- Connector 2 --><div class="int-connector" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg></div><!-- Output Node --><div class="int-card"><div class="int-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div><span class="c-title">ERP & Financials</span><div class="c-items"><span class="pill">Tally</span><span class="pill">SAP</span><span class="pill">Zoho</span></div></div></div><div class="int-tabs reveal">${renderComponent($$result, "IntegrationsTabs", IntegrationsTabs, {
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
	return renderTemplate`${renderComponent($$result, "LandingLayout", $$LandingLayout, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Hero", $$Hero, {})}${renderComponent($$result, "MarketplaceMarquee", $$MarketplaceMarquee, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Problem", $$Problem, {})}${renderComponent($$result, "DeepEcomLayer", $$DeepEcomLayer, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Platform", $$Platform, {})}${renderComponent($$result, "BackboneBand", $$BackboneBand, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Solutions", $$Solutions, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Integrations", $$Integrations, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Customers", $$Customers, {})}${renderComponent($$result, "FinalCta", $$FinalCta, {})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/index.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page, __exportAll as t };
