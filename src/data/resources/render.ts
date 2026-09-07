import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri"

interface Processor {
  render(
    content: string,
    opts?: Record<string, unknown>,
  ): Promise<{
    code: string
    metadata: { headings: { depth: number; slug: string; text: string }[] }
  }>
}

let processor: Processor | undefined

async function getProcessor(): Promise<Processor> {
  if (!processor) {
    processor = (await createSatteriMarkdownProcessor({})) as Processor
  }
  return processor
}

export interface RenderedBody {
  html: string
  headings: { depth: number; slug: string; text: string }[]
}

/** Render a Markdown string to static HTML (Sätteri processor).
 *  Heading `id`s and a heading index are produced by the processor. */
export async function renderMarkdown(body: string): Promise<RenderedBody> {
  const p = await getProcessor()
  const { code, metadata } = await p.render(body)
  return { html: code, headings: metadata.headings }
}