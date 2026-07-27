src/pages/blog/index.astro
src/pages/blog/[...slug].astro
src/pages/podcast/index.astro
src/pages/podcast/episodes/          ← whole folder
src/pages/podcast/rss.xml.ts

src/content/blog/                    ← whole folder (all .mdx posts, authors.json, tags.json, releases/, this-week-in-effect/, cause-and-effect/)
src/content/podcasts/                ← whole folder (numbered episode folders)

src/features/podcast/                ← whole folder (collection.ts, context.tsx, domain.ts, utils.ts, components/)
src/features/youtube-embed/          ← whole folder (podcast episodes embed YouTube)

src/components/blog/                 ← whole folder (BlogControls, CopyLinkButton, PostCard, TWIEScrollRail, TableOfContents)
src/components/SocialLink.astro
src/components/Link.astro            ← the top-level one, different from ui/Link.tsx
src/components/ui/collapsible.tsx
src/components/ui/scroll-area.tsx
src/components/ui/TweetEmbed.tsx     ← if any blog post embeds a tweet