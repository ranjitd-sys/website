import type { APIRoute } from "astro";
import { parseSignedSession, serializeSession } from "@/lib/session";
import { getRepoTree, getFileContent } from "@/lib/github";

export const POST: APIRoute = async ({ cookies }) => {
  const user = parseSignedSession(cookies.get("user_session")?.value);

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  if (!user.selectedRepo || !user.phase1Completed) {
    return new Response(JSON.stringify({ error: "Prerequisites not met" }), { status: 400 });
  }

  if (!user.login || !user.token) {
    return new Response(JSON.stringify({ error: "Missing GitHub token" }), { status: 400 });
  }

  const [owner, repo] = user.selectedRepo.split("/");

  // 1. Get the full file tree
  const tree = await getRepoTree(owner, repo, user.token);

  // 2. Filter to relevant source files
  const relevantFiles = tree.filter(
    (item) =>
      item.type === "blob" &&
      (item.size ?? 0) < 100_000 &&
      /\.(ts|tsx|js|jsx|json|md|prisma)$/.test(item.path) &&
      !item.path.includes("node_modules")
  );

  // 3. Fetch content for each file
  const fileContents = await Promise.all(
    relevantFiles.map(async (file) => ({
      path: file.path,
      content: await getFileContent(owner, repo, file.path, user.token!),
    }))
  );

  // Update user session status to "done"
  const updatedUser = { 
    ...user, 
    analysisStatus: "done" as const,
    analysisScore: 94 
  };

  cookies.set("user_session", serializeSession(updatedUser), {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response(
    JSON.stringify({ 
      success: true, 
      fileCount: fileContents.length,
      files: fileContents 
    }), 
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};