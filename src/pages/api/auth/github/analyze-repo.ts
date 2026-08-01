// src/pages/api/careers/analyze-repo.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies }) => {
  const sessionCookie = cookies.get("user_session")?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const user = JSON.parse(sessionCookie);

  if (!user.selectedRepo || !user.phase1Completed) {
    return new Response(JSON.stringify({ error: "Prerequisites not met" }), { status: 400 });
  }

  // Update user session state to 'analyzing'
  user.analysisStatus = "analyzing";
  cookies.set("user_session", JSON.stringify(user), { path: "/" });

  // Example: Queue an async background worker or trigger GitHub API inspection
  // e.g. await queueRepoAnalysis(user.selectedRepo, user.login);

  return new Response(JSON.stringify({ success: true, status: "analyzing" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};