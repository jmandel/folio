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

## Requests (14)

```json
[
 {
  "key": "C/contact/e_207",
  "kind": "Nephrology new-patient note",
  "when": "2021-10-01 08:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 130/80, HR 86, weight 98.8 kg at 2021-10-01 08:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 46 (today)",
   "K 4.5 (today)",
   "UACR 82 mg/g (today)",
   "Advised to avoid NSAIDs (ibuprofen, naproxen) for kidney protection."
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2021-10-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_215",
  "kind": "Nephrology follow-up note",
  "when": "2022-02-04 14:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 143/80, HR 68, weight 99.9 kg at 2022-02-04 14:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 44 (today)",
   "K 4.9 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-02-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_221",
  "kind": "Nephrology follow-up note",
  "when": "2022-06-20 15:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 147/80, HR 69, weight 100.7 kg at 2022-06-20 15:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 44 (today)",
   "K 4.9 (today)",
   "UACR 94 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-06-20 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_228",
  "kind": "Nephrology follow-up note",
  "when": "2022-11-28 11:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 139/80, HR 87, weight 99.6 kg at 2022-11-28 11:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 44 (today)",
   "K 4 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: not started by 2022-11-28 (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_234",
  "kind": "Nephrology follow-up note",
  "when": "2023-05-19 10:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 137/80, HR 67, weight 100.3 kg at 2023-05-19 10:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 42 (today)",
   "K 4.6 (today)",
   "UACR 98 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_241",
  "kind": "Nephrology follow-up note",
  "when": "2023-09-28 08:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 129/80, HR 63, weight 99.3 kg at 2023-09-28 08:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 42 (today)",
   "K 4.1 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_247",
  "kind": "Nephrology follow-up note",
  "when": "2024-02-29 08:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 140/80, HR 65, weight 100.2 kg at 2024-02-29 08:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 39 (today)",
   "K 4.6 (today)",
   "UACR 142 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_254",
  "kind": "Nephrology follow-up note",
  "when": "2024-08-12 13:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 138/80, HR 86, weight 99.1 kg at 2024-08-12 13:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 38 (today)",
   "K 5 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_260",
  "kind": "Nephrology follow-up note",
  "when": "2024-11-22 15:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 130/80, HR 67, weight 98.1 kg at 2024-11-22 15:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 39 (today)",
   "K 4.7 (today)",
   "UACR 114 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_267",
  "kind": "Nephrology follow-up note",
  "when": "2025-03-31 15:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 132/80, HR 63, weight 99.4 kg at 2025-03-31 15:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 37 (today)",
   "K 5.1 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_273",
  "kind": "Nephrology follow-up note",
  "when": "2025-08-25 11:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 129/80, HR 76, weight 98.4 kg at 2025-08-25 11:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 38 (today)",
   "K 4.5 (today)",
   "UACR 117 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_280",
  "kind": "Nephrology follow-up note",
  "when": "2026-01-12 11:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 151/80, HR 72, weight 99.5 kg at 2026-01-12 11:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 35 (today)",
   "K 4.5 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_286",
  "kind": "Nephrology follow-up note",
  "when": "2026-05-14 10:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 134/80, HR 82, weight 100.4 kg at 2026-05-14 10:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 34 (today)",
   "K 4.4 (today)",
   "UACR 128 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_293",
  "kind": "Nephrology follow-up note",
  "when": "2026-08-21 14:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 149/80, HR 75, weight 100.5 kg at 2026-08-21 14:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2021-03-31"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2019"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2015"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 34 (today)",
   "K 4.6 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "nf_164 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
