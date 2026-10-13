---
folio: "0.1"
id: "01JBZ2V178F5KZNWJ47TAN9ZT2"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00731846"
effective: "2024-11-02T06:30:00Z"
effective_end: "2024-11-05T17:30:00Z"
recorded: "2024-11-05T21:14:09Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "TODO"
---
## Discharge summary

**ED arrival** 11/01/2024 21:40. **Admitted** 11/02/2024 01:30. **Discharged** 11/05/2024 11:30, home.

**Principal diagnosis:** <ref id="dx_edka">euglycemic DKA, SGLT2 inhibitor-associated</ref>, resolved.

**Secondary diagnoses:** <ref id="dx_adverse">adverse effect of empagliflozin</ref>;
<ref id="dx_na">hyponatremia</ref>, improving. <ref id="dx_panc">Acute pancreatitis was considered and
ruled out</ref> (normal lipase).

**Hospital course.** Ms. Okafor presented with ketoacidosis and a glucose of only 182 after
<ref id="precipitant">three days of vomiting and diarrhea with very little to eat or drink</ref>, while
on empagliflozin. Initial pH 7.21, bicarbonate 11, anion gap 24, beta-hydroxybutyrate 6.2. She was
treated with an insulin infusion and dextrose-containing fluids; the gap closed early on 11/03 and the
infusion was stopped. <ref id="bhb_3">Beta-hydroxybutyrate was 0.3 on 11/03.</ref> Endocrinology saw
her and advised against restarting SGLT2 inhibitors. Diet advanced on 11/04 without trouble; glucose
130s–170s on correction insulin alone. <ref id="bmp_dc">Sodium 133 and creatinine 1.33 this
morning.</ref>

**Medications at discharge**

- <ref id="med_empa">**Empagliflozin: held.** Do not resume until reviewed by her PCP. I would not
  restart it.</ref>
- <ref id="med_metformin">Metformin: resume</ref> at the usual dose.
- <ref id="med_chlorthalidone">Chlorthalidone: resume</ref>; sodium has recovered to 133.
- All other home medications unchanged. No insulin at discharge.

**Follow-up:** <ref id="fu_pcp">primary care within 1 week</ref> to decide about empagliflozin and
recheck a basic metabolic panel.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6620417",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-02T02:40:00Z",
    "admitted": "2024-11-02T06:30:00Z",
    "discharged": "2024-11-05T17:30:00Z",
    "disposition": "home"
  },
  "dx_edka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "dx_adverse": {
    "type": "diagnosis",
    "label": "Adverse effect of empagliflozin",
    "icd10cm": "T38.3X5A",
    "status": "resolved",
    "rank": "secondary"
  },
  "dx_na": {
    "type": "diagnosis",
    "label": "Hyponatremia",
    "icd10cm": "E87.1",
    "status": "active",
    "rank": "secondary"
  },
  "dx_panc": {
    "type": "diagnosis",
    "label": "Acute pancreatitis",
    "icd10cm": "K85.90",
    "status": "ruled_out",
    "rank": "secondary"
  },
  "vs_dc": {
    "type": "vitals",
    "taken": "2024-11-05T14:10:00Z",
    "bp": { "systolic_mmhg": 128, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 84,
    "resp_rate_per_min": 16,
    "temp_f": 98.2,
    "spo2_pct": 98,
    "weight_kg": 85.2
  },
  "bhb_3": {
    "type": "result",
    "test": { "local_code": "BHB", "name": "Beta-hydroxybutyrate" },
    "accession": "L24308-0098",
    "collected": "2024-11-03T12:10:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "0.3",
    "unit": "mmol/L",
    "ref_range": "<0.4"
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24310-0051",
    "collected": "2024-11-05T12:00:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "133", "unit": "mmol/L", "ref_range": "136-145", "flag": "L" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      { "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" }, "value": "23", "unit": "mmol/L", "ref_range": "22-29" },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "14", "unit": "mg/dL", "ref_range": "8-23" },
      { "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" }, "value": "1.33", "unit": "mg/dL", "ref_range": "0.57-1.00", "flag": "H" },
      { "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" }, "value": "46", "unit": "mL/min/1.73m2", "ref_range": ">59", "flag": "L" },
      { "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" }, "value": "136", "unit": "mg/dL", "ref_range": "70-99", "flag": "H" }
    ]
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "cough",
    "severity": "mild"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_empa": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "instructions": "Do not resume until reviewed by PCP"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 100 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart empagliflozin; recheck basic metabolic panel"
  }
}
```
