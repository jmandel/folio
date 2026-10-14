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
  "when": "2022-05-19 13:22",
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
   "onset 2018-01-03",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-05-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-05-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-05-19 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-05-19 13:22",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-05-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-05-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-05-19 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-05-19 12:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/88, repeat 138/85, pulse 80, wt 201 lb",
   "eGFR 92 (5/16)",
   "K 4.2 (5/16)",
   "UACR 155 mg/g (5/16)",
   "A1c 5.8% (5/16)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-05-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-05-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2022-05-19 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/1",
  "kind": "Medication event comment",
  "when": "2023-01-30 14:01",
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
   "chlorthalidone: not started by 2023-01-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2023-01-30 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/2",
  "kind": "Medication event comment",
  "when": "2023-01-30 15:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold lisinopril 40 MG Oral Tablet 40 mg QD; reason: K 6.1 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: held today (K 6.1 confirmed on repeat); review 2023-02-13"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-01-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2023-01-30 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_14",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-01-30 13:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: held today (K 6.1 confirmed on repeat); review 2023-02-13"
  ],
  "context": [
   "BP 158/95, repeat 150/94, pulse 70, wt 202 lb",
   "eGFR 95 (1/24)",
   "K 4 (1/24)",
   "A1c 6.2% (1/24)",
   "LDL 133 mg/dL (1/24)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-01-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2023-01-30 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_137",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2023-01-30 15:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: held today (K 6.1 confirmed on repeat); review 2023-02-13"
  ],
  "context": [
   "K 6.1 (today)",
   "K 6.1 (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-01-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2023-01-30 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_31/0",
  "kind": "Medication event comment",
  "when": "2023-10-03 14:51",
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
   "amlodipine: not started by 2023-10-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2023-10-03 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_24",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-10-03 14:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/89, repeat 139/88, pulse 83, wt 198 lb",
   "eGFR 88 (today)",
   "K 4.1 (today)",
   "UACR 159 mg/g (today)",
   "A1c 6.1% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-10-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "empagliflozin: not started by 2023-10-03 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_43/0",
  "kind": "Medication event comment",
  "when": "2024-08-05 11:31",
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
   "empagliflozin: not started by 2024-08-05 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-08-05 11:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/96, pulse 76, wt 202 lb",
   "eGFR 89 (today)",
   "K 5.9 (today), hemolyzed",
   "UACR 115 mg/g (today)",
   "A1c 6.5% (today)",
   "LDL 149 mg/dL (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2024-08-05 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_46",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-15 12:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/88, pulse 63, wt 203 lb",
   "eGFR 89 (today)",
   "K 4.4 (today)",
   "UACR 161 mg/g (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2025-04-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_65/0",
  "kind": "Medication event comment",
  "when": "2025-11-18 11:11",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "forbidden": [
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_53",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-11-18 10:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "context": [
   "BP 122/75, pulse 88, wt 200 lb",
   "eGFR 88 (11/13)",
   "K 4.4 (11/13)",
   "UACR 139 mg/g (11/13)",
   "A1c 7.4% (11/13)",
   "LDL 123 mg/dL (11/13)"
  ],
  "forbidden": [
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_130/0",
  "kind": "Allergy list comment",
  "when": "2026-02-17 09:25",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "empagliflozin: euglycemic diabetic ketoacidosis (adverse-reaction)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "forbidden": [
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_65/1",
  "kind": "Medication event comment",
  "when": "2026-02-17 09:22",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop empagliflozin 10 MG Oral Tablet 10 mg QD; reason: euglycemic DKA"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: stopped today (euglycemic DKA)"
  ],
  "forbidden": [
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_129",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2026-02-17 09:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: stopped today (euglycemic DKA)",
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 145/78, pulse 66, wt 202 lb"
  ],
  "forbidden": [
   "nf_86 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
