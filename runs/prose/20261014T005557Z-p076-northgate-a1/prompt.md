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

## Requests (17)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2021-12-09 08:47",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2021-12-09 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2021-12-09 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2021-12-09 08:47",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2021-12-09 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2021-12-09 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2021-12-09 08:47",
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
   "onset 2008",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2021-12-09 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2021-12-09 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2021-12-09 08:47",
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
   "onset 2020",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2021-12-09 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2021-12-09 (pattern /\\b(losartan|Cozaar)\\b/i)"
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
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2021-12-09 08:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/93, pulse 79, wt 187 lb",
   "eGFR 83 (today)",
   "K 4.1 (today)",
   "UACR 8 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2021-12-09 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2021-12-09 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_15",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-09-12 09:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/82, pulse 66, wt 187 lb",
   "eGFR 81 (9/10)",
   "K 4.8 (9/10)",
   "UACR 8 mg/g (9/10)",
   "A1c 7.6% (9/10)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2022-09-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2022-09-12 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_26",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-15 13:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/84, repeat 133/81, pulse 68, wt 189 lb",
   "eGFR 81 (today)",
   "K 4.7 (today)",
   "UACR 7 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2023-05-15 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2023-05-15 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_42/0",
  "kind": "Allergy list comment",
  "when": "2024-02-13 09:45",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2024-02-13 09:42",
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
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2024-02-13 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2024-02-13 09:43",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2024-02-13 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_41/0",
  "kind": "Medication event comment",
  "when": "2024-02-13 09:44",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2024-02-13 09:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "empagliflozin: not started by 2024-02-13 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "losartan: not started by 2024-02-13 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_34",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-02-13 09:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink."
   }
  ],
  "mustInclude": [
   "metformin: dose changed to 1000 mg twice daily today (A1c 8.1)",
   "empagliflozin: started 10 mg daily today (A1c above goal)",
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 137/86, pulse 85, wt 186 lb",
   "eGFR 83 (2/8)",
   "K 4.5 (2/8)",
   "A1c 8.1% (2/8)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-11-13 09:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "Patient ran out of losartan about 3 weeks ago and has not been taking it."
  ],
  "context": [
   "BP 148/89, repeat 146/89, pulse 78, wt 186 lb",
   "eGFR 81 (11/9)",
   "K 4.8 (11/9)",
   "UACR 9 mg/g (11/9)",
   "A1c 7.1% (11/9)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_41/1",
  "kind": "Medication event comment",
  "when": "2025-07-09 08:31",
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
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_53",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-07-09 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 150/91, pulse 64, wt 184 lb",
   "eGFR 79 (today)",
   "K 4.3 (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_59",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-04-14 10:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/70, pulse 81, wt 188 lb",
   "eGFR 81 (today)",
   "K 4.5 (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
