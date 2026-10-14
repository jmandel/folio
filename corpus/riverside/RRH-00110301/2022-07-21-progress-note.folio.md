---
folio: "0.1"
id: "01G8GGXRR05Y1NG5C8G81GWTWK"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00110301"
effective: "2022-07-21T12:55:00Z"
recorded: "2022-07-21T14:00:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

- <ref id="dx_pneumonia">diagnosis "Community-acquired pneumonia", status active</ref>
- <ref id="bmp">Basic metabolic panel drawn 7/21 06:08 (local time): Sodium 137 mmol/L, Potassium 4.3 mmol/L, Chloride 102 mmol/L, Bicarbonate (total CO2) 23 mmol/L, Anion gap 12 mmol/L, Urea nitrogen 23 mg/dL, Creatinine 1.28 mg/dL (H), eGFR (CKD-EPI 2021) 50 mL/min/1.73m2 (L), Glucose 115 mg/dL (H)</ref>

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6467890",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-07-20T19:05:00Z",
    "admitted": "2022-07-20T22:32:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-07-21T12:35:00Z",
    "bp": { "systolic_mmhg": 112, "diastolic_mmhg": 67 },
    "heart_rate_bpm": 112,
    "resp_rate_per_min": 22,
    "temp_f": 98.3,
    "spo2_pct": 98,
    "weight_kg": 88
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
    "accession": "L22202-4680",
    "collected": "2022-07-21T11:08:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "23", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.28",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "50",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "115",
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
    "started": "2022-07-20T19:55:00Z"
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
    "status": "not_reconciled"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "not_reconciled"
  }
}
```
