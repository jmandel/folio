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

## Requests (26)

```json
[
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2020-06-15 12:11",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.1)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-06-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-06-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2020-06-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-06-15 12:22",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-06-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-06-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2020-06-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-06-15 12:22",
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
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-06-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-06-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2020-06-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-06-15 12:22",
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
   "onset 2019-07",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-06-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-06-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2020-06-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
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
  "when": "2020-06-15 11:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.1)"
  ],
  "context": [
   "BP 152/90, repeat 145/87, pulse 85, wt 202 lb",
   "eGFR 67 (today)",
   "K 4.4 (today)",
   "UACR 201 mg/g (today)",
   "A1c 8.1% (today)",
   "LDL 115 mg/dL (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-06-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-06-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2020-06-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2020-11-11 10:36",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2020-11-11 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-11-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2020-11-11 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-11-11 10:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 154/97, pulse 66, wt 200 lb",
   "eGFR 61 (today)",
   "K 4.4 (today)",
   "UACR 243 mg/g (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-11-11 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-11-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2020-11-11 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2021-03-16 16:11",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2021-03-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-03-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2021-03-16 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-03-16 15:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/86, repeat 144/84, pulse 68, wt 198 lb",
   "eGFR 65 (today)",
   "K 4.4 (today)",
   "UACR 265 mg/g (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-03-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-03-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2021-03-16 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_54/0",
  "kind": "Medication event comment",
  "when": "2021-09-09 16:01",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2021-09-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2021-09-09 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-09-09 15:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 153/96, repeat 150/95, pulse 78, wt 197 lb",
   "eGFR 59 (today)",
   "K 4.4 (today)",
   "UACR 251 mg/g (today)",
   "A1c 7.8% (today)",
   "LDL 103 mg/dL (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2021-09-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2021-09-09 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_62/0",
  "kind": "Medication event comment",
  "when": "2022-02-07 12:11",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-02-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-02-07 11:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 153/93, pulse 70, wt 199 lb",
   "eGFR 60 (2/5)",
   "K 4.3 (2/5)",
   "A1c 7.8% (2/5)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-02-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_72/0",
  "kind": "Problem list comment",
  "when": "2022-06-08 09:17",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2022-06-08",
   "supporting result: eGFR 60 (2/5)",
   "supporting result: eGFR 59 (today)",
   "supporting result: UACR 251 mg/g (9/9/21)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-06-08 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_63",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-06-08 08:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 149/81, repeat 141/78, pulse 69, wt 199 lb",
   "eGFR 59 (today)",
   "K 4.6 (today)",
   "A1c 7.1% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-06-08 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-10-27 10:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/84, pulse 69, wt 198 lb",
   "eGFR 60 (today)",
   "K 4.5 (today)",
   "A1c 7% (today)",
   "LDL 159 mg/dL (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-10-27 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_86",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-05 12:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/86, repeat 136/86, pulse 77, wt 200 lb",
   "eGFR 55 (today)",
   "K 4.5 (today)",
   "UACR 414 mg/g (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-04-05 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_94",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-08-08 14:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/75, pulse 62, wt 199 lb",
   "eGFR 56 (today)",
   "K 4.5 (today)",
   "UACR 287 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-08-08 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_111/0",
  "kind": "Medication event comment",
  "when": "2023-12-14 10:11",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.5, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.5, CKD)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_104",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-12-14 09:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.5, CKD)"
  ],
  "context": [
   "BP 133/83, pulse 80, wt 198 lb",
   "eGFR 56 (12/11)",
   "K 4.5 (12/11)",
   "UACR 335 mg/g (12/11)",
   "A1c 8.5% (12/11)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_112",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-04-23 09:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/72, pulse 78, wt 202 lb",
   "eGFR 57 (today)",
   "K 4.3 (today)",
   "A1c 7.6% (today)",
   "LDL 118 mg/dL (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_122",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-03 10:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/70, pulse 68, wt 199 lb",
   "eGFR 54 (8/30)",
   "K 4.1 (8/30)",
   "A1c 7.9% (8/30)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_128",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-20 11:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/74, pulse 64, wt 203 lb",
   "eGFR 53 (today)",
   "K 4.6 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_135",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-07-04 10:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/82, repeat 135/79, pulse 87, wt 201 lb",
   "eGFR 53 (7/2)",
   "K 4.8 (7/2)",
   "UACR 230 mg/g (7/2)",
   "A1c 7.7% (7/2)",
   "LDL 189 mg/dL (7/2)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_146",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-11-03 15:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/86, repeat 135/83, pulse 70, wt 194 lb",
   "eGFR 48 (10/28)",
   "K 4.9 (10/28)",
   "A1c 7.7% (10/28)"
  ],
  "forbidden": [
   "c_3 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_6 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_152",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-03-11 15:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/83, pulse 67, wt 201 lb",
   "eGFR 49 (3/9)",
   "K 4.9 (3/9)",
   "A1c 7.4% (3/9)"
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
