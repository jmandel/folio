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
  "key": "A/e_28/ed",
  "kind": "ED provider note",
  "when": "2023-06-04 14:34",
  "author": "Marcus Hale, MD (Emergency physician)",
  "length": "200-350 words",
  "refs": [
   {
    "id": "dx_angioedema",
    "about": "diagnosis \"Angioedema, ACE inhibitor-associated\", status active"
   },
   {
    "id": "med_lisinopril",
    "about": "home med lisinopril 10 mg tablet, 10 mg 1 tab PO daily: stopped \"Do not take lisinopril or any ACE inhibitor again\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "vs_1: vitals at 14:40: BP 129/77, HR 87, RR 19, T 98.3 F, SpO2 98%",
   "iv_methylpred: inpatient order methylprednisolone IV IV 125 mg once, started 6/4 14:59, stopped 6/4 15:00 (local times)",
   "alg_nkda: allergy list: NKDA",
   "med_amlodipine: home med amlodipine 5 mg tablet, 5 mg 1 tab PO daily: not_reconciled",
   "med_atorvastatin: home med atorvastatin 40 mg tablet, 40 mg 1 tab PO nightly: not_reconciled",
   "med_escitalopram: home med escitalopram 10 mg tablet, 10 mg 1 tab PO daily: not_reconciled"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(escitalopram|Lexapro)\\b/i)",
   "ibuprofen: not started by 2023-06-04 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

## Your previous attempt failed these checks; rewrite these notes

### A/e_28/ed

Problems:
- ref id "med_lisinopril" must appear exactly once as a span (found 2)

Previous text:
```markdown
## Emergency department provider note

**Reason for visit:** facial and lip swelling.

**History.** The patient is an adult who came to the ED today, June 4, with swelling of the lips and lower face that has come on over the past several hours. There was no rash and no itching, and no new foods, insect stings or other new exposures that they could identify. They describe a thick, full feeling in the mouth but have been able to swallow their saliva and speak in full sentences. They have taken <ref id="med_lisinopril">lisinopril 10 mg by mouth daily</ref> at home for blood pressure. Allergy list: NKDA.

**Exam.** Seen and examined at 14:34. Vitals at 14:40: BP 129/77, HR 87, RR 19, T 98.3 F, SpO2 98%. Comfortable, speaking clearly, with no stridor and no drooling. The lips and lower face are visibly swollen without hives. Lungs are clear with unlabored breathing. The airway was watched closely throughout the visit.

**Assessment and plan**

1. <ref id="dx_angioedema">Angioedema, ACE inhibitor-associated</ref>. The swelling is asymmetric to the lips and face, without hives or itching, in a patient on an ACE inhibitor, which fits a bradykinin-mediated process rather than an allergic reaction. Methylprednisolone 125 mg IV was given once at 14:59. Vital signs and oxygen saturation are stable, and the airway is currently protected. Plan to keep the patient under observation with repeated airway checks and to reassess the extent of swelling over the coming hours.
2. <ref id="med_lisinopril">Lisinopril is stopped. The patient is instructed: do not take lisinopril or any ACE inhibitor again.</ref> I explained that this reaction can recur with any drug in this class, even after years of uneventful use, and that it should be recorded as a drug reaction in their chart. They understood and agreed.

The patient was told to alert staff right away if swelling spreads to the tongue or throat, or if breathing or swallowing becomes difficult.
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
