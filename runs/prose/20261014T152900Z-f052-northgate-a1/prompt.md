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
  "when": "2020-11-27 15:12",
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
   "onset 2008",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-11-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-11-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-11-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-11-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-11-27 15:12",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-11-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-11-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-11-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-11-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-11-27 15:12",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-11-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-11-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-11-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-11-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-11-27 15:12",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-11-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-11-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-11-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-11-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2020-11-27 15:12",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-11-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-11-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-11-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-11-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-11-27 14:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 153/93, pulse 83, wt 204 lb",
   "eGFR 67 (today)",
   "K 4.3 (today)",
   "A1c 7.2% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-11-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-11-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-11-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-11-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-05-03 10:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/87, pulse 72, wt 203 lb",
   "eGFR 65 (4/29)",
   "K 5.9 (4/29), hemolyzed",
   "UACR 79 mg/g (4/29)",
   "A1c 7.1% (4/29)",
   "K 4.8 (4/29)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-05-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2021-05-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-05-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-05-03 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-10-18 11:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 147/87, pulse 81, wt 201 lb",
   "eGFR 66 (today)",
   "K 4.4 (today)",
   "A1c 6.7% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-10-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2021-10-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-10-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-10-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-04-15 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/77, pulse 75, wt 204 lb",
   "eGFR 64 (4/9)",
   "K 4.3 (4/9)",
   "UACR 63 mg/g (4/9)",
   "A1c 6.9% (4/9)",
   "LDL 63 mg/dL (4/9)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-04-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2022-04-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-04-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-04-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-02 09:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/93, repeat 142/91, pulse 70, wt 203 lb",
   "eGFR 62 (8/27)",
   "K 4.6 (8/27)",
   "A1c 6.9% (8/27)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-09-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2022-09-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-09-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-09-02 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2023-01-31 11:01",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "insulin glargine: not started by 2023-01-31 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2023-01-31 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-31 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-01-31 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_58",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-01-31 10:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/91, repeat 146/90, pulse 88, wt 204 lb",
   "eGFR 63 (1/29)",
   "K 4.3 (1/29)",
   "UACR 110 mg/g (1/29)",
   "A1c 7.6% (1/29)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-01-31 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2023-01-31 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-31 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-01-31 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2023-06-27 08:41",
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
   "insulin glargine: not started by 2023-06-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2023-06-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-06-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-06-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_65",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-27 08:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/84, pulse 80, wt 203 lb",
   "eGFR 62 (today)",
   "K 4.2 (today)",
   "A1c 7.9% (today)",
   "LDL 95 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-06-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2023-06-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-06-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-06-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_83/0",
  "kind": "Medication event comment",
  "when": "2023-11-20 12:12",
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
   "amlodipine: not started by 2023-11-20 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-11-20 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_82/0",
  "kind": "Medication event comment",
  "when": "2023-11-20 12:11",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-11-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-20 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-11-20 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_76",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-20 11:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/87, repeat 141/85, pulse 78, wt 205 lb",
   "eGFR 63 (11/17)",
   "K 4.5 (11/17)",
   "A1c 8.3% (11/17)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-11-20 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-11-20 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-04-25 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/85, pulse 67, wt 200 lb",
   "eGFR 61 (today)",
   "K 4.2 (today)",
   "UACR 150 mg/g (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-04-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2024-04-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_94",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-08-27 11:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/83, pulse 62, wt 203 lb",
   "eGFR 58 (today)",
   "K 4.7 (today)",
   "UACR 118 mg/g (today)",
   "A1c 6.9% (today)",
   "LDL 123 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-08-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2024-08-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_115/0",
  "kind": "Problem list comment",
  "when": "2025-02-04 16:25",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2025-02-04",
   "supporting result: eGFR 58 (8/27/24)",
   "supporting result: eGFR 55 (today)",
   "supporting result: UACR 142 mg/g (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-02-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2025-02-04 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_116/0",
  "kind": "Medication event comment",
  "when": "2025-02-06 14:51",
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
   "finerenone: not started by 2025-02-06 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_105",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-02-06 14:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 156/97, pulse 69, wt 206 lb",
   "eGFR 55 (2/4)",
   "K 4.4 (2/4)",
   "UACR 142 mg/g (2/4)",
   "A1c 6.6% (2/4)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "finerenone: not started by 2025-02-06 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_117",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-07-16 09:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/81, pulse 79, wt 205 lb",
   "eGFR 52 (today)",
   "K 4.6 (today)",
   "UACR 151 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2025-07-16 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_127",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-11-17 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/79, pulse 72, wt 199 lb",
   "eGFR 47 (11/14)",
   "K 4.4 (11/14)",
   "UACR 111 mg/g (11/14)",
   "A1c 7.1% (11/14)"
  ],
  "forbidden": [
   "finerenone: not started by 2025-11-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_148/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2026-05-07 14:35",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 45, UACR 181 mg/g: CKD evaluation and management"
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
   "finerenone: not started by 2026-05-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_134",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-05-07 13:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/88, pulse 74, wt 203 lb",
   "eGFR 45 (today)",
   "K 4.5 (today)",
   "UACR 181 mg/g (today)",
   "A1c 7.1% (today)",
   "LDL 102 mg/dL (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2026-05-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_156",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2026-07-20 15:26",
  "author": "Nina Ortiz, RN (Registered nurse)",
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
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
