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
  "when": "2021-10-06 13:42",
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
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-10-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2021-10-06 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-10-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-10-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-10-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2021-10-06 13:42",
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
   "onset 2011-05",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-10-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2021-10-06 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-10-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-10-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-10-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2021-10-06 13:42",
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
   "onset 2011-05-14",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-10-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2021-10-06 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-10-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-10-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-10-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2021-10-06 13:42",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-10-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2021-10-06 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-10-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-10-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-10-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2021-10-06 13:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/81, pulse 78, wt 233 lb",
   "eGFR 52 (10/1)",
   "K 4.4 (10/1)",
   "UACR 147 mg/g (10/1)",
   "A1c 7.4% (10/1)",
   "LDL 71 mg/dL (10/1)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-10-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2021-10-06 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-10-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-10-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-10-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_26/0",
  "kind": "Problem list comment",
  "when": "2022-02-14 11:17",
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
   "onset 2022-02-14",
   "supporting result: eGFR 52 (10/1/21)",
   "supporting result: eGFR 55 (today)",
   "supporting result: UACR 130 mg/g (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-02-14 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2022-02-14 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-02-14 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-02-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-02-14 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-02-14 10:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 147/85, pulse 87, wt 232 lb",
   "eGFR 55 (today)",
   "K 4.6 (today)",
   "UACR 130 mg/g (today)",
   "A1c 7.3% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-02-14 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2022-02-14 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-02-14 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-02-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-02-14 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_37/0",
  "kind": "Medication event comment",
  "when": "2022-07-04 13:01",
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
   "semaglutide: not started by 2022-07-04 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-07-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-07-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-07-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2022-07-04 13:02",
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
   "semaglutide: not started by 2022-07-04 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-07-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-07-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-07-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-07-04 12:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.3, CKD)",
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/82, pulse 76, wt 229 lb",
   "eGFR 52 (today)",
   "K 4.8 (today)",
   "A1c 8.3% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-07-04 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-07-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-07-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-07-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-12-22 14:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/85, pulse 68, wt 235 lb",
   "eGFR 51 (12/20)",
   "K 4.7 (12/20)",
   "A1c 7.3% (12/20)",
   "LDL 92 mg/dL (12/20)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-12-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-12-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-12-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-12-22 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-08 12:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/83, pulse 64, wt 232 lb",
   "eGFR 49 (today)",
   "K 4.3 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-06-08 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2023-06-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-06-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-06-08 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-10-27 12:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 148/92, pulse 80, wt 234 lb",
   "eGFR 53 (today)",
   "K 4 (today)",
   "UACR 264 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-10-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2023-10-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-10-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-10-27 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2024-03-01 15:11",
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
   "semaglutide: not started by 2024-03-01 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2024-03-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-03-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-03-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_65",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-03-01 14:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/93, repeat 143/89, pulse 84, wt 234 lb",
   "eGFR 53 (2/26)",
   "K 4.5 (2/26)",
   "A1c 8% (2/26)",
   "LDL 97 mg/dL (2/26)"
  ],
  "forbidden": [
   "semaglutide: not started by 2024-03-01 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2024-03-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-03-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-03-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_86/0",
  "kind": "Medication event comment",
  "when": "2024-08-08 14:02",
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
   "amlodipine: not started by 2024-08-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-08-08 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_85/0",
  "kind": "Medication event comment",
  "when": "2024-08-08 14:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.7"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.7)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-08-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-08-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-08-08 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_78",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-08-08 13:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.7)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/88, repeat 136/85, pulse 86, wt 233 lb",
   "eGFR 52 (today)",
   "K 4.9 (today)",
   "UACR 387 mg/g (today)",
   "A1c 8.7% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-08-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-08-08 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_93/0",
  "kind": "Medication event comment",
  "when": "2025-01-13 15:06",
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
   "insulin glargine: not started by 2025-01-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_87",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-13 14:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/84, repeat 138/80, pulse 69, wt 231 lb",
   "eGFR 50 (1/11)",
   "K 4.7 (1/11)",
   "A1c 7.8% (1/11)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-01-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_190/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2025-06-23 14:05",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 54, UACR 335 mg/g: CKD evaluation and management"
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
   "insulin glargine: not started by 2025-06-23 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_94",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-06-23 13:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/75, pulse 72, wt 231 lb",
   "eGFR 55 (today)",
   "K 4.5 (today)",
   "A1c 7.6% (today)",
   "LDL 83 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-06-23 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_110/0",
  "kind": "Medication event comment",
  "when": "2025-11-12 14:31",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.5"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.5)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_104",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-11-12 14:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.5)"
  ],
  "context": [
   "BP 126/75, pulse 68, wt 235 lb",
   "eGFR 48 (today)",
   "K 4.9 (today)",
   "A1c 8.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_111",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-03-24 12:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/80, pulse 69, wt 229 lb",
   "eGFR 51 (today)",
   "K 4.5 (today)",
   "UACR 328 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_121",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-07-20 10:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/73, pulse 82, wt 233 lb",
   "eGFR 49 (today)",
   "K 4.5 (today)",
   "UACR 473 mg/g (today)",
   "A1c 7.5% (today)",
   "LDL 92 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
