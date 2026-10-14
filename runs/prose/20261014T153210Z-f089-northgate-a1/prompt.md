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

## Requests (22)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2023-03-23 16:17",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-03-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2023-03-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2023-03-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-03-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2023-03-23 16:17",
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
   "empagliflozin: not started by 2023-03-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2023-03-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2023-03-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-03-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2023-03-23 16:17",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-03-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2023-03-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2023-03-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-03-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2023-03-23 16:17",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-03-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2023-03-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2023-03-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-03-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2023-03-23 16:17",
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
   "onset 2019-04-23",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-03-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2023-03-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2023-03-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-03-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2023-03-23 15:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 161/94, repeat 154/93, pulse 80, wt 233 lb"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-03-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2023-03-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2023-03-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-03-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_16/0",
  "kind": "Allergy list comment",
  "when": "2023-11-06 12:35",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "dulaglutide: not started by 2023-11-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-11-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_14/0",
  "kind": "Medication event comment",
  "when": "2023-11-06 12:31",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "forbidden": [
   "losartan: not started by 2023-11-06 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2023-11-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-11-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2023-11-06 12:32",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change lisinopril 40 MG Oral Tablet 40 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "losartan: not started by 2023-11-06 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2023-11-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-11-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2023-11-06 12:33",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 40 MG Oral Tablet 40 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "losartan: not started by 2023-11-06 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "dulaglutide: not started by 2023-11-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-11-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_15/0",
  "kind": "Medication event comment",
  "when": "2023-11-06 12:34",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "dulaglutide: not started by 2023-11-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-11-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_12",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-11-06 12:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c above goal)",
   "lisinopril: stopped today (dry cough)",
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 160/98, repeat 156/98, pulse 62, wt 232 lb"
  ],
  "forbidden": [
   "dulaglutide: not started by 2023-11-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2023-11-06 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-11-06 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_71/0",
  "kind": "Allergy list comment",
  "when": "2024-07-22 10:55",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "dulaglutide: not started by 2024-07-22 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2024-07-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-07-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_14/1",
  "kind": "Medication event comment",
  "when": "2024-07-22 10:52",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "dulaglutide: not started by 2024-07-22 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2024-07-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-07-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_70",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2024-07-22 10:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: stopped today (euglycemic DKA)",
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 146/78, repeat 143/78, pulse 64, wt 232 lb"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-07-22 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "chlorthalidone: not started by 2024-07-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-07-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_20/0",
  "kind": "Medication event comment",
  "when": "2024-09-30 13:41",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2024-09-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-09-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_15/1",
  "kind": "Medication event comment",
  "when": "2024-09-30 13:42",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change losartan potassium 100 MG Oral Tablet 100 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-09-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-09-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-30 13:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.4)",
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 158/98, pulse 66, wt 235 lb"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-09-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-09-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_23/0",
  "kind": "Medication event comment",
  "when": "2025-04-22 12:36",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "amlodipine: not started by 2025-04-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-22 12:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 156/93, pulse 81, wt 230 lb"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-04-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_26/0",
  "kind": "Medication event comment",
  "when": "2026-02-27 09:41",
  "author": "Moira Brennan, DO (Primary care physician)",
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
  "key": "B/visit/e_24",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-02-27 09:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/80, pulse 82, wt 233 lb"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
