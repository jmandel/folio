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
  "when": "2022-01-26 15:47",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-01-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-01-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-01-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-01-26 15:47",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-01-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-01-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-01-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-01-26 15:47",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2010-05",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-01-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-01-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-01-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-01-26 15:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/77, pulse 67, wt 246 lb",
   "eGFR 55 (1/20)",
   "K 4.1 (1/20)",
   "UACR 457 mg/g (1/20)",
   "A1c 7.1% (1/20)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-01-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-01-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-01-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_27/0",
  "kind": "Problem list comment",
  "when": "2022-10-15 16:25",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2022-10-15",
   "supporting result: eGFR 55 (1/20)",
   "supporting result: eGFR 49 (today)",
   "supporting result: UACR 457 mg/g (1/20)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-10-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-10-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-10-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_14",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-10-18 15:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/92, repeat 140/91, pulse 68, wt 244 lb",
   "eGFR 49 (10/15)",
   "K 4.3 (10/15)",
   "A1c 7.4% (10/15)",
   "LDL 40 mg/dL (10/15)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-10-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-10-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-10-18 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-09-05 14:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/77, pulse 84, wt 249 lb",
   "eGFR 47 (today)",
   "K 4.2 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-09-05 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-09-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2023-09-05 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_50/0",
  "kind": "Medication event comment",
  "when": "2024-04-03 15:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: CKD + DM, cardiorenal benefit"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-04-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2024-04-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_37",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-04-03 15:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "BP 139/84, pulse 67, wt 247 lb",
   "eGFR 49 (3/28)",
   "K 4.2 (3/28)",
   "A1c 7.7% (3/28)",
   "LDL 106 mg/dL (3/28)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-04-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2024-04-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_58/0",
  "kind": "Medication event comment",
  "when": "2024-12-24 13:51",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-12-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_51",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-12-24 13:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 141/89, repeat 138/85, pulse 66, wt 246 lb",
   "eGFR 45 (today)",
   "K 4.2 (today)",
   "UACR 572 mg/g (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-12-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_146/0",
  "kind": "Allergy list comment",
  "when": "2025-06-03 09:25",
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
   "dulaglutide: not started by 2025-06-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_50/1",
  "kind": "Medication event comment",
  "when": "2025-06-03 09:22",
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
   "dulaglutide: not started by 2025-06-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_145",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-06-03 09:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed."
   }
  ],
  "mustInclude": [
   "empagliflozin: stopped today (euglycemic DKA)",
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 136/78, pulse 78, wt 246 lb"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-06-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-07-22 09:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/73, pulse 62, wt 245 lb",
   "eGFR 41 (7/20)",
   "K 4.6 (7/20)",
   "UACR 675 mg/g (7/20)",
   "A1c 7.5% (7/20)",
   "LDL 75 mg/dL (7/20)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-07-22 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_79/0",
  "kind": "Medication event comment",
  "when": "2026-05-04 13:41",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "forbidden": [
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-05-04 13:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 132/81, pulse 69, wt 247 lb",
   "eGFR 38 (4/28)",
   "K 6.3 (4/28), hemolyzed",
   "UACR 618 mg/g (4/28)",
   "A1c 8.1% (4/28)",
   "K 4.3 (4/28)"
  ],
  "forbidden": [
   "nf_104 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
