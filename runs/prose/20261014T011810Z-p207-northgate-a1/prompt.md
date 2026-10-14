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
  "when": "2024-09-20 10:12",
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
   "onset 2021",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2024-09-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2024-09-20 10:12",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2024-09-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2024-09-20 10:12",
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
   "onset 2019-07-01",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2024-09-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2024-09-20 09:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/79, pulse 67, wt 166 lb",
   "eGFR 66 (9/16)",
   "K 4.6 (9/16)",
   "UACR 544 mg/g (9/16)",
   "A1c 7.2% (9/16)",
   "LDL 124 mg/dL (9/16)"
  ],
  "forbidden": [
   "losartan: not started by 2024-09-20 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-23 15:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 151/88, repeat 146/85, pulse 71, wt 167 lb",
   "eGFR 66 (today)",
   "K 4.5 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [
   "losartan: not started by 2025-04-23 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_41/0",
  "kind": "Allergy list comment",
  "when": "2025-12-29 13:34",
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
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2025-12-29 13:31",
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
   "losartan: not started by 2025-12-29 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2025-12-29 13:32",
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
   "losartan: not started by 2025-12-29 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2025-12-29 13:33",
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
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_30",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-12-29 13:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 150/86, repeat 147/85, pulse 73, wt 162 lb",
   "eGFR 64 (today)",
   "K 4.3 (today)",
   "A1c 7.9% (today)",
   "LDL 102 mg/dL (today)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
