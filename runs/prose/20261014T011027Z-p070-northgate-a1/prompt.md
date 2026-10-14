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
  "key": "B/med/m_18/0",
  "kind": "Medication event comment",
  "when": "2020-02-06 16:06",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.2)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-02-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-02-06 16:17",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2009-11-02",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-02-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-02-06 16:17",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2011-11-16",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-02-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-02-06 16:17",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-02-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-02-06 15:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.2)"
  ],
  "context": [
   "BP 130/78, pulse 74, wt 184 lb",
   "eGFR 88 (2/2)",
   "K 4.4 (2/2)",
   "A1c 8.2% (2/2)",
   "LDL 72 mg/dL (2/2)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-02-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-07-09 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/77, pulse 86, wt 183 lb",
   "eGFR 87 (today)",
   "K 4.3 (today)",
   "UACR 348 mg/g (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-07-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-07-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-07-09 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-01-04 09:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/89, pulse 78, wt 188 lb",
   "eGFR 93 (today)",
   "K 4.7 (today)",
   "UACR 295 mg/g (today)",
   "A1c 7.1% (today)",
   "LDL 74 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-01-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-01-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-01-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-06-01 15:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/82, pulse 73, wt 189 lb",
   "eGFR 88 (5/28)",
   "K 4.4 (5/28)",
   "A1c 7.5% (5/28)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-06-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-06-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-06-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-11-10 08:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/82, repeat 140/79, pulse 67, wt 186 lb",
   "eGFR 90 (today)",
   "K 4.6 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-11-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-11-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-11-10 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2022-03-16 10:31",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2022-03-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-03-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-03-16 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-03-16 10:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/93, repeat 138/93, pulse 88, wt 186 lb",
   "eGFR 89 (today)",
   "K 4.4 (today)",
   "A1c 7.1% (today)",
   "LDL 99 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-03-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-03-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-03-16 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/0",
  "kind": "Medication event comment",
  "when": "2022-09-12 15:31",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "amlodipine: not started by 2022-09-12 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-09-12 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-12 15:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/82, repeat 142/78, pulse 86, wt 186 lb",
   "eGFR 87 (9/6)",
   "K 4.3 (9/6)",
   "A1c 7.6% (9/6)"
  ],
  "forbidden": [
   "amlodipine: not started by 2022-09-12 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-09-12 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_81/0",
  "kind": "Medication event comment",
  "when": "2023-02-21 13:06",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-02-21 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 144/92, repeat 137/89, pulse 84, wt 188 lb",
   "eGFR 89 (2/16)",
   "K 4.7 (2/16)",
   "A1c 7.6% (2/16)",
   "LDL 78 mg/dL (2/16)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_82",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-07-07 08:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/79, pulse 65, wt 190 lb",
   "eGFR 88 (today)",
   "K 4.7 (today)",
   "UACR 385 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-07-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_90",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-11-07 13:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 119/75, pulse 79, wt 188 lb",
   "eGFR 89 (11/1)",
   "K 4.3 (11/1)",
   "A1c 7.8% (11/1)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-11-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_96",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-05-03 14:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/76, pulse 84, wt 189 lb",
   "eGFR 87 (today)",
   "K 4.4 (today)",
   "A1c 8% (today)",
   "LDL 83 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-05-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_110",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-15 10:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/77, pulse 65, wt 187 lb",
   "eGFR 83 (10/11)",
   "K 4.5 (10/11)",
   "UACR 439 mg/g (10/11)",
   "A1c 7.7% (10/11)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-10-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_121",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-03-13 12:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/74, pulse 63, wt 187 lb",
   "eGFR 83 (today)",
   "K 4.5 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-03-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_128",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-07-30 11:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/74, pulse 88, wt 186 lb",
   "eGFR 83 (today)",
   "K 4.2 (today)",
   "UACR 423 mg/g (today)",
   "A1c 7.7% (today)",
   "LDL 55 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-07-30 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_147/0",
  "kind": "Medication event comment",
  "when": "2026-01-12 14:06",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_139",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-01-12 13:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 124/77, pulse 67, wt 185 lb",
   "eGFR 84 (1/9)",
   "K 4.4 (1/9)",
   "UACR 469 mg/g (1/9)",
   "A1c 8.2% (1/9)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_148",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-07-02 12:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/79, pulse 68, wt 186 lb",
   "eGFR 82 (today)",
   "K 4.9 (today)",
   "A1c 7.2% (today)",
   "LDL 87 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
