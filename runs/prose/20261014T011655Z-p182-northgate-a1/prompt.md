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

## Requests (15)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2023-03-13 16:22",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-03-13 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-03-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2023-03-13 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2023-03-13 16:22",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-03-13 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-03-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2023-03-13 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2023-03-13 16:22",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2021-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-03-13 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-03-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2023-03-13 (pattern /\\b(furosemide|Lasix)\\b/i)"
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
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2023-03-13 15:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/86, repeat 136/84, pulse 80, wt 207 lb",
   "eGFR 70 (today)",
   "K 4.5 (today)",
   "A1c 7.2% (today)",
   "LDL 116 mg/dL (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-03-13 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-03-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2023-03-13 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2023-11-22 12:31",
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
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-11-22 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-11-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2023-11-22 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-22 12:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 144/88, repeat 142/85, pulse 83, wt 203 lb",
   "eGFR 72 (11/20)",
   "K 4.6 (11/20)",
   "A1c 7.4% (11/20)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-11-22 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-11-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2023-11-22 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2024-06-25 13:51",
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
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2024-06-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2024-06-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2024-06-25 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-06-25 13:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/85, repeat 133/81, pulse 78, wt 203 lb",
   "eGFR 68 (6/21)",
   "K 4.4 (6/21)",
   "A1c 7.9% (6/21)",
   "LDL 154 mg/dL (6/21)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2024-06-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2024-06-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2024-06-25 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_52",
  "kind": "Chart correction comment",
  "when": "2024-07-17 08:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The furosemide 40 mg start entered 2024-07-16 was wrong patient"
  ],
  "context": [
   "furosemide: entered in error today (wrong patient)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2024-07-17 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2024-07-17 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2025-03-10 16:02",
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
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_39/0",
  "kind": "Medication event comment",
  "when": "2025-03-10 16:01",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.3)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2025-03-10 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/3",
  "kind": "Medication event comment",
  "when": "2025-03-10 16:17",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold lisinopril 40 MG Oral Tablet 40 mg QD; reason: K 6.1 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: held today (K 6.1 confirmed on repeat); review 2025-03-24"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-03-10 15:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.3)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/86, pulse 66, wt 201 lb",
   "eGFR 69 (3/4)",
   "K 4.3 (3/4)",
   "A1c 8.3% (3/4)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_58",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2025-03-10 16:11",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: held today (K 6.1 confirmed on repeat); review 2025-03-24"
  ],
  "context": [
   "K 6.1 (today)",
   "K 6 (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-11-25 14:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/72, pulse 72, wt 204 lb",
   "eGFR 66 (today)",
   "K 4.4 (today)",
   "A1c 7.2% (today)",
   "LDL 174 mg/dL (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
