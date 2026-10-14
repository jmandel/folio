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

## Requests (33)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-02-15 11:22",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-02-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-02-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2019-02-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2019-02-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-02-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-02-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-02-15 11:22",
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
   "onset 2013-07-13",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-02-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-02-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2019-02-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2019-02-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-02-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-02-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-02-15 11:22",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-02-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-02-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2019-02-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2019-02-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-02-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-02-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-02-15 11:22",
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
   "onset 2019-05-26"
  ],
  "forbidden": [
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-02-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-02-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2019-02-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2019-02-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-02-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-02-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
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
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-02-15 10:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/88, repeat 141/87, pulse 62, wt 146 lb",
   "eGFR 63 (today)",
   "K 4.4 (today)",
   "A1c 7.2% (today)",
   "LDL 84 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-02-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-02-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2019-02-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2019-02-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-02-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-02-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-07-11 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/80, pulse 85, wt 143 lb",
   "eGFR 61 (today)",
   "K 4.4 (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-07-11 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-07-11 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2019-07-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2019-07-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-07-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-07-11 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_26",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2019-12-25 13:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/81, pulse 74, wt 146 lb",
   "eGFR 63 (today)",
   "K 4.4 (today)",
   "A1c 6.9% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-12-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2019-12-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2019-12-25 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2019-12-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-12-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-12-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_34",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-05-27 08:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/74, pulse 72, wt 150 lb",
   "eGFR 59 (5/25)",
   "K 3.9 (5/25)",
   "UACR 210 mg/g (5/25)",
   "A1c 7.1% (5/25)",
   "LDL 94 mg/dL (5/25)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-05-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-05-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2020-05-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2020-05-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-05-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-05-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_55/0",
  "kind": "Problem list comment",
  "when": "2020-10-20 16:25",
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
   "onset 2020-10-20",
   "supporting result: eGFR 59 (5/25)",
   "supporting result: eGFR 59 (today)",
   "supporting result: UACR 210 mg/g (5/25)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-10-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-10-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2020-10-20 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2020-10-20 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-10-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-10-20 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-10-26 10:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 160/103, repeat 157/103, pulse 67, wt 147 lb",
   "eGFR 59 (10/20)",
   "K 4.3 (10/20)",
   "A1c 7.3% (10/20)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-10-26 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2020-10-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2020-10-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2020-10-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-10-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-10-26 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2021-04-19 16:01",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2021-04-19 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2021-04-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-04-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2021-04-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-04-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-04-19 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-04-19 15:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 144/83, pulse 74, wt 146 lb",
   "eGFR 60 (today)",
   "K 4.3 (today)",
   "UACR 317 mg/g (today)",
   "A1c 7.5% (today)",
   "LDL 111 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2021-04-19 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2021-04-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-04-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2021-04-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-04-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-04-19 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2021-08-25 11:31",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2021-08-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2021-08-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-08-25 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2021-08-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-08-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-08-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_257/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-08-25 11:55",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 59, UACR 263 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2021-08-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2021-08-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-08-25 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2021-08-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-08-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-08-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_68",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-08-25 11:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/86, repeat 140/83, pulse 79, wt 148 lb",
   "eGFR 60 (8/20)",
   "K 4.6 (8/20)",
   "A1c 7.4% (8/20)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2021-08-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2021-08-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-08-25 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2021-08-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-08-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-08-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_265",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2021-11-15 09:46",
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
   "dapagliflozin: not started by 2021-11-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2021-11-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-11-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2021-11-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-11-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-01-03 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/82, pulse 76, wt 151 lb",
   "eGFR 59 (12/30/21)",
   "K 4.2 (12/30/21)",
   "A1c 7.1% (12/30/21)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2022-01-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-01-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2022-01-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2022-01-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-01-03 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_83",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-06-24 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink."
   }
  ],
  "mustInclude": [],
  "context": [
   "BP 135/74, pulse 74, wt 147 lb",
   "eGFR 59 (today)",
   "K 4.4 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2022-06-24 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-06-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2022-06-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2022-06-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-06-24 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_90",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-10-25 13:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/84, pulse 82, wt 147 lb",
   "eGFR 59 (10/19)",
   "K 4.3 (10/19)",
   "UACR 331 mg/g (10/19)",
   "A1c 7.1% (10/19)",
   "LDL 103 mg/dL (10/19)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2022-10-25 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-10-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2022-10-25 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2022-10-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-10-25 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_101",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-03-01 08:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/83, pulse 73, wt 146 lb",
   "eGFR 59 (2/23)",
   "K 4.4 (2/23)",
   "UACR 438 mg/g (2/23)",
   "A1c 7.6% (2/23)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2023-03-01 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2023-03-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-03-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-03-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-03-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_119/0",
  "kind": "Medication event comment",
  "when": "2023-06-30 09:22",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2023-06-30 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-06-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-06-30 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_118/0",
  "kind": "Medication event comment",
  "when": "2023-06-30 09:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: CKD + DM, cardiorenal benefit"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2023-06-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-06-30 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-06-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-06-30 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_109",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-06-30 09:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/90, pulse 83, wt 148 lb",
   "eGFR 58 (6/27)",
   "K 4 (6/27)",
   "A1c 7.9% (6/27)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2023-06-30 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-06-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-06-30 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_134/0",
  "kind": "Medication event comment",
  "when": "2023-12-11 08:32",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2023-12-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_133/0",
  "kind": "Medication event comment",
  "when": "2023-12-11 08:31",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.3)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2023-12-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-12-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_120",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-12-11 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.3)",
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/96, pulse 69, wt 147 lb",
   "eGFR 57 (12/6)",
   "K 4.5 (12/6)",
   "A1c 8.3% (12/6)",
   "LDL 80 mg/dL (12/6)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2023-12-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_135",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-04-15 09:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/73, pulse 77, wt 149 lb",
   "eGFR 59 (4/9)",
   "K 4.4 (4/9)",
   "UACR 595 mg/g (4/9)",
   "A1c 7.7% (4/9)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-04-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_143",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-08 12:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/71, pulse 86, wt 146 lb",
   "eGFR 56 (today)",
   "K 4.4 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-10-08 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_161/0",
  "kind": "Medication event comment",
  "when": "2025-03-20 08:31",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.4)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_150",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-03-20 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.4)"
  ],
  "context": [
   "BP 120/78, pulse 87, wt 148 lb",
   "eGFR 58 (3/18)",
   "K 4.6 (3/18)",
   "UACR 653 mg/g (3/18)",
   "A1c 8.4% (3/18)",
   "LDL 50 mg/dL (3/18)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_162",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-08-25 10:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/78, pulse 62, wt 148 lb",
   "eGFR 56 (8/21)",
   "K 4.6 (8/21)",
   "A1c 7.5% (8/21)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_169",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-01-05 14:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/74, pulse 67, wt 147 lb",
   "eGFR 52 (today)",
   "K 4.3 (today)",
   "UACR 750 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_176",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-05-20 14:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/68, pulse 85, wt 146 lb",
   "eGFR 54 (5/18)",
   "K 4.5 (5/18)",
   "A1c 7.7% (5/18)",
   "LDL 73 mg/dL (5/18)"
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
