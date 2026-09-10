# DeepRank — DeepEcom SEO Agent Plan

> A standalone AI agent that continuously improves DeepEcom's search rankings.

> Every tracked keyword should have a clear, measurable path toward a better ranking.

**Last updated:** 2026-09-10

---

# Table of Contents

1. Mission
2. Core Idea
3. How DeepRank Works
4. The Two Jobs
5. The SEO Opportunity & Scoring Formula
6. Understanding Every Formula Component
7. Worked Scoring Examples
8. Why the Formula Works
9. The Filters
10. Weekly Optimize Run
11. Monthly Measure Run
12. Where the AI Agent Is Needed
13. Service Layout
14. Database Schema
15. Content Rules
16. Implementation Phases
17. Credentials Needed
18. Seed Campaign
19. The Closed Loop
20. User's Role
21. Formula Summary

---

# 1. Mission

## Mission

> **Every tracked keyword should have an opportunity to improve, and DeepRank should continuously identify and act on the highest-value opportunities.**

DeepRank is a standalone SEO agent that:

1. Collects SEO data.
2. Calculates the potential value of every tracked keyword.
3. Identifies the keywords with the highest SEO opportunity.
4. Filters out opportunities that are unsafe or unsuitable.
5. Diagnoses why the page is underperforming.
6. Creates one focused content or technical improvement.
7. Validates the change.
8. Creates a human-reviewed pull request.
9. Measures the result after Google has had time to respond.
10. Feeds the result back into future decisions.

The goal is not to make random SEO changes.

The goal is to create a **measurable optimization loop**.

---

# 2. Core Idea

DeepRank separates SEO optimization into two questions.

## Question 1 — Where is the opportunity?

This is answered using the scoring formula.

## Question 2 — What should we do about it?

This is answered by the AI agent through research, diagnosis, and planning.

The system therefore works like:

```text
SEO DATA
   ↓
Calculate SEO Opportunity
   ↓
Rank Opportunities
   ↓
Apply Safety Filters
   ↓
Select Best Opportunity
   ↓
AI Diagnoses Problem
   ↓
AI Creates Edit Plan
   ↓
Apply Edit
   ↓
Validate
   ↓
Human Review
   ↓
Pull Request
   ↓
Measure Result
   ↓
Learn
   ↓
Next Optimization
```

The formula decides **what deserves attention**.

The AI decides **what needs to change**.

---

# 3. How DeepRank Works

```text
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS CRON                      │
│                                                             │
│             Weekly: OPTIMIZE                               │
│             Monthly: MEASURE                               │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                       SEO AGENT                             │
│                                                             │
│  OPTIMIZE                                                  │
│  IDLE → RESEARCH → SCOPE → PLAN → ACT → VALIDATE →        │
│  REVIEWER → CREATE_PR → FINISHED                           │
│                         ↑                                   │
│                       REVISE                                │
│                       ≤3 retries                            │
│                                                             │
│  MEASURE                                                   │
│  DETECT_MERGES → GSC_PULL → WRITE_DELTAS →                 │
│  LEARNINGS → FEED_RESEARCH                                 │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────┘
       │          │          │          │          │
       ↓          ↓          ↓          ↓          ↓
     GSC         SERP      CONTENT     GIT      POSTGRES
     API         Data       Files       PR        Memory
```

DeepRank uses deterministic code for:

* Data collection
* Scoring
* Filtering
* Database operations
* Validation
* Git operations
* Build/lint checks
* Measurement calculations

The AI is used where interpretation or language generation is required.

---

# 4. The Two Jobs

DeepRank has two recurring jobs.

| Job      | Cadence | Purpose                                        | Output                 |
| -------- | ------- | ---------------------------------------------- | ---------------------- |
| Optimize | Weekly  | Find and improve the highest-value opportunity | One draft PR           |
| Measure  | Monthly | Determine whether previous changes worked      | Measurement + learning |

## Weekly Optimize

The weekly job:

```text
Research
→ Score
→ Filter
→ Select
→ Diagnose
→ Edit
→ Validate
→ Review
→ PR
```

Only one focused opportunity is edited per weekly run.

This keeps changes:

* Small
* Atomic
* Reviewable
* Low risk
* Easy to measure

---

## Monthly Measure

The monthly job does not change the website.

It evaluates previous changes after enough time has passed for Google to crawl, index, and re-rank the affected page.

