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
  "when": "2023-10-12 10:42",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-10-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-10-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2023-10-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2023-10-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2023-10-12 10:42",
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
   "onset 2016-09",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-10-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-10-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2023-10-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2023-10-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2023-10-12 10:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2021-04-14",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-10-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-10-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2023-10-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2023-10-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2023-10-12 10:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2008",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-10-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-10-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2023-10-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2023-10-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2023-10-12 10:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2021",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-10-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-10-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2023-10-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2023-10-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_6/0",
  "kind": "Problem list comment",
  "when": "2023-10-12 10:42",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Hypothyroidism\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Hypothyroidism",
   "onset 2012-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-10-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-10-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2023-10-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2023-10-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_11",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2023-10-12 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/86, pulse 62, wt 233 lb",
   "eGFR 51 (10/6)",
   "K 4.6 (10/6)",
   "UACR 110 mg/g (10/6)",
   "A1c 7.8% (10/6)",
   "LDL 93 mg/dL (10/6)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-10-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-10-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2023-10-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2023-10-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_31/0",
  "kind": "Problem list comment",
  "when": "2024-05-05 16:25",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2024-05-05",
   "supporting result: eGFR 51 (10/6/23)",
   "supporting result: eGFR 51 (today)",
   "supporting result: UACR 163 mg/g (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2024-05-05 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2024-05-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2024-05-05 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2024-05-05 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_32/0",
  "kind": "Medication event comment",
  "when": "2024-05-07 11:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.4, CKD"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.4, CKD)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-05-07 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2024-05-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2024-05-07 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-05-07 11:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.4, CKD)"
  ],
  "context": [
   "BP 136/82, pulse 72, wt 231 lb",
   "eGFR 51 (5/5)",
   "K 4.4 (5/5)",
   "UACR 163 mg/g (5/5)",
   "A1c 8.4% (5/5)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-05-07 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2024-05-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2024-05-07 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-12-03 12:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/83, pulse 78, wt 228 lb",
   "eGFR 49 (11/29)",
   "K 4.4 (11/29)",
   "A1c 7.8% (11/29)",
   "LDL 72 mg/dL (11/29)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-12-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2024-12-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2024-12-03 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_44",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-09-11 13:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/67, pulse 82, wt 229 lb",
   "eGFR 45 (9/8)",
   "K 4.7 (9/8)",
   "UACR 144 mg/g (9/8)",
   "A1c 8% (9/8)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-09-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "losartan: not started by 2025-09-11 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: not started by 2025-09-11 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_63/0",
  "kind": "Allergy list comment",
  "when": "2026-05-04 13:54",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "lisinopril: dry cough (intolerance)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema)."
  ],
  "context": [
   "lisinopril intolerance: dry cough"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_61/0",
  "kind": "Medication event comment",
  "when": "2026-05-04 13:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.6"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.6)"
  ],
  "forbidden": [
   "losartan: not started by 2026-05-04 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2026-05-04 13:52",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 20 MG Oral Tablet 20 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "losartan: not started by 2026-05-04 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_62/0",
  "kind": "Medication event comment",
  "when": "2026-05-04 13:53",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start losartan potassium 50 MG Oral Tablet 50 mg QD; reason: ACE inhibitor cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: started 50 mg daily today (ACE inhibitor cough)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_51",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-05-04 13:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.6)",
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 129/80, pulse 73, wt 228 lb",
   "eGFR 45 (today)",
   "K 4.7 (today)",
   "A1c 8.6% (today)",
   "LDL 83 mg/dL (today)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
