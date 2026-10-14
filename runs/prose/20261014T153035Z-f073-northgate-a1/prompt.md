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
  "when": "2019-01-15 13:02",
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
   "onset 2014-08-01",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-01-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-01-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-01-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-01-15 13:02",
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
   "onset 2017-04",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-01-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-01-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-01-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-01-15 13:02",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "semaglutide: not started by 2019-01-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-01-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-01-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-01-15 12:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/90, pulse 72, wt 164 lb",
   "eGFR 74 (1/10)",
   "K 4.4 (1/10)",
   "A1c 7.8% (1/10)",
   "LDL 94 mg/dL (1/10)"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-01-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-01-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-01-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2019-05-15 08:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2019-05-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-05-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-05-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_27/0",
  "kind": "Medication event comment",
  "when": "2019-05-15 08:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-05-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-05-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-05-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2019-05-15 08:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.2)",
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/90, pulse 70, wt 161 lb",
   "eGFR 73 (today)",
   "K 4.5 (today)",
   "UACR 208 mg/g (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-05-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-05-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-05-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2019-10-08 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/82, pulse 68, wt 161 lb",
   "eGFR 70 (today)",
   "K 4.4 (today)",
   "UACR 203 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-10-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-10-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-10-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-03-16 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 148/84, pulse 63, wt 164 lb",
   "eGFR 71 (today)",
   "K 4.5 (today)",
   "UACR 265 mg/g (today)",
   "A1c 6.7% (today)",
   "LDL 141 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-03-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-03-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-03-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-08-10 11:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/80, pulse 76, wt 162 lb",
   "eGFR 70 (today)",
   "K 4.1 (today)",
   "UACR 190 mg/g (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-08-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-08-10 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-08-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_57",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-12-17 10:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/94, repeat 140/90, pulse 71, wt 160 lb",
   "eGFR 69 (today)",
   "K 4.3 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-12-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-12-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-12-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2021-05-25 11:11",
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
   "chlorthalidone: not started by 2021-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-05-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-05-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-05-25 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 154/97, pulse 79, wt 163 lb",
   "eGFR 68 (today)",
   "K 4.5 (today)",
   "UACR 318 mg/g (today)",
   "A1c 7.8% (today)",
   "LDL 56 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-05-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-05-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_89/0",
  "kind": "Medication event comment",
  "when": "2021-09-28 08:31",
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
   "insulin glargine: not started by 2021-09-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-09-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_203/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-09-28 08:55",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 68, UACR 292 mg/g: CKD evaluation and management"
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
   "insulin glargine: not started by 2021-09-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-09-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_80",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-09-28 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/88, repeat 135/86, pulse 67, wt 166 lb",
   "eGFR 68 (today)",
   "K 4.5 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-09-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-09-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2021-11-04 12:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: vomiting, poor oral intake"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: held today (vomiting, poor oral intake); review 2021-11-11"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-11-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-11-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_201",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2021-11-04 12:37",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2021-11-11"
  ],
  "context": [],
  "forbidden": [
   "insulin glargine: not started by 2021-11-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-11-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2021-11-15 09:29",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "resume metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: eating and drinking normally"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-11-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-11-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_202",
  "kind": "Primary care phone visit note (reason: Phone: feeling better)",
  "when": "2021-11-15 09:25",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "context": [],
  "forbidden": [
   "insulin glargine: not started by 2021-11-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-11-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_100/0",
  "kind": "Medication event comment",
  "when": "2022-03-01 13:31",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "amlodipine: not started by 2022-03-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_90",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-03-01 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 131/81, pulse 72, wt 164 lb",
   "eGFR 68 (2/24)",
   "K 4.4 (2/24)",
   "UACR 353 mg/g (2/24)",
   "A1c 8.2% (2/24)"
  ],
  "forbidden": [
   "amlodipine: not started by 2022-03-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_101",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-08-16 10:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/90, pulse 84, wt 162 lb",
   "eGFR 65 (today)",
   "K 4.2 (today)",
   "A1c 7.5% (today)",
   "LDL 107 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2022-08-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_111",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-12-27 13:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/87, pulse 69, wt 160 lb",
   "eGFR 66 (today)",
   "K 4.2 (today)",
   "UACR 389 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2022-12-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_119",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-05-18 10:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/81, pulse 62, wt 163 lb",
   "eGFR 65 (today)",
   "K 4.5 (today)",
   "UACR 563 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-05-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_100/1",
  "kind": "Medication event comment",
  "when": "2023-09-18 14:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "forbidden": [
   "amlodipine: not started by 2023-09-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_129",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-09-18 14:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 147/84, pulse 63, wt 164 lb",
   "eGFR 64 (today)",
   "K 4.6 (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-09-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_145/0",
  "kind": "Medication event comment",
  "when": "2024-03-15 15:36",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_135",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-03-15 15:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/87, repeat 138/87, pulse 78, wt 158 lb",
   "eGFR 63 (today)",
   "K 4.5 (today)",
   "A1c 7.3% (today)",
   "LDL 78 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_146",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-02 12:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/81, pulse 72, wt 160 lb",
   "eGFR 58 (8/28)",
   "K 4.4 (8/28)",
   "A1c 7.3% (8/28)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_160/0",
  "kind": "Problem list comment",
  "when": "2025-01-06 09:22",
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
   "onset 2025-01-06",
   "supporting result: eGFR 57 (10/28/24)",
   "supporting result: eGFR 58 (today)",
   "supporting result: UACR 755 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_153",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-06 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/83, pulse 74, wt 163 lb",
   "eGFR 58 (today)",
   "K 4.6 (today)",
   "UACR 755 mg/g (today)",
   "A1c 7.1% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_161",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-05-26 13:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/78, pulse 76, wt 162 lb",
   "eGFR 53 (5/24)",
   "K 4.7 (5/24)",
   "A1c 7.3% (5/24)",
   "LDL 65 mg/dL (5/24)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_171",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-29 12:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/72, pulse 72, wt 163 lb",
   "eGFR 50 (today)",
   "K 4.4 (today)",
   "UACR 1052 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_178",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-03-20 15:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/72, pulse 87, wt 164 lb",
   "eGFR 46 (today)",
   "K 4.7 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/3",
  "kind": "Medication event comment",
  "when": "2026-09-16 12:21",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 41"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 41)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_188",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-09-16 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 41)"
  ],
  "context": [
   "BP 133/82, pulse 84, wt 163 lb",
   "eGFR 40 (9/13)",
   "K 5 (9/13)",
   "A1c 7.9% (9/13)",
   "LDL 80 mg/dL (9/13)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
