
// src/pages/api/github/repos.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  const sessionCookie = cookies.get("user_session")?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const user = JSON.parse(sessionCookie);

  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=50", {
    headers: {
      Authorization: `Bearer ${user.token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Effect-Institute-App",
    },
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch repositories" }), { status: 500 });
  }

  const repos = await response.json();
  
  // Return a clean list of repository names/full_names
  const repoList = repos.map((r: any) => ({
    name: r.name,
    fullName: r.full_name,
    private: r.private,
  }));

  return new Response(JSON.stringify(repoList), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};