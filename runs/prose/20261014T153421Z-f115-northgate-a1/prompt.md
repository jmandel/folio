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
  "key": "B/med/m_24/0",
  "kind": "Medication event comment",
  "when": "2024-05-27 15:52",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: HFrEF"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (HFrEF)"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-05-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_23/0",
  "kind": "Medication event comment",
  "when": "2024-05-27 15:51",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.3)"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-05-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "ibuprofen: not started by 2024-05-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2024-05-27 16:02",
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
   "onset 2010-08",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-05-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2024-05-27 16:02",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-05-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2024-05-27 16:02",
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
   "onset 2018-09",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-05-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2024-05-27 16:02",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Heart failure with reduced ejection fraction\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Heart failure with reduced ejection fraction",
   "onset 2023-07-13",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-05-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2024-05-27 16:02",
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
   "onset 2023",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-05-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_12",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2024-05-27 15:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.3)",
   "dapagliflozin: started 10 mg daily today (HFrEF)"
  ],
  "context": [
   "BP 134/73, pulse 74, wt 121 lb",
   "eGFR 90 (today)",
   "K 4.4 (today)",
   "UACR 170 mg/g (today)",
   "A1c 8.3% (today)",
   "LDL 49 mg/dL (today)"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-05-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-21 11:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/79, pulse 71, wt 117 lb",
   "eGFR 89 (today)",
   "K 4.2 (today)",
   "UACR 191 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-10-21 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2024-11-08 10:01",
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
   "metformin: held today (vomiting, poor oral intake); review 2024-11-15"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-11-08 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_129",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2024-11-08 09:56",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2024-11-15"
  ],
  "context": [],
  "forbidden": [
   "ibuprofen: not started by 2024-11-08 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-03-24 12:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 115/73, pulse 75, wt 120 lb",
   "eGFR 89 (today)",
   "K 4.6 (today)",
   "UACR 169 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "ibuprofen: not started by 2025-03-24 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_42",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-08-29 14:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/78, pulse 65, wt 123 lb",
   "eGFR 88 (today)",
   "K 4.8 (today)",
   "A1c 7.2% (today)",
   "LDL 77 mg/dL (today)"
  ],
  "forbidden": [
   "ibuprofen: not started by 2025-08-29 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_127/0",
  "kind": "Allergy list comment",
  "when": "2025-10-27 11:25",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "ibuprofen: not started by 2025-10-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_24/1",
  "kind": "Medication event comment",
  "when": "2025-10-27 11:22",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "ibuprofen: not started by 2025-10-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_126",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-10-27 11:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: stopped today (euglycemic DKA)",
   "dapagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 126/78, pulse 76, wt 122 lb"
  ],
  "forbidden": [
   "ibuprofen: not started by 2025-10-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-02-09 15:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 114/63, pulse 86, wt 122 lb",
   "eGFR 86 (today)",
   "K 5.1 (today)",
   "UACR 204 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-06-15 15:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/75, pulse 84, wt 121 lb",
   "eGFR 89 (6/9)",
   "K 5.9 (6/9), hemolyzed",
   "A1c 7.3% (6/9)",
   "K 4.5 (6/9)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_94 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
