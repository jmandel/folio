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

## Requests (35)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-08-28 15:52",
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
   "onset 2009",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-08-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-08-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2019-08-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2019-08-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-08-28 15:52",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-08-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-08-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2019-08-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2019-08-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-08-28 15:52",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-08-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-08-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2019-08-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2019-08-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-08-28 15:52",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-08-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-08-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2019-08-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2019-08-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-08-28 15:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/86, repeat 140/86, pulse 84, wt 226 lb",
   "eGFR 71 (today)",
   "K 4.5 (today)",
   "UACR 423 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 74 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-08-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-08-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2019-08-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2019-08-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_26/0",
  "kind": "Medication event comment",
  "when": "2019-12-27 11:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "insulin glargine: not started by 2019-12-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2019-12-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2019-12-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-12-27 11:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/82, repeat 135/82, pulse 76, wt 225 lb",
   "eGFR 70 (today)",
   "K 4.1 (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-12-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2019-12-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2019-12-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-05-19 14:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/78, pulse 73, wt 225 lb",
   "eGFR 69 (today)",
   "K 4.3 (today)",
   "UACR 458 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-05-19 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2020-05-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2020-05-19 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_34",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-09-21 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/88, pulse 74, wt 228 lb",
   "eGFR 68 (today)",
   "K 4.2 (today)",
   "A1c 7.6% (today)",
   "LDL 101 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-09-21 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2020-09-21 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2020-09-21 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-02-24 09:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/77, pulse 81, wt 224 lb",
   "eGFR 68 (today)",
   "K 4.5 (today)",
   "UACR 595 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-02-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-02-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2021-02-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_173/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-07-01 09:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 67, UACR 492 mg/g: CKD evaluation and management"
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
   "insulin glargine: not started by 2021-07-01 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-07-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2021-07-01 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-07-01 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/85, repeat 137/85, pulse 68, wt 226 lb",
   "eGFR 67 (6/25)",
   "K 4.2 (6/25)",
   "A1c 7.6% (6/25)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-07-01 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-07-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2021-07-01 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_181",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2021-09-06 15:55",
  "author": "Nina Ortiz, RN (Registered nurse)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "finerenone 10 mg QD added from the outside (Lakeview) record"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "finerenone 10 mg daily"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-09-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-09-06 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_58",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-11-02 15:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/80, pulse 78, wt 227 lb",
   "eGFR 66 (today)",
   "K 4.6 (today)",
   "UACR 547 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-11-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-11-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_65",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-03-21 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/81, pulse 74, wt 226 lb",
   "eGFR 65 (today)",
   "K 4.1 (today)",
   "UACR 912 mg/g (today)",
   "A1c 7.7% (today)",
   "LDL 119 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-03-21 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-03-21 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_76",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-07-27 14:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/79, pulse 76, wt 227 lb",
   "eGFR 64 (7/25)",
   "K 4.1 (7/25)",
   "A1c 7.8% (7/25)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-07-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-07-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_85",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-12-26 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/74, pulse 75, wt 229 lb",
   "eGFR 63 (today)",
   "K 4.6 (today)",
   "UACR 870 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-12-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-12-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2023-05-16 15:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.4)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-05-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2023-05-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-16 14:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.4)"
  ],
  "context": [
   "BP 138/80, pulse 77, wt 225 lb",
   "eGFR 62 (today)",
   "K 4.6 (today)",
   "UACR 775 mg/g (today)",
   "A1c 8.4% (today)",
   "LDL 86 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-05-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2023-05-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_104",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-09-20 09:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/85, repeat 136/82, pulse 69, wt 226 lb",
   "eGFR 62 (9/17)",
   "K 4.3 (9/17)",
   "UACR 913 mg/g (9/17)",
   "A1c 7.8% (9/17)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-09-20 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2023-09-20 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_111",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-02-09 13:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/79, pulse 82, wt 225 lb",
   "eGFR 60 (2/4)",
   "K 4.3 (2/4)",
   "A1c 7.9% (2/4)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-02-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2024-02-09 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_130/0",
  "kind": "Medication event comment",
  "when": "2024-07-17 14:01",
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
   "dulaglutide: not started by 2024-07-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_129/0",
  "kind": "Problem list comment",
  "when": "2024-07-17 14:12",
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
   "onset 2024-07-17",
   "supporting result: eGFR 60 (6/13)",
   "supporting result: eGFR 58 (today)",
   "supporting result: UACR 1458 mg/g (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-07-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_117",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-17 13:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 137/85, pulse 70, wt 225 lb",
   "eGFR 58 (today)",
   "K 4.6 (today)",
   "UACR 1458 mg/g (today)",
   "A1c 8.1% (today)",
   "LDL 87 mg/dL (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-07-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_131",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-12-27 09:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/81, pulse 63, wt 222 lb",
   "eGFR 52 (today)",
   "K 4.6 (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2024-12-27 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2025-01-07 14:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "metformin: held today (vomiting, poor oral intake); review 2025-01-14"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-01-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_171",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2025-01-07 14:46",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2025-01-14"
  ],
  "context": [],
  "forbidden": [
   "dulaglutide: not started by 2025-01-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/3",
  "kind": "Medication event comment",
  "when": "2025-01-14 13:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "resume metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: eating and drinking normally"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-01-14 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_172",
  "kind": "Primary care phone visit note (reason: Phone: feeling better)",
  "when": "2025-01-14 13:26",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "context": [],
  "forbidden": [
   "dulaglutide: not started by 2025-01-14 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_137",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-05-19 09:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/81, pulse 86, wt 226 lb",
   "eGFR 49 (today)",
   "K 4.6 (today)",
   "UACR 1891 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-05-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/4",
  "kind": "Medication event comment",
  "when": "2025-09-23 10:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 44"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-09-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_144",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-09-23 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 44)"
  ],
  "context": [
   "BP 132/75, pulse 70, wt 226 lb",
   "eGFR 46 (9/18)",
   "K 4.8 (9/18)",
   "A1c 7.8% (9/18)",
   "LDL 91 mg/dL (9/18)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2025-09-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_155",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-02-02 14:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/80, pulse 70, wt 224 lb",
   "eGFR 43 (1/28)",
   "K 4.4 (1/28)",
   "A1c 7.8% (1/28)"
  ],
  "forbidden": [
   "dulaglutide: not started by 2026-02-02 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_170/0",
  "kind": "Medication event comment",
  "when": "2026-06-30 14:31",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.5"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.5)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_161",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-06-30 14:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.5)"
  ],
  "context": [
   "BP 122/79, pulse 63, wt 224 lb",
   "eGFR 39 (6/24)",
   "K 4.8 (6/24)",
   "A1c 8.5% (6/24)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
