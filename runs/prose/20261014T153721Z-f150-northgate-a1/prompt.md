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
  "when": "2020-06-23 11:32",
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
   "insulin glargine: not started by 2020-06-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2020-06-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-06-23 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-06-23 11:32",
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
   "onset 2019-12-24",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-06-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2020-06-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-06-23 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-06-23 11:32",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-06-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2020-06-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-06-23 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-06-23 11:32",
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
   "insulin glargine: not started by 2020-06-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2020-06-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-06-23 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-06-23 11:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/77, pulse 69, wt 237 lb",
   "eGFR 49 (today)",
   "K 4.2 (today)",
   "A1c 6.9% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-06-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2020-06-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-06-23 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_28/0",
  "kind": "Problem list comment",
  "when": "2021-04-14 16:02",
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
   "onset 2021-04-14",
   "supporting result: eGFR 49 (6/23/20)",
   "supporting result: eGFR 48 (today)",
   "supporting result: UACR 14 mg/g (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-04-14 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2021-04-14 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2021-04-14 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-04-14 15:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/72, pulse 65, wt 233 lb",
   "eGFR 48 (today)",
   "K 4.3 (today)",
   "UACR 14 mg/g (today)",
   "A1c 7.6% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-04-14 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2021-04-14 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2021-04-14 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-01-20 15:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/80, pulse 75, wt 235 lb",
   "eGFR 47 (today)",
   "K 4 (today)",
   "UACR 12 mg/g (today)",
   "A1c 7.7% (today)",
   "LDL 92 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-01-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-01-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2022-01-20 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_55/0",
  "kind": "Medication event comment",
  "when": "2022-08-30 13:11",
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
  "forbidden": [
   "dapagliflozin: not started by 2022-08-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2022-08-30 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_44",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-08-30 12:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 125/86, pulse 76, wt 236 lb",
   "eGFR 47 (today)",
   "K 4.5 (today)",
   "UACR 16 mg/g (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-08-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2022-08-30 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/0",
  "kind": "Medication event comment",
  "when": "2023-04-14 14:06",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: CKD + DM, cardiorenal benefit"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "forbidden": [
   "naproxen: not started by 2023-04-14 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_186/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2023-04-14 14:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 47, UACR 14 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus"
  ],
  "forbidden": [
   "naproxen: not started by 2023-04-14 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-04-14 13:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "BP 126/78, pulse 72, wt 239 lb",
   "eGFR 47 (today)",
   "K 4.5 (today)",
   "A1c 7.4% (today)",
   "LDL 107 mg/dL (today)"
  ],
  "forbidden": [
   "naproxen: not started by 2023-04-14 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_183/0",
  "kind": "Allergy list comment",
  "when": "2023-11-02 11:55",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "dapagliflozin: euglycemic diabetic ketoacidosis (adverse-reaction)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "forbidden": [
   "naproxen: not started by 2023-11-02 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/1",
  "kind": "Medication event comment",
  "when": "2023-11-02 11:52",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: euglycemic DKA"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: stopped today (euglycemic DKA)"
  ],
  "forbidden": [
   "naproxen: not started by 2023-11-02 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_182",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2023-11-02 11:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed."
   }
  ],
  "mustInclude": [
   "dapagliflozin: stopped today (euglycemic DKA)",
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 120/78, pulse 77, wt 238 lb"
  ],
  "forbidden": [
   "naproxen: not started by 2023-11-02 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2024-01-02 12:31",
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
   "naproxen: not started by 2024-01-02 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-01-02 12:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 45)"
  ],
  "context": [
   "BP 131/75, pulse 72, wt 235 lb",
   "eGFR 45 (today)",
   "K 4 (today)",
   "UACR 15 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "naproxen: not started by 2024-01-02 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_78",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-29 09:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/86, pulse 86, wt 235 lb",
   "eGFR 46 (today)",
   "K 4.7 (today)",
   "UACR 19 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 108 mg/dL (today)"
  ],
  "forbidden": [
   "naproxen: not started by 2024-07-29 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-03-18 10:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/83, pulse 75, wt 238 lb",
   "eGFR 41 (today)",
   "K 4.4 (today)",
   "UACR 16 mg/g (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "naproxen: not started by 2025-03-18 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-10-28 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/78, pulse 85, wt 232 lb",
   "eGFR 44 (10/24)",
   "K 6.2 (10/24), hemolyzed",
   "UACR 23 mg/g (10/24)",
   "A1c 7% (10/24)",
   "LDL 126 mg/dL (10/24)",
   "K 4.6 (10/24)"
  ],
  "forbidden": [
   "naproxen: not started by 2025-10-28 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_140 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
