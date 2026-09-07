import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { POSTS } from "@/data/resources/articles"

export function GET(context: APIContext) {
  const items = POSTS.map((p) => ({
    title: p.title,
    description: p.description,
    pubDate: new Date(p.date + "T00:00:00Z"),
    link: `/resources/blog/${p.id}`,
    categories: [p.category],
  })).sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

  return rss({
    title: "DeepEcom Blog",
    description:
      "Notes on ecommerce accounting, marketplace payment reconciliation, GST and ERP integration.",
    site: context.site ?? "https://deepecom.com",
    items,
  })
}