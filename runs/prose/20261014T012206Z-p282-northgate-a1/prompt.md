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
  "when": "2019-06-21 13:12",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-21 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2019-06-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2019-06-21 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-06-21 13:12",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-21 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2019-06-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2019-06-21 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-06-21 13:12",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2016-05",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-21 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2019-06-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2019-06-21 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-06-21 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 101/62, pulse 68, wt 192 lb",
   "eGFR 65 (today)",
   "K 4.6 (today)"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-21 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2019-06-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2019-06-21 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_14",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2020-04-20 13:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/73, pulse 80, wt 194 lb",
   "eGFR 66 (today)",
   "K 4.5 (today)"
  ],
  "forbidden": [
   "losartan: not started by 2020-04-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2020-04-20 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2020-04-20 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-03-01 08:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 114/70, pulse 67, wt 194 lb",
   "eGFR 66 (2/27)",
   "K 4.8 (2/27)",
   "LDL 124 mg/dL (2/27)"
  ],
  "forbidden": [
   "losartan: not started by 2021-03-01 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2021-03-01 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2021-03-01 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_38/0",
  "kind": "Allergy list comment",
  "when": "2021-10-15 12:43",
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
   "empagliflozin: not started by 2021-10-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2021-10-15 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2021-10-15 12:41",
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
   "losartan: not started by 2021-10-15 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2021-10-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2021-10-15 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_37/0",
  "kind": "Medication event comment",
  "when": "2021-10-15 12:42",
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
   "empagliflozin: not started by 2021-10-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2021-10-15 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_31",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-10-15 12:20",
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
   "BP 113/69, pulse 85, wt 195 lb",
   "eGFR 64 (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-10-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2021-10-15 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-05-18 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 106/75, pulse 71, wt 194 lb",
   "eGFR 63 (today)",
   "K 4.6 (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-05-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2022-05-18 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_46",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-03-14 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 110/73, pulse 88, wt 194 lb",
   "eGFR 60 (today)",
   "K 4.7 (today)",
   "LDL 124 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-03-14 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "atorvastatin: not started by 2023-03-14 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_68/0",
  "kind": "Medication event comment",
  "when": "2024-01-22 14:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: HFrEF"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (HFrEF)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2024-01-22 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_67/0",
  "kind": "Problem list comment",
  "when": "2024-01-22 14:52",
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
   "onset 2024-01-22",
   "supporting result: eGFR 60 (3/14/23)",
   "supporting result: eGFR 60 (today)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2024-01-22 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-01-22 14:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (HFrEF)"
  ],
  "context": [
   "BP 115/62, pulse 83, wt 192 lb",
   "eGFR 60 (today)",
   "K 4.5 (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "atorvastatin: not started by 2024-01-22 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_69",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2024-09-24 11:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 103/63, pulse 63, wt 192 lb",
   "eGFR 62 (today)",
   "K 4.7 (today)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2024-09-24 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2025-07-02 11:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 112/64, pulse 64, wt 194 lb",
   "eGFR 62 (today)",
   "K 4.8 (today)"
  ],
  "forbidden": [
   "atorvastatin: not started by 2025-07-02 (pattern /\\b(atorvastatin|Lipitor)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_89",
  "kind": "Chart correction comment",
  "when": "2025-07-16 08:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The atorvastatin 80 mg start entered 2025-07-15 was entry error"
  ],
  "context": [
   "atorvastatin: entered in error today (entry error)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_81",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-03-13 08:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 102/54, pulse 77, wt 193 lb",
   "eGFR 60 (today)",
   "K 4.7 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
