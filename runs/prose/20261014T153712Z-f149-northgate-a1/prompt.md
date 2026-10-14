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

## Requests (37)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-09-05 09:12",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2019-09-05 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-09-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-09-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-09-05 09:12",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2019-09-05 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-09-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-09-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-09-05 09:12",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2019-09-05 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-09-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-09-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-09-05 09:12",
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
   "onset 2012-01-09",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2019-09-05 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-09-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-09-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2019-09-05 09:12",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Hypothyroidism\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Hypothyroidism",
   "onset 2009",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2019-09-05 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-09-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-09-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_11",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-09-05 08:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/85, pulse 69, wt 155 lb",
   "eGFR 73 (9/1)",
   "K 4.6 (9/1)",
   "UACR 53 mg/g (9/1)",
   "A1c 6.8% (9/1)",
   "LDL 97 mg/dL (9/1)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2019-09-05 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-09-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-09-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2020-02-20 11:36",
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
   "chlorthalidone: not started by 2020-02-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-02-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2020-02-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-02-20 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-02-20 11:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/85, repeat 134/82, pulse 86, wt 154 lb",
   "eGFR 70 (2/17)",
   "K 4.3 (2/17)",
   "UACR 82 mg/g (2/17)",
   "A1c 6.9% (2/17)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-02-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-02-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2020-02-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-02-20 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-07-03 14:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/80, pulse 79, wt 155 lb",
   "eGFR 71 (6/28)",
   "K 4.6 (6/28)",
   "A1c 6.6% (6/28)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-07-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-07-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2020-07-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-07-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-11-04 13:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/85, repeat 139/83, pulse 76, wt 155 lb",
   "eGFR 70 (11/2)",
   "K 4.3 (11/2)",
   "A1c 7.2% (11/2)",
   "LDL 72 mg/dL (11/2)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-11-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2020-11-04 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2020-11-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-11-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2021-04-26 08:41",
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
   "chlorthalidone: not started by 2021-04-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2021-04-26 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-04-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-04-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-04-26 08:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 152/91, repeat 147/87, pulse 67, wt 154 lb",
   "eGFR 69 (today)",
   "K 6.2 (today), hemolyzed",
   "UACR 93 mg/g (today)",
   "A1c 7.9% (today)",
   "K 4.2 (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-04-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "losartan: not started by 2021-04-26 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-04-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-04-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/0",
  "kind": "Medication event comment",
  "when": "2021-10-19 15:36",
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
   "losartan: not started by 2021-10-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-10-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-10-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-10-19 15:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 151/88, pulse 63, wt 149 lb",
   "eGFR 67 (today)",
   "K 4.3 (today)",
   "UACR 80 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 118 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2021-10-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-10-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-10-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_240/0",
  "kind": "Allergy list comment",
  "when": "2021-11-16 13:02",
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
   "losartan: not started by 2021-11-16 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-11-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-11-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_160/0",
  "kind": "Medication event comment",
  "when": "2021-11-16 13:05",
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
   "losartan: not started by 2021-11-16 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-11-16 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/3",
  "kind": "Medication event comment",
  "when": "2021-11-16 13:04",
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
   "losartan: not started by 2021-11-16 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-11-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-11-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_241",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2021-11-16 12:42",
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
   "losartan: not started by 2021-11-16 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-11-16 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_84/0",
  "kind": "Medication event comment",
  "when": "2022-03-24 08:21",
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
   "insulin glargine: not started by 2022-03-24 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-03-24 08:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: started 50 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/80, repeat 139/77, pulse 85, wt 154 lb",
   "eGFR 68 (3/22)",
   "K 4.6 (3/22)",
   "UACR 102 mg/g (3/22)",
   "A1c 7.4% (3/22)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-03-24 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_84/1",
  "kind": "Medication event comment",
  "when": "2022-08-11 11:06",
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
   "insulin glargine: not started by 2022-08-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-08-11 10:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/81, pulse 68, wt 156 lb",
   "eGFR 66 (8/8)",
   "K 4.4 (8/8)",
   "A1c 7.7% (8/8)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-08-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-12-26 14:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/82, pulse 85, wt 155 lb",
   "eGFR 66 (12/24)",
   "K 4.4 (12/24)",
   "UACR 133 mg/g (12/24)",
   "A1c 7.7% (12/24)",
   "LDL 99 mg/dL (12/24)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-12-26 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_109/0",
  "kind": "Medication event comment",
  "when": "2023-05-15 12:36",
  "author": "Daniel Khan, MD (Primary care physician)",
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
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-05-15 12:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 127/74, pulse 88, wt 156 lb",
   "eGFR 66 (today)",
   "K 4.8 (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_110",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-09-25 11:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/87, pulse 80, wt 157 lb",
   "eGFR 66 (9/22)",
   "K 4.4 (9/22)",
   "UACR 202 mg/g (9/22)",
   "A1c 7% (9/22)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_117",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-01-31 15:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/82, pulse 66, wt 154 lb",
   "eGFR 64 (today)",
   "K 4.4 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_109/1",
  "kind": "Medication event comment",
  "when": "2024-06-28 12:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.6"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.6)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_127",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-06-28 11:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.6)"
  ],
  "context": [
   "BP 143/85, repeat 137/84, pulse 62, wt 151 lb",
   "eGFR 61 (6/26)",
   "K 4.3 (6/26)",
   "A1c 8.6% (6/26)",
   "LDL 119 mg/dL (6/26)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_137",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-11-18 09:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/83, pulse 74, wt 153 lb",
   "eGFR 58 (11/14)",
   "K 4.7 (11/14)",
   "A1c 7.7% (11/14)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_84/2",
  "kind": "Medication event comment",
  "when": "2025-03-17 15:28",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold losartan potassium 100 MG Oral Tablet 100 mg QD; reason: K 5.8 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: held today (K 5.8 confirmed on repeat); review 2025-03-31"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_149/0",
  "kind": "Problem list comment",
  "when": "2025-03-17 12:12",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2025-03-17",
   "supporting result: eGFR 56 (today)",
   "supporting result: eGFR 56 (today)",
   "supporting result: UACR 202 mg/g (9/22/23)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_143",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-03-17 11:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/89, repeat 138/87, pulse 85, wt 154 lb",
   "eGFR 56 (today)",
   "K 4.3 (today)",
   "A1c 7.9% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_247",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2025-03-17 15:22",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: held today (K 5.8 confirmed on repeat); review 2025-03-31"
  ],
  "context": [
   "K 5.8 (today)",
   "K 5.6 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_150",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-08-28 15:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: continued today (BP above goal)"
  ],
  "context": [
   "BP 141/79, repeat 133/75, pulse 74, wt 157 lb",
   "eGFR 51 (8/25)",
   "K 4.8 (8/25)",
   "A1c 7.6% (8/25)",
   "LDL 96 mg/dL (8/25)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_248/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2026-01-23 16:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 48, UACR 276 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_161",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-01-23 15:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/75, pulse 75, wt 151 lb",
   "eGFR 48 (today)",
   "K 4.6 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
