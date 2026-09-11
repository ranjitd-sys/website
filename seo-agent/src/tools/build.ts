import { spawn } from "node:child_process"
import path from "node:path"
import { Context, Data, Effect, Layer } from "effect"

export interface BuildErrorEntry {
  readonly file: string
  readonly message: string
}

export interface BuildResult {    
  readonly ok: boolean
  readonly errors: ReadonlyArray<BuildErrorEntry>
}

export interface BuildOptions {
  readonly cwd: string
}

export class BuildError extends Data.TaggedError("BuildError")<{
  readonly reason: string
}> {}

export interface BuildShape {
  readonly runBuild: (options: BuildOptions) => Effect.Effect<BuildResult, BuildError>
}

export class BuildService extends Context.Service<BuildService, BuildShape>()("Build") {}

const MAX_OUTPUT_BYTES = 200_000

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..", "..")
export { REPO_ROOT }

interface SpawnResult {
  readonly exitCode: number
  readonly stdout: string
  readonly stderr: string
}

const spawnAstroBuild = (cwd: string, signal: AbortSignal): Promise<SpawnResult> =>
  new Promise((resolve, reject) => {
    const bin = process.platform === "win32" ? "astro.cmd" : "astro"
    const astroPath = path.join(cwd, "node_modules", ".bin", bin)
    let stdout = ""
    let stderr = ""
    const child = spawn(astroPath, ["build"], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    })
    const append = (chunk: Buffer) => {
      const text = chunk.toString()
      if (stdout.length + stderr.length < MAX_OUTPUT_BYTES) {
        if (stderr.length < MAX_OUTPUT_BYTES) stderr += text
        else stdout += text
      }
    }
    child.stdout?.on("data", (chunk: Buffer) => append(chunk))
    child.stderr?.on("data", (chunk: Buffer) => append(chunk))
    child.on("error", (error) => {
      const e = error as NodeJS.ErrnoException
      reject(new BuildError({ reason: e.code === "ENOENT" ? "astro binary not found; run npm install" : e.message }))
    })
    child.on("close", (code) => resolve({ exitCode: code ?? 0, stdout, stderr }))
    signal.addEventListener("abort", () => child.kill("SIGKILL"))
  })

// Astro prints errors as an `error   <message>` header followed by an indented
// `File:` block. Fall back to any `path:line:col` occurrence when that shape differs.
const parseErrors = (stderr: string): ReadonlyArray<BuildErrorEntry> => {
  const entries: Array<BuildErrorEntry> = []
  const lines = stderr.split(/\r?\n/)
  let pendingMessage: string | null = null
  const fileRe = /^\s*(.+\.(?:astro|ts|tsx|md|mdx|js|jsx))(?::(\d+))?(?::(\d+))?\s*$/
  for (const line of lines) {
    const header = line.match(/^\s*(?:error|Error|Error:|error:)\s+(.*)$/)
    if (header) {
      pendingMessage = header[1]!.trim()
      continue
    }
    const file = line.match(fileRe)
    if (file && pendingMessage) {
      
      entries.push({ file: file[1] as string, message: pendingMessage })
      pendingMessage = null
    }
  }
  if (pendingMessage) entries.push({ file: "(unknown)", message: pendingMessage })
  return entries
}

export const BuildServiceLive: Layer.Layer<BuildService> = Layer.succeed(BuildService, {
  runBuild: (options) =>
    Effect.log(`build: astro build (cwd=${options.cwd})`).pipe(
      Effect.andThen(
        Effect.tryPromise({
          try: (signal) => spawnAstroBuild(options.cwd, signal),
          catch: (error) =>
            new BuildError({
              reason: error instanceof BuildError ? error.reason : error instanceof Error ? error.message : String(error),
            }),
        }),
      ),
      Effect.map(({ exitCode, stderr }) => ({
        ok: exitCode === 0,
        errors: exitCode === 0 ? [] : parseErrors(stderr),
      })),
      Effect.tap((r) => Effect.log(`build: ok=${r.ok} errors=${r.errors.length}`)),
    ),
})

export const REPO_ROOT_PROJECT: BuildOptions = { cwd: REPO_ROOT }