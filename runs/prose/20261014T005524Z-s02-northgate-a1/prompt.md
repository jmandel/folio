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
  "when": "2020-02-18 12:17",
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
   "onset 2012-04",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-02-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2020-02-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-02-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-02-18 12:17",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-02-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2020-02-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-02-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-02-18 11:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/76, pulse 62, wt 139 lb",
   "eGFR 56 (today)",
   "K 4.3 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-02-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2020-02-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-02-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_22/0",
  "kind": "Problem list comment",
  "when": "2020-10-19 16:25",
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
   "onset 2020-10-19",
   "supporting result: eGFR 56 (2/18)",
   "supporting result: eGFR 57 (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-10-19 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2020-10-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-10-19 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_13",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-10-23 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/77, pulse 67, wt 134 lb",
   "eGFR 57 (10/19)",
   "K 4.6 (10/19)",
   "A1c 7.5% (10/19)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-10-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2020-10-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-10-23 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_32/0",
  "kind": "Medication event comment",
  "when": "2021-07-29 14:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "losartan: not started by 2021-07-29 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2021-07-29 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-07-29 14:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "BP 116/62, pulse 85, wt 137 lb",
   "eGFR 53 (7/27)",
   "K 4.4 (7/27)",
   "A1c 7.8% (7/27)"
  ],
  "forbidden": [
   "losartan: not started by 2021-07-29 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2021-07-29 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_42/0",
  "kind": "Allergy list comment",
  "when": "2022-03-25 14:13",
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
   "semaglutide: not started by 2022-03-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/1",
  "kind": "Medication event comment",
  "when": "2022-03-25 14:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 10 MG Oral Tablet 10 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "losartan: not started by 2022-03-25 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2022-03-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_41/0",
  "kind": "Medication event comment",
  "when": "2022-03-25 14:12",
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
   "semaglutide: not started by 2022-03-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-03-25 13:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 130/71, pulse 72, wt 136 lb",
   "eGFR 53 (today)",
   "K 4.2 (today)",
   "UACR 10 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-03-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_44",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-11-28 14:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/77, pulse 68, wt 137 lb",
   "eGFR 53 (today)",
   "K 4.6 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-11-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_140/0",
  "kind": "Allergy list comment",
  "when": "2023-03-07 14:55",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "semaglutide: not started by 2023-03-07 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_32/1",
  "kind": "Medication event comment",
  "when": "2023-03-07 14:52",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "semaglutide: not started by 2023-03-07 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_139",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2023-03-07 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: stopped today (euglycemic DKA)",
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 132/78, pulse 65, wt 138 lb"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-03-07 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_57/0",
  "kind": "Medication event comment",
  "when": "2023-07-26 15:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.3)"
  ],
  "forbidden": [
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-07-26 15:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.3)"
  ],
  "context": [
   "BP 129/80, pulse 84, wt 135 lb",
   "eGFR 54 (7/24)",
   "K 4.4 (7/24)",
   "A1c 8.3% (7/24)"
  ],
  "forbidden": [
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_58",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-05-08 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/72, pulse 86, wt 136 lb",
   "eGFR 52 (5/3)",
   "K 4.5 (5/3)",
   "A1c 7.5% (5/3)"
  ],
  "forbidden": [
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-30 15:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/90, pulse 82, wt 139 lb",
   "eGFR 51 (today)",
   "K 4.5 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-14 13:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/70, pulse 80, wt 142 lb",
   "eGFR 48 (today)",
   "K 4.2 (today)",
   "UACR 15 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_81",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-05-07 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/71, pulse 77, wt 143 lb",
   "eGFR 50 (5/3)",
   "K 4.3 (5/3)",
   "A1c 7% (5/3)"
  ],
  "forbidden": [
   "nf_107 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
