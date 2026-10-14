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

## Requests (13)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2021-05-24 16:22",
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
   "onset 2007",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-05-24 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2021-05-24 16:22",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "chlorthalidone: not started by 2021-05-24 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2021-05-24 15:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 149/89, repeat 147/86, pulse 88, wt 195 lb",
   "eGFR 87 (today)",
   "K 4.4 (today)",
   "UACR 205 mg/g (today)",
   "A1c 7% (today)",
   "LDL 112 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-05-24 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-12-22 14:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/79, pulse 70, wt 195 lb",
   "eGFR 86 (12/17)",
   "K 6.2 (12/17), hemolyzed",
   "UACR 153 mg/g (12/17)",
   "A1c 6.5% (12/17)",
   "K 4.2 (12/17)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-12-22 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-15 12:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/91, repeat 142/90, pulse 68, wt 196 lb",
   "eGFR 85 (9/13)",
   "K 4.3 (9/13)",
   "A1c 6.8% (9/13)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-09-15 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-05-29 14:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/78, pulse 67, wt 197 lb",
   "eGFR 85 (5/25)",
   "K 4.4 (5/25)",
   "A1c 7% (5/25)",
   "LDL 133 mg/dL (5/25)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-05-29 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_46",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-01-24 13:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "Patient ran out of lisinopril about 3 weeks ago and has not been taking it."
  ],
  "context": [
   "BP 143/83, repeat 139/80, pulse 88, wt 198 lb",
   "eGFR 87 (1/22)",
   "K 4.2 (1/22)",
   "A1c 7.1% (1/22)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-01-24 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/1",
  "kind": "Medication event comment",
  "when": "2024-12-11 14:36",
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
   "chlorthalidone: not started by 2024-12-11 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_53",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-12-11 14:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 149/96, repeat 147/94, pulse 71, wt 198 lb",
   "eGFR 86 (12/6)",
   "K 4.5 (12/6)",
   "UACR 173 mg/g (12/6)",
   "A1c 7.1% (12/6)",
   "LDL 166 mg/dL (12/6)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-12-11 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/2",
  "kind": "Medication event comment",
  "when": "2025-10-13 14:21",
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
   "chlorthalidone: not started by 2025-10-13 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-13 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 153/88, repeat 145/84, pulse 73, wt 195 lb",
   "eGFR 86 (today)",
   "K 4.5 (today)",
   "UACR 255 mg/g (today)",
   "A1c 6.9% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-10-13 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_85/0",
  "kind": "Medication event comment",
  "when": "2026-08-04 09:21",
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
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-08-04 09:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 146/94, pulse 74, wt 197 lb",
   "eGFR 81 (7/30)",
   "K 4.9 (7/30)",
   "A1c 7.2% (7/30)",
   "LDL 134 mg/dL (7/30)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
