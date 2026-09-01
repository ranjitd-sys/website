import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as serializeSession, t as parseSignedSession } from "./session_xxGyTLZU.mjs";
import { n as getRepoTree, t as getFileContent } from "./github_D7VJ9m2f.mjs";
//#region src/pages/api/careers/analyze-repo.ts
var analyze_repo_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ cookies }) => {
	const user = parseSignedSession(cookies.get("user_session")?.value);
	if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	if (!user.selectedRepo || !user.phase1Completed) return new Response(JSON.stringify({ error: "Prerequisites not met" }), { status: 400 });
	if (!user.login || !user.token) return new Response(JSON.stringify({ error: "Missing GitHub token" }), { status: 400 });
	const [owner, repo] = user.selectedRepo.split("/");
	const relevantFiles = (await getRepoTree(owner, repo, user.token)).filter((item) => item.type === "blob" && (item.size ?? 0) < 1e5 && /\.(ts|tsx|js|jsx|json|md|prisma)$/.test(item.path) && !item.path.includes("node_modules"));
	const fileContents = await Promise.all(relevantFiles.map(async (file) => ({
		path: file.path,
		content: await getFileContent(owner, repo, file.path, user.token)
	})));
	const updatedUser = {
		...user,
		analysisStatus: "done",
		analysisScore: 94
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
		fileCount: fileContents.length,
		files: fileContents
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/careers/analyze-repo@_@ts
var page = () => analyze_repo_exports;
//#endregion
export { page };
