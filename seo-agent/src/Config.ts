import { Config, Context, Data, Effect, Layer, Redacted } from "effect"

export interface SeoConfigShape {
  readonly databaseUrl: string
  readonly gscClientEmail: string
  readonly gscSiteUrl: string
  readonly gscPrivateKey: Redacted.Redacted
  readonly openaiApiKey: Redacted.Redacted
  readonly githubToken: Redacted.Redacted
}

export class SeoConfig extends Context.Service<SeoConfig, SeoConfigShape>()("SeoConfig") {}

interface MissingEntry {
  readonly key: string
  readonly message: string
}

export class ConfigLoadError extends Data.TaggedError("ConfigLoadError")<{
  readonly missing: ReadonlyArray<MissingEntry>
}> {}

const config = Config.all({
  databaseUrl: Config.nonEmptyString("SEO_DATABASE_URL"),
  gscClientEmail: Config.nonEmptyString("GSC_CLIENT_EMAIL"),
  gscSiteUrl: Config.nonEmptyString("GSC_SITE_URL"),
  gscPrivateKey: Config.redacted("GSC_PRIVATE_KEY"),
  openaiApiKey: Config.redacted("OPENAI_API_KEY"),
  githubToken: Config.redacted("GITHUB_TOKEN"),
})

const collectMissing = (cause: unknown): ReadonlyArray<MissingEntry> => {
  const found: Array<MissingEntry> = []
  const seen = new Set<string>()
  const walk = (value: unknown): void => {
    if (value === null || typeof value !== "object") return
    const node = value as Record<string, unknown>
    const path = Array.isArray(node["path"]) ? node["path"].map(String).join(".") : undefined
    if (path !== undefined && !seen.has(path)) {
      seen.add(path)
      found.push({ key: path, message: "missing or invalid in the environment" })
    }
    const issue = node["issue"]
    if (issue !== null && typeof issue === "object") walk(issue)
    for (const child of Object.values(node)) {
      if (child !== issue) walk(child)
    }
  }
  walk(cause)
  return found
}

const toLoadError = (err: Config.ConfigError): ConfigLoadError => {
  const missing = collectMissing(err.cause)
  return new ConfigLoadError({
    missing:
      missing.length > 0 ? missing : [{ key: "<unknown>", message: err.message }],
  })
}

export const SeoConfigLayer: Layer.Layer<SeoConfig, ConfigLoadError> = Layer.effect(
  SeoConfig,
  Effect.mapError(config, toLoadError),
)

export const formatConfigFailure = (error: ConfigLoadError): string => {
  const lines = error.missing.map((entry) => `  - ${entry.key}: ${entry.message}`).join("\n")
  return [
    "Configuration is incomplete — set the missing variables in seo-agent/.env:",
    lines,
  ].join("\n")
}