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

## Requests (32)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-12-24 14:47",
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
   "onset 2016-10-26",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-12-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-12-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-12-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2019-12-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-12-24 14:47",
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
   "chlorthalidone: not started by 2019-12-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-12-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-12-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2019-12-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-12-24 14:47",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-12-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-12-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-12-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2019-12-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-12-24 14:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 160/96, repeat 152/92, pulse 63, wt 196 lb",
   "eGFR 71 (12/18)",
   "K 4 (12/18)",
   "UACR 169 mg/g (12/18)",
   "A1c 6.8% (12/18)",
   "LDL 56 mg/dL (12/18)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-12-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2019-12-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2019-12-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2019-12-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2020-04-27 10:51",
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
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-04-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-04-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2020-04-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2020-04-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-04-27 10:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 152/82, repeat 144/81, pulse 62, wt 197 lb",
   "eGFR 69 (4/25)",
   "K 4.5 (4/25)",
   "A1c 7% (4/25)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-04-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-04-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2020-04-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2020-04-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_32/0",
  "kind": "Medication event comment",
  "when": "2020-09-09 13:01",
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
   "amlodipine: not started by 2020-09-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-09-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2020-09-09 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2020-09-09 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-09-09 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/85, pulse 77, wt 198 lb",
   "eGFR 68 (today)",
   "K 4.4 (today)",
   "UACR 211 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-09-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2020-09-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2020-09-09 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2020-09-09 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_46/0",
  "kind": "Medication event comment",
  "when": "2021-01-18 12:01",
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
   "insulin glargine: not started by 2021-01-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2021-01-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-01-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-01-18 11:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/86, pulse 79, wt 199 lb",
   "eGFR 68 (1/13)",
   "K 4.1 (1/13)",
   "A1c 7.3% (1/13)",
   "LDL 115 mg/dL (1/13)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-01-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2021-01-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-01-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_53/0",
  "kind": "Medication event comment",
  "when": "2021-05-18 15:11",
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
   "semaglutide: not started by 2021-05-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-05-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-05-18 14:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 128/86, pulse 80, wt 197 lb",
   "eGFR 68 (today)",
   "K 4.3 (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-05-18 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-05-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-10-22 14:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/87, repeat 132/87, pulse 86, wt 199 lb",
   "eGFR 66 (today)",
   "K 4.2 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-10-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2021-10-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_63",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-03-22 09:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/82, repeat 138/79, pulse 77, wt 194 lb",
   "eGFR 67 (today)",
   "K 4.4 (today)",
   "UACR 267 mg/g (today)",
   "A1c 8% (today)",
   "LDL 173 mg/dL (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-03-22 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2022-03-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_172/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2022-09-08 12:35",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 65, UACR 244 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-09-08 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2022-09-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_75",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-09-08 11:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/86, pulse 67, wt 196 lb",
   "eGFR 65 (9/3)",
   "K 4.2 (9/3)",
   "UACR 311 mg/g (9/3)",
   "A1c 8% (9/3)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-09-08 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "finerenone: not started by 2022-09-08 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_180",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2022-10-25 14:14",
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
   "semaglutide: not started by 2022-10-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_92/0",
  "kind": "Medication event comment",
  "when": "2023-01-13 11:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_86",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-01-13 11:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 138/93, pulse 67, wt 198 lb",
   "eGFR 61 (1/7)",
   "K 4.2 (1/7)",
   "A1c 8.1% (1/7)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_93",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-06-02 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/73, pulse 76, wt 197 lb",
   "eGFR 62 (5/28)",
   "K 4.3 (5/28)",
   "A1c 7.3% (5/28)",
   "LDL 121 mg/dL (5/28)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_103",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-10-06 14:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/75, pulse 84, wt 195 lb",
   "eGFR 60 (10/3)",
   "K 3.9 (10/3)",
   "UACR 468 mg/g (10/3)",
   "A1c 7.1% (10/3)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_114",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-02-21 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/76, pulse 88, wt 195 lb",
   "eGFR 60 (today)",
   "K 4.2 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_130/0",
  "kind": "Problem list comment",
  "when": "2024-07-02 11:17",
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
   "onset 2024-07-02",
   "supporting result: eGFR 59 (6/18)",
   "supporting result: eGFR 57 (today)",
   "supporting result: UACR 517 mg/g (6/18)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_120",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-07-02 10:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/82, pulse 81, wt 196 lb",
   "eGFR 57 (today)",
   "K 4.1 (today)",
   "A1c 7.5% (today)",
   "LDL 165 mg/dL (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_131",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-12-16 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/77, pulse 87, wt 197 lb",
   "eGFR 55 (today)",
   "K 4.2 (today)",
   "UACR 431 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_53/1",
  "kind": "Medication event comment",
  "when": "2025-04-28 09:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.3)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_139",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-28 08:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.3)"
  ],
  "context": [
   "BP 149/85, repeat 141/84, pulse 73, wt 199 lb",
   "eGFR 52 (today)",
   "K 4.6 (today)",
   "A1c 8.3% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_145",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-09-01 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/81, pulse 66, wt 195 lb",
   "eGFR 48 (8/28)",
   "K 4.4 (8/28)",
   "UACR 745 mg/g (8/28)",
   "A1c 7.3% (8/28)",
   "LDL 106 mg/dL (8/28)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_156",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-02-02 14:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 150/94, repeat 144/90, pulse 80, wt 196 lb",
   "eGFR 46 (today)",
   "K 4.3 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_130/1",
  "kind": "Problem list comment",
  "when": "2026-06-08 16:25",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2024-07-02",
   "supporting result: eGFR 47 (2/23)",
   "supporting result: eGFR 42 (today)",
   "supporting result: UACR 956 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2026-06-11 13:31",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 41"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 41)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_162",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-06-11 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 41)"
  ],
  "context": [
   "BP 146/84, repeat 139/83, pulse 79, wt 198 lb",
   "eGFR 42 (6/8)",
   "K 4.8 (6/8)",
   "UACR 956 mg/g (6/8)",
   "A1c 7.2% (6/8)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
