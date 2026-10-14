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

## Requests (28)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-07-02 12:17",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-07-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2019-07-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-07-02 12:17",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Hyperlipidemia\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Hyperlipidemia",
   "onset 2012-10",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-07-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2019-07-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-07-02 12:17",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Primary osteoarthritis of knee\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Primary osteoarthritis of knee",
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-07-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2019-07-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-07-02 11:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/85, pulse 81, wt 177 lb",
   "eGFR 72 (today)",
   "K 4.1 (today)",
   "A1c 7.8% (today)",
   "LDL 81 mg/dL (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-07-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2019-07-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_27/0",
  "kind": "Medication event comment",
  "when": "2019-12-17 09:11",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-12-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2019-12-17 08:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "context": [
   "BP 125/73, pulse 69, wt 175 lb",
   "eGFR 69 (12/11)",
   "K 4.4 (12/11)",
   "UACR 416 mg/g (12/11)",
   "A1c 8.2% (12/11)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-12-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-06-09 12:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/77, pulse 63, wt 174 lb",
   "eGFR 69 (6/5)",
   "K 4.5 (6/5)",
   "A1c 7.6% (6/5)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-06-09 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-11-03 13:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/86, pulse 84, wt 175 lb",
   "eGFR 69 (10/29)",
   "K 4.1 (10/29)",
   "A1c 7.9% (10/29)",
   "LDL 124 mg/dL (10/29)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-11-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-04-20 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/76, repeat 138/72, pulse 69, wt 175 lb",
   "eGFR 68 (today)",
   "K 4 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-04-20 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_164/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-10-11 11:35",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 66, UACR 522 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease",
   "Type 2 diabetes mellitus"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-10-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-10-11 10:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/84, pulse 66, wt 174 lb",
   "eGFR 66 (today)",
   "K 4.2 (today)",
   "A1c 8% (today)",
   "LDL 74 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-10-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_65",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-02-23 08:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/81, pulse 85, wt 174 lb",
   "eGFR 65 (today)",
   "K 4.4 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-02-23 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_79/0",
  "kind": "Medication event comment",
  "when": "2022-07-01 08:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-07-01 08:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 124/71, pulse 71, wt 176 lb",
   "eGFR 64 (6/25)",
   "K 4.2 (6/25)",
   "UACR 549 mg/g (6/25)",
   "A1c 8.1% (6/25)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_80",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-11-23 15:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/83, pulse 72, wt 178 lb",
   "eGFR 64 (today)",
   "K 4.5 (today)",
   "A1c 6.9% (today)",
   "LDL 76 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_93",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-12 09:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 115/69, pulse 79, wt 174 lb",
   "eGFR 64 (today)",
   "K 4.3 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_99",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-09-27 10:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/81, pulse 71, wt 176 lb",
   "eGFR 63 (9/25)",
   "K 4.2 (9/25)",
   "A1c 7.6% (9/25)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_79/1",
  "kind": "Medication event comment",
  "when": "2024-03-04 11:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.4)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_105",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-03-04 10:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.4)"
  ],
  "context": [
   "BP 134/82, pulse 79, wt 173 lb",
   "eGFR 62 (2/29)",
   "K 4.6 (2/29)",
   "UACR 783 mg/g (2/29)",
   "A1c 8.4% (2/29)",
   "LDL 80 mg/dL (2/29)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_116",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-17 13:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/80, pulse 65, wt 177 lb",
   "eGFR 59 (today)",
   "K 3.8 (today)",
   "UACR 973 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_130/0",
  "kind": "Problem list comment",
  "when": "2024-11-26 13:47",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Chronic kidney disease stage 3a\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "onset 2024-11-26",
   "supporting result: eGFR 58 (9/12)",
   "supporting result: eGFR 56 (today)",
   "supporting result: UACR 973 mg/g (7/17)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_123",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-11-26 13:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/75, pulse 82, wt 177 lb",
   "eGFR 56 (today)",
   "K 4.2 (today)",
   "A1c 7.5% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_131",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-03-31 13:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/77, pulse 64, wt 176 lb",
   "eGFR 53 (3/27)",
   "K 4.2 (3/27)",
   "UACR 1169 mg/g (3/27)",
   "A1c 7.7% (3/27)",
   "LDL 57 mg/dL (3/27)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_142",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-08-11 14:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/84, repeat 141/81, pulse 66, wt 175 lb",
   "eGFR 51 (8/9)",
   "K 4.4 (8/9)",
   "A1c 7.9% (8/9)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_79/2",
  "kind": "Medication event comment",
  "when": "2026-01-05 10:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 18 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 18 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_148",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-01-05 10:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 18 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 133/80, pulse 68, wt 177 lb",
   "eGFR 47 (today)",
   "K 4.8 (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2026-05-18 15:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 44"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_154",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-05-18 15:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "context": [
   "BP 136/81, pulse 74, wt 179 lb",
   "eGFR 43 (5/15)",
   "K 4.4 (5/15)",
   "A1c 7.3% (5/15)",
   "LDL 79 mg/dL (5/15)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
