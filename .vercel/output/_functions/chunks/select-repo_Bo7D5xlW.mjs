import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as serializeSession, t as parseSignedSession } from "./session_xxGyTLZU.mjs";
//#region src/pages/api/auth/github/select-repo.ts
var select_repo_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies }) => {
	const user = parseSignedSession(cookies.get("user_session")?.value);
	if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	const { repoFullName } = await request.json();
	if (!repoFullName) return new Response(JSON.stringify({ error: "Repository name required" }), { status: 400 });
	const updatedUser = {
		...user,
		selectedRepo: repoFullName
	};
	cookies.set("user_session", serializeSession(updatedUser), {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge: 3600 * 24 * 7
	});
	return new Response(JSON.stringify({
		success: true,
		selectedRepo: repoFullName
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/github/select-repo@_@ts
var page = () => select_repo_exports;
//#endregion
export { page };
