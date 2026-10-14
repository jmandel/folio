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

## Requests (16)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2022-11-07 15:52",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "chlorthalidone: not started by 2022-11-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-11-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-11-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2022-11-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-11-07 15:52",
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
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "chlorthalidone: not started by 2022-11-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-11-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-11-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2022-11-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-11-07 15:52",
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
   "onset 2016-06",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "chlorthalidone: not started by 2022-11-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-11-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-11-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2022-11-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2022-11-07 15:52",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "chlorthalidone: not started by 2022-11-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-11-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-11-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2022-11-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2022-11-07 15:52",
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
   "onset 2021",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "chlorthalidone: not started by 2022-11-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-11-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-11-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2022-11-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_6/0",
  "kind": "Problem list comment",
  "when": "2022-11-07 15:52",
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
   "onset 2022",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "chlorthalidone: not started by 2022-11-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-11-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-11-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2022-11-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
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
  "when": "2022-11-07 15:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 152/89, pulse 72, wt 237 lb",
   "eGFR 77 (today)",
   "K 4.8 (today)",
   "A1c 6.9% (today)",
   "LDL 79 mg/dL (today)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "chlorthalidone: not started by 2022-11-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-11-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-11-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2022-11-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2023-08-21 15:31",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "chlorthalidone: not started by 2023-08-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-08-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2023-08-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2023-08-21 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-08-21 15:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/82, repeat 141/80, pulse 71, wt 241 lb",
   "eGFR 78 (8/19)",
   "K 4 (8/19)",
   "UACR 46 mg/g (8/19)",
   "A1c 7.4% (8/19)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "chlorthalidone: not started by 2023-08-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-08-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2023-08-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2023-08-21 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2024-03-28 11:11",
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
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "amlodipine: not started by 2024-03-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2024-03-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2024-03-28 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-03-28 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 152/87, pulse 64, wt 236 lb",
   "eGFR 77 (3/22)",
   "K 4.5 (3/22)",
   "UACR 35 mg/g (3/22)",
   "A1c 7.5% (3/22)",
   "LDL 99 mg/dL (3/22)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "amlodipine: not started by 2024-03-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2024-03-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2024-03-28 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_56/0",
  "kind": "Medication event comment",
  "when": "2025-02-20 15:36",
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
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "empagliflozin: not started by 2025-02-20 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2025-02-20 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_42",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-02-20 15:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/91, repeat 146/88, pulse 85, wt 235 lb",
   "eGFR 76 (2/15)",
   "K 4.4 (2/15)",
   "UACR 41 mg/g (2/15)",
   "A1c 7.7% (2/15)",
   "LDL 56 mg/dL (2/15)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "empagliflozin: not started by 2025-02-20 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2025-02-20 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_64/0",
  "kind": "Medication event comment",
  "when": "2025-12-08 14:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.2)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "ibuprofen: not started by 2025-12-08 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_57",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-12-08 13:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.2)"
  ],
  "context": [
   "BP 136/79, pulse 77, wt 234 lb",
   "eGFR 75 (12/6)",
   "K 4 (12/6)",
   "UACR 55 mg/g (12/6)",
   "A1c 8.2% (12/6)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "ibuprofen: not started by 2025-12-08 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_65",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-08-31 11:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/75, pulse 64, wt 234 lb",
   "eGFR 75 (8/27)",
   "K 4.3 (8/27)",
   "UACR 48 mg/g (8/27)",
   "A1c 7.3% (8/27)",
   "LDL 85 mg/dL (8/27)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
