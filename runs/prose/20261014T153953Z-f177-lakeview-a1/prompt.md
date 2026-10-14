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

## Requests (12)

```json
[
 {
  "key": "C/contact/e_173",
  "kind": "Nephrology new-patient note",
  "when": "2022-05-11 13:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 135/80, HR 83, weight 95.6 kg at 2022-05-11 13:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 55 (today)",
   "K 4.3 (today)",
   "UACR 463 mg/g (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-05-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2022-05-11 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-05-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2022-05-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_180",
  "kind": "Nephrology follow-up note",
  "when": "2022-09-26 14:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 148/80, HR 73, weight 93.8 kg at 2022-09-26 14:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 54 (today)",
   "K 4.2 (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2022-09-26 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2022-09-26 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2022-09-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2022-09-26 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_186",
  "kind": "Nephrology follow-up note",
  "when": "2023-01-09 11:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 147/80, HR 66, weight 94.9 kg at 2023-01-09 11:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 54 (today)",
   "K 4.4 (today)",
   "UACR 413 mg/g (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-01-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2023-01-09 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-01-09 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2023-01-09 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_193",
  "kind": "Nephrology follow-up note",
  "when": "2023-05-01 15:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 136/80, HR 64, weight 96 kg at 2023-05-01 15:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 55 (today)",
   "K 4.3 (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-05-01 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2023-05-01 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-05-01 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2023-05-01 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_199",
  "kind": "Nephrology follow-up note",
  "when": "2023-10-23 14:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 140/80, HR 64, weight 95.8 kg at 2023-10-23 14:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 55 (today)",
   "K 4.6 (today)",
   "UACR 707 mg/g (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2023-10-23 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2023-10-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2023-10-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2023-10-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_206",
  "kind": "Nephrology follow-up note",
  "when": "2024-04-16 08:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 133/80, HR 74, weight 95.5 kg at 2024-04-16 08:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: not started by 2024-04-16 (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2024-04-16 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-04-16 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2024-04-16 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_212",
  "kind": "Nephrology follow-up note",
  "when": "2024-09-23 15:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 144/80, HR 77, weight 96.2 kg at 2024-09-23 15:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 53 (today)",
   "K 4.5 (today)",
   "UACR 894 mg/g (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2024-09-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2024-09-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2024-09-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_219",
  "kind": "Nephrology follow-up note",
  "when": "2025-01-23 08:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 133/80, HR 69, weight 93.5 kg at 2025-01-23 08:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 52 (today)",
   "K 4.5 (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: not started by 2025-01-23 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2025-01-23 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2025-01-23 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_225",
  "kind": "Nephrology follow-up note",
  "when": "2025-07-14 12:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 142/80, HR 88, weight 94.6 kg at 2025-07-14 12:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 51 (today)",
   "K 4.5 (today)",
   "UACR 891 mg/g (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2025-07-14 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2025-07-14 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_232",
  "kind": "Nephrology follow-up note",
  "when": "2025-11-11 14:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 141/80, HR 68, weight 95.6 kg at 2025-11-11 14:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 51 (today)",
   "K 4.3 (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2025-11-11 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2025-11-11 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_238",
  "kind": "Nephrology follow-up note",
  "when": "2026-04-03 14:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 130/80, HR 66, weight 95.9 kg at 2026-04-03 14:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 52 (today)",
   "K 4.6 (today)",
   "UACR 1093 mg/g (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2026-04-03 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_245",
  "kind": "Nephrology follow-up note",
  "when": "2026-08-21 08:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 120/80, HR 85, weight 95 kg at 2026-08-21 08:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3a A3), onset 2022-07-11"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2010-03"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2008"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 52 (today)",
   "K 4.7 (today)"
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
   "rosuvastatin: unknown to this source (pattern /\\b(rosuvastatin|Crestor)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)",
   "insulin glargine: unknown to this source (pattern /\\b(glargine|Lantus)\\b/i)",
   "chlorthalidone: unknown to this source (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: unknown to this source (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: unknown to this source (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
