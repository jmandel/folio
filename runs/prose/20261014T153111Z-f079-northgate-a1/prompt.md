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

## Requests (16)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2024-04-18 16:22",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2018-10",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2024-04-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metoprolol succinate: not started by 2024-04-18 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2024-04-18 16:22",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "losartan: not started by 2024-04-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metoprolol succinate: not started by 2024-04-18 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2024-04-18 16:22",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2022",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2024-04-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metoprolol succinate: not started by 2024-04-18 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2024-04-18 15:50",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 155/94, repeat 148/93, pulse 65, wt 161 lb",
   "eGFR 50 (4/13)",
   "K 4.9 (4/13)",
   "A1c 6.4% (4/13)",
   "LDL 92 mg/dL (4/13)"
  ],
  "forbidden": [
   "losartan: not started by 2024-04-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metoprolol succinate: not started by 2024-04-18 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2024-11-28 11:36",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "losartan: not started by 2024-11-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metoprolol succinate: not started by 2024-11-28 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_27/0",
  "kind": "Problem list comment",
  "when": "2024-11-28 11:47",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "onset 2024-11-28",
   "supporting result: eGFR 50 (4/13)",
   "supporting result: eGFR 47 (today)",
   "supporting result: UACR 227 mg/g (today)"
  ],
  "forbidden": [
   "losartan: not started by 2024-11-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metoprolol succinate: not started by 2024-11-28 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-11-28 11:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 20 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 153/93, repeat 148/91, pulse 84, wt 165 lb",
   "eGFR 47 (today)",
   "K 4.7 (today)",
   "UACR 227 mg/g (today)",
   "A1c 7.3% (today)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "losartan: not started by 2024-11-28 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metoprolol succinate: not started by 2024-11-28 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_39/0",
  "kind": "Allergy list comment",
  "when": "2025-07-02 15:54",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "lisinopril: dry cough (intolerance)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema)."
  ],
  "context": [
   "lisinopril intolerance: dry cough"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2025-07-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/2",
  "kind": "Medication event comment",
  "when": "2025-07-02 15:51",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "metoprolol succinate: not started by 2025-07-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/3",
  "kind": "Medication event comment",
  "when": "2025-07-02 15:52",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 40 MG Oral Tablet 40 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2025-07-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_38/0",
  "kind": "Medication event comment",
  "when": "2025-07-02 15:53",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start losartan potassium 50 MG Oral Tablet 50 mg QD; reason: ACE inhibitor cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: resumed today (ACE inhibitor cough)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2025-07-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_53",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2025-07-02 15:27",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: resumed today (ACE inhibitor cough)"
  ],
  "context": [
   "K 6.3 (today)",
   "K 5.9 (today)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2025-07-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_28",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-07-02 15:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "lisinopril: stopped today (dry cough)",
   "losartan: resumed today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 153/101, repeat 145/100, pulse 83, wt 163 lb",
   "eGFR 48 (6/29)",
   "K 4.5 (6/29)",
   "A1c 7.5% (6/29)",
   "LDL 61 mg/dL (6/29)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2025-07-02 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_38/1",
  "kind": "Medication event comment",
  "when": "2026-03-17 13:01",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change losartan potassium 100 MG Oral Tablet 100 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2026-03-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_41",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2026-03-17 12:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/86, repeat 135/82, pulse 64, wt 166 lb",
   "eGFR 43 (3/11)",
   "K 4.6 (3/11)",
   "A1c 7.5% (3/11)"
  ],
  "forbidden": [
   "metoprolol succinate: not started by 2026-03-17 (pattern /\\b(metoprolol|Toprol XL)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/void/m_47",
  "kind": "Chart correction comment",
  "when": "2026-04-07 08:23",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "The metoprolol succinate 50 mg start entered 2026-04-06 was wrong patient"
  ],
  "context": [
   "metoprolol succinate: entered in error today (wrong patient)"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
