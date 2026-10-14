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

## Requests (37)

```json
[
 {
  "key": "B/med/m_19/0",
  "kind": "Medication event comment",
  "when": "2019-01-28 13:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "losartan: not started by 2019-01-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-01-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-01-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-01-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-01-28 13:47",
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
   "onset 2005-08",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-01-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-01-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-01-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-01-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-01-28 13:47",
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
   "onset 2008-03-03",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-01-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-01-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-01-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-01-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-01-28 13:47",
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
   "onset 2011-10",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-01-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-01-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-01-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-01-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-01-28 13:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.6)"
  ],
  "context": [
   "BP 133/85, pulse 66, wt 148 lb",
   "eGFR 93 (1/25)",
   "K 4.4 (1/25)",
   "A1c 8.6% (1/25)",
   "LDL 99 mg/dL (1/25)"
  ],
  "forbidden": [
   "losartan: not started by 2019-01-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-01-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-01-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-01-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-06-25 11:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/84, pulse 77, wt 150 lb",
   "eGFR 92 (6/21)",
   "K 4.6 (6/21)",
   "UACR 62 mg/g (6/21)",
   "A1c 7.7% (6/21)"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-25 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-06-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-06-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-06-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_34/0",
  "kind": "Allergy list comment",
  "when": "2019-10-25 11:53",
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
   "insulin glargine: not started by 2019-10-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-10-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2019-10-25 11:51",
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
   "losartan: not started by 2019-10-25 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "insulin glargine: not started by 2019-10-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-10-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_33/0",
  "kind": "Medication event comment",
  "when": "2019-10-25 11:52",
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
   "insulin glargine: not started by 2019-10-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-10-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2019-10-25 11:30",
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
   "BP 137/83, pulse 73, wt 150 lb",
   "eGFR 92 (10/22)",
   "K 4.5 (10/22)",
   "A1c 7.4% (10/22)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2019-10-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2019-10-25 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2019-10-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_36",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-04-09 12:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/85, repeat 138/82, pulse 87, wt 151 lb",
   "eGFR 90 (today)",
   "K 4.3 (today)",
   "UACR 57 mg/g (today)",
   "A1c 7.6% (today)",
   "LDL 104 mg/dL (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-04-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2020-04-09 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2020-04-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_33/1",
  "kind": "Medication event comment",
  "when": "2020-08-31 10:31",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "insulin glargine: not started by 2020-08-31 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2020-08-31 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2020-08-31 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_48",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-08-31 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 144/82, pulse 69, wt 149 lb",
   "eGFR 92 (today)",
   "K 4.2 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2020-08-31 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2020-08-31 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2020-08-31 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-01-12 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/84, pulse 70, wt 150 lb",
   "eGFR 92 (today)",
   "K 4.1 (today)",
   "UACR 59 mg/g (today)",
   "A1c 7.8% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2021-01-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2021-01-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2021-01-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/0",
  "kind": "Medication event comment",
  "when": "2021-06-23 10:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "empagliflozin: not started by 2021-06-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2021-06-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-06-23 09:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "context": [
   "BP 140/90, repeat 137/88, pulse 85, wt 152 lb",
   "eGFR 93 (6/18)",
   "K 4.4 (6/18)",
   "A1c 8.3% (6/18)",
   "LDL 112 mg/dL (6/18)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-06-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2021-06-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-11-01 13:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/82, pulse 87, wt 149 lb",
   "eGFR 88 (10/26)",
   "K 4 (10/26)",
   "UACR 80 mg/g (10/26)",
   "A1c 7.6% (10/26)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-11-01 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2021-11-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/1",
  "kind": "Medication event comment",
  "when": "2022-03-23 11:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-03-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_80",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-03-23 10:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 148/95, repeat 143/93, pulse 68, wt 147 lb",
   "eGFR 89 (today)",
   "K 4.4 (today)",
   "UACR 62 mg/g (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-03-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-03-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_100/0",
  "kind": "Medication event comment",
  "when": "2022-09-13 14:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2022-09-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_90",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-13 13:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "context": [
   "BP 133/76, pulse 79, wt 151 lb",
   "eGFR 89 (today)",
   "K 4.2 (today)",
   "A1c 7.1% (today)",
   "LDL 112 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-09-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_101",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-01-30 15:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/81, pulse 79, wt 150 lb",
   "eGFR 91 (today)",
   "K 3.9 (today)",
   "UACR 60 mg/g (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-01-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_108",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-07-03 15:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/82, pulse 85, wt 151 lb",
   "eGFR 90 (6/28)",
   "K 5.1 (6/28)",
   "A1c 7.5% (6/28)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-07-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_239/0",
  "kind": "Allergy list comment",
  "when": "2023-09-25 13:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2023-09-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_100/1",
  "kind": "Medication event comment",
  "when": "2023-09-25 13:37",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2023-09-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_238",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2023-09-25 13:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "BP 135/78, pulse 85, wt 149 lb"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_114",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-29 09:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/83, repeat 136/83, pulse 82, wt 149 lb",
   "eGFR 89 (today)",
   "K 4.4 (today)",
   "A1c 7.8% (today)",
   "LDL 83 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-11-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_131/0",
  "kind": "Medication event comment",
  "when": "2024-05-14 16:02",
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
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/2",
  "kind": "Medication event comment",
  "when": "2024-05-14 16:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 18 units QHS; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 18 units at bedtime today (A1c 8.3)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-05-14 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_124",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-05-14 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 18 units at bedtime today (A1c 8.3)",
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/78, pulse 76, wt 152 lb",
   "eGFR 89 (5/11)",
   "K 4.7 (5/11)",
   "UACR 53 mg/g (5/11)",
   "A1c 8.3% (5/11)"
  ],
  "forbidden": [
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_132",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-09-12 10:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/78, pulse 73, wt 151 lb",
   "eGFR 89 (today)",
   "K 4.9 (today)",
   "UACR 75 mg/g (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_139",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-18 08:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/76, pulse 88, wt 147 lb",
   "eGFR 90 (today)",
   "K 4.2 (today)",
   "UACR 73 mg/g (today)",
   "A1c 7.8% (today)",
   "LDL 110 mg/dL (today)"
  ],
  "forbidden": [
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_72/3",
  "kind": "Medication event comment",
  "when": "2025-06-30 16:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 22 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 22 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_151",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-06-30 15:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: dose changed to 22 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 127/85, pulse 75, wt 148 lb",
   "eGFR 87 (today)",
   "K 4.3 (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_157",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-11-10 14:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/87, pulse 66, wt 150 lb",
   "eGFR 89 (today)",
   "K 4.5 (today)",
   "A1c 6.9% (today)"
  ],
  "forbidden": [
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_164",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-04-02 09:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/70, pulse 88, wt 149 lb",
   "eGFR 91 (today)",
   "K 4.6 (today)",
   "UACR 60 mg/g (today)",
   "A1c 6.8% (today)",
   "LDL 104 mg/dL (today)"
  ],
  "forbidden": [
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_175",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-08-13 09:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/83, repeat 135/79, pulse 72, wt 148 lb",
   "eGFR 88 (today)",
   "K 4.4 (today)",
   "UACR 58 mg/g (today)",
   "A1c 6.9% (today)"
  ],
  "forbidden": [
   "nf_207 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
