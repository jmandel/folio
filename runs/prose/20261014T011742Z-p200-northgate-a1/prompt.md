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

## Requests (35)

```json
[
 {
  "key": "B/med/m_17/0",
  "kind": "Medication event comment",
  "when": "2019-08-06 11:07",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 9.2, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 9.2, CKD)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-08-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-08-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2019-08-06 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2019-08-06 11:06",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 42"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2019-08-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "dulaglutide: not started by 2019-08-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-08-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2019-08-06 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-08-06 11:17",
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
   "dulaglutide: not started by 2019-08-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-08-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2019-08-06 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-08-06 11:17",
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
   "onset 2011-02-21",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-08-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-08-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2019-08-06 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-08-06 11:17",
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
   "onset 2004",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-08-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-08-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2019-08-06 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-08-06 11:17",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-08-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-08-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2019-08-06 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-08-06 10:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)",
   "dapagliflozin: started 10 mg daily today (A1c 9.2, CKD)"
  ],
  "context": [
   "BP 133/78, pulse 66, wt 209 lb",
   "eGFR 44 (8/4)",
   "K 4.7 (8/4)",
   "A1c 9.2% (8/4)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-08-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-08-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2019-08-06 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_32/0",
  "kind": "Problem list comment",
  "when": "2020-01-22 15:52",
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
   "onset 2020-01-22",
   "supporting result: eGFR 44 (8/4/19)",
   "supporting result: eGFR 45 (today)",
   "supporting result: UACR 229 mg/g (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-01-22 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-01-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-01-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-01-22 15:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/79, pulse 87, wt 210 lb",
   "eGFR 45 (today)",
   "K 4.8 (today)",
   "UACR 229 mg/g (today)",
   "A1c 8.3% (today)",
   "LDL 151 mg/dL (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-01-22 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-01-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-01-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2020-06-25 11:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.6"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.6)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-06-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-06-25 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-06-25 10:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.6)"
  ],
  "context": [
   "BP 129/76, pulse 74, wt 212 lb",
   "eGFR 43 (6/21)",
   "K 4.7 (6/21)",
   "UACR 161 mg/g (6/21)",
   "A1c 8.6% (6/21)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-06-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-06-25 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-10-23 08:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/81, pulse 62, wt 212 lb",
   "eGFR 42 (today)",
   "K 4.5 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-10-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-10-23 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_48",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-03-29 12:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/70, pulse 80, wt 209 lb",
   "eGFR 43 (today)",
   "K 4.7 (today)",
   "UACR 202 mg/g (today)",
   "A1c 7.6% (today)",
   "LDL 110 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-03-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2021-03-29 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_183/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-08-03 09:25",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 43, UACR 248 mg/g: CKD evaluation and management"
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
   "insulin glargine: not started by 2021-08-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2021-08-03 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-08-03 08:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/87, repeat 136/86, pulse 83, wt 212 lb",
   "eGFR 43 (today)",
   "K 4.5 (today)",
   "UACR 248 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-08-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2021-08-03 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_76/0",
  "kind": "Medication event comment",
  "when": "2021-11-29 09:36",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.6"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.6)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-11-29 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2021-11-29 09:37",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2021-11-29 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_69",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-11-29 09:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.6)",
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/90, repeat 144/88, pulse 86, wt 212 lb",
   "eGFR 42 (11/25)",
   "K 4.8 (11/25)",
   "UACR 240 mg/g (11/25)",
   "A1c 8.6% (11/25)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-11-29 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_87/0",
  "kind": "Medication event comment",
  "when": "2022-04-06 15:36",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-04-06 15:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/85, pulse 75, wt 212 lb",
   "eGFR 40 (today)",
   "K 4.9 (today)",
   "A1c 7.6% (today)",
   "LDL 102 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_88",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-21 12:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/77, pulse 78, wt 210 lb",
   "eGFR 37 (today)",
   "K 4.3 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_76/1",
  "kind": "Medication event comment",
  "when": "2023-02-08 13:41",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.2)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_98",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-02-08 13:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 142/94, repeat 135/92, pulse 80, wt 213 lb",
   "eGFR 40 (2/5)",
   "K 4.8 (2/5)",
   "A1c 8.2% (2/5)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_105",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-13 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/88, pulse 86, wt 212 lb",
   "eGFR 39 (today)",
   "K 4.3 (today)",
   "UACR 393 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_112",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-12-05 10:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/79, pulse 72, wt 208 lb",
   "eGFR 38 (12/1)",
   "K 4.6 (12/1)",
   "UACR 429 mg/g (12/1)",
   "A1c 6.9% (12/1)",
   "LDL 117 mg/dL (12/1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_123",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-05-07 13:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/78, pulse 83, wt 213 lb",
   "eGFR 37 (today)",
   "K 5 (today)",
   "A1c 6.7% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2024-06-10 09:54",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: vomiting, poor oral intake"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: held today (vomiting, poor oral intake); review 2024-06-17"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_181",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2024-06-10 09:49",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2024-06-17"
  ],
  "context": [],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/3",
  "kind": "Medication event comment",
  "when": "2024-06-18 13:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "resume metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eating and drinking normally"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_182",
  "kind": "Primary care phone visit note (reason: Phone: feeling better)",
  "when": "2024-06-18 13:41",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "context": [],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_130",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-18 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/88, repeat 136/84, pulse 65, wt 212 lb",
   "eGFR 37 (today)",
   "K 4.6 (today)",
   "UACR 363 mg/g (today)",
   "A1c 6.9% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_137",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-02-03 12:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/77, pulse 78, wt 213 lb",
   "eGFR 36 (2/1)",
   "K 4.3 (2/1)",
   "UACR 603 mg/g (2/1)",
   "A1c 6.6% (2/1)",
   "LDL 93 mg/dL (2/1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_152",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-15 14:00",
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
   "BP 136/83, pulse 82, wt 215 lb",
   "eGFR 34 (today)",
   "K 4.5 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_160",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-12-01 14:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/80, pulse 81, wt 210 lb",
   "eGFR 35 (11/26)",
   "K 4.7 (11/26)",
   "A1c 9.1% (11/26)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_166",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-04-29 14:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/80, pulse 76, wt 213 lb",
   "eGFR 31 (4/23)",
   "K 4.6 (4/23)",
   "UACR 508 mg/g (4/23)",
   "A1c 8.4% (4/23)",
   "LDL 120 mg/dL (4/23)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
