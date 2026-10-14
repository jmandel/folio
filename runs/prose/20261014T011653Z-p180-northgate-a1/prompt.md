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
  "key": "B/med/m_17/0",
  "kind": "Medication event comment",
  "when": "2024-08-02 09:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 9"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (A1c 9)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-08-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2024-08-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2024-08-02 09:47",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-08-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2024-08-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2024-08-02 09:47",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-08-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2024-08-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2024-08-02 09:47",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2012-01",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-08-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2024-08-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2024-08-02 09:47",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Hypothyroidism\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Hypothyroidism",
   "onset 2011-02-10",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-08-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2024-08-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2024-08-02 09:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (A1c 9)"
  ],
  "context": [
   "BP 142/82, repeat 137/80, pulse 74, wt 242 lb",
   "eGFR 95 (7/31)",
   "UACR 49 mg/g (7/31)",
   "A1c 9% (7/31)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-08-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2024-08-02 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_18",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-01-13 10:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/77, pulse 87, wt 242 lb",
   "eGFR 94 (1/9)",
   "K 3.9 (1/9)",
   "UACR 43 mg/g (1/9)",
   "A1c 8.4% (1/9)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-01-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "semaglutide: not started by 2025-01-13 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_39/0",
  "kind": "Medication event comment",
  "when": "2025-07-15 13:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.8"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.8)"
  ],
  "forbidden": [
   "semaglutide: not started by 2025-07-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-07-15 13:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.8)"
  ],
  "context": [
   "BP 134/85, pulse 64, wt 240 lb",
   "eGFR 96 (7/12)",
   "K 4.4 (7/12)",
   "A1c 8.8% (7/12)",
   "LDL 117 mg/dL (7/12)"
  ],
  "forbidden": [
   "semaglutide: not started by 2025-07-15 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-11-24 09:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 112/64, pulse 75, wt 246 lb",
   "eGFR 95 (today)",
   "UACR 40 mg/g (today)",
   "A1c 8.1% (today)"
  ],
  "forbidden": [
   "semaglutide: not started by 2025-11-24 (pattern /\\b(semaglutide|Ozempic)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_53/0",
  "kind": "Medication event comment",
  "when": "2026-04-13 14:41",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start semaglutide 1 MG/0.75 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.4"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.4)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-04-13 14:20",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "semaglutide: started 0.5 mg weekly today (A1c 8.4)"
  ],
  "context": [
   "BP 125/73, pulse 85, wt 243 lb",
   "eGFR 95 (4/7)",
   "K 4.1 (4/7)",
   "A1c 8.4% (4/7)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-08-14 13:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/85, pulse 75, wt 242 lb",
   "eGFR 91 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
