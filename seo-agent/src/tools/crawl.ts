import { Context, Data, Effect, Layer } from "effect"
import { parse } from "node-html-parser"
import type { CrawlResult } from "../types/market.js"

export type { CrawlResult }

export class CrawlError extends Data.TaggedError("CrawlError")<{
  readonly url: string
  readonly reason: string
}> {}

export interface CrawlShape {
  readonly crawlPage: (url: string) => Effect.Effect<CrawlResult, CrawlError>
}

export class CrawlService extends Context.Service<CrawlService, CrawlShape>()("Crawl") {}

const FETCH_TIMEOUT_MS = 10_000
const MAX_LINK_CHECKS = 10

const originOf = (url: string): string => {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}

const isInternal = (href: string, origin: string): boolean => {
  if (!href || href.startsWith("#")) return false
  if (href.startsWith("/")) return true
  try {
    return new URL(href).origin === origin
  } catch {
    return false
  }
}

const absolute = (href: string, origin: string): string => {
  try {
    return new URL(href, origin).href
  } catch {
    return href
  }
}

// Returns true when the target is broken (non-2xx or unreachable).
const checkLink = async (target: string, signal: AbortSignal): Promise<boolean> => {
  const check = async (method: string): Promise<Response | null> => {
    try {
      return await fetch(target, {
        method,
        redirect: "follow",
        signal: AbortSignal.any([signal, AbortSignal.timeout(FETCH_TIMEOUT_MS)]),
      })
    } catch {
      return null
    }
  }
  let response = await check("HEAD")
  if (response === null || response.status === 405 || response.status === 501) {
    response = await check("GET")
  }
  if (response === null) return true
  const ok = response.status >= 200 && response.status < 300
  response.body?.cancel?.().catch(() => {})
  return !ok
}

const crawl = async (url: string, signal: AbortSignal): Promise<CrawlResult> => {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.any([signal, AbortSignal.timeout(FETCH_TIMEOUT_MS)]),
  })
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`HTTP ${response.status}`)
  }
  const html = await response.text()
  const root = parse(html)
  const origin = originOf(url)

  const title = root.querySelector("title")?.text.trim() ?? ""
  const description = root.querySelector('meta[name="description"]')?.getAttribute("content") ?? ""
  const h1 = root.querySelector("h1")?.text.trim() ?? ""
  const scriptTags = root.querySelectorAll("script")
  const jsonLdBlocks = scriptTags.filter((s) => s.getAttribute("type") === "application/ld+json").length

  const internalHrefs = root
    .querySelectorAll("a")
    .map((a) => a.getAttribute("href") ?? "")
    .filter((href) => isInternal(href, origin))
  const internalLinks = internalHrefs.length

  let brokenLinks = 0
  for (const href of internalHrefs.slice(0, MAX_LINK_CHECKS)) {
    if (await checkLink(absolute(href, origin), signal)) brokenLinks++
  }

  return { title, description, h1, jsonLdBlocks, internalLinks, brokenLinks }
}

export const CrawlServiceLive: Layer.Layer<CrawlService> = Layer.succeed(CrawlService, {
  crawlPage: (url) =>
    Effect.log(`crawl: fetching ${url}`).pipe(
      Effect.andThen(
        Effect.tryPromise({
          try: (signal) => crawl(url, signal),
          catch: (error) =>
            new CrawlError({ url, reason: error instanceof Error ? error.message : String(error) }),
        }),
      ),
      Effect.tap((r) =>
        Effect.log(
          `crawl: title="${r.title}" h1="${r.h1}" jsonLd=${r.jsonLdBlocks} internal=${r.internalLinks} broken=${r.brokenLinks}`,
        ),
      ),
    ),
})