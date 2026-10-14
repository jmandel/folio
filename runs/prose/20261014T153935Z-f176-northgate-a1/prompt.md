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

## Requests (34)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-04-24 10:42",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "losartan: not started by 2020-04-24 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-04-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-04-24 10:42",
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
   "onset 2019-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-04-24 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-04-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-04-24 10:42",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2015-06-17",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-04-24 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-04-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-04-24 10:42",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-04-24 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-04-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_11",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-04-24 10:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 110/66, pulse 70, wt 173 lb",
   "eGFR 67 (today)",
   "K 4.7 (today)",
   "UACR 187 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "losartan: not started by 2020-04-24 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-04-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-04-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2020-08-27 09:11",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.2)"
  ],
  "forbidden": [
   "losartan: not started by 2020-08-27 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-08-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-08-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-08-27 08:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink."
   }
  ],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.2)"
  ],
  "context": [
   "BP 117/73, pulse 66, wt 173 lb",
   "eGFR 67 (8/21)",
   "K 4.8 (8/21)",
   "A1c 8.2% (8/21)",
   "LDL 118 mg/dL (8/21)"
  ],
  "forbidden": [
   "losartan: not started by 2020-08-27 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-08-27 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-08-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_36/0",
  "kind": "Allergy list comment",
  "when": "2020-12-25 08:43",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "semaglutide: not started by 2020-12-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-12-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2020-12-25 08:41",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "losartan: not started by 2020-12-25 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "semaglutide: not started by 2020-12-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-12-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_35/0",
  "kind": "Medication event comment",
  "when": "2020-12-25 08:42",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "semaglutide: not started by 2020-12-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-12-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-12-25 08:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 113/59, pulse 72, wt 173 lb",
   "eGFR 66 (12/21)",
   "K 4.4 (12/21)",
   "A1c 7.1% (12/21)"
  ],
  "forbidden": [
   "semaglutide: not started by 2020-12-25 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2020-12-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-04-26 08:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/68, pulse 73, wt 172 lb",
   "eGFR 65 (4/23)",
   "K 5 (4/23)",
   "A1c 7.4% (4/23)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-04-26 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2021-04-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_44",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-10-15 14:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 115/67, pulse 74, wt 170 lb",
   "eGFR 66 (10/13)",
   "K 4.3 (10/13)",
   "UACR 256 mg/g (10/13)",
   "A1c 7.3% (10/13)",
   "LDL 132 mg/dL (10/13)"
  ],
  "forbidden": [
   "semaglutide: not started by 2021-10-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2021-10-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_206/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2022-02-28 13:55",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 62, UACR 317 mg/g: CKD evaluation and management"
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
   "semaglutide: not started by 2022-02-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2022-02-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-02-28 13:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 111/70, pulse 87, wt 173 lb",
   "eGFR 63 (2/25)",
   "K 4.6 (2/25)",
   "A1c 7.8% (2/25)"
  ],
  "forbidden": [
   "semaglutide: not started by 2022-02-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "insulin glargine: not started by 2022-02-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_71/0",
  "kind": "Medication event comment",
  "when": "2022-08-08 11:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.4)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-08-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-08-08 10:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.4)"
  ],
  "context": [
   "BP 121/68, pulse 64, wt 172 lb",
   "eGFR 62 (8/6)",
   "K 4.4 (8/6)",
   "UACR 366 mg/g (8/6)",
   "A1c 8.4% (8/6)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-08-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-02-01 12:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/74, pulse 79, wt 171 lb",
   "eGFR 60 (today)",
   "K 4.7 (today)",
   "UACR 554 mg/g (today)",
   "A1c 7.8% (today)",
   "LDL 112 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-02-01 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_86",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-06-28 14:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 114/73, pulse 68, wt 172 lb",
   "eGFR 60 (6/22)",
   "K 4.8 (6/22)",
   "A1c 7.9% (6/22)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-06-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-11-15 13:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 111/68, pulse 86, wt 173 lb",
   "eGFR 58 (11/11)",
   "K 4.6 (11/11)",
   "A1c 7.7% (11/11)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-11-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_113/0",
  "kind": "Medication event comment",
  "when": "2024-03-18 09:01",
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
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_112/0",
  "kind": "Problem list comment",
  "when": "2024-03-18 09:12",
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
   "onset 2024-03-18",
   "supporting result: eGFR 59 (1/3)",
   "supporting result: eGFR 57 (today)",
   "supporting result: UACR 688 mg/g (1/3)"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-03-18 08:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 114/63, pulse 81, wt 170 lb",
   "eGFR 57 (today)",
   "K 5.3 (today)",
   "A1c 8.2% (today)",
   "LDL 137 mg/dL (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_9/1",
  "kind": "Medication event comment",
  "when": "2024-08-19 14:38",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold spironolactone 25 MG Oral Tablet 25 mg QD; reason: K 6 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "spironolactone: held today (K 6 confirmed on repeat); review 2024-09-02"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_114",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-08-19 14:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/80, pulse 66, wt 172 lb",
   "eGFR 54 (today)",
   "K 4.5 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_205",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2024-08-19 14:32",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "spironolactone: held today (K 6 confirmed on repeat); review 2024-09-02"
  ],
  "context": [
   "K 6 (today)",
   "K 5.8 (today)"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_120",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-14 14:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/80, pulse 72, wt 174 lb",
   "eGFR 52 (today)",
   "K 4.4 (today)",
   "UACR 518 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_127",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-07-07 11:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/76, pulse 68, wt 168 lb",
   "eGFR 47 (7/1)",
   "K 4.8 (7/1)",
   "A1c 7.7% (7/1)"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_198",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-07-14 09:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "furosemide: resumed today (creatinine back to baseline)",
   "losartan: resumed today (creatinine back to baseline)"
  ],
  "context": [
   "Acute kidney injury",
   "BP 139/78, pulse 74, wt 173 lb"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_113/1",
  "kind": "Medication event comment",
  "when": "2025-11-26 13:07",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.5"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.5)"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2025-11-26 13:06",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 42"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_133",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-11-26 12:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 42)",
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.5)"
  ],
  "context": [
   "BP 113/74, pulse 79, wt 171 lb",
   "eGFR 44 (11/20)",
   "K 4.7 (11/20)",
   "A1c 8.5% (11/20)"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_112/1",
  "kind": "Problem list comment",
  "when": "2026-04-06 09:33",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "update problem \"Chronic kidney disease stage 3b\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "onset 2024-03-18",
   "supporting result: eGFR 42 (12/25/25)",
   "supporting result: eGFR 41 (today)",
   "supporting result: UACR 591 mg/g (12/25/25)"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_140",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-04-06 09:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 119/65, pulse 78, wt 168 lb",
   "eGFR 41 (today)",
   "K 5 (today)",
   "A1c 7.8% (today)",
   "LDL 132 mg/dL (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "nf_168 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
