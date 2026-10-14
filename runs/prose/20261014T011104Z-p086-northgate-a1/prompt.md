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

## Requests (15)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-05-14 12:17",
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
   "onset 2008",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-05-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-05-14 12:17",
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
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-05-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-05-14 11:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/95, repeat 139/93, pulse 79, wt 182 lb",
   "eGFR 99 (today)",
   "K 4.7 (today)",
   "LDL 117 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-05-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_15",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2021-03-02 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/87, pulse 63, wt 185 lb",
   "eGFR 98 (today)",
   "K 4.2 (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2021-03-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/1",
  "kind": "Medication event comment",
  "when": "2021-03-23 11:02",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold lisinopril 20 MG Oral Tablet 20 mg QD; reason: vomiting, poor oral intake"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: held today (vomiting, poor oral intake); review 2021-03-30"
  ],
  "forbidden": [
   "amlodipine: not started by 2021-03-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2021-03-23 10:57",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: held today (vomiting, poor oral intake); review 2021-03-30"
  ],
  "context": [],
  "forbidden": [
   "amlodipine: not started by 2021-03-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-11-08 12:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/78, pulse 63, wt 184 lb",
   "eGFR 97 (today)",
   "K 4.9 (today)",
   "LDL 102 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2021-11-08 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_31",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-09-12 10:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/82, pulse 76, wt 184 lb",
   "eGFR 93 (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2022-09-12 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_37",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-05-31 12:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 145/93, pulse 69, wt 187 lb",
   "eGFR 97 (today)",
   "K 4.4 (today)",
   "LDL 103 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-05-31 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/2",
  "kind": "Medication event comment",
  "when": "2023-12-22 15:51",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "resume lisinopril 40 MG Oral Tablet 40 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: resumed today (BP above goal)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-12-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-12-22 15:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: resumed today (BP above goal)"
  ],
  "context": [
   "BP 144/87, pulse 74, wt 186 lb",
   "eGFR 96 (today)",
   "K 4.8 (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2023-12-22 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-10-04 10:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/83, pulse 69, wt 189 lb",
   "eGFR 94 (today)",
   "K 4.4 (today)",
   "LDL 131 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2024-10-04 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_67",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2025-06-02 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 149/88, repeat 143/88, pulse 66, wt 185 lb",
   "eGFR 93 (today)",
   "K 4.6 (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2025-06-02 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_83/0",
  "kind": "Medication event comment",
  "when": "2026-02-25 09:36",
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
  "key": "B/visit/e_73",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-02-25 09:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 147/91, repeat 139/87, pulse 74, wt 185 lb",
   "eGFR 95 (2/23)",
   "K 4.3 (2/23)",
   "LDL 106 mg/dL (2/23)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
