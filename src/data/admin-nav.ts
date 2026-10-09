export type AdminAgentIcon = "search" | "mail"
export type AdminAgentStatus = "live" | "soon"

export interface AdminAgent {
  id: string
  name: string
  product: string
  blurb: string
  href: string
  icon: AdminAgentIcon
  status: AdminAgentStatus
}

export const ADMIN_AGENTS: AdminAgent[] = [
  {
    id: "seo",
    name: "SEO Agent",
    product: "DeepRank",
    blurb: "Finds ranking opportunities, ships metadata PRs, and measures the results.",
    href: "/admin/seo",
    icon: "search",
    status: "live",
  },
  {
    id: "email",
    name: "Email Agent",
    product: "Coming soon",
    blurb: "Autonomous seller email campaigns — tool announcements, follow-ups and lifecycle sends.",
    href: "/admin/email",
    icon: "mail",
    status: "soon",
  },
]

export const getAgentBySlug = (slug: string): AdminAgent | undefined =>
  ADMIN_AGENTS.find((a) => a.id === slug && a.status === "soon")
