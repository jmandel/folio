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

## Requests (21)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-04-21 16:02",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-04-21 16:02",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-04-21 16:02",
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
   "onset 2018-07-25",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-04-21 16:02",
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
   "onset 2007",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-04-21 15:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/80, pulse 70, wt 212 lb",
   "eGFR 98 (today)",
   "K 3.9 (today)",
   "UACR 62 mg/g (today)",
   "A1c 6.9% (today)",
   "LDL 100 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-03-08 14:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/81, pulse 79, wt 208 lb",
   "eGFR 97 (3/3)",
   "K 4.1 (3/3)",
   "A1c 7.2% (3/3)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-03-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2021-03-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-01-05 09:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/90, repeat 144/90, pulse 75, wt 209 lb",
   "eGFR 97 (1/2)",
   "K 4.6 (1/2)",
   "UACR 67 mg/g (1/2)",
   "A1c 7.7% (1/2)",
   "LDL 123 mg/dL (1/2)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-01-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2022-01-05 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_49/0",
  "kind": "Medication event comment",
  "when": "2022-11-07 10:11",
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
   "dapagliflozin: not started by 2022-11-07 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_39",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-11-07 09:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/79, repeat 136/78, pulse 82, wt 214 lb",
   "eGFR 96 (11/5)",
   "K 4.3 (11/5)",
   "A1c 7.8% (11/5)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-11-07 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-05-31 12:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/73, pulse 69, wt 210 lb",
   "eGFR 97 (5/26)",
   "K 4.4 (5/26)",
   "A1c 7.9% (5/26)",
   "LDL 88 mg/dL (5/26)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-05-31 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_63",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-04-03 15:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/82, pulse 83, wt 210 lb",
   "eGFR 95 (3/30)",
   "K 4.1 (3/30)",
   "A1c 8% (3/30)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-04-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2024-05-03 15:25",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: vomiting, poor oral intake"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: held today (vomiting, poor oral intake); review 2024-05-10"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-05-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2024-05-03 15:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2024-05-10"
  ],
  "context": [],
  "forbidden": [
   "dapagliflozin: not started by 2024-05-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2024-05-09 10:09",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "resume metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: eating and drinking normally"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-05-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_103",
  "kind": "Primary care phone visit note (reason: Phone: feeling better)",
  "when": "2024-05-09 10:05",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "context": [],
  "forbidden": [
   "dapagliflozin: not started by 2024-05-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_69",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-18 14:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/81, pulse 67, wt 211 lb",
   "eGFR 98 (2/14)",
   "K 4.2 (2/14)",
   "UACR 81 mg/g (2/14)",
   "A1c 8% (2/14)",
   "LDL 102 mg/dL (2/14)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2025-02-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_88/0",
  "kind": "Medication event comment",
  "when": "2025-12-04 14:06",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.4)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_81",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-12-04 13:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.4)"
  ],
  "context": [
   "BP 142/85, pulse 73, wt 212 lb",
   "eGFR 97 (12/2)",
   "K 4.3 (12/2)",
   "UACR 75 mg/g (12/2)",
   "A1c 8.4% (12/2)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2026-07-06 15:19",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold losartan potassium 100 MG Oral Tablet 100 mg QD; reason: K 5.9 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: held today (K 5.9 confirmed on repeat); review 2026-07-20"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_89",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-07-06 11:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/78, pulse 68, wt 210 lb",
   "eGFR 97 (today)",
   "K 4.5 (today)",
   "A1c 7.5% (today)",
   "LDL 116 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_109",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2026-07-06 15:13",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: held today (K 5.9 confirmed on repeat); review 2026-07-20"
  ],
  "context": [
   "K 5.9 (today)",
   "K 5.7 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
