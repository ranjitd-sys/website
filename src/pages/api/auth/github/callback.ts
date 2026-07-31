import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  // 1. Exchange code for GitHub Access Token
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
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return new Response(tokenData.error_description, { status: 400 });
  }

  // 2. Fetch User Profile from GitHub API
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "Effect-Institute-App",
    },
  });

  const githubUser = await userResponse.json();

  // 3. Set encrypted/httpOnly user session cookie
  cookies.set("user_session", JSON.stringify({
    id: githubUser.id,
    login: githubUser.login,
    name: githubUser.name || githubUser.login,
    avatar: githubUser.avatar_url,
  }), {
    path: "/careers",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return redirect("/careers/", 302);
};

