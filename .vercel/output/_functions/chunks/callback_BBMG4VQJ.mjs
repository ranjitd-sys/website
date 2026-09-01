import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as serializeSession, t as parseSignedSession } from "./session_xxGyTLZU.mjs";
//#region src/pages/api/auth/github/callback.ts
var callback_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ url, cookies, redirect }) => {
	const code = url.searchParams.get("code");
	if (!code) return new Response("Missing authorization code", { status: 400 });
	const tokenData = await (await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			client_id: "Ov23liRMt6VbL9huR7wK",
			client_secret: "6fccb5b0048cc3958725b1aaacb6d3c1b4436fd2",
			code
		})
	})).json();
	if (tokenData.error) return new Response(tokenData.error_description || "Authentication failed", { status: 400 });
	const accessToken = tokenData.access_token;
	const userResponse = await fetch("https://api.github.com/user", { headers: {
		Authorization: `Bearer ${accessToken}`,
		"User-Agent": "Effect-Institute-App",
		"X-GitHub-Api-Version": "2022-11-28"
	} });
	if (!userResponse.ok) return new Response("Failed to fetch user profile from GitHub", { status: 500 });
	const githubUser = await userResponse.json();
	const repoName = `institute-effect-${githubUser.login.toLowerCase()}`;
	try {
		await fetch(`https://api.github.com/repos/your-organization/challenge-effect-template/generate`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/vnd.github+json",
				"User-Agent": "Effect-Institute-App",
				"X-GitHub-Api-Version": "2022-11-28"
			},
			body: JSON.stringify({
				owner: githubUser.login,
				name: repoName,
				private: true,
				description: "Institute Assessment: Functional Fundamentals with Effect-TS"
			})
		});
	} catch (err) {
		console.log("Repository generation skipped or already exists:", err);
	}
	const existingCookie = cookies.get("user_session")?.value;
	const existingSession = parseSignedSession(existingCookie);
	if (existingCookie) try {
		JSON.parse(existingCookie);
	} catch {}
	const sessionData = {
		id: githubUser.id,
		login: githubUser.login,
		name: githubUser.name || githubUser.login,
		avatar: githubUser.avatar_url,
		token: accessToken,
		phase1Completed: existingSession?.phase1Completed ?? false,
		selectedRepo: existingSession?.selectedRepo ?? "",
		analysisStatus: existingSession?.analysisStatus ?? "idle"
	};
	cookies.set("user_session", serializeSession(sessionData), {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge: 3600 * 24 * 7
	});
	return redirect("/careers/", 302);
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/github/callback@_@ts
var page = () => callback_exports;
//#endregion
export { page };
