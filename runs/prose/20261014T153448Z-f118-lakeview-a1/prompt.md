# Task

You are writing the narrative text of synthetic medical record items for a test corpus (FOLIO). All patients and clinicians are fictional. Each request below is one record item from Lakeview Kidney Care (nephrology clinic on the lab's coded-table system). Its structured data already exists; you write only the human-readable note text that goes with it.

## How this source writes

A nephrology clinic. Little prose: the nephrologist's short signed note, a few short paragraphs of clipped sentences ('CKD G3b A3, diabetic and hypertensive. eGFR 54 → 41 since 2022.').
Phone contacts are one to three lines. No headings, no bold labels. Numbers with units where useful; arrows for trends are fine.

## Reference notes from this source (other dates; for style only, do not copy their facts)

```markdown
New patient. Referred by Northgate FM (Dr. Reyes) for eGFR decline, albuminuria, prior SGLT2i euDKA.

<ref id="dx_ckd">CKD G3b A3</ref>, diabetic and hypertensive. eGFR 54 → 41 since 2022, UACR 85 → 320 mg/g.
BP 136/82 on losartan 100 (maximum dose since 8/2025) and chlorthalidone 12.5. K 4.6 in 2/2026.
A1c 8.2 on metformin 500 BID (reduced 2/2026 for eGFR) and glargine 10 u nightly.

<ref id="dx_na">Na 132</ref>, mild. Chlorthalidone likely; <ref id="na_sertraline">sertraline (disclosed
at intake) may contribute</ref>. No change today.

Euglycemic DKA 11/2024 on empagliflozin, details per Riverside records.
<ref id="sglt2_decision">Not re-trying an SGLT2i for now. Revisit after her sick-day plan is proven.</ref>

Albuminuria persists on maximum ARB, so: start <ref id="rx_finerenone">finerenone 10 mg daily</ref>.
K and creatinine in 4 weeks. Continue losartan 100. Return 3 months.
```

```markdown
Phone. K 5.8 this morning, 5.7 on same-day repeat (not hemolyzed). <ref id="hold_finerenone">Hold
finerenone</ref>, low-potassium diet reviewed. Repeat K in 2 weeks, then decide on restart.
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

## Requests (15)

```json
[
 {
  "key": "C/contact/e_258",
  "kind": "Nephrology new-patient note",
  "when": "2021-11-05 09:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 146/80, HR 67, weight 66.8 kg at 2021-11-05 09:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   },
   {
    "id": "rx_finerenone",
    "about": "finerenone: started 10 mg daily today (albuminuria persists on ARB)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 58 (today)",
   "K 4.3 (today)",
   "UACR 367 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: not started by 2021-11-05 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2021-11-05 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2021-11-05 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2021-11-05 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-11-05 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_266",
  "kind": "Nephrology follow-up note",
  "when": "2022-02-28 13:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 140/80, HR 67, weight 66.4 kg at 2022-02-28 13:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 59 (today)",
   "K 4.7 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: not started by 2022-02-28 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-02-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2022-02-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2022-02-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-02-28 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_272",
  "kind": "Nephrology follow-up note",
  "when": "2022-08-09 14:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 138/80, HR 78, weight 66 kg at 2022-08-09 14:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 57 (today)",
   "K 5.2 (today)",
   "UACR 358 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: not started by 2022-08-09 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-08-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2022-08-09 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2022-08-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-08-09 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_279",
  "kind": "Nephrology follow-up note",
  "when": "2022-11-10 09:40",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 146/80, HR 79, weight 66.8 kg at 2022-11-10 09:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 56 (today)",
   "K 4.8 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: not started by 2022-11-10 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-11-10 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2022-11-10 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2022-11-10 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-11-10 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_285",
  "kind": "Nephrology follow-up note",
  "when": "2023-03-01 10:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 141/80, HR 71, weight 65.5 kg at 2023-03-01 10:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 62 (today)",
   "K 4.6 (today)",
   "UACR 450 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: not started by 2023-03-01 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2023-03-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-03-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-03-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-03-01 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_292",
  "kind": "Nephrology follow-up note",
  "when": "2023-07-19 13:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 123/80, HR 77, weight 67.4 kg at 2023-07-19 13:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 56 (today)",
   "K 4.9 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-07-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-07-19 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-07-19 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_298",
  "kind": "Nephrology follow-up note",
  "when": "2023-10-23 11:40",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 132/80, HR 74, weight 66.1 kg at 2023-10-23 11:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 57 (today)",
   "K 4.4 (today)",
   "UACR 529 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: not started by 2023-10-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: not started by 2023-10-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-10-23 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_305",
  "kind": "Nephrology follow-up note",
  "when": "2024-02-26 12:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 140/80, HR 72, weight 66.8 kg at 2024-02-26 12:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 55 (today)",
   "K 4.5 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-02-26 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_311",
  "kind": "Nephrology follow-up note",
  "when": "2024-07-22 15:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 137/80, HR 70, weight 66.6 kg at 2024-07-22 15:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 58 (today)",
   "K 4.9 (today)",
   "UACR 654 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-07-22 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_318",
  "kind": "Nephrology follow-up note",
  "when": "2024-12-09 13:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 124/80, HR 88, weight 67.2 kg at 2024-12-09 13:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 57 (today)",
   "K 5.2 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-12-09 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_324",
  "kind": "Nephrology follow-up note",
  "when": "2025-03-17 08:40",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 114/80, HR 66, weight 66.5 kg at 2025-03-17 08:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 55 (today)",
   "K 4.9 (today)",
   "UACR 461 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2025-03-17 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_331",
  "kind": "Nephrology follow-up note",
  "when": "2025-06-25 09:40",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 139/80, HR 71, weight 66.5 kg at 2025-06-25 09:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 54 (today)",
   "K 4.6 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_337",
  "kind": "Nephrology follow-up note",
  "when": "2025-11-18 15:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 133/80, HR 76, weight 66 kg at 2025-11-18 15:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 53 (today)",
   "K 4.8 (today)",
   "UACR 787 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_344",
  "kind": "Nephrology follow-up note",
  "when": "2026-03-02 08:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 129/80, HR 84, weight 66.7 kg at 2026-03-02 08:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 54 (today)",
   "K 4.7 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_350",
  "kind": "Nephrology follow-up note",
  "when": "2026-08-17 10:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 120/80, HR 73, weight 65 kg at 2026-08-17 10:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2020-10-20"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2013-07-13"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2016"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 54 (today)",
   "K 4.5 (today)",
   "UACR 927 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
