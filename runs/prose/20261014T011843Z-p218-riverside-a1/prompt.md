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
  "key": "A/e_39/ed",
  "kind": "ED provider note",
  "when": "2024-09-03 18:48",
  "author": "Adaeze Okonjo, MD (Emergency physician)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Diabetic ketoacidosis, euglycemic\", status active"
   },
   {
    "id": "med_empagliflozin",
    "about": "home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: not_reconciled"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/3 19:11 (local time): Sodium 128 mmol/L (L), Potassium 5.6 mmol/L (H), Chloride 92 mmol/L (L), Bicarbonate (total CO2) 14 mmol/L (L), Anion gap 22 mmol/L (H), Urea nitrogen 39 mg/dL (H), Creatinine 0.85 mg/dL, eGFR (CKD-EPI 2021) 75 mL/min/1.73m2, Glucose 186 mg/dL (H)"
   },
   {
    "id": "dx_pancreatitis",
    "about": "diagnosis \"R/O pancreatitis\", status working"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 18:54: BP 107/64, HR 85, RR 23, T 98.7 F, SpO2 97%",
   "vbg: Venous blood gas drawn 9/3 19:11 (local time): pH, venous 7.09 (LL), pCO2, venous 29 mmHg (L)",
   "bhb: Beta-hydroxybutyrate 4.4 mmol/L, drawn 9/3 19:11 (local time)",
   "iv_insulin: inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 9/3 19:58, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: not_reconciled",
   "med_losartan: home med losartan 100 mg tablet, 100 mg 1 tab PO daily: not_reconciled",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: not_reconciled",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: not_reconciled",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_39/hp",
  "kind": "Admission history and physical",
  "when": "2024-09-04 00:29",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "med_furosemide",
    "about": "home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held (resume_when_able) \"Hold for volume depletion\""
   },
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "med_empagliflozin",
    "about": "home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held"
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held (resume_when_able) \"Hold while acidotic and NPO\""
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held (resume_when_able) \"Hold for volume depletion and potassium; resume when eating\""
   },
   {
    "id": "dx_pancreatitis",
    "about": "diagnosis \"Acute pancreatitis\", status ruled_out"
   }
  ],
  "spans": [],
  "mustInclude": [
   "No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery."
  ],
  "context": [
   "vs_1: vitals at 00:19: BP 127/76, HR 81, RR 16, T 99 F, SpO2 98%",
   "lipase: Lipase 30 U/L, drawn 9/3 19:11 (local time)",
   "bmp: Basic metabolic panel drawn 9/3 19:11 (local time): Sodium 128 mmol/L (L), Potassium 5.6 mmol/L (H), Chloride 92 mmol/L (L), Bicarbonate (total CO2) 14 mmol/L (L), Anion gap 22 mmol/L (H), Urea nitrogen 39 mg/dL (H), Creatinine 0.85 mg/dL, eGFR (CKD-EPI 2021) 75 mL/min/1.73m2, Glucose 186 mg/dL (H)",
   "iv_insulin: inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 9/3 19:58, still running (local times)",
   "iv_d5lr: inpatient order dextrose 5% in lactated Ringer's IV 150 mL/h, started 9/3 19:58, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_39/pn1",
  "kind": "Progress note",
  "when": "2024-09-04 07:54",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/4 06:28 (local time): Sodium 132 mmol/L (L), Potassium 4.0 mmol/L, Chloride 98 mmol/L, Bicarbonate (total CO2) 22 mmol/L, Anion gap 12 mmol/L, Urea nitrogen 16 mg/dL, Creatinine 0.84 mg/dL, eGFR (CKD-EPI 2021) 76 mL/min/1.73m2, Glucose 171 mg/dL (H)"
   },
   {
    "id": "sc_glargine",
    "about": "inpatient order insulin glargine SubQ 18 units daily, started 9/4 07:00, still running (local times)"
   },
   {
    "id": "iv_insulin",
    "about": "inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 9/3 19:58, stopped 9/4 09:00 (local times)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:34: BP 133/80, HR 112, RR 18, T 99 F, SpO2 96%",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_losartan: home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_39/pn2",
  "kind": "Progress note",
  "when": "2024-09-05 07:37",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/5 06:25 (local time): Sodium 131 mmol/L (L), Potassium 4.0 mmol/L, Chloride 98 mmol/L, Bicarbonate (total CO2) 24 mmol/L, Anion gap 9 mmol/L, Urea nitrogen 22 mg/dL, Creatinine 0.79 mg/dL, eGFR (CKD-EPI 2021) 81 mL/min/1.73m2, Glucose 124 mg/dL (H)"
   },
   {
    "id": "sc_glargine",
    "about": "inpatient order insulin glargine SubQ 18 units daily, started 9/4 07:00, still running (local times)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:17: BP 125/75, HR 98, RR 21, T 98.8 F, SpO2 94%",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_losartan: home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_39/pn3",
  "kind": "Progress note",
  "when": "2024-09-06 07:49",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 9/6 06:11 (local time): Sodium 132 mmol/L (L), Potassium 4.4 mmol/L, Chloride 104 mmol/L, Bicarbonate (total CO2) 19 mmol/L (L), Anion gap 9 mmol/L, Urea nitrogen 23 mg/dL, Creatinine 0.77 mg/dL, eGFR (CKD-EPI 2021) 84 mL/min/1.73m2, Glucose 126 mg/dL (H)"
   },
   {
    "id": "sc_glargine",
    "about": "inpatient order insulin glargine SubQ 18 units daily, started 9/4 07:00, still running (local times)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:29: BP 136/82, HR 95, RR 20, T 98.2 F, SpO2 98%",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_losartan: home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_39/dc",
  "kind": "Discharge summary",
  "when": "2024-09-03 23:37",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "250-400 words",
  "refs": [
   {
    "id": "med_furosemide",
    "about": "home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: continue"
   },
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status resolved"
   },
   {
    "id": "med_empagliflozin",
    "about": "home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held (advise_against) \"Do not resume until reviewed by PCP\""
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: continue"
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 100 mg tablet, 100 mg 1 tab PO daily: continue"
   },
   {
    "id": "dx_pancreatitis",
    "about": "diagnosis \"Acute pancreatitis\", status ruled_out"
   }
  ],
  "spans": [],
  "mustInclude": [
   "No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery."
  ],
  "context": [
   "vs_1: vitals at 11:30: BP 121/73, HR 98, RR 19, T 98.9 F, SpO2 96%",
   "bmp_dc: Basic metabolic panel drawn 9/7 06:02 (local time): Sodium 131 mmol/L (L), Potassium 4.2 mmol/L, Chloride 98 mmol/L, Bicarbonate (total CO2) 22 mmol/L, Anion gap 11 mmol/L, Urea nitrogen 18 mg/dL, Creatinine 0.80 mg/dL, eGFR (CKD-EPI 2021) 80 mL/min/1.73m2, Glucose 167 mg/dL (H)",
   "alg_nkda: allergy list: NKDA",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "fu_pcp: follow-up with Primary care (Northgate Family Medicine) within 1 week: Decide whether to restart empagliflozin; recheck basic metabolic panel"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_105/ed",
  "kind": "ED provider note",
  "when": "2025-12-03 14:05",
  "author": "Adaeze Okonjo, MD (Emergency physician)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_acs",
    "about": "diagnosis \"Chest pain, acute coronary syndrome ruled out\", status ruled_out"
   },
   {
    "id": "trop_1",
    "about": "Troponin I <0.01 ng/mL, drawn 12/3 14:25 (local time)"
   },
   {
    "id": "trop_2",
    "about": "Troponin I <0.01 ng/mL, drawn 12/3 17:25 (local time)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "Acute coronary syndrome ruled out: two troponins <0.01 three hours apart and an ECG without ischemic changes."
  ],
  "context": [
   "vs_1: vitals at 14:11: BP 154/92, HR 97, RR 22, T 98.7 F, SpO2 95%",
   "bmp: Basic metabolic panel drawn 12/3 14:25 (local time): Sodium 136 mmol/L, Potassium 4.4 mmol/L, Chloride 101 mmol/L, Bicarbonate (total CO2) 24 mmol/L, Anion gap 11 mmol/L, Urea nitrogen 19 mg/dL, Creatinine 0.73 mg/dL, eGFR (CKD-EPI 2021) 88 mL/min/1.73m2, Glucose 117 mg/dL (H)",
   "alg_empagliflozin: allergy list: empagliflozin (diabetic ketoacidosis)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: not_reconciled",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: not_reconciled",
   "med_losartan: home med losartan 100 mg tablet, 100 mg 1 tab PO daily: not_reconciled",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: not_reconciled",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: not_reconciled",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
