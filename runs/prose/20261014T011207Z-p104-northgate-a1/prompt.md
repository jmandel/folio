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
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2019-02-21 14:11",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 42"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-02-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-02-21 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-02-21 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-02-21 14:22",
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
   "onset 2006",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-02-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-02-21 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-02-21 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-02-21 14:22",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-02-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-02-21 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-02-21 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-02-21 14:22",
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
   "onset 2018-02",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-02-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-02-21 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-02-21 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-02-21 14:22",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-02-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-02-21 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-02-21 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-02-21 13:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "context": [
   "BP 146/89, pulse 79, wt 158 lb",
   "eGFR 42 (today)",
   "K 4.6 (today)",
   "A1c 5.9% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-02-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-02-21 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-02-21 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_29/0",
  "kind": "Problem list comment",
  "when": "2019-12-11 16:25",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Chronic kidney disease stage 3b\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "onset 2019-12-11",
   "supporting result: eGFR 42 (2/21)",
   "supporting result: eGFR 41 (today)",
   "supporting result: UACR 283 mg/g (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-12-11 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-12-11 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-12-11 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-12-11 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2019-12-17 13:06",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2019-12-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-12-17 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-12-17 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-12-17 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-12-17 12:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 156/95, repeat 153/94, pulse 63, wt 157 lb",
   "eGFR 41 (12/11)",
   "K 4.6 (12/11)",
   "UACR 283 mg/g (12/11)",
   "A1c 6.1% (12/11)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-12-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-12-17 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2019-12-17 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-12-17 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_41/0",
  "kind": "Medication event comment",
  "when": "2020-07-13 11:31",
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
   "amlodipine: not started by 2020-07-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2020-07-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-07-13 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2020-07-13 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_30",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-07-13 11:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/92, repeat 145/92, pulse 68, wt 159 lb",
   "eGFR 43 (today)",
   "K 4.8 (today)",
   "UACR 222 mg/g (today)",
   "A1c 6.8% (today)",
   "LDL 55 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-07-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2020-07-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2020-07-13 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2020-07-13 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_51/0",
  "kind": "Medication event comment",
  "when": "2021-05-28 10:51",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "dapagliflozin: not started by 2021-05-28 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2021-05-28 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2021-05-28 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_42",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-05-28 10:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/88, repeat 143/88, pulse 66, wt 157 lb",
   "eGFR 44 (today)",
   "K 4.6 (today)",
   "A1c 6.3% (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-05-28 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2021-05-28 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2021-05-28 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_112/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2022-03-22 10:05",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 43, UACR 341 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-03-22 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2022-03-22 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2022-03-22 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-03-22 09:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink."
   }
  ],
  "mustInclude": [],
  "context": [
   "BP 141/80, repeat 139/80, pulse 65, wt 157 lb",
   "eGFR 43 (today)",
   "K 4.7 (today)",
   "A1c 6.2% (today)",
   "LDL 59 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-03-22 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "finerenone: not started by 2022-03-22 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2022-03-22 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_121",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2022-06-02 15:25",
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
  "forbidden": [
   "naproxen: not started by 2022-06-02 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_67",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-10-20 13:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/79, pulse 80, wt 155 lb",
   "eGFR 40 (10/18)",
   "K 4.6 (10/18)",
   "A1c 6.3% (10/18)"
  ],
  "forbidden": [
   "naproxen: not started by 2022-10-20 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-05-18 12:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/75, pulse 72, wt 159 lb",
   "eGFR 40 (today)",
   "K 4.2 (today)",
   "UACR 315 mg/g (today)",
   "A1c 6.1% (today)",
   "LDL 76 mg/dL (today)"
  ],
  "forbidden": [
   "naproxen: not started by 2023-05-18 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_95/0",
  "kind": "Medication event comment",
  "when": "2024-03-29 12:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: CKD + DM, cardiorenal benefit"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_86",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-03-29 11:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "BP 140/85, repeat 135/82, pulse 70, wt 155 lb",
   "eGFR 40 (today)",
   "K 4.8 (today)",
   "A1c 6.1% (today)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_96",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-02-19 08:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/72, pulse 73, wt 156 lb",
   "eGFR 40 (2/16)",
   "K 4.7 (2/16)",
   "A1c 6.1% (2/16)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-11-18 10:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/79, pulse 62, wt 157 lb",
   "eGFR 38 (11/13)",
   "K 4.4 (11/13)",
   "A1c 6.1% (11/13)",
   "LDL 66 mg/dL (11/13)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
