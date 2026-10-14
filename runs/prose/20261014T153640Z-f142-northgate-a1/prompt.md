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

## Requests (34)

```json
[
 {
  "key": "B/med/m_21/0",
  "kind": "Medication event comment",
  "when": "2019-11-28 15:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.8"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.8)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-11-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-11-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2019-11-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2019-11-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 15:22",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-11-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-11-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2019-11-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2019-11-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 15:22",
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
   "onset 2007",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-11-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-11-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2019-11-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2019-11-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 15:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-11-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-11-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2019-11-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2019-11-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 15:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Major depressive disorder, recurrent, mild\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Major depressive disorder, recurrent, mild",
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-11-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-11-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2019-11-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2019-11-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": [
   {
    "words": "/depress|\\bMDD\\b|F33/i",
    "onlyInsideSpans": [
     "prob_1"
    ]
   }
  ]
 },
 {
  "key": "B/visit/e_11",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-11-28 14:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.8)"
  ],
  "context": [
   "BP 147/94, repeat 144/90, pulse 86, wt 193 lb",
   "eGFR 69 (today)",
   "K 4.5 (today)",
   "A1c 8.8% (today)",
   "LDL 96 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-11-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-11-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2019-11-28 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2019-11-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-05-25 10:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/85, pulse 86, wt 192 lb",
   "eGFR 67 (today)",
   "K 4.5 (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-05-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2020-05-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2020-05-25 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2020-05-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-10-19 10:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/83, pulse 64, wt 192 lb",
   "eGFR 67 (today)",
   "K 4.4 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-10-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-10-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2020-10-19 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2020-10-19 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2020-10-19 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_21/1",
  "kind": "Medication event comment",
  "when": "2021-04-06 09:21",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-04-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-04-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2021-04-06 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2021-04-06 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2021-04-06 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-04-06 09:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 142/77, repeat 137/75, pulse 67, wt 194 lb",
   "eGFR 65 (today)",
   "K 4.5 (today)",
   "UACR 234 mg/g (today)",
   "A1c 8.1% (today)",
   "LDL 108 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-04-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-04-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2021-04-06 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2021-04-06 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2021-04-06 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2021-08-13 10:11",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-08-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-08-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2021-08-13 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2021-08-13 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2021-08-13 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_168/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-08-13 10:35",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 65, UACR 368 mg/g: CKD evaluation and management"
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-08-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-08-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2021-08-13 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2021-08-13 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2021-08-13 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-08-13 09:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/80, repeat 140/76, pulse 62, wt 194 lb",
   "eGFR 65 (today)",
   "K 4.3 (today)",
   "UACR 368 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-08-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-08-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2021-08-13 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2021-08-13 (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "finerenone: not started by 2021-08-13 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_176",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2021-10-25 12:38",
  "author": "Nina Ortiz, RN (Registered nurse)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "finerenone 10 mg QD added from the outside (Lakeview) record"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "finerenone 10 mg daily"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-10-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-10-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2021-10-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2021-10-25 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_68/0",
  "kind": "Medication event comment",
  "when": "2022-01-10 13:51",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2022-01-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2022-01-10 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2022-01-10 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-01-10 13:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/88, repeat 142/84, pulse 72, wt 191 lb",
   "eGFR 64 (1/6)",
   "K 4.9 (1/6)",
   "A1c 7.4% (1/6)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2022-01-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2022-01-10 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2022-01-10 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_80/0",
  "kind": "Medication event comment",
  "when": "2022-05-10 09:06",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2022-05-10 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2022-05-10 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_69",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-05-10 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/86, pulse 70, wt 191 lb",
   "eGFR 62 (today)",
   "K 5.2 (today)",
   "A1c 7.3% (today)",
   "LDL 99 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2022-05-10 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2022-05-10 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_81",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-09-08 09:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/88, pulse 65, wt 193 lb",
   "eGFR 61 (today)",
   "K 4.1 (today)",
   "UACR 351 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2022-09-08 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "carvedilol: not started by 2022-09-08 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_95/0",
  "kind": "Medication event comment",
  "when": "2023-01-20 13:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: not started by 2023-01-20 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_88",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-01-20 13:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 134/83, pulse 65, wt 195 lb",
   "eGFR 63 (today)",
   "K 4.5 (today)",
   "UACR 476 mg/g (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: not started by 2023-01-20 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_96",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-24 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/80, pulse 82, wt 192 lb",
   "eGFR 61 (today)",
   "K 4.7 (today)",
   "A1c 7% (today)",
   "LDL 115 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: not started by 2023-05-24 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_106",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-10 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/69, pulse 80, wt 192 lb",
   "eGFR 60 (today)",
   "K 4.1 (today)",
   "UACR 730 mg/g (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: not started by 2023-11-10 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_119/0",
  "kind": "Problem list comment",
  "when": "2024-04-25 09:02",
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
   "onset 2024-04-25",
   "supporting result: eGFR 60 (1/15)",
   "supporting result: eGFR 59 (today)",
   "supporting result: UACR 529 mg/g (1/15)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: not started by 2024-04-25 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_113",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-04-25 08:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/66, pulse 81, wt 192 lb",
   "eGFR 59 (today)",
   "K 4.3 (today)",
   "A1c 7.4% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: not started by 2024-04-25 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_120",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-09-30 11:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/59, pulse 67, wt 194 lb",
   "eGFR 56 (9/24)",
   "K 4.6 (9/24)",
   "A1c 7.4% (9/24)",
   "LDL 157 mg/dL (9/24)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: not started by 2024-09-30 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_130",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-03-03 08:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/76, pulse 78, wt 191 lb",
   "eGFR 52 (today)",
   "K 4.8 (today)",
   "UACR 835 mg/g (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: not started by 2025-03-03 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_138",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-08-19 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/75, pulse 67, wt 193 lb",
   "eGFR 48 (today)",
   "K 4.5 (today)",
   "UACR 857 mg/g (today)",
   "A1c 8% (today)",
   "LDL 132 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: not started by 2025-08-19 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_167",
  "kind": "Chart correction comment",
  "when": "2025-09-09 08:33",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The carvedilol 12.5 mg start entered 2025-09-08 was wrong patient"
  ],
  "context": [
   "carvedilol: entered in error today (wrong patient)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_21/2",
  "kind": "Medication event comment",
  "when": "2025-12-29 08:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 18 units QHS; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 18 units at bedtime today (A1c 8.4)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_152",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-12-29 08:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 18 units at bedtime today (A1c 8.4)"
  ],
  "context": [
   "BP 123/77, pulse 67, wt 195 lb",
   "eGFR 46 (12/26)",
   "K 4.2 (12/26)",
   "UACR 1069 mg/g (12/26)",
   "A1c 8.4% (12/26)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_119/1",
  "kind": "Problem list comment",
  "when": "2026-05-09 16:25",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "update problem \"Chronic kidney disease stage 3b\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "onset 2024-04-25",
   "supporting result: eGFR 46 (1/1)",
   "supporting result: eGFR 42 (today)",
   "supporting result: UACR 1030 mg/g (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2026-05-12 16:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 43"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_159",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-05-12 15:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "context": [
   "BP 127/75, pulse 76, wt 194 lb",
   "eGFR 42 (5/9)",
   "K 4.5 (5/9)",
   "UACR 1030 mg/g (5/9)",
   "A1c 7.7% (5/9)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
