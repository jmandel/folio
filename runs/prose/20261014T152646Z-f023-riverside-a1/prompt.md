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
  "key": "A/e_32/ed",
  "kind": "ED provider note",
  "when": "2026-03-10 20:34",
  "author": "Erik Lindqvist, DO (Emergency physician)",
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
    "about": "Basic metabolic panel drawn 3/10 20:55 (local time): Sodium 132 mmol/L (L), Potassium 4.9 mmol/L, Chloride 100 mmol/L, Bicarbonate (total CO2) 14 mmol/L (L), Anion gap 18 mmol/L (H), Urea nitrogen 35 mg/dL (H), Creatinine 1.14 mg/dL (H), eGFR (CKD-EPI 2021) 58 mL/min/1.73m2 (L), Glucose 159 mg/dL (H)"
   },
   {
    "id": "dx_pancreatitis",
    "about": "diagnosis \"R/O pancreatitis\", status working"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 20:40: BP 117/70, HR 94, RR 20, T 98.1 F, SpO2 96%",
   "vbg: Venous blood gas drawn 3/10 20:55 (local time): pH, venous 7.16 (LL), pCO2, venous 23 mmHg (L)",
   "bhb: Beta-hydroxybutyrate 4.9 mmol/L, drawn 3/10 20:55 (local time)",
   "iv_insulin: inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 3/10 21:44, still running (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: not_reconciled",
   "med_glipizide: home med glipizide 5 mg tablet, 5 mg 1 tab PO daily: not_reconciled",
   "med_dulaglutide: home med dulaglutide pen, 0.5 mg 0.5 mg SubQ weekly: not_reconciled",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: not_reconciled",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: not_reconciled",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: not_reconciled",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: not_reconciled",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: not_reconciled",
   "med_rosuvastatin: home med rosuvastatin 20 mg tablet, 20 mg 1 tab PO nightly: not_reconciled"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_32/hp",
  "kind": "Admission history and physical",
  "when": "2026-03-11 01:30",
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
    "about": "home med losartan 50 mg tablet, 50 mg 1 tab PO daily: continue"
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
   "vs_1: vitals at 01:20: BP 120/72, HR 92, RR 23, T 98.4 F, SpO2 94%",
   "lipase: Lipase 53 U/L, drawn 3/10 20:55 (local time)",
   "bmp: Basic metabolic panel drawn 3/10 20:55 (local time): Sodium 132 mmol/L (L), Potassium 4.9 mmol/L, Chloride 100 mmol/L, Bicarbonate (total CO2) 14 mmol/L (L), Anion gap 18 mmol/L (H), Urea nitrogen 35 mg/dL (H), Creatinine 1.14 mg/dL (H), eGFR (CKD-EPI 2021) 58 mL/min/1.73m2 (L), Glucose 159 mg/dL (H)",
   "iv_insulin: inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 3/10 21:44, still running (local times)",
   "iv_d5lr: inpatient order dextrose 5% in lactated Ringer's IV 150 mL/h, started 3/10 21:44, still running (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_glipizide: home med glipizide 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_dulaglutide: home med dulaglutide pen, 0.5 mg 0.5 mg SubQ weekly: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "med_rosuvastatin: home med rosuvastatin 20 mg tablet, 20 mg 1 tab PO nightly: continue"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_32/consult",
  "kind": "Consult note",
  "when": "2026-03-12 11:22",
  "author": "Elena Vasquez, MD (Endocrinologist)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "med_empagliflozin",
    "about": "home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held (advise_against) \"Recommend against restarting at discharge\""
   },
   {
    "id": "sc_glargine",
    "about": "inpatient order insulin glargine SubQ 16 units daily, started 3/12 07:00, still running (local times)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first."
  ],
  "context": [
   "bhb_1: Beta-hydroxybutyrate 4.9 mmol/L, drawn 3/10 20:55 (local time)",
   "iv_insulin: inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 3/10 21:44, stopped 3/12 09:00 (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_glipizide: home med glipizide 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_dulaglutide: home med dulaglutide pen, 0.5 mg 0.5 mg SubQ weekly: continue",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held",
   "med_rosuvastatin: home med rosuvastatin 20 mg tablet, 20 mg 1 tab PO nightly: continue"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_32/pn1",
  "kind": "Progress note",
  "when": "2026-03-12 07:49",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 3/12 06:03 (local time): Sodium 137 mmol/L, Potassium 4.5 mmol/L, Chloride 100 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 16 mmol/L, Urea nitrogen 14 mg/dL, Creatinine 1.02 mg/dL (H), eGFR (CKD-EPI 2021) 67 mL/min/1.73m2, Glucose 135 mg/dL (H)"
   },
   {
    "id": "sc_glargine",
    "about": "inpatient order insulin glargine SubQ 16 units daily, started 3/12 07:00, still running (local times)"
   },
   {
    "id": "iv_insulin",
    "about": "inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 3/10 21:44, stopped 3/12 09:00 (local times)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:29: BP 135/81, HR 110, RR 18, T 98.6 F, SpO2 95%",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_glipizide: home med glipizide 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_dulaglutide: home med dulaglutide pen, 0.5 mg 0.5 mg SubQ weekly: continue",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held",
   "med_rosuvastatin: home med rosuvastatin 20 mg tablet, 20 mg 1 tab PO nightly: continue"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_32/pn2",
  "kind": "Progress note",
  "when": "2026-03-13 07:53",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_dka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 3/13 06:12 (local time): Sodium 137 mmol/L, Potassium 4.0 mmol/L, Chloride 102 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 14 mmol/L, Urea nitrogen 20 mg/dL, Creatinine 1.00 mg/dL, eGFR (CKD-EPI 2021) 68 mL/min/1.73m2, Glucose 173 mg/dL (H)"
   },
   {
    "id": "sc_glargine",
    "about": "inpatient order insulin glargine SubQ 16 units daily, started 3/12 07:00, still running (local times)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:33: BP 125/75, HR 109, RR 21, T 98.8 F, SpO2 96%",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_empagliflozin: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_glipizide: home med glipizide 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_dulaglutide: home med dulaglutide pen, 0.5 mg 0.5 mg SubQ weekly: continue",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held",
   "med_rosuvastatin: home med rosuvastatin 20 mg tablet, 20 mg 1 tab PO nightly: continue"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_32/dc",
  "kind": "Discharge summary",
  "when": "2026-03-11 00:18",
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
    "id": "dx_pancreatitis",
    "about": "diagnosis \"Acute pancreatitis\", status ruled_out"
   }
  ],
  "spans": [],
  "mustInclude": [
   "No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery."
  ],
  "context": [
   "vs_1: vitals at 10:45: BP 118/71, HR 98, RR 20, T 99 F, SpO2 95%",
   "bmp_dc: Basic metabolic panel drawn 3/14 06:28 (local time): Sodium 137 mmol/L, Potassium 4.5 mmol/L, Chloride 102 mmol/L, Bicarbonate (total CO2) 20 mmol/L (L), Anion gap 15 mmol/L, Urea nitrogen 22 mg/dL, Creatinine 1.01 mg/dL (H), eGFR (CKD-EPI 2021) 67 mL/min/1.73m2, Glucose 163 mg/dL (H)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_glipizide: home med glipizide 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_dulaglutide: home med dulaglutide pen, 0.5 mg 0.5 mg SubQ weekly: continue",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "med_rosuvastatin: home med rosuvastatin 20 mg tablet, 20 mg 1 tab PO nightly: continue",
   "fu_pcp: follow-up with Primary care (Northgate Family Medicine) within 1 week: Decide whether to restart empagliflozin; recheck basic metabolic panel"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
