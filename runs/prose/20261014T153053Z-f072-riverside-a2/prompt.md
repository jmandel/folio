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
  "key": "A/e_114/hp",
  "kind": "Admission history and physical",
  "when": "2023-08-15 22:01",
  "author": "Grace Whitaker, MD (Hospitalist)",
  "length": "200-350 words",
  "refs": [
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
    "about": "home med metformin 500 mg tablet, 500 mg 1 tab PO BID with meals: held (resume_when_able) \"Hold while acidotic and NPO\""
   },
   {
    "id": "med_losartan",
    "about": "home med losartan 100 mg tablet, 100 mg 1 tab PO daily: held (resume_when_able) \"Hold for volume depletion and potassium; resume when eating\""
   }
  ],
  "spans": [],
  "mustInclude": [
   "No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery."
  ],
  "context": [
   "vs_1: vitals at 21:51: BP 107/64, HR 94, RR 16, T 98.9 F, SpO2 99%",
   "bmp: Basic metabolic panel drawn 8/15 15:00 (local time): Sodium 130 mmol/L (L), Potassium 5.6 mmol/L (H), Chloride 97 mmol/L (L), Bicarbonate (total CO2) 9 mmol/L (LL), Anion gap 24 mmol/L (H), Urea nitrogen 31 mg/dL (H), Creatinine 1.93 mg/dL (H), eGFR (CKD-EPI 2021) 29 mL/min/1.73m2 (L), Glucose 184 mg/dL (H)",
   "iv_insulin: inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 8/15 15:51, still running (local times)",
   "iv_d5lr: inpatient order dextrose 5% in lactated Ringer's IV 150 mL/h, started 8/15 15:51, still running (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_escitalopram: home med escitalopram 10 mg tablet, 10 mg 1 tab PO daily: continue"
  ],
  "forbidden": [
   "c_4 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_7 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)"
  ],
  "sensitive": []
 }
]
```

## Your previous attempt failed these checks; rewrite these notes

### A/e_114/hp

Problems:
- ref id "med_empagliflozin" must appear exactly once as a span (found 2)

Previous text:
```markdown
## Admission history and physical

**Reason for admission:** <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>.

**History of present illness.** The patient presented to the ED this afternoon feeling unwell, with nausea, malaise and fatigue, and was found to be markedly acidotic with a near-normal glucose. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. They take <ref id="med_empagliflozin">empagliflozin 10 mg daily</ref> at home.

**Allergies:** no known drug allergies.

**Exam.** At 21:51: BP 107/64, HR 94, RR 16, T 98.9 F, SpO2 99%. Comfortable at rest on the insulin infusion, with no distress. Abdomen soft and nontender.

**Results.** The 15:00 basic metabolic panel showed sodium 130, potassium 5.6, chloride 97, bicarbonate 9, anion gap 24, urea nitrogen 31, creatinine 1.93 (eGFR 29) and glucose 184.

**Assessment and plan**

1. Euglycemic DKA with a wide anion gap acidosis. The insulin infusion per DKA protocol at 0.1 units/kg/h was started 15:51 and continues, together with D5 lactated Ringer's at 150 mL/h, since glucose is near normal. Recheck the metabolic panel serially until the gap closes. <ref id="med_empagliflozin">Hold empagliflozin.</ref>
2. Diabetes: <ref id="med_metformin">hold metformin</ref> while acidotic and NPO.
3. Hypertension and kidney function: creatinine 1.93 with potassium 5.6. <ref id="med_losartan">Hold losartan</ref> for volume depletion and potassium; resume when eating. Avoid nephrotoxins.
4. Hyponatremia, sodium 130, likely from volume depletion; expect improvement with fluids.
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