The system waits approximately 3–4 weeks before judging the result.

This avoids treating short-term ranking fluctuations as meaningful results.

---

# 5. The SEO Opportunity & Scoring Formula

## The Core Formula

DeepRank uses four signals:

$$
\boxed{
Score =
Volume
\times
Position
\times
Intent
\times
Momentum
}
$$

However, it is clearer to understand the formula as two layers.

### Layer 1 — SEO Opportunity

$$
\boxed{
SEO\ Opportunity =
Search\ Demand
\times
Room\ to\ Improve
}
$$

In the current implementation:

$$
\boxed{
SEO\ Opportunity =
Volume
\times
Position
}
$$

### Layer 2 — Priority Score

Then business value and ranking momentum modify that opportunity:

$$
\boxed{
Priority\ Score =
SEO\ Opportunity
\times
Intent
\times
Momentum
}
$$

Combining the two:

$$
\boxed{
Priority\ Score =
Volume
\times
Position
\times
Intent
\times
Momentum
}
$$

---

# 6. Understanding Every Formula Component

## 6.1 Volume — Size of the Search Demand

### What is Volume?

Volume represents approximately how many times people search for the keyword each month.

For example:

```text
Keyword:
amazon seller gst software india

Monthly volume:
4,900
```

Volume answers:

> **How large is the potential audience?**

A keyword searched 4,900 times per month has a larger potential audience than a keyword searched 100 times per month.

Therefore:

```text
Higher Volume
      ↓
Larger Search Demand
      ↓
Larger Potential Traffic
      ↓
Larger Potential SEO Opportunity
```

Volume is therefore one part of the opportunity.

---

# 6.2 Position — Room to Improve

Position represents the current Google ranking.

For example:

```text
Position 1 → #1
Position 5 → #5
Position 10 → #10
Position 20 → #20
Position 50 → #50
```

In this model, the position number is used as the **room-to-improve multiplier**.

Therefore:

```text
#1  → 1
#5  → 5
#10 → 10
#20 → 20
```

The underlying idea is:

> The further away the page is from the top of Google, the more room there is to improve.

Therefore:

$$
Room\ to\ Improve \approx Position
$$

---

# 6.3 Why Volume and Position Work Together

This is the most important part of the formula.

Looking only at position can be misleading.

Consider:

### Keyword A

```text
Volume = 10,000
Position = 5
```

### Keyword B

```text
Volume = 100
Position = 25
```

Keyword B has more room to improve based purely on position.

But Keyword A has vastly more search demand.

Therefore, SEO opportunity should consider both:

```text
How many people want this?
+
How much room do we have to improve?
```

This gives:

$$
SEO\ Opportunity =
Volume \times Position
$$

For Keyword A:

$$
10,000 \times 5 = 50,000
$$

For Keyword B:

$$
100 \times 25 = 2,500
$$

Keyword A has the larger opportunity because the market is much larger.

### Important interpretation

**Volume tells us the size of the prize.**

**Position tells us how much room exists to capture that prize.**

Together they describe the SEO opportunity.

---

# 6.4 Intent — How Valuable Is the Traffic?

Not every search is equally valuable to DeepEcom.

Someone searching:

> "what is TCS in ecommerce"

may simply be learning.

Someone searching:

> "gst software for amazon sellers"

may be actively evaluating software.

Therefore DeepRank assigns an intent multiplier.

| Intent        | Weight | Meaning                                    |
| ------------- | -----: | ------------------------------------------ |
| Commercial    |    1.0 | Evaluating or purchasing                   |
| Transactional |    0.9 | Trying to complete a task or use a feature |
| Informational |    0.5 | Primarily learning                         |

The formula becomes:

$$
SEO\ Opportunity \times Intent
$$

For example:

```text
SEO Opportunity = 50,000
Intent = 1.0
```

Then:

$$
50,000 \times 1.0 = 50,000
$$

But with informational intent:

$$
50,000 \times 0.5 = 25,000
$$

The system therefore gives greater priority to traffic that is more commercially valuable.

---

# 6.5 Momentum — Is Google Already Moving the Keyword?

Position is a snapshot.

Momentum is the direction.

For example:

```text
Keyword A:
19 → 16 → 13
```

The keyword is moving upward.

Another keyword:

```text
Keyword B:
13 → 15 → 17
```

is moving downward.

DeepRank therefore uses momentum as a multiplier.

