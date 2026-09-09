import type { APIRoute } from "astro"
import { parseSignedSession, serializeSession } from "@/lib/session"

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = parseSignedSession(cookies.get("user_session")?.value)

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const { repoFullName } = await request.json()

  if (typeof repoFullName !== "string") {
    return new Response(JSON.stringify({ error: "Repository name required" }), { status: 400 })
  }

  // Empty string clears the linked repository; any new repo also invalidates
  // a previous analysis so results never show for the wrong codebase.
  const updatedUser = {
    ...user,
    selectedRepo: repoFullName,
    ...(user.selectedRepo !== repoFullName ? { analysisStatus: "idle" as const } : {}),
  }

  cookies.set("user_session", serializeSession(updatedUser), {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })

  return new Response(JSON.stringify({ success: true, selectedRepo: repoFullName }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}