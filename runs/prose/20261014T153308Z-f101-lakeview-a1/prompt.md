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
  "key": "C/contact/e_174",
  "kind": "Nephrology new-patient note",
  "when": "2021-08-23 12:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 125/80, HR 74, weight 101.9 kg at 2021-08-23 12:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   },
   {
    "id": "rx_finerenone",
    "about": "finerenone: started 10 mg daily today (albuminuria persists on ARB)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 67 (today)",
   "K 4.7 (today)",
   "UACR 609 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-08-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-08-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_271",
  "kind": "Nephrology telephone contact note",
  "when": "2021-10-18 15:19",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "1-3 short lines",
  "refs": [
   {
    "id": "hold_finerenone",
    "about": "finerenone: held today (K 5.8 / 5.7 confirmed); review 2021-11-01"
   }
  ],
  "spans": [],
  "mustInclude": [
   "K 5.8 (today)",
   "K 5.7 (today)"
  ],
  "context": [],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-10-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2021-10-18 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_182",
  "kind": "Nephrology follow-up note",
  "when": "2022-01-17 08:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 141/80, HR 68, weight 102 kg at 2022-01-17 08:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 65 (today)",
   "K 4.8 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-01-17 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-01-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_188",
  "kind": "Nephrology follow-up note",
  "when": "2022-07-05 08:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 149/80, HR 80, weight 100.8 kg at 2022-07-05 08:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 64 (today)",
   "K 4.5 (today)",
   "UACR 928 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-07-05 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-07-05 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_195",
  "kind": "Nephrology follow-up note",
  "when": "2022-11-11 12:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 132/80, HR 72, weight 102.5 kg at 2022-11-11 12:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 63 (today)",
   "K 4.2 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-11-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2022-11-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_201",
  "kind": "Nephrology follow-up note",
  "when": "2023-04-13 15:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 135/80, HR 65, weight 103 kg at 2023-04-13 15:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 62 (today)",
   "K 4.7 (today)",
   "UACR 1111 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2023-04-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2023-04-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_208",
  "kind": "Nephrology follow-up note",
  "when": "2023-08-29 14:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 131/80, HR 81, weight 101.1 kg at 2023-08-29 14:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 61 (today)",
   "K 4.7 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2023-08-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2023-08-29 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_214",
  "kind": "Nephrology follow-up note",
  "when": "2023-12-18 15:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 139/80, HR 78, weight 104.6 kg at 2023-12-18 15:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 2 A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 61 (today)",
   "K 4.6 (today)",
   "UACR 1190 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 2 (mild) (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G2A3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2023-12-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2023-12-18 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_221",
  "kind": "Nephrology follow-up note",
  "when": "2024-06-13 09:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 136/80, HR 62, weight 100.8 kg at 2024-06-13 09:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 60 (today)",
   "K 4.9 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2024-06-13 (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2024-06-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_227",
  "kind": "Nephrology follow-up note",
  "when": "2024-10-23 14:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 137/80, HR 82, weight 101.3 kg at 2024-10-23 14:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 55 (today)",
   "K 4.9 (today)",
   "UACR 1116 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2024-10-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_234",
  "kind": "Nephrology follow-up note",
  "when": "2025-03-26 10:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 133/80, HR 88, weight 101.4 kg at 2025-03-26 10:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 51 (today)",
   "K 5.1 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2025-03-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_240",
  "kind": "Nephrology follow-up note",
  "when": "2025-07-28 14:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 130/80, HR 78, weight 102.1 kg at 2025-07-28 14:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 48 (today)",
   "K 4.6 (today)",
   "UACR 1755 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3a (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3aA3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2025-07-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_247",
  "kind": "Nephrology follow-up note",
  "when": "2025-12-22 14:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 144/80, HR 68, weight 102.5 kg at 2025-12-22 14:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 43 (today)",
   "K 4.9 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2025-12-22 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_253",
  "kind": "Nephrology follow-up note",
  "when": "2026-04-16 09:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 128/80, HR 84, weight 103.6 kg at 2026-04-16 09:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 41 (today)",
   "K 4.9 (today)",
   "UACR 1812 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: not started by 2026-04-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_260",
  "kind": "Nephrology follow-up note",
  "when": "2026-07-15 11:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 123/80, HR 69, weight 101.9 kg at 2026-07-15 11:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A3), onset 2024-07-17"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2009"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 39 (today)",
   "K 5.1 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA3"
  ],
  "forbidden": [
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "dapagliflozin: unknown to this source (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
