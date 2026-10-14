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
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-12-30 08:47",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2019-12-30 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2019-12-30 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-12-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-12-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-12-30 08:47",
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
   "onset 2011-08",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2019-12-30 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2019-12-30 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-12-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-12-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-12-30 08:47",
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
   "onset 2017-06-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2019-12-30 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2019-12-30 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-12-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-12-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-12-30 08:47",
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
   "onset 2016-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2019-12-30 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2019-12-30 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-12-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-12-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
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
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-12-30 08:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/76, pulse 65, wt 178 lb",
   "eGFR 69 (today)",
   "K 4.6 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2019-12-30 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2019-12-30 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2019-12-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2019-12-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_16",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-09-28 13:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/78, pulse 65, wt 179 lb",
   "eGFR 72 (today)",
   "K 4.4 (today)",
   "A1c 8% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2020-09-28 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2020-09-28 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2020-09-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2020-09-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2021-04-26 13:11",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2021-04-26 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2021-04-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-04-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-04-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_26",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-04-26 12:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.4)"
  ],
  "context": [
   "BP 145/91, repeat 140/87, pulse 68, wt 180 lb",
   "eGFR 70 (4/21)",
   "K 5.8 (4/21), hemolyzed",
   "A1c 8.4% (4/21)",
   "K 4.5 (4/21)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2021-04-26 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2021-04-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2021-04-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2021-04-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2022-02-24 13:36",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2022-02-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2022-02-24 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-02-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-02-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-02-24 13:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/87, pulse 65, wt 182 lb",
   "eGFR 69 (today)",
   "K 4.3 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "semaglutide: not started by 2022-02-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)",
   "empagliflozin: not started by 2022-02-24 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-02-24 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-02-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_57/0",
  "kind": "Medication event comment",
  "when": "2022-09-13 08:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-09-13 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-09-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-09-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-09-13 08:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.2)"
  ],
  "context": [
   "BP 137/82, pulse 64, wt 183 lb",
   "eGFR 71 (9/8)",
   "K 4.5 (9/8)",
   "A1c 8.2% (9/8)",
   "LDL 92 mg/dL (9/8)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-09-13 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-09-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2022-09-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_58",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-05-23 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/86, pulse 62, wt 182 lb",
   "eGFR 69 (5/19)",
   "K 4.1 (5/19)",
   "A1c 7% (5/19)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-05-23 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-05-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2023-05-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_75/0",
  "kind": "Medication event comment",
  "when": "2024-02-26 15:11",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-02-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2024-02-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_65",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-02-26 14:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c above goal)"
  ],
  "context": [
   "BP 134/82, pulse 74, wt 179 lb",
   "eGFR 71 (2/21)",
   "K 4.4 (2/21)",
   "A1c 7.6% (2/21)",
   "LDL 127 mg/dL (2/21)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-02-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2024-02-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_76",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-09-18 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/70, pulse 86, wt 181 lb",
   "eGFR 69 (today)",
   "K 4.1 (today)",
   "UACR 46 mg/g (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-09-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "amlodipine: not started by 2024-09-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_151/0",
  "kind": "Allergy list comment",
  "when": "2025-04-23 10:40",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2025-04-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_75/1",
  "kind": "Medication event comment",
  "when": "2025-04-23 10:37",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2025-04-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_150",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-04-23 10:15",
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
   "BP 137/78, pulse 69, wt 183 lb"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2025-04-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_86",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-06-04 08:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/85, pulse 82, wt 181 lb",
   "eGFR 68 (today)",
   "K 4.6 (today)",
   "UACR 47 mg/g (today)",
   "A1c 8% (today)",
   "LDL 72 mg/dL (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2025-06-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_105/0",
  "kind": "Medication event comment",
  "when": "2026-02-05 13:37",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_104/0",
  "kind": "Medication event comment",
  "when": "2026-02-05 13:36",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2026-02-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_97",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-02-05 13:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)",
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/83, repeat 133/81, pulse 81, wt 182 lb",
   "eGFR 68 (today)",
   "K 4 (today)",
   "UACR 59 mg/g (today)",
   "A1c 8.3% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "nf_128 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
