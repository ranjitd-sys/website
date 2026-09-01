import { M as FontFamilyNotFound, V as InvalidComponentArgs, X as MissingGetFontFileRequestUrl, v as inferRemoteSize$1, xt as AstroError, z as ImageMissingAlt } from "./path_Dp8OxFoI.mjs";
import { c as isRemoteImage, l as resolveSrc, s as isESMImportedImage } from "./service_CxcZUxOh.mjs";
import { j as createAstro, k as unescapeHTML, r as spreadAttributes, v as renderTemplate, x as addAttribute, y as maybeRenderHead } from "./jsx-runtime_6Vijajm9.mjs";
import { n as getImage$1, t as getConfiguredImageService } from "./assets_9u0gQUzy.mjs";
import * as mime from "mrmime";
//#region node_modules/astro/dist/runtime/server/astro-component.js
function validateArgs(args) {
	if (args.length !== 3) return false;
	if (!args[0] || typeof args[0] !== "object") return false;
	return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
	const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
	const fn = (...args) => {
		if (!validateArgs(args)) throw new AstroError({
			...InvalidComponentArgs,
			message: InvalidComponentArgs.message(name)
		});
		return cb(...args);
	};
	Object.defineProperty(fn, "name", {
		value: name,
		writable: false
	});
	fn.isAstroComponentFactory = true;
	fn.moduleId = moduleId;
	fn.propagation = propagation;
	return fn;
}
function createComponentWithOptions(opts) {
	return baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
}
function createComponent(arg1, moduleId, propagation) {
	if (typeof arg1 === "function") return baseCreateComponent(arg1, moduleId, propagation);
	else return createComponentWithOptions(arg1);
}
//#endregion
//#region node_modules/astro/components/Image.astro
createAstro("http://localhost:4321");
var $$Image = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Image;
	const props = Astro2.props;
	if (props.alt === void 0 || props.alt === null) throw new AstroError(ImageMissingAlt);
	if (typeof props.width === "string") props.width = Number.parseInt(props.width);
	if (typeof props.height === "string") props.height = Number.parseInt(props.height);
	if ((props.layout ?? imageConfig.layout ?? "none") !== "none") {
		props.layout ??= imageConfig.layout;
		props.fit ??= imageConfig.objectFit ?? "cover";
		props.position ??= imageConfig.objectPosition ?? "center";
	} else if (imageConfig.objectFit || imageConfig.objectPosition) {
		props.fit ??= imageConfig.objectFit;
		props.position ??= imageConfig.objectPosition;
	}
	const image = await getImage(props);
	const additionalAttributes = {};
	if (image.srcSet.values.length > 0) additionalAttributes.srcset = image.srcSet.attribute;
	const { class: className, ...attributes } = {
		...additionalAttributes,
		...image.attributes
	};
	return renderTemplate`${maybeRenderHead($$result)}<img${addAttribute(image.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}>`;
}, "/home/ranjit/Documents/deepecom/website/node_modules/astro/components/Image.astro", void 0);
//#endregion
//#region node_modules/astro/components/Picture.astro
createAstro("http://localhost:4321");
var $$Picture = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Picture;
	const defaultFormats = ["webp"];
	const defaultFallbackFormat = "png";
	const specialFormatsFallback = [
		"gif",
		"svg",
		"jpg",
		"jpeg"
	];
	const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
	if (props.alt === void 0 || props.alt === null) throw new AstroError(ImageMissingAlt);
	const scopedStyleClass = props.class?.match(/\bastro-\w{8}\b/)?.[0];
	if (scopedStyleClass) if (pictureAttributes.class) pictureAttributes.class = `${pictureAttributes.class} ${scopedStyleClass}`;
	else pictureAttributes.class = scopedStyleClass;
	const useResponsive = (props.layout ?? imageConfig.layout ?? "none") !== "none";
	if (useResponsive) {
		props.layout ??= imageConfig.layout;
		props.fit ??= imageConfig.objectFit ?? "cover";
		props.position ??= imageConfig.objectPosition ?? "center";
	} else if (imageConfig.objectFit || imageConfig.objectPosition) {
		props.fit ??= imageConfig.objectFit;
		props.position ??= imageConfig.objectPosition;
	}
	for (const key in props) if (key.startsWith("data-astro-cid")) pictureAttributes[key] = props[key];
	const originalSrc = await resolveSrc(props.src);
	if (props.inferSize && isRemoteImage(originalSrc)) {
		const remoteSize = await inferRemoteSize(originalSrc);
		delete props.inferSize;
		props.width ??= remoteSize.width;
		props.height ??= remoteSize.height;
	}
	const optimizedImages = await Promise.all(formats.map(async (format) => await getImage({
		...props,
		src: originalSrc,
		format,
		widths: props.widths,
		densities: props.densities
	})));
	const clonedSrc = isESMImportedImage(originalSrc) ? originalSrc.clone ?? originalSrc : originalSrc;
	let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
	if (!fallbackFormat && isESMImportedImage(clonedSrc) && specialFormatsFallback.includes(clonedSrc.format)) resultFallbackFormat = clonedSrc.format;
	const fallbackImage = await getImage({
		...props,
		format: resultFallbackFormat,
		widths: props.widths,
		densities: props.densities
	});
	const imgAdditionalAttributes = {};
	const sourceAdditionalAttributes = {};
	if (props.sizes) sourceAdditionalAttributes.sizes = props.sizes;
	if (fallbackImage.srcSet.values.length > 0) imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
	const { class: className, ...attributes } = {
		...imgAdditionalAttributes,
		...fallbackImage.attributes
	};
	return renderTemplate`${maybeRenderHead($$result)}<picture${spreadAttributes(pictureAttributes)}>${Object.entries(optimizedImages).map(([_, image]) => {
		return renderTemplate`<source${addAttribute(props.densities || !props.densities && !props.widths && !useResponsive ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute, "srcset")}${addAttribute(mime.lookup(image.options.format ?? image.src) ?? `image/${image.options.format}`, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
	})}<img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}></picture>`;
}, "/home/ranjit/Documents/deepecom/website/node_modules/astro/components/Picture.astro", void 0);
//#endregion
//#region \0virtual:astro:assets/fonts/internal
var componentDataByCssVariable = /* @__PURE__ */ new Map([["--font-inter", {
	"preloads": [{
		"style": "italic",
		"subset": "latin",
		"type": "woff2",
		"url": "/_astro/fonts/91753f8d8da3aeb7.woff2",
		"weight": "100"
	}, {
		"style": "normal",
		"subset": "latin",
		"type": "woff2",
		"url": "/_astro/fonts/e868cdf4720e9ea5.woff2",
		"weight": "100"
	}],
	"css": "@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/91753f8d8da3aeb7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:100;font-style:italic;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/91753f8d8da3aeb7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:200;font-style:italic;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/91753f8d8da3aeb7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:300;font-style:italic;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/91753f8d8da3aeb7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:400;font-style:italic;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/91753f8d8da3aeb7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:500;font-style:italic;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/91753f8d8da3aeb7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:600;font-style:italic;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/91753f8d8da3aeb7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:700;font-style:italic;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/91753f8d8da3aeb7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:800;font-style:italic;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/91753f8d8da3aeb7.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:900;font-style:italic;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/e868cdf4720e9ea5.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:100;font-style:normal;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/e868cdf4720e9ea5.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:200;font-style:normal;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/e868cdf4720e9ea5.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:300;font-style:normal;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/e868cdf4720e9ea5.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:400;font-style:normal;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/e868cdf4720e9ea5.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:500;font-style:normal;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/e868cdf4720e9ea5.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:600;font-style:normal;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/e868cdf4720e9ea5.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:700;font-style:normal;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/e868cdf4720e9ea5.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:800;font-style:normal;}@font-face{font-family:Inter-27247fdfb072aab2;src:url(\"/_astro/fonts/e868cdf4720e9ea5.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:900;font-style:normal;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100;font-style:italic;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:200;font-style:italic;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:300;font-style:italic;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:400;font-style:italic;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:500;font-style:italic;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:600;font-style:italic;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial Bold\";src:local(\"Arial Bold\");font-display:swap;font-weight:700;font-style:italic;size-adjust:100.1017%;ascent-override:96.7765%;descent-override:24.0966%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial Bold\";src:local(\"Arial Bold\");font-display:swap;font-weight:800;font-style:italic;size-adjust:100.1017%;ascent-override:96.7765%;descent-override:24.0966%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial Bold\";src:local(\"Arial Bold\");font-display:swap;font-weight:900;font-style:italic;size-adjust:100.1017%;ascent-override:96.7765%;descent-override:24.0966%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100;font-style:normal;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:200;font-style:normal;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:300;font-style:normal;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:400;font-style:normal;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:500;font-style:normal;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:600;font-style:normal;size-adjust:107.7766%;ascent-override:89.885%;descent-override:22.3806%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial Bold\";src:local(\"Arial Bold\");font-display:swap;font-weight:700;font-style:normal;size-adjust:100.1017%;ascent-override:96.7765%;descent-override:24.0966%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial Bold\";src:local(\"Arial Bold\");font-display:swap;font-weight:800;font-style:normal;size-adjust:100.1017%;ascent-override:96.7765%;descent-override:24.0966%;line-gap-override:0%;}@font-face{font-family:\"Inter-27247fdfb072aab2 fallback: Arial Bold\";src:local(\"Arial Bold\");font-display:swap;font-weight:900;font-style:normal;size-adjust:100.1017%;ascent-override:96.7765%;descent-override:24.0966%;line-gap-override:0%;}:root{--font-inter:Inter-27247fdfb072aab2,\"Inter-27247fdfb072aab2 fallback: Arial\",\"Inter-27247fdfb072aab2 fallback: Arial Bold\",ui-sans-serif,system-ui,sans-serif;}"
}], ["--font-jetbrains-mono", {
	"preloads": [{
		"style": "italic",
		"subset": "latin",
		"type": "woff2",
		"url": "/_astro/fonts/d7e4d72475f7808f.woff2",
		"weight": "300"
	}, {
		"style": "normal",
		"subset": "latin",
		"type": "woff2",
		"url": "/_astro/fonts/63515b4a3122509a.woff2",
		"weight": "300"
	}],
	"css": "@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/d7e4d72475f7808f.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:300;font-style:italic;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/d7e4d72475f7808f.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:400;font-style:italic;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/d7e4d72475f7808f.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:500;font-style:italic;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/d7e4d72475f7808f.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:600;font-style:italic;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/d7e4d72475f7808f.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:700;font-style:italic;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/63515b4a3122509a.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:300;font-style:normal;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/63515b4a3122509a.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:400;font-style:normal;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/63515b4a3122509a.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:500;font-style:normal;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/63515b4a3122509a.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:600;font-style:normal;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b\";src:url(\"/_astro/fonts/63515b4a3122509a.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:700;font-style:normal;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:300;font-style:italic;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:400;font-style:italic;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:500;font-style:italic;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:600;font-style:italic;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:700;font-style:italic;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:300;font-style:normal;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:400;font-style:normal;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:500;font-style:normal;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:600;font-style:normal;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}@font-face{font-family:\"JetBrains Mono-d0c72186da04596b fallback: Courier New\";src:local(\"Courier New\");font-display:swap;font-weight:700;font-style:normal;size-adjust:99.9837%;ascent-override:102.0166%;descent-override:30.0049%;}:root{--font-jetbrains-mono:\"JetBrains Mono-d0c72186da04596b\",\"JetBrains Mono-d0c72186da04596b fallback: Courier New\",ui-monospace,SFMono-Regular,monospace;}"
}]]);
//#endregion
//#region node_modules/astro/dist/assets/fonts/core/filter-preloads.js
function filterPreloads(data, preload) {
	if (!preload) return null;
	if (preload === true) return data;
	return data.filter(({ weight, style, subset }) => preload.some((p) => {
		if (p.weight !== void 0 && weight !== void 0 && !checkWeight(p.weight.toString(), weight)) return false;
		if (p.style !== void 0 && p.style !== style) return false;
		if (p.subset !== void 0 && p.subset !== subset) return false;
		return true;
	}));
}
function checkWeight(input, target) {
	const trimmedInput = input.trim();
	if (trimmedInput.includes(" ")) return trimmedInput === target;
	if (target.includes(" ")) {
		const [a, b] = target.split(" ");
		const parsedInput = Number.parseInt(input);
		return parsedInput >= Number.parseInt(a) && parsedInput <= Number.parseInt(b);
	}
	return input === target;
}
//#endregion
//#region node_modules/astro/components/Font.astro
createAstro("http://localhost:4321");
var $$Font = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Font;
	const { cssVariable, preload = false } = Astro.props;
	const data = componentDataByCssVariable.get(cssVariable);
	if (!data) throw new AstroError({
		...FontFamilyNotFound,
		message: FontFamilyNotFound.message(cssVariable)
	});
	const filteredPreloadData = filterPreloads(data.preloads, preload);
	return renderTemplate`<style>${unescapeHTML(data.css)}</style>${filteredPreloadData?.map(({ url, type }) => renderTemplate`<link rel="preload"${addAttribute(url, "href")} as="font"${addAttribute(`font/${type}`, "type")} crossorigin>`)}`;
}, "/home/ranjit/Documents/deepecom/website/node_modules/astro/components/Font.astro", void 0);
//#endregion
//#region node_modules/astro/dist/assets/fonts/infra/ssr-runtime-font-file-url-resolver.js
var SsrRuntimeFontFileUrlResolver = class {
	#urls;
	constructor({ urls }) {
		this.#urls = urls;
	}
	resolve(url, requestUrl) {
		if (!this.#urls.has(url)) return null;
		if (!url.startsWith("/")) return url;
		if (!requestUrl) throw new AstroError(MissingGetFontFileRequestUrl);
		return `${requestUrl.origin}${url}`;
	}
};
new SsrRuntimeFontFileUrlResolver({ urls: /* @__PURE__ */ new Set([
	"/_astro/fonts/91753f8d8da3aeb7.woff2",
	"/_astro/fonts/e868cdf4720e9ea5.woff2",
	"/_astro/fonts/d7e4d72475f7808f.woff2",
	"/_astro/fonts/63515b4a3122509a.woff2"
]) });
//#endregion
//#region \0astro:assets
var assetQueryParams = void 0;
var imageConfig = {
	"endpoint": { "route": "/_image" },
	"service": {
		"entrypoint": "astro/assets/services/sharp",
		"config": {}
	},
	"dangerouslyProcessSVG": false,
	"domains": [],
	"remotePatterns": [],
	"responsiveStyles": false
};
Object.defineProperty(imageConfig, "assetQueryParams", {
	value: assetQueryParams,
	enumerable: false,
	configurable: true
});
var inferRemoteSize = async (url) => {
	return (await getConfiguredImageService()).getRemoteSize?.(url, imageConfig) ?? inferRemoteSize$1(url, imageConfig);
};
var getImage = async (options) => await getImage$1(options, imageConfig);
//#endregion
export { createComponent as i, $$Font as n, $$Image as r, imageConfig as t };
