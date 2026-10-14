# Task

You are writing the narrative text of synthetic medical record items for a test corpus (FOLIO). All patients and clinicians are fictional. Each request below is one record item from Riverside Regional Hospital (signed hospital documents). Its structured data already exists; you write only the human-readable note text that goes with it.

## How this source writes

A community hospital. Each item is one signed document: ED provider note, admission H&P, daily progress note, specialty consult, discharge summary.
Write like a hospital physician: a `## Title` heading, then bold section labels (**History.**, **Exam.**, **Results.**, **Assessment and plan**), full sentences, numbered problem lists in H&Ps and progress notes, a medication list in the discharge summary.
Times in the prose are local wall-clock times (America/Chicago), e.g. 'started 23:05', 'on the 06:10 panel'. Lab values as the lab reports them ('Troponin I <0.01').
Discuss decisions explicitly (why a drug is held, what the plan is). Rule-outs are stated as such ('Pancreatitis ruled out: lipase 28').

## Reference notes from this source (other dates; for style only, do not copy their facts)

```markdown
## Admission history and physical

**Reason for admission:** euglycemic diabetic ketoacidosis.

**History of present illness.** Ms. Okafor is a 59-year-old school administrator with type 2 diabetes,
hypertension and CKD. <ref id="precipitant">On 10/29 she developed vomiting and loose stools,
probably a viral gastroenteritis (a coworker had the same illness). Since then she has eaten almost
nothing and kept down only sips of water.</ref> She could not say which of her pills she kept down over
those days. She presented to the ED last night short of breath and was found to be acidotic with a
glucose of 182.

She takes <ref id="med_empa">empagliflozin 10 mg daily</ref>, started by her primary care physician in
2023 for kidney and diabetes benefit. She is not on insulin at home and has never had DKA before. No
alcohol in the past month.

**Past medical history**

- <ref id="hx_htn">Hypertension</ref>, since about 2014
- <ref id="hx_dm">Type 2 diabetes</ref>, since 2016
- <ref id="hx_ckd">CKD stage 3a</ref>, per her primary care records
- <ref id="hx_lipid">Hyperlipidemia</ref>
- <ref id="hx_mdd">Depression, recurrent, mild; followed by her PCP</ref>

**Allergies:** <ref id="alg_lisinopril">lisinopril (cough)</ref>.

**Exam.** BP 112/68, HR 104, RR 24, afebrile. Dry mucous membranes, deep respirations. Abdomen soft;
the epigastric tenderness noted in the ED has resolved with antiemetics.

**Assessment and plan**

1. <ref id="dx_edka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>,
   <ref id="precipitant">precipitated by gastroenteritis and poor oral intake</ref>. Continue the
   <ref id="iv_insulin">insulin infusion per DKA protocol</ref> with
   <ref id="iv_d5lr">D5 lactated Ringer's</ref>, since glucose is near normal. BMP and
   beta-hydroxybutyrate every 4 hours. <ref id="med_empa">Hold empagliflozin.</ref>
   <ref id="med_metformin">Hold metformin</ref> while acidotic and not eating. Endocrinology consult.
2. <ref id="dx_panc">Pancreatitis ruled out</ref>: <ref id="lipase">lipase 28</ref>, pain resolved.
3. <ref id="dx_na">Hyponatremia</ref>, sodium 129, hypovolemic. <ref id="med_chlorthalidone">Hold
   chlorthalidone.</ref> Should correct with fluids.
4. Hypertension: BP soft-normal. <ref id="med_losartan">Hold losartan</ref> while volume depleted,
   with potassium 5.0 and creatinine above her usual; resume when eating and creatinine is back to
   baseline.
5. CKD: creatinine 1.41; her usual is about 1.3 per her primary care records. Avoid nephrotoxins.
6. <ref id="hx_mdd">Depression is stable.</ref> <ref id="med_sertraline">Continue sertraline
   100 mg daily.</ref>
7. <ref id="med_atorvastatin">Continue atorvastatin.</ref>
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

## Requests (6)

```json
[
 {
  "key": "A/e_40/ed",
  "kind": "ED provider note",
  "when": "2024-09-26 18:20",
  "author": "Erik Lindqvist, DO (Emergency physician)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "cbc",
    "about": "Complete blood count drawn 9/26 18:49 (local time): White blood cells 13.1 10*3/uL (H), Hemoglobin 12.6 g/dL, Platelets 343 10*3/uL"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 18:26: BP 145/87, HR 78, RR 16, T 99 F, SpO2 98%",
   "bmp: Basic metabolic panel drawn 9/26 18:49 (local time): Sodium 131 mmol/L (L), Potassium 4.8 mmol/L, Chloride 97 mmol/L (L), Bicarbonate (total CO2) 20 mmol/L (L), Anion gap 14 mmol/L, Urea nitrogen 47 mg/dL (H), Creatinine 1.17 mg/dL (H), eGFR (CKD-EPI 2021) 46 mL/min/1.73m2 (L), Glucose 129 mg/dL (H)",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/26 19:10, still running (local times)",
   "iv_ceftriaxone: inpatient order ceftriaxone IV IV 1 g every 24 h, started 9/26 19:50, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: not_reconciled",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-09-26 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2024-09-26 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2024-09-26 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_40/hp",
  "kind": "Admission history and physical",
  "when": "2024-09-27 00:53",
  "author": "Priya Raman, MD (Hospitalist)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held (resume_when_able) \"Hold until creatinine back to baseline\""
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held (resume_when_able) \"Hold during acute illness\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 00:43: BP 130/78, HR 92, RR 24, T 98.4 F, SpO2 97%",
   "bmp: Basic metabolic panel drawn 9/26 18:49 (local time): Sodium 131 mmol/L (L), Potassium 4.8 mmol/L, Chloride 97 mmol/L (L), Bicarbonate (total CO2) 20 mmol/L (L), Anion gap 14 mmol/L, Urea nitrogen 47 mg/dL (H), Creatinine 1.17 mg/dL (H), eGFR (CKD-EPI 2021) 46 mL/min/1.73m2 (L), Glucose 129 mg/dL (H)",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/26 19:10, still running (local times)",
   "alg_nkda: allergy list: NKDA"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-09-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2024-09-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2024-09-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_40/pn1",
  "kind": "Progress note",
  "when": "2024-09-27 07:55",
  "author": "Priya Raman, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/27 06:15 (local time): Sodium 133 mmol/L (L), Potassium 4.2 mmol/L, Chloride 99 mmol/L, Bicarbonate (total CO2) 26 mmol/L, Anion gap 8 mmol/L, Urea nitrogen 18 mg/dL, Creatinine 1.11 mg/dL (H), eGFR (CKD-EPI 2021) 49 mL/min/1.73m2 (L), Glucose 108 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:35: BP 136/82, HR 79, RR 19, T 98.2 F, SpO2 97%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/26 19:10, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-09-27 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2024-09-27 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2024-09-27 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_40/pn2",
  "kind": "Progress note",
  "when": "2024-09-28 07:43",
  "author": "Priya Raman, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/28 06:16 (local time): Sodium 134 mmol/L (L), Potassium 4.2 mmol/L, Chloride 105 mmol/L, Bicarbonate (total CO2) 24 mmol/L, Anion gap 5 mmol/L (L), Urea nitrogen 18 mg/dL, Creatinine 1.05 mg/dL (H), eGFR (CKD-EPI 2021) 52 mL/min/1.73m2 (L), Glucose 103 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:23: BP 120/72, HR 111, RR 17, T 98.1 F, SpO2 95%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/26 19:10, stopped 9/27 23:46 (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-09-28 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2024-09-28 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2024-09-28 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_40/pn3",
  "kind": "Progress note",
  "when": "2024-09-29 07:58",
  "author": "Priya Raman, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/29 06:04 (local time): Sodium 139 mmol/L, Potassium 3.9 mmol/L, Chloride 99 mmol/L, Bicarbonate (total CO2) 24 mmol/L, Anion gap 16 mmol/L, Urea nitrogen 28 mg/dL (H), Creatinine 0.99 mg/dL, eGFR (CKD-EPI 2021) 56 mL/min/1.73m2 (L), Glucose 164 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:38: BP 121/73, HR 94, RR 24, T 98.1 F, SpO2 99%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/26 19:10, stopped 9/27 23:46 (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-09-29 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2024-09-29 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2024-09-29 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_40/dc",
  "kind": "Discharge summary",
  "when": "2024-09-26 23:46",
  "author": "Priya Raman, MD (Hospitalist)",
  "length": "250-400 words",
  "refs": [
   {
    "id": "med_losartan",
    "about": "home med losartan 50 mg tablet, 50 mg 1 tab PO daily: continue"
   },
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status resolved"
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: continue"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 10:15: BP 127/76, HR 90, RR 24, T 98.8 F, SpO2 99%",
   "bmp_dc: Basic metabolic panel drawn 9/30 06:22 (local time): Sodium 136 mmol/L, Potassium 3.9 mmol/L, Chloride 100 mmol/L, Bicarbonate (total CO2) 24 mmol/L, Anion gap 12 mmol/L, Urea nitrogen 24 mg/dL (H), Creatinine 0.92 mg/dL, eGFR (CKD-EPI 2021) 61 mL/min/1.73m2, Glucose 115 mg/dL (H)",
   "alg_nkda: allergy list: NKDA",
   "fu_pcp: follow-up with Primary care (Northgate Family Medicine) within 1 week: Recheck symptoms and chest exam"
  ],
  "forbidden": [
   "dapagliflozin: not started by 2024-09-30 (pattern /\\b(dapagliflozin|Farxiga)\\b/i)",
   "amlodipine: not started by 2024-09-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "ibuprofen: not started by 2024-09-30 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
