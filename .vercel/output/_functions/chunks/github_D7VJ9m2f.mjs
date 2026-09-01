//#region src/lib/github.ts
var GITHUB_API = "https://api.github.com";
async function getRepoTree(owner, repo, token, branch = "main") {
	const refRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/refs/heads/${branch}`, { headers: {
		Authorization: `Bearer ${token}`,
		Accept: "application/vnd.github+json"
	} });
	if (!refRes.ok) throw new Error(`Failed to get ref: ${refRes.status}`);
	const refData = await refRes.json();
	const treeRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${refData.object.sha}?recursive=1`, { headers: {
		Authorization: `Bearer ${token}`,
		Accept: "application/vnd.github+json"
	} });
	if (!treeRes.ok) throw new Error(`Failed to get tree: ${treeRes.status}`);
	return (await treeRes.json()).tree;
}
async function getFileContent(owner, repo, path, token) {
	const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, { headers: {
		Authorization: `Bearer ${token}`,
		Accept: "application/vnd.github+json"
	} });
	if (!res.ok) throw new Error(`Failed to get file ${path}: ${res.status}`);
	const data = await res.json();
	return Buffer.from(data.content, "base64").toString("utf-8");
}
//#endregion
export { getRepoTree as n, getFileContent as t };
