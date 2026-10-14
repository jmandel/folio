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

## Requests (1)

```json
[
 {
  "key": "A/e_155/hp",
  "kind": "Admission history and physical",
  "when": "2023-05-17 18:11",
  "author": "Priya Raman, MD (Hospitalist)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_pneumonia",
    "about": "diagnosis \"Community-acquired pneumonia\", status active"
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held (resume_when_able) \"Hold until creatinine back to baseline\""
   },
   {
    "id": "med_metformin",
    "about": "home med metformin 1000 mg tablet, 1000 mg 1 tab PO BID with meals: held (resume_when_able) \"Hold during acute illness\""
   },
   {
    "id": "med_dapagliflozin",
    "about": "home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held (resume_when_able) \"Hold while not eating\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 18:01: BP 113/68, HR 95, RR 21, T 98.4 F, SpO2 97%",
   "bmp: Basic metabolic panel drawn 5/17 14:30 (local time): Sodium 132 mmol/L (L), Potassium 4.2 mmol/L, Chloride 101 mmol/L, Bicarbonate (total CO2) 19 mmol/L (L), Anion gap 12 mmol/L, Urea nitrogen 56 mg/dL (H), Creatinine 1.48 mg/dL (H), eGFR (CKD-EPI 2021) 45 mL/min/1.73m2 (L), Glucose 127 mg/dL (H)",
   "iv_ns: inpatient order sodium chloride 0.9% IV 75 mL/h, started 5/17 15:02, still running (local times)",
   "alg_lisinopril: allergy list: lisinopril (cough)",
   "med_hydrochlorothiazide: home med hydrochlorothiazide 25 mg tablet, 25 mg 1 tab PO daily: continue",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "dulaglutide: not started by 2023-05-17 (pattern /\\b(dulaglutide|Trulicity)\\b/i)",
   "finerenone: not started by 2023-05-17 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": []
 }
]
```

## Your previous attempt failed these checks; rewrite these notes

### A/e_155/hp

Problems:
- ref id "dx_pneumonia" must appear exactly once as a span (found 2)

Previous text:
```markdown
## Admission history and physical

**Reason for admission:** <ref id="dx_pneumonia">Community-acquired pneumonia</ref>.

**History of present illness.** The patient was seen in the ED this afternoon with several days of cough, tiredness and poor appetite, and is admitted for treatment and monitoring. Intake has been low, and the kidney function on arrival was worse than expected. The ED course is summarized in the ED provider note.

**Home medications.** Losartan 100 mg daily, metformin 1000 mg twice daily with meals, dapagliflozin 10 mg daily, hydrochlorothiazide 25 mg daily and amlodipine 5 mg daily.

**Allergies:** lisinopril (cough).

**Exam.** Vitals at 18:01: BP 113/68, HR 95, RR 21, temperature 98.4 F, SpO2 97%. Appears tired but comfortable at rest. Mucous membranes slightly dry. Breathing is mildly quickened, with crackles at the right base. Abdomen soft and nontender.

**Results.** The basic metabolic panel drawn at 14:30 showed sodium 132, potassium 4.2, chloride 101, bicarbonate 19, anion gap 12, urea nitrogen 56, creatinine 1.48, eGFR 45 and glucose 127. Normal saline at 75 mL/h has been running since 15:02.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>. Oxygen saturation is adequate on room air. Continue the current antibiotic and IV fluids, and reassess in the morning with a repeat metabolic panel.
2. Kidney function is below what we would like, with creatinine 1.48. <ref id="med_losartan">Hold losartan until creatinine is back to baseline.</ref>
3. <ref id="med_metformin">Hold metformin during the acute illness.</ref> <ref id="med_dapagliflozin">Hold dapagliflozin while she is not eating.</ref> Both can be resumed when she is able.
4. Blood pressure is acceptable. Continue hydrochlorothiazide and amlodipine.
5. Lisinopril intolerance (cough) is noted; no ACE inhibitor will be used.
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
