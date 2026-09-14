# Why DeepRank Is Not a Full Agent (and That's OK)

> **TL;DR** — DeepRank is a **bounded, trigger-driven agent**: a weekly cron job with an LLM in the loop. It is *not* a fully autonomous agent that runs 24/7, decides what to do on its own, and ships changes without human review. This document explains what the difference is, why DeepRank can't be fully autonomous, the pros and cons of both designs, and why our current problem fits this solution.

---

# 1. The words we're using

Before comparing designs, we need crisp definitions — the word "agent" gets used three different ways, and most confusion comes from mixing them up.

| Term | Definition | Example |
|---|---|---|
| **Script / cron job** | Deterministic, fixed sequence of steps, runs on a schedule, no LLM | `backup.sh` on a cron |
| **Bounded agent** | A script that uses an LLM at *fixed steps* to reason and generate content, but the code decides the overall flow | **DeepRank** (current) |
| **Fully autonomous agent** | A continuous runtime where the **LLM decides what to do next** by calling tools in a loop (think → act → observe), without a fixed pipeline | OpenAI Codex in agent mode, AutoGPT, ReAct agents |

The key distinction is **who decides what to do**:

- **Bounded agent:** the *code* decides *what* → the *LLM* decides *how*.
- **Full agent:** the *LLM* decides both *what* and *how*.

---

# 2. What people hear when you say "SEO agent"

Most people picture this:

> An always-on AI that autonomously monitors rankings, detects opportunities, writes changes, and pushes them live — 24/7, no human in the loop.

That is the **fully autonomous** version. It is what marketing means, what executives imagine, and what this document argues we do **not** need.

---

# 3. What DeepRank actually is

A **scheduled task runner** that:

1. Wakes up **once a week** (GitHub Actions cron, Monday 09:00 UTC).
2. Runs a **deterministic state machine** (`Machine.ts` → `Driver.ts`): RESEARCH → SCOPE → PLAN → ACT → VALIDATE ⇄ REVISE → REVIEWER ⇄ REVISE → CREATE_PR → FINISHED.
3. Calls the **LLM at 5 fixed steps** only where judgment is needed (PLAN, ACT, REVISE, REVIEW, LEARN).
4. Opens a **draft PR** for a human to review and merge.
5. Goes back to sleep.

```
cron (weekly) → RESEARCH → SCOPE → PLAN → ACT → VALIDATE → REVIEWER → CREATE_PR → sleep
                    │  SERP / GSC / crawl    │  LLM  │  code builds+validates  │  LLM  │ draft PR
```

A monthly **Measure** job closes the loop: detect merged PRs → pull GSC → compute before/after deltas → LLM writes learnings → next week's PLAN reads them.

---

# 4. Why DeepRank cannot be a fully autonomous agent

These are not philosophical objections — they are **structural reasons** the current code cannot do it, even if we wanted it to.

### 1. No always-on runtime

DeepRank runs on a developer laptop or GitHub Actions. Neither is a persistent server. There is no process listening for events, no webhook receiver, no queue consumer. **It is batch, not stream.** A fully autonomous agent requires a live process to perceive and act continuously.

### 2. No self-initiation

The agent only wakes on a cron trigger or a manual `workflow_dispatch`. It can never decide "I should go run now" on its own. Fully autonomous agents self-initiate when they detect a relevant condition.

### 3. The LLM never decides *what* to do

Every high-level decision is a deterministic state machine transition. The machine decides: *which keyword to target* (via the `opportunityScore` formula), *which page to change*, *when to retry* (max 3 retries). The LLM only fills in content — it writes metadata, fixes a failing change, and judges whether the change is acceptable. An "agent" in the strong sense implies the LLM picks its own strategy. DeepRank's LLM can't.

### 4. Human is required before anything ships

The PR is always a **draft**. DeepRank never merges, never deploys, never touches production directly. A fully autonomous agent acts end-to-end without a human gate.

### 5. No continuous / online learning

The measure → learnings → next-optimize loop is **monthly**, not real-time. The agent reads last month's learnings as static context in the next PLAN. That is **structured memory**, not online learning. A fully autonomous agent would update its behavior continuously from live signals.

### 6. Single-tenant, single-machine, single-thread

One repo, one database, one runner at a time (`concurrency: cancel-in-progress: false`). No distributed locking, no multi-tenant isolation, no horizontal scaling, no streaming. A fully autonomous system serving many tenants would need all of these.

### 7. No tool-calling loop

The tools (`serp`, `gsc`, `crawl`, `build`, `validate`, `github`) are called **by the Driver**, never by the LLM. There is a `ToolRegistry` (`registry.ts`) that models each tool's input/output as schemas, but nothing wires the LLM to call them. The LLM cannot "decide to go look something up" mid-run. (This is the seed for a future full-agent mode, but it is not active.)

