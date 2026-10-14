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

## Requests (23)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-08-04 12:32",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-08-04 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-08-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2020-08-04 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_4",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-08-04 12:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/82, pulse 75, wt 186 lb",
   "eGFR 58 (7/31)",
   "K 4.2 (7/31)",
   "A1c 7.2% (7/31)",
   "LDL 135 mg/dL (7/31)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-08-04 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-08-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2020-08-04 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_20/0",
  "kind": "Problem list comment",
  "when": "2020-12-02 16:25",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2020-12-02",
   "supporting result: eGFR 58 (7/31)",
   "supporting result: eGFR 58 (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-12-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-12-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2020-12-02 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_14",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-12-08 14:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/70, pulse 67, wt 185 lb",
   "eGFR 58 (12/2)",
   "K 4.4 (12/2)",
   "A1c 8% (12/2)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-12-08 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-12-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2020-12-08 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_30/0",
  "kind": "Medication event comment",
  "when": "2021-05-17 09:51",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "insulin glargine: not started by 2021-05-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2021-05-17 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-05-17 09:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "context": [
   "BP 126/83, pulse 67, wt 185 lb",
   "eGFR 58 (5/11)",
   "K 4.2 (5/11)",
   "A1c 8.2% (5/11)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-05-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2021-05-17 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_31",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-09-29 09:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/70, pulse 73, wt 185 lb",
   "eGFR 59 (today)",
   "K 4.1 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-09-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2021-09-29 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-03-28 14:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/80, pulse 76, wt 186 lb",
   "eGFR 56 (today)",
   "K 4.3 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-03-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2022-03-28 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_61/0",
  "kind": "Medication event comment",
  "when": "2022-08-15 12:01",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
  "forbidden": [
   "atorvastatin: not started by 2022-08-15 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-08-15 11:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "context": [
   "BP 140/90, repeat 133/87, pulse 68, wt 189 lb",
   "eGFR 57 (today)",
   "K 4.2 (today)",
   "UACR 322 mg/g (today)",
   "A1c 8.3% (today)",
   "LDL 150 mg/dL (today)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2022-08-15 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-01-16 12:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/68, pulse 77, wt 186 lb",
   "eGFR 56 (1/10)",
   "K 4.4 (1/10)",
   "A1c 7.4% (1/10)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2023-01-16 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_69",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-05-22 09:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/74, pulse 69, wt 186 lb",
   "eGFR 56 (today)",
   "K 3.9 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2023-05-22 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_160/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2023-10-19 13:35",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 56, UACR 298 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus"
  ],
  "forbidden": [
   "atorvastatin: not started by 2023-10-19 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_76",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-10-19 12:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/76, pulse 80, wt 187 lb",
   "eGFR 56 (today)",
   "K 4.3 (today)",
   "A1c 7.4% (today)",
   "LDL 159 mg/dL (today)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2023-10-19 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_87",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-02-22 11:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/74, pulse 84, wt 190 lb",
   "eGFR 55 (2/18)",
   "K 4.5 (2/18)",
   "UACR 360 mg/g (2/18)",
   "A1c 7% (2/18)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2024-02-22 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_94",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-15 13:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/83, pulse 67, wt 188 lb",
   "eGFR 54 (today)",
   "K 4 (today)",
   "UACR 475 mg/g (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2024-07-15 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_159",
  "kind": "Chart correction comment",
  "when": "2024-08-06 08:37",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The atorvastatin 80 mg start entered 2024-08-05 was entry error"
  ],
  "context": [
   "atorvastatin: entered in error today (entry error)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-12-24 09:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/72, pulse 77, wt 190 lb",
   "eGFR 49 (12/22)",
   "K 4 (12/22)",
   "UACR 387 mg/g (12/22)",
   "A1c 6.8% (12/22)",
   "LDL 146 mg/dL (12/22)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_113",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-05-26 15:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/81, pulse 77, wt 183 lb",
   "eGFR 46 (5/24)",
   "K 4.4 (5/24)",
   "A1c 7.2% (5/24)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_2/1",
  "kind": "Medication event comment",
  "when": "2025-10-30 10:11",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
  "key": "B/visit/e_120",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-10-30 09:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "context": [
   "BP 131/77, pulse 81, wt 186 lb",
   "eGFR 42 (10/28)",
   "K 4.4 (10/28)",
   "A1c 7.1% (10/28)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_20/1",
  "kind": "Problem list comment",
  "when": "2026-04-28 09:33",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "update problem \"Chronic kidney disease stage 3b\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "onset 2020-12-02",
   "supporting result: eGFR 42 (1/23)",
   "supporting result: eGFR 37 (today)",
   "supporting result: UACR 663 mg/g (1/23)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_129",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-04-28 09:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/79, pulse 67, wt 187 lb",
   "eGFR 37 (today)",
   "K 4.3 (today)",
   "A1c 6.9% (today)",
   "LDL 130 mg/dL (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
