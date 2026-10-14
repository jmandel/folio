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
  "when": "2020-02-18 08:47",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-02-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-02-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-02-18 08:47",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-02-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-02-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-02-18 08:47",
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
   "onset 2011-05",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-02-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-02-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2020-02-18 08:47",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-02-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-02-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-02-18 08:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/79, pulse 84, wt 220 lb",
   "eGFR 68 (today)",
   "K 4.5 (today)",
   "A1c 7.6% (today)",
   "LDL 99 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2020-02-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-02-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-02-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-02-18 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-06-30 09:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/80, pulse 65, wt 221 lb",
   "eGFR 66 (6/26)",
   "K 4 (6/26)",
   "A1c 7.7% (6/26)"
  ],
  "forbidden": [
   "losartan: not started by 2020-06-30 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-06-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-06-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-06-30 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-11-26 13:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/76, pulse 66, wt 218 lb",
   "eGFR 65 (today)",
   "K 4.2 (today)",
   "UACR 7 mg/g (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "losartan: not started by 2020-11-26 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2020-11-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-11-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-11-26 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-05-11 14:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/85, repeat 137/85, pulse 67, wt 219 lb",
   "eGFR 64 (today)",
   "K 4.6 (today)",
   "UACR 9 mg/g (today)",
   "A1c 7.6% (today)",
   "LDL 75 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2021-05-11 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2021-05-11 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-05-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-05-11 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2021-09-27 10:42",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "losartan: not started by 2021-09-27 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2021-09-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-09-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-09-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2021-09-27 10:41",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.1)"
  ],
  "forbidden": [
   "losartan: not started by 2021-09-27 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2021-09-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-09-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-09-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_51",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-09-27 10:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.1)",
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/83, repeat 142/82, pulse 74, wt 221 lb",
   "eGFR 64 (today)",
   "K 4.1 (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [
   "losartan: not started by 2021-09-27 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2021-09-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2021-09-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2021-09-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_57",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-03-03 10:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/79, pulse 80, wt 217 lb",
   "eGFR 65 (2/27)",
   "K 4 (2/27)",
   "A1c 7.3% (2/27)"
  ],
  "forbidden": [
   "losartan: not started by 2022-03-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-03-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-03-03 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-03-03 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-07-28 15:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/83, pulse 69, wt 223 lb",
   "eGFR 64 (today)",
   "K 4.8 (today)",
   "UACR 12 mg/g (today)",
   "A1c 6.7% (today)",
   "LDL 41 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2022-07-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-07-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-07-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-07-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_75",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-12-02 15:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/94, repeat 134/91, pulse 79, wt 220 lb",
   "eGFR 63 (11/28)",
   "K 4.6 (11/28)",
   "A1c 6.6% (11/28)"
  ],
  "forbidden": [
   "losartan: not started by 2022-12-02 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-12-02 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-12-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-12-02 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_171/0",
  "kind": "Allergy list comment",
  "when": "2022-12-22 15:05",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "lisinopril: angioedema of lips and tongue (allergy)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril allergy: angioedema of lips and tongue"
  ],
  "forbidden": [
   "losartan: not started by 2022-12-22 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-12-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-12-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-12-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_173/0",
  "kind": "Medication event comment",
  "when": "2022-12-22 15:08",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start amlodipine 5 MG Oral Tablet 5 mg QD; reason: replacing lisinopril (angioedema)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "amlodipine: started 5 mg daily today (replacing lisinopril (angioedema))"
  ],
  "forbidden": [
   "losartan: not started by 2022-12-22 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-12-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "finerenone: not started by 2022-12-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2022-12-22 15:07",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 40 MG Oral Tablet 40 mg QD; reason: angioedema"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (angioedema)"
  ],
  "forbidden": [
   "losartan: not started by 2022-12-22 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-12-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-12-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2022-12-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_172",
  "kind": "Primary care office visit note (reason: ED follow-up: angioedema)",
  "when": "2022-12-22 14:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril allergy: angioedema of lips and tongue",
   "lisinopril: stopped today (angioedema)",
   "amlodipine: started 5 mg daily today (replacing lisinopril (angioedema))"
  ],
  "context": [
   "Angioedema"
  ],
  "forbidden": [
   "losartan: not started by 2022-12-22 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2022-12-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "finerenone: not started by 2022-12-22 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_88/0",
  "kind": "Medication event comment",
  "when": "2023-04-26 14:36",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start losartan potassium 50 MG Oral Tablet 50 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: started 50 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-04-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "finerenone: not started by 2023-04-26 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_82",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-04-26 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: started 50 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 156/93, pulse 77, wt 220 lb",
   "eGFR 63 (today)",
   "K 4 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-04-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "finerenone: not started by 2023-04-26 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_88/1",
  "kind": "Medication event comment",
  "when": "2023-09-26 11:51",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2023-09-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "finerenone: not started by 2023-09-26 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_89",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-09-26 11:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/83, repeat 137/83, pulse 64, wt 219 lb",
   "eGFR 62 (9/21)",
   "K 4.4 (9/21)",
   "A1c 7% (9/21)",
   "LDL 73 mg/dL (9/21)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "finerenone: not started by 2023-09-26 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_111/0",
  "kind": "Medication event comment",
  "when": "2024-01-24 15:01",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "finerenone: not started by 2024-01-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_102",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-01-24 14:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/86, repeat 141/84, pulse 85, wt 220 lb",
   "eGFR 62 (today)",
   "K 4.9 (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2024-01-24 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_112",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-05-27 14:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/79, pulse 78, wt 221 lb",
   "eGFR 61 (today)",
   "K 4.5 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2024-05-27 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_119",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-29 11:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/85, pulse 76, wt 222 lb",
   "eGFR 57 (10/23)",
   "K 4.7 (10/23)",
   "A1c 7.5% (10/23)",
   "LDL 95 mg/dL (10/23)"
  ],
  "forbidden": [
   "finerenone: not started by 2024-10-29 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_139/0",
  "kind": "Problem list comment",
  "when": "2025-03-15 16:25",
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
   "onset 2025-03-15",
   "supporting result: eGFR 57 (10/23/24)",
   "supporting result: eGFR 53 (today)",
   "supporting result: UACR 12 mg/g (7/28/22)"
  ],
  "forbidden": [
   "finerenone: not started by 2025-03-15 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_132",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-03-19 12:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/75, pulse 78, wt 221 lb",
   "eGFR 53 (3/15)",
   "K 4.4 (3/15)",
   "A1c 7.5% (3/15)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "finerenone: not started by 2025-03-19 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_140",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-08-12 08:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/82, pulse 64, wt 221 lb",
   "eGFR 50 (8/6)",
   "K 4.4 (8/6)",
   "UACR 26 mg/g (8/6)",
   "A1c 7.1% (8/6)"
  ],
  "forbidden": [
   "finerenone: not started by 2025-08-12 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_148",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-01-29 09:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/83, pulse 82, wt 221 lb",
   "eGFR 47 (1/25)",
   "K 4.5 (1/25)",
   "A1c 7.2% (1/25)",
   "LDL 106 mg/dL (1/25)"
  ],
  "forbidden": [
   "finerenone: not started by 2026-01-29 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2026-07-20 08:31",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 43"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "forbidden": [
   "finerenone: not started by 2026-07-20 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_174/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2026-07-20 08:55",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 43, UACR 33 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "finerenone: not started by 2026-07-20 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_159",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-07-20 08:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 43)"
  ],
  "context": [
   "BP 133/81, pulse 85, wt 222 lb",
   "eGFR 43 (today)",
   "K 4.3 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2026-07-20 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_182",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2026-10-07 10:54",
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
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
