# DeepRank Progress Tracker → Google Sheets

Convert your local Excel progress tracker into a Google Sheet you update continuously.

## Step 1 — Create the spreadsheet

1. Open <https://sheets.new> (this creates a new Google Sheet in your Drive).
2. Rename the sheet (top-left) → e.g. `DeepRank Progress`.

## Step 2 — Import the 4 tabs (in order)

The `csv/` folder has one file per tab:

| File | Tab name to use | What it holds |
|---|---|---|
| `csv/1-Dashboard.csv` | `Dashboard` | Phase completion, done vs remaining, key stats |
| `csv/2-Task-Log-Done.csv` | `Task Log` | All 11 completed tasks (T1–T11) + verification |
| `csv/3-Remaining-Work.csv` | `Remaining` | Day 3–5 work, importance, what it unblocks |
| `csv/4-Importance-Map.csv` | `Importance` | Why each piece matters (Critical/High/Medium) |

For each file:
1. In Sheets: **File → Import → Upload → choose the CSV**
2. **Import location:** *Create new spreadsheet* will make 4 separate files — instead pick
   **Insert new sheet(s)** so all tabs land in the same spreadsheet.
   (If you already created the spreadsheet in step 1, import into it:
   **File → Import → Upload → Import location → Add new sheet(s)** → toggle *Replace current sheet* OFF.)
3. Repeat for all 4 CSVs → you'll have 4 tabs.

> Tip: Better alternative — open the `.xlsx` directly:
> Sheets → **File → Import → Upload → deeprank-progress.xlsx** → *Replace spreadsheet*.
> This imports all 4 tabs in one go (formats may simplify slightly). Then rename tabs as you like.

## Step 3 — Always edit the Sheet, never touch the CSVs

From now on, update progress directly in the Google Sheet:
- **Task Log tab** → change **Status** to `DONE` when a task is verified; update Notes.
- **Dashboard tab** → bump the `Done`/`Share` cells as packages complete.
- **Remaining tab** → when a package starts, move its row to Task Log with status `IN PROGRESS`.

Small helper formulas you can paste into the Dashboard cells:

```
Done count  (Dashboard B6, currently the "Task Log" total):
=COUNTA('Task Log'!F2:F40)
Done share  (Dashboard D6):
=COUNTA('Task Log'!F2:F40) / (COUNTA('Task Log'!F2:F40) + COUNTA('Remaining'!F2:F40))
```

## Optional — regenerate the CSV/Excel from the task files

If you want to rebuild the local files (e.g. from updated `day-*.md`), say so and I'll
refresh `tasks/csv/*.csv` + `tasks/deeprank-progress.xlsx`; then re-import just the
changed tabs (Import → **Replace current sheet** to overwrite that one tab without
losing your manual edits on other tabs).

---

## Status legend

| Status | Meaning |
|---|---|
| DONE | Implemented + verified (dry-run/log evidence) |
| IN PROGRESS | Started, not yet verified |
| NOT STARTED | Queued (future days) |

## Importance legend

| Importance | Meaning |
|---|---|
| Critical | Blocks the closed loop; a missing gate risks the live site |
| High | Core value; agent can't be useful without it |
| Medium | Accuracy/operational quality; can ship without, add later |