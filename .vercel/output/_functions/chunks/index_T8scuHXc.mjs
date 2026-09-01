import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { b as renderHead, f as Fragment$2, h as renderSlot, j as createAstro, k as unescapeHTML, u as renderComponent, v as renderTemplate, x as addAttribute, y as maybeRenderHead } from "./jsx-runtime_6Vijajm9.mjs";
import { i as createComponent, n as $$Font } from "./_astro_assets_BhK2b17i.mjs";
import { t as renderScript } from "./script_Divgp8oK.mjs";
import { useEffect, useId, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Button, buttonVariants } from "@deepecom/ui/ui/button";
import { Label } from "@deepecom/ui/ui/label";
import { ArrowNarrowRightIcon, ArrowNarrowUpIcon, BellIcon, CalendarIcon, CheckIcon, CircleCheckIcon, ClockIcon, MenuIcon, SearchIcon, XIcon } from "@deepecom/ui/icons";
import { Badge } from "@deepecom/ui/ui/badge";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@deepecom/ui/ui/accordion";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@deepecom/ui/ui/tabs";
//#region src/components/landing/contact-form.tsx
var FACTS = [
	{
		icon: ClockIcon,
		title: "Response within one business day",
		desc: "Real humans, no ticket black holes."
	},
	{
		icon: CalendarIcon,
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
				children: /* @__PURE__ */ jsx(CircleCheckIcon, { size: 26 })
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
				}), "Sending..."] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: ["Submit", /* @__PURE__ */ jsx(ArrowNarrowRightIcon, { size: 16 })] })
			}),
			/* @__PURE__ */ jsx("p", {
				className: "-mt-2 text-center text-xs text-zinc-400 sm:col-span-2",
				children: "We'll never share your details. No spam, ever."
			})
		]
	})] });
}
//#endregion
//#region src/components/landing/sections/Contact.astro
var $$Contact = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="contact"><div class="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20">${renderComponent($$result, "ContactForm", ContactForm, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/ranjit/Documents/deepecom/website/src/components/landing/contact-form.tsx",
		"client:component-export": "default"
	})}</div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Contact.astro", void 0);
