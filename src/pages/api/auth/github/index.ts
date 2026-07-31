import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID || import.meta.env.VITE_GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
  }

  // Added 'repo' scope to grant access to read/write user repositories
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user%20read:org%20repo`;
  
  return redirect(githubAuthUrl, 302);
};