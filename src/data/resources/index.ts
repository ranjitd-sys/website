import { POSTS } from "./articles"
import { GUIDES } from "./guides"
import { FAQ_FLAT } from "./faqs"
import { HELP_FLAT } from "./help"
import type { CatalogItem, PostCategory, TopicId } from "./types"
import { guideTopic, HUBS, postTopic } from "./types"

export function eraDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z")
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
}

export const POSTS_CATALOG: CatalogItem[] = POSTS.map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  kind: "blog",
  filter: "blog",
  category: p.category,
  meta: `${eraDate(p.date)} · ${p.readingTime}`,
  href: `/resources/blog/${p.id}`,
  date: p.date,
  featured: p.featured,
  highlight: p.highlight,
}))

export const GUIDES_CATALOG: CatalogItem[] = GUIDES.map((g) => ({
  id: g.id,
  title: g.title,
  description: g.description,
  kind: "guide",
  filter: "guides",
  category: g.topic,
  meta: `${g.level} · ${g.readingTime}`,
  href: `/resources/guides/${g.id}`,
}))

export const HUBS_CATALOG: CatalogItem[] = HUBS.map((h) => ({
  id: h.id,
  title: h.title,
  description: h.description,
  kind: "hub",
  filter: h.id,
  category: "Knowledge hub",
  meta: "Guides, articles and help",
  href: h.href,
  featured: true,
}))

export const FAQ_CATALOG: CatalogItem = {
  id: "faqs",
  title: "Frequently asked questions",
  description:
    "Searchable answers on the Platform, ERP Connector, reconciliation, GST, TCS/TDS, inventory and ERP integrations.",
  kind: "faq",
  filter: "faqs",
  category: "FAQs",
  meta: `${FAQ_FLAT.length} questions and answers`,
  href: "/resources/faqs",
  featured: true,
}

export const HELP_CATALOG: CatalogItem = {
  id: "help-center",
  title: "Help Center",
  description:
    "Documentation for getting started, the Platform, ERP Connector, integrations and support.",
  kind: "help",
  filter: "help",
  category: "Help Center",
  meta: "Documentation and guides",
  href: "/resources/help-center",
  featured: true,
}

/** Everything shown on the Resources landing grid. */
export const RESOURCE_CATALOG: CatalogItem[] = [
  ...POSTS_CATALOG,
  ...GUIDES_CATALOG,
  ...HUBS_CATALOG,
  FAQ_CATALOG,
  HELP_CATALOG,
]

export interface SearchItem {
  title: string
  description: string
  type: string
  category: string
  href: string
}

function truncate(text: string, n: number): string {
  return text.length > n ? text.slice(0, n - 1).trimEnd() + "…" : text
}

/** Flat search index embedded in the Resources search UI. */
export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = []
  for (const p of POSTS) {
    items.push({
      title: p.title,
      description: truncate(p.description, 96),
      type: "Blog",
      category: p.category,
      href: `/resources/blog/${p.id}`,
    })
  }
  for (const g of GUIDES) {
    items.push({
      title: g.title,
      description: truncate(g.description, 96),
      type: "Guide",
      category: g.topic,
      href: `/resources/guides/${g.id}`,
    })
  }
  for (const h of HUBS) {
    items.push({
      title: h.title,
      description: truncate(h.description, 96),
      type: "Knowledge hub",
      category: "Resources",
      href: h.href,
    })
  }
  for (const f of FAQ_FLAT) {
    items.push({
      title: f.question,
      description: truncate(f.answer, 96),
      type: "FAQ",
      category: "FAQs",
      href: "/resources/faqs",
    })
  }
  for (const h of HELP_FLAT) {
    items.push({
      title: h.title,
      description: truncate(h.description, 84),
      type: "Help Center",
      category: "Documentation",
      href: h.href,
    })
  }
  return items
}

/** All topic tags that appear on resource cards (for filtering/search chips). */
export function topicFromPost(category: string): string | undefined {
  return postTopic(category as Parameters<typeof postTopic>[0])
}

export function topicFromGuide(topic: string): string | undefined {
  return guideTopic(topic)
}

/** Everything relevant to one topic: its hub, guides and articles. */
export function resourcesForTopic(topicId: TopicId): CatalogItem[] {
  const posts = POSTS_CATALOG.filter(
    (p) => postTopic(p.category as PostCategory) === topicId,
  )
  const guides = GUIDES_CATALOG.filter((g) => guideTopic(g.category) === topicId)
  const hub = HUBS_CATALOG.find((h) => h.filter === topicId)
  return [...(hub ? [hub] : []), ...guides, ...posts]
}