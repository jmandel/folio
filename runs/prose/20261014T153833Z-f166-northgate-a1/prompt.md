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

## Requests (23)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-02-18 10:52",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-02-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2020-02-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-02-18 10:52",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-02-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2020-02-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-02-18 10:52",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-02-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2020-02-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-02-18 10:52",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-02-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2020-02-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2020-02-18 10:52",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-02-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2020-02-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
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
  "when": "2020-02-18 10:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/93, pulse 74, wt 221 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-02-18 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2020-02-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_12",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-09-24 13:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/83, pulse 63, wt 223 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2020-09-24 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2020-09-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-09-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2021-07-09 10:06",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2021-07-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2021-07-09 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-07-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_14",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-07-09 09:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/94, repeat 142/90, pulse 62, wt 219 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2021-07-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2021-07-09 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-07-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_16",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-03-10 09:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/80, pulse 86, wt 220 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2022-03-10 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2022-03-10 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-03-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2022-12-27 11:06",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.2)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2022-12-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2022-12-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-12-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-12-27 10:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.2)"
  ],
  "context": [
   "BP 147/88, repeat 143/87, pulse 77, wt 221 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2022-12-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2022-12-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-12-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-11-15 09:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/86, pulse 69, wt 221 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dapagliflozin: not started by 2023-11-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "semaglutide: not started by 2023-11-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2023-11-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_24/0",
  "kind": "Medication event comment",
  "when": "2024-09-27 14:51",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2024-09-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2024-09-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-09-27 14:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "context": [
   "BP 154/93, repeat 149/92, pulse 88, wt 221 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2024-09-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2024-09-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_94/0",
  "kind": "Allergy list comment",
  "when": "2025-06-02 15:25",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2025-06-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2025-06-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_24/1",
  "kind": "Medication event comment",
  "when": "2025-06-02 15:22",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2025-06-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2025-06-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_93",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-06-02 15:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed."
   }
  ],
  "mustInclude": [
   "dapagliflozin: stopped today (euglycemic DKA)",
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 142/78, repeat 136/75, pulse 79, wt 223 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2025-06-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2025-06-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2025-08-05 13:41",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2025-08-05 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2025-08-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-08-05 13:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/79, pulse 88, wt 225 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2025-08-05 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2025-08-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_30/0",
  "kind": "Medication event comment",
  "when": "2026-05-08 13:52",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_29/0",
  "kind": "Medication event comment",
  "when": "2026-05-08 13:51",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2026-05-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-05-08 13:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.2)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 161/99, pulse 63, wt 220 lb"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
