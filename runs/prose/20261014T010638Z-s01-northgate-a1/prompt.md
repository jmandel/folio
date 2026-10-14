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

## Requests (24)

```json
[
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-05-13 08:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 151/91, repeat 147/91, pulse 72, wt 194 lb",
   "eGFR 69 (today)",
   "K 4.2 (today)",
   "UACR 148 mg/g (today)",
   "A1c 6.5% (today)",
   "LDL 78 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-05-13 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-05-13 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2019-05-13 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2019-09-10 13:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/88, repeat 145/85, pulse 84, wt 193 lb",
   "eGFR 69 (9/7)",
   "K 4.3 (9/7)",
   "A1c 6.4% (9/7)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-09-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2019-09-10 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_39/0",
  "kind": "Medication event comment",
  "when": "2020-02-07 13:01",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start chlorthalidone 25 MG Oral Tablet 12.5 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-02-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-02-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_29",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-02-07 12:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 144/91, repeat 141/90, pulse 65, wt 193 lb",
   "eGFR 68 (2/5)",
   "K 4.1 (2/5)",
   "A1c 6.8% (2/5)"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-02-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-02-07 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-06-09 12:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink."
   }
  ],
  "mustInclude": [],
  "context": [
   "BP 126/81, pulse 65, wt 191 lb",
   "eGFR 68 (today)",
   "K 4.3 (today)",
   "UACR 206 mg/g (today)",
   "A1c 6.9% (today)",
   "LDL 85 mg/dL (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-06-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-06-09 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_55",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-11-20 08:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/83, repeat 137/81, pulse 65, wt 194 lb",
   "eGFR 68 (today)",
   "K 4.3 (today)",
   "A1c 7.2% (today)"
  ],
  "forbidden": [
   "amlodipine: not started by 2020-11-20 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "finerenone: not started by 2020-11-20 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_67/0",
  "kind": "Medication event comment",
  "when": "2021-05-05 16:01",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start amlodipine 5 MG Oral Tablet 5 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "finerenone: not started by 2021-05-05 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-05-05 15:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/90, repeat 136/88, pulse 79, wt 196 lb",
   "eGFR 65 (5/3)",
   "K 4.4 (5/3)",
   "A1c 7.2% (5/3)"
  ],
  "forbidden": [
   "finerenone: not started by 2021-05-05 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_68",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-09-10 10:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 115/71, pulse 63, wt 194 lb",
   "eGFR 66 (today)",
   "K 4.7 (today)",
   "UACR 236 mg/g (today)",
   "A1c 7.1% (today)",
   "LDL 66 mg/dL (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2021-09-10 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_82",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-01-25 09:40",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/80, pulse 66, wt 194 lb",
   "eGFR 66 (1/21)",
   "K 4.4 (1/21)",
   "UACR 226 mg/g (1/21)",
   "A1c 7.5% (1/21)"
  ],
  "forbidden": [
   "finerenone: not started by 2022-01-25 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_89",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-06-10 14:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/85, pulse 66, wt 195 lb",
   "eGFR 65 (today)",
   "K 4.4 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "finerenone: not started by 2022-06-10 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_191/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2022-11-11 13:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 66, UACR 276 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "finerenone: not started by 2022-11-11 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_98",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-11-11 13:00",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/86, pulse 71, wt 193 lb",
   "eGFR 65 (11/9)",
   "K 5.9 (11/9), hemolyzed",
   "A1c 7.1% (11/9)",
   "K 4.2 (11/9)"
  ],
  "forbidden": [
   "finerenone: not started by 2022-11-11 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_199",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2023-01-12 09:17",
  "author": "Nina Ortiz, RN (Registered nurse)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "finerenone 10 mg QD added from the outside (Lakeview) record"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "finerenone 10 mg daily"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_107",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-05-01 15:30",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/81, pulse 85, wt 193 lb",
   "eGFR 65 (4/28)",
   "K 4.3 (4/28)",
   "A1c 7.1% (4/28)",
   "LDL 104 mg/dL (4/28)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_118",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-10-05 13:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/78, pulse 83, wt 196 lb",
   "eGFR 64 (today)",
   "K 4.4 (today)",
   "A1c 6.8% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_127",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-03-12 09:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 144/84, repeat 139/81, pulse 85, wt 194 lb",
   "eGFR 64 (3/8)",
   "K 4.8 (3/8)",
   "A1c 6.6% (3/8)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_134",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-08-16 09:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/86, repeat 140/83, pulse 70, wt 195 lb",
   "eGFR 60 (today)",
   "K 4.5 (today)",
   "UACR 425 mg/g (today)",
   "A1c 6.7% (today)",
   "LDL 78 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_146",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-12-25 15:50",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/75, pulse 69, wt 197 lb",
   "eGFR 59 (12/22)",
   "K 4.1 (12/22)",
   "UACR 438 mg/g (12/22)",
   "A1c 6.8% (12/22)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/problem/c_160/0",
  "kind": "Problem list comment",
  "when": "2025-05-24 16:25",
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
   "onset 2025-05-24",
   "supporting result: eGFR 57 (3/25)",
   "supporting result: eGFR 56 (today)",
   "supporting result: UACR 404 mg/g (3/25)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_154",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-05-28 12:20",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/71, pulse 65, wt 194 lb",
   "eGFR 56 (5/24)",
   "K 4.5 (5/24)",
   "A1c 7.3% (5/24)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_161",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-06 09:10",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 140/85, repeat 137/83, pulse 70, wt 194 lb",
   "eGFR 51 (today)",
   "K 4.7 (today)",
   "A1c 7.5% (today)",
   "LDL 96 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_174",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-02-16 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/79, pulse 87, wt 195 lb",
   "eGFR 50 (today)",
   "K 4.2 (today)",
   "UACR 755 mg/g (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_184",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-07-31 12:45",
  "author": "Moira Brennan, DO (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 45)"
  ],
  "context": [
   "BP 127/77, pulse 78, wt 193 lb",
   "eGFR 46 (7/28)",
   "K 4.6 (7/28)",
   "UACR 752 mg/g (7/28)",
   "A1c 8% (7/28)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
