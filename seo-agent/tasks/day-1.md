# Today — P1 Scaffold + P2 Database (Effect-first)

> DeepRank work session. CTO decision: **build the agent on Effect** (`effect` + `@effect/platform-node`), not plain async/await.
> Spec: `docs/deeprank-seo-agent.md` · Execution plan: `docs/deeprank-execution-plan.md`
> Date: 2026-09-11

---

## Non-negotiable

- Every service is an Effect `Context.Tag` + `Layer`.
- Errors are **typed**. No try/catch anywhere.
- Validation uses **Effect `Schema`** — not Zod — inside `seo-agent/`.
- Database / HTTP / CLI all run through Effect (`Effect.runPromise`).
- State machine stays XState v5 (already in root deps), but each transition runs an Effect program.
- Verification happens after every task. No "I think it works".

---

## Task log (each completed item = checkbox + one line of what was verified)

- [x] **T1 — Package scaffold**
  - [x] `seo-agent/package.json` — `bun`, `type: module`, scripts: `dev`, `check`, `seed`, `optimize`, `measure`
  - [x] `seo-agent/tsconfig.json` — strict, NodeNext, extends Effect-friendly config
  - [x] `seo-agent/.env.example` — all credentials from the spec (§21)
  - [x] `seo-agent/` resolved as its own package (standalone `bun install`)
  - [x] **Verify:** `bun tsc --noEmit` passes in `seo-agent/`
  - [x] **Done:** scaffold boots (`deeprank-seo-agent: scaffold booted (T1)`), 51 pkgs installed. Note: dropped `@effect/sql-pg` beta (version skew with `effect@4.0.0-beta.100`) → using `pg` wrapped in Effect Layer for T3.

- [x] **T2 — Config service**
  - [x] `seo-agent/src/Config.ts` — Effect `Config` service loading `SEO_DATABASE_URL`, `GSC_CLIENT_EMAIL`, `GSC_PRIVATE_KEY`, `GSC_SITE_URL`, `OPENAI_API_KEY`, `GITHUB_TOKEN`
  - [x] Missing env → typed error with clear message (fails fast, no silent fallback)
  - [x] **Verify:** run with clean env → fails with the missing key named; run with `.env` → loads
  - [x] **Done:** `env -i` run exits 1 naming `SEO_DATABASE_URL`; `.env` run exits 0, secrets logged as `<redacted>`. Note: this effect beta dropped `Context.Tag` — class-style tags are now `Context.Service<Self, Shape>()("Name")`; error tree moved to SchemaError `issue`/`Pointer.path`.

- [x] **T3 — Database service + schema**
  - [x] `seo-agent/src/store/schema.sql` — 5 tables from spec §17: `keywords`, `keyword_positions`, `pages`, `opportunities`, `changes` (incl. `changes.measurement` JSONB — the weekly↔monthly link)
  - [x] `seo-agent/src/services/Database.ts` — `Context.Service` + `Layer.effect` wrapping a `pg` pool (through **Effect**), typed `query` helper
  - [x] `seo-agent/src/store/seed.ts` — Effect program seeding the 5 keywords from spec §22
  - [x] `seo-agent/src/store/migrate.ts` — applies `schema.sql` idempotently
  - [x] **Verify:** fresh DB → migrate → seed → read back 5 rows; re-run migrate → no duplicate/error
  - [x] **Done:** local `postgres:16-alpine` via docker (`localhost:54329`); migrate + seed idempotent; `\dt` shows all 5 tables; 5 keywords + 5 pages. Notes: `Layer.scoped` replaced by `Layer.effect` + `Effect.acquireRelease`; dropped `@effect/platform-node` (imports `effect/ByteSize`, missing from `effect@4.0.0-beta.100`) → files read via `node:fs/promises` in Effect; `volume`/`difficulty` stay NULL (no fabrication).

- [ ] **T4 — State machine skeleton**
  - [ ] `seo-agent/src/agent/Machine.ts` — XState v5: `IDLE → RESEARCH → SCOPE → PLAN → ACT → VALIDATE → REVIEWER → CREATE_PR → FINISHED` + `REVISE` (≤3 retries)
  - [ ] Each transition typed so it calls an Effect program (stubs for now)
  - [ ] `seo-agent/src/agent/Driver.ts` — Effect service that drives the machine; `effect.gen` pipeline, typed errors on abort
  - [ ] `seo-agent/src/agent/Reviewer.ts` — Effect service stub (returns `pass`)
  - [ ] **Verify:** `bun run src/index.ts optimize --dry-run` walks the machine end-to-end with stub data and exits clean

- [ ] **T5 — Tools registry**
  - [ ] `seo-agent/src/tools/registry.ts` — empty tool registry typed for future `serp`, `gsc`, `crawl`, `build`, `validate`, `github`
  - [ ] Each tool shape defined with Effect `Schema` (input/output contracts)
  - [ ] **Verify:** registry compiles; contract schemas decode a sample payload

---

## Deliverables (end of day)

- [x] `seo-agent/` package compiles standalone with `bun tsc --noEmit`
- [x] `Config` loads typed env or fails with named missing keys
- [x] DB migrated + seeded; read-back returns 5 keywords
- [x] Optimize machine walks to FINISHED in dry-run
- [x] Every service is `Context.Tag` + `Layer`; zero try/catch in new code

---

## Environment (for today)

| Variable | Needed for |
|---|---|
| `SEO_DATABASE_URL` | T3 |
| (borrow pattern from T2 for the rest; don't block on absent creds) | T1–T5 |

Missing credentials are **not** a blocker today — stubs + mock data keep everything green. Real API wiring is tomorrow (P3).

---

## Definition of done for today

The agent shell boots, migrates and seeds a real Postgres, and runs the optimize state machine to FINISHED on stub data — all inside Effect. That's P1 + P2 done.