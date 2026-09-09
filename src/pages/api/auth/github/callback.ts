import type { APIRoute } from "astro"
import { serializeSession, parseSignedSession } from "@/lib/session"

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code")

  if (!code) {
    return new Response("Missing authorization code", { status: 400 })
  }

  // 1. Exchange code for GitHub access token
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: import.meta.env.GITHUB_CLIENT_ID,
      client_secret: import.meta.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  const tokenData = await tokenResponse.json()

  if (tokenData.error) {
    return new Response(tokenData.error_description || "Authentication failed", { status: 400 })
  }

  const accessToken = tokenData.access_token

  // 2. Fetch user profile from GitHub API
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Effect-Institute-App",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })

  if (!userResponse.ok) {
    return new Response("Failed to fetch user profile from GitHub", { status: 500 })
  }

  const githubUser = await userResponse.json()

  // 3. Provision challenge repository from template repo (configure template below)
  const repoName = `institute-effect-${githubUser.login.toLowerCase()}`

  try {
    await fetch(`https://api.github.com/repos/your-organization/challenge-effect-template/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Effect-Institute-App",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        owner: githubUser.login,
        name: repoName,
        private: true,
        description: "Institute Assessment: Functional Fundamentals with Effect-TS",
      }),
    })
  } catch {
    // template not configured or repo already exists — continue
  }

  // 5. Preserve existing session state if returning
  const existingCookie = cookies.get("user_session")?.value
  const existingSession = parseSignedSession(existingCookie)

  let existingData: Record<string, unknown> = {}
  if (existingCookie) {
    try {
      existingData = JSON.parse(existingCookie)
    } catch {
      // ignore corrupt cookies
    }
  }

  const sessionData = {
    id: githubUser.id,
    login: githubUser.login,
    name: githubUser.name || githubUser.login,
    avatar: githubUser.avatar_url,
    token: accessToken,
    phase1Completed: existingSession?.phase1Completed ?? false,
    selectedRepo: existingSession?.selectedRepo ?? "",
    analysisStatus: existingSession?.analysisStatus ?? "idle",
  }

  cookies.set("user_session", serializeSession(sessionData), {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })

  return redirect("/careers/", 302)
}