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

## Requests (26)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-05-21 08:47",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2019-05-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-05-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-05-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-05-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-05-21 08:47",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2019-05-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-05-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-05-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-05-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-05-21 08:47",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2019-05-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-05-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-05-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-05-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-05-21 08:47",
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
   "empagliflozin: not started by 2019-05-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-05-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-05-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-05-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2019-05-21 08:47",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2012-10-13",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2019-05-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-05-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-05-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-05-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-05-21 08:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/82, pulse 81, wt 212 lb",
   "eGFR 51 (5/18)",
   "K 4.5 (5/18)",
   "UACR 49 mg/g (5/18)",
   "A1c 7.9% (5/18)",
   "LDL 76 mg/dL (5/18)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2019-05-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-05-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-05-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2019-05-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_26/0",
  "kind": "Problem list comment",
  "when": "2020-01-09 16:25",
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
   "onset 2020-01-09",
   "supporting result: eGFR 51 (5/18/19)",
   "supporting result: eGFR 51 (today)",
   "supporting result: UACR 49 mg/g (5/18/19)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-01-09 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2020-01-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-01-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2020-01-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-01-15 12:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/78, pulse 76, wt 215 lb",
   "eGFR 51 (1/9)",
   "K 4.1 (1/9)",
   "A1c 7.9% (1/9)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-01-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2020-01-15 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-01-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2020-01-15 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-12-10 13:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/89, pulse 84, wt 213 lb",
   "eGFR 49 (12/8)",
   "K 4.6 (12/8)",
   "UACR 75 mg/g (12/8)",
   "A1c 8% (12/8)",
   "LDL 117 mg/dL (12/8)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2020-12-10 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2020-12-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-12-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2020-12-10 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-07-21 09:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/82, pulse 67, wt 213 lb",
   "eGFR 47 (today)",
   "K 4.4 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-07-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2021-07-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-07-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2021-07-21 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2022-04-04 11:06",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.6"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.6)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-04-04 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-04-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-04-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2022-04-04 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-04-04 10:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.6)"
  ],
  "context": [
   "BP 141/82, repeat 139/78, pulse 81, wt 215 lb",
   "eGFR 48 (today)",
   "K 4.8 (today)",
   "A1c 8.6% (today)",
   "LDL 97 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-04-04 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-04-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-04-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2022-04-04 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2023-01-06 16:06",
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
   "empagliflozin: not started by 2023-01-06 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-01-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2023-01-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_57",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-01-06 15:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/87, pulse 63, wt 215 lb",
   "eGFR 46 (today)",
   "K 4.3 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-01-06 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-01-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2023-01-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/2",
  "kind": "Medication event comment",
  "when": "2023-11-06 11:01",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "empagliflozin: not started by 2023-11-06 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-11-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2023-11-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_114/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2023-11-06 11:25",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 43, UACR 101 mg/g: CKD evaluation and management"
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
   "empagliflozin: not started by 2023-11-06 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-11-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2023-11-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-06 10:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "context": [
   "BP 136/87, pulse 62, wt 215 lb",
   "eGFR 40 (11/4)",
   "K 4.6 (11/4)",
   "UACR 71 mg/g (11/4)",
   "A1c 7.9% (11/4)",
   "LDL 96 mg/dL (11/4)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-11-06 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-11-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2023-11-06 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_111/0",
  "kind": "Allergy list comment",
  "when": "2023-12-08 10:22",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "empagliflozin: not started by 2023-12-08 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-12-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-12-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2023-12-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_113/0",
  "kind": "Medication event comment",
  "when": "2023-12-08 10:25",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
  "forbidden": [
   "empagliflozin: not started by 2023-12-08 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-12-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2023-12-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2023-12-08 10:24",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 40 MG Oral Tablet 40 mg QD; reason: angioedema"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (angioedema)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-12-08 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-12-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-12-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dapagliflozin: not started by 2023-12-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_112",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2023-12-08 10:02",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
  "forbidden": [
   "empagliflozin: not started by 2023-12-08 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-12-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "dapagliflozin: not started by 2023-12-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_75",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-06-25 12:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/75, pulse 85, wt 216 lb",
   "eGFR 43 (today)",
   "K 4.4 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2024-06-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2024-06-25 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_96/0",
  "kind": "Medication event comment",
  "when": "2025-03-25 14:36",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.3, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.3, CKD)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-03-25 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-03-25 14:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.3, CKD)"
  ],
  "context": [
   "BP 145/88, repeat 137/86, pulse 87, wt 215 lb",
   "eGFR 40 (today)",
   "K 4.1 (today)",
   "UACR 122 mg/g (today)",
   "A1c 8.3% (today)",
   "LDL 104 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-03-25 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_105/0",
  "kind": "Medication event comment",
  "when": "2025-12-08 10:06",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_97",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-12-08 09:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/85, pulse 73, wt 212 lb",
   "eGFR 36 (12/2)",
   "K 4.7 (12/2)",
   "UACR 99 mg/g (12/2)",
   "A1c 7.5% (12/2)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
