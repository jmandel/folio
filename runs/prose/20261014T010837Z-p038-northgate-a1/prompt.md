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

## Requests (25)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-08-24 13:32",
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
   "onset 2010-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-08-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-08-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2020-08-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2020-08-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-08-24 13:32",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-08-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-08-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2020-08-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2020-08-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-08-24 13:32",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Hypothyroidism\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Hypothyroidism",
   "onset 2007",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-08-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-08-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2020-08-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2020-08-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-08-24 13:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/85, pulse 66, wt 191 lb",
   "eGFR 64 (8/18)",
   "K 4.3 (8/18)",
   "UACR 571 mg/g (8/18)",
   "A1c 7.5% (8/18)",
   "LDL 138 mg/dL (8/18)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-08-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2020-08-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2020-08-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2020-08-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-01-19 09:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/85, pulse 77, wt 192 lb",
   "eGFR 65 (today)",
   "K 4.4 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-01-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2021-01-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2021-01-19 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-01-19 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_35/0",
  "kind": "Medication event comment",
  "when": "2021-07-15 15:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2021-07-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2021-07-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-07-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2021-07-15 15:12",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2021-07-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2021-07-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-07-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_143/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-07-15 15:35",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 62, UACR 456 mg/g: CKD evaluation and management"
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
   "chlorthalidone: not started by 2021-07-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2021-07-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-07-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-07-15 14:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)",
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 150/91, repeat 143/90, pulse 73, wt 187 lb",
   "eGFR 63 (7/11)",
   "K 6.5 (7/11), hemolyzed",
   "A1c 8.1% (7/11)",
   "K 4.8 (7/11)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-07-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2021-07-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-07-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_151",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2021-09-20 10:13",
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
   "chlorthalidone: not started by 2021-09-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "semaglutide: not started by 2021-09-20 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_49/0",
  "kind": "Medication event comment",
  "when": "2021-11-29 11:21",
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
   "semaglutide: not started by 2021-11-29 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-11-29 11:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/90, repeat 140/89, pulse 71, wt 190 lb",
   "eGFR 62 (11/25)",
   "K 4.5 (11/25)",
   "A1c 6.9% (11/25)",
   "LDL 104 mg/dL (11/25)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-11-29 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-05-09 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/78, pulse 88, wt 188 lb",
   "eGFR 61 (today)",
   "K 4.6 (today)",
   "A1c 6.6% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-05-09 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-10-17 08:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/77, pulse 86, wt 189 lb",
   "eGFR 59 (10/15)",
   "K 4.4 (10/15)",
   "A1c 6.5% (10/15)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-10-17 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-06 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/91, pulse 86, wt 189 lb",
   "eGFR 60 (4/2)",
   "K 4.8 (4/2)",
   "A1c 6.6% (4/2)",
   "LDL 175 mg/dL (4/2)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-04-06 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_84/0",
  "kind": "Problem list comment",
  "when": "2023-09-27 09:32",
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
   "onset 2023-09-27",
   "supporting result: eGFR 59 (6/20)",
   "supporting result: eGFR 59 (today)",
   "supporting result: UACR 927 mg/g (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-09-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-09-27 09:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/78, pulse 74, wt 192 lb",
   "eGFR 59 (today)",
   "K 4.5 (today)",
   "UACR 927 mg/g (today)",
   "A1c 6.8% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-09-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-03-22 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/81, pulse 88, wt 188 lb",
   "eGFR 58 (3/19)",
   "K 4.1 (3/19)",
   "A1c 6.7% (3/19)",
   "LDL 117 mg/dL (3/19)"
  ],
  "forbidden": [
   "semaglutide: not started by 2024-03-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_99",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-08-12 11:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/86, pulse 83, wt 191 lb",
   "eGFR 56 (today)",
   "K 4.3 (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2024-08-12 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_106",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-12-26 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/82, pulse 69, wt 189 lb",
   "eGFR 53 (today)",
   "K 4.6 (today)",
   "UACR 1236 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2024-12-26 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_113",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-28 08:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/80, pulse 63, wt 187 lb",
   "eGFR 49 (4/25)",
   "K 5 (4/25)",
   "UACR 1467 mg/g (4/25)",
   "A1c 7.8% (4/25)",
   "LDL 123 mg/dL (4/25)"
  ],
  "forbidden": [
   "semaglutide: not started by 2025-04-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_135/0",
  "kind": "Medication event comment",
  "when": "2025-09-12 12:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_127",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-09-12 11:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 134/79, pulse 85, wt 188 lb",
   "eGFR 46 (9/7)",
   "K 4.7 (9/7)",
   "UACR 1106 mg/g (9/7)",
   "A1c 8.1% (9/7)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2026-02-24 15:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 43"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_136",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-02-24 15:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "context": [
   "BP 135/80, pulse 80, wt 187 lb",
   "eGFR 43 (today)",
   "K 4.4 (today)",
   "UACR 1202 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
