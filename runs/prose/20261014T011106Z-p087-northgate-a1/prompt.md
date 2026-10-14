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
  "when": "2019-11-18 10:47",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2017-05-14",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-11-18 10:47",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Major depressive disorder, recurrent, mild\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Major depressive disorder, recurrent, mild",
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": [
   {
    "words": "/depress|\\bMDD\\b|F33/i",
    "onlyInsideSpans": [
     "prob_1"
    ]
   }
  ]
 },
 {
  "key": "B/visit/e_4",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-11-18 10:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/76, pulse 85, wt 170 lb",
   "eGFR 72 (11/14)",
   "K 3.9 (11/14)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_13",
  "kind": "Primary care office visit note (reason: Follow-up)",
  "when": "2020-10-06 12:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/74, pulse 65, wt 163 lb",
   "eGFR 69 (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Follow-up)",
  "when": "2021-07-07 09:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/67, pulse 85, wt 168 lb",
   "eGFR 69 (7/1)",
   "K 4.2 (7/1)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-02-21 12:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/75, pulse 78, wt 170 lb",
   "eGFR 67 (today)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_36",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-11-11 08:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 119/70, pulse 68, wt 170 lb",
   "eGFR 65 (11/8)",
   "K 4 (11/8)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-10-06 10:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/70, pulse 81, wt 167 lb",
   "eGFR 65 (today)",
   "K 3.6 (today)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-04-29 15:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/65, pulse 70, wt 165 lb",
   "eGFR 64 (4/27)",
   "K 3.9 (4/27)",
   "LDL 134 mg/dL (4/27)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-11-22 09:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/80, pulse 76, wt 165 lb",
   "eGFR 66 (today)",
   "K 4.4 (today)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Follow-up)",
  "when": "2025-07-14 12:45",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/77, pulse 85, wt 168 lb",
   "eGFR 63 (7/10)",
   "K 4.8 (7/10)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_81",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-04-13 11:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/83, pulse 78, wt 170 lb",
   "eGFR 63 (today)",
   "LDL 109 mg/dL (today)"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_3 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
