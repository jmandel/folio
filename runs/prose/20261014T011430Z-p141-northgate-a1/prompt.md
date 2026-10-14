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

## Requests (22)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-09-23 14:47",
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
   "onset 2017-01",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2019-09-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-09-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2019-09-23 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-09-23 14:47",
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
   "onset 2018-03",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2019-09-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-09-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2019-09-23 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-09-23 14:47",
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
   "dapagliflozin: not started by 2019-09-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-09-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2019-09-23 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-09-23 14:47",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2019-09-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-09-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2019-09-23 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-09-23 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 157/99, repeat 155/97, pulse 67, wt 200 lb",
   "eGFR 55 (today)",
   "K 4.3 (today)",
   "A1c 7.9% (today)",
   "LDL 75 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2019-09-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-09-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2019-09-23 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2020-07-30 08:36",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "dapagliflozin: not started by 2020-07-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-07-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-07-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-07-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_30/0",
  "kind": "Problem list comment",
  "when": "2020-07-30 08:47",
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
   "onset 2020-07-30",
   "supporting result: eGFR 55 (9/23/19)",
   "supporting result: eGFR 50 (today)",
   "supporting result: UACR 507 mg/g (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-07-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-07-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-07-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-07-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-07-30 08:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/87, repeat 140/84, pulse 65, wt 203 lb",
   "eGFR 50 (today)",
   "K 4.6 (today)",
   "UACR 507 mg/g (today)",
   "A1c 7.7% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-07-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-07-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-07-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-07-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_43/0",
  "kind": "Medication event comment",
  "when": "2021-05-07 10:12",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "amlodipine: not started by 2021-05-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-05-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_42/0",
  "kind": "Medication event comment",
  "when": "2021-05-07 10:11",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.5, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.5, CKD)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-05-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-05-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-05-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_31",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-05-07 09:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.5, CKD)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/86, pulse 67, wt 201 lb",
   "eGFR 50 (today)",
   "K 4.8 (today)",
   "A1c 8.5% (today)",
   "LDL 50 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2021-05-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-05-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_50/0",
  "kind": "Medication event comment",
  "when": "2021-12-27 13:31",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start amlodipine 5 MG Oral Tablet 5 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "finerenone: not started by 2021-12-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_113/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-12-27 13:55",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 50, UACR 702 mg/g: CKD evaluation and management"
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
   "finerenone: not started by 2021-12-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_44",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-12-27 13:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/86, repeat 138/84, pulse 81, wt 200 lb",
   "eGFR 50 (today)",
   "K 4.5 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2021-12-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_121",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2022-03-11 11:21",
  "author": "Kim Foster, RN (Registered nurse)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "finerenone 10 mg QD added from the outside (Lakeview) record"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "finerenone 10 mg daily"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_51",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-10-26 13:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/81, pulse 63, wt 199 lb",
   "eGFR 45 (10/22)",
   "K 4.7 (10/22)",
   "UACR 665 mg/g (10/22)",
   "A1c 7.5% (10/22)",
   "LDL 95 mg/dL (10/22)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2023-06-30 08:51",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 43"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-06-30 08:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "context": [
   "BP 135/82, pulse 62, wt 200 lb",
   "eGFR 43 (today)",
   "K 4.2 (today)",
   "UACR 782 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-02-06 09:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/83, repeat 139/83, pulse 71, wt 200 lb",
   "eGFR 42 (today)",
   "K 4.8 (today)",
   "UACR 648 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 97 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_87",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-02 14:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/83, pulse 66, wt 202 lb",
   "eGFR 42 (today)",
   "K 4.3 (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_94",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-05-16 13:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/67, pulse 70, wt 201 lb",
   "eGFR 43 (today)",
   "K 4.6 (today)",
   "A1c 7.7% (today)",
   "LDL 86 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_107",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-01-19 12:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/81, pulse 63, wt 203 lb",
   "eGFR 41 (today)",
   "K 4.3 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
