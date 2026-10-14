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

## Requests (20)

```json
[
 {
  "key": "B/med/m_20/0",
  "kind": "Medication event comment",
  "when": "2023-09-19 14:21",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2023-09-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-09-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-09-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-09-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2023-09-19 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2023-09-19 14:32",
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
   "onset 2012-10-15",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-09-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-09-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-09-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2023-09-19 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2023-09-19 14:32",
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
   "onset 2022",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-09-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-09-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-09-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2023-09-19 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2023-09-19 14:32",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-09-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-09-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-09-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2023-09-19 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2023-09-19 14:32",
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
   "onset 2013-06-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-09-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-09-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-09-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2023-09-19 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2023-09-19 14:32",
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
   "onset 2021-09",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-09-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-09-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-09-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2023-09-19 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2023-09-19 14:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "BP 147/93, pulse 63, wt 131 lb",
   "eGFR 52 (9/16)",
   "K 4.5 (9/16)",
   "A1c 7.4% (9/16)",
   "LDL 120 mg/dL (9/16)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-09-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-09-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-09-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2023-09-19 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_27/0",
  "kind": "Problem list comment",
  "when": "2024-03-12 16:25",
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
   "onset 2024-03-12",
   "supporting result: eGFR 52 (9/16/23)",
   "supporting result: eGFR 52 (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-03-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-03-12 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-03-12 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-03-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2024-03-12 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_28/0",
  "kind": "Medication event comment",
  "when": "2024-03-15 10:51",
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
   "dulaglutide: not started by 2024-03-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-03-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-03-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2024-03-15 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-03-15 10:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/90, repeat 133/88, pulse 78, wt 129 lb",
   "eGFR 52 (3/12)",
   "K 4.5 (3/12)",
   "A1c 7.8% (3/12)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-03-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-03-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-03-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2024-03-15 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_43/0",
  "kind": "Medication event comment",
  "when": "2024-09-11 10:31",
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
   "amlodipine: not started by 2024-09-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-09-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2024-09-11 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-09-11 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 136/74, pulse 88, wt 127 lb",
   "eGFR 48 (today)",
   "K 4.4 (today)",
   "UACR 76 mg/g (today)",
   "A1c 8.1% (today)",
   "LDL 100 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-09-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-09-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2024-09-11 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_44",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-06 12:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 157/96, repeat 153/93, pulse 78, wt 130 lb",
   "eGFR 51 (today)",
   "K 4.5 (today)",
   "UACR 83 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-02-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2025-02-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2025-02-06 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_59/0",
  "kind": "Medication event comment",
  "when": "2025-07-30 13:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "insulin glargine: not started by 2025-07-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2025-07-30 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-07-30 13:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/83, pulse 70, wt 130 lb",
   "eGFR 49 (today)",
   "K 4.5 (today)",
   "UACR 108 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-07-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2025-07-30 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_147/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2026-01-12 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 50, UACR 135 mg/g: CKD evaluation and management"
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
   "insulin glargine: not started by 2026-01-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2026-01-12 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_60",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-01-12 13:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/79, pulse 64, wt 129 lb",
   "eGFR 51 (1/6)",
   "K 4.6 (1/6)",
   "A1c 8% (1/6)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2026-01-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "furosemide: not started by 2026-01-12 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_77/0",
  "kind": "Medication event comment",
  "when": "2026-07-07 11:21",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "forbidden": [
   "furosemide: not started by 2026-07-07 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-07-07 11:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 135/79, pulse 69, wt 129 lb",
   "eGFR 48 (today)",
   "K 4.8 (today)",
   "UACR 135 mg/g (today)",
   "A1c 8.2% (today)",
   "LDL 102 mg/dL (today)"
  ],
  "forbidden": [
   "furosemide: not started by 2026-07-07 (pattern /\\b(furosemide|Lasix)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_146",
  "kind": "Chart correction comment",
  "when": "2026-07-31 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The furosemide 40 mg start entered 2026-07-30 was entry error"
  ],
  "context": [
   "furosemide: entered in error today (entry error)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
