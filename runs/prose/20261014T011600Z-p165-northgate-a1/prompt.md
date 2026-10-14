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
  "key": "B/med/m_17/0",
  "kind": "Medication event comment",
  "when": "2023-02-27 11:11",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.2)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-02-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-02-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2023-02-27 11:22",
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
   "onset 2020",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-02-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-02-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2023-02-27 11:22",
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
   "onset 2014-10-14",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-02-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-02-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_5",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2023-02-27 10:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.2)"
  ],
  "context": [
   "BP 148/84, repeat 145/84, pulse 75, wt 196 lb",
   "eGFR 53 (today)",
   "K 4.5 (today)",
   "UACR 62 mg/g (today)",
   "A1c 8.2% (today)",
   "LDL 154 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-02-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-02-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_26/0",
  "kind": "Medication event comment",
  "when": "2023-08-04 11:11",
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
   "amlodipine: not started by 2023-08-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_25/0",
  "kind": "Problem list comment",
  "when": "2023-08-04 11:22",
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
   "onset 2023-08-04",
   "supporting result: eGFR 53 (2/27)",
   "supporting result: eGFR 48 (today)",
   "supporting result: UACR 62 mg/g (2/27)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-08-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-08-04 10:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 153/90, repeat 151/90, pulse 86, wt 198 lb",
   "eGFR 48 (today)",
   "K 4.4 (today)",
   "A1c 7.1% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-08-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_38/0",
  "kind": "Medication event comment",
  "when": "2024-01-30 11:51",
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
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-01-30 11:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/74, repeat 134/72, pulse 67, wt 192 lb",
   "eGFR 50 (today)",
   "K 4.2 (today)",
   "UACR 50 mg/g (today)",
   "A1c 7.2% (today)",
   "LDL 148 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_39",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-22 12:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/67, pulse 84, wt 191 lb",
   "eGFR 51 (today)",
   "K 4.8 (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-01-03 09:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/88, pulse 69, wt 194 lb",
   "eGFR 50 (today)",
   "K 4.3 (today)",
   "UACR 59 mg/g (today)",
   "A1c 6.9% (today)",
   "LDL 118 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-06-10 10:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/89, pulse 70, wt 194 lb",
   "eGFR 50 (today)",
   "K 4.6 (today)",
   "UACR 64 mg/g (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-22 12:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "BP 137/84, pulse 76, wt 194 lb",
   "eGFR 48 (today)",
   "K 4.8 (today)",
   "UACR 50 mg/g (today)",
   "A1c 6.6% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-03-25 09:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/83, repeat 139/81, pulse 78, wt 194 lb",
   "eGFR 48 (3/23)",
   "K 4.6 (3/23)",
   "UACR 56 mg/g (3/23)",
   "A1c 6.4% (3/23)",
   "LDL 135 mg/dL (3/23)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2026-04-13 09:07",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: vomiting, poor oral intake"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: held today (vomiting, poor oral intake); review 2026-04-20"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_95",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2026-04-13 09:02",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2026-04-20"
  ],
  "context": [],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2026-04-20 11:22",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "resume metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: eating and drinking normally"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_96",
  "kind": "Primary care phone visit note (reason: Phone: feeling better)",
  "when": "2026-04-20 11:18",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "context": [],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-08-03 09:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/80, pulse 75, wt 195 lb",
   "eGFR 47 (today)",
   "K 4.2 (today)",
   "UACR 63 mg/g (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
