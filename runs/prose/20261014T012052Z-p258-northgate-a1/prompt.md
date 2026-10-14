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
  "when": "2019-11-26 11:02",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-11-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-11-26 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-11-26 11:02",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-11-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-11-26 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-11-26 11:02",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-11-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-11-26 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-11-26 10:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/76, pulse 65, wt 129 lb",
   "eGFR 64 (today)",
   "K 4 (today)",
   "UACR 397 mg/g (today)",
   "A1c 6.3% (today)",
   "LDL 72 mg/dL (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-11-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-11-26 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-04-07 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/70, pulse 87, wt 135 lb",
   "eGFR 64 (4/1)",
   "K 4.3 (4/1)",
   "A1c 6.9% (4/1)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-04-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-04-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-08-19 10:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/87, pulse 72, wt 131 lb",
   "eGFR 63 (8/15)",
   "K 3.8 (8/15)",
   "UACR 735 mg/g (8/15)",
   "A1c 7% (8/15)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-08-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-08-19 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-01-15 08:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/76, pulse 75, wt 132 lb",
   "eGFR 62 (1/9)",
   "K 4.1 (1/9)",
   "UACR 761 mg/g (1/9)",
   "A1c 7.3% (1/9)",
   "LDL 71 mg/dL (1/9)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2021-01-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2021-01-15 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_157/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-07-13 13:55",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 61, UACR 607 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease",
   "Type 2 diabetes mellitus"
  ],
  "forbidden": [
   "dulaglutide: not started by 2021-07-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2021-07-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_46",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-07-13 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/81, pulse 73, wt 132 lb",
   "eGFR 62 (7/8)",
   "K 4.2 (7/8)",
   "UACR 718 mg/g (7/8)",
   "A1c 7.4% (7/8)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2021-07-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2021-07-13 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_53",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-12-14 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/71, pulse 82, wt 132 lb",
   "eGFR 62 (12/11)",
   "K 4.4 (12/11)",
   "UACR 734 mg/g (12/11)",
   "A1c 7.8% (12/11)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2021-12-14 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2021-12-14 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-05-05 12:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/75, pulse 77, wt 135 lb",
   "eGFR 61 (5/1)",
   "K 3.8 (5/1)",
   "UACR 706 mg/g (5/1)",
   "A1c 7.9% (5/1)",
   "LDL 100 mg/dL (5/1)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-05-05 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2022-05-05 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_76",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-09-09 12:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/71, pulse 87, wt 135 lb",
   "eGFR 59 (today)",
   "K 3.9 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2022-09-09 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2022-09-09 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_89/0",
  "kind": "Problem list comment",
  "when": "2023-02-07 16:25",
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
   "onset 2023-02-07",
   "supporting result: eGFR 60 (1/13)",
   "supporting result: eGFR 60 (today)",
   "supporting result: UACR 776 mg/g (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2023-02-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2023-02-07 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_90/0",
  "kind": "Medication event comment",
  "when": "2023-02-10 12:01",
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
  "forbidden": [
   "insulin glargine: not started by 2023-02-10 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_82",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-02-10 11:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "context": [
   "BP 121/77, pulse 86, wt 130 lb",
   "eGFR 60 (2/7)",
   "K 4.3 (2/7)",
   "UACR 776 mg/g (2/7)",
   "A1c 8.2% (2/7)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-02-10 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-07-04 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 115/62, pulse 71, wt 131 lb",
   "eGFR 59 (today)",
   "K 3.9 (today)",
   "A1c 7.1% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-07-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_101",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-11-30 11:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/75, pulse 74, wt 131 lb",
   "eGFR 58 (today)",
   "K 4 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-11-30 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_107",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-04-09 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/78, pulse 70, wt 133 lb",
   "eGFR 57 (4/3)",
   "K 4.3 (4/3)",
   "A1c 7.7% (4/3)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-04-09 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_113",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-01 08:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/75, pulse 79, wt 135 lb",
   "eGFR 54 (9/26)",
   "K 4.3 (9/26)",
   "UACR 1462 mg/g (9/26)",
   "A1c 7.9% (9/26)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-10-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_135/0",
  "kind": "Medication event comment",
  "when": "2025-03-26 15:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_123",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-03-26 14:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "context": [
   "BP 131/77, pulse 78, wt 133 lb",
   "eGFR 50 (3/24)",
   "K 4.4 (3/24)",
   "UACR 2293 mg/g (3/24)",
   "A1c 8.3% (3/24)",
   "LDL 99 mg/dL (3/24)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_136",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-08-19 10:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/81, pulse 64, wt 129 lb",
   "eGFR 46 (8/13)",
   "K 4.4 (8/13)",
   "UACR 1711 mg/g (8/13)",
   "A1c 7.7% (8/13)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2025-12-31 15:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 44"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_144",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-12-31 14:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "context": [
   "BP 121/74, pulse 65, wt 132 lb",
   "eGFR 44 (12/28)",
   "K 4.2 (12/28)",
   "UACR 2230 mg/g (12/28)",
   "A1c 8% (12/28)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_151",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-05-04 10:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/77, pulse 74, wt 134 lb",
   "eGFR 40 (4/30)",
   "K 4.5 (4/30)",
   "A1c 8% (4/30)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
