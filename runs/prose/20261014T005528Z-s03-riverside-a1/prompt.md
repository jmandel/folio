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

## Requests (5)

```json
[
 {
  "key": "A/e_89/hp",
  "kind": "Admission history and physical",
  "when": "2024-12-08 20:41",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "med_hydrochlorothiazide",
    "about": "home med hydrochlorothiazide 25 mg tablet, 25 mg 1 tab PO daily: held (prescriber_decides) \"Hold for volume depletion\""
   },
   {
    "id": "med_furosemide",
    "about": "home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held (prescriber_decides) \"Hold for volume depletion\""
   },
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
    "about": "home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held (resume_when_able) \"Hold until creatinine back to baseline\""
   },
   {
    "id": "med_spironolactone",
    "about": "home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: held (resume_when_able) \"Hold until creatinine back to baseline\""
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held (resume_when_able) \"Hold during acute illness\""
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
   "vs_1: vitals at 20:31: BP 124/74, HR 100, RR 24, T 98.7 F, SpO2 96%",
   "bmp: Basic metabolic panel drawn 12/8 14:20 (local time): Sodium 130 mmol/L (L), Potassium 6.4 mmol/L (HH), Chloride 104 mmol/L, Bicarbonate (total CO2) 16 mmol/L (L), Anion gap 10 mmol/L, Urea nitrogen 48 mg/dL (H), Creatinine 1.67 mg/dL (H), eGFR (CKD-EPI 2021) 43 mL/min/1.73m2 (L), Glucose 210 mg/dL (H)",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 12/8 14:45, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_atorvastatin: home med atorvastatin 40 mg tablet, 40 mg 1 tab PO nightly: continue"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_89/ed",
  "kind": "ED provider note",
  "when": "2024-12-08 13:55",
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
    "about": "Basic metabolic panel drawn 12/8 14:20 (local time): Sodium 130 mmol/L (L), Potassium 6.4 mmol/L (HH), Chloride 104 mmol/L, Bicarbonate (total CO2) 16 mmol/L (L), Anion gap 10 mmol/L, Urea nitrogen 48 mg/dL (H), Creatinine 1.67 mg/dL (H), eGFR (CKD-EPI 2021) 43 mL/min/1.73m2 (L), Glucose 210 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 14:01: BP 126/76, HR 109, RR 17, T 98.2 F, SpO2 94%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 12/8 14:45, still running (local times)",
   "iv_calcium_gluconate: inpatient order calcium gluconate IV IV 1 g once, started 12/8 14:35, stopped 12/8 14:45 (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: not_reconciled",
   "med_losartan: home med losartan 100 mg tablet, 100 mg 1 tab PO daily: not_reconciled",
   "med_hydrochlorothiazide: home med hydrochlorothiazide 25 mg tablet, 25 mg 1 tab PO daily: not_reconciled",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: not_reconciled",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: not_reconciled",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: not_reconciled",
   "med_atorvastatin: home med atorvastatin 40 mg tablet, 40 mg 1 tab PO nightly: not_reconciled"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_89/pn1",
  "kind": "Progress note",
  "when": "2024-12-09 07:32",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_aki",
    "about": "diagnosis \"Acute kidney injury\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 12/9 06:13 (local time): Sodium 136 mmol/L, Potassium 5.8 mmol/L (H), Chloride 103 mmol/L, Bicarbonate (total CO2) 25 mmol/L, Anion gap 8 mmol/L, Urea nitrogen 23 mg/dL, Creatinine 1.44 mg/dL (H), eGFR (CKD-EPI 2021) 52 mL/min/1.73m2 (L), Glucose 168 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:12: BP 115/69, HR 112, RR 22, T 98.6 F, SpO2 96%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 12/8 14:45, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held",
   "med_losartan: home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held",
   "med_hydrochlorothiazide: home med hydrochlorothiazide 25 mg tablet, 25 mg 1 tab PO daily: held",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: held",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held",
   "med_atorvastatin: home med atorvastatin 40 mg tablet, 40 mg 1 tab PO nightly: continue"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_89/pn2",
  "kind": "Progress note",
  "when": "2024-12-10 07:37",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_aki",
    "about": "diagnosis \"Acute kidney injury\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 12/10 06:19 (local time): Sodium 138 mmol/L, Potassium 5.4 mmol/L (H), Chloride 100 mmol/L, Bicarbonate (total CO2) 25 mmol/L, Anion gap 13 mmol/L, Urea nitrogen 21 mg/dL, Creatinine 1.20 mg/dL, eGFR (CKD-EPI 2021) 65 mL/min/1.73m2, Glucose 149 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:17: BP 121/73, HR 87, RR 22, T 98.2 F, SpO2 94%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 12/8 14:45, stopped 12/9 19:30 (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held",
   "med_losartan: home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held",
   "med_hydrochlorothiazide: home med hydrochlorothiazide 25 mg tablet, 25 mg 1 tab PO daily: held",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_spironolactone: home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: held",
   "med_furosemide: home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held",
   "med_atorvastatin: home med atorvastatin 40 mg tablet, 40 mg 1 tab PO nightly: continue"
  ],
  "forbidden": [],
  "sensitive": []
 },
 {
  "key": "A/e_89/dc",
  "kind": "Discharge summary",
  "when": "2024-12-08 19:30",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "250-400 words",
  "refs": [
   {
    "id": "med_hydrochlorothiazide",
    "about": "home med hydrochlorothiazide 25 mg tablet, 25 mg 1 tab PO daily: held (prescriber_decides) \"PCP to decide after a repeat BMP\""
   },
   {
    "id": "med_furosemide",
    "about": "home med furosemide 40 mg tablet, 40 mg 1 tab PO daily: held (prescriber_decides) \"PCP to decide after a repeat BMP\""
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held (prescriber_decides) \"PCP to decide on restarting after a repeat BMP\""
   },
   {
    "id": "med_spironolactone",
    "about": "home med spironolactone 25 mg tablet, 25 mg 1 tab PO daily: stopped"
   },
   {
    "id": "dx_aki",
    "about": "diagnosis \"Acute kidney injury\", status resolved"
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: continue"
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
   "vs_1: vitals at 11:30: BP 121/73, HR 85, RR 17, T 98.7 F, SpO2 94%",
   "bmp_dc: Basic metabolic panel drawn 12/11 06:20 (local time): Sodium 136 mmol/L, Potassium 5.0 mmol/L, Chloride 99 mmol/L, Bicarbonate (total CO2) 25 mmol/L, Anion gap 12 mmol/L, Urea nitrogen 34 mg/dL (H), Creatinine 0.96 mg/dL, eGFR (CKD-EPI 2021) 85 mL/min/1.73m2, Glucose 144 mg/dL (H)",
   "alg_nkda: allergy list: NKDA",
   "med_carvedilol: home med carvedilol 12.5 mg tablet, 12.5 mg 1 tab PO BID: continue",
   "med_atorvastatin: home med atorvastatin 40 mg tablet, 40 mg 1 tab PO nightly: continue",
   "fu_pcp: follow-up with Primary care (Northgate Family Medicine) within 1 week: Repeat BMP; decide on restarting held blood pressure medicines"
  ],
  "forbidden": [],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