---

# 5. The two designs compared

| Dimension | **Bounded agent (DeepRank)** | **Fully autonomous agent** |
|---|---|---|
| **Runtime** | Cron / GitHub Actions — wakes, runs, sleeps | Always-on server or long-lived loop |
| **Who decides what to do** | The code (state machine) | The LLM (tool-calling loop) |
| **Who decides how** | The LLM (content, judgment) | The LLM |
| **LLM calls per run** | Fixed — 5 (PLAN/ACT/REVISE/REVIEW/LEARN) | Variable — could be dozens in a loop |
| **Tool access** | Driver calls tools directly | LLM calls tools via registry |
| **Retry behavior** | Hard-coded: REVISE max 3 | LLM decides when to retry/replan |
| **Determinism** | High — reproducible, auditable | Low — model-dependent paths |
| **Cost per run** | Low, predictable | Higher, unpredictable |
| **Human gate** | Yes — draft PR, human merges | Could be none |
| **Adaptability** | Low — fixed pipeline | High — adapts to unexpected findings |
| **Safety** | High — LLM can't touch build/git/DB | Lower — LLM has tool access |
| **Debugging** | Easy — traceable state transitions | Hard — non-deterministic |

---

# 6. Pros and cons

## 6a. The bounded design (what we have)

**Pros**

- ✅ **Deterministic and auditable** — every run follows the same path; you can trace exactly why a keyword was chosen and what changed.
- ✅ **Cheap and predictable** — 5 LLM calls per run, not a chat loop. Fits Groq's free tier for a weekly batch.
- ✅ **Reliable** — the retry loop is code, not model reasoning. It cannot get "stuck" in a loop or call the wrong tool.
- ✅ **Safe by construction** — the LLM only produces metadata strings that code validates and clamps. It never touches git, build, or the DB.
- ✅ **Easy to test** — stub mode, `--dry-run`, and `bun run check` all give deterministic behavior.
- ✅ **Fits the human-review requirement** — draft PRs are natural; a person always signs off.
- ✅ **Simple to operate** — no servers to keep alive, no observability stack, just a workflow log.

**Cons**

- ❌ **Not adaptive** — if an unexpected finding appears (a new competitor, a layout change), the fixed pipeline can't change course mid-run.
- ❌ **Can't self-initiate** — it never runs unless the cron or a human triggers it.
- ❌ **Rigid strategy** — "pick highest score, write metadata" is the only strategy, forever, unless code changes.
- ❌ **No real-time learning** — feedback is monthly, not immediate.
- ❌ **Limited to what the machine knows** — the LLM can't go gather additional evidence beyond the fixed research step.

## 6b. The fully autonomous design (what we don't have)

**Pros**

- ✅ **Adaptive strategy** — the LLM can probe the SERP, observe the result, then decide the next step based on what it saw.
- ✅ **Multi-step reasoning** — could compare several pages, run multiple crawls, and synthesize a plan across them.
- ✅ **Better diagnoses** — it can gather evidence in whatever order it needs.
- ✅ **Handles edge cases** — unexpected findings don't break the pipeline; the agent adapts.
- ✅ **Extensible** — add a new tool and the LLM can use it without rewriting the state machine (the `registry.ts` foundation already exists).

**Cons**

- ❌ **Non-deterministic** — the same input can produce different runs; hard to audit or reproduce.
- ❌ **Costlier** — a reasoning loop can make 10–30+ LLM calls per run; token spend becomes unpredictable.
- ❌ **Riskier** — the LLM has tool access (git, build, DB). A hallucinated tool call or a stuck loop can do real damage.
- ❌ **Harder to test** — you can't unit-test "what will the model decide."
- ❌ **Needs a persistent runtime** — a loop doesn't fit a 2-minute cron job; you'd need a server.
- ❌ **Overkill for a fully-specified task** — if the task is already well-defined, adding free-form reasoning adds cost without adding capability.

---

# 7. Why bounded, and not fully autonomous

The decision is not "one is better." It is **"which design matches this task?"**

### The task is fully specified

DeepRank's job is: *pick the highest-value safe keyword → diagnose the gap → write better metadata → validate it builds → have it reviewed → open a draft PR.* Every step is known in advance. There is **no open-ended research phase** where an agent must "figure out what to do." The state machine *is* the correct plan. A full agentic loop would add cost and nondeterminism without adding capability.

### The changes are customer-facing

A hallucinated claim in a `<title>` tag goes live to Google and to users. The bounded design makes that *structurally impossible*: the LLM only produces strings, code validates and clamps them, and a human reviews the draft PR anyway. A full agent with tool access adds a reasoning loop on top of a decision you don't trust more.

