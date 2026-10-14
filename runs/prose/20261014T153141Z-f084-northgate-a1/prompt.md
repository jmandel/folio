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
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2020-12-07 08:41",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 9"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 9)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-12-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2020-12-07 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-12-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-12-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-12-07 08:52",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2014-03",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-12-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2020-12-07 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-12-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-12-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-12-07 08:52",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-12-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2020-12-07 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-12-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-12-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-12-07 08:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 9)"
  ],
  "context": [
   "BP 135/75, pulse 77, wt 158 lb",
   "eGFR 51 (today)",
   "K 4.7 (today)",
   "A1c 9% (today)",
   "LDL 142 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-12-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2020-12-07 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-12-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-12-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_28/0",
  "kind": "Problem list comment",
  "when": "2021-05-18 15:17",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2021-05-18",
   "supporting result: eGFR 51 (12/7/20)",
   "supporting result: eGFR 49 (today)",
   "supporting result: UACR 515 mg/g (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-05-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-05-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-05-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-05-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-05-18 14:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/83, repeat 139/83, pulse 69, wt 154 lb",
   "eGFR 49 (today)",
   "K 4.6 (today)",
   "UACR 515 mg/g (today)",
   "A1c 8% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-05-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-05-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-05-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-05-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_36/0",
  "kind": "Medication event comment",
  "when": "2021-10-26 09:11",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.2, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.2, CKD)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-10-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-10-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-10-26 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_158/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-10-26 09:35",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 47, UACR 446 mg/g: CKD evaluation and management"
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
   "insulin glargine: not started by 2021-10-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-10-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-10-26 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-10-26 08:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.2, CKD)"
  ],
  "context": [
   "BP 123/70, pulse 65, wt 158 lb",
   "eGFR 47 (today)",
   "K 4.6 (today)",
   "UACR 446 mg/g (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-10-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-10-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-10-26 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_166",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2021-12-14 15:08",
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
  "forbidden": [
   "insulin glargine: not started by 2021-12-14 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-12-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_37",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-03-16 13:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/81, pulse 67, wt 154 lb",
   "eGFR 48 (today)",
   "K 6 (today), hemolyzed",
   "UACR 558 mg/g (today)",
   "A1c 7.4% (today)",
   "LDL 171 mg/dL (today)",
   "K 4.1 (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-03-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-03-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-08-22 08:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/87, pulse 64, wt 153 lb",
   "eGFR 49 (today)",
   "K 4.6 (today)",
   "UACR 450 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-08-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-08-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-12-26 08:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/83, pulse 67, wt 157 lb",
   "eGFR 47 (today)",
   "K 4.7 (today)",
   "UACR 562 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-12-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-12-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-01 13:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/80, pulse 78, wt 155 lb",
   "eGFR 46 (today)",
   "K 4 (today)",
   "UACR 703 mg/g (today)",
   "A1c 7.5% (today)",
   "LDL 133 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-05-01 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2023-05-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-10-20 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/85, pulse 79, wt 156 lb",
   "eGFR 48 (10/18)",
   "K 4.4 (10/18)",
   "UACR 786 mg/g (10/18)",
   "A1c 7.5% (10/18)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-10-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2023-10-20 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-03-19 14:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/83, repeat 135/83, pulse 76, wt 156 lb",
   "eGFR 45 (today)",
   "K 4.8 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-03-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2024-03-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2024-09-09 11:06",
  "author": "Moira Brennan, DO (Primary care physician)",
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
  "forbidden": [
   "insulin glargine: not started by 2024-09-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2024-09-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_101",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-09-09 10:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "context": [
   "BP 137/77, pulse 79, wt 156 lb",
   "eGFR 44 (9/6)",
   "K 4.5 (9/6)",
   "UACR 826 mg/g (9/6)",
   "A1c 7.7% (9/6)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-09-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2024-09-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_122/0",
  "kind": "Medication event comment",
  "when": "2025-01-24 11:01",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 7.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 7.4)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-01-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_108",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-01-24 10:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 7.4)"
  ],
  "context": [
   "BP 137/85, pulse 69, wt 153 lb",
   "eGFR 42 (1/20)",
   "K 5.2 (1/20)",
   "UACR 819 mg/g (1/20)",
   "A1c 7.2% (1/20)",
   "LDL 135 mg/dL (1/20)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-01-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_123",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-14 08:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/77, pulse 73, wt 155 lb",
   "eGFR 41 (today)",
   "K 4.9 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-07-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_155/0",
  "kind": "Allergy list comment",
  "when": "2025-08-11 13:12",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "amlodipine: not started by 2025-08-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_157/0",
  "kind": "Medication event comment",
  "when": "2025-08-11 13:15",
  "author": "Moira Brennan, DO (Primary care physician)",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/1",
  "kind": "Medication event comment",
  "when": "2025-08-11 13:14",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 20 MG Oral Tablet 20 mg QD; reason: angioedema"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (angioedema)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-08-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_156",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2025-08-11 12:52",
  "author": "Moira Brennan, DO (Primary care physician)",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_129",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-12-18 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/75, pulse 86, wt 156 lb",
   "eGFR 42 (today)",
   "K 4.3 (today)",
   "A1c 8.8% (today)",
   "LDL 147 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_143",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-05-25 08:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/73, pulse 88, wt 155 lb",
   "eGFR 40 (5/21)",
   "K 4.6 (5/21)",
   "UACR 1097 mg/g (5/21)",
   "A1c 9.2% (5/21)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
