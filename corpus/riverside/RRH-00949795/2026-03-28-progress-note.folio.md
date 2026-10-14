---
folio: "0.1"
id: "01KMTA0S500WBNXR0ZYV1WPYSK"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00949795"
effective: "2026-03-28T12:32:00Z"
recorded: "2026-03-28T13:27:00Z"
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
- <ref id="bmp">Basic metabolic panel drawn 3/28 06:00 (local time): Sodium 134 mmol/L (L), Potassium 3.9 mmol/L, Chloride 105 mmol/L, Bicarbonate (total CO2) 25 mmol/L, Anion gap 4 mmol/L (L), Urea nitrogen 23 mg/dL, Creatinine 1.53 mg/dL (H), eGFR (CKD-EPI 2021) 37 mL/min/1.73m2 (L), Glucose 162 mg/dL (H)</ref>

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6532872",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-03-26T22:55:00Z",
    "admitted": "2026-03-27T04:36:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-03-28T12:12:00Z",
    "bp": { "systolic_mmhg": 140, "diastolic_mmhg": 84 },
    "heart_rate_bpm": 92,
    "resp_rate_per_min": 18,
    "temp_f": 98.3,
    "spo2_pct": 95,
    "weight_kg": 70.5
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
    "accession": "L26087-4969",
    "collected": "2026-03-28T11:00:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "134",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
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
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "23", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.53",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "37",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "162",
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
    "started": "2026-03-26T23:45:00Z",
    "stopped": "2026-03-28T04:36:00Z"
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
    "status": "held"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  }
}
```
