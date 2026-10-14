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
  "when": "2020-01-20 08:42",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-01-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-01-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-01-20 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-01-20 08:42",
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
   "onset 2016-10",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-01-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-01-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-01-20 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-01-20 08:42",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-01-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-01-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-01-20 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-01-20 08:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/73, pulse 83, wt 205 lb",
   "eGFR 100 (today)",
   "K 4.9 (today)",
   "A1c 7.8% (today)",
   "LDL 109 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-01-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-01-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-01-20 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-09-25 13:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 148/88, pulse 85, wt 207 lb",
   "eGFR 101 (9/21)",
   "K 4.3 (9/21)",
   "A1c 7.7% (9/21)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-09-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-09-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-09-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2021-07-01 08:21",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.3)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-07-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-07-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2021-07-01 08:22",
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
   "chlorthalidone: not started by 2021-07-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-07-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-07-01 08:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.3)",
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 150/90, repeat 144/89, pulse 80, wt 207 lb",
   "eGFR 100 (6/28)",
   "K 4.2 (6/28)",
   "UACR 210 mg/g (6/28)",
   "A1c 8.3% (6/28)",
   "LDL 100 mg/dL (6/28)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-07-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-07-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_47/0",
  "kind": "Medication event comment",
  "when": "2022-03-07 09:36",
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
   "insulin glargine: not started by 2022-03-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-03-07 09:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/89, pulse 72, wt 205 lb",
   "eGFR 100 (3/5)",
   "K 4.3 (3/5)",
   "A1c 7.4% (3/5)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-03-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_48",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-01-27 08:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/69, pulse 72, wt 206 lb",
   "eGFR 97 (today)",
   "K 4.3 (today)",
   "A1c 7.8% (today)",
   "LDL 96 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-01-27 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-11-03 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/83, pulse 63, wt 205 lb",
   "eGFR 95 (today)",
   "K 4.6 (today)",
   "UACR 196 mg/g (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-11-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_67",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-05-31 13:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/81, pulse 80, wt 204 lb",
   "eGFR 95 (today)",
   "K 4.3 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-05-31 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_83/0",
  "kind": "Medication event comment",
  "when": "2025-01-21 13:36",
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
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-21 13:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.5)"
  ],
  "context": [
   "BP 123/70, pulse 87, wt 206 lb",
   "eGFR 95 (1/18)",
   "K 4.3 (1/18)",
   "A1c 8.5% (1/18)",
   "LDL 64 mg/dL (1/18)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-28 08:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/85, pulse 68, wt 208 lb",
   "eGFR 98 (10/25)",
   "K 4.5 (10/25)",
   "A1c 7.4% (10/25)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
