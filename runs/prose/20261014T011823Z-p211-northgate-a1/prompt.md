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

## Requests (12)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-10-05 16:17",
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
   "onset 2006-10",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-10-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-10-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-10-05 16:17",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-10-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-10-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_5",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-10-05 15:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 147/85, repeat 145/83, pulse 71, wt 175 lb",
   "eGFR 93 (9/30)",
   "K 4.9 (9/30)",
   "LDL 67 mg/dL (9/30)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-10-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-10-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_21/0",
  "kind": "Medication event comment",
  "when": "2021-07-16 10:36",
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
   "amlodipine: not started by 2021-07-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_14",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-07-16 10:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/86, repeat 135/82, pulse 77, wt 174 lb",
   "eGFR 94 (7/10)",
   "K 4.4 (7/10)"
  ],
  "forbidden": [
   "amlodipine: not started by 2021-07-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_32/0",
  "kind": "Medication event comment",
  "when": "2022-05-04 09:21",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2022-05-04 09:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/82, pulse 63, wt 173 lb",
   "eGFR 95 (today)",
   "K 4.9 (today)",
   "LDL 83 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2022-12-23 10:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/86, pulse 82, wt 174 lb",
   "eGFR 92 (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_39",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-11-01 14:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/77, pulse 64, wt 172 lb",
   "eGFR 94 (10/30)",
   "K 4.6 (10/30)",
   "LDL 90 mg/dL (10/30)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_48",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-07-18 09:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/83, pulse 72, wt 173 lb",
   "eGFR 94 (today)",
   "K 4.1 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-05-14 15:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/86, pulse 80, wt 176 lb",
   "eGFR 89 (today)",
   "K 4.4 (today)",
   "LDL 93 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_65",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2026-04-06 12:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/76, pulse 70, wt 178 lb",
   "eGFR 89 (4/4)",
   "K 4.5 (4/4)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
