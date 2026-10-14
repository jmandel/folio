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
  "when": "2020-03-20 08:42",
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
   "onset 2006",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-03-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-03-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "carvedilol: not started by 2020-03-20 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "naproxen: not started by 2020-03-20 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-03-20 08:42",
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
   "losartan: not started by 2020-03-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-03-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "carvedilol: not started by 2020-03-20 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "naproxen: not started by 2020-03-20 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-03-20 08:42",
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
   "onset 2014-05-08",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-03-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-03-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "carvedilol: not started by 2020-03-20 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "naproxen: not started by 2020-03-20 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-03-20 08:42",
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
   "losartan: not started by 2020-03-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-03-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "carvedilol: not started by 2020-03-20 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "naproxen: not started by 2020-03-20 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-03-20 08:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/81, pulse 67, wt 203 lb",
   "eGFR 96 (3/17)",
   "K 4.2 (3/17)",
   "UACR 11 mg/g (3/17)",
   "A1c 6.7% (3/17)",
   "LDL 133 mg/dL (3/17)"
  ],
  "forbidden": [
   "losartan: not started by 2020-03-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2020-03-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "carvedilol: not started by 2020-03-20 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "naproxen: not started by 2020-03-20 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-02-09 15:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 147/95, pulse 64, wt 206 lb",
   "eGFR 93 (2/3)",
   "K 4.8 (2/3)",
   "A1c 6.6% (2/3)"
  ],
  "forbidden": [
   "losartan: not started by 2021-02-09 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2021-02-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "carvedilol: not started by 2021-02-09 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "naproxen: not started by 2021-02-09 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2021-11-04 11:01",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "losartan: not started by 2021-11-04 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2021-11-04 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "carvedilol: not started by 2021-11-04 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "naproxen: not started by 2021-11-04 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_26",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-11-04 10:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/88, repeat 141/85, pulse 77, wt 204 lb",
   "eGFR 96 (today)",
   "K 4.5 (today)",
   "A1c 6.3% (today)",
   "LDL 124 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2021-11-04 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2021-11-04 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "carvedilol: not started by 2021-11-04 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "naproxen: not started by 2021-11-04 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-09-19 15:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/80, pulse 69, wt 202 lb",
   "eGFR 94 (today)",
   "K 4.9 (today)",
   "A1c 6.1% (today)"
  ],
  "forbidden": [
   "losartan: not started by 2022-09-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2022-09-19 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "carvedilol: not started by 2022-09-19 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "naproxen: not started by 2022-09-19 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_169",
  "kind": "Chart correction comment",
  "when": "2022-10-18 08:33",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The carvedilol 12.5 mg start entered 2022-10-17 was wrong patient"
  ],
  "context": [
   "carvedilol: entered in error today (wrong patient)"
  ],
  "forbidden": [
   "losartan: not started by 2022-10-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2022-10-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2022-10-18 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-24 12:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/85, repeat 135/82, pulse 88, wt 203 lb",
   "eGFR 94 (today)",
   "K 4.1 (today)",
   "A1c 6.3% (today)",
   "LDL 131 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2023-04-24 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2023-04-24 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2023-04-24 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_167/0",
  "kind": "Allergy list comment",
  "when": "2023-06-09 13:53",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "losartan: not started by 2023-06-09 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2023-06-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2023-06-09 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2023-06-09 13:56",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change amlodipine 10 MG Oral Tablet 10 mg QD; reason: replacing lisinopril (angioedema)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "amlodipine: dose changed to 10 mg daily today (replacing lisinopril (angioedema))"
  ],
  "forbidden": [
   "losartan: not started by 2023-06-09 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2023-06-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2023-06-09 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2023-06-09 13:55",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 20 MG Oral Tablet 20 mg QD; reason: angioedema"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (angioedema)"
  ],
  "forbidden": [
   "losartan: not started by 2023-06-09 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2023-06-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2023-06-09 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_168",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2023-06-09 13:33",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril allergy: angioedema of lips and tongue",
   "lisinopril: stopped today (angioedema)",
   "amlodipine: dose changed to 10 mg daily today (replacing lisinopril (angioedema))"
  ],
  "context": [
   "Angioedema"
  ],
  "forbidden": [
   "losartan: not started by 2023-06-09 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dapagliflozin: not started by 2023-06-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2023-06-09 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/0",
  "kind": "Medication event comment",
  "when": "2024-03-01 08:31",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "dapagliflozin: not started by 2024-03-01 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2024-03-01 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_63",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-03-01 08:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: started 50 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 156/95, repeat 152/94, pulse 62, wt 203 lb",
   "eGFR 93 (today)",
   "K 4.3 (today)",
   "UACR 16 mg/g (today)",
   "A1c 6.4% (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-03-01 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2024-03-01 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_85/0",
  "kind": "Medication event comment",
  "when": "2025-01-07 12:36",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-01-07 12:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "context": [
   "BP 128/75, pulse 69, wt 205 lb",
   "eGFR 92 (today)",
   "K 4.6 (today)",
   "UACR 9 mg/g (today)",
   "A1c 6.6% (today)",
   "LDL 105 mg/dL (today)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_159/0",
  "kind": "Allergy list comment",
  "when": "2025-02-05 13:10",
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
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_85/1",
  "kind": "Medication event comment",
  "when": "2025-02-05 13:07",
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
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_158",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-02-05 12:45",
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
   "BP 145/78, repeat 143/77, pulse 74, wt 204 lb"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/1",
  "kind": "Medication event comment",
  "when": "2025-10-31 14:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold losartan potassium 50 MG Oral Tablet 50 mg QD; reason: K 5.9 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: held today (K 5.9 confirmed on repeat); review 2025-11-14"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_86",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-31 08:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/81, pulse 65, wt 205 lb",
   "eGFR 89 (today)",
   "K 4.2 (today)",
   "UACR 8 mg/g (today)",
   "A1c 6.1% (today)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_175",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2025-10-31 14:44",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: held today (K 5.9 confirmed on repeat); review 2025-11-14"
  ],
  "context": [
   "K 5.9 (today)",
   "K 5.8 (today)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/2",
  "kind": "Medication event comment",
  "when": "2026-06-30 09:51",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "resume losartan potassium 100 MG Oral Tablet 100 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: resumed today (BP above goal)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_93",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-06-30 09:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: resumed today (BP above goal)"
  ],
  "context": [
   "BP 153/95, repeat 145/91, pulse 83, wt 204 lb",
   "eGFR 88 (6/24)",
   "K 4.4 (6/24)",
   "UACR 14 mg/g (6/24)",
   "A1c 6.7% (6/24)",
   "LDL 125 mg/dL (6/24)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_125 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
