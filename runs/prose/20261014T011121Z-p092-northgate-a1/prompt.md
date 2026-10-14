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

## Requests (14)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2021-01-28 09:02",
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
   "onset 2010",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2021-01-28 09:02",
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
   "onset 2020",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2021-01-28 09:02",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2021-01-28 09:02",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Heart failure with reduced ejection fraction\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Heart failure with reduced ejection fraction",
   "onset 2019",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2021-01-28 09:02",
  "author": "Moira Brennan, DO (Primary care physician)",
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
   "onset 2017",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
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
  "key": "B/visit/e_14",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2021-01-28 08:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/74, pulse 70, wt 186 lb",
   "eGFR 58 (today)",
   "K 4.8 (today)",
   "UACR 11 mg/g (today)",
   "A1c 7.7% (today)",
   "LDL 119 mg/dL (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_34/0",
  "kind": "Problem list comment",
  "when": "2021-09-18 16:25",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Chronic kidney disease stage 3a\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "onset 2021-09-18",
   "supporting result: eGFR 58 (1/28)",
   "supporting result: eGFR 57 (today)",
   "supporting result: UACR 11 mg/g (1/28)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-09-21 08:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/81, pulse 81, wt 185 lb",
   "eGFR 57 (9/18)",
   "K 4.8 (9/18)",
   "A1c 7.6% (9/18)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_35",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-05-12 13:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/71, pulse 66, wt 189 lb",
   "eGFR 54 (5/10)",
   "K 4.8 (5/10)",
   "A1c 7.7% (5/10)",
   "LDL 95 mg/dL (5/10)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-02-28 13:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/73, pulse 79, wt 186 lb",
   "eGFR 52 (today)",
   "K 4.9 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_51",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-12-15 14:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/72, pulse 83, wt 185 lb",
   "eGFR 50 (12/10)",
   "K 4.9 (12/10)",
   "UACR 13 mg/g (12/10)",
   "A1c 7.4% (12/10)",
   "LDL 107 mg/dL (12/10)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-09-06 11:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/80, pulse 87, wt 185 lb",
   "eGFR 51 (today)",
   "K 4.5 (today)",
   "UACR 14 mg/g (today)",
   "A1c 7% (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_69",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-04-24 10:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/78, pulse 74, wt 185 lb",
   "eGFR 51 (4/22)",
   "K 4.9 (4/22)",
   "UACR 16 mg/g (4/22)",
   "A1c 7% (4/22)",
   "LDL 105 mg/dL (4/22)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_81",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-03-18 15:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 117/76, pulse 64, wt 185 lb",
   "eGFR 49 (today)",
   "K 4.8 (today)",
   "UACR 18 mg/g (today)",
   "A1c 7% (today)",
   "LDL 79 mg/dL (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_12 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
