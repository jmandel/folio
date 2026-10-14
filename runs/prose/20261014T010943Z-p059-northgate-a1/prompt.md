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

## Requests (17)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2023-02-21 12:12",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2013-10",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2023-02-21 12:12",
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
   "onset 2015-09",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2023-02-21 12:12",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2021-04-06",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_126/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2023-02-21 12:25",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 44, UACR 7 mg/g: CKD evaluation and management"
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
   "dapagliflozin: not started by 2023-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2023-02-21 11:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/93, pulse 79, wt 200 lb",
   "eGFR 44 (today)",
   "K 4.7 (today)",
   "UACR 7 mg/g (today)",
   "A1c 7.7% (today)",
   "LDL 90 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-02-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_25/0",
  "kind": "Problem list comment",
  "when": "2023-12-29 16:25",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2023-12-29",
   "supporting result: eGFR 40 (12/21)",
   "supporting result: eGFR 41 (today)",
   "supporting result: UACR 13 mg/g (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-12-29 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "insulin glargine: not started by 2023-12-29 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_26/0",
  "kind": "Medication event comment",
  "when": "2024-01-04 09:41",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "insulin glargine: not started by 2024-01-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-01-04 09:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "BP 139/84, pulse 64, wt 193 lb",
   "eGFR 41 (12/29/23)",
   "K 4.6 (12/29/23)",
   "UACR 13 mg/g (12/29/23)",
   "A1c 7.5% (12/29/23)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-01-04 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-17 11:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 152/89, repeat 149/87, pulse 72, wt 196 lb",
   "eGFR 39 (10/12)",
   "K 4.4 (10/12)",
   "A1c 7.6% (10/12)",
   "LDL 87 mg/dL (10/12)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-10-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_118/0",
  "kind": "Allergy list comment",
  "when": "2024-12-09 08:55",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "dapagliflozin: euglycemic diabetic ketoacidosis (adverse-reaction)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_26/1",
  "kind": "Medication event comment",
  "when": "2024-12-09 08:52",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: euglycemic DKA"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: stopped today (euglycemic DKA)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_117",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2024-12-09 08:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: stopped today (euglycemic DKA)",
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 142/78, pulse 64, wt 195 lb"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_49/0",
  "kind": "Medication event comment",
  "when": "2025-08-12 12:11",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2025-08-12 16:37",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold losartan potassium 100 MG Oral Tablet 100 mg QD; reason: K 5.6 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: held today (K 5.6 confirmed on repeat); review 2025-08-26"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-08-12 11:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 134/85, pulse 84, wt 200 lb",
   "eGFR 38 (8/6)",
   "K 4.5 (8/6)",
   "UACR 12 mg/g (8/6)",
   "A1c 8.1% (8/6)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_125",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2025-08-12 16:31",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: held today (K 5.6 confirmed on repeat); review 2025-08-26"
  ],
  "context": [
   "K 5.6 (today)",
   "K 5.5 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-03-16 12:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 149/86, pulse 65, wt 195 lb",
   "eGFR 38 (today)",
   "K 4.7 (today)",
   "UACR 14 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 94 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
