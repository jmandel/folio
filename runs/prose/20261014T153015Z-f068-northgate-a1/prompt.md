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
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-08-12 10:47",
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
   "onset 2007-03-13",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-08-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-08-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2019-08-12 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-08-12 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-08-12 10:47",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-08-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-08-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2019-08-12 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-08-12 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-08-12 10:47",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-08-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-08-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2019-08-12 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-08-12 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-08-12 10:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/85, pulse 71, wt 169 lb",
   "eGFR 53 (8/6)",
   "K 4.8 (8/6)",
   "A1c 7.4% (8/6)",
   "LDL 76 mg/dL (8/6)"
  ],
  "forbidden": [
   "losartan: not started by 2019-08-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-08-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2019-08-12 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-08-12 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_26/0",
  "kind": "Problem list comment",
  "when": "2020-04-22 16:25",
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
   "onset 2020-04-22",
   "supporting result: eGFR 53 (8/6/19)",
   "supporting result: eGFR 53 (today)"
  ],
  "forbidden": [
   "losartan: not started by 2020-04-22 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-04-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-22 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-04-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_28/0",
  "kind": "Allergy list comment",
  "when": "2020-04-27 11:34",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "lisinopril: dry cough (intolerance)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema)."
  ],
  "context": [
   "lisinopril intolerance: dry cough"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-04-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2020-04-27 11:31",
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
   "losartan: not started by 2020-04-27 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-04-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2020-04-27 11:32",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 20 MG Oral Tablet 20 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "losartan: not started by 2020-04-27 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-04-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_27/0",
  "kind": "Medication event comment",
  "when": "2020-04-27 11:33",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start losartan potassium 50 MG Oral Tablet 50 mg QD; reason: ACE inhibitor cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: started 50 mg daily today (ACE inhibitor cough)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-04-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-04-27 11:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 149/98, pulse 65, wt 174 lb",
   "eGFR 53 (4/22)",
   "K 4.8 (4/22)",
   "A1c 7.2% (4/22)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-04-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-04-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_27/1",
  "kind": "Medication event comment",
  "when": "2020-11-19 15:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2020-11-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-11-19 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-11-19 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_30",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-11-19 15:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/89, repeat 147/86, pulse 73, wt 171 lb",
   "eGFR 50 (today)",
   "K 4.9 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-11-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2020-11-19 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-11-19 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_51/0",
  "kind": "Medication event comment",
  "when": "2021-08-31 13:31",
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
   "dapagliflozin: not started by 2021-08-31 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2021-08-31 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_39",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-08-31 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 144/85, pulse 79, wt 171 lb",
   "eGFR 50 (8/27)",
   "K 4.4 (8/27)",
   "UACR 53 mg/g (8/27)",
   "A1c 7.4% (8/27)",
   "LDL 103 mg/dL (8/27)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-08-31 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2021-08-31 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-05-03 13:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/78, pulse 77, wt 170 lb",
   "eGFR 47 (5/1)",
   "K 4.5 (5/1)",
   "UACR 67 mg/g (5/1)",
   "A1c 7.6% (5/1)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-05-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2022-05-03 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_139/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2023-03-23 13:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 46, UACR 114 mg/g: CKD evaluation and management"
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
   "dapagliflozin: not started by 2023-03-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2023-03-23 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-03-23 12:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/88, repeat 135/84, pulse 77, wt 170 lb",
   "eGFR 48 (3/18)",
   "K 4.6 (3/18)",
   "UACR 79 mg/g (3/18)",
   "A1c 7.9% (3/18)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-03-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2023-03-23 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_147",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2023-05-29 11:08",
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
  "forbidden": [
   "dapagliflozin: not started by 2023-05-29 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_26/1",
  "kind": "Problem list comment",
  "when": "2024-01-08 09:53",
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
   "onset 2020-04-22",
   "supporting result: eGFR 45 (10/16/23)",
   "supporting result: eGFR 43 (today)",
   "supporting result: UACR 75 mg/g (5/23/23)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-01-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_69",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-01-08 09:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/84, pulse 88, wt 170 lb",
   "eGFR 43 (today)",
   "K 4.8 (today)",
   "A1c 7.9% (today)",
   "LDL 96 mg/dL (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-01-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_79",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-07-29 13:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/76, pulse 65, wt 172 lb",
   "eGFR 43 (7/26)",
   "K 4.6 (7/26)",
   "UACR 89 mg/g (7/26)",
   "A1c 7.9% (7/26)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-07-29 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_104/0",
  "kind": "Medication event comment",
  "when": "2025-02-18 09:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.4, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.4, CKD)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_90",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-18 08:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.4, CKD)"
  ],
  "context": [
   "BP 138/82, pulse 74, wt 170 lb",
   "eGFR 40 (today)",
   "K 4.6 (today)",
   "UACR 93 mg/g (today)",
   "A1c 8.4% (today)",
   "LDL 76 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_105",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-10 10:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/83, pulse 86, wt 172 lb",
   "eGFR 42 (today)",
   "K 4.8 (today)",
   "UACR 89 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_112",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-05-26 09:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/77, pulse 85, wt 170 lb",
   "eGFR 39 (5/21)",
   "K 4.4 (5/21)",
   "A1c 7.3% (5/21)",
   "LDL 85 mg/dL (5/21)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
