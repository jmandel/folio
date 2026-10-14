---
folio: "0.1"
id: "01HAZJNZ30J5S7C09EEW9K43ET"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00560292"
effective: "2023-09-20T04:09:00Z"
effective_end: "2023-09-22T18:30:00Z"
recorded: "2023-09-22T23:13:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Hospital course.** The patient was admitted with pneumonia and abnormal kidney function. Creatinine was 2.48 on arrival and improved with intravenous saline and treatment of the infection. The pneumonia was treated with ceftriaxone and has improved, and <ref id="dx_pneumonia">the community-acquired pneumonia is resolved</ref>. Metformin and empagliflozin were held during the acute illness.

**Condition at discharge.** Vitals at 10:30: BP 129/77, HR 93, RR 18, T 98.1 F, SpO2 98%. The patient is breathing comfortably, eating and drinking, and feels much better.

**Discharge labs.** BMP drawn at 06:04 on 9/22: sodium 135 (L), potassium 3.9, chloride 105, bicarbonate 24, anion gap 6 (L), urea nitrogen 30 (H), creatinine 1.77 (H), eGFR 35 (L), glucose 103 (H). Creatinine has fallen from 2.48 on admission but remains above normal.

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_metformin">Metformin 500 mg tablet, 1 tablet by mouth twice daily with meals: continue</ref>
- Empagliflozin 10 mg tablet, 1 tablet by mouth daily: continue
- Insulin glargine 10 units subcutaneously nightly: continue
- Lisinopril 40 mg tablet, 1 tablet by mouth daily: continue
- Chlorthalidone 25 mg tablet, one-half tablet (12.5 mg) by mouth daily: continue
- Amlodipine 5 mg tablet, 1 tablet by mouth daily: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. The patient was told to return for worsening cough, fever or shortness of breath.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6289463",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-09-19T22:34:00Z",
    "admitted": "2023-09-20T04:09:00Z",
    "discharged": "2023-09-22T18:30:00Z",
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
    "taken": "2023-09-22T15:30:00Z",
    "bp": { "systolic_mmhg": 129, "diastolic_mmhg": 77 },
    "heart_rate_bpm": 93,
    "resp_rate_per_min": 18,
    "temp_f": 98.1,
    "spo2_pct": 98,
    "weight_kg": 71.7
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23265-8845",
    "collected": "2023-09-22T11:04:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "135",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "6",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.77",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "35",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "103",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 500 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "500 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
    "status": "continue"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
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
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
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
    "purpose": "Recheck symptoms and chest exam"
  }
}
```
