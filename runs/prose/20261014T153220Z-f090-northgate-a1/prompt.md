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

## Requests (27)

```json
[
 {
  "key": "B/med/m_19/0",
  "kind": "Medication event comment",
  "when": "2022-05-18 15:01",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.9"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.9)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-05-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2022-05-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-05-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2022-05-18 15:12",
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
   "onset 2017-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-05-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2022-05-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-05-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2022-05-18 15:12",
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
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-05-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2022-05-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-05-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_5",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2022-05-18 14:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.9)"
  ],
  "context": [
   "BP 141/88, repeat 137/86, pulse 80, wt 155 lb",
   "eGFR 50 (5/12)",
   "K 4.5 (5/12)",
   "A1c 8.9% (5/12)",
   "LDL 53 mg/dL (5/12)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-05-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2022-05-18 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-05-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_31/0",
  "kind": "Problem list comment",
  "when": "2022-10-22 16:25",
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
   "onset 2022-10-22",
   "supporting result: eGFR 50 (5/12)",
   "supporting result: eGFR 48 (today)",
   "supporting result: UACR 84 mg/g (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-10-22 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2022-10-22 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-10-22 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_20",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-10-27 09:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/82, pulse 64, wt 155 lb",
   "eGFR 48 (10/22)",
   "K 4.6 (10/22)",
   "UACR 84 mg/g (10/22)",
   "A1c 7.9% (10/22)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-10-27 (pattern /\\b(glargine|Lantus)\\b/i)",
   "empagliflozin: not started by 2022-10-27 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2022-10-27 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_43/0",
  "kind": "Medication event comment",
  "when": "2023-04-04 13:02",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start empagliflozin 10 MG Oral Tablet 10 mg QD; reason: CKD + DM, cardiorenal benefit"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-04-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_42/0",
  "kind": "Medication event comment",
  "when": "2023-04-04 13:01",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.3"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-04-04 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "chlorthalidone: not started by 2023-04-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_32",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-04-04 12:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.3)",
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "BP 145/88, pulse 82, wt 156 lb",
   "eGFR 45 (3/31)",
   "K 4.8 (3/31)",
   "UACR 79 mg/g (3/31)",
   "A1c 8.3% (3/31)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-04-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_44",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2023-09-18 10:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 136/86, pulse 64, wt 156 lb",
   "eGFR 50 (today)",
   "K 4.5 (today)",
   "UACR 86 mg/g (today)",
   "A1c 7.2% (today)",
   "LDL 145 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-09-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_176/0",
  "kind": "Allergy list comment",
  "when": "2023-12-19 14:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "empagliflozin: euglycemic diabetic ketoacidosis (adverse-reaction)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-12-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_43/1",
  "kind": "Medication event comment",
  "when": "2023-12-19 14:37",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop empagliflozin 10 MG Oral Tablet 10 mg QD; reason: euglycemic DKA"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin: stopped today (euglycemic DKA)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-12-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_175",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2023-12-19 14:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [
   {
    "id": "sick_day",
    "statement": "Sick-day rules reviewed."
   }
  ],
  "mustInclude": [
   "empagliflozin: stopped today (euglycemic DKA)",
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 144/78, repeat 142/76, pulse 63, wt 156 lb"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2023-12-19 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_56",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-03-05 15:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 153/97, repeat 146/95, pulse 82, wt 158 lb",
   "eGFR 49 (today)",
   "K 4.6 (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-03-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/1",
  "kind": "Medication event comment",
  "when": "2024-08-07 13:36",
  "author": "Jaya Patel, NP (Nurse practitioner)",
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
   "chlorthalidone: not started by 2024-08-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_62",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-08-07 13:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 148/87, pulse 80, wt 155 lb",
   "eGFR 45 (today)",
   "K 4.6 (today)",
   "UACR 53 mg/g (today)",
   "A1c 7.7% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2024-08-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_70",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-01-24 09:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/80, pulse 64, wt 151 lb",
   "eGFR 47 (today)",
   "K 6.4 (today), hemolyzed",
   "UACR 76 mg/g (today)",
   "A1c 8% (today)",
   "LDL 113 mg/dL (today)",
   "K 4.2 (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-01-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_42/1",
  "kind": "Medication event comment",
  "when": "2025-06-12 10:32",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change 3 ML insulin glargine 100 UNT/ML Pen Injector 14 units QHS; reason: A1c 8.1"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.1)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-06-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2025-06-12 10:31",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 45"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 45)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-06-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_31/1",
  "kind": "Problem list comment",
  "when": "2025-06-12 10:43",
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
   "onset 2022-10-22",
   "supporting result: eGFR 47 (1/24)",
   "supporting result: eGFR 45 (today)",
   "supporting result: UACR 93 mg/g (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-06-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_87",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-06-12 10:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 45)",
   "insulin glargine: dose changed to 14 units at bedtime today (A1c 8.1)"
  ],
  "context": [
   "BP 145/84, repeat 141/84, pulse 70, wt 153 lb",
   "eGFR 45 (today)",
   "K 4.5 (today)",
   "UACR 93 mg/g (today)",
   "A1c 8.1% (today)",
   "Chronic kidney disease stage 3b"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2025-06-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_103/0",
  "kind": "Medication event comment",
  "when": "2025-10-13 15:31",
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
  "forbidden": [
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_95",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-10-13 15:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 151/88, repeat 149/86, pulse 63, wt 154 lb",
   "eGFR 47 (today)",
   "K 5.1 (today)",
   "UACR 111 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_3/2",
  "kind": "Medication event comment",
  "when": "2026-04-08 16:11",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold losartan potassium 100 MG Oral Tablet 100 mg QD; reason: K 6.2 confirmed on repeat"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: held today (K 6.2 confirmed on repeat); review 2026-04-22"
  ],
  "forbidden": [
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_104",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-04-08 08:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/84, pulse 73, wt 156 lb",
   "eGFR 44 (4/4)",
   "K 4.7 (4/4)",
   "UACR 92 mg/g (4/4)",
   "A1c 6.5% (4/4)",
   "LDL 101 mg/dL (4/4)"
  ],
  "forbidden": [
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_184",
  "kind": "Primary care phone visit note (reason: Phone: high potassium)",
  "when": "2026-04-08 16:05",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: held today (K 6.2 confirmed on repeat); review 2026-04-22"
  ],
  "context": [
   "K 6.2 (today)",
   "K 6.3 (today)"
  ],
  "forbidden": [
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_115",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-09-03 14:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/77, pulse 84, wt 149 lb",
   "eGFR 45 (8/28)",
   "K 4.4 (8/28)",
   "UACR 123 mg/g (8/28)",
   "A1c 6.5% (8/28)"
  ],
  "forbidden": [
   "nf_142 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
