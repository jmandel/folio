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
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 12:02",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-07-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 12:02",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-07-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 12:02",
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
   "onset 2008",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-07-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 12:02",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-07-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-07-03 11:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/79, pulse 66, wt 218 lb",
   "eGFR 63 (today)",
   "K 4.2 (today)",
   "A1c 6.6% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-07-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-11-11 15:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/65, pulse 86, wt 216 lb",
   "eGFR 64 (today)",
   "K 4 (today)",
   "UACR 194 mg/g (today)",
   "A1c 6.9% (today)",
   "LDL 86 mg/dL (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-11-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_31",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-04-09 13:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/76, pulse 74, wt 217 lb",
   "eGFR 62 (today)",
   "K 5.9 (today), hemolyzed",
   "A1c 7.3% (today)",
   "K 4.2 (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2021-04-09 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-08-30 10:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 119/71, pulse 81, wt 213 lb",
   "eGFR 63 (today)",
   "K 4.3 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2021-08-30 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-02-01 13:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/71, pulse 79, wt 216 lb",
   "eGFR 63 (today)",
   "K 4 (today)",
   "A1c 7.6% (today)",
   "LDL 106 mg/dL (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-02-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_60",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-06-16 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/77, pulse 83, wt 218 lb",
   "eGFR 62 (today)",
   "K 4.2 (today)",
   "UACR 248 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-06-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-10-31 08:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/76, pulse 65, wt 214 lb",
   "eGFR 60 (10/25)",
   "K 4.2 (10/25)",
   "UACR 211 mg/g (10/25)",
   "A1c 7.3% (10/25)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-10-31 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_79",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-03-31 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/69, pulse 67, wt 218 lb",
   "eGFR 60 (today)",
   "K 4.1 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2023-03-31 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_99/0",
  "kind": "Problem list comment",
  "when": "2023-08-16 16:25",
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
   "onset 2023-08-16",
   "supporting result: eGFR 60 (3/31)",
   "supporting result: eGFR 60 (today)",
   "supporting result: UACR 323 mg/g (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2023-08-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_150/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2023-08-21 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 59, UACR 311 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus"
  ],
  "forbidden": [
   "dulaglutide: not started by 2023-08-21 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_88",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-08-21 13:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/70, pulse 82, wt 213 lb",
   "eGFR 60 (8/16)",
   "K 3.9 (8/16)",
   "UACR 323 mg/g (8/16)",
   "A1c 7.8% (8/16)",
   "LDL 85 mg/dL (8/16)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "dulaglutide: not started by 2023-08-21 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2024-02-12 14:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "dulaglutide: not started by 2024-02-12 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_100",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-02-12 13:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.4)"
  ],
  "context": [
   "BP 117/76, pulse 73, wt 213 lb",
   "eGFR 60 (2/6)",
   "K 3.8 (2/6)",
   "A1c 8.4% (2/6)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-02-12 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_106",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-06-13 14:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/69, pulse 80, wt 213 lb",
   "eGFR 57 (6/10)",
   "K 4.3 (6/10)",
   "A1c 7.8% (6/10)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-06-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_124/0",
  "kind": "Medication event comment",
  "when": "2024-12-10 12:31",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_113",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-12-10 12:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "context": [
   "BP 115/65, pulse 64, wt 219 lb",
   "eGFR 52 (today)",
   "K 4.3 (today)",
   "UACR 429 mg/g (today)",
   "A1c 8.2% (today)",
   "LDL 114 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_125",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-04-29 15:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/83, pulse 70, wt 217 lb",
   "eGFR 50 (4/23)",
   "K 4.4 (4/23)",
   "A1c 7.1% (4/23)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2025-10-14 14:11",
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
  "key": "B/visit/e_131",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-10-14 13:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "context": [
   "BP 119/66, pulse 74, wt 215 lb",
   "eGFR 45 (10/12)",
   "K 4.5 (10/12)",
   "A1c 7.1% (10/12)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_137",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-04-03 14:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 116/72, pulse 78, wt 216 lb",
   "eGFR 41 (today)",
   "K 4.2 (today)",
   "A1c 6.9% (today)",
   "LDL 87 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
