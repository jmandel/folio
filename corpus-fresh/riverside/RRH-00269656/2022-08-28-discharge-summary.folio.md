---
folio: "0.1"
id: "01GBJZ0ZW08T5WBEHTQ01171M5"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00269656"
effective: "2022-08-25T02:45:00Z"
effective_end: "2022-08-28T15:30:00Z"
recorded: "2022-08-28T19:32:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnosis:** <ref id="dx_pneumonia">community-acquired pneumonia, resolved</ref>.

**Hospital course.** The patient was admitted with several days of cough, fever and shortness of breath. She had a white count of 17.0 and a creatinine of 1.70 on arrival, with volume depletion from poor intake. She was treated with ceftriaxone 1 g IV every 24 hours and normal saline, which was stopped on 8/25 at 21:45. Her cough and breathing improved steadily and she remained afebrile. Kidney function recovered along with her hydration.

**Condition at discharge.** Vitals on the morning of discharge at 07:30: BP 135/81, HR 102, RR 16, T 98.2 F, SpO2 97%. She is walking independently, eating well and breathing comfortably. Lungs show only minimal residual crackles at the right base.

**Discharge labs.** The panel drawn 8/28 at 06:29 showed sodium 136, potassium 3.9, chloride 104, bicarbonate 24, anion gap 8, urea nitrogen 19, creatinine 1.32, eGFR 59 and glucose 125. Creatinine is back near her usual value.

**Allergies:** lisinopril (angioedema).

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg by mouth twice daily with meals: continue</ref>
- Glipizide 5 mg by mouth daily: continue
- Amlodipine 10 mg by mouth daily: continue
- Atorvastatin 20 mg by mouth nightly: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. She was told to return sooner for fever, worsening cough, shortness of breath or chest pain.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6036136",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-08-24T23:05:00Z",
    "admitted": "2022-08-25T02:45:00Z",
    "discharged": "2022-08-28T15:30:00Z",
    "disposition": "home"
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-08-28T12:30:00Z",
    "bp": { "systolic_mmhg": 135, "diastolic_mmhg": 81 },
    "heart_rate_bpm": 102,
    "resp_rate_per_min": 16,
    "temp_f": 98.2,
    "spo2_pct": 97,
    "weight_kg": 101
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L22240-5325",
    "collected": "2022-08-28T11:29:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "19", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.32",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "59",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "125",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "angioedema",
    "severity": "severe"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 10 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Recheck symptoms and chest exam"
  }
}
```
