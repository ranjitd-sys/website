// src/pages/api/github/select-repo.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("user_session")?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { repoFullName } = await request.json();
  if (!repoFullName) {
    return new Response(JSON.stringify({ error: "Repository name required" }), { status: 400 });
  }

  const user = JSON.parse(sessionCookie);

  // Update session with the chosen repository
  const updatedUser = {
    ...user,
    selectedRepo: repoFullName, // e.g., "torvalds/linux" or "username/my-effect-repo"
  };

  cookies.set("user_session", JSON.stringify(updatedUser), {
    path: "/careers",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response(JSON.stringify({ success: true, selectedRepo: repoFullName }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};