# Task

You are writing the narrative text of synthetic medical record items for a test corpus (FOLIO). All patients and clinicians are fictional. Each request below is one record item from Northgate Family Medicine (primary care event log). Its structured data already exists; you write only the human-readable note text that goes with it.

## How this source writes

A primary-care practice. Prose is terse: what the clinician typed into a comment box or a short visit note.
Visit notes: a few short lines, abbreviations are normal (pt, f/u, RTC 3 mo, BP, A1c, HTN, DM2, CKD). No headings, no bold section labels. Mention what was decided today.
Event comments (medication, problem, allergy events): one or two short lines, usually the whole comment is the span, e.g. `<ref id="med_1">eGFR 41 on 2/9. Metformin down to 500 mg BID.</ref> Pt informed by phone.`
Dates in prose are short US style (2/9, 11/2024). Referral letters are a short plain letter to the specialist.

## Reference notes from this source (other dates; for style only, do not copy their facts)

```markdown
Hosp f/u. Riverside 11/2–11/5, euglycemic DKA. Feels back to baseline, eating and drinking normally.

Empagliflozin stopped, entered as adverse reaction. Metformin and chlorthalidone continue per discharge.

<ref id="sick_day">sick day rules reviewed</ref>

RTC 3 mo.
```

```markdown
<ref id="med_1">eGFR 41 on 2/9. Metformin down to 500 mg BID (max 1000 mg/day at eGFR 30–44).</ref>
Pt informed by phone.
```

```markdown
<ref id="alg_1">Dry cough since ~April on lisinopril.</ref> No lip, tongue or throat swelling.
```

## Rules (a program checks every note; violations are sent back to you)

1. For every id in `refs` and `spans`, wrap the words about it in exactly one `<ref id="ID">…</ref>`. Use no other ids. Spans never nest and never cross a paragraph break or a list item.
2. `spans` have no structured data behind them, so the span's own words must say the `statement`.
3. Say every `mustInclude` fact somewhere in the note, in the author's words, keeping the numbers.
4. Never mention anything matching `forbidden`, not even to deny it.
5. Words matching `sensitive` may appear only inside the listed spans.
6. Markdown only: no HTML except the ref tags, no images, no frontmatter, no code fences. Write values like `<0.01` as they are.
7. If a `skeleton` is given, reproduce it exactly and replace each [words] with the text.
8. Use only the facts given (refs, spans, mustInclude, context, gist). You may add ordinary narrative texture (symptoms described in words, exam findings, reassurance, follow-up timing) but no new diagnoses, medications, doses, or lab values.
9. Keep to each request's `length`.
10. No signature lines, no "signed at" times, no ISO timestamps (2024-11-02T07:15); write dates and times the way this source does.
11. Don't state decisions about medications or problems beyond what the request gives; mention other listed medications only as they are listed.
12. Patients (HomeLog) write what they knew at the time, in plain words: no diagnosis they had not been given yet, no generic names in parentheses after a brand.

## Output

Write ONE file, `out/notes.md`, containing every note, each preceded by its header line exactly like this:

```
=== note: <key> ===
<note text>
```

Do not write anything else to out/. Reply "done" when the file is written.

## Requests (11)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2021-02-15 11:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Type 2 diabetes mellitus\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Type 2 diabetes mellitus",
   "onset 2012-06",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2021-02-15 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2021-02-15 11:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Obesity\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Obesity",
   "onset 2007-09",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2021-02-15 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_4",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2021-02-15 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/75, pulse 62, wt 263 lb",
   "eGFR 64 (today)",
   "K 3.8 (today)",
   "A1c 6.4% (today)",
   "LDL 144 mg/dL (today)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2021-02-15 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_14",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-09-03 09:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/81, pulse 82, wt 262 lb",
   "eGFR 66 (8/28)",
   "K 4 (8/28)",
   "UACR 8 mg/g (8/28)",
   "A1c 6.6% (8/28)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2021-09-03 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-04-01 12:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 109/64, pulse 63, wt 261 lb",
   "eGFR 62 (3/28)",
   "A1c 6.5% (3/28)",
   "LDL 168 mg/dL (3/28)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2022-04-01 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-02-02 08:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/74, pulse 72, wt 262 lb",
   "eGFR 64 (1/28)",
   "A1c 6.9% (1/28)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2023-02-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-12-01 14:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 113/75, pulse 82, wt 259 lb",
   "eGFR 62 (today)",
   "A1c 7.1% (today)",
   "LDL 173 mg/dL (today)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2023-12-01 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-16 10:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/72, pulse 79, wt 261 lb",
   "eGFR 66 (today)",
   "K 4.2 (today)",
   "UACR 9 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2024-07-16 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-05-19 14:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/70, pulse 85, wt 259 lb",
   "eGFR 62 (today)",
   "K 4.4 (today)",
   "UACR 7 mg/g (today)",
   "A1c 7.4% (today)",
   "LDL 116 mg/dL (today)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2025-05-19 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_77",
  "kind": "Chart correction comment",
  "when": "2025-05-27 08:13",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The metoprolol succinate 50 mg start entered 2025-05-26 was wrong patient"
  ],
  "context": [
   "metoprolol succinate: entered in error today (wrong patient)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-01-13 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/73, pulse 79, wt 264 lb",
   "eGFR 61 (today)",
   "A1c 6.6% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
