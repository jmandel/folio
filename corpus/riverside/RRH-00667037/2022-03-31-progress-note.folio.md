---
folio: "0.1"
id: "01FZG3KME001B68XJBJ6WTN6CD"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00667037"
effective: "2022-03-31T12:54:00Z"
recorded: "2022-03-31T13:46:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

- <ref id="dx_pneumonia">diagnosis "Community-acquired pneumonia", status active</ref>
- <ref id="bmp">Basic metabolic panel drawn 3/31 06:01 (local time): Sodium 136 mmol/L, Potassium 3.9 mmol/L, Chloride 99 mmol/L, Bicarbonate (total CO2) 25 mmol/L, Anion gap 12 mmol/L, Urea nitrogen 27 mg/dL (H), Creatinine 1.92 mg/dL (H), eGFR (CKD-EPI 2021) 38 mL/min/1.73m2 (L), Glucose 107 mg/dL (H)</ref>

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6361832",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-03-30T19:05:00Z",
    "admitted": "2022-03-30T22:57:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-03-31T12:34:00Z",
    "bp": { "systolic_mmhg": 140, "diastolic_mmhg": 84 },
    "heart_rate_bpm": 105,
    "resp_rate_per_min": 24,
    "temp_f": 98.2,
    "spo2_pct": 95,
    "weight_kg": 102
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L22090-1508",
    "collected": "2022-03-31T11:01:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "27",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.92",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "38",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "107",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_ns": {
    "type": "inpatient_med",
    "drug_name": "sodium chloride 0.9%",
    "route": "IV",
    "dose_text": "75 mL/h",
    "started": "2022-03-30T19:55:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
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
  }
}
```
