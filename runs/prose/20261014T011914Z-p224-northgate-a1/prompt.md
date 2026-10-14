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
  "when": "2020-07-03 15:12",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-07-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-07-03 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 15:12",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-07-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-07-03 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 15:12",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2015-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-07-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-07-03 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 15:12",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2018-07-15",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-07-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-07-03 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-07-03 14:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/83, pulse 82, wt 203 lb",
   "eGFR 60 (today)",
   "K 4.4 (today)",
   "A1c 7.2% (today)",
   "LDL 93 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2020-07-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2020-07-03 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-04-19 09:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/81, pulse 83, wt 200 lb",
   "eGFR 61 (4/15)",
   "K 6.4 (4/15), hemolyzed",
   "UACR 189 mg/g (4/15)",
   "A1c 7.2% (4/15)",
   "K 4.1 (4/15)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2021-04-19 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2021-04-19 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-02-03 10:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/83, pulse 74, wt 200 lb",
   "eGFR 61 (today)",
   "K 4.4 (today)",
   "A1c 7.1% (today)",
   "LDL 80 mg/dL (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-02-03 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2022-02-03 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_46/0",
  "kind": "Problem list comment",
  "when": "2022-09-11 16:25",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2022-09-11",
   "supporting result: eGFR 61 (2/3)",
   "supporting result: eGFR 60 (today)",
   "supporting result: UACR 195 mg/g (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-09-11 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2022-09-11 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_39",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-09-13 10:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/89, repeat 134/87, pulse 68, wt 200 lb",
   "eGFR 60 (9/11)",
   "K 4.2 (9/11)",
   "UACR 195 mg/g (9/11)",
   "A1c 6.5% (9/11)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2022-09-13 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2022-09-13 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-06-09 14:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/84, pulse 66, wt 201 lb",
   "eGFR 58 (today)",
   "K 4.2 (today)",
   "A1c 6.1% (today)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2023-06-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "naproxen: not started by 2023-06-09 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_71/0",
  "kind": "Medication event comment",
  "when": "2024-01-18 13:06",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "forbidden": [
   "naproxen: not started by 2024-01-18 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-01-18 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "context": [
   "BP 137/90, pulse 69, wt 198 lb",
   "eGFR 58 (today)",
   "K 4.6 (today)",
   "UACR 219 mg/g (today)",
   "A1c 6.2% (today)",
   "LDL 88 mg/dL (today)"
  ],
  "forbidden": [
   "naproxen: not started by 2024-01-18 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-03 08:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/67, pulse 85, wt 202 lb",
   "eGFR 60 (8/31)",
   "K 4.6 (8/31)",
   "UACR 213 mg/g (8/31)",
   "A1c 6.3% (8/31)"
  ],
  "forbidden": [
   "naproxen: not started by 2024-09-03 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_162/0",
  "kind": "Allergy list comment",
  "when": "2024-11-26 08:40",
  "author": "Moira Brennan, DO (Primary care physician)",
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
  "forbidden": [
   "naproxen: not started by 2024-11-26 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_71/1",
  "kind": "Medication event comment",
  "when": "2024-11-26 08:37",
  "author": "Moira Brennan, DO (Primary care physician)",
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
  "forbidden": [
   "naproxen: not started by 2024-11-26 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_161",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2024-11-26 08:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed."
   }
  ],
  "mustInclude": [
   "dapagliflozin: stopped today (euglycemic DKA)",
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 134/78, pulse 68, wt 198 lb"
  ],
  "forbidden": [
   "naproxen: not started by 2024-11-26 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_79",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-05-27 12:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 119/67, pulse 86, wt 196 lb",
   "eGFR 61 (today)",
   "K 4.5 (today)",
   "UACR 170 mg/g (today)",
   "A1c 6.1% (today)",
   "LDL 96 mg/dL (today)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_90",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-12-24 13:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 119/75, pulse 75, wt 198 lb",
   "eGFR 57 (today)",
   "K 4.2 (today)",
   "UACR 255 mg/g (today)",
   "A1c 6.2% (today)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_98",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-08-31 10:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 119/74, pulse 65, wt 200 lb",
   "eGFR 59 (today)",
   "K 4.5 (today)",
   "A1c 6.6% (today)",
   "LDL 66 mg/dL (today)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