//#endregion
//#region src/components/landing/icons.tsx
var base = {
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.9,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
function LogoMark({ size = 26 }) {
	return /* @__PURE__ */ jsx("span", {
		className: "grid place-items-center rounded-[7px] bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_6px_rgba(79,70,229,0.35)]",
		style: {
			width: size,
			height: size
		},
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsxs("svg", {
			width: size * .5,
			height: size * .5,
			viewBox: "0 0 24 24",
			fill: "#fff",
			children: [
				/* @__PURE__ */ jsx("rect", {
					x: "3",
					y: "13",
					width: "4.5",
					height: "8",
					rx: "1"
				}),
				/* @__PURE__ */ jsx("rect", {
					x: "9.75",
					y: "8",
					width: "4.5",
					height: "13",
					rx: "1"
				}),
				/* @__PURE__ */ jsx("rect", {
					x: "16.5",
					y: "3",
					width: "4.5",
					height: "18",
					rx: "1"
				})
			]
		})
	});
}
function ReconcileIcon(props) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		...base,
		...props,
		children: [/* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 1 1-2.6-6.3" }), /* @__PURE__ */ jsx("path", { d: "M21 3v6h-6" })]
	});
}
function SyncIcon(props) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		...base,
		...props,
		children: [
			/* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
			/* @__PURE__ */ jsx("path", { d: "M7 10l5 5 5-5" }),
			/* @__PURE__ */ jsx("path", { d: "M12 15V3" })
		]
	});
}
function TrendIcon(props) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		...base,
		...props,
		children: [/* @__PURE__ */ jsx("path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }), /* @__PURE__ */ jsx("path", { d: "M7 13l4-4 4 3 5-6" })]
	});
}
function PieIcon(props) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		...base,
		...props,
		children: [/* @__PURE__ */ jsx("path", { d: "M21.2 15.9A10 10 0 1 1 8.2 2.8" }), /* @__PURE__ */ jsx("path", { d: "M22 12A10 10 0 0 0 12 2v10z" })]
	});
}
function AlertBellIcon(props) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		...base,
		...props,
		children: [/* @__PURE__ */ jsx("path", { d: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" }), /* @__PURE__ */ jsx("path", { d: "M13.7 21a2 2 0 0 1-3.4 0" })]
	});
}
function CheckCircle({ className = "" }) {
	return /* @__PURE__ */ jsx("span", {
		className: `grid h-6 w-6 shrink-0 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 ${className}`,
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("svg", {
			width: "12",
			height: "12",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.6",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: /* @__PURE__ */ jsx("path", { d: "M20 6L9 17l-5-5" })
		})
	});
}
//#endregion
//#region src/components/landing/sections/Clarity.astro
var $$Clarity = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="clarity"><div class="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 lg:gap-20"><div class="reveal"><span class="eyebrow">Why DeepEcom exists</span><h2 class="h2 mt-1">Clarity, not complexity.</h2><p class="lead mt-4 max-w-xl">DeepEcom isn't just a Tally sync tool — it's your ecommerce finance control center. Get complete visibility into sales, refunds, commissions, payment cycles and marketplace deductions from Amazon, Flipkart, Meesho and more, with powerful insights and GST-ready exports.</p><a href="#contact"${addAttribute(`${buttonVariants({ variant: "outline" })} mt-8`, "class")}>Schedule demo</a></div><div class="reveal rounded-2xl border border-border bg-white p-7 shadow-card md:p-9"><ul class="flex flex-col gap-4.5">${[
		"Real-time ecommerce payment reconciliation",
		"GST-friendly reports for accountants",
		"One-click sync with Tally, Zoho Books & Sap",
		"Insights dashboard to track margins & profits",
		"Works across Amazon, Flipkart, Meesho & others",
		"Built for scale — 10 to 100,000+ orders / month"
	].map((p) => renderTemplate`<li class="flex items-start gap-3 text-[15.5px] leading-snug font-semibold text-ink">${renderComponent($$result, "CheckCircle", CheckCircle, {})}${p}</li>`)}</ul></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Clarity.astro", void 0);
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
	return renderTemplate`${maybeRenderHead($$result)}<div class="dash-stage mt-14 border-y border-border py-14 md:mt-20 md:py-20"><div class="mx-auto max-w-6xl px-6"><div class="reveal overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card" role="img" aria-label="DeepEcom dashboard preview showing revenue metrics and recent marketplace settlements"><!-- topbar --><div class="flex items-center gap-3.5 border-b border-border bg-zinc-50/70 px-5 py-3"><div class="flex min-w-0 items-center gap-2 text-[13.5px] font-semibold text-ink"><span class="org inline-flex min-w-0 items-center gap-2"><span class="grid size-5.5 shrink-0 place-items-center rounded-md bg-ink text-[10px] font-bold tracking-wide text-white">AR</span><span class="truncate">Paragon Retail Pvt Ltd</span></span><span class="text-zinc-300">/</span><span class="font-normal text-muted-foreground">Overview</span></div><div class="ml-auto hidden min-w-52 items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-zinc-400 md:flex">${renderComponent($$result, "SearchIcon", SearchIcon, { "size": 13 })}Search orders, SKUs…<kbd class="ml-auto rounded border border-border bg-subtle px-1.5 py-px font-sans text-[10.5px]">⌘K</kbd></div><button type="button" class="relative grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-subtle" aria-label="Notifications">${renderComponent($$result, "BellIcon", BellIcon, { "size": 15 })}<span class="absolute top-1.5 right-2 size-1.5 rounded-full border-[1.5px] border-white bg-amber-500"></span></button><div class="hidden sm:flex" aria-hidden="true"><span class="grid size-7 place-items-center rounded-full border-[1.5px] border-accent bg-accent text-[10.5px] font-bold text-accent-foreground">RM</span><span class="-ml-1.5 grid size-7 place-items-center rounded-full border-[1.5px] border-white bg-subtle text-[10.5px] font-bold text-muted-foreground">AN</span><span class="-ml-1.5 grid size-7 place-items-center rounded-full border-[1.5px] border-white bg-subtle text-[10.5px] font-bold text-muted-foreground">+6</span></div></div><!-- body --><div class="flex flex-col gap-4 p-4 md:p-6"><!-- KPIs --><div class="grid grid-cols-2 gap-3.5 lg:grid-cols-4">${kpis.map((k) => renderTemplate`<div class="rounded-xl border border-border bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"><div class="text-[12.5px] font-medium text-muted-foreground">${k.label}</div><div class="mt-1.5 flex items-baseline gap-1.5">${renderComponent($$result, "KpiValue", KpiValue, {
		"target": k.target,
		"decimals": k.decimals,
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/ranjit/Documents/deepecom/website/src/components/landing/kpi-value.tsx",
		"client:component-export": "default"
	})}${k.unit && renderTemplate`<span class="text-sm font-semibold text-zinc-400">${k.unit}</span>`}</div><span class="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11.5px] font-semibold text-emerald-700">${renderComponent($$result, "ArrowNarrowUpIcon", ArrowNarrowUpIcon, {
		"size": 11,
		"strokeWidth": 2.5
	})}${k.delta}</span><div class="spark mt-3 flex h-[30px] items-end gap-[3px]" aria-hidden="true">${k.spark.map((h) => renderTemplate`<i${addAttribute(`height:${h}%`, "style")}></i>`)}</div></div>`)}</div><div class="grid gap-3.5 xl:grid-cols-[1fr_340px]"><!-- chart --><div class="overflow-hidden rounded-xl border border-border bg-white"><div class="flex items-center gap-2.5 border-b border-border px-4 py-3"><span class="text-sm font-bold tracking-tight text-ink">Net revenue</span><div class="ml-auto hidden items-center gap-3.5 text-[11.5px] font-medium text-muted-foreground sm:flex"><span><i class="mr-1.5 inline-block size-2 rounded-full bg-primary align-middle"></i>This year</span><span><i class="mr-1.5 inline-block size-2 rounded-full bg-zinc-300 align-middle"></i>Last year</span></div><span class="chip ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-muted-foreground sm:ml-0">${renderComponent($$result, "CalendarIcon", CalendarIcon, {
		"size": "12",
		"className": "text-zinc-400"
	})}Last 8 months</span></div><div class="relative px-2.5 pt-3 pb-1.5"><div class="pointer-events-none absolute top-[4%] right-[3.5%] rounded-lg bg-ink px-3 py-2 text-left leading-tight shadow-md"><div class="text-[10.5px] font-semibold tracking-wide text-zinc-400 uppercase">Aug 2026</div><div class="num text-sm font-bold">₹24.8L</div><div class="text-[11px] font-medium text-emerald-300">▲ 14.3% MoM</div></div><svg viewBox="0 0 720 264" fill="none" class="h-auto w-full" aria-hidden="true"><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4f46e5" stop-opacity="0.14"></stop><stop offset="100%" stop-color="#4f46e5" stop-opacity="0"></stop></linearGradient></defs><g stroke="#eeeef2"><line x1="64" y1="232" x2="704" y2="232"></line><line x1="64" y1="180" x2="704" y2="180"></line><line x1="64" y1="128" x2="704" y2="128"></line><line x1="64" y1="76" x2="704" y2="76"></line><line x1="64" y1="24" x2="704" y2="24"></line></g><g fill="#8b8b94" font-family="Inter, sans-serif" font-size="10.5"><text x="54" y="236" text-anchor="end">₹0</text><text x="54" y="184" text-anchor="end">₹7L</text><text x="54" y="132" text-anchor="end">₹14L</text><text x="54" y="80" text-anchor="end">₹21L</text><text x="54" y="28" text-anchor="end">₹28L</text><text x="72" y="256" text-anchor="middle">Jan</text><text x="160" y="256" text-anchor="middle">Feb</text><text x="248" y="256" text-anchor="middle">Mar</text><text x="336" y="256" text-anchor="middle">Apr</text><text x="424" y="256" text-anchor="middle">May</text><text x="512" y="256" text-anchor="middle">Jun</text><text x="600" y="256" text-anchor="middle">Jul</text><text x="688" y="256" text-anchor="middle" fill="#18181b" font-weight="600">Aug</text></g><path${addAttribute("M72,159 C112,159 120,151 160,151 C200,151 208,156 248,156 C288,156 296,140 336,140 C376,140 384,135 424,135 C464,135 472,119 512,119 C552,119 560,99 600,99 C640,99 648,79 688,79", "d")} stroke="#d4d4d8" stroke-width="1.75" stroke-dasharray="4 4" stroke-linecap="round"></path><path${addAttribute(`${line} L688,232 L72,232 Z`, "d")} fill="url(#areaFill)"></path><path${addAttribute(line, "d")} stroke="#4f46e5" stroke-width="2.25" stroke-linecap="round"></path><line x1="688" y1="48" x2="688" y2="232" stroke="#c7d2fe" stroke-dasharray="3 3"></line><circle cx="688" cy="48" r="8" fill="#4f46e5" fill-opacity="0.14"></circle><circle cx="688" cy="48" r="4" fill="#4f46e5" stroke="#fff" stroke-width="2"></circle></svg></div></div><!-- settlements feed --><aside class="hidden overflow-hidden rounded-xl border border-border bg-white xl:flex xl:flex-col"><div class="flex items-center gap-2.5 border-b border-border px-4 py-3"><span class="text-sm font-bold tracking-tight text-ink">Latest settlements</span><span class="live-dot ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-emerald-700 uppercase"><i class="size-[7px] rounded-full bg-emerald-600"></i>Live</span></div><div class="flex-1 divide-y divide-subtle">${feed.map((f) => renderTemplate`<div class="flex items-center gap-3 px-4 py-2.5"><span class="grid size-8.5 shrink-0 place-items-center rounded-[9px] border border-border bg-subtle text-xs font-bold text-muted-foreground">${f.init}</span><div class="min-w-0"><div class="truncate text-[13.5px] font-semibold text-ink">${f.name}</div><div class="text-[11.5px] text-zinc-400">${f.time}</div></div><div class="ml-auto text-right"><div class="num text-[13.5px] font-bold tracking-tight text-ink">${f.amt}</div>${renderComponent($$result, "Badge", Badge, {
		"variant": f.variant,
		"className": "mt-0.5"
	}, { "default": ($$result) => renderTemplate`${f.status}` })}</div></div>`)}</div><a href="#analytics" class="flex items-center gap-1.5 border-t border-border bg-zinc-50/70 px-4 py-2.5 text-[12.5px] font-semibold text-primary no-underline hover:text-indigo-700">View all settlements<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg></a></aside></div></div></div></div></div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/DashboardPreview.astro", void 0);
//#endregion
//#region src/components/landing/section-heading.astro
createAstro("http://localhost:4321");
var $$SectionHeading = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SectionHeading;
	const { eyebrow, title, lead, center = false } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["reveal", center && "mx-auto max-w-3xl text-center"], "class:list")}><span${addAttribute(["eyebrow", center && "eyebrow-center"], "class:list")}>${eyebrow}</span><h2 class="h2 mt-1">${title}</h2>${lead && renderTemplate`<p class="lead mt-4"${addAttribute(center, "class:max-w-xl")}>${lead}</p>`}${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/section-heading.astro", void 0);
//#endregion
//#region src/components/landing/faq-accordion.tsx
var FAQS = [
	["Can DeepEcom integrate with Amazon, Flipkart and other marketplaces?", "Yes. DeepEcom integrates with Amazon, Flipkart, Meesho, Myntra, Nykaa, Shopify and JioMart through secure read-only APIs. New marketplaces are added regularly based on customer demand — tell us which one you need."],
	["Is it possible to integrate multiple warehouses into Tally using DeepEcom?", "Absolutely. DeepEcom supports multi-warehouse inventory tracking with proper stock allocation and location mapping, so every warehouse syncs cleanly into Tally."],
	["My business operates in multiple states with different GST numbers. Can DeepEcom accommodate this?", "Yes. The Emerging and Scaling plans support two or more GST numbers with state-wise reporting, so multi-state operations stay compliant without extra spreadsheets."],
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
		multiple: false,
		className: "mx-auto max-w-3xl",
		children: FAQS.map(([q, a], i) => /* @__PURE__ */ jsxs(AccordionItem, {
			value: `faq-${i}`,
			className: "mb-2.5 overflow-hidden rounded-[13px] border border-border bg-white transition-shadow data-open:border-zinc-300 data-open:shadow-xs",
			children: [/* @__PURE__ */ jsx(AccordionTrigger, {
				className: "flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left text-[15.5px] font-semibold tracking-tight text-ink",
				children: q
			}), /* @__PURE__ */ jsx(AccordionPanel, {
				className: "px-5 pb-5 text-sm/relaxed text-muted-foreground",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-2xl",
					children: a
				})
			})]
		}, i))
	});
}
//#endregion
//#region src/components/landing/sections/FAQ.astro
var $$FAQ = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="faq"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "FAQ",
		"title": "Frequently asked questions.",
		"lead": "Need help with something, or have questions about a feature? Here are the answers sellers ask us most.",
		"center": true
	})}<div class="reveal mt-12">${renderComponent($$result, "FaqAccordion", FaqAccordion, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/ranjit/Documents/deepecom/website/src/components/landing/faq-accordion.tsx",
		"client:component-export": "default"
	})}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/FAQ.astro", void 0);
//#endregion
//#region src/components/landing/sections/FeaturesBento.astro
var $$FeaturesBento = createComponent(($$result, $$props, $$slots) => {
	const noteRow = "flex items-start gap-2.5 py-1 text-[13px] text-muted-foreground [&_b]:font-semibold [&_b]:text-ink";
	const okSvg = "mt-0.5 size-[15px] shrink-0 text-emerald-600";
	const warnSvg = "mt-0.5 size-[15px] shrink-0 text-amber-600";
	const errSvg = "mt-0.5 size-[15px] shrink-0 text-red-600";
	const iconTile = "grid size-10 shrink-0 place-items-center rounded-xl border border-blue-100 bg-accent text-primary";
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="features"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Platform",
		"title": "Total control over ecommerce finances.",
		"lead": "From order-level reconciliation to marketplace tax tracking — every critical finance workflow in one intelligent platform."
	})}<div class="grid gap-4 md:grid-cols-6 mt-5"><!-- auto reconcile --><article class="reveal flex flex-col gap-3.5 rounded-2xl border border-border bg-white p-7 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md md:col-span-2"><div class="flex items-center gap-3"><span${addAttribute(iconTile, "class")}>${renderComponent($$result, "ReconcileIcon", ReconcileIcon, {
		"width": 18,
		"height": 18
	})}</span><h3 class="text-lg font-bold tracking-tight">Auto-reconcile payments</h3></div><p class="text-sm/relaxed text-muted-foreground">Match settlements from Amazon, Flipkart &amp; Meesho with invoices and commissions — automatically.</p><div class="mt-auto rounded-xl border border-border bg-zinc-50/60 px-4 py-3"><div${addAttribute(noteRow, "class")}><svg${addAttribute(okSvg, "class")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8.5 12.5l2.5 2.5 4.5-5"></path></svg><span>Settlement matched · <b>&nbsp;₹4,20,000</b></span></div><div${addAttribute(noteRow, "class")}><svg${addAttribute(okSvg, "class")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8.5 12.5l2.5 2.5 4.5-5"></path></svg><span>1,284 line items reconciled</span></div><div${addAttribute(noteRow, "class")}><svg${addAttribute(warnSvg, "class")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"></path><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"></path></svg><span>Commission mismatch of <b>&nbsp;₹310&nbsp;</b> flagged</span></div></div><p class="flex items-center gap-1.5 text-xs text-zinc-400"><svg class="size-3.5 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>98.6% auto-match rate across channels</p></article><!-- erp sync --><article class="reveal flex flex-col gap-3.5 rounded-2xl border border-border bg-white p-7 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md md:col-span-2"><div class="flex items-center gap-3"><span${addAttribute(iconTile, "class")}>${renderComponent($$result, "SyncIcon", SyncIcon, {
		"width": 18,
		"height": 18
	})}</span><h3 class="text-lg font-bold tracking-tight">Tally + Zoho + Sap Erp</h3></div><p class="text-sm/relaxed text-muted-foreground">Export GST-ready reports and sync with your accounting tools — zero manual rework, mapped to your chart of accounts.</p><div class="mt-auto flex flex-wrap gap-2">${[
		"Tally",
		"Zoho Books",
		"Sap"
	].map((t) => renderTemplate`<span class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-xs"><svg class="size-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>${t}</span>`)}</div><p class="flex items-center gap-1.5 text-xs text-zinc-400"><svg class="size-3.5 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>Last export: 214 GST-ready vouchers</p></article><!-- profit per order --><article class="reveal flex flex-col gap-3.5 rounded-2xl border border-border bg-white p-7 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md md:col-span-2"><div class="flex items-center gap-3"><span${addAttribute(iconTile, "class")}>${renderComponent($$result, "TrendIcon", TrendIcon, {
		"width": 18,
		"height": 18
	})}</span><h3 class="text-lg font-bold tracking-tight">Profit per order</h3></div><p class="text-sm/relaxed text-muted-foreground">See gross and net profitability tracked per SKU, per order, and per channel.</p><div class="mt-auto grid grid-cols-[108px_1fr_44px] items-center gap-3 rounded-xl border border-border bg-zinc-50/60 px-4 py-3 text-xs">${[
		[
			"AeroFit Pro",
			"85%",
			"#0f62fe"
		],
		[
			"Glow Serum 30ml",
			"70%",
			"#0f62fe"
		],
		[
			"Base Tee",
			"30%",
			"#fcd34d"
		]
	].map(([label, pct, color]) => renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<span class="truncate font-medium text-muted-foreground">${label}</span><span class="h-2 overflow-hidden rounded-full bg-zinc-200"><span class="block h-full rounded-full"${addAttribute(`width:${pct};background:${color}`, "style")}></span></span><span class="num text-right font-bold text-ink">${Number.parseInt(pct)}%</span>` })}`)}</div><p class="flex items-center gap-1.5 text-xs text-zinc-400"><svg class="size-3.5 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>Updated after every settlement cycle</p></article><!-- charges breakdown --><article class="reveal flex flex-col gap-3.5 rounded-2xl border border-border bg-white p-7 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md md:col-span-3"><div class="flex items-center gap-3"><span${addAttribute(iconTile, "class")}>${renderComponent($$result, "PieIcon", PieIcon, {
		"width": 18,
		"height": 18
	})}</span><h3 class="text-lg font-bold tracking-tight">Marketplace charges breakdown</h3><span class="ml-auto rounded-full border border-border bg-subtle px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">Line-level</span></div><p class="text-sm/relaxed text-muted-foreground">Visualize every charge — returns, logistics, commissions, ads — in one place, down to the individual settlement line.</p><div class="mt-auto rounded-xl border border-border bg-zinc-50/60 px-4 py-3">${[
		[
			"Commission fee",
			"₹15,000",
			"Fees",
			true
		],
		[
			"Shipping revenue",
			"₹8,320",
			"Logistics",
			false
		],
		[
			"Ad spend",
			"₹9,600",
			"Marketing",
			false
		],
		[
			"Refund compensation",
			"₹2,140",
			"Returns",
			false
		]
	].map(([pl, pv, cat, hi]) => renderTemplate`<div class="flex items-center gap-2.5 border-b border-dashed border-border py-2 text-[13px] last:border-0 last:pb-0 first:pt-0"><span class="font-normal text-muted-foreground">${pl}</span><span class="num ml-auto font-bold text-ink">${pv}</span><span${addAttribute(`rounded-full px-2 py-0.5 text-[10.5px] font-bold tracking-wide uppercase ${hi ? "bg-accent text-accent-foreground" : "bg-zinc-200/70 text-muted-foreground"}`, "class")}>${cat}</span></div>`)}</div></article><!-- dashboards & alerts --><article class="reveal flex flex-col gap-3.5 rounded-2xl border border-border bg-white p-7 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md md:col-span-3"><div class="flex items-center gap-3"><span${addAttribute(iconTile, "class")}>${renderComponent($$result, "AlertBellIcon", AlertBellIcon, {
		"width": 18,
		"height": 18
	})}</span><h3 class="text-lg font-bold tracking-tight">Dashboards &amp; alerts</h3><span class="ml-auto rounded-full border border-border bg-subtle px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">Daily digest</span></div><p class="text-sm/relaxed text-muted-foreground">Actionable ecommerce insights for finance teams and decision-makers — delivered before you ask.</p><div class="mt-auto rounded-xl border border-border bg-zinc-50/60 px-4 py-3"><div${addAttribute(noteRow, "class")}><svg${addAttribute(warnSvg, "class")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"></path><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"></path></svg><span>Commission mismatch <b>&nbsp;₹310&nbsp;</b>· JioMart Aug W2</span></div><div${addAttribute(noteRow, "class")}><svg${addAttribute(errSvg, "class")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v4M12 16h.01"></path></svg><span>Payout delayed 3 days · Meesho</span></div><div${addAttribute(noteRow, "class")}><svg${addAttribute(okSvg, "class")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8.5 12.5l2.5 2.5 4.5-5"></path></svg><span>August close complete · 214 vouchers synced</span></div></div></article></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/FeaturesBento.astro", void 0);
//#endregion
//#region src/components/landing/sections/FinalCta.astro
var $$FinalCta = createComponent(($$result, $$props, $$slots) => {
	const compliance = [
		"Read-only API access",
		"AES-256 encryption at rest",
		"GST-compliant exports",
		"Your data is never resold"
	];
	const check = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"shrink-0 text-emerald-600\"><path d=\"M20 6L9 17l-5-5\"></path></svg>";
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="get-started"><div class="mx-auto max-w-6xl px-6"><div class="reveal relative overflow-hidden rounded-3xl border border-blue-100 bg-accent px-7 py-16 text-center md:px-12 md:py-20"><div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background: radial-gradient(520px 260px at 50% 0%, rgba(15, 98, 254, 0.1), transparent 70%)"></div><div class="relative">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Get started",
		"title": "Know exactly what you made. This month.",
		"lead": "Upload your first settlement at zero cost. Reconciliation ready in under two minutes — no credit card required.",
		"center": true
	})}<div class="mt-9 flex flex-wrap justify-center gap-3"><a href="#contact"${addAttribute(`${buttonVariants({ size: "lg" })} gap-2`, "class")}>Start free trial${renderComponent($$result, "ArrowNarrowRightIcon", ArrowNarrowRightIcon, {
		"width": 16,
		"height": 16
	})}</a><a href="#contact"${addAttribute(`${buttonVariants({
		variant: "outline",
		size: "lg"
	})}`, "class")}>Talk to sales</a></div><ul class="mx-auto mt-9 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-3">${compliance.map((c) => renderTemplate`<li class="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">${unescapeHTML(check + c)}</li>`)}</ul></div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/FinalCta.astro", void 0);
//#endregion
//#region src/components/landing/sections/FlowDiagram.astro
var $$FlowDiagram = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="relative overflow-hidden bg-white py-20 md:py-32" id="how"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><!-- Header Section --><div class="mx-auto max-w-3xl text-center"><span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/20">How it works</span><h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">From marketplace payout <br class="hidden sm:block"> to your books.</h2><p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">DeepEcom collects raw settlements and orders from every channel, reconciles them in one engine, and delivers GST-ready vouchers straight into your ERP.</p></div><!-- Diagram Section --><div class="relative mx-auto mt-16 max-w-6xl md:mt-20"><!-- Decorative Glow Behind the Card --><div class="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl md:-inset-4 md:opacity-30"></div><!-- Diagram Card --><div class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-2xl shadow-blue-900/5 sm:p-4 md:p-8"><!-- ==================== DESKTOP SVG ==================== --><div class="hidden overflow-x-auto md:block"><svg viewBox="0 0 1120 480" class="h-auto w-full min-w-[700px]" role="img" aria-label="Diagram: settlements flow live from Amazon, Flipkart, Meesho and Shopify into the DeepEcom AI reconciliation engine, which outputs GST-ready vouchers to Tally Prime, Zoho Books and SAP"><defs><pattern id="dotgrid" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1.1" fill="#e5e7eb"></circle></pattern><linearGradient id="coreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"></stop><stop offset="100%" stop-color="#eff6ff"></stop></linearGradient><radialGradient id="logoGrad" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#60a5fa"></stop><stop offset="100%" stop-color="#1d4ed8"></stop></radialGradient><filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.06"></feDropShadow></filter><filter id="softer" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.08"></feDropShadow></filter><!-- UPDATED DESKTOP ARROW MARKER --><marker id="arrw" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 1 1 L 11 6 L 1 11 L 3.5 6 z" fill="#9ca3af" stroke="#9ca3af" stroke-width="1" stroke-linejoin="round"></path></marker></defs><!-- Background Grid --><rect x="10" y="10" width="1100" height="460" rx="24" fill="url(#dotgrid)"></rect><!-- Category Pills --><g fill="#ffffff" stroke="#e5e7eb" filter="url(#soft)" font-family="system-ui, sans-serif" font-size="11px" font-weight="700" letter-spacing="0.1em" fill-opacity="1" text-anchor="middle"><rect x="84" y="32" width="118" height="26" rx="13"></rect><text x="143" y="49" fill="#6b7280" stroke="none">MARKETPLACES</text><rect x="480" y="32" width="160" height="26" rx="13"></rect><text x="560" y="49" fill="#6b7280" stroke="none">DEEPECOM ENGINE</text><rect x="929" y="32" width="96" height="26" rx="13"></rect><text x="977" y="49" fill="#6b7280" stroke="none">YOUR ERP</text></g><!-- Flow Paths --><g fill="none" stroke="#e5e7eb" stroke-width="2" marker-end="url(#arrw)"><path id="plA" d="M238,96 C330,96 352,196 445,196"></path><path id="plB" d="M238,176 C338,176 358,219 445,219"></path><path id="plC" d="M238,256 C338,256 358,242 445,242"></path><path id="plD" d="M238,336 C330,336 352,265 445,265"></path><path id="prA" d="M675,200 C770,200 786,130 882,130"></path><path id="prB" d="M675,230 C782,230 792,235 882,235"></path><path id="prC" d="M675,260 C770,260 786,340 882,340"></path></g><g fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6"><path d="M238,96 C330,96 352,196 443,196"></path><path d="M238,176 C338,176 358,219 443,219"></path><path d="M238,256 C338,256 358,242 443,242"></path><path d="M238,336 C330,336 352,265 443,265"></path><path d="M675,200 C770,200 786,130 880,130"></path><path d="M675,230 C782,230 792,235 880,235"></path><path d="M675,260 C770,260 786,340 880,340"></path></g><!-- Animated Dots --><g fill="#3b82f6"><circle r="3.5"><animateMotion dur="3s" begin="0s" repeatCount="indefinite"><mpath href="#plA"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="0.75s" repeatCount="indefinite"><mpath href="#plB"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="1.5s" repeatCount="indefinite"><mpath href="#plC"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="2.25s" repeatCount="indefinite"><mpath href="#plD"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="0.4s" repeatCount="indefinite"><mpath href="#prA"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="1.4s" repeatCount="indefinite"><mpath href="#prB"></mpath></animateMotion></circle><circle r="3.5"><animateMotion dur="3s" begin="2.4s" repeatCount="indefinite"><mpath href="#prC"></mpath></animateMotion></circle></g><!-- Connection Points --><g fill="#d1d5db"><circle cx="238" cy="96" r="3.5"></circle><circle cx="238" cy="176" r="3.5"></circle><circle cx="238" cy="256" r="3.5"></circle><circle cx="238" cy="336" r="3.5"></circle></g><g fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"><circle cx="445" cy="196" r="4.5"></circle><circle cx="445" cy="219" r="4.5"></circle><circle cx="445" cy="242" r="4.5"></circle><circle cx="445" cy="265" r="4.5"></circle><circle cx="675" cy="200" r="4.5"></circle><circle cx="675" cy="230" r="4.5"></circle><circle cx="675" cy="260" r="4.5"></circle></g><g fill="#dcfce7" stroke="#34d399" stroke-width="1.5"><circle cx="882" cy="130" r="4.5"></circle><circle cx="882" cy="235" r="4.5"></circle><circle cx="882" cy="340" r="4.5"></circle></g><!-- LEFT NODES (Marketplaces) --><g font-family="system-ui, sans-serif"><!-- Node 1: Amazon --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="48" y="69" width="190" height="54" rx="14"></rect></g><rect x="62" y="82" width="28" height="28" rx="8" fill="#fef3c7"></rect><text x="76" y="101" text-anchor="middle" font-size="11px" font-weight="800" fill="#b45309">Az</text><text x="102" y="94" font-size="14px" font-weight="600" fill="#111827">Amazon</text><text x="102" y="110" font-size="12px" fill="#6b7280">Synced 2 min ago</text><circle cx="223" cy="84" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="223" cy="84" r="3.5" fill="#22c55e"></circle><!-- Node 2: Flipkart --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="48" y="149" width="190" height="54" rx="14"></rect></g><rect x="62" y="162" width="28" height="28" rx="8" fill="#dbeafe"></rect><text x="76" y="181" text-anchor="middle" font-size="11px" font-weight="800" fill="#1d4ed8">Fk</text><text x="102" y="174" font-size="14px" font-weight="600" fill="#111827">Flipkart</text><text x="102" y="190" font-size="12px" fill="#6b7280">Synced 9 min ago</text><circle cx="223" cy="164" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="223" cy="164" r="3.5" fill="#22c55e"></circle><!-- Node 3: Meesho --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="48" y="229" width="190" height="54" rx="14"></rect></g><rect x="62" y="242" width="28" height="28" rx="8" fill="#fce7f3"></rect><text x="76" y="261" text-anchor="middle" font-size="11px" font-weight="800" fill="#be185d">Me</text><text x="102" y="254" font-size="14px" font-weight="600" fill="#111827">Meesho</text><text x="102" y="270" font-size="12px" fill="#6b7280">Payout pending</text><circle cx="223" cy="244" r="7" fill="#f59e0b" opacity="0.16"></circle><circle cx="223" cy="244" r="3.5" fill="#f59e0b"></circle><!-- Node 4: Shopify --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="48" y="309" width="190" height="54" rx="14"></rect></g><rect x="62" y="322" width="28" height="28" rx="8" fill="#dcfce7"></rect><text x="76" y="341" text-anchor="middle" font-size="11px" font-weight="800" fill="#15803d">Sy</text><text x="102" y="334" font-size="14px" font-weight="600" fill="#111827">Shopify</text><text x="102" y="350" font-size="12px" fill="#6b7280">Synced 1 hr ago</text><circle cx="223" cy="324" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="223" cy="324" r="3.5" fill="#22c55e"></circle></g><!-- CENTER ENGINE --><g font-family="system-ui, sans-serif"><rect x="445" y="140" width="230" height="180" rx="20" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.3"></rect><rect x="445" y="140" width="230" height="180" rx="20" fill="url(#coreGrad)" stroke="#bfdbfe" stroke-width="1.5" filter="url(#softer)"></rect><!-- Spinning Aura --><circle cx="560" cy="188" r="31" fill="none" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="4 6"><animateTransform attributeName="transform" type="rotate" from="0 560 188" to="360 560 188" dur="14s" repeatCount="indefinite"></animateTransform></circle><circle cx="560" cy="188" r="23" fill="url(#logoGrad)"></circle><!-- Engine Icon Inside Center --><g transform="translate(547,175)"><rect x="3" y="13" width="4.5" height="8" rx="1.5" fill="#ffffff"></rect><rect x="9.75" y="8" width="4.5" height="13" rx="1.5" fill="#ffffff"></rect><rect x="16.5" y="3" width="4.5" height="18" rx="1.5" fill="#ffffff"></rect></g><text x="560" y="250" text-anchor="middle" font-size="20px" font-weight="700" fill="#111827">DeepEcom</text><text x="560" y="269" text-anchor="middle" font-size="13px" font-weight="500" fill="#6b7280">AI reconciliation engine</text><!-- Chips inside center --><rect x="455" y="280" width="54" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe"></rect><text x="482" y="295" text-anchor="middle" font-size="9px" font-weight="700" letter-spacing="0.05em" fill="#2563eb">MATCH</text><rect x="517" y="280" width="80" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe"></rect><text x="557" y="295" text-anchor="middle" font-size="9px" font-weight="700" letter-spacing="0.05em" fill="#2563eb">CATEGORIZE</text><rect x="605" y="280" width="62" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe"></rect><text x="636" y="295" text-anchor="middle" font-size="9px" font-weight="700" letter-spacing="0.05em" fill="#2563eb">VALIDATE</text><!-- Status Box --><g filter="url(#soft)"><rect x="598" y="308" width="142" height="32" rx="16" fill="#ffffff" stroke="#e5e7eb"></rect></g><circle cx="616" cy="324" r="4.5" fill="#10b981"><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"></animate></circle><text x="630" y="328" font-size="12px" font-weight="600" fill="#1f2937">98.6% auto-match</text></g><!-- RIGHT NODES (ERPs) --><g font-family="system-ui, sans-serif"><!-- Node 1: Tally Prime --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="882" y="103" width="190" height="54" rx="14"></rect></g><rect x="896" y="116" width="28" height="28" rx="8" fill="#eff6ff"></rect><text x="910" y="135" text-anchor="middle" font-size="11px" font-weight="800" fill="#1d4ed8">Tp</text><text x="936" y="128" font-size="14px" font-weight="600" fill="#111827">Tally Prime</text><text x="936" y="144" font-size="12px" fill="#6b7280">214 vouchers synced</text><circle cx="1057" cy="118" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="1057" cy="118" r="3.5" fill="#22c55e"></circle><!-- Node 2: Zoho Books --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="882" y="208" width="190" height="54" rx="14"></rect></g><rect x="896" y="221" width="28" height="28" rx="8" fill="#eff6ff"></rect><text x="910" y="240" text-anchor="middle" font-size="11px" font-weight="800" fill="#1d4ed8">Zb</text><text x="936" y="233" font-size="14px" font-weight="600" fill="#111827">Zoho Books</text><text x="936" y="249" font-size="12px" fill="#6b7280">Ledger · just now</text><circle cx="1057" cy="223" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="1057" cy="223" r="3.5" fill="#22c55e"></circle><!-- Node 3: SAP --><g filter="url(#soft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="882" y="313" width="190" height="54" rx="14"></rect></g><rect x="896" y="326" width="28" height="28" rx="8" fill="#eff6ff"></rect><text x="910" y="345" text-anchor="middle" font-size="11px" font-weight="800" fill="#1d4ed8">Se</text><text x="936" y="338" font-size="14px" font-weight="600" fill="#111827">SAP</text><text x="936" y="354" font-size="12px" fill="#6b7280">Synced · 12m ago</text><circle cx="1057" cy="328" r="7" fill="#22c55e" opacity="0.15"></circle><circle cx="1057" cy="328" r="3.5" fill="#22c55e"></circle></g><!-- Bottom Labels --><g font-family="system-ui, sans-serif" font-size="12px" font-weight="500" fill="#9ca3af"><text x="143" y="430" text-anchor="middle">Raw settlements · orders · returns</text><circle cx="497" cy="426" r="3.5" fill="#3b82f6" opacity="0.85"></circle><text x="510" y="430">Live data flow · updated every cycle</text><text x="977" y="430" text-anchor="middle">GST-ready vouchers &amp; ledgers</text></g></svg></div><!-- ==================== MOBILE SVG ==================== --><div class="block md:hidden"><svg viewBox="0 0 380 600" class="h-auto w-full" role="img" aria-label="Mobile diagram: settlements flow from marketplaces into the DeepEcom engine, which outputs vouchers to ERPs"><defs><pattern id="mgrid" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1.1" fill="#e5e7eb"></circle></pattern><linearGradient id="mCoreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"></stop><stop offset="100%" stop-color="#eff6ff"></stop></linearGradient><radialGradient id="mLogoGrad" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#60a5fa"></stop><stop offset="100%" stop-color="#1d4ed8"></stop></radialGradient><filter id="mSoft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.06"></feDropShadow></filter><!-- UPDATED MOBILE ARROW MARKER --><marker id="mArrw" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 1 1 L 11 6 L 1 11 L 3.5 6 z" fill="#9ca3af" stroke="#9ca3af" stroke-width="1" stroke-linejoin="round"></path></marker></defs><!-- Background Grid --><rect x="8" y="8" width="364" height="584" rx="20" fill="url(#mgrid)"></rect><!-- Pill top --><rect x="131" y="16" width="118" height="24" rx="12" fill="#ffffff" stroke="#e5e7eb"></rect><text x="190" y="32" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10px" font-weight="700" letter-spacing="0.1em" fill="#6b7280">MARKETPLACES</text><!-- Top Nodes (Marketplaces) --><g font-family="system-ui, sans-serif"><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="48" width="162" height="46" rx="12"></rect></g><rect x="32" y="58" width="26" height="26" rx="8" fill="#fef3c7"></rect><text x="45" y="76" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#b45309">Az</text><text x="68" y="76" font-size="13px" font-weight="600" fill="#111827">Amazon</text><circle cx="344" cy="71" r="6.5" fill="#22c55e" opacity="0.15"></circle><circle cx="344" cy="71" r="3.2" fill="#22c55e"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="198" y="48" width="162" height="46" rx="12"></rect></g><rect x="210" y="58" width="26" height="26" rx="8" fill="#dbeafe"></rect><text x="223" y="76" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#1d4ed8">Fk</text><text x="246" y="76" font-size="13px" font-weight="600" fill="#111827">Flipkart</text><circle cx="344" cy="71" r="6.5" fill="#22c55e" opacity="0.15"></circle><circle cx="344" cy="71" r="3.2" fill="#22c55e"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="102" width="162" height="46" rx="12"></rect></g><rect x="32" y="112" width="26" height="26" rx="8" fill="#fce7f3"></rect><text x="45" y="130" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#be185d">Me</text><text x="68" y="130" font-size="13px" font-weight="600" fill="#111827">Meesho</text><circle cx="344" cy="125" r="6.5" fill="#f59e0b" opacity="0.16"></circle><circle cx="344" cy="125" r="3.2" fill="#f59e0b"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="198" y="102" width="162" height="46" rx="12"></rect></g><rect x="210" y="112" width="26" height="26" rx="8" fill="#dcfce7"></rect><text x="223" y="130" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#15803d">Sy</text><text x="246" y="130" font-size="13px" font-weight="600" fill="#111827">Shopify</text><circle cx="344" cy="125" r="6.5" fill="#22c55e" opacity="0.15"></circle><circle cx="344" cy="125" r="3.2" fill="#22c55e"></circle></g><!-- Flow Paths to Center --><g fill="none" stroke="#e5e7eb" stroke-width="2"><path id="mmA" d="M101,94 C101,118 190,126 190,164"></path><path id="mmB" d="M279,94 C279,118 190,126 190,164"></path><path id="mmC" d="M101,148 C101,158 160,152 188,163"></path><path id="mmD" d="M279,148 C279,158 220,152 192,163"></path></g><g fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6"><path d="M101,94 C101,118 190,126 189,163"></path><path d="M279,94 C279,118 190,126 191,163"></path><path d="M101,148 C101,158 160,152 187,162"></path><path d="M279,148 C279,158 220,152 193,162"></path></g><g fill="#3b82f6"><circle r="3"><animateMotion dur="2.5s" begin="0s" repeatCount="indefinite"><mpath href="#mmA"></mpath></animateMotion></circle><circle r="3"><animateMotion dur="2.5s" begin="0.6s" repeatCount="indefinite"><mpath href="#mmB"></mpath></animateMotion></circle><circle r="3"><animateMotion dur="2.5s" begin="1.2s" repeatCount="indefinite"><mpath href="#mmC"></mpath></animateMotion></circle><circle r="3"><animateMotion dur="2.5s" begin="1.8s" repeatCount="indefinite"><mpath href="#mmD"></mpath></animateMotion></circle></g><circle cx="190" cy="168" r="4" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"></circle><g fill="none"><path id="mt1" stroke="#e5e7eb" stroke-width="2" d="M190,172 L190,204" marker-end="url(#mArrw)"></path><path stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6" d="M190,172 L190,202"></path></g><circle r="3" fill="#3b82f6"><animateMotion dur="1.5s" begin="0.3s" repeatCount="indefinite"><mpath href="#mt1"></mpath></animateMotion></circle><!-- Center Core --><g font-family="system-ui, sans-serif"><rect x="60" y="210" width="260" height="118" rx="18" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.3"></rect><rect x="60" y="210" width="260" height="118" rx="18" fill="url(#mCoreGrad)" stroke="#bfdbfe" stroke-width="1.5" filter="url(#mSoft)"></rect><circle cx="190" cy="248" r="23" fill="none" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="3 5"><animateTransform attributeName="transform" type="rotate" from="0 190 248" to="360 190 248" dur="12s" repeatCount="indefinite"></animateTransform></circle><circle cx="190" cy="248" r="17" fill="url(#mLogoGrad)"></circle><g transform="translate(181.3,239.3) scale(0.72)"><rect x="3" y="13" width="4.5" height="8" rx="1.5" fill="#ffffff"></rect><rect x="9.75" y="8" width="4.5" height="13" rx="1.5" fill="#ffffff"></rect><rect x="16.5" y="3" width="4.5" height="18" rx="1.5" fill="#ffffff"></rect></g><text x="190" y="292" text-anchor="middle" font-size="16px" font-weight="700" fill="#111827">DeepEcom</text><text x="190" y="307" text-anchor="middle" font-size="12px" font-weight="500" fill="#6b7280">AI reconciliation engine</text><text x="190" y="321" text-anchor="middle" font-size="9px" font-weight="700" letter-spacing="0.05em" fill="#2563eb">MATCH · CATEGORIZE · VALIDATE</text></g><!-- Bottom Flow Paths --><circle cx="190" cy="328" r="4" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"></circle><g fill="none"><path id="mt2" stroke="#e5e7eb" stroke-width="2" d="M190,336 L190,372" marker-end="url(#mArrw)"></path><path stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6" d="M190,336 L190,370"></path></g><circle r="3" fill="#3b82f6"><animateMotion dur="1.5s" begin="0.8s" repeatCount="indefinite"><mpath href="#mt2"></mpath></animateMotion></circle><!-- Pill Bottom --><rect x="147" y="380" width="86" height="24" rx="12" fill="#ffffff" stroke="#e5e7eb"></rect><text x="190" y="396" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10px" font-weight="700" letter-spacing="0.1em" fill="#6b7280">YOUR ERP</text><!-- Bottom Nodes (ERPs) --><g font-family="system-ui, sans-serif"><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="412" width="340" height="44" rx="12"></rect></g><rect x="32" y="421" width="26" height="26" rx="8" fill="#eff6ff"></rect><text x="45" y="439" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#1d4ed8">Tp</text><text x="68" y="439" font-size="13px" font-weight="600" fill="#111827">Tally Prime</text><text x="150" y="439" font-size="11px" fill="#6b7280">214 vouchers synced</text><circle cx="344" cy="434" r="3.2" fill="#22c55e"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="464" width="340" height="44" rx="12"></rect></g><rect x="32" y="473" width="26" height="26" rx="8" fill="#eff6ff"></rect><text x="45" y="491" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#1d4ed8">Zb</text><text x="68" y="491" font-size="13px" font-weight="600" fill="#111827">Zoho Books</text><text x="150" y="491" font-size="11px" fill="#6b7280">Ledger · just now</text><circle cx="344" cy="486" r="3.2" fill="#22c55e"></circle><g filter="url(#mSoft)"><rect fill="#ffffff" stroke="#f3f4f6" stroke-width="1" x="20" y="516" width="340" height="44" rx="12"></rect></g><rect x="32" y="525" width="26" height="26" rx="8" fill="#eff6ff"></rect><text x="45" y="543" text-anchor="middle" font-size="10.5px" font-weight="800" fill="#1d4ed8">Se</text><text x="68" y="543" font-size="13px" font-weight="600" fill="#111827">SAP</text><text x="150" y="543" font-size="11px" fill="#6b7280">Synced · 12m ago</text><circle cx="344" cy="538" r="3.2" fill="#22c55e"></circle></g><!-- Bottom Note --><text x="190" y="584" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11px" font-weight="500" fill="#9ca3af">Live data flow · updated every cycle</text></svg></div></div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/FlowDiagram.astro", void 0);
//#endregion
//#region src/components/landing/sections/Hero.astro
var $$Hero = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<header class="relative isolate pt-36 text-center md:pt-44"><div aria-hidden="true" class="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]"></div><div class="mx-auto max-w-6xl px-6"><a href="#how" class="reveal inline-flex items-center gap-2 rounded-full border border-border bg-white py-1.5 pr-3.5 pl-2 text-[13.5px] font-medium text-muted-foreground shadow-xs transition hover:-translate-y-px hover:border-blue-200"><span class="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold tracking-wide text-white">New</span>One-click Tally &amp; Sap sync is live${renderComponent($$result, "ArrowNarrowRightIcon", ArrowNarrowRightIcon, { "size": 14 })}</a><h1 class="reveal mx-auto mt-7 max-w-[980px] text-[clamp(34px,5.6vw,70px)] leading-[1.04] font-[640] tracking-[-0.045em] text-balance text-ink">All-in-one ecommerce dashboard <em class="font-[560] not-italic text-zinc-400">for profit tracking &amp; accounting sync.</em></h1><p class="reveal mx-auto mt-6 max-w-[640px] text-[clamp(16.5px,1.5vw,19.5px)] leading-relaxed text-muted-foreground">DeepEcom tracks real profits across multiple marketplaces. Automate Tally accounting, reconcile payments effortlessly — and always know what you actually earned.</p><div class="reveal mt-9 flex flex-wrap justify-center gap-3"><a href="#contact"${addAttribute(`${buttonVariants({ size: "lg" })} gap-2`, "class")}>Start free trial${renderComponent($$result, "ArrowNarrowRightIcon", ArrowNarrowRightIcon, { "size": 16 })}</a><a href="#contact"${addAttribute(`${buttonVariants({
		variant: "outline",
		size: "lg"
	})} gap-2`, "class")}>${renderComponent($$result, "CalendarIcon", CalendarIcon, { "size": 16 })}Schedule demo</a></div><p class="reveal mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground/80">${renderComponent($$result, "CircleCheckIcon", CircleCheckIcon, {
		"size": 16,
		"className": "text-emerald-600"
	})}Free for your first 100 orders · No credit card required</p><div class="reveal mt-12"><p class="mb-5 text-xs font-bold tracking-[0.16em] text-zinc-400 uppercase">Built for sellers on</p><div class="flex flex-wrap items-center justify-center gap-x-9 gap-y-3">${[
		"amazon",
		"Flipkart",
		"Meesho",
		"Myntra",
		"Shopify",
		"JioMart"
	].map((b) => renderTemplate`<span class="cursor-default text-[19px] font-extrabold tracking-tight text-zinc-400 transition-colors hover:text-muted-foreground">${b}</span>`)}</div></div></div></header>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Hero.astro", void 0);
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
var tile = "flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-[14.5px] font-semibold tracking-tight text-ink shadow-xs transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm";
var tileLogo = "grid size-8 shrink-0 place-items-center rounded-lg border border-blue-100 bg-accent text-xs font-extrabold text-accent-foreground";
function IntegrationsTabs() {
	return /* @__PURE__ */ jsxs(Tabs, {
		defaultValue: "marketplace",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mb-9 flex mt-9 justify-center",
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
		}), Object.entries(GROUPS).map(([key, items]) => /* @__PURE__ */ jsx(TabsPanel, {
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
		}, key))]
	});
}
//#endregion
//#region src/components/landing/sections/Integrations.astro
var $$Integrations = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="integrations"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Integrations",
		"title": "Seamlessly connect your stack.",
		"lead": "DeepEcom integrates with India's most-used marketplaces, ERPs, logistics providers and payment gateways.",
		"center": true
	})}<div class="reveal">${renderComponent($$result, "IntegrationsTabs", IntegrationsTabs, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/ranjit/Documents/deepecom/website/src/components/landing/integrations-tabs.tsx",
		"client:component-export": "default"
	})}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Integrations.astro", void 0);
//#endregion
//#region src/components/landing/sections/MetricsBand.astro
var $$MetricsBand = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-14 md:py-16" aria-label="DeepEcom by the numbers"><div class="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-6 lg:grid-cols-4"></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/MetricsBand.astro", void 0);
//#endregion
//#region src/components/landing/sections/Pricing.astro
var $$Pricing = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="pricing"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Pricing",
		"title": "Flexible plans tailored to your needs.",
		"lead": "Plans sized to your order volume. No hidden fees, no per-seat math. Cancel anytime.",
		"center": true
	})}<div class="reveal mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">${[
		{
			name: "Beginner Seller",
			desc: "For sellers getting their first channel off the ground.",
			price: "₹1,000",
			note: "Quarterly plan · billed ₹3,000 every 3 months",
			features: [
				"Up to 500 orders / month",
				"2 marketplace integrations",
				"1 GST number",
				"Tally sync",
				"Reports"
			],
			popular: false
		},
		{
			name: "Emerging Seller",
			desc: "For growing brands selling on multiple marketplaces.",
			price: "₹2,000",
			note: "Quarterly plan · billed ₹6,000 every 3 months",
			features: [
				"Up to 1,000 orders / month",
				"4 marketplace integrations",
				"2 or more GST numbers",
				"Tally sync",
				"Reports",
				"Data insights",
				"Profit tracking"
			],
			popular: true
		},
		{
			name: "Scaling Seller",
			desc: "For high-volume operations that need the full picture.",
			price: "₹3,000",
			note: "Quarterly plan · billed ₹9,000 every 3 months",
			features: [
				"Up to 2,000 orders / month",
				"4 marketplace integrations",
				"2 or more GST numbers",
				"All accounting syncs",
				"Reports & data insights",
				"Priority support"
			],
			popular: false
		}
	].map((p) => renderTemplate`<article${addAttribute(["relative flex flex-col rounded-2xl border border-border bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-md", p.popular && "border-primary shadow-[0_0_0_1px_var(--primary),0_12px_24px_-8px_rgba(16,24,40,0.1)]"], "class:list")}>${p.popular && renderTemplate`<span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3.5 py-1 text-[11px] font-bold tracking-widest whitespace-nowrap text-white uppercase shadow-[0_4px_10px_rgba(79,70,229,0.35)]">Most popular</span>`}<h3 class="text-base font-bold">${p.name}</h3><p class="mt-1 text-[13.5px] text-muted-foreground">${p.desc}</p><div class="mt-6 flex items-baseline gap-1.5"><span class="num text-[42px] leading-none font-extrabold tracking-tight text-ink">${p.price}</span><span class="text-sm font-medium text-zinc-400">/month</span></div><p class="mt-1.5 min-h-5 text-xs text-zinc-400">${p.note}</p><ul class="mt-6 flex flex-col gap-2.5 border-t border-subtle pt-6 pb-7">${p.features.map((f) => renderTemplate`<li class="flex gap-2.5 text-sm/relaxed text-muted-foreground">${renderComponent($$result, "CheckIcon", CheckIcon, {
		"size": 16,
		"className": "mt-0.5 shrink-0 text-primary"
	})}${f}</li>`)}</ul><a href="#contact"${addAttribute(`${buttonVariants({ variant: p.popular ? "default" : "outline" })} mt-auto w-full`, "class")}>Buy now</a></article>`)}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Pricing.astro", void 0);
//#endregion
//#region src/components/landing/sections/Settlements.astro
var $$Settlements = createComponent(($$result, $$props, $$slots) => {
	const checks = [
		"SKU-level margins",
		"Anomaly detection",
		"GST-ready exports"
	];
	const rows = [
		{
			init: "Az",
			name: "Amazon",
			orders: "4,812",
			gross: "₹18,42,300",
			ded: "−₹5,12,480",
			net: "₹13,29,820",
			status: "Reconciled",
			variant: "success"
		},
		{
			init: "Fk",
			name: "Flipkart",
			orders: "3,204",
			gross: "₹9,86,150",
			ded: "−₹2,71,090",
			net: "₹7,15,060",
			status: "Reconciled",
			variant: "success"
		},
		{
			init: "Me",
			name: "Meesho",
			orders: "1,978",
			gross: "₹4,31,720",
			ded: "−₹1,02,340",
			net: "₹3,29,380",
			status: "Pending",
			variant: "warning"
		},
		{
			init: "Jm",
			name: "JioMart",
			orders: "642",
			gross: "₹1,58,900",
			ded: "−₹41,220",
			net: "₹1,17,680",
			status: "Mismatch",
			variant: "error",
			neg: "−₹1,240"
		},
		{
			init: "Sy",
			name: "Shopify",
			orders: "1,092",
			gross: "₹7,94,610",
			ded: "−₹1,66,540",
			net: "₹6,28,070",
			status: "Reconciled",
			variant: "success"
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="analytics"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Payment reconciliation",
		"title": "Every rupee, traceable to its order.",
		"lead": "Every settlement line item is matched to its order and its invoice — discrepancies are flagged before they ever reach your books.",
		"center": true
	}, { "default": ($$result) => renderTemplate`<ul class="reveal mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3">${checks.map((c) => renderTemplate`<li class="flex items-center gap-2 text-sm font-semibold text-ink">${renderComponent($$result, "CheckCircle", CheckCircle, { "className": "size-4 text-emerald-600 shrink-0" })}${c}</li>`)}</ul>` })}<!-- Desktop / Tablet Table --><div class="reveal mt-8 hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all md:block"><div class="flex items-center justify-between border-b border-border bg-zinc-50/70 px-6 py-4"><span class="text-sm font-bold tracking-tight text-ink">August settlements</span><div class="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-2xs hover:bg-zinc-50 transition-colors cursor-pointer"><svg class="size-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>Aug 2026<svg class="size-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"></path></svg></div></div><div class="overflow-x-auto"><table class="w-full min-w-[720px] text-sm text-left"><thead><tr class="border-b border-border bg-zinc-50/40 text-[11px] font-bold tracking-wider text-zinc-400 uppercase"><th class="px-6 py-3.5">Marketplace</th><th class="px-6 py-3.5 text-right">Orders</th><th class="px-6 py-3.5 text-right">Gross</th><th class="px-6 py-3.5 text-right">Deductions</th><th class="px-6 py-3.5 text-right">Net payout</th><th class="px-6 py-3.5 text-right">Status</th></tr></thead><tbody class="divide-y divide-border/60">${rows.map((r) => renderTemplate`<tr${addAttribute(`transition-colors hover:bg-zinc-50/80 ${r.variant === "error" ? "bg-red-50/30 hover:bg-red-50/50" : ""}`, "class")}><td class="px-6 py-4"><span class="flex items-center gap-3 font-semibold text-ink"><span class="grid size-8 place-items-center rounded-lg border border-border/80 bg-zinc-100/80 text-[11px] font-bold text-zinc-600 shadow-2xs">${r.init}</span>${r.name}</span></td><td class="tabular-nums px-6 py-4 text-right text-zinc-500 font-medium">${r.orders}</td><td class="tabular-nums px-6 py-4 text-right text-ink font-medium">${r.gross}</td><td class="tabular-nums px-6 py-4 text-right text-zinc-500">${r.ded}</td><td class="tabular-nums px-6 py-4 text-right font-bold text-ink"><span class="inline-flex items-center gap-1.5">${r.net}${"neg" in r && r.neg && renderTemplate`<span class="inline-flex items-center rounded-md bg-red-100/80 px-1.5 py-0.5 text-[11px] font-semibold text-red-700">${r.neg}</span>`}</span></td><td class="px-6 py-4 text-right">${renderComponent($$result, "Badge", Badge, { "variant": r.variant }, { "default": ($$result) => renderTemplate`${r.status}` })}</td></tr>`)}</tbody></table></div><div class="flex items-center gap-2 border-t border-border bg-zinc-50/50 px-6 py-3 text-xs text-zinc-500"><svg class="size-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg><span>Discrepancies automatically flagged before reaching your ledger.</span></div></div><!-- Mobile Settlement Cards --><div class="mx-auto mt-6 grid max-w-md gap-3.5 md:hidden">${rows.map((r) => renderTemplate`<article${addAttribute(`rounded-2xl border bg-white p-4.5 shadow-xs transition-all ${r.variant === "error" ? "border-red-200 bg-red-50/10" : "border-border"}`, "class")}><div class="flex items-center justify-between gap-3"><div class="flex items-center gap-3"><span class="grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-zinc-100 text-xs font-bold text-zinc-600 shadow-2xs">${r.init}</span><div><h4 class="text-sm font-bold tracking-tight text-ink">${r.name}</h4><p class="tabular-nums text-xs text-zinc-400">${r.orders} orders</p></div></div>${renderComponent($$result, "Badge", Badge, { "variant": r.variant }, { "default": ($$result) => renderTemplate`${r.status}` })}</div><div class="mt-4 grid grid-cols-2 gap-4 border-t border-dashed border-border/80 pt-3.5"><div><span class="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Gross</span><span class="tabular-nums mt-0.5 block text-sm font-semibold text-ink">${r.gross}</span></div><div><span class="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Deductions</span><span class="tabular-nums mt-0.5 block text-sm font-semibold text-zinc-500">${r.ded}</span></div></div><div class="mt-3.5 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-zinc-50/80 px-3.5 py-2.5"><span class="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">Net payout</span><span class="tabular-nums text-base font-bold text-ink">${r.net}</span></div>${"neg" in r && r.neg && renderTemplate`<div class="mt-3 flex items-start gap-2.5 rounded-xl border border-red-200/80 bg-red-50/80 p-2.5 text-xs font-medium text-red-800"><svg class="mt-0.5 size-4 shrink-0 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"></path><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"></path></svg><span>Commission mismatch of <strong>₹1,240</strong> flagged for review</span></div>`}</article>`)}<p class="flex items-center justify-center gap-2 pt-2 text-xs text-zinc-400"><svg class="size-3.5 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>Discrepancies automatically flagged before reaching your ledger.</p></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Settlements.astro", void 0);
//#endregion
//#region src/components/landing/sections/Testimonials.astro
var $$Testimonials = createComponent(($$result, $$props, $$slots) => {
	const quotes = [
		{
			title: "Exceptional ROI from analytics",
			body: "The business intelligence tools have given us exceptional ROI by identifying key areas for revenue growth and cost savings. Data-driven decisions are now a reality for our company.",
			name: "Priya D.",
			role: "Business Analyst",
			init: "PD"
		},
		{
			title: "GST filing is now a breeze",
			body: "GST filing used to be a dreaded event every quarter. Since using DeepEcom, it's literally one click and we're done. The accuracy has improved, and we haven't faced a single discrepancy since.",
			name: "Ashok V.",
			role: "Finance Controller",
			init: "AV"
		},
		{
			title: "Ecommerce at its finest",
			body: "DeepEcom represents ecommerce at its finest — sophisticated, streamlined and strategic. We saw a significant improvement in our overall operations within weeks.",
			name: "Nisha Q.",
			role: "Digital Strategist",
			init: "NQ"
		},
		{
			title: "Revolutionized our cash flow",
			body: "Thanks to DeepEcom, our payment reconciliation hassles are gone — which has revolutionized our cash flow management. We recognize revenue faster and with more accuracy.",
			name: "Sanjay K.",
			role: "CFO",
			init: "SK"
		}
	];
	const star = "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" stroke=\"none\" width=\"15\" height=\"15\"><path d=\"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z\"/></svg>";
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="testimonials"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Testimonials",
		"title": "Trusted by 2,000+ ecommerce sellers.",
		"lead": "Real results from sellers across India.",
		"center": true
	}, { "default": ($$result) => renderTemplate`<div class="reveal mt-5 flex items-center justify-center gap-2"><span class="flex gap-0.5 text-primary" aria-hidden="true">${unescapeHTML(star.repeat(5))}</span><b class="text-sm text-ink">4.9/5</b><span class="text-sm text-muted-foreground">average rating from finance teams</span></div>` })}<div class="grid gap-4 mt-4 md:grid-cols-2">${quotes.map((q) => renderTemplate`<figure class="reveal flex flex-col gap-4 rounded-2xl border border-border bg-white p-7 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"><div class="flex gap-1 text-primary" aria-hidden="true">${unescapeHTML(star.repeat(5))}</div><blockquote><h3 class="mb-1.5 text-base font-bold tracking-tight">${q.title}</h3><p class="text-[14.5px]/relaxed text-muted-foreground">“${q.body}”</p></blockquote><figcaption class="mt-auto flex items-center gap-3 pt-1.5"><span class="grid size-10 place-items-center rounded-full border border-border bg-subtle text-xs font-extrabold text-muted-foreground">${q.init}</span><div><div class="text-sm font-bold text-ink">${q.name}</div><div class="text-xs text-zinc-400">${q.role}</div></div></figcaption></figure>`)}</div><div class="reveal mt-16 border-t border-border pt-12 text-center md:mt-20"><p class="mb-6 text-xs font-bold tracking-[0.16em] text-zinc-400 uppercase">Used by India's top ecommerce businesses</p><div class="flex flex-wrap justify-center gap-x-11 gap-y-4">${[
		"Paragon",
		"Amazon",
		"Allcargologistics",
		"Lykis"
	].map((b) => renderTemplate`<span class="cursor-default text-[19px] font-extrabold tracking-tight text-zinc-400 transition-colors hover:text-muted-foreground">${b}</span>`)}</div></div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/Testimonials.astro", void 0);
//#endregion
//#region src/components/landing/sections/WhyDeepEcom.astro
var $$WhyDeepEcom = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="py-20 md:py-28" id="why"><div class="mx-auto max-w-6xl px-6">${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Why DeepEcom",
		"title": "Why finance teams love DeepEcom.",
		"lead": "Save hours. Reduce errors. Make better decisions."
	})}<div class="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">${[
		[
			"01",
			"Streamlined operations",
			"Say goodbye to disjointed processes. DeepEcom integrates with leading ERP solutions like Tally and Sap to deliver a unified operations platform — manage inventory, orders and finances without switching between tools."
		],
		[
			"02",
			"Reduce errors",
			"Automate reconciliation, tax reports and settlement matching. What used to take days of spreadsheet work now happens accurately, every single cycle."
		],
		[
			"03",
			"Simplified tax compliance",
			"Ease the burden of tax filing. DeepEcom is designed to make GST returns a one-click operation, keeping you compliant with minimal fuss."
		],
		[
			"04",
			"Save time",
			"Reconcile 10,000+ orders a month in minutes — not hours. Your team gets its evenings back during close week."
		],
		[
			"05",
			"Data-driven decisions",
			"Unlock the potential of your business data. In-depth analytics and business intelligence reveal sales trends, customer behavior and market performance for sharper strategy."
		],
		[
			"06",
			"Improve profitability",
			"SKU-level profitability and margin visibility across channels — so you scale what works and fix what leaks cash on fees."
		]
	].map(([n, t, d]) => renderTemplate`<div class="reveal border-t border-zinc-300 pt-6"><span class="text-[13px] font-bold tracking-widest text-primary">${n}</span><h3 class="mt-3 mb-2 text-[17.5px] font-bold tracking-tight">${t}</h3><p class="text-[14.5px]/relaxed text-muted-foreground">${d}</p></div>`)}</div></div></section>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/sections/WhyDeepEcom.astro", void 0);
//#endregion
//#region src/components/layout/SectionDivider.astro
createAstro("http://localhost:4321");
var $$SectionDivider = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SectionDivider;
	const { class: className } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<hr aria-hidden="true"${addAttribute(["mx-auto max-w-6xl border-t border-hairline", className], "class:list")}>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/layout/SectionDivider.astro", void 0);
//#endregion
//#region src/components/landing/site-nav.tsx
var LINKS = [
	{
		href: "#how",
		label: "How it works"
	},
	{
		href: "#features",
		label: "Features"
	},
	{
		href: "#integrations",
		label: "Integrations"
	},
	{
		href: "#why",
		label: "Why DeepEcom"
	},
	{
		href: "#pricing",
		label: "Pricing"
	},
	{
		href: "#testimonials",
		label: "Testimonials"
	},
	{
		href: "#faq",
		label: "FAQ"
	}
];
function SiteNav() {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState("");
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	useEffect(() => {
		const ids = LINKS.map((l) => l.href.slice(1));
		const onScroll = () => {
			let current = "";
			for (const id of ids) {
				const el = document.getElementById(id);
				if (el && el.getBoundingClientRect().top <= 150) current = id;
			}
			setActive(current);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("header", {
		className: `fixed inset-x-0 top-0 z-50 border-b bg-white/85 backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow] ${scrolled ? "border-border shadow-xs" : "border-transparent"}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-17 max-w-6xl items-center gap-6 px-6",
			children: [
				/* @__PURE__ */ jsxs("a", {
					href: "#",
					className: "inline-flex items-center gap-2.5 text-[17.5px] font-extrabold tracking-tight text-ink no-underline",
					children: [/* @__PURE__ */ jsx(LogoMark, {}), "DeepEcom"]
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "mx-auto hidden items-center gap-1 lg:flex",
					"aria-label": "Main",
					children: LINKS.map((l) => /* @__PURE__ */ jsx("a", {
						href: l.href,
						"aria-current": active === l.href.slice(1) ? "true" : void 0,
						className: `rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-black/5 hover:text-ink ${active === l.href.slice(1) ? "bg-accent text-primary" : "text-muted-foreground"}`,
						children: l.label
					}, l.href))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ml-auto flex items-center gap-3 lg:ml-0",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "#",
							className: "hidden rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-ink sm:block",
							children: "Sign in"
						}),
						/* @__PURE__ */ jsx(Button, {
							render: /* @__PURE__ */ jsx("a", { href: "#contact" }),
							size: "sm",
							children: "Start free trial"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "grid size-9 place-items-center rounded-lg border border-border text-ink lg:hidden",
							"aria-expanded": open,
							"aria-controls": "mobile-nav",
							"aria-label": open ? "Close menu" : "Open menu",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ jsx(XIcon, { size: 17 }) : /* @__PURE__ */ jsx(MenuIcon, { size: 17 })
						})
					]
				})
			]
		})
	}), open && /* @__PURE__ */ jsxs("div", {
		id: "mobile-nav",
		className: "fixed inset-x-0 top-17 z-40 border-b border-border bg-white px-6 pt-3 pb-5 shadow-lg lg:hidden",
		children: [LINKS.map((l) => /* @__PURE__ */ jsx("a", {
			href: l.href,
			onClick: () => setOpen(false),
			className: "block border-b border-subtle py-3 text-base font-semibold text-ink no-underline",
			children: l.label
		}, l.href)), /* @__PURE__ */ jsx(Button, {
			render: /* @__PURE__ */ jsx("a", { href: "#contact" }),
			className: "mt-4 w-full",
			children: "Start free trial"
		})]
	})] });
}
//#endregion
//#region src/components/landing/site-footer.astro
var $$SiteFooter = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<footer class="border-t border-border bg-muted"><div class="mx-auto max-w-6xl px-6"><div class="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr] lg:gap-12 lg:py-20"><div><a href="#" class="inline-flex items-center gap-2.5 text-[17.5px] font-extrabold tracking-tight text-ink no-underline">${renderComponent($$result, "LogoMark", LogoMark, {})}DEEPECOM.</a><p class="mt-4 max-w-xs text-sm/relaxed text-muted-foreground">DeepEcom is your trusted partner for automated ecommerce accounting, payment reconciliation, and tax compliance. Built for Indian sellers.</p><p class="mt-3 text-[13px] font-semibold text-muted-foreground">Get connected with us on social networks:</p><div class="mt-5 flex gap-2"><a href="#" aria-label="X (Twitter)" class="grid size-9 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-primary hover:shadow-xs"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.3l-4.9-6.4L6.5 22H3.4l7.3-8.3L1 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L6.5 3.9H4.7L17.8 20z"></path></svg></a><a href="https://www.linkedin.com/company/deepecom/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="grid size-9 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-primary hover:shadow-xs"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.31h4.52V23H.24V8.31zM8.34 8.31h4.33v2h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.92V23h-4.51v-7.13c0-1.7-.03-3.89-2.37-3.89-2.37 0-2.73 1.85-2.73 3.76V23H8.34V8.31z"></path></svg></a><a href="#" aria-label="YouTube" class="grid size-9 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-primary hover:shadow-xs"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.3 31.3 0 000 12a31.3 31.3 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.3 31.3 0 0024 12a31.3 31.3 0 00-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"></path></svg></a><a href="#" aria-label="Instagram" class="grid size-9 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-primary hover:shadow-xs"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><path d="M17.5 6.5h.01"></path></svg></a></div></div><nav aria-label="Footer"><h4 class="mb-4 text-xs font-bold tracking-[0.1em] text-zinc-400 uppercase">Links</h4>${[
		["#", "About"],
		["#features", "Features"],
		["#pricing", "Pricing"],
		["#integrations", "Integrations"],
		["#why", "Benefits"]
	].map(([href, label]) => renderTemplate`<a${addAttribute(href, "href")} class="block py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-ink">${label}</a>`)}</nav><nav aria-label="More"><h4 class="mb-4 text-xs font-bold tracking-[0.1em] text-zinc-400 uppercase">Resources</h4>${[
		["#testimonials", "Testimonials"],
		["#faq", "FAQ"],
		["#", "Privacy"],
		["#", "Terms"],
		["#contact", "Contact"]
	].map(([href, label]) => renderTemplate`<a${addAttribute(href, "href")} class="block py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-ink">${label}</a>`)}</nav></div><div class="flex flex-wrap items-center justify-between gap-3 border-t border-border py-5 text-[13px] text-zinc-400"><span>© 2026 DeepEcom Technologies Pvt Ltd. All rights reserved.</span><span>Koregaon Park, Pune, Maharashtra 411001</span></div></div></footer>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/site-footer.astro", void 0);
