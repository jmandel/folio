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

## Requests (21)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-02-12 09:02",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2019-02-12 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2019-02-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-02-12 09:02",
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
   "onset 2007",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2019-02-12 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2019-02-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-02-12 09:02",
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
   "chlorthalidone: not started by 2019-02-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2019-02-12 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2019-02-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-02-12 09:02",
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
   "onset 2016-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2019-02-12 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2019-02-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2019-02-12 09:02",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2013-03",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2019-02-12 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2019-02-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-02-12 08:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/85, pulse 86, wt 235 lb",
   "eGFR 76 (today)",
   "K 4.4 (today)",
   "UACR 230 mg/g (today)",
   "A1c 6.4% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-02-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2019-02-12 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2019-02-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2019-09-25 11:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change lisinopril 20 MG Oral Tablet 20 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2019-09-25 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2019-09-25 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-09-25 11:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/91, pulse 73, wt 231 lb",
   "eGFR 72 (9/23)",
   "K 4.4 (9/23)",
   "UACR 225 mg/g (9/23)",
   "A1c 6.5% (9/23)",
   "LDL 92 mg/dL (9/23)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2019-09-25 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2019-09-25 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2020-04-23 14:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "chlorthalidone: not started by 2020-04-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2020-04-23 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2020-04-23 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-04-23 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/76, repeat 136/72, pulse 67, wt 230 lb",
   "eGFR 73 (today)",
   "K 4.5 (today)",
   "UACR 298 mg/g (today)",
   "A1c 6.4% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "furosemide: not started by 2020-04-23 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2020-04-23 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_50/0",
  "kind": "Medication event comment",
  "when": "2020-12-28 14:41",
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
   "furosemide: not started by 2020-12-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2020-12-28 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_39",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-12-28 14:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 151/93, repeat 149/89, pulse 73, wt 233 lb",
   "eGFR 69 (today)",
   "K 4.3 (today)",
   "A1c 6.8% (today)",
   "LDL 78 mg/dL (today)"
  ],
  "forbidden": [
   "furosemide: not started by 2020-12-28 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2020-12-28 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_51",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-10-12 15:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/82, pulse 64, wt 230 lb",
   "eGFR 66 (today)",
   "K 4.1 (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [
   "furosemide: not started by 2021-10-12 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2021-10-12 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_57",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-05-26 08:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/78, pulse 66, wt 231 lb",
   "eGFR 67 (today)",
   "K 4.2 (today)",
   "A1c 7.1% (today)",
   "LDL 121 mg/dL (today)"
  ],
  "forbidden": [
   "furosemide: not started by 2022-05-26 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2022-05-26 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_70",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-13 08:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/77, pulse 86, wt 231 lb",
   "eGFR 66 (today)",
   "K 4.3 (today)",
   "UACR 290 mg/g (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "furosemide: not started by 2023-04-13 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: not started by 2023-04-13 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_80",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-01-18 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/80, pulse 75, wt 230 lb",
   "eGFR 61 (1/14)",
   "K 4.5 (1/14)",
   "UACR 383 mg/g (1/14)",
   "A1c 6.8% (1/14)",
   "LDL 62 mg/dL (1/14)"
  ],
  "forbidden": [
   "furosemide: not started by 2024-01-18 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_91",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-11-12 11:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/88, pulse 69, wt 230 lb",
   "eGFR 59 (today)",
   "K 4.5 (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "furosemide: not started by 2024-11-12 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_114/0",
  "kind": "Problem list comment",
  "when": "2025-08-02 16:25",
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
   "onset 2025-08-02",
   "supporting result: eGFR 59 (11/12/24)",
   "supporting result: eGFR 59 (today)",
   "supporting result: UACR 381 mg/g (today)"
  ],
  "forbidden": [
   "furosemide: not started by 2025-08-02 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_100",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-08-04 09:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/83, pulse 64, wt 228 lb",
   "eGFR 59 (8/2)",
   "K 4.4 (8/2)",
   "UACR 381 mg/g (8/2)",
   "A1c 7.3% (8/2)",
   "LDL 45 mg/dL (8/2)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "furosemide: not started by 2025-08-04 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_115",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-06-30 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/75, pulse 86, wt 229 lb",
   "eGFR 57 (today)",
   "K 4.2 (today)",
   "UACR 376 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 132 mg/dL (today)"
  ],
  "forbidden": [
   "furosemide: not started by 2026-06-30 (pattern /\\b(furosemide|Lasix)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_129",
  "kind": "Chart correction comment",
  "when": "2026-07-21 08:26",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The furosemide 40 mg start entered 2026-07-20 was wrong patient"
  ],
  "context": [
   "furosemide: entered in error today (wrong patient)"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