| Trend         | Momentum |
| ------------- | -------: |
| Rising fast   |      1.6 |
| Rising slowly |      1.3 |
| Flat          |      1.0 |
| Falling       |      0.6 |

Momentum answers:

> **Is Google already showing positive movement for this keyword?**

---

# 6.6 Why Momentum Matters

Imagine two keywords with exactly the same:

```text
Volume
Position
Intent
```

But:

```text
Keyword A → rising
Keyword B → falling
```

Keyword A may be a better candidate for optimization because Google is already showing positive movement.

The existing page may have:

* Good topical relevance
* Growing authority
* Increasing relevance
* Improving content quality
* Growing backlinks
* Better search intent alignment

The exact cause is not assumed.

Instead, momentum is used as a signal that the keyword may be responsive to further optimization.

---

# 7. The Complete Formula

Now combine everything.

$$
\boxed{
Priority\ Score =
Volume
\times
Position
\times
Intent
\times
Momentum
}
$$

Each component answers a different question.

| Component | Question                             |
| --------- | ------------------------------------ |
| Volume    | How large is the search demand?      |
| Position  | How much room do we have to improve? |
| Intent    | How valuable is the search?          |
| Momentum  | Is the keyword already moving?       |

So the complete interpretation is:

> **Find keywords with meaningful search demand, substantial room for improvement, valuable search intent, and positive ranking momentum.**

---

# 8. Worked Scoring Examples

## Example A — High-value opportunity

Keyword:

```text
amazon seller gst software india
```

Data:

```text
Volume     = 4,900
Position   = 7
Intent     = 1.0
Momentum   = 1.6
```

First calculate SEO Opportunity:

$$
4,900 \times 7 = 34,300
$$

Then apply intent:

$$
34,300 \times 1.0 = 34,300
$$

Then apply momentum:

$$
34,300 \times 1.6
=
54,880
$$

Therefore:

$$
\boxed{Score = 54,880}
$$

---

# Example B — High volume but limited room

Keyword:

```text
ecommerce accounting software
```

Data:

```text
Volume     = 8,200
Position   = 4
Intent     = 1.0
Momentum   = 1.0
```

SEO Opportunity:

$$
8,200 \times 4
=
32,800
$$

Intent:

$$
32,800 \times 1.0
=
32,800
$$

Momentum:

$$
32,800 \times 1.0
=
32,800
$$

Therefore:

$$
\boxed{Score = 32,800}
$$

Despite having more searches than Example A, this keyword scores lower because it is already ranking very close to the top.

---

# Example C — Large room but small search demand

Keyword:

```text
d2c brand accounting
```

Data:

```text
Volume     = 320
Position   = 15
Intent     = 0.9
Momentum   = 1.3
```

SEO Opportunity:

$$
320 \times 15
=
4,800
$$

Intent:

$$
4,800 \times 0.9
=
4,320
$$

Momentum:

$$
4,320 \times 1.3
=
5,616
$$

Therefore:

$$
\boxed{Score = 5,616}
$$

The keyword has significant room to improve, but the search market is relatively small.

---

# Example D — Falling keyword

Keyword:

```text
tally gst mapping
```

Data:

```text
Volume     = 1,300
Position   = 12
Intent     = 0.9
Momentum   = 0.6
```

SEO Opportunity:

$$
1,300 \times 12
=
15,600
$$

Intent:

$$
15,600 \times 0.9
=
14,040
$$

Momentum:

$$
14,040 \times 0.6
=
8,424
$$

Therefore:

$$
\boxed{Score = 8,424}
$$

The keyword has reasonable demand and room to improve, but the falling momentum significantly reduces its priority.

---

# Example E — Page 3 keyword

Keyword:

```text
gst reconciliation for meesho sellers
```

Data:

```text
Volume     = 480
Position   = 23
Intent     = 1.0
Momentum   = 1.0
```

SEO Opportunity:

$$
480 \times 23
=
11,040
$$

Intent:

$$
11,040 \times 1.0
=
11,040
$$

Momentum:

$$
11,040 \times 1.0
=
11,040
$$

Therefore:

$$
\boxed{Score = 11,040}
$$

---

# 9. What the Formula Does NOT Mean

The score is **not** Google's ranking formula.

Google does not rank pages using:

$$
Volume \times Position \times Intent \times Momentum
$$

This formula belongs to **DeepRank**.

Its purpose is different.

