import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as parseSignedSession } from "./session_xxGyTLZU.mjs";
//#region src/pages/api/auth/github/repos.ts
var repos_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ cookies }) => {
	const user = parseSignedSession(cookies.get("user_session")?.value);
	if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=50", { headers: {
		Authorization: `Bearer ${user.token}`,
		Accept: "application/vnd.github+json",
		"User-Agent": "Effect-Institute-App"
	} });
	if (!response.ok) return new Response(JSON.stringify({ error: "Failed to fetch repositories" }), { status: 500 });
	const repoList = (await response.json()).map((r) => ({
		name: r.name,
		fullName: r.full_name,
		private: r.private
	}));
	return new Response(JSON.stringify(repoList), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/github/repos@_@ts
var page = () => repos_exports;
//#endregion
export { page };
