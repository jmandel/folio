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
   "carvedilol: not started by 2019-06-27 (pattern /\\b(carvedilol|Coreg)\\b/i)"
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
   "carvedilol: not started by 2019-06-27 (pattern /\\b(carvedilol|Coreg)\\b/i)"
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
   "A1c 7.3% (6/22)",
   "LDL 146 mg/dL (6/22)"
  ],
  "forbidden": [
   "carvedilol: not started by 2019-06-27 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
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
   "A1c 6.6% (today)"
  ],
  "forbidden": [
   "carvedilol: not started by 2020-02-13 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_24",
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
   "A1c 6.6% (12/23)",
   "LDL 144 mg/dL (12/23)"
  ],
  "forbidden": [
   "carvedilol: not started by 2020-12-29 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_36",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-10-22 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/81, pulse 86, wt 175 lb",
   "eGFR 75 (10/19)",
   "K 4 (10/19)",
   "A1c 6.7% (10/19)"
  ],
  "forbidden": [
   "carvedilol: not started by 2021-10-22 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
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
   "A1c 6.8% (today)",
   "LDL 132 mg/dL (today)"
  ],
  "forbidden": [
   "carvedilol: not started by 2022-07-18 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
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
   "A1c 6.9% (2/15)"
  ],
  "forbidden": [
   "carvedilol: not started by 2023-02-21 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
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
   "A1c 7.2% (today)",
   "LDL 147 mg/dL (today)"
  ],
  "forbidden": [
   "carvedilol: not started by 2023-10-02 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_76",
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
  "mustInclude": [],
  "context": [
   "BP 142/84, repeat 140/84, pulse 63, wt 173 lb",
   "eGFR 74 (today)",
   "K 6 (today), hemolyzed",
   "UACR 9 mg/g (today)",
   "A1c 7.2% (today)",
   "K 4.5 (today)"
  ],
  "forbidden": [
   "carvedilol: not started by 2024-05-01 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_151",
  "kind": "Chart correction comment",
  "when": "2024-06-01 08:28",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The carvedilol 12.5 mg start entered 2024-05-31 was entry error"
  ],
  "context": [
   "carvedilol: entered in error today (entry error)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_87",
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
   "A1c 6.8% (today)",
   "LDL 92 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_148/0",
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
  "key": "B/visit/e_147",
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
  "key": "B/visit/e_100",
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
   "A1c 6.7% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
