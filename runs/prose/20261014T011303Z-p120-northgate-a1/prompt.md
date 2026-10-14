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

## Requests (18)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-09-11 12:22",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2015",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-11 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-09-11 12:22",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-11 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-09-11 12:22",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "chlorthalidone: not started by 2019-09-11 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_8",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-09-11 11:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/81, pulse 71, wt 123 lb",
   "eGFR 45 (today)",
   "K 4.7 (today)",
   "UACR 106 mg/g (today)",
   "A1c 6.8% (today)",
   "LDL 120 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-09-11 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_29/0",
  "kind": "Problem list comment",
  "when": "2020-08-04 13:17",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "onset 2020-08-04",
   "supporting result: eGFR 45 (9/11/19)",
   "supporting result: eGFR 47 (today)",
   "supporting result: UACR 106 mg/g (9/11/19)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-08-04 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-08-04 12:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/83, pulse 64, wt 121 lb",
   "eGFR 47 (today)",
   "K 4.8 (today)",
   "A1c 7.4% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-08-04 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_30",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-04-21 11:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/92, pulse 76, wt 123 lb",
   "eGFR 42 (4/16)",
   "K 4.4 (4/16)",
   "A1c 6.4% (4/16)",
   "LDL 164 mg/dL (4/16)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-04-21 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_29/1",
  "kind": "Problem list comment",
  "when": "2021-12-09 12:13",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "update problem \"Chronic kidney disease stage 3b\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "onset 2020-08-04",
   "supporting result: eGFR 42 (4/16)",
   "supporting result: eGFR 41 (today)",
   "supporting result: UACR 207 mg/g (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-12-09 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_114/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2021-12-09 12:25",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 41, UACR 207 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3b",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-12-09 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-12-09 11:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/86, pulse 67, wt 122 lb",
   "eGFR 41 (today)",
   "K 4.4 (today)",
   "UACR 207 mg/g (today)",
   "A1c 6.3% (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-12-09 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_48",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-07-29 12:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/84, pulse 85, wt 122 lb",
   "eGFR 42 (7/24)",
   "K 4.7 (7/24)",
   "UACR 168 mg/g (7/24)",
   "A1c 6.6% (7/24)",
   "LDL 117 mg/dL (7/24)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-07-29 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_60",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-11 15:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/82, pulse 71, wt 121 lb",
   "eGFR 38 (today)",
   "K 4.5 (today)",
   "A1c 6.3% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-04-11 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_69",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2023-11-27 12:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/79, repeat 133/78, pulse 79, wt 123 lb",
   "eGFR 39 (today)",
   "K 4.3 (today)",
   "UACR 172 mg/g (today)",
   "A1c 6.5% (today)",
   "LDL 111 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-11-27 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_86/0",
  "kind": "Medication event comment",
  "when": "2024-07-30 14:41",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_80",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-07-30 14:20",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 142/82, repeat 137/81, pulse 70, wt 123 lb",
   "eGFR 40 (today)",
   "K 4.6 (today)",
   "A1c 6.6% (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_87",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-03-11 09:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/77, pulse 76, wt 120 lb",
   "eGFR 35 (today)",
   "K 4.5 (today)",
   "A1c 6.4% (today)",
   "LDL 105 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_97",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-10-28 15:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 124/78, pulse 72, wt 123 lb",
   "eGFR 33 (10/25)",
   "K 5 (10/25)",
   "A1c 6.5% (10/25)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "B/visit/e_103",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-05-26 12:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/82, pulse 78, wt 121 lb",
   "eGFR 31 (today)",
   "K 4.8 (today)",
   "UACR 243 mg/g (today)",
   "A1c 6.1% (today)",
   "LDL 143 mg/dL (today)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
