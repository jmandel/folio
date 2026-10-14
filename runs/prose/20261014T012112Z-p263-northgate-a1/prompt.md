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

## Requests (29)

```json
[
 {
  "key": "B/med/m_22/0",
  "kind": "Medication event comment",
  "when": "2020-09-15 11:41",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 9, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 9, CKD)"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-09-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-09-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-09-15 11:52",
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
   "onset 2011-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-09-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-09-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-09-15 11:52",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-09-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-09-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-09-15 11:52",
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
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-09-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-09-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-09-15 11:52",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-09-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-09-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2020-09-15 11:52",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-09-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-09-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-09-15 11:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 9, CKD)"
  ],
  "context": [
   "BP 155/95, repeat 149/92, pulse 82, wt 226 lb",
   "eGFR 60 (today)",
   "K 4.3 (today)",
   "UACR 65 mg/g (today)",
   "A1c 9% (today)",
   "LDL 72 mg/dL (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-09-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-09-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-09-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2021-02-19 13:51",
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
   "semaglutide: not started by 2021-02-19 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-02-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-02-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-02-19 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-02-19 13:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/93, repeat 143/90, pulse 68, wt 226 lb",
   "eGFR 59 (today)",
   "K 4.4 (today)",
   "UACR 50 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-02-19 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-02-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-02-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-02-19 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2021-06-29 11:37",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2021-06-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-06-29 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-06-29 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_37/0",
  "kind": "Medication event comment",
  "when": "2021-06-29 11:36",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2021-06-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-06-29 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-06-29 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_36/0",
  "kind": "Problem list comment",
  "when": "2021-06-29 11:47",
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
   "onset 2021-06-29",
   "supporting result: eGFR 59 (2/19)",
   "supporting result: eGFR 60 (today)",
   "supporting result: UACR 50 mg/g (2/19)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-06-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-06-29 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-06-29 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_30",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-06-29 11:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.3)",
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/93, pulse 82, wt 230 lb",
   "eGFR 60 (today)",
   "K 4.4 (today)",
   "A1c 8.3% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-06-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-06-29 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-06-29 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_52/0",
  "kind": "Medication event comment",
  "when": "2021-11-23 11:11",
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
   "amlodipine: not started by 2021-11-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-11-23 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-11-23 10:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 170/107, repeat 167/105, pulse 80, wt 227 lb",
   "eGFR 58 (today)",
   "K 4.7 (today)",
   "UACR 70 mg/g (today)",
   "A1c 7.6% (today)",
   "LDL 100 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2021-11-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-11-23 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_60/0",
  "kind": "Medication event comment",
  "when": "2022-05-17 11:51",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "insulin glargine: not started by 2022-05-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_53",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-05-17 11:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/82, repeat 139/80, pulse 76, wt 226 lb",
   "eGFR 58 (today)",
   "K 4.5 (today)",
   "UACR 88 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-05-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-11-14 11:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/90, pulse 66, wt 227 lb",
   "eGFR 59 (today)",
   "K 4.4 (today)",
   "A1c 7.7% (today)",
   "LDL 85 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-11-14 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_75",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-03-28 08:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/82, pulse 66, wt 224 lb",
   "eGFR 57 (today)",
   "K 4.3 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-03-28 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_82",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-09-06 15:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/85, pulse 80, wt 225 lb",
   "eGFR 54 (today)",
   "K 4.3 (today)",
   "UACR 85 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-09-06 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-02-09 11:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/78, pulse 71, wt 228 lb",
   "eGFR 56 (2/4)",
   "K 4.3 (2/4)",
   "A1c 7.5% (2/4)",
   "LDL 86 mg/dL (2/4)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-02-09 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-08-01 13:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 150/83, pulse 66, wt 228 lb",
   "eGFR 55 (7/30)",
   "K 4.3 (7/30)",
   "UACR 128 mg/g (7/30)",
   "A1c 7.6% (7/30)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-08-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_110",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-12-20 10:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/89, pulse 65, wt 227 lb",
   "eGFR 55 (today)",
   "K 5 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-12-20 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_116",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-21 08:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/82, pulse 66, wt 228 lb",
   "eGFR 54 (4/19)",
   "K 4.5 (4/19)",
   "UACR 149 mg/g (4/19)",
   "A1c 7.9% (4/19)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-04-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_136/0",
  "kind": "Medication event comment",
  "when": "2025-09-24 13:21",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.5"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.5)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_225/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2025-09-24 13:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 55, UACR 153 mg/g: CKD evaluation and management"
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
  "key": "B/visit/e_124",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-09-24 13:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.5)"
  ],
  "context": [
   "BP 145/88, pulse 76, wt 228 lb",
   "eGFR 55 (9/21)",
   "K 4.3 (9/21)",
   "UACR 108 mg/g (9/21)",
   "A1c 8.5% (9/21)",
   "LDL 90 mg/dL (9/21)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_137",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-02-16 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 149/85, repeat 141/83, pulse 80, wt 230 lb",
   "eGFR 55 (today)",
   "K 4.1 (today)",
   "UACR 176 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_144",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-07-22 15:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/72, pulse 75, wt 227 lb",
   "eGFR 55 (7/18)",
   "K 4.1 (7/18)",
   "A1c 8% (7/18)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
