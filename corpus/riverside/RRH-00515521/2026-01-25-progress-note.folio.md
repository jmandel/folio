---
folio: "0.1"
id: "01KFTTDBD03FH9ATC05CGMQ3VY"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00515521"
effective: "2026-01-25T13:58:00Z"
recorded: "2026-01-25T14:55:00Z"
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
- <ref id="bmp">Basic metabolic panel drawn 1/25 06:04 (local time): Sodium 134 mmol/L (L), Potassium 3.9 mmol/L, Chloride 101 mmol/L, Bicarbonate (total CO2) 24 mmol/L, Anion gap 9 mmol/L, Urea nitrogen 29 mg/dL (H), Creatinine 1.36 mg/dL (H), eGFR (CKD-EPI 2021) 54 mL/min/1.73m2 (L), Glucose 164 mg/dL (H)</ref>

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6515484",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-01-22T20:34:00Z",
    "admitted": "2026-01-23T00:42:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-01-25T13:38:00Z",
    "bp": { "systolic_mmhg": 113, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 84,
    "resp_rate_per_min": 17,
    "temp_f": 98.9,
    "spo2_pct": 95,
    "weight_kg": 76
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
    "accession": "L26025-6257",
    "collected": "2026-01-25T12:04:00Z",
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
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "29",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.36",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "54",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "164",
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
    "started": "2026-01-22T21:24:00Z",
    "stopped": "2026-01-24T00:42:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
