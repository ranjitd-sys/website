import { _ as maybeRenderHead, c as renderComponent, g as renderTemplate, y as addAttribute } from "./jsx-runtime_B2Zh7rhS.mjs";
import { i as createComponent } from "./_astro_assets_DbfyT0-S.mjs";
import { cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ChevronDown, Menu, X } from "lucide-react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/landing/ui/button.tsx
var buttonVariants = cva("inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60", {
	variants: {
		variant: {
			primary: "bg-brand-500 text-white hover:bg-brand-600",
			outline: "border border-ink-200 bg-white text-ink-900 hover:border-ink-300 hover:bg-ink-50",
			secondary: "bg-ink-100 text-ink-900 hover:bg-ink-200",
			ghost: "text-ink-900 hover:bg-ink-100",
			white: "bg-white text-ink-900 shadow-sm ring-1 ring-ink-200/60 hover:bg-ink-50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			sm: "h-9 px-3.5 text-sm",
			default: "h-10 px-4 text-sm",
			lg: "h-12 px-6 text-base"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "default"
	}
});
function Button({ className, variant, size, render, type = "button", children, ...props }) {
	const cls = twMerge(clsx(buttonVariants({
		variant,
		size
	}), className));
	if (isValidElement(render)) return cloneElement(render, {
		className: cls,
		...props
	}, children);
	return /* @__PURE__ */ jsx("button", {
		type,
		className: cls,
		...props,
		children
	});
}
//#endregion
//#region src/components/landing/icons.tsx
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
//#endregion
//#region src/data/navigation.ts
var NAV_ITEMS = [
	{
		id: "products",
		label: "Products",
		type: "menu",
		groups: [{
			title: "Platform",
			description: "Understand your ecommerce business",
			links: [
				{
					label: "Overview",
					href: "/platform"
				},
				{
					label: "Profitability",
					href: "/platform/profitability"
				},
				{
					label: "Payment Reconciliation",
					href: "/platform/payment-reconciliation"
				},
				{
					label: "Dashboard",
					href: "/platform/dashboard"
				},
				{
					label: "Reports",
					href: "/platform/reports"
				}
			]
		}, {
			title: "ERP Connector",
			description: "Make your ERP ecommerce-ready",
			links: [
				{
					label: "Overview",
					href: "/erp-connector"
				},
				{
					label: "Accounting",
					href: "/erp-connector/accounting"
				},
				{
					label: "GST",
					href: "/erp-connector/gst"
				},
				{
					label: "Inventory & Stock Transfers",
					href: "/erp-connector/inventory-stock-transfers"
				}
			]
		}],
		featured: {
			label: "ERP Integrations",
			description: "Tally · SAP · Zoho",
			href: "/integrations"
		}
	},
	{
		id: "solutions",
		label: "Solutions",
		type: "menu",
		groups: [{
			title: "By Business",
			links: [
				{
					label: "Amazon Sellers",
					href: "/solutions/amazon-sellers"
				},
				{
					label: "D2C Brands",
					href: "/solutions/d2c-brands"
				},
				{
					label: "Enterprise",
					href: "/solutions/enterprise"
				}
			]
		}, {
			title: "By Role",
			links: [
				{
					label: "CFOs",
					href: "/solutions/cfos"
				},
				{
					label: "Accountants",
					href: "/solutions/accountants"
				},
				{
					label: "Business Owners",
					href: "/solutions/business-owners"
				}
			]
		}]
	},
	{
		id: "integrations",
		label: "Integrations",
		type: "link",
		href: "/integrations"
	},
	{
		id: "customers",
		label: "Customers",
		type: "link",
		href: "/customers"
	},
	{
		id: "resources",
		label: "Resources",
		type: "menu",
		groups: [{
			title: "Learn",
			links: [
				{
					label: "Blog",
					href: "/resources/blog"
				},
				{
					label: "Guides",
					href: "/resources/guides"
				},
				{
					label: "FAQs",
					href: "/resources/faqs"
				},
				{
					label: "Help Center",
					href: "/resources/help-center"
				}
			]
		}, {
			title: "Topics",
			links: [
				{
					label: "Ecommerce Accounting",
					href: "/resources/ecommerce-accounting"
				},
				{
					label: "Reconciliation",
					href: "/resources/reconciliation"
				},
				{
					label: "GST",
					href: "/resources/gst"
				},
				{
					label: "ERP",
					href: "/resources/erp"
				}
			]
		}]
	},
	{
		id: "pricing",
		label: "Pricing",
		type: "link",
		href: "/pricing"
	}
];
var BOOK_DEMO_URL = "/contact";
var LOGIN_URL = "/login";
//#endregion
//#region src/components/landing/site-nav.tsx
var OPEN_DELAY = 90;
var CLOSE_DELAY = 140;
function useHoverNav() {
	const [open, setOpen] = useState(null);
	const openTimer = useRef(null);
	const closeTimer = useRef(null);
	const triggerRefs = useRef({});
	const panelRefs = useRef({});
	const clearTimers = () => {
		if (openTimer.current) {
			clearTimeout(openTimer.current);
			openTimer.current = null;
		}
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	};
	const openSoon = useCallback((id) => {
		clearTimers();
		openTimer.current = setTimeout(() => setOpen(id), OPEN_DELAY);
	}, []);
	const closeSoon = useCallback(() => {
		clearTimers();
		closeTimer.current = setTimeout(() => setOpen(null), CLOSE_DELAY);
	}, []);
	const openNow = useCallback((id, focusFirst = false) => {
		clearTimers();
		setOpen(id);
		if (focusFirst) requestAnimationFrame(() => {
			(panelRefs.current[id]?.querySelector("a"))?.focus();
		});
	}, []);
	const closeNow = useCallback((refocusTrigger) => {
		clearTimers();
		setOpen(null);
		if (refocusTrigger) triggerRefs.current[refocusTrigger]?.focus();
	}, []);
	const keepOpen = useCallback(() => clearTimers(), []);
	useEffect(() => {
		const onPointerDown = (e) => {
			if (open && !e.target.closest("[data-nav-root]")) setOpen(null);
		};
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(null);
		};
		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("keydown", onKey);
			clearTimers();
		};
	}, [open]);
	return {
		open,
		openSoon,
		closeSoon,
		keepOpen,
		openNow,
		closeNow,
		triggerRefs,
		panelRefs
	};
}
function focusNextLink(panel, dir) {
	if (!panel) return;
	const links = Array.from(panel.querySelectorAll("a"));
	if (!links.length) return;
	const active = document.activeElement;
	const idx = active ? links.indexOf(active) : -1;
	links[idx === -1 ? dir === 1 ? 0 : links.length - 1 : (idx + dir + links.length) % links.length].focus();
}
function NavTrigger({ item, open, onFocus, onKeyDown, onMouseEnter, onMouseLeave, registerTrigger }) {
	const cls = `group inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${open ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`;
	if (item.type === "menu") return /* @__PURE__ */ jsxs("button", {
		type: "button",
		ref: (el) => registerTrigger(item.id, el),
		"aria-expanded": open,
		"aria-haspopup": "menu",
		"aria-controls": `nav-panel-${item.id}`,
		onMouseEnter,
		onMouseLeave,
		onFocus,
		onKeyDown,
		onClick: () => onFocus(),
		className: cls,
		children: [item.label, /* @__PURE__ */ jsx(ChevronDown, {
			size: 14,
			className: `transition-transform duration-200 ${open ? "rotate-180" : ""}`,
			"aria-hidden": true
		})]
	});
	return /* @__PURE__ */ jsx("a", {
		href: item.href,
		onFocus,
		onMouseEnter,
		onMouseLeave,
		className: cls,
		children: item.label
	});
}
function NavPanel({ item, open, panelRefs, onKeyDown, onClose, onKeepOpen }) {
	if (item.type !== "menu" || !item.groups) return null;
	return /* @__PURE__ */ jsx("div", {
		id: `nav-panel-${item.id}`,
		ref: (el) => {
			panelRefs[item.id] = el;
		},
		role: "group",
		"aria-label": item.label,
		onMouseEnter: onKeepOpen,
		onMouseLeave: onClose,
		onKeyDown,
		className: `absolute top-full left-1/2 z-50 mt-2.5 -translate-x-1/2 transition-all duration-200 ease-out ${open ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-1 opacity-0"}${item.id === "products" ? " w-[680px]" : item.id === "solutions" ? " w-[560px]" : " w-[500px]"}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "nav-panel overflow-hidden rounded-2xl border border-border bg-white shadow-card ring-1 ring-ink-950/5",
			children: [
				/* @__PURE__ */ jsx("span", {
					"aria-hidden": "true",
					className: "nav-panel-notch"
				}),
				item.id === "products" && /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 divide-x divide-border/60 bg-popover",
					children: [item.groups.map((g) => /* @__PURE__ */ jsxs("div", {
						className: "p-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "px-2 pb-1.5",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
								children: g.description ?? g.title
							}), g.description && /* @__PURE__ */ jsx("h3", {
								className: "mt-0.5 text-sm font-semibold text-foreground",
								children: g.title
							})]
						}), /* @__PURE__ */ jsx("ul", {
							className: "mt-1 space-y-0.5",
							children: g.links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
								href: l.href,
								className: "group/link -mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-muted/60 hover:text-foreground",
								children: [/* @__PURE__ */ jsx("span", {
									"aria-hidden": "true",
									className: "size-1.5 shrink-0 rounded-full bg-primary opacity-0 scale-0 transition-all duration-150 group-hover/link:scale-100 group-hover/link:opacity-100"
								}), /* @__PURE__ */ jsx("span", {
									className: "truncate",
									children: l.label
								})]
							}) }, l.href))
						})]
					}, g.title)), /* @__PURE__ */ jsxs("div", {
						className: "col-span-2 flex items-center justify-between gap-4 border-t border-border/60 bg-muted/40 px-5 py-3.5 transition-colors hover:bg-muted/60",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-foreground",
							children: item.featured?.label
						}), item.featured && /* @__PURE__ */ jsxs("a", {
							href: item.featured.href,
							className: "group/feat inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80",
							children: [/* @__PURE__ */ jsx("span", { children: item.featured.description }), /* @__PURE__ */ jsx("span", {
								"aria-hidden": "true",
								className: "transition-transform duration-150 group-hover/feat:translate-x-0.5",
								children: "→"
							})]
						})]
					})]
				}),
				item.id === "solutions" && /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 divide-x divide-border/60 bg-popover",
					children: item.groups.map((g, idx) => /* @__PURE__ */ jsxs("div", {
						className: `p-5 ${idx % 2 !== 0 ? "bg-muted/30" : ""}`,
						children: [/* @__PURE__ */ jsx("div", {
							className: "px-2 pb-1.5",
							children: /* @__PURE__ */ jsxs("p", {
								className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary",
								children: [/* @__PURE__ */ jsx("span", {
									"aria-hidden": "true",
									className: "h-px w-3.5 bg-primary/70"
								}), g.title]
							})
						}), /* @__PURE__ */ jsx("ul", {
							className: "mt-1 space-y-0.5",
							children: g.links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
								href: l.href,
								className: "group/link -mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-background hover:text-foreground hover:shadow-xs",
								children: [/* @__PURE__ */ jsx("span", {
									"aria-hidden": "true",
									className: "size-1.5 shrink-0 rounded-full bg-primary opacity-0 scale-0 transition-all duration-150 group-hover/link:scale-100 group-hover/link:opacity-100"
								}), /* @__PURE__ */ jsx("span", {
									className: "truncate",
									children: l.label
								})]
							}) }, l.href))
						})]
					}, g.title))
				}),
				item.id === "resources" && /* @__PURE__ */ jsxs("div", {
					className: "p-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-2",
						children: item.groups.map((g) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "px-2.5 pb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: g.title
						}), /* @__PURE__ */ jsx("ul", {
							className: "space-y-0.5",
							children: g.links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: l.href,
								className: "block rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground transition-colors hover:bg-brand-50 hover:font-medium hover:text-foreground",
								children: l.label
							}) }, l.href))
						})] }, g.title))
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-2 rounded-xl border border-border bg-brand-50/40 p-4",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Browse the help center"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-0.5 text-[13px] text-muted-foreground",
								children: "Guides, FAQs and how-to guides across ecommerce accounting, GST and ERP."
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/resources/help-center",
								className: "mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-brand-700",
								children: "Explore guides →"
							})
						]
					})]
				})
			]
		})
	});
}
function MobileAccordion({ item, expanded, onToggle, onNavigate }) {
	if (item.type !== "menu" || !item.groups) return /* @__PURE__ */ jsx("a", {
		href: item.href,
		onClick: onNavigate,
		className: "block rounded-lg px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-brand-50",
		children: item.label
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-border/70 last:border-0",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			"aria-expanded": expanded,
			onClick: onToggle,
			className: "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[15px] font-medium text-foreground transition-colors hover:bg-brand-50",
			children: [item.label, /* @__PURE__ */ jsx(ChevronDown, {
				size: 15,
				className: `transition-transform duration-200 ${expanded ? "rotate-180" : ""}`,
				"aria-hidden": true
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: `grid transition-all duration-200 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`,
			children: /* @__PURE__ */ jsx("div", {
				className: "overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "pb-3 pl-3",
					children: item.groups.map((g) => /* @__PURE__ */ jsxs("div", {
						className: "mb-3 last:mb-0",
						children: [/* @__PURE__ */ jsx("p", {
							className: "px-2.5 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: g.title
						}), /* @__PURE__ */ jsx("ul", {
							className: "space-y-1",
							children: g.links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: l.href,
								onClick: onNavigate,
								className: "block rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-brand-50 hover:text-foreground",
								children: l.label
							}) }, l.href))
						})]
					}, g.title))
				})
			})
		})]
	});
}
function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [mobileExpanded, setMobileExpanded] = useState([]);
	const { open, openSoon, closeSoon, keepOpen, openNow, closeNow, triggerRefs, panelRefs } = useHoverNav();
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	useEffect(() => {
		if (!mobileOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [mobileOpen]);
	const toggleMobileAccordion = (id) => setMobileExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	const handleTriggerKeyDown = (e, id) => {
		if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			openNow(id, true);
		} else if (e.key === "Escape") closeNow();
	};
	const handlePanelKeyDown = (e, id) => {
		if (e.key === "Escape") {
			e.preventDefault();
			closeNow(id);
		} else if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowLeft") {
			e.preventDefault();
			focusNextLink(panelRefs.current[id], e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1);
		}
	};
	return /* @__PURE__ */ jsxs("header", {
		"data-nav-root": true,
		className: `fixed inset-x-0 top-0 z-50 border-b transition-[border-color,box-shadow] duration-200 ${scrolled ? "border-border bg-white/85 shadow-xs backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-white/0"}`,
		children: [/* @__PURE__ */ jsxs("nav", {
			className: "mx-auto flex h-16 max-w-7xl items-center gap-6 px-6 lg:h-17",
			"aria-label": "Primary",
			children: [
				/* @__PURE__ */ jsxs("a", {
					href: "/",
					onFocus: () => closeNow(),
					className: "inline-flex items-center gap-2.5 text-[17.5px] font-bold tracking-tight text-foreground no-underline",
					children: [/* @__PURE__ */ jsx(LogoMark, {}), "DeepEcom"]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "ml-4 hidden items-center gap-1 lg:flex",
					children: NAV_ITEMS.map((item) => /* @__PURE__ */ jsxs("div", {
						className: "relative",
						onMouseEnter: () => item.type === "menu" ? openSoon(item.id) : void 0,
						onMouseLeave: () => item.type === "menu" ? closeSoon() : void 0,
						children: [/* @__PURE__ */ jsx(NavTrigger, {
							item,
							open: open === item.id,
							onFocus: () => item.type === "menu" ? openNow(item.id) : closeNow(),
							onKeyDown: (e) => handleTriggerKeyDown(e, item.id),
							onMouseEnter: () => item.type === "menu" ? openSoon(item.id) : void 0,
							onMouseLeave: () => item.type === "menu" ? closeSoon() : void 0,
							registerTrigger: (id, el) => triggerRefs.current[id] = el
						}), item.type === "menu" && /* @__PURE__ */ jsx(NavPanel, {
							item,
							open: open === item.id,
							panelRefs: panelRefs.current,
							onKeyDown: (e) => handlePanelKeyDown(e, item.id),
							onClose: () => closeSoon(),
							onKeepOpen: keepOpen
						})]
					}, item.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ml-auto flex items-center gap-2.5",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: LOGIN_URL,
							onFocus: () => closeNow(),
							className: "hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block",
							children: "Login"
						}),
						/* @__PURE__ */ jsx(Button, {
							render: /* @__PURE__ */ jsx("a", { href: BOOK_DEMO_URL }),
							size: "sm",
							className: "hidden sm:inline-flex",
							children: "Book a Demo"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "grid size-9 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-brand-50 lg:hidden",
							"aria-expanded": mobileOpen,
							"aria-controls": "mobile-nav",
							"aria-label": mobileOpen ? "Close menu" : "Open menu",
							onClick: () => setMobileOpen((v) => !v),
							children: mobileOpen ? /* @__PURE__ */ jsx(X, { size: 18 }) : /* @__PURE__ */ jsx(Menu, { size: 18 })
						})
					]
				})
			]
		}), mobileOpen && /* @__PURE__ */ jsxs("div", {
			id: "mobile-nav",
			className: "fixed inset-x-0 top-16 bottom-0 z-40 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto border-t border-border bg-white px-4 pb-24 pt-3 lg:hidden",
			children: [/* @__PURE__ */ jsx("div", {
				className: "grid gap-1",
				children: NAV_ITEMS.map((item) => /* @__PURE__ */ jsx(MobileAccordion, {
					item,
					expanded: mobileExpanded.includes(item.id),
					onToggle: () => toggleMobileAccordion(item.id),
					onNavigate: () => setMobileOpen(false)
				}, item.id))
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-6 grid gap-2.5 border-t border-border pt-5",
				children: [/* @__PURE__ */ jsx("a", {
					href: "/login",
					onClick: () => setMobileOpen(false),
					className: "inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-brand-50",
					children: "Login"
				}), /* @__PURE__ */ jsx(Button, {
					render: /* @__PURE__ */ jsx("a", { href: "/contact" }),
					onClick: () => setMobileOpen(false),
					className: "w-full",
					children: "Book a Demo"
				})]
			})]
		})]
	});
}
//#endregion
//#region src/components/landing/site-footer.astro
var $$SiteFooter = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<footer class="border-t border-border bg-muted"><div class="mx-auto max-w-6xl px-6"><div class="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-12 lg:py-20"><div><a href="/" class="inline-flex items-center gap-2.5 text-[17.5px] font-extrabold tracking-tight text-ink no-underline">${renderComponent($$result, "LogoMark", LogoMark, {})}DEEPECOM.</a><p class="mt-4 max-w-xs text-sm/relaxed text-muted-foreground">DeepEcom is your accounting layer for ecommerce — marketplace data, profitability, payment reconciliation and detailed ERP accounting.</p><p class="mt-3 text-[13px] font-semibold text-muted-foreground">Get connected with us on social networks:</p><div class="mt-5 flex gap-2"><a href="#" aria-label="X (Twitter)" class="grid size-9 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-primary hover:shadow-xs"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.3l-4.9-6.4L6.5 22H3.4l7.3-8.3L1 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L6.5 3.9H4.7L17.8 20z"></path></svg></a><a href="https://www.linkedin.com/company/deepecom/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="grid size-9 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-primary hover:shadow-xs"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.31h4.52V23H.24V8.31zM8.34 8.31h4.33v2h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.92V23h-4.51v-7.13c0-1.7-.03-3.89-2.37-3.89-2.37 0-2.73 1.85-2.73 3.76V23H8.34V8.31z"></path></svg></a></div></div><nav aria-label="Products"><h4 class="mb-4 text-xs font-bold tracking-[0.1em] text-zinc-400 uppercase">Products</h4>${[
		["/platform", "Platform"],
		["/platform/profitability", "Profitability"],
		["/platform/payment-reconciliation", "Payment Reconciliation"],
		["/erp-connector", "ERP Connector"],
		["/erp-connector/accounting", "Accounting"]
	].map(([href, label]) => renderTemplate`<a${addAttribute(href, "href")} class="block py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-ink">${label}</a>`)}</nav><nav aria-label="Company"><h4 class="mb-4 text-xs font-bold tracking-[0.1em] text-zinc-400 uppercase">Company</h4>${[
		["/solutions", "Solutions"],
		["/integrations", "Integrations"],
		["/customers", "Customers"],
		["/pricing", "Pricing"],
		["/contact", "Contact"]
	].map(([href, label]) => renderTemplate`<a${addAttribute(href, "href")} class="block py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-ink">${label}</a>`)}</nav><nav aria-label="Resources"><h4 class="mb-4 text-xs font-bold tracking-[0.1em] text-zinc-400 uppercase">Resources</h4>${[
		["/resources", "Resources"],
		["/resources/blog", "Blog"],
		["/resources/guides", "Guides"],
		["/resources/faqs", "FAQs"],
		["/resources/help-center", "Help Center"]
	].map(([href, label]) => renderTemplate`<a${addAttribute(href, "href")} class="block py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-ink">${label}</a>`)}</nav></div><div class="flex flex-wrap items-center justify-between gap-3 border-t border-border py-5 text-[13px] text-zinc-400"><span>© 2026 DeepEcom Technologies Pvt Ltd. All rights reserved.</span><span>Koregaon Park, Pune, Maharashtra 411001</span></div></div></footer>`;
}, "/home/ranjit/Documents/deepecom/website/src/components/landing/site-footer.astro", void 0);
//#endregion
export { buttonVariants as i, Navbar as n, Button as r, $$SiteFooter as t };
