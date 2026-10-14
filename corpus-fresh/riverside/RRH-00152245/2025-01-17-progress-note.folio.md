---
folio: "0.1"
id: "01JHTAEAK0NZY1SY6ZD3KGP478"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00152245"
effective: "2025-01-17T13:39:00Z"
recorded: "2025-01-17T14:25:00Z"
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

**Interval.** She feels well and is eating. Diarrhea has stopped. Saline was stopped last evening at 19:55. Allergy list: lisinopril (cough); dapagliflozin (diabetic ketoacidosis).

**Exam.** BP 140/84, HR 111, RR 16, T 98.8 F, SpO2 94% at 07:19. She is comfortable and breathing easily. Abdomen is soft.

**Results.** The <ref id="bmp">06:24 panel shows sodium 134, potassium 5.3, chloride 105, bicarbonate 22, anion gap 7, urea nitrogen 31, creatinine 1.55, eGFR 33 and glucose 138</ref>.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, continuing to improve: creatinine 1.55, down from 2.01. Potassium 5.3 is still slightly high and is trending down. Recheck tomorrow morning.
2. Heart rate of 111 will be rechecked; she is taking fluids by mouth.
3. Metformin and losartan remain held.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6565340",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-01-15T21:34:00Z",
    "admitted": "2025-01-16T01:55:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-01-17T13:19:00Z",
    "bp": { "systolic_mmhg": 140, "diastolic_mmhg": 84 },
    "heart_rate_bpm": 111,
    "resp_rate_per_min": 16,
    "temp_f": 98.8,
    "spo2_pct": 94,
    "weight_kg": 98.4
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
    "accession": "L25017-6404",
    "collected": "2025-01-17T12:24:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.3",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "7", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "31",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.55",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "33",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "138",
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
    "started": "2025-01-15T22:24:00Z",
    "stopped": "2025-01-17T01:55:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "cough",
    "severity": "mild"
  },
  "alg_dapagliflozin": {
    "type": "allergy",
    "substance": "dapagliflozin",
    "rxnorm_ingredient": "1488564",
    "reaction": "diabetic ketoacidosis",
    "severity": "severe"
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
    "status": "held"
  }
}
```
