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
  "key": "B/med/m_22/0",
  "kind": "Medication event comment",
  "when": "2022-02-25 10:06",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.1)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-02-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2022-02-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2022-02-25 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2022-02-25 10:17",
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
   "onset 2014-01",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-02-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2022-02-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2022-02-25 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-02-25 10:17",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-02-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2022-02-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2022-02-25 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-02-25 10:17",
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
   "semaglutide: not started by 2022-02-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2022-02-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2022-02-25 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2022-02-25 10:17",
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
   "onset 2021-05",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-02-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2022-02-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2022-02-25 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-02-25 09:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.1)"
  ],
  "context": [
   "BP 144/87, repeat 136/84, pulse 82, wt 197 lb",
   "eGFR 90 (today)",
   "K 4.4 (today)",
   "A1c 8.1% (today)",
   "LDL 57 mg/dL (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-02-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2022-02-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2022-02-25 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-07-18 10:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/77, pulse 62, wt 195 lb",
   "eGFR 93 (7/16)",
   "K 4.6 (7/16)",
   "A1c 6.9% (7/16)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-07-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2022-07-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2022-07-18 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-12-05 08:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/74, pulse 62, wt 198 lb",
   "eGFR 88 (today)",
   "K 4.6 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-12-05 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2022-12-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2022-12-05 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_39",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-08 13:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/74, pulse 80, wt 195 lb",
   "eGFR 86 (today)",
   "K 4.7 (today)",
   "UACR 157 mg/g (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-05-08 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2023-05-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2023-05-08 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_46",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-10-16 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/67, pulse 69, wt 198 lb",
   "eGFR 88 (10/11)",
   "K 4.1 (10/11)",
   "A1c 7.1% (10/11)",
   "LDL 115 mg/dL (10/11)"
  ],
  "forbidden": [
   "semaglutide: not started by 2023-10-16 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2023-10-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2023-10-16 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_57",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-03-01 12:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/83, pulse 66, wt 195 lb",
   "eGFR 87 (2/28)",
   "K 4.1 (2/28)",
   "A1c 7.5% (2/28)"
  ],
  "forbidden": [
   "semaglutide: not started by 2024-03-01 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "amlodipine: not started by 2024-03-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_69/0",
  "kind": "Medication event comment",
  "when": "2024-07-23 15:41",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "amlodipine: not started by 2024-07-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_63",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-23 15:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.3)"
  ],
  "context": [
   "BP 137/83, pulse 64, wt 195 lb",
   "eGFR 89 (today)",
   "K 4 (today)",
   "A1c 8.3% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-07-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_70",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-12-16 11:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/74, pulse 63, wt 196 lb",
   "eGFR 87 (today)",
   "K 4.5 (today)",
   "UACR 194 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-12-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_121/0",
  "kind": "Allergy list comment",
  "when": "2025-01-28 13:12",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "lisinopril: angioedema of lips and tongue (allergy)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril allergy: angioedema of lips and tongue"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-01-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_123/0",
  "kind": "Medication event comment",
  "when": "2025-01-28 13:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start amlodipine 5 MG Oral Tablet 5 mg QD; reason: replacing lisinopril (angioedema)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "amlodipine: started 5 mg daily today (replacing lisinopril (angioedema))"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2025-01-28 13:14",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 10 MG Oral Tablet 10 mg QD; reason: angioedema"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (angioedema)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-01-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_122",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2025-01-28 12:52",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril allergy: angioedema of lips and tongue",
   "lisinopril: stopped today (angioedema)",
   "amlodipine: started 5 mg daily today (replacing lisinopril (angioedema))"
  ],
  "context": [
   "Angioedema"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-05-19 14:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/70, pulse 76, wt 197 lb",
   "eGFR 87 (today)",
   "K 4.5 (today)",
   "UACR 197 mg/g (today)",
   "A1c 7.4% (today)",
   "LDL 92 mg/dL (today)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_88",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-09-22 13:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/84, pulse 77, wt 196 lb",
   "eGFR 87 (today)",
   "K 4.3 (today)",
   "UACR 230 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_95",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-02-10 10:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/66, pulse 67, wt 196 lb",
   "eGFR 85 (today)",
   "K 4.5 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_101",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-07-31 15:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/80, pulse 70, wt 197 lb",
   "eGFR 86 (today)",
   "K 4.1 (today)",
   "UACR 260 mg/g (today)",
   "A1c 7.5% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
