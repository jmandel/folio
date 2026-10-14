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
  "when": "2020-02-13 10:02",
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
   "onset 2014-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-02-13 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-02-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2020-02-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-02-13 10:02",
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
   "onset 2009",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-02-13 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-02-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2020-02-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-02-13 10:02",
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
   "onset 2006",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-02-13 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-02-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2020-02-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-02-13 09:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/83, repeat 139/81, pulse 71, wt 243 lb",
   "eGFR 90 (2/8)",
   "K 4.2 (2/8)",
   "UACR 645 mg/g (2/8)",
   "A1c 7.1% (2/8)",
   "LDL 124 mg/dL (2/8)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-02-13 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-02-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2020-02-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2020-11-02 14:36",
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
   "chlorthalidone: not started by 2020-11-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-11-02 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-11-02 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2020-11-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-11-02 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/82, repeat 141/78, pulse 75, wt 241 lb",
   "eGFR 92 (10/28)",
   "K 4.4 (10/28)",
   "A1c 7.1% (10/28)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-11-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-11-02 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-11-02 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2020-11-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2021-08-24 12:31",
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
   "chlorthalidone: not started by 2021-08-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2021-08-24 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2021-08-24 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2021-08-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-08-24 12:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 152/82, repeat 150/80, pulse 73, wt 244 lb",
   "eGFR 93 (8/22)",
   "K 4.6 (8/22)",
   "UACR 492 mg/g (8/22)",
   "A1c 7.5% (8/22)",
   "LDL 142 mg/dL (8/22)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-08-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2021-08-24 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2021-08-24 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2021-08-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_41/0",
  "kind": "Medication event comment",
  "when": "2022-06-13 13:21",
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
   "losartan: not started by 2022-06-13 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2022-06-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2022-06-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_34",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-06-13 13:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/89, repeat 132/89, pulse 76, wt 240 lb",
   "eGFR 89 (6/9)",
   "K 4.4 (6/9)",
   "A1c 7.2% (6/9)"
  ],
  "forbidden": [
   "losartan: not started by 2022-06-13 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2022-06-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2022-06-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_170",
  "kind": "Chart correction comment",
  "when": "2022-07-07 08:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The amlodipine 10 mg start entered 2022-07-06 was entry error"
  ],
  "context": [
   "amlodipine: entered in error today (entry error)",
   "amlodipine 5 mg daily"
  ],
  "forbidden": [
   "losartan: not started by 2022-07-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2022-07-07 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_168/0",
  "kind": "Allergy list comment",
  "when": "2022-07-18 12:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "lisinopril: angioedema of lips and tongue (allergy)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril allergy: angioedema of lips and tongue"
  ],
  "forbidden": [
   "losartan: not started by 2022-07-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2022-07-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_73/0",
  "kind": "Medication event comment",
  "when": "2022-07-18 12:33",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start amlodipine 10 MG Oral Tablet 10 mg QD; reason: replacing lisinopril (angioedema)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "amlodipine: started 10 mg daily today (replacing lisinopril (angioedema))"
  ],
  "forbidden": [
   "losartan: not started by 2022-07-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2022-07-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/3",
  "kind": "Medication event comment",
  "when": "2022-07-18 12:32",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 40 MG Oral Tablet 40 mg QD; reason: angioedema"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (angioedema)"
  ],
  "forbidden": [
   "losartan: not started by 2022-07-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2022-07-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_169",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2022-07-18 12:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril allergy: angioedema of lips and tongue",
   "lisinopril: stopped today (angioedema)",
   "amlodipine: started 10 mg daily today (replacing lisinopril (angioedema))"
  ],
  "context": [
   "Angioedema"
  ],
  "forbidden": [
   "losartan: not started by 2022-07-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2022-07-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_49/0",
  "kind": "Medication event comment",
  "when": "2023-03-20 09:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start losartan potassium 50 MG Oral Tablet 50 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: started 50 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-03-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_42",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-03-20 08:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: started 50 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 153/95, repeat 146/94, pulse 88, wt 240 lb",
   "eGFR 88 (today)",
   "K 4.4 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-03-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_49/1",
  "kind": "Medication event comment",
  "when": "2023-10-20 09:21",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "dapagliflozin: not started by 2023-10-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-10-20 09:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/92, repeat 141/89, pulse 74, wt 244 lb",
   "eGFR 89 (10/15)",
   "K 4.3 (10/15)",
   "UACR 558 mg/g (10/15)",
   "A1c 7.2% (10/15)",
   "LDL 162 mg/dL (10/15)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-10-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/0",
  "kind": "Medication event comment",
  "when": "2024-06-04 11:36",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-06-04 11:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c above goal)",
   "amlodipine: continued today (BP above goal)"
  ],
  "context": [
   "BP 149/94, repeat 146/91, pulse 74, wt 244 lb",
   "eGFR 88 (today)",
   "K 4.4 (today)",
   "UACR 683 mg/g (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-30 09:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/82, pulse 73, wt 244 lb",
   "eGFR 86 (1/25)",
   "K 4.4 (1/25)",
   "UACR 519 mg/g (1/25)",
   "A1c 7.4% (1/25)",
   "LDL 171 mg/dL (1/25)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_160/0",
  "kind": "Allergy list comment",
  "when": "2025-02-03 08:40",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/1",
  "kind": "Medication event comment",
  "when": "2025-02-03 08:37",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_159",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-02-03 08:15",
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
   "dapagliflozin: stopped today (euglycemic DKA)",
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 122/78, pulse 70, wt 242 lb"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-09-22 10:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/76, pulse 66, wt 245 lb",
   "eGFR 86 (today)",
   "K 4.7 (today)",
   "UACR 562 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "nf_127 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-05-29 12:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/79, pulse 64, wt 242 lb",
   "eGFR 84 (today)",
   "K 4.1 (today)",
   "UACR 750 mg/g (today)",
   "A1c 8% (today)",
   "LDL 111 mg/dL (today)"
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