Google's algorithm decides:

> "Which page should rank for this search?"

DeepRank's formula decides:

> "Which keyword should our SEO agent work on this week?"

This distinction is critical.

---

# 10. The Formula Is a Prioritization System

The formula does not guarantee:

```text
High score = ranking improvement
```

Instead:

```text
High score
    ↓
Large potential opportunity
    ↓
Worth investigating
```

The AI then investigates why the keyword is performing the way it is.

Possible causes include:

* Intent mismatch
* Weak title
* Weak description
* Missing content
* Missing subtopics
* Weak internal linking
* Technical SEO issues
* Missing structured data
* Poor CTR
* Lack of topical coverage
* No appropriate page targeting the keyword

Therefore:

$$
Score \neq Guaranteed\ Ranking\ Gain
$$

Instead:

$$
Score = Priority\ for\ Investigation
$$

---

# 11. The Filters

The formula ranks all keywords.

The filters then decide which opportunities are actually allowed to proceed.

```text
All Keywords
      ↓
Calculate Score
      ↓
Sort by Score
      ↓
Apply Filters
      ↓
Highest-scoring survivor
      ↓
Weekly Opportunity
```

## Filter 1 — Already completed

If a keyword was already optimized or measured in the current cycle:

```text
SKIP
```

This prevents repeated edits.

---

## Filter 2 — Existing Open PR

If the page already has an SEO pull request:

```text
SKIP
```

This prevents conflicting changes.

---

## Filter 3 — Stable Top-3

If the keyword already ranks in the top 3 and has healthy CTR:

```text
PROTECT
```

The system should avoid unnecessary changes to an already successful result.

---

## Filter 4 — Missing Data

If the agent doesn't have sufficient evidence:

```text
SKIP
```

The system must never invent information to fill missing data.

---

# 12. Weekly Optimize Run

The weekly run is the only process that changes website content.

One run produces:

```text
One opportunity
        ↓
One focused edit
        ↓
One PR
```

---

# Step 1 — IDLE

Load:

```text
OPENAI_API_KEY
SEO_DATABASE_URL
GITHUB_TOKEN
```

Load configuration:

```text
maxSteps = 6
maxRevise = 3
maxOpportunities = 1
```

Then:

1. Load tracked keywords.
2. Check open PRs.
3. Exclude conflicting pages.
4. Determine whether there is anything worth optimizing.

If there is nothing suitable:

```text
FINISHED
```

---

# Step 2 — RESEARCH

Research has two phases.

## Phase A — Code collects facts

### Google Search Console

Collect:

* Query
* Clicks
* Impressions
* Position
* CTR
* 28-day trend

### SERP

Collect:

* Top 10 results
* Competitor URLs
* Competitor titles
* Competitor snippets
* Relevant ranking pages

### Site Crawl

Collect:

* Title
* Description
* H1
* JSON-LD
* Internal links
* Broken links
* 404s

Store the information in PostgreSQL.

---

## Phase B — AI interprets the facts

The AI determines:

### Competitor interpretation

* What angle competitors use
* What topics appear repeatedly
* Which signals appear important
* Which observations are probably noise

### Keyword classification

The AI determines:

* Search intent
* Relevance
* Target URL
* False-positive queries

The AI should not invent data.

It interprets the data collected by code.

---

# Step 3 — SCOPE

Now the scoring system runs.

For every eligible keyword:

$$
Score =
Volume
\times
Position
\times
Intent
\times
Momentum
$$

Then:

```text
1. Calculate score
2. Sort keywords
3. Apply filters
4. Select highest-scoring survivor
```

The selected opportunity becomes:

```text
status = optimizing
```

---

# Step 4 — PLAN

Now the AI answers the most important question:

> **Why is this page ranking where it is, and what change is most likely to improve it?**

The AI compares:

```text
Your page
     +
GSC data
     +
SERP competitors
     +
Site structure
     +
Historical learnings
```

Possible diagnoses:

| Gap             | Evidence                         | Action                    |
| --------------- | -------------------------------- | ------------------------- |
| Intent mismatch | Competitors target buyer intent  | Rewrite intro/title       |
| Technical       | Missing metadata/schema          | Technical fix             |
| CTR             | High impressions, low clicks     | Rewrite title/description |
| Depth           | Competitors cover more subtopics | Add relevant sections     |
| Coverage        | No suitable page exists          | Create content            |

