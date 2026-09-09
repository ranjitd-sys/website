# DeepRank — Execution Plan

> Day-wise sprint plan for building the DeepRank SEO agent.
> Companion to `deeprank-seo-agent.md` and `deeprank-budget.md`.
> Last updated: 2026-09-09

---

## Pre-Sprint: Gather credentials BEFORE Day 1

| Credential | Where |
|---|---|
| `SEO_DATABASE_URL` | Neon free-tier → create project → copy connection string |
| `OPENAI_API_KEY` | platform.openai.com → API keys |
| `GSC_CLIENT_EMAIL` + `GSC_PRIVATE_KEY` | Google Cloud Console → Service Account → enable Search Console API → JSON key |
| `GSC_SITE_URL` | `https://deepecom.com` |
| `GITHUB_TOKEN` | GitHub Settings → PAT with `contents` + `pull_requests` scope |

If GSC credentials aren't ready, stub with mock data and swap in real on Day 2.

---

## Day 1 — Foundation + Data Layer

**Goal:** scaffold, DB, and all research tools working against live APIs.

**Deliverables:**
- `seo-agent/` folder with `package.json`, `tsconfig.json`, `config.ts` (typed env), `cli.ts` (arg parser), `.env.example`
- `schema.sql` (5 tables as per spec), `client.ts` (pg pool + typed CRUD), `seed.ts` (5 keywords)
- `serp.ts` (live competitor results), `gsc.ts` (real position/clicks/impressions), `analytics.ts` (GA4 pageviews)
- `crawl.ts` (Playwright → title, h1, meta, JSON-LD, links)
- `registry.ts` (all tool schemas for OpenAI)

**End of Day 1:** every tool returns real data. No LLM yet. DB seeded with 5 keywords.

---

## Day 2 — Agent Brain + Full Optimize Loop

**Goal:** LLM driver interprets research, diagnoses gaps, writes edits, validates them.

**Deliverables:**
- `build.ts` (astro build + oxlint pass/fail), `validate.ts` (title ≤60, desc 120–160, JSON-LD)
- `prompts.ts` (system prompts: driver, reviewer, learnings)
- `driver.ts` (gpt-4.1 tool-calling loop bounded by `maxSteps=6`)
- `machine.ts` (IDLE → RESEARCH → SCOPE → PLAN → ACT → VALIDATE → REVIEWER → CREATE_PR → FINISHED)
- REVISE branch (≤3 retries, clean abort on exhaustion)

**End of Day 2:** full optimize loop runs in dry-run. Agent researches, scores, picks keyword, diagnoses gap, writes edit, validates.

---

## Day 3 — PR Creation + Reviewer Hardening + Measure Job

**Goal:** real PRs created, reviewer catches violations, monthly measurement loop works.

**Deliverables:**
- Reviewer hardened with 4 test cases (fabrication, scope, positioning, clean pass)
- `github.ts` (branch, commit, draft PR via Octokit)
- `measure.ts`: DETECT_MERGES → GSC_PULL → WRITE_DELTAS → LEARNINGS → FEED_RESEARCH
- `optimize.yml` + `measure.yml` GitHub Actions workflows

**End of Day 3:** `--optimize` creates a real draft PR. `--measure` detects merged PRs and writes deltas.

---

## Day 4 — First Live Run + Runbook + Hardening

**Goal:** full closed loop tested, first real PR merged, documentation complete.

**Deliverables:**
- E2E test: optimize → PR → merge → measure → learnings → next optimize reads learnings
- Seed keyword run: `ecommerce accounting software india` → `/resources/ecommerce-accounting`
- `runbook.md`: setup, credential rotation, manual triggers, troubleshooting, how to read reports
- Error handling: GSC rate limits, Playwright timeout, OpenAI retry, DB connection pool
- Structured JSON logging with timing

**End of Day 4:** agent produces one real PR, it's merged, baseline is stamped. Closed loop is live.

---
## Maybe Needed
## Day 5 — Monitoring + Tuning + Buffer

**Goal:** verify production behavior, tune parameters, handle edge cases.

**Deliverables:**
- Production monitoring: trigger optimize, watch logs, verify clean execution
- Reviewer prompt tuning if too strict/loose
- Add remaining 4 keywords to DB as real tracked keywords
- Measure dry-run if merged PR < 3 weeks old
- Documentation polish

**End of Day 5:** agent is production-ready. 5 keywords tracked. First PR merged. Closed loop verified.

---

## What Could Delay Us

| Risk | Mitigation |
|---|---|
| GSC credentials not ready | Stub with mock data, swap in real on Day 2 |
| OpenAI rate limits | 1 keyword/week is low volume, generous limits |
| Neon free-tier cold start | First DB query ~5s, acceptable for weekly runs |
| Playwright in CI | Pre-install in workflow, cache node_modules |
| Reviewer too strict | Tune prompts on Day 5 |

---

## Day-by-Day Summary

| Day | What's Done |
|---|---|
| 1 | All tools, DB, live data flowing |
| 2 | Full agent loop (dry-run) |
| 3 | Real PRs + measurement + workflows |
| 4 | E2E test, first live run, runbook |
| 5 | Monitoring, tuning, buffer |