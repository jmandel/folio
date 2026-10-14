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

## Requests (14)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2021-12-21 10:17",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-12-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2021-12-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-12-21 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2021-12-21 10:17",
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
   "onset 2020-05-23",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-12-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2021-12-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-12-21 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2021-12-21 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 149/95, repeat 146/93, pulse 73, wt 147 lb",
   "eGFR 76 (today)",
   "K 4.3 (today)",
   "UACR 38 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-12-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2021-12-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-12-21 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_13",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-07-11 14:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/82, pulse 71, wt 151 lb",
   "eGFR 75 (today)",
   "K 4.1 (today)",
   "A1c 7.9% (today)",
   "LDL 129 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-07-11 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-07-11 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2022-07-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2022-08-18 14:03",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: vomiting, poor oral intake"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: held today (vomiting, poor oral intake); review 2022-08-25"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-08-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-08-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2022-08-18 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2022-08-18 13:58",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2022-08-25"
  ],
  "context": [],
  "forbidden": [
   "empagliflozin: not started by 2022-08-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-08-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2022-08-18 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_30/0",
  "kind": "Medication event comment",
  "when": "2023-03-23 15:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.5"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.5)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-03-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-03-23 14:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.5)"
  ],
  "context": [
   "BP 162/99, pulse 82, wt 146 lb",
   "eGFR 75 (today)",
   "K 4.5 (today)",
   "UACR 40 mg/g (today)",
   "A1c 8.5% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-03-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_45/0",
  "kind": "Medication event comment",
  "when": "2024-01-01 13:21",
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
   "dulaglutide: not started by 2024-01-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_31",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-01-01 13:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/87, repeat 140/86, pulse 83, wt 150 lb",
   "eGFR 74 (12/27/23)",
   "K 4.4 (12/27/23)",
   "UACR 57 mg/g (12/27/23)",
   "A1c 7.5% (12/27/23)",
   "LDL 127 mg/dL (12/27/23)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-01-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_46",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-27 15:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/82, pulse 85, wt 145 lb",
   "eGFR 73 (today)",
   "K 4.2 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-09-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-07-01 12:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/76, pulse 88, wt 150 lb",
   "eGFR 72 (6/26)",
   "K 4.3 (6/26)",
   "A1c 7.9% (6/26)",
   "LDL 131 mg/dL (6/26)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-07-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_73/0",
  "kind": "Medication event comment",
  "when": "2026-02-03 08:31",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-02-03 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 139/84, pulse 72, wt 141 lb",
   "eGFR 71 (today)",
   "K 4.1 (today)",
   "UACR 51 mg/g (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
