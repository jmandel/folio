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

## Requests (24)

```json
[
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2020-07-17 15:36",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "dulaglutide: not started by 2020-07-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2020-07-17 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-07-17 15:47",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-07-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2020-07-17 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-07-17 15:47",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-07-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2020-07-17 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-07-17 15:47",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2005-03-26",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-07-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2020-07-17 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-07-17 15:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.4)"
  ],
  "context": [
   "BP 133/80, pulse 72, wt 214 lb",
   "eGFR 67 (today)",
   "K 4.7 (today)",
   "A1c 8.4% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-07-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2020-07-17 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-12-28 08:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/87, pulse 86, wt 213 lb",
   "eGFR 68 (today)",
   "K 4.7 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-12-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2020-12-28 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-06-22 10:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/80, pulse 86, wt 214 lb",
   "eGFR 67 (6/20)",
   "K 4.7 (6/20)",
   "UACR 17 mg/g (6/20)",
   "A1c 7.8% (6/20)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2021-06-22 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2021-06-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_30",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-11-29 13:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/81, pulse 82, wt 217 lb",
   "eGFR 66 (11/25)",
   "K 4.4 (11/25)",
   "A1c 7.5% (11/25)",
   "LDL 118 mg/dL (11/25)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2021-11-29 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2021-11-29 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-04-27 14:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/88, pulse 82, wt 214 lb",
   "eGFR 66 (4/21)",
   "K 4.5 (4/21)",
   "A1c 8% (4/21)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-04-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2022-04-27 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_58/0",
  "kind": "Medication event comment",
  "when": "2022-10-21 11:31",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2022-10-21 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_46",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-10-21 11:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "context": [
   "BP 132/74, pulse 77, wt 213 lb",
   "eGFR 64 (today)",
   "K 4.2 (today)",
   "UACR 20 mg/g (today)",
   "A1c 8.2% (today)",
   "LDL 163 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-10-21 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-19 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/77, pulse 77, wt 215 lb",
   "eGFR 65 (today)",
   "K 4.1 (today)",
   "UACR 27 mg/g (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-04-19 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-08-24 12:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/84, pulse 66, wt 213 lb",
   "eGFR 63 (today)",
   "K 4.9 (today)",
   "UACR 18 mg/g (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-08-24 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-01-18 10:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/85, pulse 79, wt 213 lb",
   "eGFR 62 (today)",
   "K 4.6 (today)",
   "A1c 7.3% (today)",
   "LDL 117 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-01-18 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_87",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-06-03 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/85, pulse 63, wt 215 lb",
   "eGFR 61 (today)",
   "K 4.6 (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-06-03 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_96",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-15 15:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/90, repeat 139/90, pulse 64, wt 212 lb",
   "eGFR 58 (10/12)",
   "K 4.5 (10/12)",
   "A1c 7.1% (10/12)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-10-15 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_110/0",
  "kind": "Medication event comment",
  "when": "2025-02-21 11:01",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_109/0",
  "kind": "Problem list comment",
  "when": "2025-02-21 11:12",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2025-02-21",
   "supporting result: eGFR 58 (10/12/24)",
   "supporting result: eGFR 55 (today)",
   "supporting result: UACR 18 mg/g (8/24/23)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_103",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-21 10:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/88, repeat 134/84, pulse 64, wt 213 lb",
   "eGFR 55 (today)",
   "K 5 (today)",
   "A1c 7.3% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_111",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-28 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/79, pulse 62, wt 215 lb",
   "eGFR 50 (today)",
   "K 4.6 (today)",
   "A1c 7.3% (today)",
   "LDL 106 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_122",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-11-27 12:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/66, pulse 78, wt 216 lb",
   "eGFR 48 (today)",
   "K 4.4 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2026-05-18 12:01",
  "author": "Moira Brennan, DO (Primary care physician)",
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
  "key": "B/referral/rf_134/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2026-05-18 12:25",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 43, UACR 46 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_128",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-05-18 11:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "context": [
   "BP 134/82, pulse 76, wt 213 lb",
   "eGFR 43 (today)",
   "K 4.3 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
