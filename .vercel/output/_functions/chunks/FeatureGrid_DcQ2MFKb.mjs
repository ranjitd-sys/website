import { D as createAstro, T as unescapeHTML, _ as maybeRenderHead, c as renderComponent, g as renderTemplate, u as Fragment, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
//#region src/components/pages/FeatureGrid.astro
createAstro("https://website-lovat-six-11.vercel.app");
var $$FeatureGrid = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FeatureGrid;
	const { eyebrow, title, lead, features, columns = 3, center = false } = Astro.props;
	const ICONS = {
		chart: "<path d=\"M3 3v16a2 2 0 0 0 2 2h16M7 13l4-4 4 3 5-6\"/>",
		trend: "<path d=\"M3 3v16a2 2 0 0 0 2 2h16M7 14l4-4 4 3 5-6\"/>",
		wallet: "<path d=\"M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18M16 14h.01\"/>",
		layers: "<path d=\"M12 2 2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5\"/>",
		check: "<path d=\"M20 6 9 17l-5-5\"/>",
		scale: "<path d=\"M12 3v18M8 21h8M4 6h16M6 6 3 11a3 3 0 0 0 6 0L6 6zM18 6l-3 5a3 3 0 0 0 6 0l-3-5z\"/>",
		receipt: "<path d=\"M6 3h12a2 2 0 0 1 2 2v16l-3-2-3 2-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2zM9 8h6M9 12h6\"/>",
		truck: "<path d=\"M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z\"/>",
		boxes: "<path d=\"M3 7 12 2l9 5-9 5-9-5zM3 7v10l9 5 9-5V7M12 12v10\"/>",
		building: "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><path d=\"M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-3h4v3\"/>",
		calculator: "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01\"/>",
		bank: "<path d=\"M3 10h18M5 10l1 9h12l1-9M2 6l10-3 10 3H2zM12 14h.01\"/>",
		refresh: "<path d=\"M21 12a9 9 0 1 1-2.6-6.3M21 3v6h-6\"/>",
		shield: "<path d=\"M12 2 4 5v6c0 5 3.4 9.2 8 11 4.6-1.8 8-6 8-11V5l-8-3z\"/>",
		gauge: "<path d=\"M12 14 16 9M12 14a3 3 0 1 0 3 3M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z\"/>",
		file: "<path d=\"M6 2h8l4 4v16H6zM14 2v4h4\"/>",
		grid: "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/>",
		users: "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75\"/>",
		briefcase: "<rect x=\"3\" y=\"7\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M9 21V9a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v12\"/>",
		book: "<path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5\"/>",
		help: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01\"/>",
		search: "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m21 21-4.3-4.3\"/>",
		home: "<path d=\"M3 11 12 3l9 8M5 10v10h14V10\"/>",
		target: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/>",
		zap: "<path d=\"M13 2 3 14h8l-1 8 11-12h-8l1-8z\"/>",
		tag: "<path d=\"M20 12 12 20l-8-8V5a1 1 0 0 1 1-1h7zM7.5 7.5h.01\"/>",
		package: "<path d=\"M21 8 12 3 3 8v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8\"/>",
		table: "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18M3 15h18M9 3v18\"/>",
		refresh2: "<path d=\"M17 2 21 6l-4 4M3 11a9 9 0 0 1 15-6.7L21 6M7 22l-4-4 4-4M21 13a9 9 0 0 1-15 6.7L3 18\"/>",
		globe: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z\"/>",
		gear: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z\"/>"
	};
	return renderTemplate`${maybeRenderHead($$result)}<section class="feature-grid-section"><div class="feature-grid-inner">${(eyebrow || title || lead) && renderTemplate`<div${addAttribute(["feature-grid-head", center && "center"], "class:list")}>${eyebrow && renderTemplate`<span class="eyebrow">${eyebrow}</span>`}${title && renderTemplate`<h2 class="h2 mt-1">${title}</h2>`}${lead && renderTemplate`<p class="lead mt-4">${lead}</p>`}</div>`}<div${addAttribute(["feature-grid", `cols-${columns}`], "class:list")}>${features.map((f) => renderTemplate`<article class="feature-card"><span class="ficon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${unescapeHTML(ICONS[f.icon] ?? ICONS.grid)}` })}</svg></span><h3>${f.title}</h3><p>${f.description}</p>${f.href && renderTemplate`<a${addAttribute(f.href, "href")} class="fcard-link">Learn more →</a>`}</article>`)}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/pages/FeatureGrid.astro", void 0);
//#endregion
export { $$FeatureGrid as t };
