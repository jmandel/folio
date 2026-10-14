---
folio: "0.1"
id: "01HMRSK040BG3X5YYG2PME1JY8"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00386801"
effective: "2024-01-22T13:38:00Z"
recorded: "2024-01-22T14:36:00Z"
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

**Interval.** Hospital day 3. The patient feels well and is eating and drinking. The normal saline infusion was stopped last night at 23:44.

**Exam.** Vitals at 07:18: BP 134/80, HR 107, RR 24, temperature 98.3 F, SpO2 97%. Comfortable, lungs clear.

**Results.** <ref id="bmp">Basic metabolic panel on the 06:26 draw: sodium 136, potassium 5.6 (H), chloride 104, bicarbonate 22, anion gap 10, urea nitrogen 18, creatinine 1.17 (H), eGFR 52 (L), glucose 104 (H).</ref> Creatinine continues to fall, from 1.53 yesterday. Potassium is slightly high still.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, improving off IV fluids. Repeat chemistry tomorrow morning.
2. Metformin remains held. Atorvastatin continues.
3. Allergy list: empagliflozin (diabetic ketoacidosis).

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6786538",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-01-21T01:20:00Z",
    "admitted": "2024-01-21T05:44:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-01-22T13:18:00Z",
    "bp": { "systolic_mmhg": 134, "diastolic_mmhg": 80 },
    "heart_rate_bpm": 107,
    "resp_rate_per_min": 24,
    "temp_f": 98.3,
    "spo2_pct": 97,
    "weight_kg": 78.5
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
    "accession": "L24022-8113",
    "collected": "2024-01-22T12:26:00Z",
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
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "18", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.17",
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
        "value": "104",
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
    "started": "2024-01-21T02:10:00Z",
    "stopped": "2024-01-22T05:44:00Z"
  },
  "alg_empagliflozin": {
    "type": "allergy",
    "substance": "empagliflozin",
    "rxnorm_ingredient": "1545653",
    "reaction": "diabetic ketoacidosis",
    "severity": "severe"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 500 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "500 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held"
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
