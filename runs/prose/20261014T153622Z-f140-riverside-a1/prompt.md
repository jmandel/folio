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

## Requests (9)

```json
[
 {
  "key": "A/e_96/hp",
  "kind": "Admission history and physical",
  "when": "2023-02-21 19:08",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "med_dapagliflozin",
    "about": "home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held"
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held (resume_when_able) \"Hold while acidotic and NPO\""
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held (resume_when_able) \"Hold for volume depletion and potassium; resume when eating\""
   }
  ],
  "spans": [
   {
    "id": "precipitant",
    "statement": "The ketoacidosis was precipitated by a viral gastroenteritis with vomiting and almost no oral intake for several days."
   }
  ],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 18:58: BP 117/70, HR 112, RR 17, T 98.1 F, SpO2 94%",
   "bmp: Basic metabolic panel drawn 2/21 13:41 (local time): Sodium 134 mmol/L (L), Potassium 5.5 mmol/L (H), Chloride 95 mmol/L (L), Bicarbonate (total CO2) 8 mmol/L (LL), Anion gap 31 mmol/L (H), Urea nitrogen 40 mg/dL (H), Creatinine 1.17 mg/dL (H), eGFR (CKD-EPI 2021) 47 mL/min/1.73m2 (L), Glucose 219 mg/dL (H)",
   "iv_insulin: inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 2/21 14:22, still running (local times)",
   "iv_d5lr: inpatient order dextrose 5% in lactated Ringer's IV 150 mL/h, started 2/21 14:22, still running (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_96/ed",
  "kind": "ED provider note",
  "when": "2023-02-21 13:12",
  "author": "Adaeze Okonjo, MD (Emergency physician)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Diabetic ketoacidosis, euglycemic\", status active"
   },
   {
    "id": "med_dapagliflozin",
    "about": "home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: not_reconciled"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 2/21 13:41 (local time): Sodium 134 mmol/L (L), Potassium 5.5 mmol/L (H), Chloride 95 mmol/L (L), Bicarbonate (total CO2) 8 mmol/L (LL), Anion gap 31 mmol/L (H), Urea nitrogen 40 mg/dL (H), Creatinine 1.17 mg/dL (H), eGFR (CKD-EPI 2021) 47 mL/min/1.73m2 (L), Glucose 219 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 13:18: BP 109/65, HR 83, RR 18, T 99 F, SpO2 94%",
   "vbg: Venous blood gas drawn 2/21 13:41 (local time): pH, venous 7.17 (LL), pCO2, venous 26 mmHg (L)",
   "bhb: Beta-hydroxybutyrate 6.9 mmol/L, drawn 2/21 13:41 (local time)",
   "iv_insulin: inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 2/21 14:22, still running (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: not_reconciled",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-02-21 (pattern /\\b(glargine|Lantus)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_96/pn1",
  "kind": "Progress note",
  "when": "2023-02-22 07:56",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 2/22 06:06 (local time): Sodium 132 mmol/L (L), Potassium 4.4 mmol/L, Chloride 98 mmol/L, Bicarbonate (total CO2) 20 mmol/L (L), Anion gap 14 mmol/L, Urea nitrogen 23 mg/dL, Creatinine 1.09 mg/dL (H), eGFR (CKD-EPI 2021) 51 mL/min/1.73m2 (L), Glucose 172 mg/dL (H)"
   },
   {
    "id": "sc_glargine",
    "about": "inpatient order insulin glargine SubQ 13 units daily, started 2/22 07:00, still running (local times)"
   },
   {
    "id": "iv_insulin",
    "about": "inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 2/21 14:22, still running (local times)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:36: BP 112/67, HR 96, RR 20, T 98.5 F, SpO2 96%",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_dapagliflozin: home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_96/dc",
  "kind": "Discharge summary",
  "when": "2023-02-21 18:00",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "250-400 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status resolved"
   },
   {
    "id": "med_dapagliflozin",
    "about": "home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held (advise_against) \"Do not resume until reviewed by PCP\""
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: continue"
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 50 mg tablet, 50 mg 1 tab PO daily: continue"
   }
  ],
  "spans": [
   {
    "id": "precipitant",
    "statement": "The ketoacidosis was precipitated by a viral gastroenteritis with vomiting and almost no oral intake for several days."
   }
  ],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 08:45: BP 128/77, HR 81, RR 17, T 99.1 F, SpO2 98%",
   "bmp_dc: Basic metabolic panel drawn 2/23 06:15 (local time): Sodium 134 mmol/L (L), Potassium 4.3 mmol/L, Chloride 103 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 10 mmol/L, Urea nitrogen 19 mg/dL, Creatinine 1.07 mg/dL (H), eGFR (CKD-EPI 2021) 53 mL/min/1.73m2 (L), Glucose 179 mg/dL (H)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "fu_pcp: follow-up with Primary care (Northgate Family Medicine) within 1 week: Decide whether to restart dapagliflozin; recheck basic metabolic panel"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_141/hp",
  "kind": "Admission history and physical",
  "when": "2025-01-15 20:48",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_aki",
    "about": "diagnosis \"Acute kidney injury\", status active"
   },
   {
    "id": "dx_hyperk",
    "about": "diagnosis \"Hyperkalemia\", status active"
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held (resume_when_able) \"Hold until creatinine back to baseline\""
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held (resume_when_able) \"Hold during acute illness\""
   }
  ],
  "spans": [
   {
    "id": "precipitant",
    "statement": "AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic."
   }
  ],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 20:38: BP 117/70, HR 106, RR 24, T 98.1 F, SpO2 96%",
   "bmp: Basic metabolic panel drawn 1/15 16:02 (local time): Sodium 135 mmol/L (L), Potassium 6.2 mmol/L (HH), Chloride 99 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 15 mmol/L, Urea nitrogen 32 mg/dL (H), Creatinine 2.46 mg/dL (H), eGFR (CKD-EPI 2021) 19 mL/min/1.73m2 (L), Glucose 181 mg/dL (H)",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 1/15 16:24, still running (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "alg_dapagliflozin: allergy list: dapagliflozin (diabetic ketoacidosis)"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_141/ed",
  "kind": "ED provider note",
  "when": "2025-01-15 15:34",
  "author": "Marcus Hale, MD (Emergency physician)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_aki",
    "about": "diagnosis \"Acute kidney injury\", status active"
   },
   {
    "id": "dx_hyperk",
    "about": "diagnosis \"Hyperkalemia\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 1/15 16:02 (local time): Sodium 135 mmol/L (L), Potassium 6.2 mmol/L (HH), Chloride 99 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 15 mmol/L, Urea nitrogen 32 mg/dL (H), Creatinine 2.46 mg/dL (H), eGFR (CKD-EPI 2021) 19 mL/min/1.73m2 (L), Glucose 181 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 15:40: BP 144/86, HR 83, RR 21, T 98.2 F, SpO2 97%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 1/15 16:24, still running (local times)",
   "iv_calcium_gluconate: inpatient order calcium gluconate IV IV 1 g once, started 1/15 16:14, stopped 1/15 16:24 (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "alg_dapagliflozin: allergy list: dapagliflozin (diabetic ketoacidosis)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: not_reconciled",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_141/pn1",
  "kind": "Progress note",
  "when": "2025-01-16 07:39",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_aki",
    "about": "diagnosis \"Acute kidney injury\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 1/16 06:24 (local time): Sodium 137 mmol/L, Potassium 5.8 mmol/L (H), Chloride 103 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 13 mmol/L, Urea nitrogen 19 mg/dL, Creatinine 2.01 mg/dL (H), eGFR (CKD-EPI 2021) 24 mL/min/1.73m2 (L), Glucose 125 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:19: BP 114/68, HR 104, RR 20, T 98.9 F, SpO2 97%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 1/15 16:24, still running (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "alg_dapagliflozin: allergy list: dapagliflozin (diabetic ketoacidosis)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_141/pn2",
  "kind": "Progress note",
  "when": "2025-01-17 07:39",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_aki",
    "about": "diagnosis \"Acute kidney injury\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 1/17 06:24 (local time): Sodium 134 mmol/L (L), Potassium 5.3 mmol/L (H), Chloride 105 mmol/L, Bicarbonate (total CO2) 22 mmol/L, Anion gap 7 mmol/L, Urea nitrogen 31 mg/dL (H), Creatinine 1.55 mg/dL (H), eGFR (CKD-EPI 2021) 33 mL/min/1.73m2 (L), Glucose 138 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:19: BP 140/84, HR 111, RR 16, T 98.8 F, SpO2 94%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 1/15 16:24, stopped 1/16 19:55 (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "alg_dapagliflozin: allergy list: dapagliflozin (diabetic ketoacidosis)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_141/dc",
  "kind": "Discharge summary",
  "when": "2025-01-15 19:55",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "250-400 words",
  "refs": [
   {
    "id": "med_losartan",
    "about": "home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held (prescriber_decides) \"PCP to decide on restarting after a repeat BMP\""
   },
   {
    "id": "dx_aki",
    "about": "diagnosis \"Acute kidney injury\", status resolved"
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: continue"
   }
  ],
  "spans": [
   {
    "id": "precipitant",
    "statement": "AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic."
   }
  ],
  "mustInclude": [],
  "context": [
   "dx_hyperk: diagnosis \"Hyperkalemia\", status resolved",
   "vs_1: vitals at 12:45: BP 137/82, HR 87, RR 23, T 98.1 F, SpO2 99%",
   "bmp_dc: Basic metabolic panel drawn 1/18 06:24 (local time): Sodium 138 mmol/L, Potassium 4.9 mmol/L, Chloride 105 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 12 mmol/L, Urea nitrogen 27 mg/dL (H), Creatinine 1.10 mg/dL (H), eGFR (CKD-EPI 2021) 50 mL/min/1.73m2 (L), Glucose 153 mg/dL (H)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "alg_dapagliflozin: allergy list: dapagliflozin (diabetic ketoacidosis)",
   "fu_pcp: follow-up with Primary care (Northgate Family Medicine) within 1 week: Repeat BMP; decide on restarting held blood pressure medicines"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
