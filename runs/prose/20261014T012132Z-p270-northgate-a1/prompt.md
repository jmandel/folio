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

## Requests (22)

```json
[
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2022-08-18 16:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.5"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.5)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2022-08-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-08-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2022-08-18 16:12",
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
   "onset 2009",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2022-08-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-08-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-08-18 16:12",
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
   "onset 2016-06-25",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2022-08-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-08-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-08-18 16:12",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2022-08-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-08-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2022-08-18 16:12",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2022-08-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-08-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
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
  "key": "B/referral/rf_107/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2022-08-18 16:25",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 45, UACR 12 mg/g: CKD evaluation and management"
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
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2022-08-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-08-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-08-18 15:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.5)"
  ],
  "context": [
   "BP 150/85, pulse 72, wt 177 lb",
   "eGFR 43 (8/13)",
   "K 4.3 (8/13)",
   "UACR 10 mg/g (8/13)",
   "A1c 8.5% (8/13)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2022-08-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-08-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_35/0",
  "kind": "Problem list comment",
  "when": "2023-02-07 16:25",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Chronic kidney disease stage 3b\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "onset 2023-02-07",
   "supporting result: eGFR 40 (2/2)",
   "supporting result: eGFR 44 (today)",
   "supporting result: UACR 12 mg/g (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2023-02-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/2",
  "kind": "Medication event comment",
  "when": "2023-02-09 10:36",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 42"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2023-02-09 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-02-09 10:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "context": [
   "BP 130/83, pulse 78, wt 179 lb",
   "eGFR 44 (2/7)",
   "K 4.4 (2/7)",
   "UACR 12 mg/g (2/7)",
   "A1c 7.5% (2/7)",
   "LDL 62 mg/dL (2/7)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2023-02-09 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_36",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-16 09:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/73, pulse 76, wt 181 lb",
   "eGFR 42 (today)",
   "K 4.7 (today)",
   "UACR 9 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2023-06-16 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_43",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-10 14:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/82, pulse 66, wt 180 lb",
   "eGFR 40 (today)",
   "K 4.4 (today)",
   "UACR 15 mg/g (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2023-11-10 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-05-07 13:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/86, repeat 142/85, pulse 76, wt 178 lb",
   "eGFR 43 (today)",
   "K 4.7 (today)",
   "A1c 7.8% (today)",
   "LDL 61 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2024-05-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2024-09-25 15:36",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold losartan potassium 50 MG Oral Tablet 50 mg QD; reason: K 6 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: held today (K 6 confirmed on repeat); review 2024-10-09"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2024-09-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_60",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-09-25 09:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/83, pulse 88, wt 180 lb",
   "eGFR 40 (9/20)",
   "K 4.9 (9/20)",
   "UACR 18 mg/g (9/20)",
   "A1c 8% (9/20)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2024-09-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_106",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2024-09-25 15:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: held today (K 6 confirmed on repeat); review 2024-10-09"
  ],
  "context": [
   "K 6 (today)",
   "K 5.9 (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2024-09-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_67",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-02-04 08:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/81, pulse 88, wt 177 lb",
   "eGFR 38 (today)",
   "K 4.9 (today)",
   "UACR 17 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2025-02-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_84/0",
  "kind": "Medication event comment",
  "when": "2025-06-17 12:06",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-06-17 11:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "context": [
   "BP 139/81, pulse 76, wt 180 lb",
   "eGFR 36 (today)",
   "K 4.6 (today)",
   "A1c 8% (today)",
   "LDL 92 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-31 12:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/93, repeat 141/90, pulse 88, wt 177 lb",
   "eGFR 36 (today)",
   "K 5.1 (today)",
   "A1c 8.3% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2026-04-01 08:41",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-04-01 08:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: resumed today (BP above goal)"
  ],
  "context": [
   "BP 140/84, pulse 88, wt 178 lb",
   "eGFR 35 (3/29)",
   "K 4.6 (3/29)",
   "A1c 8.8% (3/29)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
