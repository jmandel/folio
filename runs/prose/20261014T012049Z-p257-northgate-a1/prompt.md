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

## Requests (25)

```json
[
 {
  "key": "B/med/m_21/0",
  "kind": "Medication event comment",
  "when": "2022-02-17 09:31",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 9.5, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 9.5, CKD)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-02-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2022-02-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-02-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-02-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-02-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2022-02-17 09:42",
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
   "onset 2009-03-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-02-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2022-02-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-02-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-02-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-02-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-02-17 09:42",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-02-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2022-02-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-02-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-02-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-02-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-02-17 09:42",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-02-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2022-02-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-02-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-02-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-02-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-02-17 09:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 9.5, CKD)"
  ],
  "context": [
   "BP 143/86, repeat 135/82, pulse 67, wt 185 lb",
   "eGFR 49 (today)",
   "K 4.1 (today)",
   "UACR 69 mg/g (today)",
   "A1c 9.5% (today)",
   "LDL 108 mg/dL (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-02-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2022-02-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-02-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-02-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-02-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_32/0",
  "kind": "Problem list comment",
  "when": "2022-07-03 16:25",
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
   "onset 2022-07-03",
   "supporting result: eGFR 49 (2/17)",
   "supporting result: eGFR 49 (today)",
   "supporting result: UACR 85 mg/g (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-07-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2022-07-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-07-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-07-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-07-03 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2022-07-05 09:21",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "dulaglutide: not started by 2022-07-05 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2022-07-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-07-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-07-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-07-05 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-07-05 09:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/91, pulse 80, wt 186 lb",
   "eGFR 49 (7/3)",
   "K 4.7 (7/3)",
   "UACR 85 mg/g (7/3)",
   "A1c 8.9% (7/3)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-07-05 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2022-07-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-07-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-07-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-07-05 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_42/0",
  "kind": "Medication event comment",
  "when": "2022-12-16 16:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 9"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 9)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-12-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-12-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-12-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-12-16 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2022-12-16 16:02",
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
   "chlorthalidone: not started by 2022-12-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-12-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-12-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-12-16 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-12-16 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 9)",
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/84, pulse 77, wt 182 lb",
   "eGFR 51 (today)",
   "K 4.7 (today)",
   "A1c 9% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-12-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-12-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-12-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-12-16 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_54/0",
  "kind": "Medication event comment",
  "when": "2023-06-05 15:21",
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
   "insulin glargine: not started by 2023-06-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2023-06-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-06-05 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_43",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-05 15:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/91, repeat 145/88, pulse 86, wt 186 lb",
   "eGFR 50 (5/31)",
   "K 4.6 (5/31)",
   "A1c 8.3% (5/31)",
   "LDL 104 mg/dL (5/31)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-06-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2023-06-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-06-05 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_62/0",
  "kind": "Medication event comment",
  "when": "2023-11-30 14:37",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "finerenone: not started by 2023-11-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_61/0",
  "kind": "Medication event comment",
  "when": "2023-11-30 14:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "forbidden": [
   "amlodipine: not started by 2023-11-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-11-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-11-30 14:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.5)",
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/82, pulse 72, wt 183 lb",
   "eGFR 49 (today)",
   "K 4.8 (today)",
   "A1c 8.5% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2023-11-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_63",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-05-08 15:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/78, pulse 68, wt 186 lb",
   "eGFR 50 (today)",
   "K 4.4 (today)",
   "A1c 7.8% (today)",
   "LDL 102 mg/dL (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2024-05-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-09-24 10:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/74, pulse 82, wt 187 lb",
   "eGFR 47 (today)",
   "K 4.5 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2024-09-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2025-01-30 12:36",
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
  "forbidden": [
   "finerenone: not started by 2025-01-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_115/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2025-01-30 13:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 44, UACR 136 mg/g: CKD evaluation and management"
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
   "finerenone: not started by 2025-01-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_83",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-30 12:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "context": [
   "BP 122/71, pulse 64, wt 186 lb",
   "eGFR 44 (1/26)",
   "K 4.9 (1/26)",
   "A1c 7.5% (1/26)"
  ],
  "forbidden": [
   "finerenone: not started by 2025-01-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_123",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2025-04-04 09:24",
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
 },
 {
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-29 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/73, pulse 75, wt 185 lb",
   "eGFR 42 (today)",
   "K 4.2 (today)",
   "UACR 161 mg/g (today)",
   "A1c 7.5% (today)",
   "LDL 105 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-01-14 10:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/75, pulse 80, wt 183 lb",
   "eGFR 41 (1/8)",
   "K 4.5 (1/8)",
   "A1c 9.2% (1/8)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_108",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-05-20 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/66, pulse 81, wt 188 lb",
   "eGFR 44 (today)",
   "K 4.7 (today)",
   "UACR 223 mg/g (today)",
   "A1c 8.6% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
