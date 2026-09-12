# Why DeepRank Is Not a Full Agent (and That's OK)

## What people hear when you say "SEO agent"

An always-on AI that autonomously monitors rankings, detects opportunities, writes changes, and pushes them live — 24/7, no human in the loop.

## What DeepRank actually is

A **scheduled task runner** that wakes up once a week, runs a deterministic pipeline with LLM calls at specific steps, opens a draft PR, and goes back to sleep. A human reviews and merges.

## Why it can't be a "proper agent"

### 1. No always-on runtime

DeepRank runs on a developer laptop or GitHub Actions. Neither is a persistent server. There's no process listening for events, no webhook receiver, no queue consumer. It's batch, not stream.

### 2. No autonomous decision-making

Every "decision" is a deterministic state machine transition with an LLM call at a fixed step. The machine doesn't decide *what* to do — the code does. The LLM only fills in *how* (write this metadata, judge this change). DeepRank is trigger-based, not autonomous: it wakes on a cron, runs a deterministic pipeline, and stops. It doesn't self-initiate, learn in real-time, or adapt its strategy mid-run.

### 3. Human required before merge

The PR is always a **draft**. DeepRank never merges. This is intentional — SEO metadata is customer-facing. A fabricated claim or scope violation in a `<title>` tag goes live to Google. The reviewer catches most issues, but a human must sign off.

### 4. LLM is meaning, not action

The Effect codebase enforces a hard boundary:

| Layer | Who does it | Why |
|---|---|---|
| Research (SERP, GSC, crawl) | Deterministic code | Facts — no interpretation needed |
| Scoring, filtering, ranking | Deterministic code | Math — no ambiguity |
| PLAN (diagnose the gap) | LLM | Needs to understand intent, content quality, competitive landscape |
| ACT (write metadata) | LLM | Needs language generation |
| REVISE (fix a failure) | LLM | Needs to understand what went wrong and fix minimally |
| REVIEWER (judge the change) | LLM | Needs to check for fabrication, scope violations, positioning |
| LEARNINGS (summarize patterns) | LLM | Needs to generalize across measured results |
| Build, validate, git, PR, DB | Deterministic code | Infrastructure — no judgment needed |

An "agent" implies the LLM decides what to do. DeepRank's LLM only decides *how* to do what the code already decided.

### 5. No continuous learning loop

The measure → learnings → next-optimize loop is **monthly**. The agent doesn't adapt in real-time. It reads last month's learnings as context in the next PLAN step. That's structured memory, not online learning.

### 6. Single-tenant, single-machine

No distributed locking, no multi-tenant isolation, no horizontal scaling. One repo, one database, one runner at a time (`concurrency: cancel-in-progress: false`).

## Why we still call it an agent

The word "agent" is doing two different jobs:

**The technical definition** (what most people mean): an autonomous entity that runs continuously, decides *what* to do, and acts without human supervision. By that definition, DeepRank is not an agent.

**The operational definition** (why the name still fits): DeepRank does the things an agent does, on a bounded schedule:

- **It has a goal** — improve rankings for tracked keywords, not a fixed command list.
- **It perceives** — crawls pages, reads SERP, pulls GSC metrics, reads past learnings.
- **It reasons** — the LLM diagnoses *why* a page underperforms (intent mismatch, thin content, weak CTR, poor coverage).
- **It acts** — writes optimized metadata and opens a draft PR.
- **It learns** — measure → learnings → feeds the next plan.
- **It decides autonomously** — within the scope the code allowed. The LLM decides *how*; the code decides *what's allowed*.

DeepRank is a **bounded, trigger-driven agent** — the same way a thermostat is "automatic" but not "autonomous."

**Why the name matters:**

- **Better product story.** "We built an SEO agent" communicates what the system does more accurately than "we built a cron job." The task is open-ended: *optimize rankings*, not *run these seven commands*.
- **The LLM is the differentiator.** A cron job doesn't reason about *why* a page underperforms or judge whether a claim is fabricated. That is what elevates it from script to agent.
- **It's an honest modifier, not a claim.** The constraint table below shows exactly where it stops being autonomous.

**The honest one-liner:** DeepRank is an agent in the bounded sense — it autonomously runs a goal-directed pipeline on a schedule, reasons with an LLM, and acts through PRs, but it never self-initiates beyond the schedule and never acts without human review. If the word bothers you, the honest alternative is "cron job with an LLM in the loop." Both are true.

## Constraints

| Constraint | Why | Implication |
|---|---|---|
| Needs PostgreSQL | Stores keywords, opportunities, changes, measurements, learnings | Can't run stateless — needs a cloud DB for CI |
| Needs LLM API (Groq) | PLAN/ACT/REVISE/REVIEW/LEARN | Costs money per run; stub mode exists for dev |
| Needs GitHub PAT | Creates branches, commits, draft PRs | Needs `contents: write` + `pull-requests: write` scopes |
| Needs SERP data (optional) | Real competitor analysis | SerpApi costs per query; mock fallback exists |
| Needs GSC data (optional) | Real ranking/impressions data | GSC access pending; stub fallback exists |
| Weekly cadence | SEO changes take weeks to reflect in rankings | No point running more often |
| Draft PR only | Human must review | Never auto-merges |

## Why GitHub Actions (not a server, not a Lambda, not a cron on a VM)

| Option | Why not |
|---|---|
| **Always-on server (EC2, Railway, etc.)** | Overkill for a weekly batch job. Costs money 24/7 for 5 minutes of work. Need to manage uptime, restarts, secrets. |
| **Lambda / Cloud Functions** | Cold starts, 15-min timeout, no `bun` runtime natively, harder to debug, stateless (DB connection pooling is painful). |
| **Cron on a dev laptop** | Laptop must be on. No redundancy. No audit trail. Secrets on local disk. |
| **GitHub Actions** | Free for public repos, 2000 min/mo for private. Native repo access (no clone needed). Built-in secrets management. Audit trail in Actions tab. Schedules via cron. `workflow_dispatch` for manual runs. The code lives in the same repo — workflow and agent are versioned together. |

GitHub Actions is the right tool because:

1. **The agent lives in the same repo as the website.** No deploy step. Push the workflow, it runs.
2. **Weekly cadence fits Actions perfectly.** No always-on cost. No cold-start penalty (the job takes ~2 min).
3. **Secrets are managed by GitHub.** No `.env` files on servers. No secret rotation infra.
4. **Audit trail is free.** Every run is logged, timestamped, and linked to the commit.
5. **Manual trigger is built-in.** `workflow_dispatch` lets you run optimize or measure on demand.
6. **The PR integration is native.** The workflow can create PRs because it runs in the same repo with the right permissions.

## What this means in practice

DeepRank is a **cron job with an LLM in the loop**, not an autonomous agent. It's the right design for SEO because:

- SEO changes take weeks to show results — daily runs are wasteful
- Metadata changes are low-risk but customer-facing — human review is non-negotiable
- The data sources (SERP, GSC) update slowly — weekly is frequent enough
- The cost model (Groq free tier) fits weekly batches, not continuous streams

If you need always-on, real-time SEO monitoring, you'd build something different: a webhook-driven service with a persistent database, event streaming, and real-time LLM inference. That's a product, not an agent.

DeepRank is an agent in the same way a scheduled backup script is an "agent" — it runs autonomously on a schedule, makes decisions within a bounded scope, and reports results. The LLM makes it smarter than a script, but the architecture is the same.