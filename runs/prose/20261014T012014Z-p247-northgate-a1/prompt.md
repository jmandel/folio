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

## Requests (32)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-01-22 09:17",
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
   "onset 2010-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-01-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-01-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-01-22 09:17",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-01-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-01-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-01-22 09:17",
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
   "onset 2009-01-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-01-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-01-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-01-22 09:17",
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
   "onset 2011-08",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-01-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-01-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2019-01-22 09:17",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Heart failure with reduced ejection fraction\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Heart failure with reduced ejection fraction",
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-01-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-01-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_6/0",
  "kind": "Problem list comment",
  "when": "2019-01-22 09:17",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-01-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-01-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_14",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-01-22 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/78, pulse 69, wt 228 lb",
   "eGFR 75 (today)",
   "K 4.9 (today)",
   "A1c 7.7% (today)",
   "LDL 83 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-01-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-01-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-01-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_31/0",
  "kind": "Medication event comment",
  "when": "2019-07-03 11:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-07-03 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-07-03 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-07-03 10:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "context": [
   "BP 134/78, pulse 62, wt 228 lb",
   "eGFR 75 (today)",
   "K 4.5 (today)",
   "A1c 8.3% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-07-03 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-07-03 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-12-13 14:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/84, pulse 82, wt 226 lb",
   "eGFR 73 (today)",
   "K 4 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2019-12-13 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2019-12-13 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_39",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-04-27 11:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/84, pulse 67, wt 229 lb",
   "eGFR 71 (today)",
   "K 4.1 (today)",
   "A1c 7.2% (today)",
   "LDL 78 mg/dL (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-04-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-09-11 13:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/75, pulse 75, wt 227 lb",
   "eGFR 71 (today)",
   "K 4.8 (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-09-11 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2020-09-11 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-01-18 15:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/83, pulse 72, wt 227 lb",
   "eGFR 71 (today)",
   "K 4.3 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-01-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-01-18 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_182/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-06-22 10:05",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 70, UACR 930 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-06-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-06-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-06-22 09:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/80, pulse 82, wt 227 lb",
   "eGFR 68 (6/17)",
   "K 4.7 (6/17)",
   "UACR 679 mg/g (6/17)",
   "A1c 7.5% (6/17)",
   "LDL 94 mg/dL (6/17)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-06-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-06-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-11-15 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/87, pulse 72, wt 229 lb",
   "eGFR 69 (today)",
   "K 4.4 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-11-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2021-11-15 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-04-21 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/85, repeat 136/81, pulse 81, wt 229 lb",
   "eGFR 67 (4/19)",
   "K 4.7 (4/19)",
   "UACR 828 mg/g (4/19)",
   "A1c 8% (4/19)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-04-21 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "chlorthalidone: not started by 2022-04-21 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_99/0",
  "kind": "Medication event comment",
  "when": "2022-09-22 14:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.3)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-09-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-09-22 13:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.3)"
  ],
  "context": [
   "BP 134/80, pulse 72, wt 226 lb",
   "eGFR 67 (today)",
   "K 4.6 (today)",
   "UACR 1042 mg/g (today)",
   "A1c 8.3% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-09-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_100",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-01-26 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/66, pulse 81, wt 227 lb",
   "eGFR 65 (1/22)",
   "K 4.8 (1/22)",
   "UACR 868 mg/g (1/22)",
   "A1c 7.6% (1/22)",
   "LDL 123 mg/dL (1/22)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-01-26 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_114",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-07-03 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/83, repeat 138/83, pulse 69, wt 226 lb",
   "eGFR 63 (today)",
   "K 4.6 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-07-03 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_129/0",
  "kind": "Medication event comment",
  "when": "2023-11-02 11:31",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_123",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-02 11:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/85, pulse 70, wt 224 lb",
   "eGFR 64 (today)",
   "K 4.8 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_130",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-04-29 11:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/69, pulse 72, wt 226 lb",
   "eGFR 62 (4/26)",
   "K 4.5 (4/26)",
   "A1c 8% (4/26)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_31/1",
  "kind": "Medication event comment",
  "when": "2024-08-28 15:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.8"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.8)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_137",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-08-28 15:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.8)"
  ],
  "context": [
   "BP 128/83, pulse 69, wt 228 lb",
   "eGFR 59 (today)",
   "K 5.1 (today)",
   "A1c 8.8% (today)",
   "LDL 87 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_157/0",
  "kind": "Problem list comment",
  "when": "2025-02-12 12:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2025-02-12",
   "supporting result: eGFR 59 (10/10/24)",
   "supporting result: eGFR 57 (today)",
   "supporting result: UACR 1844 mg/g (5/8/24)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_150",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-02-12 12:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/78, pulse 77, wt 226 lb",
   "eGFR 57 (today)",
   "K 4.8 (today)",
   "A1c 8% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_158",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-30 11:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/84, pulse 85, wt 228 lb",
   "eGFR 53 (7/27)",
   "K 4.6 (7/27)",
   "A1c 8% (7/27)",
   "LDL 53 mg/dL (7/27)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_31/2",
  "kind": "Medication event comment",
  "when": "2025-12-15 14:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 18 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 18 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_169",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-12-15 13:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 18 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 127/78, pulse 88, wt 230 lb",
   "eGFR 48 (12/13)",
   "K 4.5 (12/13)",
   "A1c 8.1% (12/13)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_175",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-04-21 10:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/63, pulse 83, wt 228 lb",
   "eGFR 47 (4/15)",
   "K 4.6 (4/15)",
   "UACR 2379 mg/g (4/15)",
   "A1c 7% (4/15)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
