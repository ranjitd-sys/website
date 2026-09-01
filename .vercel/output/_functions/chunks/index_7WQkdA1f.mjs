import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { f as Fragment$2, u as renderComponent, v as renderTemplate, x as addAttribute, y as maybeRenderHead } from "./jsx-runtime_6Vijajm9.mjs";
import { i as createComponent, r as $$Image } from "./_astro_assets_BhK2b17i.mjs";
import { i as getEntries, n as $$GridBackground, r as getCollection, t as $$PageLayout } from "./PageLayout_Bk9hjFwf.mjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, FileSearch, Rss } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Struct } from "effect";
//#region src/components/blog/TagChip.tsx
function TagChip({ name }) {
	return /* @__PURE__ */ jsx("span", {
		className: "inline-flex items-center rounded-md border border-zinc-600 px-2 py-0.5 font-mono text-xs tracking-[0.12em] text-zinc-200 uppercase",
		children: name
	});
}
function OverflowChip({ count }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center rounded-md border border-zinc-700 px-2 py-0.5 font-mono text-xs tracking-[0.12em] text-zinc-400 uppercase",
		children: ["+", count]
	});
}
//#endregion
//#region src/components/blog/PostCard.tsx
function PostCard({ post }) {
	const visibleTags = [...post.tags].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 2);
	const overflow = post.tags.length - 2;
	return /* @__PURE__ */ jsx("a", {
		href: post.href,
		className: "group -mx-4 block border-t border-zinc-700/80 px-4 py-6 transition-colors first:border-t-0 hover:bg-zinc-900/60",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-12 items-baseline gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "col-span-12 min-w-0 md:col-span-8",
				children: [/* @__PURE__ */ jsxs("h3", {
					className: "relative inline-block text-lg font-semibold text-white",
					children: [
						/* @__PURE__ */ jsx("span", { children: post.title }),
						/* @__PURE__ */ jsx(ArrowRight, {
							"aria-hidden": "true",
							className: "ml-2 inline-block h-4 w-4 -translate-x-1 align-middle text-white opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
						}),
						/* @__PURE__ */ jsx("span", { className: "absolute right-0 -bottom-0.5 left-0 h-px origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100" })
					]
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 line-clamp-2 text-base leading-relaxed text-zinc-400 transition-colors group-hover:text-zinc-200",
					children: post.excerpt
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "col-span-12 flex flex-wrap items-baseline gap-x-3 gap-y-2 md:col-span-4 md:flex-col md:items-end md:gap-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2 md:justify-end",
					children: [visibleTags.map((tag) => /* @__PURE__ */ jsx(TagChip, { name: tag.name }, tag.id)), overflow > 0 && /* @__PURE__ */ jsx(OverflowChip, { count: overflow })]
				}), /* @__PURE__ */ jsx("time", {
					className: "shrink-0 font-mono text-xs text-zinc-400 tabular-nums",
					children: post.date
				})]
			})]
		})
	});
}
//#endregion
//#region src/components/blog/BlogControls.tsx
var POSTS_PER_PAGE = 12;
var NAVBAR_HEIGHT = 64;
function readCategoryFromUrl(tags) {
	if (typeof window === "undefined") return "all";
	const param = new URLSearchParams(window.location.search).get("category");
	if (param && tags.some((tag) => tag.id === param)) return param;
	return "all";
}
function BlogControls({ posts, tags }) {
	const [activeTagId, setActiveTagId] = useState(() => readCategoryFromUrl(tags));
	const [sortOrder, setSortOrder] = useState("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const [categoryOpen, setCategoryOpen] = useState(false);
	const gridRef = useRef(null);
	const categoryDropdownRef = useRef(null);
	const activeTagName = useMemo(() => tags.find((tag) => tag.id === activeTagId)?.name ?? "All", [tags, activeTagId]);
	const sortedTags = useMemo(() => [...tags].sort((tagA, tagB) => {
		if (tagA.id === "all") return -1;
		if (tagB.id === "all") return 1;
		return tagB.count - tagA.count;
	}), [tags]);
	const filteredPosts = useMemo(() => {
		return [...activeTagId === "all" ? posts : posts.filter((post) => post.tags.some((tag) => tag.id === activeTagId))].sort((postA, postB) => {
			const comparison = postA.dateMs - postB.dateMs;
			return sortOrder === "newest" ? -comparison : comparison;
		});
	}, [
		posts,
		activeTagId,
		sortOrder
	]);
	const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
	const safePage = Math.min(currentPage, totalPages);
	const paginatedPosts = useMemo(() => filteredPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE), [filteredPosts, safePage]);
	useEffect(() => {
		if (!categoryOpen) return;
		const handleClickOutside = (event) => {
			if (!categoryDropdownRef.current?.contains(event.target)) setCategoryOpen(false);
		};
		const handleEscapeKey = (event) => {
			if (event.key === "Escape") setCategoryOpen(false);
		};
		window.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("keydown", handleEscapeKey);
		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("keydown", handleEscapeKey);
		};
	}, [categoryOpen]);
	const syncUrl = useCallback((tagId) => {
		if (typeof window === "undefined") return;
		const url = new URL(window.location.href);
		if (tagId === "all") url.searchParams.delete("category");
		else url.searchParams.set("category", tagId);
		window.history.pushState({ category: tagId }, "", url);
	}, []);
	const maybeScrollToGrid = useCallback(() => {
		const element = gridRef.current;
		if (!element) return;
		const { top } = element.getBoundingClientRect();
		if (top < NAVBAR_HEIGHT) window.scrollTo({
			top: top + window.scrollY - NAVBAR_HEIGHT,
			behavior: "smooth"
		});
	}, []);
	const handleTagChange = useCallback((tagId) => {
		setActiveTagId(tagId);
		setCurrentPage(1);
		syncUrl(tagId);
		maybeScrollToGrid();
	}, [syncUrl, maybeScrollToGrid]);
	const clearFilters = useCallback(() => {
		setActiveTagId("all");
		setCurrentPage(1);
		syncUrl("all");
	}, [syncUrl]);
	const goToPage = useCallback((page) => {
		setCurrentPage(page);
		maybeScrollToGrid();
	}, [maybeScrollToGrid]);
	useEffect(() => {
		const handlePopState = () => {
			setActiveTagId(readCategoryFromUrl(tags));
			setCurrentPage(1);
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [tags]);
	const pageItems = useMemo(() => {
		const items = [];
		if (totalPages <= 7) for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) items.push(pageNumber);
		else {
			items.push(1);
			if (safePage > 3) items.push("ellipsis");
			const start = Math.max(2, safePage - 1);
			const end = Math.min(totalPages - 1, safePage + 1);
			for (let pageNumber = start; pageNumber <= end; pageNumber++) items.push(pageNumber);
			if (safePage < totalPages - 2) items.push("ellipsis");
			items.push(totalPages);
		}
		return items;
	}, [totalPages, safePage]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-w-0 pb-24",
		children: [/* @__PURE__ */ jsxs("div", {
			ref: gridRef,
			className: "mt-16 flex flex-wrap items-baseline justify-between gap-4 border-b border-zinc-700/80 pb-4 md:mt-20",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-semibold tracking-tight text-white",
				children: activeTagId === "all" ? "All posts" : activeTagName
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-baseline gap-x-4 gap-y-3 sm:gap-x-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						ref: categoryDropdownRef,
						className: "relative",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setCategoryOpen((isOpen) => !isOpen),
							"aria-haspopup": "listbox",
							"aria-expanded": categoryOpen,
							className: "group inline-flex items-baseline gap-1.5 font-mono text-xs tracking-wider uppercase transition-colors",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-zinc-200 group-hover:text-white",
								children: activeTagName
							}), /* @__PURE__ */ jsx(ChevronDown, {
								"aria-hidden": "true",
								className: `h-3.5 w-3.5 self-center text-zinc-500 transition-transform group-hover:text-zinc-300 ${categoryOpen ? "rotate-180" : ""}`
							})]
						}), categoryOpen && /* @__PURE__ */ jsx("ul", {
							role: "listbox",
							className: "absolute right-0 z-20 mt-2 w-64 rounded-md border border-zinc-700 bg-zinc-950 py-2 shadow-lg shadow-black/40",
							children: sortedTags.map((category) => {
								const isActive = activeTagId === category.id;
								return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
									type: "button",
									role: "option",
									"aria-selected": isActive,
									onClick: () => {
										handleTagChange(category.id);
										setCategoryOpen(false);
									},
									className: `group/item relative flex w-full items-baseline justify-between gap-3 px-4 py-2 text-left font-mono text-xs tracking-wider uppercase transition-colors ${isActive ? "text-white" : "text-zinc-300 hover:text-white"}`,
									children: [
										/* @__PURE__ */ jsx("span", { children: category.name }),
										/* @__PURE__ */ jsx("span", {
											className: `tabular-nums ${isActive ? "text-white" : "text-zinc-500"}`,
											children: String(category.count).padStart(3, "0")
										}),
										/* @__PURE__ */ jsx("span", { className: `pointer-events-none absolute right-4 bottom-1 left-4 h-px origin-left bg-white transition-transform duration-300 ease-out ${isActive ? "scale-x-100" : "scale-x-0 group-hover/item:scale-x-[0.08]"}` })
									]
								}) }, category.id);
							})
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setSortOrder((previous) => previous === "newest" ? "oldest" : "newest"),
						"aria-label": `Sort: ${sortOrder === "newest" ? "Newest" : "Oldest"} first. Click to toggle.`,
						className: "group inline-flex items-baseline gap-1.5 font-mono text-xs tracking-wider uppercase transition-colors",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-zinc-200 group-hover:text-white",
							children: sortOrder === "newest" ? "Newest" : "Oldest"
						}), /* @__PURE__ */ jsx(ArrowUpDown, {
							"aria-hidden": "true",
							className: "h-3.5 w-3.5 self-center text-zinc-500 group-hover:text-zinc-300"
						})]
					}),
					/* @__PURE__ */ jsxs("a", {
						href: "/rss.xml",
						"aria-label": "RSS feed",
						className: "group inline-flex items-baseline gap-1.5 font-mono text-xs tracking-wider text-zinc-200 uppercase transition-colors hover:text-white",
						children: [/* @__PURE__ */ jsx("span", { children: "RSS" }), /* @__PURE__ */ jsx(Rss, {
							"aria-hidden": "true",
							className: "h-3.5 w-3.5 self-center text-zinc-500 group-hover:text-zinc-300"
						})]
					})
				]
			})]
		}), paginatedPosts.length > 0 ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
			className: "flex flex-col",
			children: paginatedPosts.map((post) => /* @__PURE__ */ jsx(PostCard, { post }, post.id))
		}), totalPages > 1 && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", { className: "mt-12 h-px bg-zinc-800" }), /* @__PURE__ */ jsxs("nav", {
			"aria-label": "Blog pagination",
			className: "mt-8 flex items-center justify-center gap-1",
			children: [
				/* @__PURE__ */ jsx("button", {
					type: "button",
					disabled: safePage <= 1,
					onClick: () => goToPage(safePage - 1),
					"aria-label": "Previous page",
					className: "flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white disabled:pointer-events-none disabled:opacity-30",
					children: /* @__PURE__ */ jsx(ChevronLeft, {
						"aria-hidden": "true",
						className: "h-4 w-4"
					})
				}),
				pageItems.map((item, index) => item === "ellipsis" ? /* @__PURE__ */ jsx("span", {
					className: "px-1.5 font-mono text-xs text-zinc-500",
					children: "⋯"
				}, `ellipsis-${index}`) : /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => goToPage(item),
					"aria-current": item === safePage ? "page" : void 0,
					className: `group/page relative flex h-8 min-w-8 items-center justify-center px-2 font-mono text-xs tabular-nums transition-colors ${item === safePage ? "text-white" : "text-zinc-400 hover:text-white"}`,
					children: [/* @__PURE__ */ jsx("span", {
						className: item === safePage ? "font-semibold" : "",
						children: String(item).padStart(2, "0")
					}), /* @__PURE__ */ jsx("span", { className: `pointer-events-none absolute right-2 -bottom-0.5 left-2 h-px origin-left bg-white transition-transform duration-300 ease-out ${item === safePage ? "scale-x-100" : "scale-x-0 group-hover/page:scale-x-[0.2]"}` })]
				}, item)),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					disabled: safePage >= totalPages,
					onClick: () => goToPage(safePage + 1),
					"aria-label": "Next page",
					className: "flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white disabled:pointer-events-none disabled:opacity-30",
					children: /* @__PURE__ */ jsx(ChevronRight, {
						"aria-hidden": "true",
						className: "h-4 w-4"
					})
				})
			]
		})] })] }) : /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center justify-center py-24",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900/60",
					children: /* @__PURE__ */ jsx(FileSearch, {
						"aria-hidden": "true",
						className: "h-6 w-6 text-zinc-400"
					})
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-6 text-base font-medium text-zinc-300",
					children: "No posts found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 max-w-sm text-center text-sm leading-relaxed text-zinc-400",
					children: "No posts match the current filters."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 flex flex-wrap items-center justify-center gap-2",
					children: [
						"release",
						"effect",
						"typescript"
					].map((suggestedId) => {
						const suggested = tags.find((tag) => tag.id === suggestedId);
						if (!suggested) return null;
						return /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => handleTagChange(suggested.id),
							className: "inline-flex items-center rounded-md border border-zinc-800 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-zinc-400 uppercase transition-colors hover:border-zinc-500 hover:text-white",
							children: suggested.name
						}, suggested.id);
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: clearFilters,
					className: "mt-6 rounded-md border border-zinc-700 px-4 py-2 font-mono text-xs tracking-wider text-zinc-300 uppercase transition-colors hover:border-zinc-500 hover:text-white",
					children: "Clear all filters"
				})
			]
		})]
	});
}
//#endregion
//#region src/components/blog/TWIEScrollRail.tsx
function TWIECard({ post }) {
	const lastSegment = post.id.split("/").pop();
	const issueNumber = /^\d+$/.test(lastSegment ?? "") ? `#${lastSegment}` : null;
	return /* @__PURE__ */ jsx("a", {
		href: post.href,
		className: "group relative flex w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/40 p-4 pb-5 transition-colors duration-200 hover:border-zinc-600 hover:bg-zinc-900/70",
		children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between",
			children: [issueNumber && /* @__PURE__ */ jsx("span", {
				className: "font-mono text-base font-semibold text-white",
				children: issueNumber
			}), /* @__PURE__ */ jsx("time", {
				className: "font-mono text-xs text-zinc-400 tabular-nums",
				children: post.date
			})]
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-300",
			children: post.excerpt
		})] })
	});
}
function TWIEScrollRail({ posts, viewAllHref }) {
	const scrollRef = useRef(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const updateScrollState = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 0);
		setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
	}, []);
	useEffect(() => {
		posts.length;
		updateScrollState();
	}, [updateScrollState, posts.length]);
	const scroll = useCallback((direction) => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollBy({
			left: direction === "left" ? -300 : 300,
			behavior: "smooth"
		});
	}, []);
	if (posts.length === 0) return null;
	return /* @__PURE__ */ jsxs("section", {
		"aria-label": "This Week in Effect posts",
		className: "pt-16 pb-8 md:pt-20 md:pb-10",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-xl font-semibold text-white",
				children: "This Week in Effect"
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-5",
				children: [/* @__PURE__ */ jsx("a", {
					href: viewAllHref,
					className: "font-mono text-xs tracking-wider text-zinc-200 uppercase transition-colors hover:text-white",
					children: "View all"
				}), /* @__PURE__ */ jsxs("div", {
					className: "hidden items-center gap-2 sm:flex",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => scroll("left"),
						disabled: !canScrollLeft,
						"aria-label": "Scroll left",
						className: "flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white disabled:pointer-events-none disabled:opacity-30",
						children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => scroll("right"),
						disabled: !canScrollRight,
						"aria-label": "Scroll right",
						className: "flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white disabled:pointer-events-none disabled:opacity-30",
						children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
					})]
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative",
			children: [
				/* @__PURE__ */ jsx("div", {
					ref: scrollRef,
					onScroll: updateScrollState,
					className: "flex gap-3 overflow-x-auto py-1 pb-2",
					style: { scrollbarWidth: "none" },
					children: posts.map((post) => /* @__PURE__ */ jsx(TWIECard, { post }, post.id))
				}),
				canScrollRight && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute top-0 right-0 bottom-2 w-16 bg-gradient-to-l from-zinc-950 to-transparent" }),
				canScrollLeft && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute top-0 bottom-2 left-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent" }),
				canScrollRight && /* @__PURE__ */ jsxs("div", {
					className: "pointer-events-none absolute right-2 bottom-4 flex items-center gap-1 text-xs text-zinc-400 sm:hidden",
					children: [/* @__PURE__ */ jsx("span", { children: "Swipe" }), /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" })]
				})
			]
		})]
	});
}
//#endregion
//#region src/pages/blog/index.astro
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const [blogCollection, tagCollection] = await Promise.all([getCollection("blog"), getCollection("blogTags")]);
	const allPosts = await Promise.all(blogCollection.map(async (post) => {
		const tags = await getEntries(post.data.tags);
		return Struct.assign(post, { tags });
	})).then((posts) => posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()));
	const isTWIE = (tag) => tag.id === "this-week-in-effect";
	const twiePosts = allPosts.filter((post) => post.tags.some(isTWIE));
	const nonTwiePosts = allPosts.filter((post) => !post.tags.some(isTWIE));
	const featuredPost = allPosts.filter((post) => post.data.featured && !post.tags.some(isTWIE)).sort((a, b) => b.data.date.getTime() - a.data.date.getTime())[0];
	function formatDate(date) {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	}
	function tagCount(id) {
		if (id === "all") return nonTwiePosts.length;
		return allPosts.filter((post) => post.tags.some((tag) => tag.id === id)).length;
	}
	const serializedTags = tagCollection.map((tag) => ({
		id: tag.id,
		name: tag.data.name,
		color: tag.data.color,
		count: tagCount(tag.id)
	})).sort((a, b) => a.id === "all" ? -1 : b.id === "all" ? 1 : b.count - a.count);
	const serializedTwiePosts = twiePosts.map((post) => ({
		id: post.id,
		title: post.data.title,
		excerpt: post.data.excerpt,
		date: formatDate(post.data.date),
		dateMs: post.data.date.getTime(),
		href: `/blog/${post.id}`,
		tags: post.tags.map((t) => ({
			id: t.id,
			name: t.data.name
		}))
	}));
	const serializedPosts = allPosts.map((post) => ({
		id: post.id,
		title: post.data.title,
		excerpt: post.data.excerpt,
		date: formatDate(post.data.date),
		dateMs: post.data.date.getTime(),
		href: `/blog/${post.id}`,
		tags: post.tags.map((t) => ({
			id: t.id,
			name: t.data.name
		}))
	}));
	return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {
		"title": "Blog | Effect",
		"description": "Get with the latest updates from the Effect ecosystem",
		"activeSlug": "blog"
	}, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<section class="relative overflow-hidden">${renderComponent($$result2, "GridBackground", $$GridBackground, {})}<div class="relative mx-auto w-full max-w-295 px-4"><div class="pt-16 pb-8 md:pt-24 md:pb-12"><p class="mb-4 font-mono text-sm font-medium tracking-wider text-zinc-400 uppercase">// Effect Blog</p><h1 class="max-w-2xl text-3xl font-semibold leading-tighter tracking-tight text-white">Releases, write-ups, and notes<br class="hidden md:block">from the Effect team</h1></div>${featuredPost && renderTemplate`<div class="border-t border-zinc-800 py-5 md:py-6"><a${addAttribute(`/blog/${featuredPost.id}`, "href")} class="group relative block overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/40 transition-colors duration-200 hover:border-zinc-600 hover:bg-zinc-900/70"><div class="relative grid grid-cols-1 gap-4 p-5 md:grid-cols-12 md:items-center md:gap-10 md:p-6"><div class="min-w-0 md:col-span-7"><div class="mb-3 flex flex-wrap items-center gap-2">${featuredPost.tags.map((tag) => renderTemplate`<span class="inline-flex items-center rounded-md border border-zinc-400 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-zinc-200 uppercase">${tag.data.name}</span>`)}</div><h2 class="text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl">${featuredPost.data.title}</h2><p class="mt-2 line-clamp-3 max-w-xl text-base text-zinc-300">${featuredPost.data.excerpt}</p></div><div class="hidden md:col-span-5 md:flex md:flex-col md:items-center md:gap-3">${featuredPost.data.featuredImage ? renderTemplate`<div class="relative aspect-2/1 w-full overflow-hidden rounded-md border border-zinc-800/50">${renderComponent($$result2, "Image", $$Image, {
		"src": featuredPost.data.featuredImage,
		"alt": featuredPost.data.title,
		"class": "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
	})}<div class="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-900/60 to-transparent"></div></div>` : renderTemplate`<div class="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 transition-colors duration-200 group-hover:border-white group-hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></div>`}</div>${featuredPost.data.featuredImage && renderTemplate`<div class="relative aspect-video overflow-hidden rounded-md border border-zinc-800/50 md:hidden">${renderComponent($$result2, "Image", $$Image, {
		"src": featuredPost.data.featuredImage,
		"alt": featuredPost.data.title,
		"class": "absolute inset-0 h-full w-full object-cover"
	})}</div>`}</div></a></div>`}</div></section><div class="h-px w-full bg-zinc-800"></div>${twiePosts.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment$2, {}, { "default": ($$result3) => renderTemplate`<section class="relative"><div class="mx-auto w-full max-w-295 px-4">${renderComponent($$result3, "TWIEScrollRail", TWIEScrollRail, {
		"client:load": true,
		"posts": serializedTwiePosts,
		"viewAllHref": "/blog?category=this-week-in-effect#blog-grid",
		"client:component-hydration": "load",
		"client:component-path": "@/components/blog/TWIEScrollRail",
		"client:component-export": "TWIEScrollRail"
	})}</div></section><div class="h-px w-full bg-zinc-800"></div>` })}`}<section id="blog-grid" class="relative"><div class="mx-auto w-full max-w-295 px-4">${renderComponent($$result2, "BlogControls", BlogControls, {
		"client:load": true,
		"posts": serializedPosts,
		"tags": serializedTags,
		"client:component-hydration": "load",
		"client:component-path": "@/components/blog/BlogControls",
		"client:component-export": "default"
	})}</div></section>` })}`;
}, "/home/ranjit/Documents/deepecom/website/src/pages/blog/index.astro", void 0);
var $$file = "/home/ranjit/Documents/deepecom/website/src/pages/blog/index.astro";
var $$url = "/blog";
//#endregion
//#region \0virtual:astro:page:src/pages/blog/index@_@astro
var page = () => blog_exports;
//#endregion
export { page };
