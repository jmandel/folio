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

## Requests (9)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2022-10-14 12:17",
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
   "onset 2016-08",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "naproxen: not started by 2022-10-14 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-10-14 12:17",
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
   "onset 2016-11",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "naproxen: not started by 2022-10-14 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2022-10-14 12:17",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "naproxen: not started by 2022-10-14 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_5",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-10-14 11:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 110/65, pulse 63, wt 216 lb"
  ],
  "forbidden": [
   "naproxen: not started by 2022-10-14 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: Follow-up)",
  "when": "2023-05-04 14:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/74, pulse 75, wt 216 lb"
  ],
  "forbidden": [
   "naproxen: not started by 2023-05-04 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: Follow-up)",
  "when": "2024-03-18 14:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/65, pulse 64, wt 215 lb"
  ],
  "forbidden": [
   "naproxen: not started by 2024-03-18 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_11",
  "kind": "Primary care office visit note (reason: Follow-up)",
  "when": "2024-11-26 08:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/72, pulse 87, wt 216 lb"
  ],
  "forbidden": [
   "naproxen: not started by 2024-11-26 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_13",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-06-16 14:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/71, pulse 86, wt 218 lb"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_15",
  "kind": "Primary care office visit note (reason: Follow-up)",
  "when": "2026-02-23 11:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 122/73, pulse 72, wt 217 lb"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
