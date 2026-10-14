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

## Requests (13)

```json
[
 {
  "key": "C/contact/e_85",
  "kind": "Nephrology new-patient note",
  "when": "2022-07-26 09:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 131/80, HR 79, weight 97.3 kg at 2022-07-26 09:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 39 (today)",
   "K 5 (today)",
   "UACR 195 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: not started by 2022-07-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_92",
  "kind": "Nephrology follow-up note",
  "when": "2022-11-14 15:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 131/80, HR 87, weight 97.2 kg at 2022-11-14 15:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 38 (today)",
   "K 4.7 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: not started by 2022-11-14 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_98",
  "kind": "Nephrology follow-up note",
  "when": "2023-03-21 11:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 130/80, HR 75, weight 98.1 kg at 2023-03-21 11:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 38 (today)",
   "K 4.7 (today)",
   "UACR 119 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: not started by 2023-03-21 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_105",
  "kind": "Nephrology follow-up note",
  "when": "2023-06-26 11:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 122/80, HR 84, weight 97.1 kg at 2023-06-26 11:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 37 (today)",
   "K 4.4 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: not started by 2023-06-26 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_111",
  "kind": "Nephrology follow-up note",
  "when": "2023-10-17 08:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 128/80, HR 68, weight 99.4 kg at 2023-10-17 08:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 38 (today)",
   "K 4.3 (today)",
   "UACR 186 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: not started by 2023-10-17 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_118",
  "kind": "Nephrology follow-up note",
  "when": "2024-04-01 11:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 124/80, HR 84, weight 97.5 kg at 2024-04-01 11:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 34 (today)",
   "K 4.7 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: not started by 2024-04-01 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_124",
  "kind": "Nephrology follow-up note",
  "when": "2024-08-02 08:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 130/80, HR 82, weight 98.6 kg at 2024-08-02 08:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 34 (today)",
   "K 4.7 (today)",
   "UACR 176 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: not started by 2024-08-02 (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_131",
  "kind": "Nephrology follow-up note",
  "when": "2024-12-30 14:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 136/80, HR 77, weight 96.9 kg at 2024-12-30 14:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 34 (today)",
   "K 4.9 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_137",
  "kind": "Nephrology follow-up note",
  "when": "2025-04-22 11:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 132/80, HR 81, weight 98 kg at 2025-04-22 11:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 34 (today)",
   "K 5.2 (today)",
   "UACR 155 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_144",
  "kind": "Nephrology follow-up note",
  "when": "2025-09-23 13:00",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 138/80, HR 78, weight 96.9 kg at 2025-09-23 13:04"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 36 (today)",
   "K 4.9 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_150",
  "kind": "Nephrology follow-up note",
  "when": "2026-02-09 14:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 121/80, HR 70, weight 98.2 kg at 2026-02-09 14:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 35 (today)",
   "K 4.6 (today)",
   "UACR 217 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_157",
  "kind": "Nephrology follow-up note",
  "when": "2026-05-22 11:20",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 117/80, HR 76, weight 98.5 kg at 2026-05-22 11:24"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 31 (today)",
   "K 4.7 (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "C/contact/e_163",
  "kind": "Nephrology follow-up note",
  "when": "2026-09-22 15:40",
  "author": "Tobi Adeyemi, MD (Nephrologist)",
  "length": "60-140 words in 3-5 short paragraphs",
  "refs": [
   {
    "id": "bp_sys",
    "about": "BP 126/80, HR 65, weight 97.3 kg at 2026-09-22 15:44"
   },
   {
    "id": "dx_ckd",
    "about": "Chronic kidney disease (stage 3b A2), onset 2023-03-18"
   },
   {
    "id": "dx_dm",
    "about": "Type 2 diabetes mellitus, onset 2016"
   },
   {
    "id": "dx_htn",
    "about": "Essential hypertension, onset 2014"
   }
  ],
  "spans": [],
  "mustInclude": [
   "eGFR 32 (today)",
   "K 4.7 (today)",
   "UACR 231 mg/g (today)"
  ],
  "context": [
   "visit diagnosis: Chronic kidney disease, stage 3b (active)",
   "visit diagnosis: Type 2 diabetes mellitus with diabetic chronic kidney disease (active)",
   "visit diagnosis: Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease (active)",
   "CKD category G3bA2"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_13 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: unknown to this source (pattern /\\b(losartan|Cozaar)\\b/i)",
   "hydrochlorothiazide: unknown to this source (pattern /\\b(hydrochlorothiazide)\\b/i)",
   "metformin: unknown to this source (pattern /\\b(metformin|Glucophage)\\b/i)",
   "glipizide: unknown to this source (pattern /\\b(glipizide|Glucotrol)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)",
   "furosemide: unknown to this source (pattern /\\b(furosemide|Lasix)\\b/i)",
   "spironolactone: unknown to this source (pattern /\\b(spironolactone|Aldactone)\\b/i)",
   "empagliflozin: unknown to this source (pattern /\\b(empagliflozin|Jardiance)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
