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

## Requests (15)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-09-28 11:22",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-09-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2020-09-28 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-09-28 11:22",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-09-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2020-09-28 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-09-28 11:22",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-09-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2020-09-28 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-09-28 10:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/76, pulse 83, wt 142 lb",
   "eGFR 62 (today)",
   "K 4.7 (today)",
   "A1c 7.9% (today)",
   "LDL 94 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-09-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2020-09-28 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-07-13 09:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/79, pulse 69, wt 146 lb",
   "eGFR 63 (today)",
   "K 4.7 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-07-13 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-07-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-03-14 13:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/75, pulse 67, wt 143 lb",
   "eGFR 62 (today)",
   "K 4.3 (today)",
   "A1c 8% (today)",
   "LDL 85 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-03-14 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-03-14 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_44/0",
  "kind": "Medication event comment",
  "when": "2022-11-16 14:51",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.3, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.3, CKD)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-11-16 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_37",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-11-16 14:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.3, CKD)"
  ],
  "context": [
   "BP 133/82, pulse 79, wt 144 lb",
   "eGFR 63 (11/10)",
   "K 4.7 (11/10)",
   "UACR 15 mg/g (11/10)",
   "A1c 8.3% (11/10)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-11-16 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-06-14 13:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/75, pulse 88, wt 142 lb",
   "eGFR 64 (6/12)",
   "K 4.3 (6/12)",
   "A1c 7.2% (6/12)",
   "LDL 99 mg/dL (6/12)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-06-14 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_58",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-02-27 10:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/73, pulse 77, wt 143 lb",
   "eGFR 60 (2/22)",
   "K 4.1 (2/22)",
   "UACR 13 mg/g (2/22)",
   "A1c 7.7% (2/22)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-02-27 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_65",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-08 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/88, pulse 70, wt 142 lb",
   "eGFR 61 (today)",
   "K 4.5 (today)",
   "A1c 7.7% (today)",
   "LDL 131 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-01-08 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_81/0",
  "kind": "Medication event comment",
  "when": "2025-11-04 11:01",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_75",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-11-04 10:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 128/80, pulse 63, wt 142 lb",
   "eGFR 58 (today)",
   "K 4.1 (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_93/0",
  "kind": "Problem list comment",
  "when": "2026-07-20 15:32",
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
   "onset 2026-07-20",
   "supporting result: eGFR 58 (11/4/25)",
   "supporting result: eGFR 58 (today)",
   "supporting result: UACR 21 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_82",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-07-20 15:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/79, pulse 62, wt 145 lb",
   "eGFR 58 (today)",
   "K 3.9 (today)",
   "UACR 21 mg/g (today)",
   "A1c 7.2% (today)",
   "LDL 105 mg/dL (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