---

# Example Plan

```text
Retitle:
"GST Software for Amazon Sellers in India — DeepEcom"

Rewrite introduction:
Open with the dominant search intent.

Add:
Relevant FAQ structured data.

Add:
Internal links from relevant DeepEcom resources.

Validate:
Schema + build + lint.
```

The plan must be:

* Specific
* Evidence-based
* Minimal
* Relevant to the selected keyword

---

# Step 5 — ACT

The agent reads the current content.

It is allowed to modify only approved fields:

```text
title
description
body
related
```

The agent then writes the changes.

The system records a diff so that:

```text
Agent
  ↓
Generated Change
  ↓
Reviewer
  ↓
Human
```

can all understand what changed.

---

# Step 6 — VALIDATE

Every generated change must pass deterministic checks.

## Build

```text
astro build
```

must pass.

## Lint

```text
oxlint
```

must pass.

## Metadata

Title:

```text
≤ 60 characters
```

Description:

```text
120–160 characters
```

## Structured Data

JSON-LD structure must be valid.

The important principle is:

> **Use code for things that can be objectively checked.**

Do not ask the LLM to count characters or determine whether JSON has the correct structure when code can do it reliably.

---

# Step 7 — REVISE

If validation fails:

```text
VALIDATE
   ↓
FAIL
   ↓
READ ERROR
   ↓
UNDERSTAND CAUSE
   ↓
MINIMAL FIX
   ↓
VALIDATE AGAIN
```

Maximum:

```text
3 retries
```

If all retries fail:

```text
opportunity = rejected
```

The system exits cleanly.

---

# Step 8 — REVIEWER

A second model reviews the final change.

Current plan:

```text
Driver:
GPT-4.1

Reviewer:
GPT-4.1-mini
```

The reviewer checks:

### Fabrication

Example:

```text
"500+ businesses trust DeepEcom"
```

If the statement isn't verified:

```text
REJECT
```

### Product Scope

Do not present future features as launched.

### Positioning

DeepEcom should be described as:

> Accounting layer for ecommerce

not:

> ERP replacement

### Tone

Avoid:

* Hype
* Exaggeration
* AI-startup language

### Technical Accuracy

Check claims involving:

* GST
* TCS
* TDS
* Accounting
* Ecommerce workflows

### Metadata

Code handles exact character counting.

### JSON-LD

Code handles structural validation.

---

# Step 9 — CREATE PR

If everything passes:

```text
Create branch
      ↓
Stage changed file
      ↓
Commit
      ↓
Create draft PR
      ↓
Stamp baseline
      ↓
Record opportunity
```

Example branch:

```text
seo/<slug>-<keyword>
```

The PR remains human-controlled.

```text
AI → creates PR
Human → reviews
Human → merges
```

There is no automatic merge.

---

# 13. Monthly Measure Run

The monthly run answers:

> **Did the optimization actually work?**

It does not modify the website.

---

# Step 1 — Detect Merged Changes

Find changes that:

```text
measurement IS NULL
```

and:

```text
deployed_at < now() - 3 weeks
```

This creates a stability window.

---

# Step 2 — Pull Fresh GSC Data

For each eligible keyword:

Collect:

```text
Current position
Clicks
Impressions
CTR
```

---

# Step 3 — Calculate Delta

Suppose the baseline at merge was:

```text
Position = 7
```

After several weeks:

```text
Position = 4
```

Then:

$$
Delta = After - Before
$$

$$
Delta = 4 - 7 = -3
$$

Because lower Google position numbers are better:

```text
7 → 4 = improvement
```

The system records:

```text
before = 7
after = 4
delta = -3
verdict = won
```

---

# Verdicts

| Before | After | Verdict |
| -----: | ----: | ------- |
|      7 |     4 | Won     |
|      7 |     7 | Stuck   |
|      7 |    10 | Falling |

---

# Step 4 — LEARNINGS

The AI looks across historical changes.

For example:

```text
Intro-intent rewrite:
7 → 4

Potential learning:
This type of intent rewrite may be effective
for similar commercial keywords.
```

Another example:

```text
FAQ schema:
7 → 7

Potential learning:
FAQ schema alone did not produce measurable movement.
Try another intervention.
```

These are not guarantees.

They are historical patterns.

---

# Step 5 — FEED RESEARCH

The learnings are stored in the database.

The next weekly run receives them as research context.

