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
  "when": "2020-09-03 15:32",
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
   "onset 2006",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-09-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2020-09-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-09-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-09-03 15:32",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-09-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2020-09-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-09-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-09-03 15:32",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-09-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2020-09-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-09-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-09-03 15:32",
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
   "onset 2007-05",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-09-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2020-09-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-09-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2020-09-03 15:32",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-09-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2020-09-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-09-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-09-03 15:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 147/84, pulse 73, wt 223 lb",
   "eGFR 68 (8/29)",
   "K 4.5 (8/29)",
   "A1c 6.5% (8/29)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-09-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2020-09-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-09-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2021-07-01 15:01",
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
   "dapagliflozin: not started by 2021-07-01 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2021-07-01 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2021-07-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-07-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_16",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-07-01 14:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 158/89, repeat 153/86, pulse 84, wt 219 lb",
   "eGFR 67 (today)",
   "K 3.9 (today)",
   "A1c 6.4% (today)",
   "LDL 54 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-07-01 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2021-07-01 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2021-07-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-07-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2022-05-23 12:36",
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
   "dapagliflozin: not started by 2022-05-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2022-05-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-05-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-05-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_26",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-05-23 12:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 144/87, repeat 139/86, pulse 62, wt 224 lb",
   "eGFR 67 (5/18)",
   "K 4 (5/18)",
   "A1c 6.5% (5/18)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-05-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2022-05-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-05-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-05-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_199/0",
  "kind": "Allergy list comment",
  "when": "2022-06-10 11:32",
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
   "dapagliflozin: not started by 2022-06-10 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2022-06-10 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-06-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-06-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/0",
  "kind": "Medication event comment",
  "when": "2022-06-10 11:35",
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
   "dapagliflozin: not started by 2022-06-10 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2022-06-10 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-06-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/3",
  "kind": "Medication event comment",
  "when": "2022-06-10 11:34",
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
   "dapagliflozin: not started by 2022-06-10 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2022-06-10 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-06-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-06-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_200",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2022-06-10 11:12",
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
   "dapagliflozin: not started by 2022-06-10 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2022-06-10 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-06-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_45/0",
  "kind": "Medication event comment",
  "when": "2023-01-03 11:31",
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
   "losartan: not started by 2023-01-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2023-01-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_46/0",
  "kind": "Medication event comment",
  "when": "2023-01-03 11:32",
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
   "chlorthalidone: not started by 2023-01-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-01-03 11:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c above goal)",
   "losartan: started 50 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 158/95, repeat 150/95, pulse 85, wt 223 lb",
   "eGFR 65 (1/1)",
   "K 4.2 (1/1)",
   "A1c 6.5% (1/1)",
   "LDL 75 mg/dL (1/1)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-01-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_201",
  "kind": "Chart correction comment",
  "when": "2023-02-01 08:43",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The amlodipine 10 mg start entered 2023-01-31 was wrong patient"
  ],
  "context": [
   "amlodipine: entered in error today (wrong patient)",
   "amlodipine 10 mg daily"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-02-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_46/1",
  "kind": "Medication event comment",
  "when": "2023-09-29 14:36",
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
   "chlorthalidone: not started by 2023-09-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-09-29 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 153/96, repeat 150/93, pulse 80, wt 222 lb",
   "eGFR 61 (9/24)",
   "K 4.9 (9/24)",
   "A1c 6.7% (9/24)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_133/0",
  "kind": "Allergy list comment",
  "when": "2024-03-05 08:40",
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
   "chlorthalidone: not started by 2024-03-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_45/1",
  "kind": "Medication event comment",
  "when": "2024-03-05 08:37",
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
   "chlorthalidone: not started by 2024-03-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_132",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2024-03-05 08:15",
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
   "BP 144/78, repeat 141/74, pulse 63, wt 224 lb"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-03-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_61/0",
  "kind": "Medication event comment",
  "when": "2024-07-16 13:51",
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
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_53",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-07-16 13:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 150/87, repeat 148/84, pulse 75, wt 221 lb",
   "eGFR 63 (today)",
   "K 4 (today)",
   "UACR 67 mg/g (today)",
   "A1c 6.6% (today)"
  ],
  "forbidden": [
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-05-08 13:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: continued today (BP above goal)"
  ],
  "context": [
   "BP 147/82, pulse 87, wt 225 lb",
   "eGFR 63 (today)",
   "K 4.6 (today)",
   "A1c 7.1% (today)",
   "LDL 66 mg/dL (today)"
  ],
  "forbidden": [
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-12-10 12:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/82, pulse 70, wt 222 lb",
   "eGFR 63 (12/8)",
   "K 4.5 (12/8)",
   "UACR 79 mg/g (12/8)",
   "A1c 7.4% (12/8)"
  ],
  "forbidden": [
   "nf_100 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
