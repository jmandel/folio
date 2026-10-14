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

## Requests (26)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-10-13 09:02",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-10-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-10-13 09:02",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-10-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-10-13 09:02",
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
   "onset 2019-10",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-10-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-10-13 09:02",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2005",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-10-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2020-10-13 09:02",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-10-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_13",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-10-13 08:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/82, pulse 78, wt 237 lb",
   "eGFR 65 (today)",
   "K 4.5 (today)",
   "A1c 7% (today)",
   "LDL 59 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-10-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_24",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-03-24 12:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/84, pulse 71, wt 234 lb",
   "eGFR 64 (today)",
   "K 6.5 (today), hemolyzed",
   "UACR 181 mg/g (today)",
   "A1c 6.9% (today)",
   "K 4.1 (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-03-24 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_36",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-07-22 12:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/76, pulse 82, wt 236 lb",
   "eGFR 65 (today)",
   "K 5 (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-07-22 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_42",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-01-11 08:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/83, pulse 81, wt 232 lb",
   "eGFR 63 (today)",
   "K 4.4 (today)",
   "A1c 7.4% (today)",
   "LDL 93 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-01-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-05-25 13:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/84, pulse 66, wt 235 lb",
   "eGFR 63 (5/22)",
   "K 4.2 (5/22)",
   "UACR 293 mg/g (5/22)",
   "A1c 8% (5/22)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-05-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2022-11-07 11:41",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.2)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-11-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-11-07 11:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.2)"
  ],
  "context": [
   "BP 141/82, pulse 83, wt 232 lb",
   "eGFR 64 (today)",
   "K 4.7 (today)",
   "UACR 270 mg/g (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-11-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_149/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2023-04-03 13:55",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 62, UACR 263 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-04-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-03 13:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/81, pulse 64, wt 233 lb",
   "eGFR 62 (3/30)",
   "K 5 (3/30)",
   "UACR 301 mg/g (3/30)",
   "A1c 7.4% (3/30)",
   "LDL 85 mg/dL (3/30)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-04-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-09-21 14:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/82, repeat 134/80, pulse 66, wt 233 lb",
   "eGFR 61 (9/17)",
   "K 4.9 (9/17)",
   "UACR 362 mg/g (9/17)",
   "A1c 7.6% (9/17)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-09-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-01-25 15:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/83, pulse 70, wt 235 lb",
   "eGFR 61 (1/20)",
   "K 5.1 (1/20)",
   "UACR 285 mg/g (1/20)",
   "A1c 8% (1/20)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-01-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_103/0",
  "kind": "Medication event comment",
  "when": "2024-07-16 09:01",
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
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-16 08:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 145/90, pulse 72, wt 234 lb",
   "eGFR 58 (today)",
   "K 4.9 (today)",
   "UACR 349 mg/g (today)",
   "A1c 8.1% (today)",
   "LDL 49 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_114/0",
  "kind": "Problem list comment",
  "when": "2024-12-13 09:52",
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
   "onset 2024-12-13",
   "supporting result: eGFR 57 (8/16)",
   "supporting result: eGFR 54 (today)",
   "supporting result: UACR 496 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_104",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-12-13 09:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/84, pulse 71, wt 235 lb",
   "eGFR 54 (today)",
   "K 4.7 (today)",
   "UACR 496 mg/g (today)",
   "A1c 7.4% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_115",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-04-17 12:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/79, pulse 85, wt 233 lb",
   "eGFR 51 (4/13)",
   "K 4.8 (4/13)",
   "UACR 362 mg/g (4/13)",
   "A1c 7.5% (4/13)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_126",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-14 08:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/73, pulse 62, wt 235 lb",
   "eGFR 47 (10/8)",
   "K 4.9 (10/8)",
   "UACR 470 mg/g (10/8)",
   "A1c 7.1% (10/8)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/2",
  "kind": "Medication event comment",
  "when": "2026-03-09 11:31",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 42"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_133",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-03-09 11:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "context": [
   "BP 126/77, pulse 86, wt 235 lb",
   "eGFR 42 (today)",
   "K 5 (today)",
   "A1c 6.9% (today)",
   "LDL 73 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_114/1",
  "kind": "Problem list comment",
  "when": "2026-09-07 12:03",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "update problem \"Chronic kidney disease stage 3b\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "onset 2024-12-13",
   "supporting result: eGFR 38 (9/4)",
   "supporting result: eGFR 37 (today)",
   "supporting result: UACR 715 mg/g (9/4)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_143",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-09-07 11:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/71, pulse 76, wt 233 lb",
   "eGFR 37 (today)",
   "K 4.7 (today)",
   "A1c 6.8% (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