Therefore:

```text
Optimization
      ↓
Measurement
      ↓
Learning
      ↓
Future Optimization
```

This creates the closed loop.

---

# 14. Where AI Is Needed

The AI is used where the problem involves:

* Meaning
* Interpretation
* Judgment
* Language generation

| Area     | AI Task                                |
| -------- | -------------------------------------- |
| Research | Interpret competitor positioning       |
| Research | Classify search intent                 |
| Research | Determine relevance                    |
| Plan     | Diagnose ranking problem               |
| Act      | Write content                          |
| Revise   | Understand build errors                |
| Reviewer | Detect fabrication/scope/tone problems |
| Measure  | Generalize historical results          |

Everything else should remain deterministic code.

---

# 15. Where AI Is NOT Needed

Do not use an LLM for:

```text
GSC API calls
SERP fetching
Database writes
Score calculation
Filtering
Character counting
JSON validation
Build execution
Lint execution
Git operations
PR creation
Delta calculation
Merge detection
```

These are deterministic tasks.

The core architecture principle is:

> **AI for meaning. Code for facts, numbers, rules, storage, and execution.**

---

# 16. Service Layout

```text
seo-agent/
├─ package.json
├─ tsconfig.json
├─ .env.example
│
├─ src/
│  ├─ config.ts
│  ├─ cli.ts
│  │
│  ├─ agent/
│  │  ├─ machine.ts
│  │  ├─ driver.ts
│  │  └─ reviewer.ts
│  │
│  ├─ tools/
│  │  ├─ registry.ts
│  │  ├─ serp.ts
│  │  ├─ gsc.ts
│  │  ├─ analytics.ts
│  │  ├─ crawl.ts
│  │  ├─ content.ts
│  │  ├─ validate.ts
│  │  ├─ build.ts
│  │  └─ github.ts
│  │
│  ├─ store/
│  │  ├─ schema.sql
│  │  └─ client.ts
│  │
│  └─ measurement/
│     └─ measure.ts
│
├─ .github/
│  └─ workflows/
│     ├─ optimize.yml
│     └─ measure.yml
│
└─ runbook.md
```

---

# 17. Database Schema

```text
keywords(
  id,
  term,
  intent,
  volume,
  difficulty,
  target_url,
  status,
  created_at
)

keyword_positions(
  id,
  keyword_id,
  sample_date,
  position,
  clicks,
  impressions,
  ctr
)

pages(
  id,
  url,
  intent,
  h1,
  title,
  description,
  last_crawled_at,
  status
)

opportunities(
  id,
  keyword_id,
  page_id,
  action,
  justification,
  score,
  status,
  created_at,
  decided_at
)

changes(
  id,
  opportunity_id,
  branch,
  pr_url,
  diff_summary,
  deployed_at,
  measurement
)
```

---

# 18. Opportunity Lifecycle

```text
proposed
    ↓
approved
    ↓
done
    ↓
measured
```

The key connection between the weekly and monthly jobs is:

```text
changes.measurement
```

The weekly process creates the baseline.

The monthly process fills in the actual result.

---

# 19. Content Rules

These rules are non-negotiable.

## Allowed fields

Only modify:

```text
title
description
body
related
```

Do not modify:

```text
id
date
category
featured
readingTime
chapters
```

---

## No Fabrication

Never invent:

* Customer numbers
* Revenue
* GMV
* Quotes
* Statistics
* Product capabilities
* Customer claims

If information is unknown:

```text
PLACEHOLDER
```

---

## Product Scope

Only describe verified product capabilities.

Current positioning:

```text
DeepEcom = accounting layer for ecommerce
```

Do not describe DeepEcom as an ERP replacement.

---

## Tone

Content should be:

```text
Premium
Enterprise
Clear
Specific
Evidence-based
```

Avoid:

```text
Hype
Exaggeration
Generic AI language
Unverified claims
```

---

# 20. Implementation Phases

| Phase | Deliverable          | AI Needed? | Verification         |
| ----- | -------------------- | ---------- | -------------------- |
| P1    | Agent scaffold       | No         | CLI works            |
| P2    | PostgreSQL           | No         | Insert/read          |
| P3    | Research tools       | No         | Live data            |
| P4    | Driver + prompts     | Yes        | Tool calling         |
| P5    | XState loop          | Yes        | E2E dry run          |
| P6    | Editing + validation | Yes        | Recovery             |
| P7    | Reviewer             | Yes        | Fabrication rejected |
| P8    | PR creation          | No         | Test PR              |
| P9    | Measurement          | Light      | Delta recorded       |
| P10   | GitHub workflows     | No         | Scheduled execution  |

