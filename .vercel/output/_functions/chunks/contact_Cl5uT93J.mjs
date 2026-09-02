import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { r as Button } from "./site-footer_CKJGCi14.mjs";
import { n as $$PageLayout, t as $$PageHero } from "./PageHero_DV03to9n.mjs";
import { t as __exportAll } from "./index_BNdLphpM.mjs";
import { useId, useState } from "react";
import { clsx } from "clsx";
import { ArrowRight, Calendar, CircleCheck, Clock, Download, Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/landing/ui/label.tsx
function Label({ className, ...props }) {
	return /* @__PURE__ */ jsx("label", {
		className: twMerge(clsx("text-sm font-medium text-ink-900", className)),
		...props
	});
}
//#endregion
//#region src/components/landing/contact-form.tsx
var FACTS = [
	{
		icon: Clock,
		title: "Response within one business day",
		desc: "Real humans, no ticket black holes."
	},
	{
		icon: Calendar,
		title: "Free guided demo",
		desc: "See reconciliation running on sample settlements."
	},
	{
		icon: Download,
		title: "Migration assistance included",
		desc: "We help import backdated settlements and map SKUs."
	}
];
var fieldBaseClass = "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
function ContactForm() {
	const [refId, setRefId] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const nameId = useId();
	const emailId = useId();
	const phoneId = useId();
	const msgId = useId();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}
		setIsSubmitting(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 800));
			const referenceId = Math.floor(1e5 + Math.random() * 9e5);
			setRefId(String(referenceId));
		} finally {
			setIsSubmitting(false);
		}
	};
	if (refId !== null) return /* @__PURE__ */ jsx("div", {
		className: "rounded-2xl border border-border bg-white p-8 shadow-card",
		role: "status",
		"aria-live": "polite",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-4 sm:items-center",
			children: [/* @__PURE__ */ jsx("span", {
				className: "grid size-13 shrink-0 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700",
				children: /* @__PURE__ */ jsx(CircleCheck, { size: 26 })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2.5",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-bold tracking-tight text-ink",
					children: "Message sent"
				}), /* @__PURE__ */ jsxs("span", {
					className: "rounded-full border border-blue-100 bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground num",
					children: ["#", refId]
				})]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm/relaxed text-muted-foreground",
				children: "We'll reply within 1 business day."
			})] })]
		})
	});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("div", {
		className: "reveal",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "eyebrow",
				children: "Contact us"
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "h2 mt-1",
				children: "Get in touch."
			}),
			/* @__PURE__ */ jsx("p", {
				className: "lead mt-4 max-w-xl",
				children: "Do you need help with something, or have questions about a feature? Tell us about your store and we'll show you exactly how DeepEcom fits your workflow."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-9",
				children: FACTS.map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-3.5 border-b border-subtle py-3.5 last:border-0",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid size-9.5 shrink-0 place-items-center rounded-xl border border-blue-100 bg-accent text-primary",
						children: /* @__PURE__ */ jsx(Icon, { size: 18 })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", {
						className: "block text-[14.5px] font-bold text-ink",
						children: title
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[13.5px] text-muted-foreground",
						children: desc
					})] })]
				}, title))
			})
		]
	}), /* @__PURE__ */ jsxs("form", {
		noValidate: true,
		onSubmit: handleSubmit,
		className: "reveal grid gap-4.5 rounded-2xl border border-border bg-white p-6 shadow-card sm:grid-cols-2 md:p-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-1.5",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: nameId,
					children: "Full name"
				}), /* @__PURE__ */ jsx("input", {
					id: nameId,
					name: "name",
					type: "text",
					required: true,
					placeholder: "Priya Sharma",
					autoComplete: "name",
					className: `${fieldBaseClass} h-10`
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-1.5",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: emailId,
					children: "Email"
				}), /* @__PURE__ */ jsx("input", {
					id: emailId,
					name: "email",
					type: "email",
					required: true,
					placeholder: "priya@yourstore.com",
					autoComplete: "email",
					className: `${fieldBaseClass} h-10`
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-1.5 sm:col-span-2",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: phoneId,
					children: "Contact number"
				}), /* @__PURE__ */ jsx("input", {
					id: phoneId,
					name: "phone",
					type: "tel",
					placeholder: "+91 98765 43210",
					autoComplete: "tel",
					className: `${fieldBaseClass} h-10`
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-1.5 sm:col-span-2",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: msgId,
					children: "Message"
				}), /* @__PURE__ */ jsx("textarea", {
					id: msgId,
					name: "message",
					required: true,
					rows: 5,
					placeholder: "Tell us about your store — channels, monthly order volume, and what you'd like to automate…",
					className: fieldBaseClass
				})]
			}),
			/* @__PURE__ */ jsx(Button, {
				type: "submit",
				size: "lg",
				disabled: isSubmitting,
				className: "gap-2 sm:col-span-2",
				children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Loader2, {
					className: "animate-spin",
					size: 16
				}), "Sending..."] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: ["Submit", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })] })
			}),
			/* @__PURE__ */ jsx("p", {
				className: "-mt-2 text-center text-xs text-zinc-400 sm:col-span-2",
				children: "We'll never share your details. No spam, ever."
			})
		]
	})] });
}
//#endregion
//#region src/pages/contact.astro
var contact_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Contact,
	file: () => $$file,
	url: () => $$url
});
var $$Contact = createComponent(($$result, $$props, $$slots) => {
	const expectations = [
		{
			title: "Response within one business day",
			description: "Real humans, no ticket black holes."
		},
		{
			title: "Free guided demo",
			description: "See reconciliation running on sample settlements."
		},
		{
			title: "Migration assistance included",
			description: "We help import backdated settlements and map SKUs."
		}
	];
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Book a Demo — Talk to DeepEcom",
		"description": "Book a free guided demo of DeepEcom. Tell us about your store and we'll show you exactly how DeepEcom fits your workflow."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHero", $$PageHero, {
		"eyebrow": "BOOK A DEMO",
		"title": "Let's talk about your ecommerce business.",
		"lead": "Tell us about your store and we'll show you exactly how DeepEcom fits your workflow."
	})}${maybeRenderHead($$result)}<section class="mx-auto max-w-2xl px-6 pb-20">${renderComponent($$result, "ContactForm", ContactForm, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "@/components/landing/contact-form",
		"client:component-export": "default"
	})}</section><section class="mx-auto max-w-2xl px-6 pb-24"><div class="rounded-2xl border border-border bg-white p-7 shadow-card"><h2 class="text-lg font-bold text-ink-900">What to expect</h2><ul class="mt-5 flex flex-col gap-4">${expectations.map((e) => renderTemplate`<li class="flex items-start gap-3"><span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500"></span><div><strong class="block text-sm font-semibold text-ink-900">${e.title}</strong><span class="text-sm text-muted-foreground">${e.description}</span></div></li>`)}</ul></div></section>` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/contact.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/contact.astro";
var $$url = "/contact";
//#endregion
//#region \0virtual:astro:page:src/pages/contact@_@astro
var page = () => contact_exports;
//#endregion
export { page };
