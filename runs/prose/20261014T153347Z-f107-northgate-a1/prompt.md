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

## Requests (30)

```json
[
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2019-05-20 12:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.8"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.8)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dulaglutide: not started by 2019-05-20 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-05-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2019-05-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-05-20 12:47",
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
   "onset 2005",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dulaglutide: not started by 2019-05-20 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-05-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2019-05-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-05-20 12:47",
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
   "onset 2014-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dulaglutide: not started by 2019-05-20 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-05-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2019-05-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-05-20 12:47",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dulaglutide: not started by 2019-05-20 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-05-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2019-05-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-05-20 12:47",
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
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dulaglutide: not started by 2019-05-20 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-05-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2019-05-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
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
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-05-20 12:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.8)"
  ],
  "context": [
   "BP 130/74, pulse 85, wt 185 lb",
   "eGFR 85 (today)",
   "K 4.6 (today)",
   "A1c 8.8% (today)",
   "LDL 96 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dulaglutide: not started by 2019-05-20 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-05-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2019-05-20 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-10-29 09:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/76, pulse 82, wt 185 lb",
   "eGFR 85 (today)",
   "K 4.4 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dulaglutide: not started by 2019-10-29 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-10-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2019-10-29 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_30",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-02-24 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/76, pulse 77, wt 183 lb",
   "eGFR 84 (today)",
   "K 4.3 (today)",
   "UACR 42 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dulaglutide: not started by 2020-02-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-02-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2020-02-24 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-07-24 12:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/83, pulse 85, wt 187 lb",
   "eGFR 83 (today)",
   "K 4.1 (today)",
   "UACR 56 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dulaglutide: not started by 2020-07-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-07-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2020-07-24 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_58/0",
  "kind": "Medication event comment",
  "when": "2020-12-30 11:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2020-12-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2020-12-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_51",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-12-30 11:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 139/84, pulse 65, wt 186 lb",
   "eGFR 81 (12/25)",
   "K 4.4 (12/25)",
   "UACR 34 mg/g (12/25)",
   "A1c 8.1% (12/25)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2020-12-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2020-12-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-05-12 14:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/87, pulse 77, wt 189 lb",
   "eGFR 86 (today)",
   "K 4.3 (today)",
   "UACR 35 mg/g (today)",
   "A1c 6.9% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2021-05-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2021-05-12 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_70",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-11-02 11:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/83, pulse 85, wt 185 lb",
   "eGFR 84 (today)",
   "K 4.5 (today)",
   "A1c 6.6% (today)",
   "LDL 93 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2021-11-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2021-11-02 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_81",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-03-08 10:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/77, pulse 86, wt 186 lb",
   "eGFR 84 (3/5)",
   "K 4.3 (3/5)",
   "UACR 53 mg/g (3/5)",
   "A1c 6.9% (3/5)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2022-03-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-03-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-08-08 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/84, pulse 62, wt 186 lb",
   "eGFR 81 (today)",
   "K 5.9 (today), hemolyzed",
   "A1c 6.9% (today)",
   "K 4.7 (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2022-08-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2022-08-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_100",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-01-09 14:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/85, pulse 86, wt 182 lb",
   "eGFR 81 (1/6)",
   "K 4.2 (1/6)",
   "A1c 7.3% (1/6)",
   "LDL 85 mg/dL (1/6)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2023-01-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2023-01-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_110",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-12 13:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/76, pulse 77, wt 187 lb",
   "eGFR 83 (today)",
   "K 4.5 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2023-06-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2023-06-12 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_116",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-11-14 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/82, pulse 70, wt 185 lb",
   "eGFR 82 (11/8)",
   "K 4.2 (11/8)",
   "A1c 7.5% (11/8)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2023-11-14 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2023-11-14 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_122",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-05-09 15:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/82, pulse 80, wt 184 lb",
   "eGFR 82 (today)",
   "K 3.9 (today)",
   "A1c 7.6% (today)",
   "LDL 82 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2024-05-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2024-05-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_136",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-30 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/83, pulse 68, wt 183 lb",
   "eGFR 83 (today)",
   "K 4 (today)",
   "UACR 36 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "insulin glargine: not started by 2024-09-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dapagliflozin: not started by 2024-09-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_154/0",
  "kind": "Medication event comment",
  "when": "2025-02-13 13:12",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_153/0",
  "kind": "Medication event comment",
  "when": "2025-02-13 13:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "dapagliflozin: not started by 2025-02-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_144",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-13 12:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.4)",
   "dapagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "context": [
   "BP 134/82, pulse 62, wt 186 lb",
   "eGFR 82 (today)",
   "K 4.7 (today)",
   "A1c 8.4% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_155",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-01 09:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/80, pulse 77, wt 183 lb",
   "eGFR 82 (today)",
   "K 4.6 (today)",
   "A1c 7.3% (today)",
   "LDL 84 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_233/0",
  "kind": "Allergy list comment",
  "when": "2025-09-09 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "dapagliflozin: euglycemic diabetic ketoacidosis (adverse-reaction)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_154/1",
  "kind": "Medication event comment",
  "when": "2025-09-09 10:07",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: euglycemic DKA"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: stopped today (euglycemic DKA)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_232",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-09-09 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: stopped today (euglycemic DKA)",
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 123/78, pulse 62, wt 185 lb"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_165",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-11-18 10:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/76, pulse 64, wt 186 lb",
   "eGFR 82 (today)",
   "K 4.2 (today)",
   "UACR 46 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_172",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-04-13 14:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/70, pulse 76, wt 183 lb",
   "eGFR 85 (today)",
   "K 4.5 (today)",
   "UACR 47 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_180",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-08-14 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/81, pulse 85, wt 185 lb",
   "eGFR 82 (today)",
   "K 4.6 (today)",
   "UACR 46 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 86 mg/dL (today)"
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
