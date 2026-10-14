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
  "key": "B/med/m_19/0",
  "kind": "Medication event comment",
  "when": "2020-04-27 13:31",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.7, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.7, CKD)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2020-04-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-04-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-04-27 13:42",
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
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2020-04-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-04-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-04-27 13:42",
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
   "onset 2016-08",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2020-04-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-04-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-04-27 13:42",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2020-04-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-04-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-04-27 13:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.7, CKD)"
  ],
  "context": [
   "BP 145/84, repeat 141/80, pulse 64, wt 196 lb",
   "eGFR 44 (today)",
   "K 4.9 (today)",
   "A1c 8.7% (today)",
   "LDL 98 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2020-04-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-04-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_28/0",
  "kind": "Medication event comment",
  "when": "2020-09-23 10:21",
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
   "semaglutide: not started by 2020-09-23 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-09-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-09-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_27/0",
  "kind": "Problem list comment",
  "when": "2020-09-23 10:32",
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
   "onset 2020-09-23",
   "supporting result: eGFR 44 (4/27)",
   "supporting result: eGFR 42 (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-23 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-09-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-09-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-09-23 10:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 150/85, pulse 70, wt 194 lb",
   "eGFR 42 (today)",
   "K 4.7 (today)",
   "A1c 7.7% (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-23 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-09-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-09-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-03-16 12:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/88, pulse 66, wt 198 lb",
   "eGFR 42 (today)",
   "K 4.5 (today)",
   "UACR 71 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-03-16 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2021-03-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-03-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_153/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-07-27 10:35",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 45, UACR 77 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-07-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2021-07-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-07-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_36",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-07-27 09:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/81, pulse 86, wt 196 lb",
   "eGFR 43 (7/25)",
   "K 4.4 (7/25)",
   "UACR 72 mg/g (7/25)",
   "A1c 8% (7/25)",
   "LDL 67 mg/dL (7/25)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-07-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2021-07-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-07-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_54/0",
  "kind": "Medication event comment",
  "when": "2021-12-14 15:36",
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
   "insulin glargine: not started by 2021-12-14 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-12-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-12-14 15:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "context": [
   "BP 136/80, pulse 75, wt 193 lb",
   "eGFR 40 (12/11)",
   "K 4.9 (12/11)",
   "A1c 8.2% (12/11)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-12-14 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-12-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-04-19 11:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/79, pulse 79, wt 193 lb",
   "eGFR 41 (4/15)",
   "K 4.6 (4/15)",
   "A1c 7.4% (4/15)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-04-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-04-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-15 12:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/80, pulse 79, wt 197 lb",
   "eGFR 40 (9/9)",
   "K 4.6 (9/9)",
   "A1c 7.8% (9/9)",
   "LDL 110 mg/dL (9/9)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-09-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-09-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_77/0",
  "kind": "Medication event comment",
  "when": "2023-02-28 11:06",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.6"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.6)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-02-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-02-28 10:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.6)"
  ],
  "context": [
   "BP 136/89, pulse 78, wt 197 lb",
   "eGFR 40 (today)",
   "K 4.8 (today)",
   "A1c 8.6% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-02-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_78",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-08-21 08:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/80, pulse 64, wt 194 lb",
   "eGFR 42 (8/15)",
   "K 4.7 (8/15)",
   "UACR 115 mg/g (8/15)",
   "A1c 7.5% (8/15)",
   "LDL 79 mg/dL (8/15)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-08-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_90",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-01-11 10:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/80, pulse 66, wt 194 lb",
   "eGFR 39 (today)",
   "K 4.6 (today)",
   "UACR 163 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-01-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_101",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-05-22 10:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/90, pulse 68, wt 195 lb",
   "eGFR 39 (today)",
   "K 4.4 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-05-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_107",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-10-23 09:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/79, pulse 73, wt 196 lb",
   "eGFR 38 (10/17)",
   "K 5 (10/17)",
   "UACR 229 mg/g (10/17)",
   "A1c 7.6% (10/17)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-10-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_118",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-22 15:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 151/88, pulse 80, wt 196 lb",
   "eGFR 36 (today)",
   "K 5 (today)",
   "UACR 212 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-04-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_137/0",
  "kind": "Medication event comment",
  "when": "2025-09-16 08:51",
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
  "key": "B/visit/e_126",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-09-16 08:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/87, pulse 83, wt 195 lb",
   "eGFR 34 (today)",
   "K 4.9 (today)",
   "A1c 8.3% (today)",
   "LDL 91 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_138",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-03-05 10:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/76, pulse 70, wt 197 lb",
   "eGFR 35 (today)",
   "K 4.7 (today)",
   "UACR 227 mg/g (today)",
   "A1c 8.9% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_145",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-07-28 13:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/84, pulse 83, wt 198 lb",
   "eGFR 34 (today)",
   "K 5 (today)",
   "UACR 244 mg/g (today)",
   "A1c 8.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
