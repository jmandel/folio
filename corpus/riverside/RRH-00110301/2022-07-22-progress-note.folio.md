---
folio: "0.1"
id: "01G8K1YHG06A6PY4E6CD5RC6A2"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00110301"
effective: "2022-07-22T12:34:00Z"
recorded: "2022-07-22T13:36:00Z"
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

**Interval.** The patient feels better today, with less cough and more energy. The saline was stopped yesterday at 17:32, and they are drinking well.

**Exam.** Vitals at 07:14: BP 123/74, HR 86, RR 22, temperature 98.7 F, SpO2 97%. The patient is sitting up, comfortable and talking easily. Crackles at the base are less prominent than before. The heart rate has settled.

**Results.** <ref id="bmp">Basic metabolic panel at 06:20: sodium 136, potassium 3.9, chloride 105, bicarbonate 26, anion gap 5 (low), urea nitrogen 34 (high), creatinine 1.13 (high), eGFR 58 (low), glucose 168 (high)</ref>. Creatinine has continued to improve off IV fluids. Urea nitrogen is up a little from yesterday's 23.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>: clinically improving, with a lower heart rate and good saturation. Continue treatment, keep the patient walking in the halls, and plan for discharge soon if they continue to improve.
2. Kidney function: creatinine is trending toward normal. Encourage oral fluids and recheck the panel tomorrow morning.
3. Allergies: no known drug allergies. Home medication reconciliation will be completed before discharge.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6941198",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-07-20T19:05:00Z",
    "admitted": "2022-07-20T22:32:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-07-22T12:14:00Z",
    "bp": { "systolic_mmhg": 123, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 86,
    "resp_rate_per_min": 22,
    "temp_f": 98.7,
    "spo2_pct": 97,
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
    "accession": "L22203-0637",
    "collected": "2022-07-22T11:20:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
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
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "34",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.13",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "58",
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
    "started": "2022-07-20T19:55:00Z",
    "stopped": "2022-07-21T22:32:00Z"
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
