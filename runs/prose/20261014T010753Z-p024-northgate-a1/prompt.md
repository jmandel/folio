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

## Requests (19)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-01-21 15:22",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-01-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-01-21 15:22",
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
   "onset 2017-10-22",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-01-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2020-01-21 15:22",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-01-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-01-21 14:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/89, repeat 139/87, pulse 85, wt 250 lb",
   "eGFR 80 (1/18)",
   "K 4.3 (1/18)",
   "LDL 83 mg/dL (1/18)"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-01-21 (pattern /\\b(amlodipine|Norvasc)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_25/0",
  "kind": "Medication event comment",
  "when": "2020-10-13 16:06",
  "author": "Moira Brennan, DO (Primary care physician)",
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
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2020-10-13 15:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/93, repeat 142/92, pulse 64, wt 253 lb",
   "eGFR 83 (10/8)",
   "K 4.5 (10/8)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_26",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-06-24 14:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/80, pulse 85, wt 251 lb",
   "eGFR 79 (6/19)",
   "K 4.5 (6/19)",
   "LDL 120 mg/dL (6/19)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_36",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2022-04-18 10:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/76, pulse 78, wt 252 lb",
   "eGFR 80 (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2022-11-24 12:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/69, pulse 70, wt 252 lb",
   "eGFR 77 (today)",
   "K 4.7 (today)",
   "LDL 80 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_50",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-10-05 10:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/67, pulse 73, wt 254 lb",
   "eGFR 78 (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-04-23 11:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/75, pulse 65, wt 254 lb",
   "eGFR 79 (4/20)",
   "K 4.6 (4/20)",
   "LDL 117 mg/dL (4/20)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-03-06 11:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/82, pulse 84, wt 250 lb",
   "eGFR 80 (today)",
   "K 4.3 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_74",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-01-21 14:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/82, pulse 68, wt 255 lb",
   "eGFR 77 (1/18)",
   "K 4.5 (1/18)",
   "LDL 104 mg/dL (1/18)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2026-02-17 15:32",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold losartan potassium 100 MG Oral Tablet 100 mg QD; reason: vomiting, poor oral intake"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: held today (vomiting, poor oral intake); review 2026-02-24"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2026-02-17 15:27",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: held today (vomiting, poor oral intake); review 2026-02-24"
  ],
  "context": [],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2026-03-02 14:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "resume losartan potassium 100 MG Oral Tablet 100 mg QD; reason: eating and drinking normally"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: resumed today (eating and drinking normally)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_93",
  "kind": "Primary care phone visit note (reason: Phone: feeling better)",
  "when": "2026-03-02 14:26",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: resumed today (eating and drinking normally)"
  ],
  "context": [],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-09-22 13:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/80, pulse 68, wt 252 lb",
   "eGFR 78 (9/20)",
   "K 4.5 (9/20)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/void/m_94",
  "kind": "Chart correction comment",
  "when": "2026-09-29 08:16",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The atorvastatin 80 mg start entered 2026-09-28 was wrong patient"
  ],
  "context": [
   "atorvastatin: entered in error today (wrong patient)",
   "atorvastatin 40 mg at bedtime"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
