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

## Requests (15)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-06-08 14:42",
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
   "onset 2011-01",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-06-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2020-06-08 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-06-08 14:42",
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
   "onset 2008",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-06-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2020-06-08 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-06-08 14:42",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-06-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2020-06-08 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-06-08 14:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/78, pulse 88, wt 154 lb",
   "eGFR 93 (6/5)",
   "K 4.4 (6/5)",
   "UACR 48 mg/g (6/5)",
   "A1c 7.7% (6/5)",
   "LDL 113 mg/dL (6/5)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-06-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2020-06-08 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-02-09 14:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 149/84, pulse 86, wt 155 lb",
   "eGFR 90 (today)",
   "K 4.3 (today)",
   "UACR 59 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-02-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2021-02-09 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-10-08 15:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/80, pulse 65, wt 156 lb",
   "eGFR 89 (today)",
   "K 4.7 (today)",
   "UACR 58 mg/g (today)",
   "A1c 7.6% (today)",
   "LDL 104 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-10-08 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2021-10-08 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-05-17 14:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/78, pulse 67, wt 153 lb",
   "eGFR 91 (5/12)",
   "K 4.5 (5/12)",
   "UACR 44 mg/g (5/12)",
   "A1c 7.4% (5/12)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-05-17 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2022-05-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-01-10 08:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/72, pulse 65, wt 152 lb",
   "eGFR 90 (today)",
   "K 4.4 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-01-10 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2023-01-10 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_139",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2023-07-03 14:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: resumed today (creatinine back to baseline)"
  ],
  "context": [
   "Acute kidney injury",
   "BP 151/78, repeat 148/78, pulse 66, wt 157 lb"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-07-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2023-07-03 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-10-04 15:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/90, pulse 68, wt 155 lb",
   "eGFR 87 (today)",
   "K 4 (today)",
   "A1c 7.5% (today)",
   "LDL 100 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-10-04 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2023-10-04 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-06-28 08:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/86, pulse 64, wt 157 lb",
   "eGFR 91 (6/25)",
   "K 4.3 (6/25)",
   "UACR 53 mg/g (6/25)",
   "A1c 7.7% (6/25)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-06-28 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "metoprolol succinate: not started by 2024-06-28 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_141",
  "kind": "Chart correction comment",
  "when": "2024-07-23 08:49",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The metoprolol succinate 50 mg start entered 2024-07-22 was wrong patient"
  ],
  "context": [
   "metoprolol succinate: entered in error today (wrong patient)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-07-23 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_79",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-05-01 15:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/89, pulse 86, wt 155 lb",
   "eGFR 85 (today)",
   "K 4.3 (today)",
   "UACR 64 mg/g (today)",
   "A1c 7.6% (today)",
   "LDL 110 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2025-05-01 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_101/0",
  "kind": "Medication event comment",
  "when": "2026-03-09 12:11",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.1)"
  ],
  "forbidden": [
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-03-09 11:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.1)"
  ],
  "context": [
   "BP 138/68, pulse 66, wt 158 lb",
   "eGFR 87 (3/7)",
   "K 4.5 (3/7)",
   "UACR 50 mg/g (3/7)",
   "A1c 8.1% (3/7)"
  ],
  "forbidden": [
   "nf_119 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
