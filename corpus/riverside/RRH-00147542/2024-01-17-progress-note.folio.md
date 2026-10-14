---
folio: "0.1"
id: "01HMC0B9M03XZ58K2BG5YZAY1H"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00147542"
effective: "2024-01-17T13:56:00Z"
recorded: "2024-01-17T15:24:00Z"
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
- <ref id="bmp">Basic metabolic panel drawn 1/17 06:26 (local time): Sodium 136 mmol/L, Potassium 3.9 mmol/L, Chloride 103 mmol/L, Bicarbonate (total CO2) 24 mmol/L, Anion gap 9 mmol/L, Urea nitrogen 25 mg/dL (H), Creatinine 1.48 mg/dL (H), eGFR (CKD-EPI 2021) 52 mL/min/1.73m2 (L), Glucose 168 mg/dL (H)</ref>

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6091462",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-01-15T04:41:00Z",
    "admitted": "2024-01-15T09:58:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-01-17T13:36:00Z",
    "bp": { "systolic_mmhg": 114, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 106,
    "resp_rate_per_min": 20,
    "temp_f": 98.9,
    "spo2_pct": 96,
    "weight_kg": 93.2
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
    "accession": "L24017-0019",
    "collected": "2024-01-17T12:26:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "25",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.48",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "52",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "168",
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
    "started": "2024-01-15T05:31:00Z",
    "stopped": "2024-01-16T09:58:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_carvedilol": {
    "type": "home_med",
    "drug_name": "carvedilol 12.5 mg tablet",
    "rxnorm_ingredient": "20352",
    "dose_text": "12.5 mg",
    "sig": "1 tab PO BID",
    "status": "continue"
  },
  "med_spironolactone": {
    "type": "home_med",
    "drug_name": "spironolactone 25 mg tablet",
    "rxnorm_ingredient": "9997",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_furosemide": {
    "type": "home_med",
    "drug_name": "furosemide 40 mg tablet",
    "rxnorm_ingredient": "4603",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
