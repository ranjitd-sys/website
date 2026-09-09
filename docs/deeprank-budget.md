# DeepRank — Monthly Budget

> Estimated monthly costs for running the DeepRank SEO agent.
> Last updated: 2026-09-09

---

## Summary

| Component | Monthly cost |
|---|---|
| OpenAI API | ~$1.50 |
| Postgres (Neon/Supabase) | $0 (free tier) |
| GitHub Actions | $0 (free tier) |
| Other tools | $0 |
| **Total** | **~$1.50/month** |

---

## 1. OpenAI API (the main cost)

### Weekly optimize (4 runs/month)

| Component | Model | Tokens per run | Monthly total | Cost/1M tokens | Monthly cost |
|---|---|---|---|---|---|
| Driver (tool-calling loop) | gpt-4.1 | ~30-40K | ~140K | $2.50 input + $10 output | ~$1.20 |
| Reviewer (safety gate) | gpt-4.1-mini | ~10-15K | ~50K | $0.40 input + $1.60 output | ~$0.06 |
| REVISE retries (if any) | gpt-4.1 | ~10K | ~20K (worst case) | same as driver | ~$0.20 |

### Monthly measure (1 run/month)

| Component | Model | Tokens | Cost/1M | Monthly cost |
|---|---|---|---|---|
| Learning synthesis | gpt-4.1-mini | ~5K | $0.40 + $1.60 | ~$0.01 |

**OpenAI total: ~$1.50/month**

---

## 2. Database (Postgres)

| Provider | Free tier | Enough? |
|---|---|---|
| **Neon** | 0.5GB storage, 191.9 compute hours | Yes — keywords + positions + opportunities + changes for 50-100 keywords is <100MB |
| **Supabase** | 500MB storage, 2GB bandwidth | Also sufficient |

**Database cost: $0/month** (free tier)

---

## 3. Hosting / CI (GitHub Actions)

| Job | Duration | Runs/month | Minutes |
|---|---|---|---|
| Weekly optimize | ~10-15 min | 4 | ~50 |
| Monthly measure | ~3-5 min | 1 | ~4 |
| **Total** | | | **~55 min** |

GitHub Actions free tier: 2,000 minutes/month. You use ~3% of it.

**Hosting cost: $0/month** (free tier)

---

## 4. Other tools

| Tool | Cost |
|---|---|
| websearch (SERP) | free |
| GSC API | free |
| GA4 API | free |
| Playwright | free (runs on GitHub Actions) |
| Octokit (GitHub API) | free |

**Other cost: $0/month**

---

## 5. Cost scaling (if you grow)

| Keyword count | Optimize runs | OpenAI cost | Notes |
|---|---|---|---|
| 5-10 keywords | 4/month | ~$1.50 | current plan |
| 20-30 keywords | 4/month | ~$3-4 | more tool calls per run |
| 50+ keywords | 4/month | ~$6-8 | need `maxOpportunities` increase |
| 100+ keywords | 8/month (twice weekly) | ~$15-20 | consider bi-weekly optimize |

The cost scales roughly linearly with keyword count and run frequency, but stays under $20/month even at 100 keywords.

---

## 6. Design decisions that affect cost

**How many opportunities per run?** Currently `maxOpportunities=1` (first run) → `3` (subsequent). If you want `5` per week, multiply OpenAI cost by ~1.5x. Recommendation: start at 1, scale to 3 after you've reviewed the first few PRs.

**Keyword count target?** Determines whether you stay on free tiers or need to budget for Neon compute ($0.16/compute-hour after free tier).

---

## 7. What you get for ~$1.50/month

- 4 weekly optimized PRs (one per week, reviewed by you)
- 1 monthly measurement report (verdicts + learnings)
- Continuous keyword position tracking
- Closed-loop learning (each month's verdicts improve next month's edits)
- Automated content improvements to your marketing site
- Zero manual SEO research or content writing
