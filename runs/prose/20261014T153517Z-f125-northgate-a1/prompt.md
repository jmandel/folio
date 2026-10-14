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

## Requests (24)

```json
[
 {
  "key": "B/med/m_19/0",
  "kind": "Medication event comment",
  "when": "2024-04-17 10:22",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2024-04-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-04-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-04-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-04-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_18/0",
  "kind": "Medication event comment",
  "when": "2024-04-17 10:21",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2024-04-17 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2024-04-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-04-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-04-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-04-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2024-04-17 10:32",
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
   "onset 2019-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-04-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-04-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-04-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-04-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2024-04-17 10:32",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-04-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-04-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-04-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-04-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2024-04-17 10:32",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-04-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-04-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-04-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-04-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2024-04-17 10:32",
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
   "onset 2009",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-04-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-04-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-04-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-04-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_125/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2024-04-17 10:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 57, UACR 375 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-04-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-04-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-04-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-04-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2024-04-17 10:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)",
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "BP 154/98, pulse 68, wt 174 lb",
   "eGFR 55 (4/15)",
   "K 4.1 (4/15)",
   "A1c 8.3% (4/15)",
   "LDL 97 mg/dL (4/15)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-04-17 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-04-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-04-17 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-04-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2024-09-02 12:36",
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
   "chlorthalidone: not started by 2024-09-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-09-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-09-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-09-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_26/0",
  "kind": "Problem list comment",
  "when": "2024-09-02 12:47",
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
   "onset 2024-09-02",
   "supporting result: eGFR 57 (5/29)",
   "supporting result: eGFR 57 (today)",
   "supporting result: UACR 355 mg/g (5/29)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-09-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-09-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-09-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-09-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-09-02 12:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 152/92, repeat 149/88, pulse 81, wt 173 lb",
   "eGFR 57 (today)",
   "K 4.2 (today)",
   "A1c 7.6% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-09-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-09-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-09-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-09-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_105/0",
  "kind": "Allergy list comment",
  "when": "2024-10-03 13:10",
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
   "chlorthalidone: not started by 2024-10-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-10-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-10-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-10-03 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_19/1",
  "kind": "Medication event comment",
  "when": "2024-10-03 13:07",
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
   "chlorthalidone: not started by 2024-10-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-10-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-10-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-10-03 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_104",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2024-10-03 12:45",
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
   "BP 136/78, pulse 67, wt 172 lb"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-10-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2024-10-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2024-10-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2024-10-03 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_34/0",
  "kind": "Medication event comment",
  "when": "2025-01-21 14:21",
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
   "dulaglutide: not started by 2025-01-21 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2025-01-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2025-01-21 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-21 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/89, repeat 144/89, pulse 66, wt 175 lb",
   "eGFR 55 (1/18)",
   "K 4.4 (1/18)",
   "UACR 416 mg/g (1/18)",
   "A1c 8% (1/18)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-01-21 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2025-01-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2025-01-21 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-09 12:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/72, pulse 71, wt 174 lb",
   "eGFR 55 (7/7)",
   "K 4.9 (7/7)",
   "UACR 359 mg/g (7/7)",
   "A1c 7.9% (7/7)",
   "LDL 101 mg/dL (7/7)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-07-09 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2025-07-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metoprolol succinate: not started by 2025-07-09 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_124",
  "kind": "Chart correction comment",
  "when": "2025-07-31 08:23",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The metoprolol succinate 50 mg start entered 2025-07-30 was wrong patient"
  ],
  "context": [
   "metoprolol succinate: entered in error today (wrong patient)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-07-31 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2025-07-31 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_53/0",
  "kind": "Medication event comment",
  "when": "2025-11-26 12:41",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.6"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.6)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-11-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_46",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-11-26 12:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.6)"
  ],
  "context": [
   "BP 147/86, pulse 71, wt 177 lb",
   "eGFR 55 (today)",
   "K 4.7 (today)",
   "UACR 506 mg/g (today)",
   "A1c 8.6% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-11-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2026-01-01 11:07",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "metformin: held today (vomiting, poor oral intake); review 2026-01-08"
  ],
  "forbidden": [
   "amlodipine: not started by 2026-01-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_123",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2026-01-01 11:02",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2026-01-08"
  ],
  "context": [],
  "forbidden": [
   "amlodipine: not started by 2026-01-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_61/0",
  "kind": "Medication event comment",
  "when": "2026-04-13 13:11",
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
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-04-13 12:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/85, pulse 76, wt 174 lb",
   "eGFR 52 (4/11)",
   "K 4.2 (4/11)",
   "UACR 439 mg/g (4/11)",
   "A1c 7.7% (4/11)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
