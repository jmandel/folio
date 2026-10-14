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

## Requests (16)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-08-28 08:32",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-08-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2020-08-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2020-08-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-08-28 08:32",
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
   "onset 2008-04",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-08-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2020-08-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2020-08-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-08-28 08:32",
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
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-08-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2020-08-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2020-08-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-08-28 08:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/82, pulse 77, wt 188 lb",
   "eGFR 52 (8/26)",
   "K 4.7 (8/26)",
   "UACR 44 mg/g (8/26)",
   "A1c 7.6% (8/26)",
   "LDL 96 mg/dL (8/26)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-08-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2020-08-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2020-08-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_30/0",
  "kind": "Problem list comment",
  "when": "2021-07-02 16:22",
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
   "onset 2021-07-02",
   "supporting result: eGFR 52 (8/26/20)",
   "supporting result: eGFR 52 (today)",
   "supporting result: UACR 44 mg/g (8/26/20)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-07-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2021-07-02 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2021-07-02 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-07-02 15:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/84, pulse 85, wt 184 lb",
   "eGFR 52 (today)",
   "K 4.6 (today)",
   "A1c 7.6% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-07-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2021-07-02 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2021-07-02 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_31",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-04-25 10:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/88, pulse 66, wt 189 lb",
   "eGFR 48 (4/21)",
   "K 4.2 (4/21)",
   "A1c 7.6% (4/21)",
   "LDL 84 mg/dL (4/21)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-04-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2022-04-25 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2022-04-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-01-27 10:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/80, pulse 74, wt 185 lb",
   "eGFR 50 (1/23)",
   "K 4.3 (1/23)",
   "A1c 7.6% (1/23)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-01-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2023-01-27 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2023-01-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-12-12 15:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/83, repeat 136/82, pulse 74, wt 188 lb",
   "eGFR 50 (today)",
   "K 4.7 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-12-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2023-12-12 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2023-12-12 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/0",
  "kind": "Medication event comment",
  "when": "2024-07-09 14:41",
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
   "furosemide: not started by 2024-07-09 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2024-07-09 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_95/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2024-07-09 15:05",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 48, UACR 106 mg/g: CKD evaluation and management"
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
   "furosemide: not started by 2024-07-09 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2024-07-09 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-07-09 14:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/83, pulse 79, wt 184 lb",
   "eGFR 49 (7/5)",
   "K 4.8 (7/5)",
   "A1c 7.6% (7/5)",
   "LDL 113 mg/dL (7/5)"
  ],
  "forbidden": [
   "furosemide: not started by 2024-07-09 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "finerenone: not started by 2024-07-09 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_94",
  "kind": "Chart correction comment",
  "when": "2024-08-09 08:18",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The furosemide 40 mg start entered 2024-08-08 was wrong patient"
  ],
  "context": [
   "furosemide: entered in error today (wrong patient)"
  ],
  "forbidden": [
   "finerenone: not started by 2024-08-09 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_103",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2024-09-30 15:33",
  "author": "Kim Foster, RN (Registered nurse)",
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
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-03-17 11:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/72, pulse 78, wt 184 lb",
   "eGFR 45 (today)",
   "K 4.6 (today)",
   "UACR 94 mg/g (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_80",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-11-26 08:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/74, pulse 71, wt 188 lb",
   "eGFR 42 (today)",
   "K 4.5 (today)",
   "UACR 87 mg/g (today)",
   "A1c 7.7% (today)",
   "LDL 110 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
