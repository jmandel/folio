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
  "when": "2022-11-08 11:02",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2022-11-08 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-11-08 11:02",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2022-11-08 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-11-08 11:02",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-11-08 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-11-08 10:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 154/98, repeat 151/95, pulse 74, wt 233 lb",
   "eGFR 97 (11/5)",
   "K 4.5 (11/5)",
   "LDL 94 mg/dL (11/5)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-11-08 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_15",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-06-30 12:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/87, pulse 86, wt 233 lb",
   "eGFR 94 (6/24)",
   "K 4.5 (6/24)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-06-30 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_22",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2024-02-02 13:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 152/92, repeat 144/88, pulse 85, wt 233 lb",
   "eGFR 96 (today)",
   "K 4.5 (today)",
   "LDL 123 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-02-02 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2024-10-02 15:36",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2024-10-02 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_33",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-10-02 15:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/92, repeat 144/90, pulse 84, wt 237 lb",
   "eGFR 93 (today)",
   "K 4 (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-10-02 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2025-06-02 09:36",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2025-06-02 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_38",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-06-02 09:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/87, pulse 73, wt 233 lb",
   "eGFR 94 (5/28)",
   "K 4 (5/28)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-06-02 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_53/0",
  "kind": "Medication event comment",
  "when": "2026-04-03 13:31",
  "author": "Moira Brennan, DO (Primary care physician)",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_43",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-04-03 13:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 140/78, pulse 68, wt 235 lb",
   "eGFR 98 (3/29)",
   "K 4.4 (3/29)",
   "LDL 98 mg/dL (3/29)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
