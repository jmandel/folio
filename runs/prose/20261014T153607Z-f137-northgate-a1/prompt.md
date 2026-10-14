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

## Requests (22)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2022-07-22 15:02",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-07-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2022-07-22 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "amlodipine: not started by 2022-07-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-07-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-07-22 15:02",
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
   "onset 2021",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-07-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2022-07-22 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "amlodipine: not started by 2022-07-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-07-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-07-22 15:02",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-07-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2022-07-22 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "amlodipine: not started by 2022-07-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-07-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-07-22 14:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 148/91, pulse 74, wt 206 lb",
   "eGFR 49 (7/17)",
   "K 4.5 (7/17)",
   "A1c 7.1% (7/17)",
   "LDL 107 mg/dL (7/17)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-07-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2022-07-22 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "amlodipine: not started by 2022-07-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-07-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_28/0",
  "kind": "Medication event comment",
  "when": "2023-01-12 09:06",
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
   "empagliflozin: not started by 2023-01-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "amlodipine: not started by 2023-01-12 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-01-12 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_27/0",
  "kind": "Problem list comment",
  "when": "2023-01-12 09:17",
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
   "onset 2023-01-12",
   "supporting result: eGFR 49 (7/17/22)",
   "supporting result: eGFR 47 (today)",
   "supporting result: UACR 166 mg/g (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-01-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "amlodipine: not started by 2023-01-12 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-01-12 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-01-12 08:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/92, repeat 141/89, pulse 69, wt 207 lb",
   "eGFR 47 (today)",
   "K 4.6 (today)",
   "UACR 166 mg/g (today)",
   "A1c 6.9% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-01-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "amlodipine: not started by 2023-01-12 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-01-12 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_37/0",
  "kind": "Medication event comment",
  "when": "2023-05-29 15:42",
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
   "finerenone: not started by 2023-05-29 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_36/0",
  "kind": "Medication event comment",
  "when": "2023-05-29 15:41",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: CKD + DM, cardiorenal benefit"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-05-29 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2023-05-29 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-29 15:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)",
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 144/81, pulse 64, wt 205 lb",
   "eGFR 49 (today)",
   "K 4.5 (today)",
   "UACR 260 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2023-05-29 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-10-10 11:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/80, pulse 72, wt 210 lb",
   "eGFR 47 (10/8)",
   "K 4.7 (10/8)",
   "A1c 7.5% (10/8)",
   "LDL 89 mg/dL (10/8)"
  ],
  "forbidden": [
   "finerenone: not started by 2023-10-10 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_48",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-03-25 08:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/81, repeat 138/79, pulse 71, wt 209 lb",
   "eGFR 48 (today)",
   "K 4.3 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2024-03-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_153/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2024-09-05 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 46, UACR 260 mg/g: CKD evaluation and management"
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
   "finerenone: not started by 2024-09-05 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-05 13:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/75, pulse 79, wt 206 lb",
   "eGFR 46 (8/31)",
   "K 4.2 (8/31)",
   "UACR 406 mg/g (8/31)",
   "A1c 7.5% (8/31)"
  ],
  "forbidden": [
   "finerenone: not started by 2024-09-05 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_161",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2024-11-06 09:25",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_63",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-03 12:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/78, pulse 65, wt 207 lb",
   "eGFR 45 (today)",
   "K 4.5 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-17 09:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/85, pulse 84, wt 207 lb",
   "eGFR 47 (7/14)",
   "K 4.4 (7/14)",
   "A1c 7.8% (7/14)",
   "LDL 61 mg/dL (7/14)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2025-12-03 09:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_82",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-12-03 09:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.1)"
  ],
  "context": [
   "BP 138/81, pulse 78, wt 207 lb",
   "eGFR 48 (today)",
   "K 4.7 (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-04-21 12:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/85, pulse 84, wt 208 lb",
   "eGFR 47 (today)",
   "K 4.7 (today)",
   "UACR 470 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2026-09-15 11:31",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_98",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-09-15 11:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "context": [
   "BP 141/84, repeat 137/83, pulse 70, wt 209 lb",
   "eGFR 46 (9/10)",
   "K 4.2 (9/10)",
   "UACR 450 mg/g (9/10)",
   "A1c 7.3% (9/10)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
