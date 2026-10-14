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

## Requests (19)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 12:02",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2019-11-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 12:02",
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
   "onset 2008",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2019-11-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 12:02",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2019-11-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-11-28 11:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/87, repeat 138/83, pulse 79, wt 156 lb",
   "eGFR 56 (today)",
   "K 4.7 (today)",
   "A1c 7.1% (today)",
   "LDL 53 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2019-11-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-11-28 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_27/0",
  "kind": "Problem list comment",
  "when": "2020-09-21 11:22",
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
   "onset 2020-09-21",
   "supporting result: eGFR 56 (11/28/19)",
   "supporting result: eGFR 55 (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-09-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2020-09-21 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-09-21 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/85, pulse 68, wt 155 lb",
   "eGFR 55 (today)",
   "K 4.4 (today)",
   "A1c 6.6% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-09-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2020-09-21 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-07-05 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/86, repeat 139/86, pulse 69, wt 152 lb",
   "eGFR 53 (today)",
   "K 4.5 (today)",
   "UACR 17 mg/g (today)",
   "A1c 7% (today)",
   "LDL 103 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-07-05 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2021-07-05 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-02-21 11:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/83, pulse 87, wt 157 lb",
   "eGFR 55 (today)",
   "K 4.2 (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-02-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-02-21 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-10-13 12:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 147/94, repeat 142/93, pulse 82, wt 156 lb",
   "eGFR 53 (today)",
   "K 4.5 (today)",
   "UACR 16 mg/g (today)",
   "A1c 7.1% (today)",
   "LDL 92 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-10-13 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-10-13 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2023-05-25 08:41",
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
   "empagliflozin: not started by 2023-05-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-05-25 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_60",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-05-25 08:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 152/89, repeat 146/88, pulse 70, wt 155 lb",
   "eGFR 51 (today)",
   "K 4.8 (today)",
   "UACR 21 mg/g (today)",
   "A1c 6.7% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-05-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-05-25 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_80/0",
  "kind": "Medication event comment",
  "when": "2024-04-02 13:02",
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
  "key": "B/med/m_79/0",
  "kind": "Medication event comment",
  "when": "2024-04-02 13:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2024-04-02 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_67",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-04-02 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/87, pulse 67, wt 155 lb",
   "eGFR 50 (3/28)",
   "K 4.2 (3/28)",
   "UACR 15 mg/g (3/28)",
   "A1c 7.2% (3/28)",
   "LDL 102 mg/dL (3/28)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_81",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-11-05 10:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/77, pulse 84, wt 155 lb",
   "eGFR 49 (11/3)",
   "K 4.5 (11/3)",
   "A1c 7.2% (11/3)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_90",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-06-17 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/78, pulse 82, wt 157 lb",
   "eGFR 48 (today)",
   "K 4.8 (today)",
   "UACR 17 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 124 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_101",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-01-14 08:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/89, pulse 78, wt 157 lb",
   "eGFR 45 (today)",
   "K 4.3 (today)",
   "UACR 21 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2026-08-21 13:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "key": "B/visit/e_109",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-08-21 12:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "context": [
   "BP 135/81, pulse 80, wt 152 lb",
   "eGFR 45 (8/15)",
   "K 4.5 (8/15)",
   "A1c 6.6% (8/15)",
   "LDL 94 mg/dL (8/15)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
