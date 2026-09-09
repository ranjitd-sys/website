# DeepRank — DeepEcom SEO Agent Plan

> A standalone AI agent that continuously improves DeepEcom's search rankings.
> Every tracked keyword should rank higher than it does today.
> Last updated: 2026-09-09

---

## Table of contents

1. [Mission](#1-mission)
2. [How it works (overview)](#2-how-it-works)
3. [The two jobs](#3-the-two-jobs)
4. [The scoring formula](#4-the-scoring-formula)
5. [The filters](#5-the-filters)
6. [Weekly Optimize run (step by step)](#6-weekly-optimize-run)
7. [Monthly Measure run (step by step)](#7-monthly-measure-run)
8. [Where the AI agent is needed](#8-where-the-ai-agent-is-needed)
9. [Service layout](#9-service-layout)
10. [Database schema](#10-database-schema)
11. [Content rules (non-negotiable)](#11-content-rules)
12. [Implementation phases](#12-implementation-phases)
13. [Credentials needed](#13-credentials-needed)
14. [Seed campaign](#14-seed-campaign)
15. [The closed loop](#15-the-closed-loop)
16. [Your role](#16-your-role)

---

## 1. Mission

> **Every tracked keyword should rank higher than it does today.**

One scoring formula. One gap diagnosis. One measurement system. No lanes, no cliffs, no caps. Continuous improvement from wherever the keyword ranks.

**Decisions locked in:**
- LLM: OpenAI (gpt-4.1 driver, gpt-4.1-mini reviewer)
- Service: standalone `seo-agent/` folder
- PRs: always human-approved, never auto-merged
- Data: free tier (websearch + GSC)
- Database: Postgres on Neon/Supabase free tier
- PRs against: this repo (deepecom/website_2)
- Cadence: weekly optimize + monthly measure

---

## 2. How it works

```
┌─────────────────────────────────────────────────────────┐
│                  GITHUB ACTIONS CRON                     │
│        weekly: OPTIMIZE    monthly: MEASURE              │
└────────────────────────┬────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    seo-agent SERVICE                     │
│                                                          │
│   xstate v5 MACHINE                                      │
│   IDLE → RESEARCH → SCOPE → PLAN → ACT →                │
│   VALIDATE → REVIEWER → CREATE_PR → FINISHED             │
│              ▲ fail                                      │
│              └─ REVISE (≤3 retries)                      │
│                                                          │
│   MEASURE RUN (separate path)                            │
│   DETECT_MERGES → GSC_PULL → WRITE_DELTAS →             │
│   LEARNINGS → FEED_RESEARCH                              │
└──┬─────────┬─────────┬─────────┬─────────┬──────────────┘
   │         │         │         │         │
┌──▼──┐  ┌──▼──┐  ┌───▼───┐  ┌─▼──┐  ┌───▼───┐
│GSC  │  │SERP │  │CONTENT│  │GIT │  │POSTGRES│
│API  │  │fetch│  │.ts    │  │PR  │  │memory │
└─────┘  └─────┘  └───────┘  └────┘  └───────┘
```

---

## 3. The two jobs

| Job | Cadence | What it does | Output |
|---|---|---|---|
| **Optimize** | weekly (Mon 06:00 UTC) | research → score → pick → diagnose → edit → validate → PR | one draft PR for you |
| **Measure** | monthly (1st, 06:00 UTC) | judge merged edits ≥3 weeks old → record delta → feed learnings | measurement report |

**The connective rule:** every weekly edit stamps a baseline at merge; the monthly job only judges edits whose `deployed_at` is >3 weeks old (stability window), then writes the delta that reshapes next week's decisions. That's the closed loop.

### Why weekly optimize?

One focused PR per week. Small, atomic, low-risk. You review in minutes. Steady compounding. React to market changes within 7 days.

### Why monthly measure?

Google needs 3-4 weeks to re-crawl, re-index, and settle a rank. Measuring weekly records noise. Measuring monthly records truth. The verdicts feed back into next week's choices — that's the learning loop.

---

## 4. The scoring formula

```
score = volume × opportunity × intent × momentum
```

Four numbers multiplied. All point the same direction: **bigger = better = more worth acting on this week.** The keyword with the highest score gets the week's one edit.

### Term 1 — `volume` (size of the prize)

How many people search this keyword each month. A fix on a 4,900-search keyword moves more traffic than the same fix on a 320-search keyword.

### Term 2 — `opportunity` (room to move)

How much room exists to improve. The worse your rank, the more room you have.

```
opportunity = position (higher = worse rank = more room)
```

| Position | opportunity | Meaning |
|---|---|---|
| 1 | 1 | almost no room |
| 5 | 5 | some room |
| 10 | 10 | real room |
| 15 | 15 | lots of room |
| 25 | 25 | massive room |

Volume and opportunity multiply: a #25 keyword with 100 searches (100 × 25 = 2,500) loses to a #7 keyword with 4,900 searches (4,900 × 7 = 34,300). **Big volume + bad rank = biggest opportunity. Small volume + bad rank = not worth the effort.**

### Term 3 — `intent` (is the prize money?)

Whether the searcher is likely to buy, or just reading.

| Intent | weight | Why |
|---|---|---|
| commercial ("gst software for amazon sellers") | 1.0 | searcher is evaluating/purchasing |
| transactional ("tally gst mapping example") | 0.9 | doing a task, features intent |
| informational ("what is TCS in ecommerce") | 0.5 | learning, lower direct value |

### Term 4 — `momentum` (is the keyword already moving?)

The direction of the keyword's rank trend over the last ~28 days, from GSC.

| Trend | momentum | Meaning |
|---|---|---|
| rising fast (19→16→13) | 1.6 | Google is already rewarding you — cheap to reinforce |
| rising slowly (17→16→16) | 1.3 | real progress, keep pushing |
| flat (15→15→15) | 1.0 | neutral |
| falling (13→15→17) | 0.6 | you're losing — don't fund a slide |

Momentum is the forward-looking signal. Position is a snapshot; momentum is the forecast.

### Worked examples

**Example A — the winner:**
```
"amazon seller gst software india"
volume 4,900 × opportunity 7 × intent 1.0 × momentum 1.6 = 54,880
→ highest score → survives filters → gets the week's edit
```

**Example B — big market but stuck:**
```
"ecommerce accounting software"
volume 8,200 × opportunity 4 × intent 1.0 × momentum 1.0 = 32,800
```

**Example C — high room but small market:**
```
"d2c brand accounting"
volume 320 × opportunity 15 × intent 0.9 × momentum 1.3 = 5,616
```

**Example D — falling keyword:**
```
"tally gst mapping"
volume 1,300 × opportunity 12 × intent 0.9 × momentum 0.6 = 8,424
```

**Example E — page 3 keyword:**
```
"gst reconciliation for meesho sellers"
volume 480 × opportunity 23 × intent 1.0 × momentum 1.0 = 11,040
```

No cap. No lanes. Every keyword scored equally. Top scorer surviving filters gets the week's edit.

---

## 5. The filters

The formula ranks; the filters veto. Run AFTER scoring.

1. **Already done/measured this cycle** → skip (no double-editing)
2. **Open PR on that page** → skip (no conflicting branches)
3. **Stable top-3, healthy CTR** → protect (don't risk a winner)
4. **Needs data you don't have** → skip (no fabrication)

**The weekly pick = highest-scoring survivor of the filters.**

---

## 6. Weekly Optimize run

The weekly run is the only run that changes your site. One run = one focused edit = one PR for you.

### Step 1 — IDLE

**What happens:**
- Load env: `OPENAI_API_KEY`, DB URL, budget values, `GITHUB_TOKEN`
- Load budgets: `maxSteps=6`, `maxRevise=3`, `maxOpportunities` (first run = 1)
- Load campaign keyword list from DB
- Check for open PRs — skip any page with a PR already in flight
- If nothing to do → finish empty

### Step 2 — RESEARCH (gather facts, then interpret)

**Phase A — code pulls raw facts:**

| Sub-step | Tool | What it fetches |
|---|---|---|
| 2a | `gsc_query` | every tracked keyword: queries, clicks, impressions, position, 28-day trend |
| 2b | `serp_search` | top 10 competitor results for each campaign keyword (raw strings) |
| 2c | `crawl_site` | for each target page: title, description, h1, JSON-LD, inbound links, 404s |
| 2d | store | upsert to `pages` + append to `keyword_positions` |

**Phase B — agent interprets:**

| Sub-step | Agent task | Output |
|---|---|---|
| 2e | Competitor interpretation | winning angle, competitor angles, signal vs noise |
| 2f | Keyword classification | intent, relevant (bool), target_url per query; reject false positives |

### Step 3 — SCOPE (score, filter, pick)

| Sub-step | What happens |
|---|---|
| 3a | Intent weight + relevance already attached in RESEARCH |
| 3b | Compute `score = volume × opportunity × intent × momentum` |
| 3c | Apply veto filters |
| 3d | Pick highest-scoring survivor → mark `optimizing` |

### Step 4 — PLAN (diagnose the gap)

The agent answers: **"WHY does this page rank where it does, and what will actually move it?"**

| Gap type | Evidence | Chosen action |
|---|---|---|
| Intent mismatch | competitors target buyer phrase, your page targets generic | rewrite intro + retitle |
| Technical | long title, missing meta, weak JSON-LD, orphan page | schema/length/internal-link fix |
| Performance/CTR | impressions high, clicks near zero | rewrite title/desc for clicks |
| Depth | page lacks subtopics competitors cover | add sections, FAQ, schema |
| Coverage | keyword has searches, no page fights it | create new content |

**Output:** concrete edit plan, e.g.:
```
retitle → "GST Software for Amazon Sellers in India — DeepEcom" (≤60 chars)
rewrite intro → opens with winning angle
add FAQ JSON-LD
add internal links from /resources/gst and /resources/reconciliation
validate_schema + run_build
```

### Step 5 — ACT (write and apply)

| Sub-step | What happens |
|---|---|
| 5a | `read_content` pulls the current `Post`/`Guide` object |
| 5b | Agent writes the new title, intro, meta, FAQ entries, related links |
| 5c | `edit_content` applies the change surgically (only allowed fields) |
| 5d | Emits context diff for reviewer + human |

### Step 6 — VALIDATE (hard gate)

| Sub-step | Check |
|---|---|
| 6a | `astro build` must pass |
| 6b | `oxlint` must pass |
| 6c | title ≤60 chars |
| 6d | description 120–160 chars |
| 6e | JSON-LD structure correct |

### Step 7 — REVISE (on failure)

| Sub-step | What happens |
|---|---|
| 7a | Agent reads the build/lint error |
| 7b | Interprets the cause |
| 7c | Decides minimal fix, re-edits |
| 7d | Re-runs VALIDATE (≤3 retries) |
| 7e | Exhausted → `opportunity=rejected`, abort cleanly |

### Step 8 — REVIEWER (independent safety gate)

A second, cheaper model (`gpt-4.1-mini`) reviews the finished diff against AGENTS.md:

| Check | Example catch |
|---|---|
| Fabrication | "500+ businesses trust DeepEcom" (never verified) |
| Scope | presenting Order Management (future) as launched |
| Positioning | implying DeepEcom replaces the ERP |
| Tone | hype/AI-startup copy on premium-finance page |
| Technical accuracy | wrong GST/TCS/TDS assertion |
| Title/desc lengths | arithmetic (code, not agent) |
| JSON-LD structure | field presence (code, not agent) |

**Pass → CREATE_PR. Fail → back to REVISE with violation list.**

### Step 9 — CREATE_PR (handoff to you)

| Sub-step | What happens |
|---|---|
| 9a | `git checkout -b seo/<slug>-<keyword>` |
| 9b | Stage only the changed file, commit |
| 9c | Open draft PR via Octokit with structured body |
| 9d | Stamp baseline position to `keyword_positions` |
| 9e | Mark `opportunity.status = approved-pending` |
| 9f | Write report, exit |

**YOU review → merge. Nothing auto-merges.**

---

## 7. Monthly Measure run

The monthly run doesn't touch your site. It judges what your weekly edits actually did.

### Step 1 — DETECT_MERGES

Find `changes` where `measurement IS NULL AND deployed_at < now() − 3 weeks`. These are merged PRs old enough for Google to have stabilized.

### Step 2 — GSC_PULL

For each eligible keyword, fetch fresh Search Console data: current position, clicks, impressions.

### Step 3 — WRITE_DELTAS

Compare current position to baseline (stamped at merge):

| Before | After | Verdict |
|---|---|---|
| 7 | 4 | won |
| 7 | 7 | stuck |
| 7 | 10 | falling |

Write `{before, after, delta}` to `changes.measurement`. Update `opportunity.status = measured`. Update `keyword.status = won | stuck | falling`.

### Step 4 — LEARNINGS

Agent reads the delta table and generalizes into reusable tactics:

```
"intro-intent rewrite for 'amazon seller gst' moved 7→4 → reuse pattern"
"FAQ schema alone didn't move 'flipkart reconciliation' → try internal links next"
```

### Step 5 — FEED_RESEARCH

Store learnings in DB. Inject into next weekly run's RESEARCH context. Next Monday's PLAN reads these before diagnosing gaps. **This closes the loop.**

---

## 8. Where the AI agent is needed

The agent (LLM) is needed at exactly the points where **input or output is language** — or where the decision requires *judgment about meaning*. Everything else is deterministic code.

| # | Where | What the agent does | Why code can't do it |
|---|---|---|---|
| 1 | RESEARCH | Interpret competitors: signal/noise, winning angle | reading prose, extracting meaning |
| 2 | RESEARCH | Classify queries: intent, relevance, target | semantic judgment on free-form phrases |
| 3 | PLAN | Diagnose WHY the page ranks where it does | weighing evidence, not thresholds |
| 4 | ACT | Write the actual content | irreducibly a language task |
| 5 | REVISE | Read build error, decide fix | interpreting error messages |
| 6 | REVIEWER | Fabrication/scope/positioning/tone/accuracy | semantic judgment on generated text |
| 7 | MEASURE | Generalize verdicts into reusable tactics | converting numbers into strategy |

**Everything else is code:** GSC/SERP/analytics fetch, score math, filters, DB writes, build/lint gates, PR creation, delta math, merge detection.

**Rule of thumb:** agent wherever the task is about *meaning*; code wherever it's about *numbers, flags, storage, git, or subprocess*.

---

## 9. Service layout

```
seo-agent/
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ src/
│  ├─ config.ts                       typed env + run flags + budgets
│  ├─ cli.ts                          entry: --optimize | --measure | --dry-run
│  ├─ prompts.ts                      system prompts (driver, reviewer, learnings)
│  ├─ agent/
│  │  ├─ machine.ts                   xstate v5 state machine
│  │  ├─ driver.ts                    OpenAI gpt-4.1 tool-calling agent
│  │  └─ reviewer.ts                  OpenAI gpt-4.1-mini safety/brand gate
│  ├─ tools/
│  │  ├─ registry.ts                  tool JSON schemas for OpenAI
│  │  ├─ serp.ts                      websearch fetch
│  │  ├─ gsc.ts                       Search Console API read
│  │  ├─ analytics.ts                 GA4 read
│  │  ├─ crawl.ts                     Playwright crawl of deepecom.com
│  │  ├─ content.ts                   parse/apply edits to src/data/resources/*.ts
│  │  ├─ validate.ts                  title/desc length + JSON-LD structure
│  │  ├─ build.ts                     astro build + oxlint
│  │  └─ github.ts                    branch + draft PR via Octokit
│  ├─ store/
│  │  ├─ schema.sql
│  │  └─ client.ts                    pg pool + typed queries
│  └─ measurement/
│     └─ measure.ts                  deltas + merged-PR detection + learning synthesis
├─ .github/workflows/
│  ├─ optimize.yml                   cron weekly
│  └─ measure.yml                    cron monthly
└─ runbook.md
```

---

## 10. Database schema

```
keywords(id, term, intent, volume, difficulty, target_url, status, created_at)
keyword_positions(id, keyword_id, sample_date, position, clicks, impressions, ctr)
pages(id, url, intent, h1, title, description, last_crawled_at, status)
opportunities(id, keyword_id, page_id, action, justification, score, status, created_at, decided_at)
changes(id, opportunity_id, branch, pr_url, diff_summary, deployed_at, measurement)
```

**Lifecycle of opportunities:** `proposed → approved → done → measured`

**The seam between weekly and monthly:** `changes.measurement` is written by the weekly run (empty), and completed by the monthly run (delta).

---

## 11. Content rules (non-negotiable)

These rules are enforced by the agent, the reviewer, and code:

- **Only edit** `title/description/body/related` of one entry; **never** `id/date/category/featured/readingTime/chapters`
- **Never invent** stats/customers/quotes/GMV — write literal `PLACEHOLDER` when unknown
- **Only verified product scope** (Platform + ERP Connector; no future features as launched)
- **Positioning:** "accounting layer for ecommerce", not "ERP replacement"
- **Tone:** premium, enterprise, no hype, no AI-startup language
- **Title ≤60 chars, description 120–160 chars**

---

## 12. Implementation phases

| Phase | Deliverable | Agent needed? | Verify |
|---|---|---|---|
| P1 | Scaffold `seo-agent/`, config, CLI | no | `--version` runs |
| P2 | Postgres schema + client + seed | no | insert/read round-trip |
| P3 | Research tools (serp/gsc/analytics/crawl/read) | no | live data in dry-run |
| P4 | Driver harness + prompts | yes | scripted tool call works |
| P5 | xstate loop + budgets | yes (wiring) | dry-run E2E, `git status` clean |
| P6 | edit_content + build gate + REVISE | yes | broken edit → recovers/rejects |
| P7 | Reviewer + deterministic gates | yes | fabricated stat rejected |
| P8 | create_pr (Octokit) | no | test branch + draft PR |
| P9 | Measure job + learning synthesis | yes (light) | simulated delta written |
| P10 | Two workflows + runbook | no | scheduled run → 1 real PR |

**Key principle:** P1–P3 are pure code, testable without any LLM. Agent code starts at P4.

---

## 13. Credentials needed

| Phase | Credential |
|---|---|
| P2 | `SEO_DATABASE_URL` (Neon/Supabase) |
| P3 | `GSC_CLIENT_EMAIL`, `GSC_PRIVATE_KEY`, `GSC_SITE_URL`, `GA_PROPERTY_ID` |
| P4 | `OPENAI_API_KEY` |
| P8 | `GITHUB_TOKEN` (contents + PR scope) |

---

## 14. Seed campaign (first live run = 1 keyword)

**First keyword:** `ecommerce accounting software india` → `/resources/ecommerce-accounting`

**Other keywords (dry-run only in first run):**
- `amazon seller gst accounting` → `/solutions/amazon-sellers`
- `flipkart payment reconciliation` → `/resources/reconciliation`
- `ecommerce accounting tally` → `/erp-connector/accounting`
- `d2c brand accounting` → `/solutions/d2c-brands`

---

## 15. The closed loop

```
Week 1:  optimize → PR → you merge → baseline stamped
Week 2:  (Google re-crawls, re-ranks)
Week 3:  (rank settling)
Month 1: measure → records before/after delta → feeds learnings
Week 5:  optimize reads learnings → picks smarter tactic → PR
Week 6:  (new cycle)
Month 2: measure → records new deltas → feeds new learnings
...repeat, each cycle smarter than the last...
```

**The essence:**
- **Weekly optimize** = act fast, one focused edit per week
- **Monthly measure** = judge accurately, after 3-4 week stability window
- **The loop** = each month's verdicts make next month's edits smarter

---

## 16. Your role

| When | What | Time |
|---|---|---|
| First run | provide seed keywords + credentials | 30 min |
| Weekly | review + merge PR (or comment) | 5–10 min |
| Monthly | read measurement report | 5 min |

---

## The one-liner

> **Score every keyword by volume × opportunity × intent × momentum. Pick the top one. Diagnose what's wrong. Fix it. Validate. Hand to human. Measure if it climbed. Feed learnings back. Repeat.**
