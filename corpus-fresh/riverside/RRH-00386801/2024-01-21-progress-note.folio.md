---
folio: "0.1"
id: "01HMP877T0XX5QPK4JMWZKP2RS"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00386801"
effective: "2024-01-21T13:56:00Z"
recorded: "2024-01-21T14:54:00Z"
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

**Interval.** Hospital day 2. The patient feels better and is drinking more. No chest symptoms or palpitations.

**Exam.** Vitals at 07:36: BP 138/83, HR 95, RR 24, temperature 98.5 F, SpO2 98%. Mucous membranes are moister than on admission.

**Results.** <ref id="bmp">Basic metabolic panel on the 06:05 draw: sodium 133 (L), potassium 5.8 (H), chloride 104, bicarbonate 24, anion gap 5 (L), urea nitrogen 22, creatinine 1.53 (H), eGFR 38 (L), glucose 166 (H).</ref> Creatinine has improved from 1.89 and potassium from 6.5, though potassium is still high.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, improving with fluids. Normal saline at 125 mL/h continues. Repeat chemistry tomorrow morning.
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
    "taken": "2024-01-21T13:36:00Z",
    "bp": { "systolic_mmhg": 138, "diastolic_mmhg": 83 },
    "heart_rate_bpm": 95,
    "resp_rate_per_min": 24,
    "temp_f": 98.5,
    "spo2_pct": 98,
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
    "accession": "L24021-5465",
    "collected": "2024-01-21T12:05:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.8",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "5",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "22", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.53",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
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
        "value": "166",
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
    "started": "2024-01-21T02:10:00Z"
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
