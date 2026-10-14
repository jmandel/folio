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
  "key": "B/med/m_50/0",
  "kind": "Medication event comment",
  "when": "2021-10-18 10:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: CKD + DM, cardiorenal benefit"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "forbidden": [
   "lisinopril: not started by 2021-10-18 (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "hydrochlorothiazide: not started by 2021-10-18 (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: not started by 2021-10-18 (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: not started by 2021-10-18 (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "carvedilol: not started by 2021-10-18 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: not started by 2021-10-18 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: not started by 2021-10-18 (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "losartan: not started by 2021-10-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_93/0",
  "kind": "Allergy list comment",
  "when": "2022-12-28 15:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "empagliflozin: euglycemic diabetic ketoacidosis (adverse-reaction)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "forbidden": [
   "lisinopril: not started by 2022-12-28 (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "hydrochlorothiazide: not started by 2022-12-28 (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: not started by 2022-12-28 (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: not started by 2022-12-28 (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "carvedilol: not started by 2022-12-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: not started by 2022-12-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: not started by 2022-12-28 (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "losartan: not started by 2022-12-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_50/1",
  "kind": "Medication event comment",
  "when": "2022-12-28 15:37",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop empagliflozin 10 MG Oral Tablet 10 mg QD; reason: euglycemic DKA"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: stopped today (euglycemic DKA)"
  ],
  "forbidden": [
   "lisinopril: not started by 2022-12-28 (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "hydrochlorothiazide: not started by 2022-12-28 (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: not started by 2022-12-28 (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: not started by 2022-12-28 (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "carvedilol: not started by 2022-12-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: not started by 2022-12-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: not started by 2022-12-28 (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "losartan: not started by 2022-12-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_96/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2022-12-28 16:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 46, UACR 122 mg/g: CKD evaluation and management"
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
   "lisinopril: not started by 2022-12-28 (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "hydrochlorothiazide: not started by 2022-12-28 (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: not started by 2022-12-28 (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: not started by 2022-12-28 (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "carvedilol: not started by 2022-12-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: not started by 2022-12-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: not started by 2022-12-28 (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "losartan: not started by 2022-12-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2022-12-28 15:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed."
   }
  ],
  "mustInclude": [
   "empagliflozin: stopped today (euglycemic DKA)",
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 158/78, repeat 153/75, pulse 88, wt 166 lb"
  ],
  "forbidden": [
   "lisinopril: not started by 2022-12-28 (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "hydrochlorothiazide: not started by 2022-12-28 (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: not started by 2022-12-28 (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: not started by 2022-12-28 (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "carvedilol: not started by 2022-12-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: not started by 2022-12-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: not started by 2022-12-28 (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "losartan: not started by 2022-12-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2024-02-19 16:12",
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
   "onset 2013"
  ],
  "forbidden": [
   "losartan: not started by 2024-02-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2024-02-19 16:12",
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
   "onset 2016"
  ],
  "forbidden": [
   "losartan: not started by 2024-02-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2024-02-19 16:12",
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
   "onset 2020-08-19"
  ],
  "forbidden": [
   "losartan: not started by 2024-02-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2024-02-19 16:12",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Heart failure with reduced ejection fraction\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Heart failure with reduced ejection fraction",
   "onset 2021"
  ],
  "forbidden": [
   "losartan: not started by 2024-02-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_12",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2024-02-19 15:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 113/70, pulse 69, wt 167 lb",
   "eGFR 42 (today)",
   "K 5.2 (today)",
   "A1c 6.7% (today)",
   "LDL 73 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2024-02-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_28/0",
  "kind": "Problem list comment",
  "when": "2024-10-29 12:52",
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
   "onset 2024-10-29",
   "supporting result: eGFR 44 (10/14)",
   "supporting result: eGFR 42 (today)",
   "supporting result: UACR 133 mg/g (10/14)"
  ],
  "forbidden": [
   "losartan: not started by 2024-10-29 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-10-29 12:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/70, pulse 87, wt 166 lb",
   "eGFR 42 (today)",
   "K 4.9 (today)",
   "A1c 6.8% (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "losartan: not started by 2024-10-29 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_41/0",
  "kind": "Allergy list comment",
  "when": "2025-08-05 10:13",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2025-08-05 10:11",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "losartan: not started by 2025-08-05 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2025-08-05 10:12",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-08-05 09:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 119/72, pulse 78, wt 166 lb",
   "eGFR 44 (today)",
   "K 5 (today)",
   "UACR 175 mg/g (today)",
   "A1c 6.5% (today)",
   "LDL 86 mg/dL (today)"
  ],
  "forbidden": [
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_43",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-06-08 12:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 112/62, pulse 85, wt 163 lb",
   "eGFR 43 (today)",
   "K 4.6 (today)",
   "A1c 6.4% (today)"
  ],
  "forbidden": [
   "nf_71 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
