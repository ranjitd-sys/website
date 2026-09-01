import { U as generateCspDigest, b as renderHead, f as Fragment$2, h as renderSlot, j as createAstro, k as unescapeHTML, r as spreadAttributes, u as renderComponent, v as renderTemplate, x as addAttribute, y as maybeRenderHead } from "./jsx-runtime_6Vijajm9.mjs";
import { i as createComponent, n as $$Font } from "./_astro_assets_BhK2b17i.mjs";
import { t as renderScript } from "./script_Divgp8oK.mjs";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { Search, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { useAtom, useAtomValue } from "@effect/atom-react";
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult";
import * as Effect from "effect/Effect";
import * as Atom from "effect/unstable/reactivity/Atom";
import * as Schema from "effect/Schema";
//#region node_modules/astro/dist/assets/runtime.js
function createSvgComponent({ meta, attributes, children, styles }) {
	const hasStyles = styles.length > 0;
	const Component = createComponent({
		async factory(result, props) {
			const normalizedProps = normalizeProps(attributes, props);
			if (hasStyles && result.cspDestination) for (const style of styles) {
				const hash = await generateCspDigest(style, result.cspAlgorithm);
				result._metadata.extraStyleHashes.push(hash);
			}
			return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
		},
		propagation: hasStyles ? "self" : "none"
	});
	Object.defineProperty(Component, "toJSON", {
		value: () => meta,
		enumerable: false
	});
	return Object.assign(Component, meta);
}
var ATTRS_TO_DROP = [
	"xmlns",
	"xmlns:xlink",
	"version"
];
var DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
	for (const attr of ATTRS_TO_DROP) delete attributes[attr];
	return attributes;
}
function normalizeProps(attributes, props) {
	return dropAttributes({
		...DEFAULT_ATTRS,
		...attributes,
		...props
	});
}
//#endregion
//#region node_modules/@lucide/astro/src/defaultAttributes.ts
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
//#endregion
//#region node_modules/@lucide/astro/src/utils/hasA11yProp.ts
/**
* Check if a component has an accessibility prop
*
* @param {object} props
* @returns {boolean} Whether the component has an accessibility prop
*/
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region node_modules/@lucide/astro/src/Icon.astro
createAstro("http://localhost:4321");
var $$Icon = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Icon;
	const { color = "currentColor", size = 24, "stroke-width": strokeWidth = 2, absoluteStrokeWidth = false, iconNode = [], class: className, ...rest } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes({
		...defaultAttributes,
		width: size,
		height: size,
		stroke: color,
		"stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
		...!hasA11yProp(rest) && { "aria-hidden": "true" },
		...rest
	})}${addAttribute(["lucide", className], "class:list")}>${iconNode.map(([Tag, attrs]) => renderTemplate`${renderComponent($$result, "Tag", Tag, { ...attrs })}`)}${renderSlot($$result, $$slots["default"])}</svg>`;
}, "/home/ranjit/Documents/deepecom/website/node_modules/@lucide/astro/src/Icon.astro", void 0);
//#endregion
//#region node_modules/@lucide/astro/src/utils/mergeClasses.ts
/**
* Merges classes into a single string
*
* @param {array} classes
* @returns {string} A string of classes
*/
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region node_modules/@lucide/astro/src/utils/toKebabCase.ts
/**
* Converts string to kebab case
*
* @param {string} string
* @returns {string} A kebabized string
*/
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/@lucide/astro/src/createLucideIcon.ts
var createLucideIcon_default = (iconName, iconNode) => {
	return createComponent(($$result, $$props, $$slots) => {
		const { class: className, ...restProps } = $$props;
		return renderTemplate`${renderComponent($$result, "Icon", $$Icon, {
			class: mergeClasses(Boolean(iconName) && `lucide-${toKebabCase(iconName)}`, Boolean(className) && className),
			iconNode,
			...restProps
		}, { default: () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}`;
	}, void 0, "none");
};
//#endregion
//#region node_modules/@lucide/astro/src/icons/arrow-up-right.ts
/**
* @component @name ArrowUpRight
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNyA3aDEwdjEwIiAvPgogIDxwYXRoIGQ9Ik03IDE3IDE3IDciIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/arrow-up-right
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var ArrowUpRight = createLucideIcon_default("arrow-up-right", [["path", { "d": "M7 7h10v10" }], ["path", { "d": "M7 17 17 7" }]]);
//#endregion
//#region node_modules/@lucide/astro/src/icons/search.ts
/**
* @component @name Search
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMjEtNC4zNC00LjM0IiAvPgogIDxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/search
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var Search$1 = createLucideIcon_default("search", [["path", { "d": "m21 21-4.34-4.34" }], ["circle", {
	"cx": "11",
	"cy": "11",
	"r": "8"
}]]);
//#endregion
//#region node_modules/@lucide/astro/src/icons/x.ts
/**
* @component @name X
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var X$1 = createLucideIcon_default("x", [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]]);
//#endregion
//#region src/assets/logos/linkedin/LinkedIn.svg
var LinkedIn_default = createSvgComponent({
	"meta": {
		"src": "/_astro/LinkedIn.CGdDTNQQ.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"viewBox": "0 0 24 24",
		"fill": "currentColor"
	},
	"children": "<path d=\"M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z\"></path>",
	"styles": []
});
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/assets/logos/effect/combination-mark/svg/effect-logo-black.svg
var effect_logo_black_default = createSvgComponent({
	"meta": {
		"src": "/_astro/effect-logo-black.CJ9hFWX7.svg",
		"width": 583,
		"height": 160,
		"format": "svg"
	},
	"attributes": {
		"width": "583",
		"height": "160",
		"viewBox": "0 0 583 160",
		"fill": "none"
	},
	"children": "\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M160.058 47.1308C160.128 49.3649 159.201 51.3522 157.094 52.5262L136.298 64.1042L155.187 74.7413C157.319 75.9412 158.453 78.2081 158.275 80.4716C158.44 82.8041 157.547 84.9018 155.393 86.1173L83.99 126.323C82.4992 127.163 80.8003 127.324 79.268 126.903C78.5653 126.789 77.8713 126.551 77.2195 126.183L5.81948 85.9774C3.6881 84.7775 2.55464 82.5071 2.73248 80.2437C2.56759 77.9111 3.45934 75.8169 5.61403 74.6014L24.711 63.8487L4.12232 52.3846C3.50941 52.0428 2.97937 51.618 2.53479 51.1312C2.34228 50.9464 2.16532 50.7479 2.00734 50.5355C1.84332 50.3163 1.69916 50.0849 1.5783 49.8397C1.5196 49.6861 1.46521 49.5324 1.41428 49.3788L1.30465 49.0991L1.22782 48.8746C1.19156 48.7624 1.15962 48.6484 1.13027 48.5328L1.08193 48.3256C0.978336 47.8491 0.933447 47.3587 0.948986 46.8667C0.879062 44.6326 1.80534 42.6454 3.91255 41.4713L76.9372 0.813633C77.5501 0.471783 78.1976 0.242156 78.8545 0.116121C79.8317 -0.0720692 80.8296 -0.0289064 81.7671 0.226618C82.4854 0.344021 83.195 0.584006 83.8623 0.955207L156.884 41.6129C156.994 41.6733 157.1 41.7372 157.204 41.8045C157.302 41.8667 157.398 41.9306 157.491 41.9962C157.578 42.0583 157.662 42.1222 157.744 42.1878C158.008 42.3967 158.252 42.6246 158.474 42.8681C158.645 43.0338 158.803 43.2082 158.948 43.3929C159.133 43.6312 159.295 43.8867 159.428 44.1578C159.487 44.3114 159.541 44.4634 159.592 44.617C159.924 45.4095 160.085 46.2676 160.058 47.1308ZM20.2221 80.2471L80.5033 114.89L140.785 80.4716L124.112 70.8894L84.0694 93.1839C82.5441 94.0333 80.8072 94.1974 79.2395 93.7709C78.5213 93.6535 77.8117 93.4135 77.1444 93.0423L36.9796 70.6788L20.2221 80.2471Z\" fill=\"black\" />\n<path d=\"M6.15788 112.795C7.7998 110.029 11.4307 109.095 14.2682 110.675L80.5033 148.311L146.934 110.81C149.771 109.228 153.769 110.345 155.044 112.93C156.25 116.091 155.685 119.247 152.839 120.832L83.8709 159.232C82.431 160.035 80.7899 160.188 79.3094 159.786C79.1273 159.757 78.946 159.719 78.7656 159.672C78.2744 159.546 77.7918 159.354 77.3317 159.099L8.36523 120.699C5.51648 119.113 4.51251 115.575 6.15788 112.795Z\" fill=\"black\" />\n<path d=\"M408.882 133.847C385.813 133.847 370.338 116.366 370.338 94.8731C370.338 73.38 386.529 55.6123 408.882 55.6123C431.235 55.6123 446.71 73.38 446.71 94.8731C446.71 97.0224 446.567 99.315 446.137 101.751H390.398C392.547 110.491 399.138 116.653 408.882 116.653C417.193 116.653 423.641 112.354 427.079 106.623L442.125 117.942C436.107 127.256 423.641 133.847 408.882 133.847ZM390.398 87.2789H427.223C425.073 78.9682 418.052 72.2337 408.595 72.2337C399.425 72.2337 392.547 78.3951 390.398 87.2789Z\" fill=\"black\" />\n<path d=\"M494.858 133.847C471.683 133.847 453.175 116.367 453.175 94.7313C453.175 73.0956 471.217 55.7585 495.947 55.6152C510.723 55.4719 522.699 60.7733 529.543 69.5136L513.367 81.6926C509.634 76.5344 503.413 73.2389 496.258 73.2389C482.882 73.2389 474.172 83.1254 474.172 94.7313C474.172 106.337 483.349 116.224 496.725 116.224C504.813 116.224 510.101 112.498 514.3 107.34L529.543 119.519C521.922 128.546 510.723 133.847 494.858 133.847Z\" fill=\"black\" />\n<path d=\"M570.21 134C555.027 134 546.773 126.924 546.773 110.267V74.2997H536.012V57.3477H546.773V39.8062H566.673V57.3477H582.888V74.2997H566.673V109.235C566.673 114.1 569.031 116.311 572.864 116.311H581.119V134H570.21Z\" fill=\"black\" />\n<path d=\"M279.853 51.7964C279.853 36.3186 289.877 26 305.355 26H313.61V42.9519H308.45C302.554 42.9519 299.753 46.0475 299.753 52.0912V56.9557H315.378V73.9077H299.753V133.608H279.853V73.9077H269.092V56.9557H279.853V51.7964Z\" fill=\"black\" />\n<path d=\"M330.476 51.7964C330.476 36.3186 340.499 26 355.977 26H364.232V42.9519H359.073C353.177 42.9519 350.376 46.0475 350.376 52.0912V56.9557H366.001V73.9077H350.376V133.608H330.476V73.9077H319.715V56.9557H330.476V51.7964Z\" fill=\"black\" />\n<path d=\"M200.061 133.788V30.6021H260.499V49.1755H220.699V72.3186H259.762V90.3024H220.699V115.214H260.794V133.788H200.061Z\" fill=\"black\" />\n",
	"styles": []
});
//#endregion
//#region src/assets/logos/effect/combination-mark/svg/effect-logo-white.svg
var effect_logo_white_default = createSvgComponent({
	"meta": {
		"src": "/_astro/effect-logo-white.Yu0soJEa.svg",
		"width": 583,
		"height": 160,
		"format": "svg"
	},
	"attributes": {
		"width": "583",
		"height": "160",
		"viewBox": "0 0 583 160",
		"fill": "none"
	},
	"children": "\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M160.058 47.1308C160.128 49.3649 159.201 51.3522 157.094 52.5262L136.298 64.1042L155.187 74.7413C157.319 75.9412 158.453 78.2081 158.275 80.4716C158.44 82.8041 157.547 84.9018 155.393 86.1173L83.99 126.323C82.4992 127.163 80.8003 127.324 79.268 126.903C78.5653 126.789 77.8713 126.551 77.2195 126.183L5.81948 85.9774C3.6881 84.7775 2.55464 82.5071 2.73248 80.2437C2.56759 77.9111 3.45934 75.8169 5.61403 74.6014L24.711 63.8487L4.12232 52.3846C3.50941 52.0428 2.97937 51.618 2.53479 51.1312C2.34228 50.9464 2.16532 50.7479 2.00734 50.5355C1.84332 50.3163 1.69916 50.0849 1.5783 49.8397C1.5196 49.6861 1.46521 49.5324 1.41428 49.3788L1.30465 49.0991L1.22782 48.8746C1.19156 48.7624 1.15962 48.6484 1.13027 48.5328L1.08193 48.3256C0.978336 47.8491 0.933447 47.3587 0.948986 46.8667C0.879062 44.6326 1.80534 42.6454 3.91255 41.4713L76.9372 0.813633C77.5501 0.471783 78.1976 0.242156 78.8545 0.116121C79.8317 -0.0720692 80.8296 -0.0289064 81.7671 0.226618C82.4854 0.344021 83.195 0.584006 83.8623 0.955207L156.884 41.6129C156.994 41.6733 157.1 41.7372 157.204 41.8045C157.302 41.8667 157.398 41.9306 157.491 41.9962C157.578 42.0583 157.662 42.1222 157.744 42.1878C158.008 42.3967 158.252 42.6246 158.474 42.8681C158.645 43.0338 158.803 43.2082 158.948 43.3929C159.133 43.6312 159.295 43.8867 159.428 44.1578C159.487 44.3114 159.541 44.4634 159.592 44.617C159.924 45.4095 160.085 46.2676 160.058 47.1308ZM20.2221 80.2471L80.5033 114.89L140.785 80.4716L124.112 70.8894L84.0694 93.1839C82.5441 94.0333 80.8072 94.1974 79.2395 93.7709C78.5213 93.6535 77.8117 93.4135 77.1444 93.0423L36.9796 70.6788L20.2221 80.2471Z\" fill=\"white\" />\n<path d=\"M6.15788 112.795C7.7998 110.029 11.4307 109.095 14.2682 110.675L80.5033 148.311L146.934 110.81C149.771 109.228 153.769 110.345 155.044 112.93C156.25 116.091 155.685 119.247 152.839 120.832L83.8709 159.232C82.431 160.035 80.7899 160.188 79.3094 159.786C79.1273 159.757 78.946 159.719 78.7656 159.672C78.2744 159.546 77.7918 159.354 77.3317 159.099L8.36523 120.699C5.51648 119.113 4.51251 115.575 6.15788 112.795Z\" fill=\"white\" />\n<path d=\"M408.882 133.847C385.813 133.847 370.338 116.366 370.338 94.8731C370.338 73.38 386.529 55.6123 408.882 55.6123C431.235 55.6123 446.71 73.38 446.71 94.8731C446.71 97.0224 446.567 99.315 446.137 101.751H390.398C392.547 110.491 399.138 116.653 408.882 116.653C417.193 116.653 423.641 112.354 427.079 106.623L442.125 117.942C436.107 127.256 423.641 133.847 408.882 133.847ZM390.398 87.2789H427.223C425.073 78.9682 418.052 72.2337 408.595 72.2337C399.425 72.2337 392.547 78.3951 390.398 87.2789Z\" fill=\"white\" />\n<path d=\"M494.858 133.847C471.683 133.847 453.175 116.367 453.175 94.7313C453.175 73.0956 471.217 55.7585 495.947 55.6152C510.723 55.4719 522.699 60.7733 529.543 69.5136L513.367 81.6926C509.634 76.5344 503.413 73.2389 496.258 73.2389C482.882 73.2389 474.172 83.1254 474.172 94.7313C474.172 106.337 483.349 116.224 496.725 116.224C504.813 116.224 510.101 112.498 514.3 107.34L529.543 119.519C521.922 128.546 510.723 133.847 494.858 133.847Z\" fill=\"white\" />\n<path d=\"M570.21 134C555.027 134 546.773 126.924 546.773 110.267V74.2997H536.012V57.3477H546.773V39.8062H566.673V57.3477H582.888V74.2997H566.673V109.235C566.673 114.1 569.031 116.311 572.864 116.311H581.119V134H570.21Z\" fill=\"white\" />\n<path d=\"M279.853 51.7964C279.853 36.3186 289.877 26 305.355 26H313.61V42.9519H308.45C302.554 42.9519 299.753 46.0475 299.753 52.0912V56.9557H315.378V73.9077H299.753V133.608H279.853V73.9077H269.092V56.9557H279.853V51.7964Z\" fill=\"white\" />\n<path d=\"M330.476 51.7964C330.476 36.3186 340.499 26 355.977 26H364.232V42.9519H359.073C353.177 42.9519 350.376 46.0475 350.376 52.0912V56.9557H366.001V73.9077H350.376V133.608H330.476V73.9077H319.715V56.9557H330.476V51.7964Z\" fill=\"white\" />\n<path d=\"M200.061 133.788V30.6021H260.499V49.1755H220.699V72.3186H259.762V90.3024H220.699V115.214H260.794V133.788H200.061Z\" fill=\"white\" />\n",
	"styles": []
});
//#endregion
//#region src/components/ui/Link.tsx
/**
* Unified link component for the Effect website.
*
* Covers inline text links, navigation links, footer links, and
* subtle/icon links. For CTA-style buttons that happen to be links,
* use `<Button href="...">` instead.
*
* ## Variant guide
*
* | variant  | use case                                                |
* |----------|---------------------------------------------------------|
* | inline   | Body text links — underlined, white text on dark bg     |
* | nav      | Header nav — subtle bottom-border on hover              |
* | footer   | Footer links — zinc-400 text, border-bottom on hover    |
* | subtle   | Breadcrumbs, attributions — zinc-400 → white on hover   |
* | icon     | Social/icon-only links — zinc-400 → white on hover      |
*/
var linkVariants = cva("transition-colors", {
	variants: { variant: {
		inline: "text-white underline underline-offset-2 hover:text-zinc-300",
		nav: "border-b border-transparent text-sm font-medium text-zinc-400 hover:border-current hover:text-white",
		footer: "border-b border-transparent text-sm leading-relaxed font-medium text-zinc-400 hover:border-current hover:text-white",
		subtle: "text-sm text-zinc-400 hover:text-white",
		icon: "text-zinc-400 hover:text-white"
	} },
	defaultVariants: { variant: "inline" }
});
function Link$1({ variant, className, href, children, active, ...props }) {
	const isExternal = href.startsWith("http");
	const activeClass = active ? {
		nav: "border-white text-white",
		footer: "border-transparent text-white dark:text-white",
		inline: "",
		subtle: "text-white",
		icon: "text-white"
	}[variant ?? "inline"] : "";
	return /* @__PURE__ */ jsx("a", {
		href,
		className: cn(linkVariants({ variant }), className, activeClass),
		...isExternal ? {
			target: "_blank",
			rel: "noopener noreferrer"
		} : {},
		...props,
		children
	});
}
//#endregion
//#region src/components/Footer.astro
createAstro("http://localhost:4321");
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Footer;
	const { activePath } = Astro.props;
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return renderTemplate`${maybeRenderHead($$result)}<footer class="relative w-full px-4 pt-16 md:px-8 md:pt-20"><div class="pointer-events-none absolute inset-0 hidden bg-gradient-to-b from-zinc-950/0 via-zinc-950/0 to-zinc-900/50 dark:block" aria-hidden="true"></div><div class="absolute top-0 right-0 left-0 h-px bg-zinc-200 dark:bg-zinc-800" aria-hidden="true"></div><div class="relative mx-auto w-full max-w-295"><div class="flex flex-col"><div class="mb-12 grid grid-cols-2 gap-x-6 gap-y-8 md:mb-20 md:gap-x-0 lg:grid-cols-4"><div class="flex flex-1 flex-col gap-4 lg:pl-4"><h3 class="font-mono font-semibold text-sm text-zinc-900 uppercase dark:text-zinc-100">Resources</h3><ul class="flex flex-col items-start gap-2"><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/docs/",
		"variant": "footer",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Documentation` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/docs/additional-resources/api-reference/",
		"variant": "footer",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`API reference` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "https://www.youtube.com/playlist?list=PLDf3uQLaK2B9vHzUNyvOSvoMv61LW7792",
		"variant": "footer",
		"className": "inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Workshops${renderComponent($$result, "ArrowUpRight", ArrowUpRight, {
		"size": 14,
		"aria-hidden": "true"
	})}` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/blog/the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive/",
		"variant": "footer",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`LLM Guide` })}</li></ul></div><div class="flex flex-1 flex-col gap-4 lg:border-l lg:border-dashed lg:border-zinc-200 lg:pl-4 dark:lg:border-zinc-800"><h3 class="font-mono font-semibold text-sm text-zinc-900 uppercase dark:text-zinc-100">DevTools</h3><ul class="flex flex-col items-start gap-2"><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/play/",
		"variant": "footer",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Effect Playground` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "https://github.com/Effect-TS/language-service",
		"variant": "footer",
		"className": "inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Effect LSP${renderComponent($$result, "ArrowUpRight", ArrowUpRight, {
		"size": 14,
		"aria-hidden": "true"
	})}` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "https://marketplace.visualstudio.com/items?itemName=effectful-tech.effect-vscode",
		"variant": "footer",
		"className": "inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`VS Code Extension${renderComponent($$result, "ArrowUpRight", ArrowUpRight, {
		"size": 14,
		"aria-hidden": "true"
	})}` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "https://github.com/Effect-TS/tsgo#lsp-based-linter",
		"variant": "footer",
		"className": "inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Linting Rules${renderComponent($$result, "ArrowUpRight", ArrowUpRight, {
		"size": 14,
		"aria-hidden": "true"
	})}` })}</li></ul></div><div class="flex flex-1 flex-col gap-4 lg:pl-4"><h3 class="font-mono font-semibold text-sm text-zinc-900 uppercase dark:text-zinc-100">Community</h3><ul class="flex flex-col items-start gap-2"><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/podcast",
		"variant": "footer",
		"active": activePath?.startsWith("/podcast"),
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Podcast 🎙️` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "https://luma.com/effect-community",
		"variant": "footer",
		"className": "inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Events & meetups${renderComponent($$result, "ArrowUpRight", ArrowUpRight, {
		"size": 14,
		"aria-hidden": "true"
	})}` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "https://discord.gg/effect-ts",
		"variant": "footer",
		"className": "inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Discord${renderComponent($$result, "ArrowUpRight", ArrowUpRight, {
		"size": 14,
		"aria-hidden": "true"
	})}` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/effect-jobs/",
		"variant": "footer",
		"active": activePath?.startsWith("/effect-jobs"),
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Effect Jobs` })}</li></ul></div><div class="flex flex-1 flex-col gap-4 lg:border-l lg:border-dashed lg:border-zinc-200 lg:pl-4 dark:lg:border-zinc-800"><h3 class="font-mono font-semibold text-sm text-zinc-900 uppercase dark:text-zinc-100">Other</h3><ul class="flex flex-col items-start gap-2"><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/blog/",
		"variant": "footer",
		"active": activePath?.startsWith("/blog"),
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Blog` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/myths/",
		"variant": "footer",
		"active": activePath?.startsWith("/myths"),
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Myths about Effect 💀` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/merch/",
		"variant": "footer",
		"active": activePath?.startsWith("/merch"),
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Effect merch 🧢` })}</li><li>${renderComponent($$result, "Link", Link$1, {
		"href": "/brand-assets/",
		"variant": "footer",
		"active": activePath?.startsWith("/brand-assets"),
		"className": "inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Logo guidelines` })}</li></ul></div></div><div class="flex flex-col gap-10 md:gap-8"><div class="mx-4 h-px bg-zinc-200 dark:bg-zinc-800"></div><div class="flex flex-col items-center gap-8 md:grid md:grid-cols-3 md:items-center"><div class="md:pl-4"><a href="/" aria-label="Go to Effect homepage"><img class="block h-7 w-auto dark:hidden"${addAttribute(effect_logo_black_default.src, "src")} alt="Effect"${addAttribute(effect_logo_black_default.width, "width")}${addAttribute(effect_logo_black_default.height, "height")}><img class="hidden h-7 w-auto dark:block"${addAttribute(effect_logo_white_default.src, "src")} alt="Effect"${addAttribute(effect_logo_white_default.width, "width")}${addAttribute(effect_logo_white_default.height, "height")}></a></div><div class="flex items-center justify-center gap-6 md:gap-5">${renderComponent($$result, "Link", Link$1, {
		"href": "https://github.com/Effect-TS",
		"variant": "icon",
		"aria-label": "Visit Effect on GitHub",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`<div class="flex w-6 items-center justify-center"><i class="ri-github-fill text-2xl md:text-xl" aria-hidden="true"></i></div>` })}${renderComponent($$result, "Link", Link$1, {
		"href": "https://discord.gg/effect-ts",
		"variant": "icon",
		"aria-label": "Join Effect Discord server",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`<div class="flex w-6 items-center justify-center"><i class="ri-discord-fill text-2xl md:text-xl" aria-hidden="true"></i></div>` })}${renderComponent($$result, "Link", Link$1, {
		"href": "https://x.com/EffectTS_",
		"variant": "icon",
		"aria-label": "Follow Effect on X (Twitter)",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`<div class="flex w-6 items-center justify-center"><i class="ri-twitter-x-fill text-2xl md:text-xl" aria-hidden="true"></i></div>` })}${renderComponent($$result, "Link", Link$1, {
		"href": "https://www.youtube.com/@EffectTS",
		"variant": "icon",
		"aria-label": "Subscribe to Effect on YouTube",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`<div class="flex w-6 items-center justify-center"><i class="ri-youtube-fill text-2xl md:text-xl" aria-hidden="true"></i></div>` })}${renderComponent($$result, "Link", Link$1, {
		"href": "https://www.linkedin.com/company/effect-ts",
		"variant": "icon",
		"aria-label": "Follow Effect on LinkedIn",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`<div class="flex w-6 items-center justify-center"><i class="ri-linkedin-fill text-2xl md:text-xl" aria-hidden="true"></i></div>` })}${renderComponent($$result, "Link", Link$1, {
		"href": "https://bsky.app/profile/effect-ts.bsky.social",
		"variant": "icon",
		"aria-label": "Follow Effect on Bluesky",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`<div class="flex w-6 items-center justify-center"><i class="ri-bluesky-fill text-2xl md:text-xl" aria-hidden="true"></i></div>` })}</div><div class="md:pr-4 md:text-right"><p class="text-sm text-zinc-600 dark:text-zinc-400">MIT Licensed</p></div></div><div class="mx-4 h-px bg-zinc-200 dark:bg-zinc-800"></div></div><div class="flex flex-col items-center justify-between gap-4 px-4 pt-10 pb-16 md:flex-row md:gap-8 md:pt-8 md:pb-16"><p class="text-sm text-zinc-600 dark:text-zinc-400 text-center lg:text-start"><span>© ${year}</span><a href="https://effectful.co/"><span class="text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Effectful Technologies Inc.</span></a><span>All rights reserved.</span></p><div class="flex items-center gap-5"><div class="flex items-center gap-4">${renderComponent($$result, "Link", Link$1, {
		"href": "mailto:contact@effectful.co",
		"variant": "footer",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Email us` })}${renderComponent($$result, "Link", Link$1, {
		"href": "/privacy",
		"variant": "footer",
		"className": "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
	}, { "default": ($$result) => renderTemplate`Privacy` })}</div></div></div></div></div></footer>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/Footer.astro", void 0);
//#endregion
//#region src/assets/logos/discord/Discord.svg
var Discord_default = createSvgComponent({
	"meta": {
		"src": "/_astro/Discord.IWvshbXt.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"viewBox": "0 0 24 24",
		"fill": "currentColor"
	},
	"children": "<path d=\"M19.3034 5.33716C17.9344 4.71103 16.4805 4.2547 14.9629 4C14.7719 4.32899 14.5596 4.77471 14.411 5.12492C12.7969 4.89144 11.1944 4.89144 9.60255 5.12492C9.45397 4.77471 9.2311 4.32899 9.05068 4C7.52251 4.2547 6.06861 4.71103 4.70915 5.33716C1.96053 9.39111 1.21766 13.3495 1.5891 17.2549C3.41443 18.5815 5.17612 19.388 6.90701 19.9187C7.33151 19.3456 7.71356 18.73 8.04255 18.0827C7.41641 17.8492 6.82211 17.5627 6.24904 17.2231C6.39762 17.117 6.5462 17.0003 6.68416 16.8835C10.1438 18.4648 13.8911 18.4648 17.3082 16.8835C17.4568 17.0003 17.5948 17.117 17.7434 17.2231C17.1703 17.5627 16.576 17.8492 15.9499 18.0827C16.2789 18.73 16.6609 19.3456 17.0854 19.9187C18.8152 19.388 20.5875 18.5815 22.4033 17.2549C22.8596 12.7341 21.6806 8.80747 19.3034 5.33716ZM8.5201 14.8459C7.48007 14.8459 6.63107 13.9014 6.63107 12.7447C6.63107 11.5879 7.45884 10.6434 8.5201 10.6434C9.57071 10.6434 10.4303 11.5879 10.4091 12.7447C10.4091 13.9014 9.57071 14.8459 8.5201 14.8459ZM15.4936 14.8459C14.4535 14.8459 13.6034 13.9014 13.6034 12.7447C13.6034 11.5879 14.4323 10.6434 15.4936 10.6434C16.5442 10.6434 17.4038 11.5879 17.3825 12.7447C17.3825 13.9014 16.5548 14.8459 15.4936 14.8459Z\"></path>",
	"styles": []
});
//#endregion
//#region src/assets/logos/github/GitHub.svg
var GitHub_default = createSvgComponent({
	"meta": {
		"src": "/_astro/GitHub.Cxf3JvoV.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"viewBox": "0 0 24 24",
		"fill": "currentColor"
	},
	"children": "<path d=\"M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z\"></path>",
	"styles": []
});
//#endregion
//#region src/assets/logos/twitter/Twitter.svg
var Twitter_default = createSvgComponent({
	"meta": {
		"src": "/_astro/Twitter.BET-TmQF.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"viewBox": "0 0 24 24",
		"fill": "currentColor"
	},
	"children": "<path d=\"M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z\"></path>",
	"styles": []
});
//#endregion
//#region src/components/navigation/NavigationMobileMenu.astro
createAstro("http://localhost:4321");
var $$NavigationMobileMenu = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$NavigationMobileMenu;
	const { transparent = false, primaryLinks, socialLinks, activeSlug } = Astro.props;
	const actionButtonClass = cn("flex h-10 w-10 appearance-none items-center justify-center", "rounded-lg border border-transparent bg-transparent transition-colors hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800", transparent ? "text-white/85 hover:text-white" : "text-zinc-500/90 hover:text-zinc-900 dark:text-zinc-300/90 dark:hover:text-white");
	return renderTemplate`${renderComponent($$result, "effect-mobile-menu", "effect-mobile-menu", {
		"class": "ml-auto",
		"data-astro-cid-dfdpugc4": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<button type="button" data-role="menu-button" aria-label="Open navigation menu" aria-expanded="false"${addAttribute(actionButtonClass, "class")} data-astro-cid-dfdpugc4><svg data-role="icon-open" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-astro-cid-dfdpugc4><path d="M3 4H21V6H3V4ZM3 11H15V13H3V11ZM3 18H21V20H3V18Z" data-astro-cid-dfdpugc4></path></svg>${renderComponent($$result, "X", X$1, {
		"data-role": "icon-close",
		"class": "hidden h-6 w-6",
		"data-astro-cid-dfdpugc4": true
	})}</button><div data-role="menu-root" class="fixed inset-0 z-150 hidden" data-astro-cid-dfdpugc4><button type="button" data-role="backdrop" class="fixed inset-0 bg-zinc-800/10 dark:bg-zinc-950/70" aria-label="Close mobile menu" data-astro-cid-dfdpugc4></button><div data-role="panel" class="fixed top-0 right-0 flex h-full w-full max-w-[64%] flex-col bg-white shadow-xl dark:bg-zinc-900" style="transform: translateX(100%)" data-astro-cid-dfdpugc4><div class="flex flex-shrink-0 items-center justify-between border-b border-zinc-200 py-3.5 pr-4 pl-8 dark:border-zinc-800" data-astro-cid-dfdpugc4><span class="text-sm font-medium text-zinc-900 dark:text-white" data-astro-cid-dfdpugc4>Menu</span><button type="button" data-role="close-button" aria-label="Close navigation menu" class="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white" data-astro-cid-dfdpugc4>${renderComponent($$result, "X", X$1, {
		"class": "h-5 w-5",
		"aria-hidden": "true",
		"data-astro-cid-dfdpugc4": true
	})}</button></div><nav class="flex-1 overflow-y-auto px-6 py-6" data-astro-cid-dfdpugc4><div class="space-y-1" data-astro-cid-dfdpugc4>${primaryLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute(link.kind === "external" ? link.target : void 0, "target")}${addAttribute(link.kind === "external" ? link.rel : void 0, "rel")} data-role="menu-link"${addAttribute(link.id === activeSlug ? "page" : void 0, "aria-current")}${addAttribute(["block rounded-md px-3 py-2.5 text-[15px] no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white", link.id === activeSlug ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white" : link.cta === "solid" ? "font-medium text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-300"], "class:list")} data-astro-cid-dfdpugc4>${link.label}</a>`)}</div><div class="my-4 h-px bg-zinc-200 dark:bg-zinc-800" data-astro-cid-dfdpugc4></div><div class="space-y-1" data-astro-cid-dfdpugc4>${socialLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute(link.kind === "external" ? link.target : void 0, "target")}${addAttribute(link.kind === "external" ? link.rel : void 0, "rel")} data-role="menu-link" class="flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white" data-astro-cid-dfdpugc4>${link.icon === "discord" ? renderTemplate`${renderComponent($$result, "DiscordIcon", Discord_default, {
		"class": "h-4.5 w-4.5",
		"fill": "currentColor",
		"aria-hidden": "true",
		"data-astro-cid-dfdpugc4": true
	})}` : link.icon === "github" ? renderTemplate`${renderComponent($$result, "GitHubIcon", GitHub_default, {
		"class": "h-4.5 w-4.5",
		"fill": "currentColor",
		"aria-hidden": "true",
		"data-astro-cid-dfdpugc4": true
	})}` : renderTemplate`${renderComponent($$result, "TwitterIcon", Twitter_default, {
		"class": "h-3.5 w-3.5",
		"fill": "currentColor",
		"aria-hidden": "true",
		"data-astro-cid-dfdpugc4": true
	})}`}<span data-astro-cid-dfdpugc4>${link.label}</span></a>`)}</div><button type="button" data-role="menu-search-button" aria-label="Open search" class="mt-6 flex w-full appearance-none items-center gap-3 rounded-md border border-zinc-300 bg-transparent px-3 py-2.5 text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-white" data-astro-cid-dfdpugc4>${renderComponent($$result, "Search", Search$1, {
		"class": "h-4.5 w-4.5",
		"aria-hidden": "true",
		"data-astro-cid-dfdpugc4": true
	})}<span class="text-sm" data-astro-cid-dfdpugc4>Search</span><kbd data-role="search-kbd" class="ml-auto inline-flex items-center gap-0.5 text-xs text-zinc-400/80 dark:text-zinc-500" data-astro-cid-dfdpugc4></kbd></button></nav></div></div>` })}${renderScript($$result, "/home/ranjit/Documents/deepecom/website/src/components/navigation/NavigationMobileMenu.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/ranjit/Documents/deepecom/website/src/components/navigation/NavigationMobileMenu.astro", void 0);
//#endregion
//#region src/components/navigation/NavigationLogo.astro
createAstro("http://localhost:4321");
var $$NavigationLogo = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$NavigationLogo;
	const { href = "/" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")} class="flex items-center" aria-label="Effect homepage"><img${addAttribute(effect_logo_black_default.src, "src")} alt="Effect Logo" class="h-7 w-auto dark:hidden"${addAttribute(effect_logo_black_default.width, "width")}${addAttribute(effect_logo_black_default.height, "height")}><img${addAttribute(effect_logo_white_default.src, "src")} alt="" aria-hidden="true" class="hidden h-7 w-auto dark:block"${addAttribute(effect_logo_white_default.width, "width")}${addAttribute(effect_logo_white_default.height, "height")}></a>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/navigation/NavigationLogo.astro", void 0);
//#endregion
//#region src/assets/logos/bluesky/BlueSky.svg
var BlueSky_default = createSvgComponent({
	"meta": {
		"src": "/_astro/BlueSky.ubAYhTaL.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"viewBox": "0 0 24 24",
		"fill": "currentColor"
	},
	"children": "<path d=\"M12 11.3884C11.0942 9.62673 8.62833 6.34423 6.335 4.7259C4.13833 3.17506 3.30083 3.4434 2.75167 3.69256C2.11583 3.9784 2 4.95506 2 5.52839C2 6.10339 2.315 10.2367 2.52 10.9276C3.19917 13.2076 5.61417 13.9776 7.83917 13.7309C4.57917 14.2142 1.68333 15.4017 5.48083 19.6292C9.65833 23.9542 11.2058 18.7017 12 16.0392C12.7942 18.7017 13.7083 23.7651 18.4442 19.6292C22 16.0392 19.4208 14.2142 16.1608 13.7309C18.3858 13.9784 20.8008 13.2076 21.48 10.9276C21.685 10.2376 22 6.10256 22 5.52923C22 4.95423 21.8842 3.97839 21.2483 3.6909C20.6992 3.44256 19.8617 3.17423 17.665 4.72423C15.3717 6.34506 12.9058 9.62756 12 11.3884Z\"></path>",
	"styles": []
});
//#endregion
//#region src/assets/logos/spotify/Spotify.svg
var Spotify_default = createSvgComponent({
	"meta": {
		"src": "/_astro/Spotify.gsQFTkBN.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": { "viewBox": "0 0 24 24" },
	"children": "<path d=\"M12.001 2C6.50098 2 2.00098 6.5 2.00098 12C2.00098 17.5 6.50098 22 12.001 22C17.501 22 22.001 17.5 22.001 12C22.001 6.5 17.551 2 12.001 2ZM15.751 16.65C13.401 15.2 10.451 14.8992 6.95014 15.6992C6.60181 15.8008 6.30098 15.55 6.20098 15.25C6.10098 14.8992 6.35098 14.6 6.65098 14.5C10.451 13.6492 13.751 14 16.351 15.6C16.701 15.75 16.7501 16.1492 16.6018 16.45C16.4018 16.7492 16.0518 16.85 15.751 16.65ZM16.7501 13.95C14.051 12.3 9.95098 11.8 6.80098 12.8C6.40181 12.9 5.95098 12.7 5.85098 12.3C5.75098 11.9 5.95098 11.4492 6.35098 11.3492C10.001 10.25 14.501 10.8008 17.601 12.7C17.9018 12.8508 18.051 13.35 17.8018 13.7C17.551 14.05 17.101 14.2 16.7501 13.95ZM6.30098 9.75083C5.80098 9.9 5.30098 9.6 5.15098 9.15C5.00098 8.64917 5.30098 8.15 5.75098 7.99917C9.30098 6.94917 15.151 7.14917 18.8518 9.35C19.301 9.6 19.451 10.2 19.201 10.65C18.9518 11.0008 18.351 11.1492 17.9018 10.9C14.701 9 9.35098 8.8 6.30098 9.75083Z\"></path>",
	"styles": []
});
//#endregion
//#region src/assets/logos/youtube/YouTube.svg
var YouTube_default = createSvgComponent({
	"meta": {
		"src": "/_astro/YouTube.DsOSr2zl.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"viewBox": "0 0 24 24",
		"fill": "none"
	},
	"children": "\n  <path class=\"youtube-body\" fill=\"currentColor\" d=\"M12.244 4c.534.003 1.87.016 3.29.073l.504.022c1.429.067 2.857.183 3.566.38.945.266 1.687 1.04 1.938 2.022.4 1.559.45 4.602.456 5.339V12c0 .007 0 .01 0 .01v.152c-.006.737-.056 3.78-.456 5.339-.254.985-.997 1.76-1.938 2.022-.708.198-2.137.313-3.566.381l-.504.022c-1.42.057-2.756.07-3.29.073h-.235-.01-.234c-1.13-.006-5.857-.057-7.36-.475-.945-.265-1.687-1.04-1.938-2.021C2.056 15.942 2.006 12.899 2 12.162v-.327c.006-.736.056-3.78.456-5.338.255-.986.997-1.76 1.939-2.022C5.898 4.057 10.624 4.006 11.755 4h.489Z\" />\n  <path class=\"youtube-play\" fill=\"white\" d=\"M10 8.5v7l6-3.5-6-3.5Z\" />\n",
	"styles": []
});
//#endregion
//#region src/components/Link.astro
createAstro("http://localhost:4321");
var $$Link = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Link;
	const { class: className, href, ...props } = Astro.props;
	const isExternal = href.startsWith("http");
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(className, "class")}${addAttribute(href, "href")}${spreadAttributes(isExternal ? {
		target: "_blank",
		rel: "noopener noreferrer"
	} : {})}${spreadAttributes(props)}>${renderSlot($$result, $$slots["default"])}</a>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/Link.astro", void 0);
//#endregion
//#region src/components/SocialLink.astro
createAstro("http://localhost:4321");
var $$SocialLink = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SocialLink;
	const { class: className, iconClass, variant, ...props } = Astro.props;
	const SOCIAL_DESCRIPTIONS = {
		bluesky: "Follow Effect on Bluesky",
		discord: "Join the Effect Discord server",
		github: "Contribute to Effect on GitHub",
		linkedin: "Follow Effect on LinkedIn",
		spotify: "Listen to the Cause & Effect Podcast on Spotify",
		twitter: "Follow Effect on X (Twitter)",
		youtube: "Subscribe to Effect on YouTube",
		"youtube-podcast": "Subscribe to the Cause & Effect Podcast on YouTube"
	};
	const SOCIAL_ICONS = {
		bluesky: BlueSky_default,
		discord: Discord_default,
		github: GitHub_default,
		linkedin: LinkedIn_default,
		spotify: Spotify_default,
		twitter: Twitter_default,
		youtube: YouTube_default,
		"youtube-podcast": YouTube_default
	};
	const SOCIAL_LINKS = {
		bluesky: "https://bsky.app/profile/effect-ts.bsky.social",
		discord: "https://discord.gg/effect-ts",
		github: "https://github.com/Effect-TS",
		linkedin: "https://www.linkedin.com/company/effect-ts",
		spotify: "https://open.spotify.com/show/4QTFiem4o0G9V2vXtv8vMU",
		twitter: "https://x.com/EffectTS_",
		youtube: "https://www.youtube.com/@effect-ts",
		"youtube-podcast": "https://youtube.com/playlist?list=PLDf3uQLaK2B_jaZ5Fy7IPNq0FIViV_CQl&si=ljmf2aKH5H09GQ7r"
	};
	const ariaLabel = SOCIAL_DESCRIPTIONS[variant];
	const href = SOCIAL_LINKS[variant];
	const Icon = SOCIAL_ICONS[variant];
	return renderTemplate`${renderComponent($$result, "Link", $$Link, {
		"class": cn("text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors no-underline", className),
		"href": href,
		"target": "_blank",
		"rel": "noopener noreferrer",
		"aria-label": ariaLabel,
		...props
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Icon", Icon, { "class": cn("size-6", iconClass) })}${renderSlot($$result, $$slots["default"])}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/components/SocialLink.astro", void 0);
//#endregion
//#region src/lib/navigation.ts
var NAVIGATION_EVENTS = {
	SEARCH_OPEN: "effect-search:open",
	SEARCH_OPENED: "effect-search:opened",
	SEARCH_CLOSE: "effect-search:close",
	MOBILE_MENU_OPEN: "effect-mobile-menu:open"
};
var LANDING_NAVIGATION_LINKS = [
	{
		id: "blog",
		kind: "internal",
		label: "Blog",
		href: "/blog/",
		group: "primary",
		surfaces: ["desktop", "mobile"],
		cta: "none"
	},
	{
		id: "podcast",
		kind: "internal",
		label: "Podcast",
		href: "/podcast/",
		group: "primary",
		surfaces: ["desktop", "mobile"],
		cta: "none"
	},
	{
		id: "careers",
		kind: "internal",
		label: "careers",
		href: "/careers/",
		group: "primary",
		surfaces: ["desktop", "mobile"],
		cta: "none"
	},
	{
		id: "github",
		kind: "external",
		label: "GitHub",
		href: "https://github.com/Effect-TS/effect",
		target: "_blank",
		rel: "noopener noreferrer",
		group: "social",
		surfaces: ["desktop", "mobile"],
		cta: "none",
		icon: "github"
	},
	{
		id: "discord",
		kind: "external",
		label: "Discord",
		href: "https://discord.gg/effect-ts",
		target: "_blank",
		rel: "noopener noreferrer",
		group: "social",
		surfaces: ["desktop", "mobile"],
		cta: "none",
		icon: "discord"
	},
	{
		id: "twitter",
		kind: "external",
		label: "X / Twitter",
		href: "https://twitter.com/EffectTS_",
		target: "_blank",
		rel: "noopener noreferrer",
		group: "social",
		surfaces: ["desktop", "mobile"],
		cta: "none",
		icon: "twitter"
	}
];
var getNavigationLinks = (surface, group) => {
	return LANDING_NAVIGATION_LINKS.filter((link) => {
		return link.group === group && link.surfaces.includes(surface);
	});
};
//#endregion
//#region src/components/navigation/SearchTriggerIsland.tsx
var META_SHORTCUT = {
	label: "⌘",
	aria: "Meta+K"
};
var CONTROL_SHORTCUT = {
	label: "Ctrl",
	aria: "Control+K"
};
var hasPlatformString = (value) => {
	return typeof value === "object" && value !== null && "platform" in value && typeof Reflect.get(value, "platform") === "string";
};
var detectSearchShortcut = () => {
	if (typeof navigator === "undefined") return META_SHORTCUT;
	const userAgentData = Reflect.get(navigator, "userAgentData");
	const platform = ((hasPlatformString(userAgentData) ? userAgentData.platform : void 0) ?? navigator.platform).toLowerCase();
	const userAgent = navigator.userAgent.toLowerCase();
	return platform.includes("mac") || platform.includes("iphone") || platform.includes("ipad") || platform.includes("ipod") || userAgent.includes("mac os") || userAgent.includes("iphone") || userAgent.includes("ipad") ? META_SHORTCUT : CONTROL_SHORTCUT;
};
var SearchTriggerIsland = memo(function SearchTriggerIsland({ mode, transparent = false, onTrigger, openDelayMs = 0 }) {
	const [shortcut, setShortcut] = useState(META_SHORTCUT);
	useEffect(() => {
		setShortcut(detectSearchShortcut());
	}, []);
	const onClick = () => {
		onTrigger?.();
		if (openDelayMs > 0) {
			window.setTimeout(() => {
				window.dispatchEvent(new Event(NAVIGATION_EVENTS.SEARCH_OPEN));
			}, openDelayMs);
			return;
		}
		window.dispatchEvent(new Event(NAVIGATION_EVENTS.SEARCH_OPEN));
	};
	if (mode === "mobile") return /* @__PURE__ */ jsxs("button", {
		type: "button",
		"aria-label": "Open search",
		"aria-keyshortcuts": shortcut.aria,
		onClick,
		className: "mt-6 flex w-full cursor-pointer appearance-none items-center gap-3 rounded-md border border-zinc-500 bg-transparent px-3 py-2.5 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white",
		children: [
			/* @__PURE__ */ jsx(Search, {
				className: "h-4.5 w-4.5",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-sm",
				children: "Search"
			}),
			/* @__PURE__ */ jsxs("kbd", {
				className: "ml-auto inline-flex items-center justify-center gap-0.5 text-xs leading-none text-zinc-300",
				children: [/* @__PURE__ */ jsx("span", { children: shortcut.label }), /* @__PURE__ */ jsx("span", { children: "K" })]
			})
		]
	});
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		"aria-label": "Open search",
		"aria-keyshortcuts": shortcut.aria,
		onClick,
		className: cn("flex h-8 cursor-pointer appearance-none items-center gap-2 rounded-md border bg-transparent px-2.5 py-1 text-sm transition-colors", transparent ? "border-white/50 text-white hover:border-white hover:bg-zinc-800" : "border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-white"),
		children: [/* @__PURE__ */ jsx(Search, {
			className: "h-4.5 w-4.5",
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsxs("kbd", {
			className: cn("inline-flex items-center justify-center gap-0.5 text-[12px] leading-none", transparent ? "text-white/80" : "text-zinc-400/80 dark:text-zinc-400/80"),
			children: [/* @__PURE__ */ jsx("span", { children: shortcut.label }), /* @__PURE__ */ jsx("span", { children: "K" })]
		})]
	});
});
//#endregion
//#region src/components/navigation/NavigationDesktopActions.astro
createAstro("http://localhost:4321");
var $$NavigationDesktopActions = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$NavigationDesktopActions;
	const { transparent = false, showThemeToggle = false } = Astro.props;
	return renderTemplate`${renderComponent($$result, "SearchTriggerIsland", SearchTriggerIsland, {
		"client:load": true,
		"mode": "desktop",
		"transparent": transparent,
		"client:component-hydration": "load",
		"client:component-path": "@/components/navigation/SearchTriggerIsland",
		"client:component-export": "default"
	})}${maybeRenderHead($$result)}<div${addAttribute(`h-4.5 w-px ${transparent ? "bg-white/50" : "bg-zinc-200 dark:bg-zinc-700"}`, "class")} aria-hidden="true"></div><div class="flex items-center gap-4">${renderComponent($$result, "SocialLink", $$SocialLink, { "variant": "github" })}${renderComponent($$result, "SocialLink", $$SocialLink, { "variant": "discord" })}</div>${showThemeToggle && renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<div${addAttribute(`h-4.5 w-px ${transparent ? "bg-white/50" : "bg-zinc-200 dark:bg-zinc-700"}`, "class")} aria-hidden="true"></div>${renderComponent($$result, "ThemeToggle", null, {
		"client:only": "react",
		"className": transparent ? "text-white hover:text-white/80" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
		"client:component-hydration": "only",
		"client:component-path": "@/components/ui/ThemeToggle",
		"client:component-export": "default"
	})}` })}`}`;
}, "/home/ranjit/Documents/deepecom/website/src/components/navigation/NavigationDesktopActions.astro", void 0);
//#endregion
//#region src/components/navigation/NavigationAnchor.astro
createAstro("http://localhost:4321");
var $$NavigationAnchor = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$NavigationAnchor;
	const { link, class: className, ariaLabel, active = false, activeClass } = Astro.props;
	const anchorClass = cn(className, active && activeClass);
	return renderTemplate`${link.kind === "external" ? renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(link.href, "href")}${addAttribute(link.target, "target")}${addAttribute(link.rel, "rel")}${addAttribute(anchorClass, "class")}${addAttribute(ariaLabel, "aria-label")}>${renderSlot($$result, $$slots["default"], renderTemplate`${link.label}`)}</a>` : renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute(anchorClass, "class")}${addAttribute(ariaLabel, "aria-label")}${addAttribute(active ? "page" : void 0, "aria-current")}>${renderSlot($$result, $$slots["default"], renderTemplate`${link.label}`)}</a>`}`;
}, "/home/ranjit/Documents/deepecom/website/src/components/navigation/NavigationAnchor.astro", void 0);
//#endregion
//#region src/components/navigation/NavigationLinks.astro
createAstro("http://localhost:4321");
var $$NavigationLinks = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$NavigationLinks;
	const { transparent = false, activeSlug } = Astro.props;
	const links = getNavigationLinks("desktop", "primary");
	const plainLinks = links.filter((link) => link.cta === "none");
	const ctaLinks = links.filter((link) => link.cta === "solid");
	const plainClass = `border-b border-transparent text-sm font-medium no-underline transition-colors hover:border-current ${transparent ? "text-white hover:text-white/80" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"}`;
	return renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`${plainLinks.map((link) => renderTemplate`${renderComponent($$result, "NavigationAnchor", $$NavigationAnchor, {
		"link": link,
		"class": plainClass,
		"active": link.id === activeSlug,
		"activeClass": "border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
	})}`)}${ctaLinks.map((link) => renderTemplate`${renderComponent($$result, "NavigationAnchor", $$NavigationAnchor, {
		"link": link,
		"class": "rounded-md bg-white px-4 py-1.5 text-sm font-medium text-zinc-900 no-underline transition-colors hover:bg-zinc-200"
	})}`)}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/components/navigation/NavigationLinks.astro", void 0);
//#endregion
//#region src/components/navigation/MixedbreadLogo.svg?react
var MixedbreadLogo_default = "/_astro/MixedbreadLogo.BiswM2LG.svg?react";
//#endregion
//#region src/services/search/domain.ts
var HeadingInfo = Schema.Struct({
	level: Schema.Int,
	text: Schema.String
});
var Metadata = Schema.Struct({
	synced: Schema.Boolean,
	file_hash: Schema.String,
	file_path: Schema.String,
	git_branch: Schema.String,
	git_commit: Schema.String,
	uploaded_at: Schema.DateTimeUtcFromString
});
var GeneratedMetadata = Schema.Struct({
	title: Schema.String,
	description: Schema.optional(Schema.String),
	language: Schema.String,
	sidebar: Schema.Struct({
		label: Schema.optional(Schema.String),
		order: Schema.Int
	}),
	file_type: Schema.Literal("text/markdown"),
	file_size: Schema.Int,
	word_count: Schema.Int,
	chunk_headings: Schema.Array(HeadingInfo),
	heading_context: Schema.Array(HeadingInfo)
});
var ScoredTextInputChunk = Schema.Struct({
	type: Schema.Literal("text"),
	model: Schema.String,
	text: Schema.String,
	score: Schema.Number,
	offset: Schema.optional(Schema.Int),
	metadata: Metadata,
	filename: Schema.String,
	file_id: Schema.String,
	store_id: Schema.String,
	chunk_index: Schema.Int,
	mime_type: Schema.Literal("text/markdown"),
	generated_metadata: GeneratedMetadata
});
Schema.Struct({
	object: Schema.Literal("list"),
	data: Schema.Array(ScoredTextInputChunk)
});
var SearchResultChunk = Schema.Struct({
	id: Schema.String,
	anchorId: Schema.String,
	title: Schema.String,
	snippet: Schema.String,
	score: Schema.Number
});
Schema.Struct({
	id: Schema.String,
	title: Schema.String,
	description: Schema.String,
	href: Schema.String,
	chunks: Schema.Array(SearchResultChunk)
});
var SearchError = class extends Schema.TaggedErrorClass()("SearchError", { cause: Schema.Defect() }, { httpApiStatus: 500 }) {};
//#endregion
//#region src/components/navigation/search-atoms.ts
var searchQueryAtom = Atom.make("");
var debouncedQueryAtom = searchQueryAtom.pipe(Atom.debounce(300));
var searchResultsAtom = Atom.make((get) => {
	const query = get(debouncedQueryAtom);
	if (query.trim().length === 0) return Effect.succeed([]);
	const url = `/api/search?query=${encodeURIComponent(query)}`;
	return Effect.gen(function* () {
		const response = yield* Effect.tryPromise({
			try: (signal) => fetch(url, { signal }),
			catch: (cause) => new SearchError({ cause })
		});
		if (!response.ok) return yield* new SearchError({ cause: /* @__PURE__ */ new Error(`Search request failed: ${response.status}`) });
		return yield* Effect.tryPromise({
			try: () => response.json(),
			catch: (cause) => new SearchError({ cause })
		});
	});
});
//#endregion
//#region src/components/navigation/SearchDialogIsland.tsx
var syncSearchScrollLock = (open) => {
	const html = document.documentElement;
	const body = document.body;
	if (open) {
		html.setAttribute("data-search-open", "true");
		body.setAttribute("data-search-open", "true");
		return;
	}
	html.removeAttribute("data-search-open");
	body.removeAttribute("data-search-open");
};
var SearchDialogIsland = memo(function SearchDialogIsland() {
	const [state, setState] = useState({ tag: "closed" });
	const [query, setQuery] = useAtom(searchQueryAtom);
	const debouncedQuery = useAtomValue(debouncedQueryAtom);
	const inputRef = useRef(null);
	const resultsRef = useRef(null);
	const selectedIndexRef = useRef(-1);
	const [isMac, setIsMac] = useState(false);
	const searchResult = useAtomValue(searchResultsAtom);
	const isOpen = state.tag === "open";
	useEffect(() => {
		const platform = navigator.userAgent || "";
		setIsMac(platform.toLowerCase().includes("mac") || platform.toLowerCase().includes("darwin"));
	}, []);
	const openDialog = useCallback(() => {
		setState({ tag: "open" });
	}, []);
	const closeDialog = useCallback(() => {
		setState({ tag: "closed" });
	}, []);
	useEffect(() => {
		const onOpen = () => openDialog();
		const onClose = () => closeDialog();
		const onKeyDown = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				openDialog();
			}
			if (event.key === "Escape") closeDialog();
		};
		window.addEventListener(NAVIGATION_EVENTS.SEARCH_OPEN, onOpen);
		window.addEventListener(NAVIGATION_EVENTS.SEARCH_CLOSE, onClose);
		window.addEventListener(NAVIGATION_EVENTS.MOBILE_MENU_OPEN, onClose);
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener(NAVIGATION_EVENTS.SEARCH_OPEN, onOpen);
			window.removeEventListener(NAVIGATION_EVENTS.SEARCH_CLOSE, onClose);
			window.removeEventListener(NAVIGATION_EVENTS.MOBILE_MENU_OPEN, onClose);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [openDialog, closeDialog]);
	useEffect(() => {
		if (!isOpen) {
			syncSearchScrollLock(false);
			return;
		}
		syncSearchScrollLock(true);
		setQuery("");
		inputRef.current?.focus();
		window.dispatchEvent(new Event(NAVIGATION_EVENTS.SEARCH_OPENED));
	}, [isOpen, setQuery]);
	useEffect(() => {
		selectedIndexRef.current = -1;
	}, [searchResult]);
	const getResultLinks = useCallback(() => {
		if (!resultsRef.current) return [];
		return Array.from(resultsRef.current.querySelectorAll("[data-search-result-link]"));
	}, []);
	const handleDialogKeyDown = useCallback((event) => {
		const links = getResultLinks();
		if (links.length === 0) return;
		if (event.key === "ArrowDown") {
			event.preventDefault();
			selectedIndexRef.current = Math.min(selectedIndexRef.current + 1, links.length - 1);
			links[selectedIndexRef.current]?.focus();
			return;
		}
		if (event.key === "ArrowUp") {
			event.preventDefault();
			if (selectedIndexRef.current > 0) {
				selectedIndexRef.current--;
				links[selectedIndexRef.current]?.focus();
			} else if (selectedIndexRef.current === 0) {
				selectedIndexRef.current = -1;
				inputRef.current?.focus();
			}
			return;
		}
		if (event.key === "Enter") {
			const active = document.activeElement;
			if (active instanceof HTMLAnchorElement && active.dataset.searchResultLink === "true") {
				event.preventDefault();
				closeDialog();
			}
		}
	}, [getResultLinks, closeDialog]);
	const handleInputChange = useCallback((event) => {
		setQuery(event.target.value);
	}, [setQuery]);
	const resultsContent = useMemo(() => {
		if (debouncedQuery.trim().length === 0) return /* @__PURE__ */ jsx("div", {
			className: "px-4 py-12 text-center text-sm text-zinc-500",
			children: "Type to search documentation"
		});
		if (AsyncResult.isWaiting(searchResult) || AsyncResult.isInitial(searchResult)) return /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center justify-center gap-2 px-4 py-12 text-center text-zinc-500",
			children: [/* @__PURE__ */ jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" }), /* @__PURE__ */ jsx("span", { children: "Searching..." })]
		});
		if (AsyncResult.isFailure(searchResult)) return /* @__PURE__ */ jsx("div", {
			className: "flex flex-col items-center justify-center gap-2 px-4 py-12 text-center text-sm text-red-400",
			children: "Search failed. Please try again."
		});
		if (AsyncResult.isSuccess(searchResult)) {
			const results = searchResult.value ?? [];
			if (results.length === 0) return /* @__PURE__ */ jsxs("div", {
				className: "px-4 py-12 text-center text-sm text-zinc-500",
				children: [
					"No results found for “",
					debouncedQuery,
					"”"
				]
			});
			return /* @__PURE__ */ jsx("ul", {
				className: "space-y-4",
				children: results.map((result) => /* @__PURE__ */ jsx(SearchResultItem, { result }, result.id))
			});
		}
		return /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center justify-center gap-2 px-4 py-12 text-center text-zinc-500",
			children: [/* @__PURE__ */ jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" }), /* @__PURE__ */ jsx("span", { children: "Searching..." })]
		});
	}, [searchResult, debouncedQuery]);
	if (!isOpen) return null;
	const modKey = isMac ? "⌘" : "Ctrl";
	return /* @__PURE__ */ jsxs("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "search-dialog-label",
		className: "fixed inset-0 z-250",
		children: [
			/* @__PURE__ */ jsx("span", {
				id: "search-dialog-label",
				className: "sr-only",
				children: "Search documentation"
			}),
			/* @__PURE__ */ jsx("span", {
				id: "search-instructions",
				className: "sr-only",
				children: "Type to search. Use arrow keys to navigate results. Press Enter to select. Press Escape to close."
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: closeDialog,
				className: "absolute inset-0 bg-zinc-950/70 backdrop-blur-sm",
				"aria-label": "Close search",
				tabIndex: -1
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto mt-24 w-[min(40rem,calc(100%-2rem))] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl",
				onKeyDown: handleDialogKeyDown,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "group flex items-center gap-2 border-b border-zinc-800 px-4 py-3.5",
						children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "search-dialog-input",
								className: "shrink-0 cursor-pointer text-zinc-500 transition-colors group-focus-within:text-zinc-300",
								children: /* @__PURE__ */ jsx(Search, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("input", {
								ref: inputRef,
								id: "search-dialog-input",
								value: query,
								onChange: handleInputChange,
								className: "w-full rounded-md border-none bg-transparent px-2 py-1 text-sm text-white transition-colors outline-none placeholder:text-zinc-500 focus:bg-zinc-800/50",
								style: { outline: "none" },
								placeholder: "Search documentation...",
								"aria-label": "Search documentation",
								"aria-describedby": "search-instructions",
								"aria-controls": "search-results",
								"aria-expanded": AsyncResult.isSuccess(searchResult) && Array.isArray(searchResult.value) && searchResult.value.length > 0,
								autoComplete: "off",
								autoCorrect: "off",
								autoCapitalize: "off",
								spellCheck: false
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: closeDialog,
								className: "rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100",
								"aria-label": "Close search",
								children: /* @__PURE__ */ jsx(X, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								})
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						id: "search-results",
						ref: resultsRef,
						role: "region",
						"aria-label": "Search results",
						"aria-live": "polite",
						"aria-atomic": "false",
						className: "max-h-96 overflow-y-auto p-3",
						children: resultsContent
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-t border-zinc-800 px-4 py-2.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 text-xs text-zinc-500",
							children: [/* @__PURE__ */ jsx(MixedbreadLogo_default, {
								className: "h-4 w-4 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ jsxs("span", { children: [
								"Search powered by",
								" ",
								/* @__PURE__ */ jsx("a", {
									href: "https://mixedbread.com",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-zinc-400 transition-colors hover:text-zinc-100",
									children: "Mixedbread"
								})
							] })]
						}), /* @__PURE__ */ jsxs("div", {
							"aria-hidden": "true",
							className: "hidden items-center gap-3 text-xs text-zinc-500 sm:flex",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ jsx("kbd", {
											className: "rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-sans text-[10px] text-zinc-300",
											children: "↑"
										}),
										/* @__PURE__ */ jsx("kbd", {
											className: "rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-sans text-[10px] text-zinc-300",
											children: "↓"
										}),
										/* @__PURE__ */ jsx("span", { children: "navigate" })
									]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ jsx("kbd", {
										className: "rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-sans text-[10px] text-zinc-300",
										children: "↵"
									}), /* @__PURE__ */ jsx("span", { children: "select" })]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ jsxs("kbd", {
										className: "rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-sans text-[10px] text-zinc-300",
										children: [modKey, "K"]
									}), /* @__PURE__ */ jsx("span", { children: "open" })]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ jsx("kbd", {
										className: "rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-sans text-[10px] text-zinc-300",
										children: "esc"
									}), /* @__PURE__ */ jsx("span", { children: "close" })]
								})
							]
						})]
					})
				]
			})
		]
	});
});
function SearchResultItem({ result }) {
	return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("div", {
		className: "overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950",
		children: [/* @__PURE__ */ jsxs("a", {
			href: result.href,
			"data-search-result-link": "true",
			className: "block px-4 py-3 text-sm transition-colors hover:bg-zinc-800/50 focus:bg-zinc-800/50 focus:ring-2 focus:ring-zinc-600 focus:outline-none focus:ring-inset",
			children: [/* @__PURE__ */ jsx("div", {
				className: "font-medium text-white",
				children: result.title
			}), result.description ? /* @__PURE__ */ jsx("div", {
				className: "mt-0.5 text-xs text-zinc-400",
				children: result.description
			}) : null]
		}), result.chunks.length > 0 ? /* @__PURE__ */ jsx("ul", {
			className: "divide-y divide-zinc-800 border-t border-zinc-800",
			children: result.chunks.map((chunk) => /* @__PURE__ */ jsx(SearchResultChunkItem, {
				href: result.href,
				chunk
			}, chunk.id))
		}) : null]
	}) });
}
function SearchResultChunkItem({ href, chunk }) {
	return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
		href: `${href}#${chunk.anchorId}`,
		"data-search-result-link": "true",
		className: "block px-4 py-2.5 pl-10 text-sm transition-colors hover:bg-zinc-800/50 focus:bg-zinc-800/50 focus:ring-2 focus:ring-zinc-600 focus:outline-none focus:ring-inset",
		children: [/* @__PURE__ */ jsx("div", {
			className: "truncate text-xs font-medium text-zinc-300",
			children: chunk.title
		}), chunk.snippet ? /* @__PURE__ */ jsx("div", {
			className: "mt-0.5 truncate text-xs text-zinc-500",
			children: chunk.snippet
		}) : null]
	}) });
}
//#endregion
//#region src/components/navigation/Navigation.astro
createAstro("http://localhost:4321");
var $$Navigation = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Navigation;
	const { transparent = false, activeSlug, wide = false } = Astro.props;
	const showThemeToggle = activeSlug === "playground" || activeSlug === "docs";
	const mobilePrimaryLinks = getNavigationLinks("mobile", "primary");
	const mobileSocialLinks = getNavigationLinks("mobile", "social");
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["fixed top-0 right-0 left-0 z-100 w-full will-change-transform backdrop-blur-sm", transparent ? "" : "border-b border-zinc-200 bg-zinc-50/85 dark:border-zinc-800 dark:bg-zinc-950/85"], "class:list")}><div class="w-full"><header${addAttribute(["relative mx-auto w-full px-4", wide ? "max-w-352" : "max-w-295"], "class:list")}><nav class="flex h-16 items-center">${renderComponent($$result, "NavigationLogo", $$NavigationLogo, {})}<div class="ml-8 hidden items-center gap-6 md:flex">${renderComponent($$result, "NavigationLinks", $$NavigationLinks, {
		"transparent": transparent,
		"activeSlug": activeSlug
	})}</div>${renderComponent($$result, "NavigationMobileMenu", $$NavigationMobileMenu, {
		"transparent": transparent,
		"primaryLinks": mobilePrimaryLinks,
		"socialLinks": mobileSocialLinks,
		"activeSlug": activeSlug
	})}<div class="ml-auto hidden items-center gap-4.5 md:flex">${renderComponent($$result, "NavigationDesktopActions", $$NavigationDesktopActions, {
		"transparent": transparent,
		"showThemeToggle": showThemeToggle
	})}</div></nav></header></div></div>${renderComponent($$result, "SearchDialogIsland", SearchDialogIsland, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/ranjit/Documents/deepecom/website/src/components/navigation/SearchDialogIsland.tsx",
		"client:component-export": "default"
	})}`;
}, "/home/ranjit/Documents/deepecom/website/src/components/navigation/Navigation.astro", void 0);
//#endregion
//#region src/lib/constants/skip-link.ts
var PAGE_TITLE_ID = "_top";
//#endregion
//#region src/components/SkipLink.astro
var $$SkipLink = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Link", $$Link, {
		"href": `#${PAGE_TITLE_ID}`,
		"data-skip-link": true,
		"class": cn("fixed top-3 inset-s-3 -translate-y-[200%] px-4 py-2", "z-1000 rounded-md bg-zinc-50 text-zinc-950 no-underline shadow-lg", "transition-transform duration-150 focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-white")
	}, { "default": ($$result) => renderTemplate`Skip to content` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/components/SkipLink.astro", void 0);
//#endregion
//#region src/layouts/BaseLayout.astro
createAstro("http://localhost:4321");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title = "Effect | Production Grade TypeScript", description, forceDark = false } = Astro.props;
	const getOgImagePath = () => {
		let slug = Astro.url.pathname.replace(/^\//, "").replace(/\/$/, "");
		if (slug.length === 0) slug = "index";
		return `/og/${slug}.png`;
	};
	const ogImagePath = getOgImagePath();
	new URL(ogImagePath, Astro.url.origin);
	const pagePathname = Astro.url.pathname.replace(/\/$/, "");
	new URL(pagePathname, Astro.site);
	return renderTemplate`<html lang="en"${addAttribute([{ dark: forceDark }], "class:list")}${spreadAttributes(forceDark ? { "data-force-dark": "" } : {})}><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width">${renderComponent($$result, "Font", $$Font, {
		"cssVariable": "--font-inter",
		"preload": true
	})}${renderComponent($$result, "Font", $$Font, {
		"cssVariable": "--font-jetbrains-mono",
		"preload": true
	})}<link href="https://cdn.jsdelivr.net/npm/remixicon@4.7.0/fonts/remixicon.css" rel="stylesheet"><script>
      ;(function () {
        var force = document.documentElement.hasAttribute("data-force-dark")
        if (force) {
          document.documentElement.classList.add("dark")
          document.documentElement.dataset.theme = "dark"
          return
        }
        var stored = localStorage.getItem("theme")
        if (stored) { try { stored = JSON.parse(stored) } catch (_) {} }
        var isDark
        if (stored === "light") {
          isDark = false
        } else if (stored === "dark") {
          isDark = true
        } else if (stored === "system") {
          isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        } else {
          isDark = true
        }
        document.documentElement.classList.toggle("dark", isDark)
        document.documentElement.dataset.theme = isDark ? "dark" : "light"
        new MutationObserver(function () {
          var dark = document.documentElement.classList.contains("dark")
          document.documentElement.dataset.theme = dark ? "dark" : "light"
        }).observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        })
      })()
    <\/script>${renderHead($$result)}</head><body class="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-white">${renderComponent($$result, "SkipLink", $$SkipLink, {})}${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "/home/ranjit/Documents/deepecom/website/src/layouts/BaseLayout.astro", void 0);
//#endregion
export { cn as a, createLucideIcon_default as c, $$Footer as i, createSvgComponent as l, PAGE_TITLE_ID as n, LinkedIn_default as o, $$Navigation as r, ArrowUpRight as s, $$BaseLayout as t };
