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

## Requests (19)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-09-16 13:02",
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
   "onset 2011-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-09-16 13:02",
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
   "onset 2015-06",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-09-16 13:02",
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
   "onset 2015-06",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-09-16 13:02",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-09-16 12:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/89, pulse 85, wt 218 lb",
   "eGFR 64 (9/12)",
   "K 4.6 (9/12)",
   "A1c 6.6% (9/12)",
   "LDL 79 mg/dL (9/12)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2020-05-25 16:01",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "chlorthalidone: not started by 2020-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-05-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-05-25 15:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/86, repeat 145/82, pulse 79, wt 212 lb",
   "eGFR 66 (today)",
   "K 4.8 (today)",
   "A1c 6.1% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-05-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-05-25 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2021-04-13 13:41",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "amlodipine: not started by 2021-04-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-04-13 13:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 151/97, repeat 148/97, pulse 78, wt 218 lb",
   "eGFR 65 (4/11)",
   "K 4.7 (4/11)",
   "UACR 589 mg/g (4/11)",
   "A1c 6.1% (4/11)",
   "LDL 66 mg/dL (4/11)"
  ],
  "forbidden": [
   "amlodipine: not started by 2021-04-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_51/0",
  "kind": "Medication event comment",
  "when": "2021-12-14 15:21",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_115/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-12-14 15:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 66, UACR 607 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-12-14 15:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/86, pulse 87, wt 215 lb",
   "eGFR 64 (12/8)",
   "K 4.6 (12/8)",
   "A1c 6.5% (12/8)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-15 15:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/92, pulse 87, wt 215 lb",
   "eGFR 62 (9/9)",
   "K 4 (9/9)",
   "A1c 7% (9/9)",
   "LDL 100 mg/dL (9/9)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-07-10 11:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/80, pulse 75, wt 215 lb",
   "eGFR 63 (7/5)",
   "K 4.2 (7/5)",
   "A1c 7.2% (7/5)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-03-28 14:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/81, pulse 73, wt 215 lb",
   "eGFR 60 (today)",
   "K 4.2 (today)",
   "A1c 7.2% (today)",
   "LDL 102 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_95/0",
  "kind": "Problem list comment",
  "when": "2025-01-23 16:25",
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
   "onset 2025-01-23",
   "supporting result: eGFR 60 (11/11/24)",
   "supporting result: eGFR 59 (today)",
   "supporting result: UACR 833 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-28 09:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/87, pulse 82, wt 217 lb",
   "eGFR 59 (1/23)",
   "K 6.2 (1/23), hemolyzed",
   "UACR 833 mg/g (1/23)",
   "A1c 7.3% (1/23)",
   "Chronic kidney disease stage 3a",
   "K 4.3 (1/23)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_98",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-10-02 11:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/83, pulse 63, wt 216 lb",
   "eGFR 59 (9/28)",
   "K 4.5 (9/28)",
   "A1c 7.8% (9/28)",
   "LDL 77 mg/dL (9/28)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_108",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-05-13 12:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/85, pulse 66, wt 219 lb",
   "eGFR 57 (5/9)",
   "K 4.6 (5/9)",
   "A1c 7.9% (5/9)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
