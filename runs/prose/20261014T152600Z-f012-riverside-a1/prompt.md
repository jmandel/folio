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
  "key": "A/e_86/hp",
  "kind": "Admission history and physical",
  "when": "2024-10-08 21:01",
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
    "id": "med_lisinopril",
    "about": "home med lisinopril 20 mg tablet, 20 mg 1 tab PO daily: held (resume_when_able) \"Hold until creatinine back to baseline\""
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held (resume_when_able) \"Hold during acute illness\""
   },
   {
    "id": "med_dapagliflozin",
    "about": "home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held (resume_when_able) \"Hold while not eating\""
   }
  ],
  "spans": [
   {
    "id": "precipitant",
    "statement": "AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake."
   }
  ],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 20:51: BP 119/71, HR 91, RR 16, T 99.1 F, SpO2 98%",
   "bmp: Basic metabolic panel drawn 10/8 17:20 (local time): Sodium 129 mmol/L (L), Potassium 6.4 mmol/L (HH), Chloride 99 mmol/L, Bicarbonate (total CO2) 19 mmol/L (L), Anion gap 11 mmol/L, Urea nitrogen 47 mg/dL (H), Creatinine 3.19 mg/dL (H), eGFR (CKD-EPI 2021) 15 mL/min/1.73m2 (L), Glucose 183 mg/dL (H)",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 10/8 17:55, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_atorvastatin: home med atorvastatin 20 mg tablet, 20 mg 1 tab PO nightly: continue",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-10-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "carvedilol: not started by 2024-10-08 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_86/ed",
  "kind": "ED provider note",
  "when": "2024-10-08 17:05",
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
    "about": "Basic metabolic panel drawn 10/8 17:20 (local time): Sodium 129 mmol/L (L), Potassium 6.4 mmol/L (HH), Chloride 99 mmol/L, Bicarbonate (total CO2) 19 mmol/L (L), Anion gap 11 mmol/L, Urea nitrogen 47 mg/dL (H), Creatinine 3.19 mg/dL (H), eGFR (CKD-EPI 2021) 15 mL/min/1.73m2 (L), Glucose 183 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 17:11: BP 119/71, HR 103, RR 24, T 99.2 F, SpO2 94%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 10/8 17:55, still running (local times)",
   "iv_calcium_gluconate: inpatient order calcium gluconate IV IV 1 g once, started 10/8 17:45, stopped 10/8 17:55 (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: not_reconciled",
   "med_dapagliflozin: home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: not_reconciled",
   "med_lisinopril: home med lisinopril 20 mg tablet, 20 mg 1 tab PO daily: not_reconciled",
   "med_atorvastatin: home med atorvastatin 20 mg tablet, 20 mg 1 tab PO nightly: not_reconciled",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-10-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "carvedilol: not started by 2024-10-08 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_86/pn1",
  "kind": "Progress note",
  "when": "2024-10-09 07:49",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_aki",
    "about": "diagnosis \"Acute kidney injury\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 10/9 06:15 (local time): Sodium 133 mmol/L (L), Potassium 5.7 mmol/L (H), Chloride 100 mmol/L, Bicarbonate (total CO2) 23 mmol/L, Anion gap 10 mmol/L, Urea nitrogen 24 mg/dL (H), Creatinine 2.50 mg/dL (H), eGFR (CKD-EPI 2021) 21 mL/min/1.73m2 (L), Glucose 161 mg/dL (H)"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:29: BP 119/71, HR 80, RR 22, T 98.6 F, SpO2 94%",
   "iv_ns: inpatient order sodium chloride 0.9% IV 1000 mL bolus, then 125 mL/h, started 10/8 17:55, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held",
   "med_dapagliflozin: home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_lisinopril: home med lisinopril 20 mg tablet, 20 mg 1 tab PO daily: held",
   "med_atorvastatin: home med atorvastatin 20 mg tablet, 20 mg 1 tab PO nightly: continue",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-10-09 (pattern /\\b(glargine|Lantus)\\b/i)",
   "carvedilol: not started by 2024-10-09 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_86/dc",
  "kind": "Discharge summary",
  "when": "2024-10-08 20:06",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "250-400 words",
  "refs": [
   {
    "id": "med_lisinopril",
    "about": "home med lisinopril 20 mg tablet, 20 mg 1 tab PO daily: held (prescriber_decides) \"PCP to decide on restarting after a repeat BMP\""
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
    "statement": "AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake."
   }
  ],
  "mustInclude": [],
  "context": [
   "dx_hyperk: diagnosis \"Hyperkalemia\", status resolved",
   "vs_1: vitals at 12:15: BP 121/73, HR 109, RR 23, T 99 F, SpO2 97%",
   "bmp_dc: Basic metabolic panel drawn 10/10 06:00 (local time): Sodium 138 mmol/L, Potassium 5.1 mmol/L, Chloride 99 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 18 mmol/L (H), Urea nitrogen 18 mg/dL, Creatinine 1.82 mg/dL (H), eGFR (CKD-EPI 2021) 30 mL/min/1.73m2 (L), Glucose 117 mg/dL (H)",
   "alg_nkda: allergy list: NKDA",
   "med_dapagliflozin: home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: continue",
   "med_atorvastatin: home med atorvastatin 20 mg tablet, 20 mg 1 tab PO nightly: continue",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: continue",
   "fu_pcp: follow-up with Primary care (Northgate Family Medicine) within 1 week: Repeat BMP; decide on restarting held blood pressure medicines"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-10-10 (pattern /\\b(glargine|Lantus)\\b/i)",
   "carvedilol: not started by 2024-10-10 (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_125/ed",
  "kind": "ED provider note",
  "when": "2026-05-29 13:41",
  "author": "Adaeze Okonjo, MD (Emergency physician)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_acs",
    "about": "diagnosis \"Chest pain, acute coronary syndrome ruled out\", status ruled_out"
   },
   {
    "id": "trop_1",
    "about": "Troponin I <0.01 ng/mL, drawn 5/29 13:59 (local time)"
   },
   {
    "id": "trop_2",
    "about": "Troponin I <0.01 ng/mL, drawn 5/29 16:59 (local time)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "Acute coronary syndrome ruled out: two troponins <0.01 three hours apart and an ECG without ischemic changes."
  ],
  "context": [
   "vs_1: vitals at 13:47: BP 141/85, HR 102, RR 23, T 98.6 F, SpO2 96%",
   "bmp: Basic metabolic panel drawn 5/29 13:59 (local time): Sodium 137 mmol/L, Potassium 4.3 mmol/L, Chloride 105 mmol/L, Bicarbonate (total CO2) 28 mmol/L, Anion gap 4 mmol/L (L), Urea nitrogen 22 mg/dL, Creatinine 1.70 mg/dL (H), eGFR (CKD-EPI 2021) 32 mL/min/1.73m2 (L), Glucose 120 mg/dL (H)",
   "alg_nkda: allergy list: NKDA",
   "med_metformin: home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: not_reconciled",
   "med_dapagliflozin: home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: not_reconciled",
   "med_glargine: home med insulin glargine 100 units/mL pen, 10 units 10 units SubQ nightly: not_reconciled",
   "med_atorvastatin: home med atorvastatin 20 mg tablet, 20 mg 1 tab PO nightly: not_reconciled",
   "med_sertraline: home med sertraline 50 mg tablet, 50 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_8 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "carvedilol: unknown to this source (pattern /\\b(carvedilol|Coreg)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
