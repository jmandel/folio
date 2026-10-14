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
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 14:02",
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
   "onset 2009-06",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2020-07-03 14:02",
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
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_6",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2020-07-03 13:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/82, pulse 79, wt 179 lb",
   "eGFR 62 (today)",
   "K 4.4 (today)",
   "UACR 10 mg/g (today)",
   "LDL 57 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2021-03-18 12:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/79, pulse 70, wt 177 lb",
   "eGFR 62 (3/13)",
   "K 4.3 (3/13)",
   "UACR 8 mg/g (3/13)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_27",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2021-12-27 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/73, pulse 81, wt 182 lb",
   "eGFR 64 (12/25)",
   "K 3.9 (12/25)",
   "UACR 10 mg/g (12/25)",
   "LDL 126 mg/dL (12/25)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_37",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-09-29 15:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/71, pulse 70, wt 179 lb",
   "eGFR 62 (today)",
   "K 4.3 (today)",
   "UACR 10 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_45",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2023-04-18 15:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/76, pulse 80, wt 178 lb",
   "eGFR 63 (4/14)",
   "K 4.4 (4/14)",
   "UACR 14 mg/g (4/14)",
   "LDL 99 mg/dL (4/14)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-11-20 15:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/86, pulse 71, wt 179 lb",
   "eGFR 60 (today)",
   "K 4.3 (today)",
   "UACR 13 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-06-27 10:30",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/82, pulse 67, wt 178 lb",
   "eGFR 60 (today)",
   "K 4.3 (today)",
   "LDL 113 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_76/0",
  "kind": "Problem list comment",
  "when": "2025-02-13 10:12",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2025-02-13",
   "supporting result: eGFR 60 (6/27/24)",
   "supporting result: eGFR 58 (today)",
   "supporting result: UACR 13 mg/g (11/20/23)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_71",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2025-02-13 09:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/73, pulse 74, wt 175 lb",
   "eGFR 58 (today)",
   "K 4.4 (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_77",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-11-17 15:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/75, pulse 70, wt 176 lb",
   "eGFR 54 (today)",
   "K 4.3 (today)",
   "UACR 18 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_86",
  "kind": "Primary care office visit note (reason: BP follow-up)",
  "when": "2026-07-23 10:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 119/71, pulse 66, wt 178 lb",
   "eGFR 51 (7/20)",
   "K 4.8 (7/20)",
   "UACR 14 mg/g (7/20)",
   "LDL 73 mg/dL (7/20)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
