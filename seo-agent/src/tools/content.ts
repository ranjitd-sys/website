import { readFile } from "node:fs/promises"
import path from "node:path"
import { Context, Data, Effect, Layer } from "effect"

export class ContentError extends Data.TaggedError("ContentError")<{
  readonly filePath: string
  readonly reason: string
}> {}

export interface ApplyChangeInput {
  readonly filePath: string
  readonly title: string
  readonly description: string
  readonly jsonLd: string
}

export interface ApplyChangeResult {
  readonly filePath: string
  readonly content: string
}

export interface ContentShape {
  readonly applyChange: (change: ApplyChangeInput) => Effect.Effect<ApplyChangeResult, ContentError>
}

export class ContentService extends Context.Service<ContentService, ContentShape>()("Content") {}

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..", "..")

const PAGE_LAYOUT_TAG = /<PageLayout\b[\s\S]*?>/m
const TITLE_ATTR = /(\btitle\s*=\s*")[^"]*(")/m
const DESCRIPTION_ATTR = /(\bdescription\s*=\s*")[^"]*(")/m
const JSONLD_SCRIPT = /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i

const escapeAttr = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

const replaceFirst = (source: string, pattern: RegExp, value: string): string =>
  pattern.test(source) ? source.replace(pattern, `$1${escapeAttr(value)}$2`) : source

const applyJsonLd = (source: string, jsonLd: string): string => {
  const block = JSONLD_SCRIPT
  const safe = jsonLd.replace(/<\/script/gi, "<\\/script")
  if (block.test(source)) {
    return source.replace(block, `<script type="application/ld+json">${safe}</script>`)
  }
  const pad = `<script type="application/ld+json">${safe}</script>\n  `
  if (PAGE_LAYOUT_TAG.test(source)) {
    return source.replace(PAGE_LAYOUT_TAG, (match) => `${match}\n  ${pad}`)
  }
  return `${pad}${source}`
}

const applyChange = (source: string, change: ApplyChangeInput): string => {
  let next = replaceFirst(source, TITLE_ATTR, change.title)
  next = replaceFirst(next, DESCRIPTION_ATTR, change.description)
  const parsed = safeJsonLd(change.jsonLd)
  if (parsed !== null) {
    next = applyJsonLd(next, change.jsonLd)
  }
  return next
}

const safeJsonLd = (jsonLd: string): unknown => {
  try {
    return JSON.parse(jsonLd) as unknown
  } catch {
    return null
  }
}

export const ContentServiceLive: Layer.Layer<ContentService> = Layer.succeed(ContentService, {
  applyChange: (change) =>
    Effect.log(`content: applying change to ${change.filePath}`).pipe(
      Effect.andThen(
        Effect.tryPromise({
          try: async () => {
            const filePath = path.join(REPO_ROOT, change.filePath)
            const source = await readFile(filePath, "utf8")
            return { filePath: change.filePath, content: applyChange(source, change) }
          },
          catch: (error) =>
            new ContentError({
              filePath: change.filePath,
              reason: error instanceof Error ? error.message : String(error),
            }),
        }),
      ),
      Effect.tap((result) =>
        Effect.log(
          `content: diff for ${result.filePath} — title "${change.title}" (${Array.from(change.title).length} chars); description ${Array.from(change.description).length} chars; jsonLd ${Array.from(change.jsonLd).length} chars`,
        ),
      ),
    ),
})