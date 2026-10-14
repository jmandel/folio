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

## Requests (10)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2024-08-07 10:52",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-08-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "metoprolol succinate: not started by 2024-08-07 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2024-08-07 10:52",
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
   "onset 2022-10",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-08-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "metoprolol succinate: not started by 2024-08-07 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2024-08-07 10:52",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-08-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "metoprolol succinate: not started by 2024-08-07 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2024-08-07 10:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/83, repeat 137/83, pulse 81, wt 155 lb",
   "eGFR 78 (8/5)",
   "K 4.5 (8/5)",
   "LDL 42 mg/dL (8/5)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-08-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "metoprolol succinate: not started by 2024-08-07 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2025-04-28 11:31",
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
   "chlorthalidone: not started by 2025-04-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "metoprolol succinate: not started by 2025-04-28 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_15",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-04-28 11:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 152/93, repeat 149/90, pulse 82, wt 151 lb",
   "eGFR 79 (4/24)",
   "K 4.4 (4/24)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-04-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "metoprolol succinate: not started by 2025-04-28 (pattern /\\b(metoprolol|Toprol XL)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_83",
  "kind": "Chart correction comment",
  "when": "2025-05-09 08:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The metoprolol succinate 50 mg start entered 2025-05-08 was entry error"
  ],
  "context": [
   "metoprolol succinate: entered in error today (entry error)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-05-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_81",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-05-26 15:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: resumed today (creatinine back to baseline)"
  ],
  "context": [
   "Acute kidney injury",
   "BP 157/78, pulse 85, wt 151 lb"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-05-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_33/0",
  "kind": "Medication event comment",
  "when": "2026-02-03 15:51",
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
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-02-03 15:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/84, repeat 142/81, pulse 88, wt 154 lb",
   "eGFR 77 (1/31)",
   "K 4 (1/31)",
   "LDL 94 mg/dL (1/31)"
  ],
  "forbidden": [
   "nf_51 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