### The cadence is slow

SEO changes take weeks to show up in rankings. GSC and SERP data update slowly. There is no reason to run continuously — a weekly batch is genuinely optimal. Full autonomy shines where events are fast and frequent (chat, code review loops, trading). SEO is none of those.

### The cost model fits batches

Groq's free tier and per-run pricing are sized for a handful of calls per week. A continuous, tool-calling agent would need serious budget and infrastructure.

### Determinism is a feature here

When a ranking improves, we want to reproduce exactly what we did. "The agent improvised a different path last time" is a bug, not a feature, for SEO metadata work.

---

# 8. Why our current problem fits this solution

Let's line up the actual problem against the bounded design's strengths:

| Our problem | Fits because |
|---|---|
| Low-risk but customer-facing metadata changes | Human review is non-negotiable → draft PR gate is natural → bounded design keeps LLM away from prod |
| Small, fixed set of tracked keywords | Deterministic scoring + filtering is enough — no need for the LLM to pick targets |
| Well-defined pipeline (research → diagnose → write → validate → review) | A state machine is the right model — the LLM only fills in content at fixed steps |
| Slow feedback loop (weeks for rankings) | Weekly cron matches reality — full autonomy would just waste tokens |
| Cost-sensitive, early-stage product | 5 LLM calls/week fits free tier — a tool-calling loop doesn't |
| Needs to be auditable and explainable | State transitions + logs give a clean trail — non-deterministic runs don't |
| Small team, no ops budget | GitHub Actions + Postgres is all we maintain — no servers to babysit |

**The honest summary:** our problem is *"a repetitive, fully-specified, low-risk-per-change, slow-feedback SEO task."* That is the exact profile a bounded agent is built for. Full autonomy pays for itself only when the task is *open-ended, fast, high-value-per-decision, and safe to let run* — which is a different product (future AI automation / autonomous operations), not the current Optimize/Measure loop.

---

# 9. Why we still call it an agent

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
- **It's an honest modifier, not a claim.** The comparison table in §5 shows exactly where it stops being autonomous.

**The honest one-liner:** DeepRank is an agent in the bounded sense — it autonomously runs a goal-directed pipeline on a schedule, reasons with an LLM, and acts through PRs, but it never self-initiates beyond the schedule and never acts without human review. If the word bothers you, the honest alternative is "cron job with an LLM in the loop." Both are true.

---

# 10. Constraints

| Constraint | Why | Implication |
|---|---|---|
| Needs PostgreSQL | Stores keywords, opportunities, changes, measurements, learnings | Can't run stateless — needs a cloud DB for CI |
| Needs LLM API (Groq) | PLAN/ACT/REVISE/REVIEW/LEARN | Costs money per run; stub mode exists for dev |
| Needs GitHub PAT | Creates branches, commits, draft PRs | Needs `contents: write` + `pull-requests: write` scopes |
| Needs SERP data (optional) | Real competitor analysis | SerpApi costs per query; mock fallback exists |
| Needs GSC data (optional) | Real ranking/impressions data | GSC access pending; stub fallback exists |
| Weekly cadence | SEO changes take weeks to reflect in rankings | No point running more often |
| Draft PR only | Human must review | Never auto-merges |

---

# 11. Why GitHub Actions (not a server, not a Lambda, not a cron on a VM)

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

---

# 12. What this means in practice

DeepRank is a **cron job with an LLM in the loop**, not an autonomous agent. It's the right design for SEO because:

- SEO changes take weeks to show results — daily runs are wasteful.
- Metadata changes are low-risk but customer-facing — human review is non-negotiable.
- The data sources (SERP, GSC) update slowly — weekly is frequent enough.
- The cost model (Groq free tier) fits weekly batches, not continuous streams.

If you need always-on, real-time SEO monitoring, you'd build something different: a webhook-driven service with a persistent database, event streaming, and real-time LLM inference. That's a product, not an agent.

---

# 13. The future door is open

Nothing in the bounded design blocks going fully autonomous later:

- `src/tools/registry.ts` already models all 6 tools as Effect `Schema` definitions (input/output) — the exact seed for an LLM tool-calling (ReAct) loop.
- The 5 LLM steps (PLAN/ACT/REVISE/REVIEW/LEARN) are the natural entry points to let the model drive.
- If a genuinely open-ended task arrives — *"research the whole competitive landscape and decide what to build"* — the right move would be a tool-calling agent, and the foundation is already there.

Until then: **bounded is better for this job, and the code is honest about being bounded.**

> **DeepRank is an agent in the same way a scheduled backup script is an "agent" — it runs autonomously on a schedule, makes decisions within a bounded scope, and reports results. The LLM makes it smarter than a script, but the architecture is the same.**