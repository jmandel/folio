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
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2019-01-02 08:31",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.4)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-01-02 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-01-02 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-01-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-01-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-01-02 08:42",
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
   "onset 2010-04",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-01-02 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-01-02 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-01-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-01-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-01-02 08:42",
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
   "onset 2009",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-01-02 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-01-02 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-01-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-01-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-01-02 08:42",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-01-02 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-01-02 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-01-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-01-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-01-02 08:42",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-01-02 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-01-02 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-01-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-01-02 (pattern /\\b(glargine|Lantus)\\b/i)"
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
  "when": "2019-01-02 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.4)"
  ],
  "context": [
   "BP 133/74, pulse 78, wt 150 lb",
   "eGFR 46 (today)",
   "K 4.6 (today)",
   "UACR 305 mg/g (today)",
   "A1c 8.4% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-01-02 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-01-02 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-01-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-01-02 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2019-05-30 15:06",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 44"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-05-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-05-30 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-05-30 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-05-30 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_28/0",
  "kind": "Problem list comment",
  "when": "2019-05-30 15:17",
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
   "onset 2019-05-30",
   "supporting result: eGFR 46 (1/2)",
   "supporting result: eGFR 44 (today)",
   "supporting result: UACR 422 mg/g (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-05-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-05-30 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-05-30 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-05-30 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-05-30 14:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "context": [
   "BP 126/74, pulse 80, wt 151 lb",
   "eGFR 44 (today)",
   "K 4.5 (today)",
   "UACR 422 mg/g (today)",
   "A1c 7.3% (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-05-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-05-30 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-05-30 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-05-30 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2019-10-16 10:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/75, pulse 67, wt 149 lb",
   "eGFR 45 (10/11)",
   "K 4.7 (10/11)",
   "UACR 418 mg/g (10/11)",
   "A1c 8% (10/11)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2019-10-16 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "losartan: not started by 2019-10-16 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2019-10-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-10-16 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_50/0",
  "kind": "Allergy list comment",
  "when": "2020-04-13 10:39",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "lisinopril: dry cough (intolerance)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema)."
  ],
  "context": [
   "lisinopril intolerance: dry cough"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2020-04-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-04-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_48/0",
  "kind": "Medication event comment",
  "when": "2020-04-13 10:36",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.6, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.6, CKD)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2020-04-13 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2020-04-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-04-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2020-04-13 10:37",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 20 MG Oral Tablet 20 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2020-04-13 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2020-04-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-04-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_49/0",
  "kind": "Medication event comment",
  "when": "2020-04-13 10:38",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start losartan potassium 50 MG Oral Tablet 50 mg QD; reason: ACE inhibitor cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: started 50 mg daily today (ACE inhibitor cough)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2020-04-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-04-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_37",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-04-13 10:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.6, CKD)",
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 132/76, pulse 72, wt 148 lb",
   "eGFR 43 (today)",
   "K 4.5 (today)",
   "UACR 559 mg/g (today)",
   "A1c 8.6% (today)",
   "LDL 106 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2020-04-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-04-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-09-04 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/67, pulse 67, wt 151 lb",
   "eGFR 38 (today)",
   "K 4.5 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2020-09-04 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-09-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-01-05 10:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/84, pulse 63, wt 151 lb",
   "eGFR 43 (1/2)",
   "K 4.7 (1/2)",
   "UACR 467 mg/g (1/2)",
   "A1c 8% (1/2)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2021-01-05 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2021-01-05 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_76/0",
  "kind": "Medication event comment",
  "when": "2021-06-11 15:51",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2021-06-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_187/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-06-11 16:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 40, UACR 669 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2021-06-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-06-11 15:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "context": [
   "BP 131/75, pulse 66, wt 149 lb",
   "eGFR 40 (today)",
   "K 4.4 (today)",
   "A1c 8.2% (today)",
   "LDL 112 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2021-06-11 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-12-07 13:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/79, pulse 73, wt 145 lb",
   "eGFR 38 (today)",
   "K 4.6 (today)",
   "UACR 678 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2021-12-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-04-07 14:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/73, pulse 74, wt 149 lb",
   "eGFR 40 (today)",
   "K 4.6 (today)",
   "UACR 735 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2022-04-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-09-12 10:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/79, pulse 69, wt 151 lb",
   "eGFR 39 (today)",
   "K 4.9 (today)",
   "A1c 7.4% (today)",
   "LDL 123 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2022-09-12 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-02-17 15:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/85, pulse 69, wt 149 lb",
   "eGFR 42 (2/15)",
   "K 4.4 (2/15)",
   "UACR 914 mg/g (2/15)",
   "A1c 7.8% (2/15)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2023-02-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_117/0",
  "kind": "Medication event comment",
  "when": "2023-07-05 09:51",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_110",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-07-05 09:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 141/80, repeat 134/79, pulse 76, wt 146 lb",
   "eGFR 39 (today)",
   "K 4.2 (today)",
   "UACR 1009 mg/g (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_118",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-12-01 09:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/82, pulse 78, wt 150 lb",
   "eGFR 42 (today)",
   "K 4.3 (today)",
   "A1c 7.5% (today)",
   "LDL 99 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_128",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-04-02 12:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/85, pulse 86, wt 150 lb",
   "eGFR 37 (today)",
   "K 4.6 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_134",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-09-16 12:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/78, pulse 63, wt 149 lb",
   "eGFR 40 (today)",
   "K 4.7 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_140",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-04 12:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/77, pulse 78, wt 148 lb",
   "eGFR 36 (1/31)",
   "K 4.9 (1/31)",
   "UACR 1436 mg/g (1/31)",
   "A1c 8.2% (1/31)",
   "LDL 105 mg/dL (1/31)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_151",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-06-13 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/71, pulse 64, wt 151 lb",
   "eGFR 35 (6/7)",
   "K 4.9 (6/7)",
   "A1c 8.1% (6/7)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_158",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-10-24 13:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/72, pulse 86, wt 156 lb",
   "eGFR 35 (10/22)",
   "K 4.7 (10/22)",
   "UACR 2186 mg/g (10/22)",
   "A1c 9% (10/22)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_166",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-03-16 14:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/82, pulse 85, wt 149 lb",
   "eGFR 33 (3/13)",
   "K 4.3 (3/13)",
   "UACR 1764 mg/g (3/13)",
   "A1c 8.3% (3/13)",
   "LDL 81 mg/dL (3/13)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_178",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-07-27 13:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/93, repeat 142/90, pulse 72, wt 148 lb",
   "eGFR 34 (today)",
   "K 4.2 (today)",
   "A1c 8.4% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
