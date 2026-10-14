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

## Requests (27)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-11-24 12:12",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Essential hypertension\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Essential hypertension",
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-11-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-11-24 12:12",
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
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-11-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-11-24 12:12",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-11-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-11-24 12:12",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Heart failure with reduced ejection fraction\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Heart failure with reduced ejection fraction",
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-11-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_13",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-11-24 11:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 109/67, pulse 71, wt 152 lb",
   "eGFR 66 (today)",
   "K 4.8 (today)",
   "A1c 8% (today)",
   "LDL 77 mg/dL (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-11-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_24",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-04-12 09:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 111/69, pulse 69, wt 149 lb",
   "eGFR 67 (today)",
   "K 4.3 (today)",
   "UACR 146 mg/g (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-04-12 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2021-09-21 12:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.4)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-09-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-09-21 11:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.4)"
  ],
  "context": [
   "BP 112/65, pulse 68, wt 152 lb",
   "eGFR 65 (today)",
   "K 4.7 (today)",
   "A1c 8.4% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-09-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-02-07 09:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/65, pulse 88, wt 151 lb",
   "eGFR 64 (today)",
   "K 5 (today)",
   "UACR 197 mg/g (today)",
   "A1c 7.5% (today)",
   "LDL 73 mg/dL (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-02-07 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-07-19 12:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/74, pulse 62, wt 153 lb",
   "eGFR 62 (today)",
   "K 4.4 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-07-19 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-01-09 11:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 114/69, pulse 81, wt 150 lb",
   "eGFR 61 (today)",
   "K 4.9 (today)",
   "A1c 7.9% (today)",
   "LDL 78 mg/dL (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-01-09 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-26 12:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 111/68, pulse 66, wt 150 lb",
   "eGFR 61 (today)",
   "K 4.7 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-05-26 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_141/0",
  "kind": "Allergy list comment",
  "when": "2023-06-26 13:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "lisinopril: angioedema of lips and tongue (allergy)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril allergy: angioedema of lips and tongue"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-06-26 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2023-06-26 13:13",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change amlodipine 10 MG Oral Tablet 10 mg QD; reason: replacing lisinopril (angioedema)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "amlodipine: dose changed to 10 mg daily today (replacing lisinopril (angioedema))"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-06-26 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2023-06-26 13:12",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 10 MG Oral Tablet 10 mg QD; reason: angioedema"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (angioedema)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-06-26 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_142",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2023-06-26 12:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril allergy: angioedema of lips and tongue",
   "lisinopril: stopped today (angioedema)",
   "amlodipine: dose changed to 10 mg daily today (replacing lisinopril (angioedema))"
  ],
  "context": [
   "Angioedema"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-06-26 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-10-25 14:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/76, pulse 74, wt 148 lb",
   "eGFR 60 (10/20)",
   "K 4.3 (10/20)",
   "A1c 7.8% (10/20)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-10-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_79",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-04-02 13:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 111/72, pulse 80, wt 150 lb",
   "eGFR 58 (today)",
   "K 4.9 (today)",
   "A1c 7.5% (today)",
   "LDL 113 mg/dL (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2024-04-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_99/0",
  "kind": "Problem list comment",
  "when": "2024-08-01 16:25",
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
   "onset 2024-08-01",
   "supporting result: eGFR 58 (4/2)",
   "supporting result: eGFR 56 (today)",
   "supporting result: UACR 197 mg/g (2/7/22)"
  ],
  "forbidden": [
   "semaglutide: not started by 2024-08-01 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_143/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2024-08-05 12:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 55, UACR 347 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "semaglutide: not started by 2024-08-05 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-08-05 11:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/76, pulse 70, wt 149 lb",
   "eGFR 56 (8/1)",
   "K 5 (8/1)",
   "A1c 7.4% (8/1)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "semaglutide: not started by 2024-08-05 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_106/0",
  "kind": "Medication event comment",
  "when": "2024-12-09 11:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_100",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-12-09 11:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 119/74, pulse 73, wt 146 lb",
   "eGFR 52 (12/3)",
   "K 4.3 (12/3)",
   "A1c 8.1% (12/3)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_107",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-05-29 13:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 119/70, pulse 63, wt 151 lb",
   "eGFR 50 (today)",
   "K 4.2 (today)",
   "A1c 7.1% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/2",
  "kind": "Medication event comment",
  "when": "2025-11-17 16:01",
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
  "key": "B/visit/e_118",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-11-17 15:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "context": [
   "BP 120/67, pulse 71, wt 154 lb",
   "eGFR 45 (11/12)",
   "K 4.4 (11/12)",
   "UACR 472 mg/g (11/12)",
   "A1c 7.8% (11/12)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_125",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-05-11 14:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 115/74, pulse 71, wt 150 lb",
   "eGFR 40 (5/8)",
   "K 4.5 (5/8)",
   "A1c 7.6% (5/8)",
   "LDL 89 mg/dL (5/8)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
