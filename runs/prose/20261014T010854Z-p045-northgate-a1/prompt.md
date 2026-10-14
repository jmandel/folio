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

## Requests (28)

```json
[
 {
  "key": "B/med/m_18/0",
  "kind": "Medication event comment",
  "when": "2020-11-17 09:41",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.2, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.2, CKD)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-11-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-11-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-11-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-11-17 09:52",
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
   "onset 2013-06-15",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-11-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-11-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-11-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-11-17 09:52",
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
   "onset 2009",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-11-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-11-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-11-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-11-17 09:52",
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
   "onset 2014-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-11-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-11-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-11-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-11-17 09:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.2, CKD)"
  ],
  "context": [
   "BP 143/87, repeat 140/86, pulse 64, wt 163 lb",
   "eGFR 49 (today)",
   "K 4.6 (today)",
   "A1c 8.2% (today)",
   "LDL 90 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-11-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-11-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-11-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_25/0",
  "kind": "Problem list comment",
  "when": "2021-03-31 16:12",
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
   "onset 2021-03-31",
   "supporting result: eGFR 49 (11/17/20)",
   "supporting result: eGFR 47 (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-03-31 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-03-31 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-03-31 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-03-31 15:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/84, pulse 80, wt 164 lb",
   "eGFR 47 (today)",
   "K 4.1 (today)",
   "A1c 7.3% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-03-31 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-03-31 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-03-31 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2021-08-30 12:41",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 45"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 45)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-08-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-08-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-08-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_134/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-08-30 13:05",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 45, UACR 150 mg/g: CKD evaluation and management"
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
   "chlorthalidone: not started by 2021-08-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-08-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-08-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_26",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-08-30 12:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 45)"
  ],
  "context": [
   "BP 143/87, repeat 141/87, pulse 85, wt 164 lb",
   "eGFR 46 (8/28)",
   "K 4.7 (8/28)",
   "UACR 166 mg/g (8/28)",
   "A1c 7.6% (8/28)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-08-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-08-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-08-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_142",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2021-10-25 09:58",
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
   "chlorthalidone: not started by 2021-10-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-10-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2022-02-17 10:21",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change losartan potassium 100 MG Oral Tablet 100 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-02-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-02-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_34",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-02-17 10:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/89, pulse 69, wt 167 lb",
   "eGFR 47 (2/12)",
   "K 4.5 (2/12)",
   "UACR 160 mg/g (2/12)",
   "A1c 7.3% (2/12)",
   "LDL 68 mg/dL (2/12)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-02-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-02-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_51/0",
  "kind": "Medication event comment",
  "when": "2022-07-11 10:51",
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
   "insulin glargine: not started by 2022-07-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-07-11 10:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/93, repeat 136/93, pulse 66, wt 164 lb",
   "eGFR 44 (7/7)",
   "K 4.5 (7/7)",
   "A1c 7.5% (7/7)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-07-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-12-28 08:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/77, pulse 63, wt 164 lb",
   "eGFR 44 (today)",
   "K 4.8 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-12-28 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/0",
  "kind": "Medication event comment",
  "when": "2023-06-20 14:06",
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
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-20 13:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 133/84, pulse 75, wt 165 lb",
   "eGFR 45 (today)",
   "K 4.7 (today)",
   "UACR 168 mg/g (today)",
   "A1c 8.2% (today)",
   "LDL 90 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-11-13 08:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/85, pulse 64, wt 165 lb",
   "eGFR 41 (11/11)",
   "K 4.5 (11/11)",
   "A1c 7% (11/11)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-03-27 12:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/75, pulse 87, wt 160 lb",
   "eGFR 40 (today)",
   "K 4.7 (today)",
   "UACR 174 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-07-30 14:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/89, pulse 75, wt 165 lb",
   "eGFR 40 (today)",
   "K 4.7 (today)",
   "UACR 181 mg/g (today)",
   "A1c 7.6% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_96",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-12-24 09:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/75, pulse 82, wt 164 lb",
   "eGFR 37 (today)",
   "K 4.7 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-06-12 09:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/80, pulse 68, wt 161 lb",
   "eGFR 38 (today)",
   "K 4.6 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_108",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-10-20 12:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/75, pulse 73, wt 165 lb",
   "eGFR 38 (10/15)",
   "K 4.6 (10/15)",
   "A1c 7.5% (10/15)",
   "LDL 75 mg/dL (10/15)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_121",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-03-30 15:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/81, pulse 74, wt 161 lb",
   "eGFR 33 (today)",
   "K 4.6 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/1",
  "kind": "Medication event comment",
  "when": "2026-08-21 12:06",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_25/1",
  "kind": "Problem list comment",
  "when": "2026-08-21 12:18",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2021-03-31",
   "supporting result: eGFR 33 (3/30)",
   "supporting result: eGFR 35 (today)",
   "supporting result: UACR 234 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_127",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-08-21 11:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 136/82, pulse 79, wt 167 lb",
   "eGFR 35 (today)",
   "K 4.4 (today)",
   "UACR 234 mg/g (today)",
   "A1c 8.1% (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
