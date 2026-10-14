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

## Requests (27)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-01-08 12:32",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-01-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-01-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2020-01-08 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-01-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-01-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-01-08 12:32",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-01-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-01-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2020-01-08 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-01-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-01-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-01-08 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/89, pulse 79, wt 198 lb",
   "eGFR 71 (1/3)",
   "K 4.4 (1/3)",
   "UACR 52 mg/g (1/3)",
   "A1c 8% (1/3)",
   "LDL 156 mg/dL (1/3)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-01-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-01-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2020-01-08 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-01-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-01-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-05-22 15:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/85, pulse 79, wt 200 lb",
   "eGFR 71 (today)",
   "K 4.6 (today)",
   "UACR 61 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-05-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-05-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2020-05-22 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-05-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-05-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-10-15 13:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/88, pulse 64, wt 199 lb",
   "eGFR 70 (10/13)",
   "K 5 (10/13)",
   "A1c 7.9% (10/13)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-10-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-10-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2020-10-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-10-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-10-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_31",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-04-05 12:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/76, pulse 74, wt 200 lb",
   "eGFR 69 (today)",
   "K 4.3 (today)",
   "UACR 79 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 183 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-04-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-04-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2021-04-05 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2021-04-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-04-05 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_42",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-08-30 15:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/78, pulse 77, wt 196 lb",
   "eGFR 66 (8/28)",
   "K 3.9 (8/28)",
   "UACR 87 mg/g (8/28)",
   "A1c 7.1% (8/28)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-08-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-08-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2021-08-30 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2021-08-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-08-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-01-31 13:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/84, pulse 80, wt 200 lb",
   "eGFR 66 (today)",
   "K 4.7 (today)",
   "UACR 97 mg/g (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-01-31 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-01-31 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2022-01-31 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2022-01-31 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-01-31 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_57",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-07-08 13:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/76, pulse 75, wt 201 lb",
   "eGFR 66 (today)",
   "K 4.4 (today)",
   "A1c 7.4% (today)",
   "LDL 113 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-07-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-07-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2022-07-08 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2022-07-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-07-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_68",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-01-04 14:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/81, repeat 143/77, pulse 63, wt 198 lb",
   "eGFR 66 (today)",
   "K 4.3 (today)",
   "UACR 101 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-01-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2023-01-04 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2023-01-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-01-04 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_75",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-01 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/81, pulse 74, wt 198 lb",
   "eGFR 66 (today)",
   "K 4.3 (today)",
   "UACR 152 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-06-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-06-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2023-06-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2023-06-01 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-06-01 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_83",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-10-11 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 147/88, repeat 139/87, pulse 78, wt 198 lb",
   "eGFR 64 (today)",
   "K 4.5 (today)",
   "UACR 146 mg/g (today)",
   "A1c 7.6% (today)",
   "LDL 122 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-10-11 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-10-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2023-10-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2023-10-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-10-11 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_104/0",
  "kind": "Medication event comment",
  "when": "2024-03-25 13:01",
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
   "amlodipine: not started by 2024-03-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2024-03-25 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2024-03-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-03-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_94",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-03-25 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/87, repeat 143/86, pulse 85, wt 197 lb",
   "eGFR 62 (today)",
   "K 4.5 (today)",
   "UACR 136 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-03-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2024-03-25 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2024-03-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-03-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_119/0",
  "kind": "Medication event comment",
  "when": "2024-09-16 14:36",
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
   "dulaglutide: not started by 2024-09-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2024-09-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-09-16 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_105",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-09-16 14:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/98, pulse 79, wt 197 lb",
   "eGFR 60 (today)",
   "K 4.5 (today)",
   "A1c 7.4% (today)",
   "LDL 112 mg/dL (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-09-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2024-09-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-09-16 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_130/0",
  "kind": "Medication event comment",
  "when": "2025-03-13 12:21",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.3)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-03-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2025-03-13 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_129/0",
  "kind": "Problem list comment",
  "when": "2025-03-13 12:32",
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
   "onset 2025-03-13",
   "supporting result: eGFR 60 (9/16/24)",
   "supporting result: eGFR 56 (today)",
   "supporting result: UACR 136 mg/g (3/25/24)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-03-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2025-03-13 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_120",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-03-13 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.3)"
  ],
  "context": [
   "BP 123/81, pulse 73, wt 196 lb",
   "eGFR 56 (today)",
   "K 4.8 (today)",
   "A1c 8.3% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-03-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2025-03-13 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_131",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-08-27 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/79, pulse 77, wt 197 lb",
   "eGFR 53 (today)",
   "K 4.3 (today)",
   "UACR 202 mg/g (today)",
   "A1c 7.7% (today)",
   "LDL 147 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-08-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2025-08-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_152/0",
  "kind": "Medication event comment",
  "when": "2026-02-16 13:31",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "forbidden": [
   "finerenone: not started by 2026-02-16 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_167/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2026-02-16 13:55",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 47, UACR 217 mg/g: CKD evaluation and management"
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
   "finerenone: not started by 2026-02-16 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_146",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-02-16 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 121/73, pulse 86, wt 197 lb",
   "eGFR 48 (2/13)",
   "K 4.5 (2/13)",
   "A1c 8.1% (2/13)"
  ],
  "forbidden": [
   "finerenone: not started by 2026-02-16 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_166",
  "kind": "Chart correction comment",
  "when": "2026-03-18 08:14",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The amlodipine 10 mg start entered 2026-03-17 was entry error"
  ],
  "context": [
   "amlodipine: entered in error today (entry error)",
   "amlodipine 5 mg daily"
  ],
  "forbidden": [
   "finerenone: not started by 2026-03-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_175",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2026-04-08 14:33",
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
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2026-08-10 12:36",
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
  "key": "B/visit/e_153",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-08-10 12:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "context": [
   "BP 125/77, pulse 78, wt 200 lb",
   "eGFR 43 (today)",
   "K 4.5 (today)",
   "A1c 6.9% (today)",
   "LDL 162 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
