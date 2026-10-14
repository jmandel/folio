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

## Requests (23)

```json
[
 {
  "key": "B/problem/c_hld/0",
  "kind": "Problem list comment",
  "when": "2019-03-18 09:02",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2019-03-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-03-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-03-18 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2019-03-18 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_t2dm/0",
  "kind": "Problem list comment",
  "when": "2019-03-18 09:02",
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
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2019-03-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-03-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-03-18 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2019-03-18 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2019_03_18",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-03-18 08:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Essential hypertension",
   "Type 2 diabetes mellitus",
   "Hyperlipidemia",
   "metformin 1000 mg twice daily",
   "lisinopril 20 mg daily",
   "atorvastatin 40 mg at bedtime",
   "BP 146/90, pulse 80, wt 191 lb"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2019-03-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-03-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-03-18 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2019-03-18 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_sertraline/0",
  "kind": "Medication event comment",
  "when": "2019-09-16 10:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start sertraline 100 MG Oral Tablet 100 mg QD; reason: depression"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "sertraline: started 100 mg daily today (depression)"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "losartan: not started by 2019-09-16 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-09-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2019-09-16 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-09-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-09-16 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2019-09-16 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": [
   {
    "words": "/\\b(sertraline|Zoloft)\\b/i",
    "onlyInsideSpans": [
     "med_1"
    ]
   }
  ]
 },
 {
  "key": "B/problem/c_mdd/0",
  "kind": "Problem list comment",
  "when": "2019-09-16 10:12",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Major depressive disorder, recurrent, mild\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Major depressive disorder, recurrent, mild",
   "onset 2019"
  ],
  "forbidden": [
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-09-16 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-09-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2019-09-16 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-09-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-09-16 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2019-09-16 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": [
   {
    "words": "/depress|\\bMDD\\b|F33/i",
    "onlyInsideSpans": [
     "prob_1"
    ]
   }
  ]
 },
 {
  "key": "B/visit/e_ng_2019_09_16",
  "kind": "Primary care office visit note (reason: Low mood)",
  "when": "2019-09-16 09:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [
   {
    "id": "dx_1",
    "about": "Major depressive disorder, recurrent, mild (restricted behavioral-health entry: keep every mention of it, and of its medication, inside this one span)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "sertraline: started 100 mg daily today (depression) (mention only inside the dx_1 span)",
   "BP 138/86, pulse 76, wt 189 lb"
  ],
  "forbidden": [
   "losartan: not started by 2019-09-16 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-09-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2019-09-16 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-09-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-09-16 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2019-09-16 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": [
   {
    "words": "/depress|\\bMDD\\b|F33/i",
    "onlyInsideSpans": [
     "dx_1"
    ]
   },
   {
    "words": "/\\b(sertraline|Zoloft)\\b/i",
    "onlyInsideSpans": [
     "dx_1"
    ]
   }
  ]
 },
 {
  "key": "B/visit/e_ng_2021_01_18",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-01-18 09:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "A1c 7.4% (1/14)",
   "Cr 0.98 (1/14)",
   "BP 140/88, pulse 78, wt 188 lb",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2021-01-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2021-01-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2021-01-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-01-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-01-18 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2021-01-18 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_lisinopril/1",
  "kind": "Medication event comment",
  "when": "2021-06-03 10:32",
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
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2021-06-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2021-06-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2021-06-03 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-06-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-06-03 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2021-06-03 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_losartan/0",
  "kind": "Medication event comment",
  "when": "2021-06-03 10:33",
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
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-06-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2021-06-03 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-06-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-06-03 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2021-06-03 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2021_06_03",
  "kind": "Primary care office visit note (reason: Cough)",
  "when": "2021-06-03 10:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough",
   "The lisinopril reaction was cough only: no lip, tongue or throat swelling."
  ],
  "context": [
   "BP 136/84, pulse 74, wt 188 lb"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-06-03 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2021-06-03 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-06-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-06-03 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2021-06-03 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2021_09_27",
  "kind": "Primary care office visit note (reason: Lab follow-up)",
  "when": "2021-09-27 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Cr 1.12 (9/20)",
   "eGFR 58 (9/20)",
   "BP 138/86, pulse 76, wt 189 lb"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2021-09-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "empagliflozin: not started by 2021-09-27 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-09-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-09-27 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2021-09-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_chlorthalidone/0",
  "kind": "Medication event comment",
  "when": "2022-05-16 10:05",
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
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-05-16 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-05-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-05-16 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2022-05-16 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2022_05_16",
  "kind": "Primary care office visit note (reason: BP check)",
  "when": "2022-05-16 09:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 152/94, repeat 148/92, pulse 82, wt 190 lb",
   "Essential hypertension"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-05-16 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-05-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-05-16 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2022-05-16 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_empagliflozin/0",
  "kind": "Medication event comment",
  "when": "2023-03-06 10:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2023-03-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-03-06 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2023-03-06 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2023_03_06",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-03-06 09:35",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "eGFR 49 (today)",
   "A1c 7.9% (today)",
   "BP 134/82, pulse 76, wt 190 lb"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2023-03-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-03-06 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2023-03-06 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2023_09_11",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-09-11 09:55",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/80, pulse 74, wt 186 lb",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2023-09-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-09-11 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2023-09-11 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2024_04_15",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-04-15 08:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/80, pulse 76, wt 187 lb",
   "Type 2 diabetes mellitus",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-04-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-04-15 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2024-04-15 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2025_02_17",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-17 09:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/82, pulse 78, wt 188 lb",
   "Type 2 diabetes mellitus"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "finerenone: not started by 2025-02-17 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_glargine/0",
  "kind": "Medication event comment",
  "when": "2025-08-18 09:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.6"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine 10 units at bedtime"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "finerenone: not started by 2025-08-18 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_losartan/1",
  "kind": "Medication event comment",
  "when": "2025-08-18 09:48",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change losartan potassium 100 MG Oral Tablet 100 mg QD; reason: BP above goal with albuminuria"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: dose changed to 100 mg daily today (BP above goal with albuminuria)"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "finerenone: not started by 2025-08-18 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2025_08_18",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-08-18 09:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine 10 units at bedtime",
   "losartan: dose changed to 100 mg daily today (BP above goal with albuminuria)"
  ],
  "context": [
   "A1c 8.6% (today)",
   "BP 146/88, repeat 142/86, pulse 76, wt 191 lb"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "finerenone: not started by 2025-08-18 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/hero/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2026-05-04 10:52",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR decline, albuminuria, prior SGLT2i euDKA - re-challenge?"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "eGFR 41 (2/9)",
   "UACR 320 mg/g (2/9)",
   "eGFR 54 (2/7/22)",
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "empagliflozin 10 mg daily, stopped (euglycemic DKA)",
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis",
   "losartan 100 mg daily"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "finerenone: not started by 2026-05-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_ng_2026_05_04",
  "kind": "Primary care office visit note (reason: Kidney function, referral)",
  "when": "2026-05-04 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "eGFR 41 (2/9)",
   "UACR 320 mg/g (2/9)",
   "Chronic kidney disease stage 3a",
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "empagliflozin 10 mg daily, stopped (euglycemic DKA)",
   "BP 138/84, pulse 74, wt 189 lb"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "finerenone: not started by 2026-05-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_precipitant is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
