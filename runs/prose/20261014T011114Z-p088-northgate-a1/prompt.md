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

## Requests (30)

```json
[
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2019-10-03 13:41",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.3)"
  ],
  "forbidden": [
   "losartan: not started by 2019-10-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-10-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-10-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-10-03 13:52",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-10-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-10-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-10-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-10-03 13:52",
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
   "losartan: not started by 2019-10-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-10-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-10-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-10-03 13:52",
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
   "onset 2009-08",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-10-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-10-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-10-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-10-03 13:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.3)"
  ],
  "context": [
   "BP 135/86, pulse 67, wt 233 lb",
   "eGFR 66 (today)",
   "K 4 (today)",
   "UACR 295 mg/g (today)",
   "A1c 8.3% (today)",
   "LDL 145 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2019-10-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-10-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-10-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-02-11 08:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/77, pulse 76, wt 233 lb",
   "eGFR 67 (today)",
   "K 4.8 (today)",
   "UACR 184 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "losartan: not started by 2020-02-11 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-02-11 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-02-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_36/0",
  "kind": "Allergy list comment",
  "when": "2020-06-19 11:23",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2020-06-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-06-19 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2020-06-19 11:21",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "losartan: not started by 2020-06-19 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-06-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-06-19 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_35/0",
  "kind": "Medication event comment",
  "when": "2020-06-19 11:22",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2020-06-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-06-19 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-06-19 11:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 140/85, repeat 136/82, pulse 69, wt 235 lb",
   "eGFR 64 (today)",
   "K 4.4 (today)",
   "UACR 189 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-06-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-06-19 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_35/1",
  "kind": "Medication event comment",
  "when": "2020-11-02 09:06",
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
   "chlorthalidone: not started by 2020-11-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-11-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-11-02 08:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/95, repeat 140/91, pulse 75, wt 236 lb",
   "eGFR 63 (10/29)",
   "K 4.8 (10/29)",
   "A1c 7.8% (10/29)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-11-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-11-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_44",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-03-08 11:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/80, pulse 83, wt 235 lb",
   "eGFR 64 (today)",
   "K 4.6 (today)",
   "UACR 259 mg/g (today)",
   "A1c 7.9% (today)",
   "LDL 175 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-03-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-03-08 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-08-10 13:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/87, pulse 88, wt 235 lb",
   "eGFR 61 (today)",
   "K 4.4 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-08-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-08-10 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/0",
  "kind": "Medication event comment",
  "when": "2022-01-13 12:11",
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
   "insulin glargine: not started by 2022-01-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-01-13 11:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/79, repeat 139/78, pulse 84, wt 239 lb",
   "eGFR 59 (1/11)",
   "K 4.6 (1/11)",
   "UACR 228 mg/g (1/11)",
   "A1c 7.7% (1/11)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-01-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_83/0",
  "kind": "Problem list comment",
  "when": "2022-06-11 16:25",
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
   "onset 2022-06-11",
   "supporting result: eGFR 59 (1/11)",
   "supporting result: eGFR 59 (today)",
   "supporting result: UACR 228 mg/g (1/11)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-06-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-06-13 10:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/87, pulse 78, wt 231 lb",
   "eGFR 59 (6/11)",
   "K 4.6 (6/11)",
   "A1c 7.8% (6/11)",
   "LDL 122 mg/dL (6/11)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-06-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-11-04 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/76, pulse 67, wt 233 lb",
   "eGFR 58 (11/1)",
   "K 4.5 (11/1)",
   "UACR 234 mg/g (11/1)",
   "A1c 8% (11/1)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-11-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_97/0",
  "kind": "Medication event comment",
  "when": "2023-04-18 15:11",
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
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-18 14:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 123/79, pulse 73, wt 237 lb",
   "eGFR 55 (today)",
   "K 4.7 (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_98",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-09-20 12:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/89, repeat 137/88, pulse 64, wt 237 lb",
   "eGFR 58 (9/17)",
   "K 4.6 (9/17)",
   "UACR 329 mg/g (9/17)",
   "A1c 7.5% (9/17)",
   "LDL 139 mg/dL (9/17)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_110",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-02-26 10:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/78, pulse 82, wt 239 lb",
   "eGFR 56 (today)",
   "K 4.4 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_117",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-07-01 14:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/83, pulse 86, wt 235 lb",
   "eGFR 53 (6/25)",
   "K 4.6 (6/25)",
   "UACR 315 mg/g (6/25)",
   "A1c 7.7% (6/25)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_124",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-11-25 12:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/83, pulse 69, wt 237 lb",
   "eGFR 53 (today)",
   "K 4.6 (today)",
   "UACR 364 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_131",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-05-01 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/80, pulse 83, wt 234 lb",
   "eGFR 50 (4/26)",
   "K 4.4 (4/26)",
   "A1c 7.9% (4/26)",
   "LDL 121 mg/dL (4/26)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_97/1",
  "kind": "Medication event comment",
  "when": "2025-10-21 09:06",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.2)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_141",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-21 08:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 124/71, pulse 85, wt 237 lb",
   "eGFR 50 (10/18)",
   "K 4.5 (10/18)",
   "A1c 8.2% (10/18)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_148",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-03-03 10:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/72, pulse 80, wt 232 lb",
   "eGFR 48 (today)",
   "K 4.7 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_157",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-08-10 13:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/87, repeat 136/83, pulse 66, wt 240 lb",
   "eGFR 47 (8/8)",
   "K 4.5 (8/8)",
   "UACR 502 mg/g (8/8)",
   "A1c 7.6% (8/8)",
   "LDL 111 mg/dL (8/8)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