//#endregion
//#region src/layouts/LandingLayout.astro
createAstro("http://localhost:4321");
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
	})}${renderHead($$result)}</head><body class="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">${renderComponent($$result, "SiteNav", SiteNav, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "@/components/landing/site-nav",
		"client:component-export": "default"
	})}<main class="relative">${renderSlot($$result, $$slots["default"])}</main>${renderComponent($$result, "SiteFooter", $$SiteFooter, {})}<!-- spacer so the sticky mobile CTA never covers footer content --><div class="h-18 md:hidden" aria-hidden="true"></div><!-- sticky mobile CTA --><div id="mobile-cta" class="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-border bg-white/95 backdrop-blur transition-transform duration-300 md:hidden"><div class="mx-auto flex max-w-md items-center gap-2.5 px-4 py-3"><a href="#contact"${addAttribute(`${buttonVariants({ variant: "outline" })} flex-1`, "class")}>Schedule demo</a><a href="#pricing"${addAttribute(`${buttonVariants()} flex-1 gap-1.5`, "class")}>Start free trial${renderComponent($$result, "ArrowNarrowRightIcon", ArrowNarrowRightIcon, { "size": 15 })}</a></div></div>${renderScript($$result, "/home/ranjit/Documents/deepecom/website/src/layouts/LandingLayout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/home/ranjit/Documents/deepecom/website/src/layouts/LandingLayout.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "LandingLayout", $$LandingLayout, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Hero", $$Hero, {})}${renderComponent($$result, "DashboardPreview", $$DashboardPreview, {})}${renderComponent($$result, "MetricsBand", $$MetricsBand, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "FlowDiagram", $$FlowDiagram, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Clarity", $$Clarity, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "FeaturesBento", $$FeaturesBento, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Settlements", $$Settlements, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Integrations", $$Integrations, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "WhyDeepEcom", $$WhyDeepEcom, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Testimonials", $$Testimonials, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "Pricing", $$Pricing, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "FAQ", $$FAQ, {})}${renderComponent($$result, "SectionDivider", $$SectionDivider, {})}${renderComponent($$result, "FinalCta", $$FinalCta, {})}${renderComponent($$result, "CallToActionArea", $$Contact, {})}` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/index.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
