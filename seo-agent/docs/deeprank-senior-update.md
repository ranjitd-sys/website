# DeepRank — Data Source Update for Senior

> One file with everything you need to correct the earlier mistake and show the accurate data-source picture. Copy the message below or share the table.

---

# 1. Copy-paste message (Google Messages / Slack)

> Hi [Senior's name],
>
> I need to correct something I told you earlier about the DeepRank data sources. I said search volume comes from Google Search Console — that was a mistake. Volume actually comes from Google Ads Keyword Planner/API. GSC only gives us our own site's impressions, position and CTR — not market search demand. I confused impressions with volume; impressions is how often *our* page appears, volume is total searches for the keyword.
>
> The correct breakdown is:
> - Keyword list → GSC (queries people actually used to find us)
> - Search volume → Google Ads Keyword Planner/API
> - Keyword difficulty → Ahrefs/SEMrush/Moz (paid, optional)
> - Position / momentum → GSC
> - Intent → currently manually seeded in the DB; the design is for the LLM (brain) to classify intent when new keywords are discovered from GSC
>
> I should have verified the source before telling you, and I'll double-check data sources before sharing them going forward. Sorry for the confusion — I've updated the documentation so it's correct now.

---

# 2. Short version (if needed)

> Hi [Senior's name], correcting what I said earlier — search volume comes from Google Ads Keyword Planner/API, not GSC. GSC only gives our own site's impressions, position and CTR. I confused impressions with volume. My mistake — I'll verify data sources before sharing them from now on. Updated the docs so it's accurate.

---

# 3. Complete data-source requirements

| # | Data source | Data it provides | How to access | Cost | Status |
|---|---|---|---|---|---|
| 1 | **Google Search Console (GSC)** | Keyword list (real queries), clicks, impressions, position, CTR, 28-day trend — **your site's performance** | Search Console API (service account) | Free | ⏳ Pending — creds not granted |
| 2 | **Google Ads Keyword Planner / Ads API** | **Search volume** (market demand), competition level | Google Ads API (Ads account required) | Free (with Ads account) | ❌ Not wired |
| 3 | **Ahrefs / SEMrush / Moz** | **Keyword difficulty** (0–100), competitor insights | Paid API | ~$99–199/mo | ❌ Optional / not wired |
| 4 | **SERP data** (SerpApi / Serper.dev / Serpstack) | Top-10 competitor results (titles, URLs, snippets) | Paid API (or mock) | ~$50–150/mo | ⏸ Mock → API optional |
| 5 | **Live page crawl** | Current title, description, H1, JSON-LD, links | Internal (`crawl.ts`) | Free | ✅ Working |
| 6 | **PostgreSQL** | Keywords, pages, opportunities, changes, learnings | Internal DB | Hosting cost | ✅ Working |
| 7 | **LLM (Groq)** | Diagnosis, metadata writing, review, learnings | Groq API | Free tier → per-use | ✅ Working |
| 8 | **GitHub** | Branch, commit, draft PR | PAT / Actions token | Free | ✅ Working |

---

# 4. What the scoring formula needs vs. what we have

```
Formula:  Volume  ×  Position  ×  Intent  ×  Momentum
              │           │            │           │
Source:  Keyword     GSC (own     DB seed     GSC trend
         Planner     ranking)     (manual)    (4-week)
                                  (LLM/brain planned)
```

- **Required now:** GSC API (positions, trend) — the only blocker for real runs.
- **Nice-to-have next:** Keyword Planner volume + difficulty → populate `keywords.volume` / `keywords.difficulty` (columns already exist, currently NULL).
- **Optional:** SERP API for richer competitor context in the LLM.

---

# 5. Key distinction to keep straight

| | GSC | Keyword Planner / Ads API |
|---|---|---|
| Search volume | ❌ No | ✅ Yes |
| Keyword list (your site) | ✅ Yes | ❌ No |
| Impressions (your page) | ✅ Yes | ❌ No |
| Position / ranking | ✅ Yes | ❌ No |
| Clicks / CTR | ✅ Yes | ❌ No |
| Competitor data | ❌ No | Partial |

**Memory hook:** GSC = *your* past performance. Keyword Planner = *the whole market*. Volume is market demand; impressions is your visibility.