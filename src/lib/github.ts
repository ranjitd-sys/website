// src/lib/github.ts
const GITHUB_API = "https://api.github.com";

export interface TreeItem {
  path: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
}

export async function getRepoTree(owner: string, repo: string, token: string, branch = "main") {
  const refRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!refRes.ok) throw new Error(`Failed to get ref: ${refRes.status}`);
  const refData = await refRes.json();

  const treeRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${refData.object.sha}?recursive=1`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
  );
  if (!treeRes.ok) throw new Error(`Failed to get tree: ${treeRes.status}`);
  const treeData = await treeRes.json();

  return treeData.tree as TreeItem[];
}

export async function getFileContent(owner: string, repo: string, path: string, token: string) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`Failed to get file ${path}: ${res.status}`);
  const data = await res.json();
  return Buffer.from(data.content, "base64").toString("utf-8");
}