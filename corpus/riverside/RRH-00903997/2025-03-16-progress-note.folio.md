---
folio: "0.1"
id: "01JPFMF1X06V6DDVVDEPTHM9R0"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00903997"
effective: "2025-03-16T12:45:00Z"
recorded: "2025-03-16T14:07:00Z"
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
- <ref id="bmp">Basic metabolic panel drawn 3/16 06:13 (local time): Sodium 133 mmol/L (L), Potassium 4.5 mmol/L, Chloride 104 mmol/L, Bicarbonate (total CO2) 25 mmol/L, Anion gap 4 mmol/L (L), Urea nitrogen 18 mg/dL, Creatinine 0.89 mg/dL, eGFR (CKD-EPI 2021) 74 mL/min/1.73m2, Glucose 100 mg/dL (H)</ref>

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6305729",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-03-15T03:12:00Z",
    "admitted": "2025-03-15T06:13:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-03-16T12:25:00Z",
    "bp": { "systolic_mmhg": 118, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 99,
    "resp_rate_per_min": 18,
    "temp_f": 99.2,
    "spo2_pct": 95,
    "weight_kg": 103.9
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
    "accession": "L25075-0631",
    "collected": "2025-03-16T11:13:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "133",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.5", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "4",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "18", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.89",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "74",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "100",
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
    "started": "2025-03-15T04:02:00Z",
    "stopped": "2025-03-16T06:13:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
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
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
