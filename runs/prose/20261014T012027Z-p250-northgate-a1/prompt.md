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

## Requests (18)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-09-05 09:47",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-09-05 09:47",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_4",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-09-05 09:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/89, repeat 139/85, pulse 62, wt 213 lb",
   "eGFR 82 (today)",
   "K 4.3 (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/1",
  "kind": "Medication event comment",
  "when": "2020-07-29 09:11",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change lisinopril 20 MG Oral Tablet 20 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-07-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-07-29 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2020-07-29 08:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/89, repeat 145/88, pulse 75, wt 209 lb",
   "eGFR 81 (today)",
   "K 4.7 (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-07-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-07-29 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/2",
  "kind": "Medication event comment",
  "when": "2021-06-09 08:41",
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
   "chlorthalidone: not started by 2021-06-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-06-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_15",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-06-09 08:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/86, pulse 74, wt 211 lb",
   "eGFR 79 (today)",
   "K 3.8 (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-06-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-06-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_34/0",
  "kind": "Medication event comment",
  "when": "2022-02-14 14:11",
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
   "amlodipine: not started by 2022-02-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_24",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-02-14 13:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 155/97, pulse 79, wt 210 lb",
   "eGFR 81 (today)",
   "K 4.6 (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2022-02-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-12-15 12:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/80, pulse 78, wt 207 lb",
   "eGFR 78 (12/10)",
   "K 4.2 (12/10)",
   "LDL 107 mg/dL (12/10)"
  ],
  "forbidden": [
   "amlodipine: not started by 2022-12-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_34/1",
  "kind": "Medication event comment",
  "when": "2023-06-14 12:51",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop chlorthalidone 25 MG Oral Tablet 12.5 mg QD; reason: AKI with hyperkalemia"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "chlorthalidone: stopped today (AKI with hyperkalemia)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-06-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_135",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2023-06-14 12:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: resumed today (creatinine back to baseline)",
   "chlorthalidone: stopped today (AKI with hyperkalemia)"
  ],
  "context": [
   "Acute kidney injury",
   "BP 152/78, repeat 150/78, pulse 85, wt 212 lb"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-06-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_44",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2023-07-21 10:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/90, repeat 141/88, pulse 64, wt 213 lb",
   "eGFR 80 (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-07-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-03-04 13:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/83, pulse 83, wt 209 lb",
   "eGFR 79 (2/29)",
   "K 4.3 (2/29)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-03-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2024-11-15 10:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/82, repeat 134/81, pulse 83, wt 209 lb",
   "eGFR 77 (today)",
   "K 4.1 (today)",
   "LDL 130 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-11-15 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_70/0",
  "kind": "Medication event comment",
  "when": "2025-07-01 08:36",
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
  "forbidden": [
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_65",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-01 08:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/85, pulse 86, wt 210 lb",
   "eGFR 76 (6/29)",
   "K 4.6 (6/29)"
  ],
  "forbidden": [
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-03-16 14:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/73, pulse 77, wt 214 lb",
   "eGFR 76 (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [
   "nf_95 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
