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

## Requests (30)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-05-22 08:32",
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
   "onset 2014-04",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-05-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-05-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-05-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-05-22 08:32",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-05-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-05-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-05-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-05-22 08:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/86, pulse 84, wt 177 lb",
   "eGFR 68 (5/18)",
   "K 4.5 (5/18)",
   "UACR 47 mg/g (5/18)",
   "A1c 7.4% (5/18)",
   "LDL 116 mg/dL (5/18)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-05-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-05-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-05-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2019-11-13 08:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/75, pulse 75, wt 179 lb",
   "eGFR 68 (11/7)",
   "K 4.2 (11/7)",
   "UACR 80 mg/g (11/7)",
   "A1c 7.8% (11/7)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-11-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-11-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-11-13 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-03-30 12:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/83, repeat 137/81, pulse 73, wt 179 lb",
   "eGFR 66 (3/27)",
   "K 4.9 (3/27)",
   "UACR 68 mg/g (3/27)",
   "A1c 7.8% (3/27)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-03-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-03-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-03-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_49/0",
  "kind": "Medication event comment",
  "when": "2020-07-27 12:36",
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
   "insulin glargine: not started by 2020-07-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-07-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-07-27 12:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/91, repeat 135/91, pulse 67, wt 178 lb",
   "eGFR 67 (today)",
   "K 4.5 (today)",
   "UACR 66 mg/g (today)",
   "A1c 7.8% (today)",
   "LDL 166 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-07-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-07-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-01-04 13:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/76, pulse 78, wt 179 lb",
   "eGFR 64 (1/2)",
   "K 4.5 (1/2)",
   "UACR 64 mg/g (1/2)",
   "A1c 7.7% (1/2)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-01-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-01-04 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_58",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-05-19 11:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/71, pulse 72, wt 181 lb",
   "eGFR 63 (5/17)",
   "K 4 (5/17)",
   "A1c 7.4% (5/17)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-05-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-05-19 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-11-09 10:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/71, pulse 73, wt 177 lb",
   "eGFR 63 (today)",
   "K 4.4 (today)",
   "A1c 7.7% (today)",
   "LDL 116 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-11-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-11-09 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-05-02 15:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/80, pulse 77, wt 182 lb",
   "eGFR 61 (4/30)",
   "K 4.2 (4/30)",
   "A1c 7.7% (4/30)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-05-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-05-02 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_80",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-10-10 12:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/67, pulse 71, wt 180 lb",
   "eGFR 60 (today)",
   "K 4.4 (today)",
   "UACR 99 mg/g (today)",
   "A1c 7.8% (today)",
   "LDL 156 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-10-10 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-10-10 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_94",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-02-13 09:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/80, pulse 79, wt 179 lb",
   "eGFR 61 (2/8)",
   "K 4.5 (2/8)",
   "UACR 110 mg/g (2/8)",
   "A1c 7.7% (2/8)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-02-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-02-13 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2023-02-22 13:38",
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
   "metformin: held today (vomiting, poor oral intake); review 2023-03-01"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-02-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-02-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_175",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2023-02-22 13:33",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2023-03-01"
  ],
  "context": [],
  "forbidden": [
   "insulin glargine: not started by 2023-02-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-02-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2023-03-02 12:20",
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
  "forbidden": [
   "insulin glargine: not started by 2023-03-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-03-02 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_176",
  "kind": "Primary care phone visit note (reason: Phone: feeling better)",
  "when": "2023-03-02 12:16",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "context": [],
  "forbidden": [
   "insulin glargine: not started by 2023-03-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-03-02 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_112/0",
  "kind": "Problem list comment",
  "when": "2023-06-29 12:47",
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
   "onset 2023-06-29",
   "supporting result: eGFR 61 (2/8)",
   "supporting result: eGFR 59 (today)",
   "supporting result: UACR 185 mg/g (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-06-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-06-29 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_105",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-29 12:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/75, pulse 65, wt 179 lb",
   "eGFR 59 (today)",
   "K 4.5 (today)",
   "UACR 185 mg/g (today)",
   "A1c 7.7% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-06-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-06-29 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_113",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-12-04 08:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/76, pulse 86, wt 180 lb",
   "eGFR 58 (11/29)",
   "K 4.5 (11/29)",
   "UACR 147 mg/g (11/29)",
   "A1c 7.8% (11/29)",
   "LDL 176 mg/dL (11/29)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-12-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-12-04 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_124",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-05-03 13:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/80, pulse 87, wt 179 lb",
   "eGFR 57 (4/27)",
   "K 4.1 (4/27)",
   "UACR 206 mg/g (4/27)",
   "A1c 7.9% (4/27)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-05-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-05-03 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_131",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-02 11:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/72, pulse 71, wt 179 lb",
   "eGFR 53 (today)",
   "K 4.7 (today)",
   "UACR 215 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-10-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-10-02 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_138",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-03-11 11:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/88, pulse 63, wt 183 lb",
   "eGFR 50 (today)",
   "K 4.2 (today)",
   "A1c 7.6% (today)",
   "LDL 166 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-03-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2025-03-11 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_149",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-07-29 10:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/80, pulse 77, wt 177 lb",
   "eGFR 47 (today)",
   "K 4.6 (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-07-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2025-07-29 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_162/0",
  "kind": "Medication event comment",
  "when": "2025-12-01 10:37",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.5"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.5)"
  ],
  "forbidden": [
   "finerenone: not started by 2025-12-01 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/3",
  "kind": "Medication event comment",
  "when": "2025-12-01 10:36",
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
   "insulin glargine: not started by 2025-12-01 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2025-12-01 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_177/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2025-12-01 11:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 43, UACR 314 mg/g: CKD evaluation and management"
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
   "finerenone: not started by 2025-12-01 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_155",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-12-01 10:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)",
   "insulin glargine: started 10 units at bedtime today (A1c 8.5)"
  ],
  "context": [
   "BP 117/68, pulse 86, wt 177 lb",
   "eGFR 44 (11/25)",
   "K 4.6 (11/25)",
   "UACR 198 mg/g (11/25)",
   "A1c 8.5% (11/25)"
  ],
  "forbidden": [
   "finerenone: not started by 2025-12-01 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_185",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2026-02-10 13:25",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_163",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-04-08 11:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/81, pulse 87, wt 180 lb",
   "eGFR 41 (4/3)",
   "K 4.4 (4/3)",
   "UACR 177 mg/g (4/3)",
   "A1c 7.5% (4/3)",
   "LDL 174 mg/dL (4/3)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
