/// <reference types="astro/client" />

declare module "@astrojs/markdown-satteri" {
  export type SatteriHeading = { depth: number; slug: string; text: string }

  export interface RenderedMarkdown {
    code: string
    metadata: {
      headings: SatteriHeading[]
      frontmatter: Record<string, unknown>
      localImagePaths: string[]
      remoteImagePaths: string[]
    }
  }

  export interface MarkdownProcessor {
    render(
      content: string,
      opts?: { frontmatter?: Record<string, unknown>; fileURL?: URL },
    ): Promise<RenderedMarkdown>
  }

  export function createSatteriMarkdownProcessor(
    opts?: Record<string, unknown>,
  ): MarkdownProcessor
}