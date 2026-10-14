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

## Requests (22)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-12-23 09:17",
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
   "onset 2009",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-12-23 09:17",
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
   "onset 2018",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-12-23 09:17",
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
   "onset 2014-08-15",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-12-23 09:17",
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
   "onset 2017-08",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_9",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-12-23 08:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/78, pulse 62, wt 223 lb",
   "eGFR 68 (today)",
   "K 4.2 (today)",
   "UACR 83 mg/g (today)",
   "A1c 6.7% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-06-15 09:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 146/89, pulse 69, wt 227 lb",
   "eGFR 67 (today)",
   "K 4.2 (today)",
   "A1c 6.8% (today)",
   "LDL 91 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-12-04 11:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/81, pulse 73, wt 223 lb",
   "eGFR 68 (today)",
   "K 4.6 (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_36",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-06-02 12:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/74, pulse 78, wt 225 lb",
   "eGFR 67 (5/30)",
   "K 4.4 (5/30)",
   "A1c 6.7% (5/30)",
   "LDL 110 mg/dL (5/30)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_49",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-10-14 10:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/86, pulse 70, wt 224 lb",
   "eGFR 67 (10/11)",
   "K 4.9 (10/11)",
   "A1c 6.9% (10/11)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_58",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-02-24 08:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/80, pulse 85, wt 228 lb",
   "eGFR 65 (2/21)",
   "K 4.7 (2/21)",
   "UACR 127 mg/g (2/21)",
   "A1c 6.6% (2/21)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_66",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-07-27 14:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/81, pulse 81, wt 222 lb",
   "eGFR 66 (today)",
   "K 4.4 (today)",
   "A1c 6.7% (today)",
   "LDL 67 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_76",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-11-29 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/81, pulse 64, wt 227 lb",
   "eGFR 64 (11/23)",
   "K 4.3 (11/23)",
   "A1c 7.3% (11/23)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_83",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-24 08:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/80, pulse 86, wt 224 lb",
   "eGFR 64 (today)",
   "K 4.7 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_89",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-09-05 08:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/74, pulse 88, wt 224 lb",
   "eGFR 64 (8/30)",
   "K 4.2 (8/30)",
   "UACR 195 mg/g (8/30)",
   "A1c 7.4% (8/30)",
   "LDL 105 mg/dL (8/30)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_100",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-02-19 15:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/75, pulse 88, wt 226 lb",
   "eGFR 64 (2/13)",
   "K 4.2 (2/13)",
   "A1c 7.7% (2/13)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_107",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-08-12 12:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/78, pulse 72, wt 227 lb",
   "eGFR 60 (8/7)",
   "K 4.5 (8/7)",
   "A1c 7.1% (8/7)",
   "LDL 85 mg/dL (8/7)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_125/0",
  "kind": "Problem list comment",
  "when": "2024-12-31 16:25",
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
   "onset 2024-12-31",
   "supporting result: eGFR 60 (8/7)",
   "supporting result: eGFR 56 (today)",
   "supporting result: UACR 193 mg/g (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_118",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-01-06 08:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/84, pulse 83, wt 223 lb",
   "eGFR 56 (12/31/24)",
   "K 4.6 (12/31/24)",
   "UACR 193 mg/g (12/31/24)",
   "A1c 7.4% (12/31/24)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_126",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-06-02 08:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/74, pulse 87, wt 225 lb",
   "eGFR 52 (5/31)",
   "K 4.4 (5/31)",
   "A1c 7.3% (5/31)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_132",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-13 15:15",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/74, pulse 86, wt 224 lb",
   "eGFR 49 (today)",
   "K 4.5 (today)",
   "UACR 280 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 70 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_144",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-03-23 15:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/81, pulse 71, wt 225 lb",
   "eGFR 45 (today)",
   "K 4.6 (today)",
   "A1c 7.4% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_150",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-08-31 13:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 131/77, pulse 86, wt 223 lb",
   "eGFR 40 (today)",
   "K 5 (today)",
   "UACR 456 mg/g (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
