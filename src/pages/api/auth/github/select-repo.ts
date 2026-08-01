// src/pages/api/github/select-repo.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("user_session")?.value;

  console.log(sessionCookie)
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const { repoFullName } = await request.json();
  console.log("repo name", repoFullName)
  
  if (!repoFullName) {
    return new Response(JSON.stringify({ error: "Repository name required" }), { status: 400 });
  }
  
  const user = JSON.parse(sessionCookie);
  console.log(user)
  // Update session with the chosen repository
  const updatedUser = {
    ...user,
    selectedRepo: repoFullName, // e.g., "torvalds/linux" or "username/my-effect-repo"
  };



  return new Response(JSON.stringify({ success: true, selectedRepo: repoFullName }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};