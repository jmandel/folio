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
  "when": "2020-07-03 10:52",
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
   "onset 2006-06",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-07-03 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 10:52",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2020-07-03 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_5",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-07-03 10:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/81, pulse 88, wt 152 lb",
   "eGFR 78 (today)",
   "K 4.6 (today)"
  ],
  "forbidden": [
   "losartan: not started by 2020-07-03 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-04-23 11:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/82, pulse 82, wt 153 lb",
   "eGFR 77 (today)",
   "K 4.2 (today)",
   "LDL 64 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2021-04-23 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-02-07 10:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/82, pulse 81, wt 153 lb",
   "eGFR 76 (today)",
   "K 4.1 (today)"
  ],
  "forbidden": [
   "losartan: not started by 2022-02-07 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_25",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2022-10-06 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/86, repeat 137/86, pulse 62, wt 153 lb",
   "eGFR 77 (10/3)",
   "K 4.3 (10/3)",
   "LDL 75 mg/dL (10/3)"
  ],
  "forbidden": [
   "losartan: not started by 2022-10-06 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_41/0",
  "kind": "Allergy list comment",
  "when": "2023-07-18 09:53",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/1",
  "kind": "Medication event comment",
  "when": "2023-07-18 09:51",
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
   "losartan: not started by 2023-07-18 (pattern /\\b(losartan|Cozaar)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2023-07-18 09:52",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_34",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2023-07-18 09:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 139/86, pulse 87, wt 151 lb",
   "eGFR 74 (7/12)",
   "K 4.3 (7/12)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_43",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-02-09 08:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/80, pulse 69, wt 154 lb",
   "eGFR 73 (today)",
   "K 4.2 (today)",
   "LDL 80 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2024-10-04 11:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/88, pulse 70, wt 156 lb",
   "eGFR 76 (today)",
   "K 4.7 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/1",
  "kind": "Medication event comment",
  "when": "2025-06-19 14:41",
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
  "key": "B/visit/e_64",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2025-06-19 14:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 141/85, repeat 133/83, pulse 75, wt 156 lb",
   "eGFR 73 (6/16)",
   "K 4.5 (6/16)",
   "LDL 85 mg/dL (6/16)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-04-14 13:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/72, pulse 67, wt 153 lb",
   "eGFR 72 (today)",
   "K 4.5 (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
