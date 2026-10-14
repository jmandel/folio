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

## Requests (26)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-03-26 14:42",
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
   "onset 2006",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-03-26 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2019-03-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2019-03-26 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-03-26 14:42",
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
   "losartan: not started by 2019-03-26 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2019-03-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2019-03-26 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-03-26 14:42",
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
   "onset 2014",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-03-26 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2019-03-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2019-03-26 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_7",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-03-26 14:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 123/75, pulse 72, wt 186 lb",
   "eGFR 65 (3/21)",
   "K 4.2 (3/21)",
   "A1c 7.7% (3/21)",
   "LDL 178 mg/dL (3/21)"
  ],
  "forbidden": [
   "losartan: not started by 2019-03-26 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2019-03-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2019-03-26 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_17",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2019-12-16 11:40",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/81, pulse 74, wt 183 lb",
   "eGFR 63 (12/10)",
   "K 4.4 (12/10)",
   "A1c 7.8% (12/10)"
  ],
  "forbidden": [
   "losartan: not started by 2019-12-16 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2019-12-16 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2019-12-16 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_24",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2020-10-12 08:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/70, pulse 64, wt 184 lb",
   "eGFR 59 (today)",
   "K 4.5 (today)",
   "A1c 7.7% (today)",
   "LDL 156 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2020-10-12 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2020-10-12 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2020-10-12 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_43/0",
  "kind": "Problem list comment",
  "when": "2021-09-03 16:25",
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
   "onset 2021-09-03",
   "supporting result: eGFR 59 (10/12/20)",
   "supporting result: eGFR 57 (today)"
  ],
  "forbidden": [
   "losartan: not started by 2021-09-03 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2021-09-03 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2021-09-03 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_45/0",
  "kind": "Allergy list comment",
  "when": "2021-09-07 14:23",
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
   "empagliflozin: not started by 2021-09-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2021-09-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_4/1",
  "kind": "Medication event comment",
  "when": "2021-09-07 14:21",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 10 MG Oral Tablet 10 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "losartan: not started by 2021-09-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "empagliflozin: not started by 2021-09-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2021-09-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_44/0",
  "kind": "Medication event comment",
  "when": "2021-09-07 14:22",
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
   "losartan: started 50 mg daily today (ACE inhibitor cough)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-09-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2021-09-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_34",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-09-07 14:00",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 124/72, pulse 85, wt 185 lb",
   "eGFR 57 (9/3)",
   "K 4.2 (9/3)",
   "A1c 7.7% (9/3)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "empagliflozin: not started by 2021-09-07 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2021-09-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_47",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-05-24 12:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/76, pulse 70, wt 182 lb",
   "eGFR 56 (today)",
   "K 4.5 (today)",
   "UACR 11 mg/g (today)",
   "A1c 7.8% (today)",
   "LDL 157 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2022-05-24 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: not started by 2022-05-24 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-01-05 13:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/75, pulse 87, wt 179 lb",
   "eGFR 55 (1/3)",
   "K 4.3 (1/3)",
   "A1c 7.5% (1/3)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-01-05 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_228",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2023-04-24 13:30",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "hydrochlorothiazide: resumed today (creatinine back to baseline)",
   "losartan: resumed today (creatinine back to baseline)"
  ],
  "context": [
   "Acute kidney injury",
   "BP 146/78, repeat 144/75, pulse 84, wt 181 lb"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-04-24 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_70",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-14 14:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/81, pulse 69, wt 183 lb",
   "eGFR 54 (today)",
   "K 4.6 (today)",
   "UACR 13 mg/g (today)",
   "A1c 7.7% (today)",
   "LDL 129 mg/dL (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2023-11-14 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_84",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-06-27 10:20",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/81, pulse 67, wt 179 lb",
   "eGFR 54 (today)",
   "K 4.2 (today)",
   "A1c 7.9% (today)"
  ],
  "forbidden": [
   "empagliflozin: not started by 2024-06-27 (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_100/0",
  "kind": "Medication event comment",
  "when": "2025-04-22 12:36",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_93",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-04-22 12:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)"
  ],
  "context": [
   "BP 132/77, pulse 67, wt 181 lb",
   "eGFR 53 (4/17)",
   "K 4.7 (4/17)",
   "UACR 13 mg/g (4/17)",
   "A1c 8% (4/17)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_179/0",
  "kind": "Allergy list comment",
  "when": "2025-05-12 10:40",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_100/1",
  "kind": "Medication event comment",
  "when": "2025-05-12 10:37",
  "author": "Daniel Khan, MD (Primary care physician)",
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
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_178",
  "kind": "Primary care office visit note (reason: Hosp f/u)",
  "when": "2025-05-12 10:15",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "empagliflozin: stopped today (euglycemic DKA)",
   "empagliflozin adverse reaction: euglycemic diabetic ketoacidosis"
  ],
  "context": [
   "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated",
   "BP 128/78, pulse 80, wt 184 lb"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2025-05-28 15:39",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: vomiting, poor oral intake"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: held today (vomiting, poor oral intake); review 2025-06-04"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_230",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2025-05-28 15:34",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2025-06-04"
  ],
  "context": [],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2025-06-05 15:56",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "resume metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: eating and drinking normally"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_231",
  "kind": "Primary care phone visit note (reason: Phone: feeling better)",
  "when": "2025-06-05 15:52",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: resumed today (eating and drinking normally)"
  ],
  "context": [],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_101",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-11-18 11:10",
  "author": "Daniel Khan, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 120/70, pulse 72, wt 181 lb",
   "eGFR 50 (11/14)",
   "K 4.5 (11/14)",
   "UACR 14 mg/g (11/14)",
   "A1c 7.8% (11/14)",
   "LDL 143 mg/dL (11/14)"
  ],
  "forbidden": [
   "ibuprofen: unknown to this source (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)",
   "nf_135 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
