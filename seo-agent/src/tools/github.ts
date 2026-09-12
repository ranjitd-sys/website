import { execFile } from "node:child_process"
import path from "node:path"
import { promisify } from "node:util"
import { Context, Data, Effect, Layer, Redacted } from "effect"
import { Octokit } from "octokit"
import { SeoConfig } from "../Config.js"

const execFileAsync = promisify(execFile)

export class GithubError extends Data.TaggedError("GithubError")<{
  readonly operation: string
  readonly reason: string
}> {}

export interface GithubCommit {
  readonly branch: string
  readonly filePath: string
  readonly content: string
  readonly message: string
}

export interface CreatePrInput {
  readonly branch: string
  readonly title: string
  readonly body: string
}

export type GithubShape = {
  readonly createBranch: (name: string) => Effect.Effect<string, GithubError, SeoConfig>
  readonly commit: (input: GithubCommit) => Effect.Effect<void, GithubError, SeoConfig>
  readonly createPR: (input: CreatePrInput) => Effect.Effect<string, GithubError, SeoConfig>
}

export class GithubService extends Context.Service<GithubService, GithubShape>()("Github") {}

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..", "..")

interface RepoRef {
  readonly owner: string
  readonly repo: string
}

const parseUrl = (remote: string): RepoRef => {
  const clean = remote.trim().replace(/\.git$/, "")
  const ssh = clean.match(/^git@[^:]+:(.+?)\/(.+)$/)
  if (ssh) return { owner: ssh[1] as string, repo: ssh[2] as string }
  const parts = clean.split("/")
  const repo = parts.pop()
  const owner = parts.pop()
  if (owner && repo) return { owner, repo }
  throw new Error(`cannot parse repository from '${remote}'`)
}

const resolveRemote = (repoRoot: string): Promise<string> =>
  execFileAsync("git", ["-C", repoRoot, "remote", "get-url", "origin"], {
    timeout: 10_000,
  }).then(({ stdout }) => stdout.trim())

const repoRef = (githubRepoEnv: string): Effect.Effect<RepoRef, GithubError, never> =>
  Effect.gen(function* () {
    let remote = githubRepoEnv.trim()
    if (remote === "") {
      remote = yield* Effect.promise(() => resolveRemote(REPO_ROOT)).pipe(
        Effect.catchCause(() => Effect.succeed("" as const)),
      )
      remote = remote.trim()
    }
    if (remote === "") {
      return yield* Effect.fail(
        new GithubError({ operation: "resolve", reason: "no git remote origin and no GITHUB_REPO configured" }),
      )
    }
    try {
      return parseUrl(remote)
    } catch (error) {
      return yield* Effect.fail(
        new GithubError({
          operation: "resolve",
          reason: error instanceof Error ? error.message : String(error),
        }),
      )
    }
  })

const wrap = <A>(operation: string, program: () => Promise<A>): Effect.Effect<A, GithubError, never> =>
  Effect.tryPromise({
    try: program,
    catch: (error) =>
      new GithubError({
        operation,
        reason: error instanceof Error ? error.message : String(error),
      }),
  })

const GithubServiceLive: Layer.Layer<GithubService, never, SeoConfig> = Layer.effect(
  GithubService,
  Effect.gen(function* () {
    const config = yield* SeoConfig
    const token = Redacted.value(config.githubToken)
    const githubRepo = process.env.GITHUB_REPO ?? ""
    if (token.trim() === "") {
      return yield* Effect.die(
        new GithubError({ operation: "auth", reason: "GITHUB_TOKEN is empty — set it in .env" }),
      )
    }
    const octokit = new Octokit({ auth: token })

    const baseBranch = (owner: string, repo: string): Effect.Effect<string, GithubError, never> =>
      wrap("default-branch", () => octokit.rest.repos.get({ owner, repo }).then((r) => r.data.default_branch))

    return {
      createBranch: (name) =>
        Effect.gen(function* () {
          const { owner, repo } = yield* repoRef(githubRepo)
          const base = yield* baseBranch(owner, repo)
          yield* wrap("branch", () =>
            octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${name}`, sha: base }),
          )
          yield* Effect.log(`github: branch '${name}' created on ${owner}/${repo} (from ${base})`)
          return name
        }).pipe(
          Effect.tapError((error) => Effect.log(`github: branch '${name}' failed — ${error.reason}`)),
        ),

      commit: (input) =>
        Effect.gen(function* () {
          const { owner, repo } = yield* repoRef(githubRepo)
          const blob = yield* wrap("blob", () =>
            octokit.rest.git.createBlob({ owner, repo, content: input.content }),
          )
          const baseRef = yield* wrap("head-ref", () =>
            octokit.rest.git.getRef({ owner, repo, ref: `heads/${input.branch}` }),
          )
          const baseSha = baseRef.data.object.sha
          const baseCommit = yield* wrap("base-commit", () =>
            octokit.rest.git.getCommit({ owner, repo, commit_sha: baseSha }),
          )
          const tree = yield* wrap("tree", () =>
            octokit.rest.git.createTree({
              owner,
              repo,
              base_tree: baseCommit.data.tree.sha,
              tree: [{ path: input.filePath, mode: "100644", type: "blob", sha: blob.data.sha }],
            }),
          )
          const commit = yield* wrap("commit", () =>
            octokit.rest.git.createCommit({
              owner,
              repo,
              message: input.message,
              tree: tree.data.sha,
              parents: [baseSha],
            }),
          )
          yield* wrap("update-ref", () =>
            octokit.rest.git.updateRef({ owner, repo, ref: `heads/${input.branch}`, sha: commit.data.sha }),
          )
          yield* Effect.log(
            `github: committed ${input.filePath} on ${input.branch} (${commit.data.sha.slice(0, 7)})`,
          )
        }).pipe(
          Effect.tapError((error) => Effect.log(`github: commit on '${input.branch}' failed — ${error.reason}`)),
        ),

      createPR: (input) =>
        Effect.gen(function* () {
          const { owner, repo } = yield* repoRef(githubRepo)
          const base = yield* baseBranch(owner, repo)
          const pr = yield* wrap("pr", () =>
            octokit.rest.pulls.create({
              owner,
              repo,
              head: input.branch,
              base,
              title: input.title,
              body: input.body,
              draft: true,
            }),
          )
          yield* Effect.log(`github: draft PR #${pr.data.number} → ${pr.data.html_url}`)
          return pr.data.html_url ?? `https://github.com/${owner}/${repo}/pull/${pr.data.number}`
        }).pipe(
          Effect.tapError((error) => Effect.log(`github: PR '${input.title}' failed — ${error.reason}`)),
        ),
    }
  }),
)

export { GithubServiceLive }