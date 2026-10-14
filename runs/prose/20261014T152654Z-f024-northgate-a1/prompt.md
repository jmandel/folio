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

## Requests (17)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2022-09-08 10:42",
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
   "onset 2012-04-14",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-09-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-09-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-09-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-09-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-09-08 10:42",
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
   "onset 2019-12-14",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-09-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-09-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-09-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-09-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-09-08 10:42",
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
   "onset 2009-03",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-09-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-09-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-09-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-09-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_66/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2022-09-08 10:55",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 40, UACR 80 mg/g: CKD evaluation and management"
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
   "dapagliflozin: not started by 2022-09-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-09-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-09-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-09-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-09-08 10:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/88, pulse 62, wt 210 lb",
   "eGFR 40 (today)",
   "K 4.7 (today)",
   "A1c 7.7% (today)",
   "LDL 103 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-09-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-09-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-09-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-09-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_74",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2022-10-24 11:39",
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
  "forbidden": [
   "dapagliflozin: not started by 2022-10-24 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-10-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-10-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_24/0",
  "kind": "Problem list comment",
  "when": "2023-06-25 16:25",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Chronic kidney disease stage 3b\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "onset 2023-06-25",
   "supporting result: eGFR 43 (3/9)",
   "supporting result: eGFR 41 (today)",
   "supporting result: UACR 78 mg/g (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-06-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2023-06-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-06-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2023-06-30 08:36",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change lisinopril 20 MG Oral Tablet 20 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-06-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2023-06-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-06-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-06-30 08:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 151/92, repeat 148/88, pulse 85, wt 212 lb",
   "eGFR 41 (6/25)",
   "K 4.8 (6/25)",
   "UACR 78 mg/g (6/25)",
   "A1c 7.6% (6/25)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-06-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2023-06-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-06-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_36/0",
  "kind": "Medication event comment",
  "when": "2024-05-10 13:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.3, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.3, CKD)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-05-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-05-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2024-05-10 13:22",
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
   "chlorthalidone: not started by 2024-05-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-05-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-05-10 13:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.3, CKD)",
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 158/94, repeat 155/94, pulse 87, wt 210 lb",
   "eGFR 38 (today)",
   "K 4.8 (today)",
   "UACR 81 mg/g (today)",
   "A1c 8.3% (today)",
   "LDL 148 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-05-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-05-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_46/0",
  "kind": "Medication event comment",
  "when": "2025-01-30 14:51",
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
   "amlodipine: not started by 2025-01-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_37",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-30 14:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/85, repeat 145/85, pulse 87, wt 212 lb",
   "eGFR 38 (today)",
   "K 4.7 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-01-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_58/0",
  "kind": "Medication event comment",
  "when": "2025-10-21 10:41",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-21 10:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/79, repeat 141/79, pulse 62, wt 213 lb",
   "eGFR 34 (today)",
   "K 4.2 (today)",
   "UACR 111 mg/g (today)",
   "A1c 7.4% (today)",
   "LDL 123 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-07-10 14:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/83, repeat 138/82, pulse 71, wt 208 lb",
   "eGFR 32 (7/6)",
   "K 4.5 (7/6)",
   "UACR 83 mg/g (7/6)",
   "A1c 7.7% (7/6)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
