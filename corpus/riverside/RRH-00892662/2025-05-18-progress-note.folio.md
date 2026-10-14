---
folio: "0.1"
id: "01JVHWFF00CZF0HW6Z5HWBDGDR"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00892662"
effective: "2025-05-18T12:55:00Z"
recorded: "2025-05-18T14:24:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

- <ref id="dx_aki">diagnosis "Acute kidney injury", status active</ref>
- <ref id="bmp">Basic metabolic panel drawn 5/18 06:05 (local time): Sodium 139 mmol/L, Potassium 5.0 mmol/L, Chloride 102 mmol/L, Bicarbonate (total CO2) 24 mmol/L, Anion gap 13 mmol/L, Urea nitrogen 17 mg/dL, Creatinine 1.23 mg/dL (H), eGFR (CKD-EPI 2021) 50 mL/min/1.73m2 (L), Glucose 140 mg/dL (H)</ref>

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6332648",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-05-16T20:05:00Z",
    "admitted": "2025-05-16T23:10:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-05-18T12:35:00Z",
    "bp": { "systolic_mmhg": 119, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 82,
    "resp_rate_per_min": 23,
    "temp_f": 98.9,
    "spo2_pct": 95,
    "weight_kg": 69.2
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25138-0857",
    "collected": "2025-05-18T11:05:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "139", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "5.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "13", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "17", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.23",
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
        "value": "140",
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
    "dose_text": "1000 mL bolus, then 125 mL/h",
    "started": "2025-05-16T20:55:00Z",
    "stopped": "2025-05-17T23:10:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
