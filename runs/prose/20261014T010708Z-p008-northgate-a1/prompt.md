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

## Requests (19)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-10-21 14:47",
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
   "onset 2009-07",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2019-10-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-10-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-10-21 14:47",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2019-10-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-10-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-10-21 14:47",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2019-10-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-10-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-10-21 14:47",
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
   "onset 2008",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2019-10-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-10-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2019-10-21 14:47",
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
   "onset 2006",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2019-10-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-10-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_6/0",
  "kind": "Problem list comment",
  "when": "2019-10-21 14:47",
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
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2019-10-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-10-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
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
  "key": "B/visit/e_12",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-10-21 14:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/91, repeat 139/87, pulse 63, wt 183 lb",
   "eGFR 82 (10/17)",
   "K 4 (10/17)",
   "A1c 8% (10/17)",
   "LDL 74 mg/dL (10/17)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2019-10-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-10-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2019-10-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_32/0",
  "kind": "Medication event comment",
  "when": "2020-08-17 10:02",
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
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2020-08-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2020-08-17 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_31/0",
  "kind": "Medication event comment",
  "when": "2020-08-17 10:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.1)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-08-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-08-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2020-08-17 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-08-17 09:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.1)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/83, repeat 138/79, pulse 67, wt 181 lb",
   "eGFR 83 (today)",
   "K 4.5 (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2020-08-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "semaglutide: not started by 2020-08-17 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_44/0",
  "kind": "Medication event comment",
  "when": "2021-05-07 10:11",
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
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2021-05-07 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-05-07 09:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/85, repeat 132/85, pulse 73, wt 185 lb",
   "eGFR 81 (today)",
   "K 4.6 (today)",
   "A1c 7.2% (today)",
   "LDL 51 mg/dL (today)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2021-05-07 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-02-07 13:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/74, pulse 73, wt 183 lb",
   "eGFR 81 (today)",
   "K 4.5 (today)",
   "UACR 282 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2022-02-07 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-12-29 11:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 116/76, pulse 86, wt 181 lb",
   "eGFR 81 (12/24)",
   "K 4.7 (12/24)",
   "UACR 208 mg/g (12/24)",
   "A1c 7.4% (12/24)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2022-12-29 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/0",
  "kind": "Medication event comment",
  "when": "2023-11-20 09:31",
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
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-20 09:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 136/81, pulse 72, wt 183 lb",
   "eGFR 83 (today)",
   "K 4.4 (today)",
   "UACR 229 mg/g (today)",
   "A1c 8.1% (today)",
   "LDL 68 mg/dL (today)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-01 08:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/74, pulse 81, wt 187 lb",
   "eGFR 77 (today)",
   "K 4.5 (today)",
   "UACR 269 mg/g (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_82",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-15 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/71, pulse 65, wt 185 lb",
   "eGFR 80 (today)",
   "K 4.6 (today)",
   "UACR 210 mg/g (today)",
   "A1c 7.4% (today)",
   "LDL 127 mg/dL (today)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_97",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-02-02 09:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 116/73, pulse 87, wt 184 lb",
   "eGFR 80 (today)",
   "K 4.4 (today)",
   "UACR 283 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "c_6 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_10 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
