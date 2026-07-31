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

  const accessToken = tokenData.access_token;

  // 2. Fetch User Profile from GitHub API
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Effect-Institute-App",
    },
  });

  const githubUser = await userResponse.json();

  // 3. Provision the Challenge Repository from a Template Repo
  // Note: Replace "your-organization" and "challenge-effect-template" with your actual template repo details.
  // The template repo must be marked as a "Template repository" on GitHub.
  const repoName = `institute-effect-${githubUser.login.toLowerCase()}`;
  
  try {
    await fetch(`https://api.github.com/repos/your-organization/challenge-effect-template/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "Effect-Institute-App",
      },
      body: JSON.stringify({
        owner: githubUser.login,
        name: repoName,
        private: true,
        description: "Institute Assessment: Functional Fundamentals with Effect-TS",
      }),
    });
  } catch (err) {
    // Fails silently if the repo already exists (e.g., user logged in previously)
    console.log("Repository might already exist or creation failed:", err);
  }

  // 4. Set encrypted/httpOnly user session cookie (including the token)
  cookies.set("user_session", JSON.stringify({
    id: githubUser.id,
    login: githubUser.login,
    name: githubUser.name || githubUser.login,
    avatar: githubUser.avatar_url,
    token: accessToken, // Required for future git operations & test evaluations
  }), {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return redirect("/careers/", 302);
};