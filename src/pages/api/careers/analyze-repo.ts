// src/pages/api/careers/analyze-repo.ts
import type { APIRoute } from "astro";
import { parseSignedSession, serializeSession } from "@/lib/session";

export const POST: APIRoute = async ({ cookies }) => {
  const user = parseSignedSession(cookies.get("user_session")?.value);

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  if (!user.selectedRepo || !user.phase1Completed) {
    return new Response(JSON.stringify({ error: "Prerequisites not met" }), { status: 400 });
  }

  // Update user session state to 'running'
  const updatedUser = {
    ...user,
    analysisStatus: "running" as const,
  };

  cookies.set("user_session", serializeSession(updatedUser), {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Example: Queue an async background worker or trigger GitHub API inspection
  // e.g. await queueRepoAnalysis(updatedUser.selectedRepo, updatedUser.login);

  return new Response(JSON.stringify({ success: true, status: "running" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};