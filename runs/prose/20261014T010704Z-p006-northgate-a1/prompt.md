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

## Requests (20)

```json
[
 {
  "key": "B/med/m_15/0",
  "kind": "Medication event comment",
  "when": "2021-11-11 11:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 8.4)"
  ],
  "forbidden": [
   "losartan: not started by 2021-11-11 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-11-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-11-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2021-11-11 11:17",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2021-11-11 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-11-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-11-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2021-11-11 11:17",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2021-11-11 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-11-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-11-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2021-11-11 11:17",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2021-11-11 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-11-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-11-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2021-11-11 10:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 8.4)"
  ],
  "context": [
   "BP 130/82, pulse 77, wt 197 lb",
   "eGFR 72 (today)",
   "K 4.1 (today)",
   "UACR 13 mg/g (today)",
   "A1c 8.4% (today)"
  ],
  "forbidden": [
   "losartan: not started by 2021-11-11 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2021-11-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-11-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_16",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-03-15 14:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/69, pulse 85, wt 200 lb",
   "eGFR 70 (3/12)",
   "K 4.5 (3/12)",
   "A1c 7.3% (3/12)",
   "LDL 94 mg/dL (3/12)"
  ],
  "forbidden": [
   "losartan: not started by 2022-03-15 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2022-03-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-03-15 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_36/0",
  "kind": "Allergy list comment",
  "when": "2022-08-08 10:53",
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
   "insulin glargine: not started by 2022-08-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-08-08 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2022-08-08 10:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 10 MG Oral Tablet 10 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "losartan: not started by 2022-08-08 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2022-08-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-08-08 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_35/0",
  "kind": "Medication event comment",
  "when": "2022-08-08 10:52",
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
   "insulin glargine: not started by 2022-08-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-08-08 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-08-08 10:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 143/86, pulse 83, wt 199 lb",
   "eGFR 68 (today)",
   "K 4.4 (today)",
   "UACR 11 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-08-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-08-08 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-01-31 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/76, pulse 72, wt 201 lb",
   "eGFR 68 (today)",
   "K 4.4 (today)",
   "UACR 10 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-01-31 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2023-01-31 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_60/0",
  "kind": "Medication event comment",
  "when": "2023-07-24 09:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2023-07-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_46",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-07-24 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 134/86, pulse 87, wt 198 lb",
   "eGFR 67 (today)",
   "K 4.2 (today)",
   "UACR 10 mg/g (today)",
   "A1c 8.1% (today)",
   "LDL 79 mg/dL (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2023-07-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-01-01 08:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/77, pulse 80, wt 201 lb",
   "eGFR 68 (today)",
   "K 4.6 (today)",
   "UACR 12 mg/g (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-01-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-05-16 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/78, pulse 68, wt 198 lb",
   "eGFR 65 (5/13)",
   "K 4.1 (5/13)",
   "UACR 12 mg/g (5/13)",
   "A1c 7.4% (5/13)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-05-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_78",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-28 08:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/83, repeat 139/83, pulse 75, wt 198 lb",
   "eGFR 68 (today)",
   "K 4.2 (today)",
   "UACR 13 mg/g (today)",
   "A1c 7.8% (today)",
   "LDL 94 mg/dL (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-10-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_97/0",
  "kind": "Medication event comment",
  "when": "2025-04-07 11:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_89",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-04-07 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.1)"
  ],
  "context": [
   "BP 136/82, pulse 66, wt 199 lb",
   "eGFR 65 (today)",
   "K 4.4 (today)",
   "UACR 12 mg/g (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_98",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-09-15 09:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/82, pulse 88, wt 200 lb",
   "eGFR 67 (today)",
   "K 4.4 (today)",
   "UACR 14 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_108",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-02-13 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/74, pulse 63, wt 201 lb",
   "eGFR 63 (2/11)",
   "K 4.9 (2/11)",
   "A1c 7.7% (2/11)",
   "LDL 77 mg/dL (2/11)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
