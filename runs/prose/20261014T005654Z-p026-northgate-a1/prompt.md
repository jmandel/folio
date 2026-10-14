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
  "when": "2019-11-28 13:42",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "ibuprofen: not started by 2019-11-28 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 13:42",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "ibuprofen: not started by 2019-11-28 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 13:42",
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
   "onset 2006",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "ibuprofen: not started by 2019-11-28 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-11-28 13:42",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2012-03",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "ibuprofen: not started by 2019-11-28 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-11-28 13:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/77, pulse 63, wt 183 lb"
  ],
  "forbidden": [
   "ibuprofen: not started by 2019-11-28 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-10-02 10:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/87, pulse 69, wt 184 lb"
  ],
  "forbidden": [
   "ibuprofen: not started by 2020-10-02 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2021-06-07 13:06",
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
   "ibuprofen: not started by 2021-06-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_11",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-06-07 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/88, repeat 138/87, pulse 79, wt 184 lb"
  ],
  "forbidden": [
   "ibuprofen: not started by 2021-06-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_13",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-01-31 11:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/73, pulse 65, wt 189 lb"
  ],
  "forbidden": [
   "ibuprofen: not started by 2022-01-31 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_15",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-10-07 15:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/85, pulse 75, wt 184 lb"
  ],
  "forbidden": [
   "ibuprofen: not started by 2022-10-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-08-14 13:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/86, repeat 138/82, pulse 64, wt 185 lb"
  ],
  "forbidden": [
   "ibuprofen: not started by 2023-08-14 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/2",
  "kind": "Medication event comment",
  "when": "2024-06-06 09:31",
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
   "ibuprofen: not started by 2024-06-06 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-06-06 09:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 144/92, repeat 141/89, pulse 73, wt 186 lb"
  ],
  "forbidden": [
   "ibuprofen: not started by 2024-06-06 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_21",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-04-28 08:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/80, pulse 79, wt 186 lb"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-12-29 08:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/81, pulse 62, wt 186 lb"
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
