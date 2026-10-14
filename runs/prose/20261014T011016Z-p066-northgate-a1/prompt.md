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

## Requests (16)

```json
[
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2019-12-03 11:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 39"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 39)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-12-03 11:22",
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
   "onset 2005",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-12-03 11:22",
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
   "onset 2014-03",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-12-03 11:22",
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
   "onset 2018-09",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-12-03 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 39)"
  ],
  "context": [
   "BP 128/71, pulse 63, wt 169 lb",
   "eGFR 38 (11/27)",
   "K 5.2 (11/27)",
   "A1c 6.6% (11/27)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_27/0",
  "kind": "Problem list comment",
  "when": "2020-10-23 12:12",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Chronic kidney disease stage 3b\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "onset 2020-10-23",
   "supporting result: eGFR 38 (11/27/19)",
   "supporting result: eGFR 38 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-10-23 11:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/85, pulse 68, wt 171 lb",
   "eGFR 38 (today)",
   "K 4.5 (today)",
   "A1c 7% (today)",
   "LDL 88 mg/dL (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2021-08-26 16:11",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-08-26 15:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/78, repeat 137/78, pulse 66, wt 172 lb",
   "eGFR 38 (8/21)",
   "K 4.4 (8/21)",
   "A1c 6.9% (8/21)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_34",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-04-20 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/87, pulse 73, wt 170 lb",
   "eGFR 38 (today)",
   "K 4.9 (today)",
   "A1c 6.9% (today)",
   "LDL 80 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-12-23 11:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/89, repeat 140/86, pulse 76, wt 172 lb",
   "eGFR 37 (today)",
   "K 4.5 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_51",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-10-17 13:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/85, pulse 78, wt 171 lb",
   "eGFR 37 (today)",
   "K 4.6 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_57",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-08-02 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/78, pulse 86, wt 171 lb",
   "eGFR 35 (7/31)",
   "K 4.7 (7/31)",
   "A1c 7.5% (7/31)",
   "LDL 101 mg/dL (7/31)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_67",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-01 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/77, pulse 64, wt 170 lb",
   "eGFR 32 (today)",
   "K 4.7 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-12-29 12:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/72, pulse 69, wt 176 lb",
   "eGFR 35 (12/27)",
   "K 4.4 (12/27)",
   "A1c 6.9% (12/27)",
   "LDL 67 mg/dL (12/27)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-08-27 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/79, pulse 71, wt 175 lb",
   "eGFR 35 (8/24)",
   "K 4.6 (8/24)",
   "UACR 302 mg/g (8/24)",
   "A1c 7.1% (8/24)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
