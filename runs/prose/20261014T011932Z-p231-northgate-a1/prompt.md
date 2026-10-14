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

## Requests (7)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2023-09-25 13:12",
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
   "onset 2020",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_4 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2023-09-25 13:12",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2018-01-04",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_4 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
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
  "key": "B/visit/e_5",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2023-09-25 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 118/73, pulse 65, wt 191 lb"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_4 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: Follow-up)",
  "when": "2024-06-18 15:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 113/63, pulse 71, wt 187 lb"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_4 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-02-03 12:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/76, pulse 78, wt 188 lb"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_4 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_11",
  "kind": "Primary care office visit note (reason: Follow-up)",
  "when": "2025-09-15 12:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/82, pulse 85, wt 189 lb"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_4 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_13",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-05-15 14:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/72, pulse 88, wt 187 lb"
  ],
  "forbidden": [
   "c_2 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_4 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
