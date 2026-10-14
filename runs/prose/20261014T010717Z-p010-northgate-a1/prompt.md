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
  "when": "2022-04-08 13:22",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2022-04-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-04-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-04-08 13:22",
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
   "onset 2014-07",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2022-04-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-04-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-04-08 13:22",
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
   "onset 2020",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2022-04-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-04-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
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
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-04-08 12:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 154/94, pulse 71, wt 159 lb",
   "eGFR 70 (today)",
   "K 4.2 (today)",
   "LDL 156 mg/dL (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2022-04-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-04-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2023-03-02 10:41",
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
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-03-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-03-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_16",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2023-03-02 10:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 154/94, repeat 147/93, pulse 66, wt 159 lb",
   "eGFR 70 (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-03-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-03-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_63/0",
  "kind": "Allergy list comment",
  "when": "2023-04-03 11:39",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-04-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-04-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_65/0",
  "kind": "Medication event comment",
  "when": "2023-04-03 11:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start amlodipine 5 MG Oral Tablet 5 mg QD; reason: replacing lisinopril (angioedema)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "amlodipine: started 5 mg daily today (replacing lisinopril (angioedema))"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-04-03 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2023-04-03 11:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-04-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-04-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2023-04-03 11:19",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril allergy: angioedema of lips and tongue",
   "lisinopril: stopped today (angioedema)",
   "amlodipine: started 5 mg daily today (replacing lisinopril (angioedema))"
  ],
  "context": [
   "Angioedema"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-04-03 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/4",
  "kind": "Medication event comment",
  "when": "2023-11-15 16:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold lisinopril 40 MG Oral Tablet 40 mg QD; reason: K 5.6 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: held today (K 5.6 confirmed on repeat); review 2023-11-29"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-11-15 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/3",
  "kind": "Medication event comment",
  "when": "2023-11-15 13:31",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start lisinopril 40 MG Oral Tablet 40 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-11-15 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_24",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2023-11-15 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: held today (K 5.6 confirmed on repeat); review 2023-11-29"
  ],
  "context": [
   "BP 143/80, pulse 78, wt 157 lb",
   "eGFR 68 (today)",
   "K 4.6 (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-11-15 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2023-11-15 15:55",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: held today (K 5.6 confirmed on repeat); review 2023-11-29"
  ],
  "context": [
   "K 5.6 (today)",
   "K 5.5 (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-11-15 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_35/0",
  "kind": "Medication event comment",
  "when": "2024-09-10 10:21",
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
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-09-10 10:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 162/104, pulse 73, wt 162 lb",
   "eGFR 67 (today)",
   "K 4.9 (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_48/0",
  "kind": "Medication event comment",
  "when": "2025-07-22 15:36",
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
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_36",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-22 15:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/88, pulse 77, wt 160 lb",
   "eGFR 67 (today)",
   "K 4.2 (today)",
   "LDL 116 mg/dL (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-03-31 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/86, pulse 81, wt 164 lb",
   "eGFR 68 (today)",
   "K 4.1 (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_5 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
