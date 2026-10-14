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

## Requests (20)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-10-15 14:22",
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
   "onset 2005",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-10-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-10-15 14:22",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-10-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-10-15 14:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2019-10-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-10-15 14:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-10-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-10-15 13:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 149/88, pulse 74, wt 229 lb",
   "eGFR 71 (10/13)",
   "K 4.1 (10/13)",
   "A1c 6.7% (10/13)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-10-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2020-07-13 15:31",
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
   "chlorthalidone: not started by 2020-07-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-07-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_15",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-07-13 15:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 155/94, repeat 148/90, pulse 86, wt 226 lb",
   "eGFR 70 (7/9)",
   "K 4.4 (7/9)",
   "A1c 6.6% (7/9)",
   "LDL 158 mg/dL (7/9)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-07-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-07-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_32/0",
  "kind": "Medication event comment",
  "when": "2021-03-04 13:11",
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
   "amlodipine: not started by 2021-03-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-03-04 12:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/87, repeat 145/86, pulse 73, wt 225 lb",
   "eGFR 68 (2/28)",
   "K 4.3 (2/28)",
   "UACR 77 mg/g (2/28)",
   "A1c 6.8% (2/28)"
  ],
  "forbidden": [
   "amlodipine: not started by 2021-03-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_44/0",
  "kind": "Medication event comment",
  "when": "2021-11-29 12:31",
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
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-11-29 12:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/85, repeat 139/84, pulse 63, wt 225 lb",
   "eGFR 71 (11/23)",
   "K 4.1 (11/23)",
   "A1c 6.8% (11/23)",
   "LDL 134 mg/dL (11/23)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-20 12:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/80, repeat 137/78, pulse 84, wt 229 lb",
   "eGFR 70 (today)",
   "K 4.3 (today)",
   "UACR 59 mg/g (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-12 15:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/80, pulse 85, wt 230 lb",
   "eGFR 69 (5/9)",
   "K 4.3 (5/9)",
   "A1c 6.9% (5/9)",
   "LDL 144 mg/dL (5/9)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-02-21 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/76, pulse 79, wt 228 lb",
   "eGFR 69 (today)",
   "K 4.2 (today)",
   "UACR 65 mg/g (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-10-29 10:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/81, pulse 88, wt 227 lb",
   "eGFR 68 (today)",
   "K 4.6 (today)",
   "A1c 7.1% (today)",
   "LDL 112 mg/dL (today)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_150/0",
  "kind": "Allergy list comment",
  "when": "2025-01-14 15:25",
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
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2025-01-14 15:22",
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
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_149",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-01-14 15:00",
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
   "BP 138/78, pulse 80, wt 227 lb"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-06-24 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/81, pulse 88, wt 225 lb",
   "eGFR 68 (today)",
   "K 4.4 (today)",
   "UACR 78 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_95",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-03-20 15:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/71, pulse 81, wt 228 lb",
   "eGFR 67 (today)",
   "K 4.4 (today)",
   "A1c 6.9% (today)",
   "LDL 145 mg/dL (today)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
