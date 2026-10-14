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

## Requests (24)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2022-05-25 14:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2013-07",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2022-05-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2022-05-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-05-25 14:22",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2022-05-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2022-05-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-05-25 14:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2020-10-02",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2022-05-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2022-05-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2022-05-25 14:22",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2022-05-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2022-05-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-05-25 13:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/73, pulse 76, wt 226 lb",
   "eGFR 54 (today)",
   "K 4.6 (today)",
   "UACR 9 mg/g (today)",
   "A1c 8% (today)",
   "LDL 92 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2022-05-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2022-05-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_34/0",
  "kind": "Problem list comment",
  "when": "2022-09-17 16:25",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2022-09-17",
   "supporting result: eGFR 54 (5/25)",
   "supporting result: eGFR 54 (today)",
   "supporting result: UACR 10 mg/g (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-09-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2022-09-17 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2022-09-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-22 15:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/78, repeat 137/75, pulse 83, wt 227 lb",
   "eGFR 54 (9/17)",
   "K 4.6 (9/17)",
   "UACR 10 mg/g (9/17)",
   "A1c 7.9% (9/17)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-09-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2022-09-22 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2022-09-22 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2023-03-15 10:21",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change lisinopril 40 MG Oral Tablet 40 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-03-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2023-03-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-03-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-03-15 10:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/86, pulse 78, wt 224 lb",
   "eGFR 52 (3/12)",
   "K 4.1 (3/12)",
   "A1c 8% (3/12)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-03-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2023-03-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-03-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_53/0",
  "kind": "Medication event comment",
  "when": "2023-07-17 11:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start chlorthalidone 25 MG Oral Tablet 12.5 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-07-17 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-07-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2023-07-17 11:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.5"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.5)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-07-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2023-07-17 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-07-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-07-17 11:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.5)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 154/90, pulse 71, wt 231 lb",
   "eGFR 50 (today)",
   "K 4.5 (today)",
   "UACR 12 mg/g (today)",
   "A1c 8.5% (today)",
   "LDL 67 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-07-17 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-07-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-23 12:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/73, pulse 67, wt 226 lb",
   "eGFR 50 (11/17)",
   "K 4.5 (11/17)",
   "UACR 10 mg/g (11/17)",
   "A1c 7.6% (11/17)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-11-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-11-23 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-04-11 13:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/83, pulse 75, wt 226 lb",
   "eGFR 51 (4/5)",
   "K 4.6 (4/5)",
   "UACR 11 mg/g (4/5)",
   "A1c 7.7% (4/5)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-04-11 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2024-04-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_82/0",
  "kind": "Medication event comment",
  "when": "2024-09-02 11:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.6, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.6, CKD)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-09-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-02 11:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.6, CKD)"
  ],
  "context": [
   "BP 131/72, pulse 81, wt 225 lb",
   "eGFR 47 (today)",
   "K 4.5 (today)",
   "A1c 8.6% (today)",
   "LDL 77 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-09-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_93/0",
  "kind": "Medication event comment",
  "when": "2025-02-24 14:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "key": "B/visit/e_83",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-24 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 127/75, pulse 65, wt 223 lb",
   "eGFR 46 (2/19)",
   "K 4.3 (2/19)",
   "UACR 17 mg/g (2/19)",
   "A1c 7.7% (2/19)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_122/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2025-08-18 14:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 46, UACR 22 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_94",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-08-18 13:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/78, pulse 71, wt 225 lb",
   "eGFR 46 (today)",
   "K 4.7 (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2025-12-19 13:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "key": "B/visit/e_100",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-12-19 12:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "context": [
   "BP 126/71, pulse 72, wt 224 lb",
   "eGFR 42 (12/14)",
   "K 4.8 (12/14)",
   "UACR 23 mg/g (12/14)",
   "A1c 8.5% (12/14)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_34/1",
  "kind": "Problem list comment",
  "when": "2026-04-26 16:25",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2022-09-17",
   "supporting result: eGFR 46 (2/19)",
   "supporting result: eGFR 44 (today)",
   "supporting result: UACR 22 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_110",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-04-28 15:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/82, pulse 65, wt 223 lb",
   "eGFR 44 (4/26)",
   "K 4.5 (4/26)",
   "UACR 22 mg/g (4/26)",
   "A1c 8.6% (4/26)",
   "LDL 106 mg/dL (4/26)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
