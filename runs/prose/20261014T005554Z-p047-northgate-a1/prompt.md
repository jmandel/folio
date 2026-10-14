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
  "when": "2019-06-27 09:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2007",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-06-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-06-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2019-06-27 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-06-27 09:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "dulaglutide: not started by 2019-06-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-06-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2019-06-27 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-06-27 09:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/77, pulse 62, wt 174 lb",
   "eGFR 78 (6/22)",
   "K 4.7 (6/22)",
   "UACR 8 mg/g (6/22)",
   "A1c 7.3% (6/22)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2019-06-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2019-06-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2019-06-27 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-02-13 15:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/75, pulse 64, wt 172 lb",
   "eGFR 76 (today)",
   "K 4.6 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-02-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-02-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2020-02-13 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-12-29 08:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/79, pulse 70, wt 174 lb",
   "eGFR 74 (12/23)",
   "K 4.7 (12/23)",
   "UACR 14 mg/g (12/23)",
   "A1c 7.7% (12/23)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2020-12-29 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "insulin glargine: not started by 2020-12-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2020-12-29 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_42/0",
  "kind": "Medication event comment",
  "when": "2021-10-22 16:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.4)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-10-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2021-10-22 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-10-22 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.4)"
  ],
  "context": [
   "BP 127/81, pulse 86, wt 175 lb",
   "eGFR 75 (10/19)",
   "K 4 (10/19)",
   "A1c 8.4% (10/19)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-10-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2021-10-22 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_43",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-07-18 12:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/76, pulse 83, wt 174 lb",
   "eGFR 73 (today)",
   "K 4.3 (today)",
   "UACR 9 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-07-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2022-07-18 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-02-21 15:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/73, pulse 63, wt 174 lb",
   "eGFR 76 (2/15)",
   "K 4.6 (2/15)",
   "UACR 11 mg/g (2/15)",
   "A1c 7.5% (2/15)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2023-02-21 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_60",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-10-02 11:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/84, pulse 69, wt 171 lb",
   "eGFR 73 (today)",
   "K 4.6 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-10-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "atorvastatin: not started by 2023-10-02 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_74/0",
  "kind": "Medication event comment",
  "when": "2024-05-01 16:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2024-05-01 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-05-01 15:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink."
   }
  ],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "context": [
   "BP 142/84, repeat 140/84, pulse 63, wt 173 lb",
   "eGFR 74 (today)",
   "K 6.2 (today), hemolyzed",
   "UACR 9 mg/g (today)",
   "A1c 8.3% (today)",
   "K 4.7 (today)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2024-05-01 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_140",
  "kind": "Chart correction comment",
  "when": "2024-06-01 08:44",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The atorvastatin 80 mg start entered 2024-05-31 was entry error"
  ],
  "context": [
   "atorvastatin: entered in error today (entry error)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_78",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-11 15:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/80, pulse 85, wt 176 lb",
   "eGFR 73 (today)",
   "K 4.2 (today)",
   "UACR 13 mg/g (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_137/0",
  "kind": "Allergy list comment",
  "when": "2025-07-01 12:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2025-07-01 12:07",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "key": "B/visit/e_136",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-07-01 11:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "BP 142/78, repeat 138/75, pulse 73, wt 177 lb"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_89",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-10-13 09:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/84, pulse 74, wt 176 lb",
   "eGFR 77 (today)",
   "K 4.2 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
