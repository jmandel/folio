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

## Requests (3)

```json
[
 {
  "key": "A/e_rrh_2024/pn1",
  "kind": "Progress note",
  "when": "2024-11-03 07:40",
  "author": "Priya Raman, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_edka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status active"
   },
   {
    "id": "bmp_am",
    "about": "Basic metabolic panel drawn 11/3 06:10 (local time): Sodium 131 mmol/L (L), Potassium 4.2 mmol/L, Chloride 99 mmol/L, Bicarbonate (total CO2) 21 mmol/L (L), Anion gap 11 mmol/L, Urea nitrogen 19 mg/dL, Creatinine 1.36 mg/dL (H), eGFR (CKD-EPI 2021) 45 mL/min/1.73m2 (L), Glucose 148 mg/dL (H)"
   },
   {
    "id": "bhb_pm",
    "about": "Beta-hydroxybutyrate 2.1 mmol/L, drawn 11/2 12:05 (local time)"
   },
   {
    "id": "sc_glargine",
    "about": "inpatient order insulin glargine SubQ 14 units daily, started 11/3 07:00, still running (local times)"
   },
   {
    "id": "iv_insulin",
    "about": "inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 11/1 23:05, still running (local times)"
   },
   {
    "id": "med_empa",
    "about": "home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held"
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:20: BP 118/70, HR 92, RR 18, T 98.4 F, SpO2 98%",
   "dx_na: diagnosis \"Hyponatremia\", status active",
   "iv_d5lr: inpatient order dextrose 5% in lactated Ringer's IV 150 mL/h, started 11/1 23:05, still running (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held",
   "med_chlorthalidone: home med chlorthalidone 25 mg tablet, 12.5 mg 1/2 tab PO daily: held",
   "med_atorvastatin: home med atorvastatin 40 mg tablet, 40 mg 1 tab PO nightly: continue",
   "med_sertraline: home med sertraline 100 mg tablet, 100 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "finerenone: not started by 2024-11-03 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2024-11-03 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_rrh_2024/pn2",
  "kind": "Progress note",
  "when": "2024-11-04 08:00",
  "author": "Priya Raman, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_edka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status resolved"
   },
   {
    "id": "dx_na",
    "about": "diagnosis \"Hyponatremia\", status active"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 11/4 06:00 (local time): Sodium 132 mmol/L (L), Potassium 4.4 mmol/L, Chloride 100 mmol/L, Bicarbonate (total CO2) 22 mmol/L, Anion gap 10 mmol/L, Urea nitrogen 16 mg/dL, Creatinine 1.35 mg/dL (H), eGFR (CKD-EPI 2021) 45 mL/min/1.73m2 (L), Glucose 162 mg/dL (H)"
   },
   {
    "id": "sc_glargine",
    "about": "inpatient order insulin glargine SubQ 14 units daily, started 11/3 07:00, still running (local times)"
   },
   {
    "id": "sc_lispro",
    "about": "inpatient order insulin lispro correction scale SubQ low-dose correction scale before meals, started 11/3 09:00, still running (local times)"
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held"
   },
   {
    "id": "med_chlorthalidone",
    "about": "home med chlorthalidone 25 mg tablet, 12.5 mg 1/2 tab PO daily: held"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 07:30: BP 126/74, HR 86, RR 16, T 98.3 F, SpO2 98%",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_metformin: home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held",
   "med_empa: home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held",
   "med_atorvastatin: home med atorvastatin 40 mg tablet, 40 mg 1 tab PO nightly: continue",
   "med_sertraline: home med sertraline 100 mg tablet, 100 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "finerenone: not started by 2024-11-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2024-11-04 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "A/e_rrh_2024/pn3",
  "kind": "Progress note",
  "when": "2024-11-05 07:30",
  "author": "Priya Raman, MD (Hospitalist)",
  "length": "150-250 words",
  "refs": [
   {
    "id": "dx_edka",
    "about": "diagnosis \"Euglycemic DKA, SGLT2 inhibitor-associated\", status resolved"
   },
   {
    "id": "bmp",
    "about": "Basic metabolic panel drawn 11/5 06:00 (local time): Sodium 133 mmol/L (L), Potassium 4.3 mmol/L, Chloride 101 mmol/L, Bicarbonate (total CO2) 23 mmol/L, Anion gap 9 mmol/L, Urea nitrogen 14 mg/dL, Creatinine 1.33 mg/dL (H), eGFR (CKD-EPI 2021) 46 mL/min/1.73m2 (L), Glucose 136 mg/dL (H)"
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held"
   },
   {
    "id": "med_empa",
    "about": "home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dx_na: diagnosis \"Hyponatremia\", status active",
   "sc_glargine: inpatient order insulin glargine SubQ 14 units daily, started 11/3 07:00, stopped 11/5 08:00 (local times)",
   "sc_lispro: inpatient order insulin lispro correction scale SubQ low-dose correction scale before meals, started 11/3 09:00, stopped 11/5 08:00 (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_losartan: home med losartan 50 mg tablet, 50 mg 1 tab PO daily: held",
   "med_chlorthalidone: home med chlorthalidone 25 mg tablet, 12.5 mg 1/2 tab PO daily: held",
   "med_atorvastatin: home med atorvastatin 40 mg tablet, 40 mg 1 tab PO nightly: continue",
   "med_sertraline: home med sertraline 100 mg tablet, 100 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "lisinopril: unknown to this source (pattern /\\b(lisinopril|Zestril)\\b/i)",
   "finerenone: not started by 2024-11-05 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2024-11-05 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
