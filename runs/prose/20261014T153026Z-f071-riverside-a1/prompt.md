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

## Requests (7)

```json
[
 {
  "key": "A/e_91/hp",
  "kind": "Admission history and physical",
  "when": "2024-09-06 18:34",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held (resume_when_able) \"Hold during acute illness\""
   },
   {
    "id": "med_empagliflozin",
    "about": "home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held (resume_when_able) \"Hold while not eating\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 18:24: BP 115/69, HR 105, RR 24, T 98.5 F, SpO2 94%",
   "bmp: Basic metabolic panel drawn 9/6 13:30 (local time): Sodium 132 mmol/L (L), Potassium 4.7 mmol/L, Chloride 99 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 12 mmol/L, Urea nitrogen 30 mg/dL (H), Creatinine 2.70 mg/dL (H), eGFR (CKD-EPI 2021) 28 mL/min/1.73m2 (L), Glucose 125 mg/dL (H)",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/6 13:55, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_lisinopril: home med lisinopril 40 mg tablet, 40 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_91/ed",
  "kind": "ED provider note",
  "when": "2024-09-06 13:05",
  "author": "Adaeze Okonjo, MD (Emergency physician)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "cbc",
    "about": "Complete blood count drawn 9/6 13:30 (local time): White blood cells 13.1 10*3/uL (H), Hemoglobin 14.0 g/dL, Platelets 343 10*3/uL"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 13:11: BP 143/86, HR 97, RR 21, T 99.2 F, SpO2 95%",
   "bmp: Basic metabolic panel drawn 9/6 13:30 (local time): Sodium 132 mmol/L (L), Potassium 4.7 mmol/L, Chloride 99 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 12 mmol/L, Urea nitrogen 30 mg/dL (H), Creatinine 2.70 mg/dL (H), eGFR (CKD-EPI 2021) 28 mL/min/1.73m2 (L), Glucose 125 mg/dL (H)",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/6 13:55, still running (local times)",
   "iv_ceftriaxone: inpatient order ceftriaxone IV IV 1 g every 24 h, started 9/6 14:35, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: not_reconciled",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: not_reconciled",
   "med_lisinopril: home med lisinopril 40 mg tablet, 40 mg 1 tab PO daily: not_reconciled",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: not_reconciled",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_91/pn1",
  "kind": "Progress note",
  "when": "2024-09-07 07:39",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/7 06:09 (local time): Sodium 139 mmol/L, Potassium 4.2 mmol/L, Chloride 103 mmol/L, Bicarbonate (total CO2) 22 mmol/L, Anion gap 14 mmol/L, Urea nitrogen 18 mg/dL, Creatinine 2.49 mg/dL (H), eGFR (CKD-EPI 2021) 31 mL/min/1.73m2 (L), Glucose 103 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:19: BP 112/67, HR 90, RR 22, T 98.3 F, SpO2 99%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/6 13:55, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_lisinopril: home med lisinopril 40 mg tablet, 40 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_91/pn2",
  "kind": "Progress note",
  "when": "2024-09-08 07:50",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/8 06:17 (local time): Sodium 134 mmol/L (L), Potassium 4.0 mmol/L, Chloride 99 mmol/L, Bicarbonate (total CO2) 25 mmol/L, Anion gap 10 mmol/L, Urea nitrogen 35 mg/dL (H), Creatinine 2.28 mg/dL (H), eGFR (CKD-EPI 2021) 34 mL/min/1.73m2 (L), Glucose 168 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:30: BP 136/82, HR 111, RR 22, T 98.9 F, SpO2 99%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/6 13:55, stopped 9/7 17:28 (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_lisinopril: home med lisinopril 40 mg tablet, 40 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_91/pn3",
  "kind": "Progress note",
  "when": "2024-09-09 07:47",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/9 06:09 (local time): Sodium 137 mmol/L, Potassium 3.9 mmol/L, Chloride 104 mmol/L, Bicarbonate (total CO2) 23 mmol/L, Anion gap 10 mmol/L, Urea nitrogen 24 mg/dL (H), Creatinine 2.07 mg/dL (H), eGFR (CKD-EPI 2021) 38 mL/min/1.73m2 (L), Glucose 162 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:27: BP 123/74, HR 86, RR 16, T 98.3 F, SpO2 99%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 9/6 13:55, stopped 9/7 17:28 (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_lisinopril: home med lisinopril 40 mg tablet, 40 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_91/dc",
  "kind": "Discharge summary",
  "when": "2024-09-06 17:28",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "250-400 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status resolved"
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: continue"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 11:30: BP 136/82, HR 82, RR 21, T 98.7 F, SpO2 95%",
   "bmp_dc: Basic metabolic panel drawn 9/10 06:24 (local time): Sodium 137 mmol/L, Potassium 3.9 mmol/L, Chloride 102 mmol/L, Bicarbonate (total CO2) 25 mmol/L, Anion gap 10 mmol/L, Urea nitrogen 22 mg/dL, Creatinine 1.86 mg/dL (H), eGFR (CKD-EPI 2021) 44 mL/min/1.73m2 (L), Glucose 106 mg/dL (H)",
   "alg_nkda: allergy list: NKDA",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: continue",
   "med_lisinopril: home med lisinopril 40 mg tablet, 40 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: continue",
   "fu_pcp: follow-up with Primary care (Northgate Family Medicine) within 1 week: Recheck symptoms and chest exam"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_149/ed",
  "kind": "ED provider note",
  "when": "2025-10-10 20:12",
  "author": "Adaeze Okonjo, MD (Emergency physician)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_acs",
    "about": "diagnosis \"Chest pain, acute coronary syndrome ruled out\", status ruled_out"
   },
   {
    "id": "trop_1",
    "about": "Troponin I <0.01 ng/mL, drawn 10/10 20:36 (local time)"
   },
   {
    "id": "trop_2",
    "about": "Troponin I <0.01 ng/mL, drawn 10/10 23:36 (local time)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "Acute coronary syndrome ruled out: two troponins <0.01 three hours apart and an ECG without ischemic changes."
  ],
  "context": [
   "vs_1: vitals at 20:18: BP 165/99, HR 79, RR 24, T 98.1 F, SpO2 97%",
   "bmp: Basic metabolic panel drawn 10/10 20:36 (local time): Sodium 140 mmol/L, Potassium 4.1 mmol/L, Chloride 105 mmol/L, Bicarbonate (total CO2) 23 mmol/L, Anion gap 12 mmol/L, Urea nitrogen 16 mg/dL, Creatinine 1.66 mg/dL (H), eGFR (CKD-EPI 2021) 50 mL/min/1.73m2 (L), Glucose 113 mg/dL (H)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: not_reconciled",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: not_reconciled",
   "med_lisinopril: home med lisinopril 40 mg tablet, 40 mg 1 tab PO daily: not_reconciled",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: not_reconciled",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
