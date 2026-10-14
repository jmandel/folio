---
folio: "0.1"
id: "01H1S2DDW0C6XN2MT2Z8KVP14M"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00313418"
effective: "2023-05-31T12:52:00Z"
recorded: "2023-05-31T14:12:00Z"
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

- <ref id="dx_aki">diagnosis "Acute kidney injury", status active</ref>
- <ref id="bmp">Basic metabolic panel drawn 5/31 06:23 (local time): Sodium 136 mmol/L, Potassium 5.6 mmol/L (H), Chloride 102 mmol/L, Bicarbonate (total CO2) 25 mmol/L, Anion gap 9 mmol/L, Urea nitrogen 26 mg/dL (H), Creatinine 1.11 mg/dL (H), eGFR (CKD-EPI 2021) 52 mL/min/1.73m2 (L), Glucose 134 mg/dL (H)</ref>

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6222416",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-05-28T03:41:00Z",
    "admitted": "2023-05-28T09:47:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-05-31T12:32:00Z",
    "bp": { "systolic_mmhg": 127, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 82,
    "resp_rate_per_min": 24,
    "temp_f": 98.7,
    "spo2_pct": 98,
    "weight_kg": 95.7
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
    "accession": "L23151-2254",
    "collected": "2023-05-31T11:23:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.6",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "26",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.11",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
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
        "value": "134",
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
    "started": "2023-05-28T04:31:00Z",
    "stopped": "2023-05-29T09:47:00Z"
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
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "held"
  }
}
```
