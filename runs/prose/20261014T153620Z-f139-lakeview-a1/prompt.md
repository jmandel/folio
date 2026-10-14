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
  "key": "C/contact/e_246",
  "kind": "Nephrology new-patient note",
  "when": "2021-12-31 13:30",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 131/80, HR 74, weight 106.1 kg at 2021-12-31 13:34"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 73 (today)",
   "K 4.3 (today)",
   "UACR 388 mg/g (today)",
   "Advised to avoid NSAIDs (ibuprofen, naproxen) for kidney protection."
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2021-12-31 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_254",
  "kind": "Nephrology follow-up note",
  "when": "2022-06-07 13:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 140/80, HR 63, weight 106.2 kg at 2022-06-07 13:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A2), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 71 (today)",
   "K 4.7 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-06-07 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_260",
  "kind": "Nephrology follow-up note",
  "when": "2022-09-06 10:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 130/80, HR 86, weight 107.1 kg at 2022-09-06 10:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 69 (today)",
   "K 4.7 (today)",
   "UACR 374 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-09-06 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_267",
  "kind": "Nephrology follow-up note",
  "when": "2022-12-14 08:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 130/80, HR 70, weight 106.9 kg at 2022-12-14 08:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 69 (today)",
   "K 3.9 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2022-12-14 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_273",
  "kind": "Nephrology follow-up note",
  "when": "2023-05-26 13:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 142/80, HR 63, weight 106.4 kg at 2023-05-26 13:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 69 (today)",
   "K 4.3 (today)",
   "UACR 424 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-05-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_280",
  "kind": "Nephrology follow-up note",
  "when": "2023-11-13 09:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 141/80, HR 80, weight 105.2 kg at 2023-11-13 09:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 67 (today)",
   "K 4.4 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2023-11-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_286",
  "kind": "Nephrology follow-up note",
  "when": "2024-04-09 08:20",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 144/80, HR 78, weight 106 kg at 2024-04-09 08:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 67 (today)",
   "K 4.5 (today)",
   "UACR 460 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-04-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_293",
  "kind": "Nephrology follow-up note",
  "when": "2024-07-26 11:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 133/80, HR 83, weight 107 kg at 2024-07-26 11:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 64 (today)",
   "K 4.2 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-07-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_299",
  "kind": "Nephrology follow-up note",
  "when": "2024-12-02 09:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 145/80, HR 63, weight 105.9 kg at 2024-12-02 09:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 61 (today)",
   "K 4.1 (today)",
   "UACR 688 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2024-12-02 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_306",
  "kind": "Nephrology follow-up note",
  "when": "2025-05-26 13:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 141/80, HR 79, weight 105.7 kg at 2025-05-26 13:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 57 (today)",
   "K 4.6 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: not started by 2025-05-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_312",
  "kind": "Nephrology follow-up note",
  "when": "2025-11-21 15:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 144/80, HR 71, weight 104.7 kg at 2025-11-21 15:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 50 (today)",
   "K 4.4 (today)",
   "UACR 808 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_319",
  "kind": "Nephrology follow-up note",
  "when": "2026-02-24 09:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 129/80, HR 63, weight 106 kg at 2026-02-24 09:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 48 (today)",
   "K 4.8 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_332",
  "kind": "Nephrology telephone contact note",
  "when": "2026-08-06 15:31",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "1-3 short lines",
  "refs": [
   {
    "id": "hold_dapagliflozin",
    "about": "dapagliflozin: held today (recurrent genital yeast infection); review 2026-09-05"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_325",
  "kind": "Nephrology follow-up note",
  "when": "2026-08-11 12:00",
  "author": "Helen Marsh, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 129/80, HR 79, weight 105.4 kg at 2026-08-11 12:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2025-06-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-08-08"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2007-10"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 46 (today)",
   "K 4.7 (today)",
   "UACR 998 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "atorvastatin: unknown to this source (pattern /\\b(atorvastatin|Lipitor)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "nf_203 is not recorded by this source (pattern /gastroenteritis|stomach bug|stomach flu/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