The first three phases should remain pure code.

The LLM becomes necessary from the driver stage onward.

---

# 21. Credentials Needed

| Phase | Credential       |
| ----- | ---------------- |
| P2    | SEO_DATABASE_URL |
| P3    | GSC_CLIENT_EMAIL |
| P3    | GSC_PRIVATE_KEY  |
| P3    | GSC_SITE_URL     |
| P3    | GA_PROPERTY_ID   |
| P4    | OPENAI_API_KEY   |
| P8    | GITHUB_TOKEN     |

---

# 22. Seed Campaign

First live keyword:

```text
ecommerce accounting software india
```

Target:

```text
/resources/ecommerce-accounting
```

Other initial dry-run keywords:

```text
amazon seller gst accounting
→ /solutions/amazon-sellers

flipkart payment reconciliation
→ /resources/reconciliation

ecommerce accounting tally
→ /erp-connector/accounting

d2c brand accounting
→ /solutions/d2c-brands
```

The first live run should optimize only one keyword.

---

# 23. The Closed Loop

The system operates continuously.

```text
WEEK 1
Optimize
   ↓
Create PR
   ↓
Human merges
   ↓
Record baseline

WEEK 2
Google crawls/re-evaluates

WEEK 3
Ranking continues settling

WEEK 4+
Measure
   ↓
Before vs After
   ↓
Determine result
   ↓
Generate learning

NEXT WEEK
Research receives learning
   ↓
Score opportunities
   ↓
Select next opportunity
   ↓
Apply better tactic
```

The system therefore becomes progressively informed by its own historical results.

---

# 24. The Role of the Formula in the Closed Loop

The formula is only the **selection mechanism**.

It does not perform the entire SEO process.

The complete system is:

```text
                    ┌──────────────┐
                    │     GSC      │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │    Scoring   │
                    │              │
                    │ Volume       │
                    │ Position     │
                    │ Intent       │
                    │ Momentum     │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Filters    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Best Keyword │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ AI Diagnosis │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ AI Content   │
                    │   Change     │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Validate   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Human Review │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │    Deploy    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Measure    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Learnings  │
                    └──────┬───────┘
                           │
                           └──────────→ Next Research
```

---

# 25. Formula Summary

## Step 1 — Determine Search Demand

```text
Volume
```

This tells us how large the potential audience is.

---

## Step 2 — Determine Room to Improve

```text
Position
```

A higher position number means more room to move upward.

---

## Step 3 — Calculate SEO Opportunity

$$
\boxed{
SEO\ Opportunity =
Volume \times Position
}
$$

This combines:

```text
Size of prize
+
Room to improve
```

---

## Step 4 — Adjust for Business Intent

$$
SEO\ Opportunity \times Intent
$$

Commercial keywords receive greater weight than informational keywords.

---

## Step 5 — Adjust for Momentum

$$
SEO\ Opportunity
\times
Intent
\times
Momentum
$$

A rapidly improving keyword receives a positive multiplier.

A falling keyword receives a negative priority adjustment.

---

## Final Formula

$$
\boxed{
Priority\ Score =
Volume
\times
Position
\times
Intent
\times
Momentum
}
$$

### In plain English:

> **Find the keywords with the largest search demand, the most room to improve, the highest business value, and the strongest positive movement — then prioritize the highest-scoring keyword that passes the safety filters.**

---

# 26. One-Line Definition

> **DeepRank scores every keyword by search demand × room to improve × business intent × ranking momentum, selects the highest-value safe opportunity, diagnoses the ranking gap, makes one focused improvement, measures the result, and feeds the learning back into the next cycle.**

---

# 27. Final Principle

DeepRank should not ask:

> "Which keyword has the worst ranking?"

It should ask:

> **"Which keyword represents the greatest valuable SEO opportunity right now?"**

That opportunity depends on more than position.

It depends on:

$$
\boxed{
Opportunity =
Demand
\times
Room\ to\ Improve
}
$$

and the final priority depends on:

$$
\boxed{
Priority =
Opportunity
\times
Intent
\times
Momentum
}
$$

This makes the purpose of every part of the formula explicit.
