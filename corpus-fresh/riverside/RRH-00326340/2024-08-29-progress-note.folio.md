---
folio: "0.1"
id: "01J6F7HGP0B1HN7Y9TTPDKSXXH"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00326340"
effective: "2024-08-29T12:50:00Z"
recorded: "2024-08-29T14:10:00Z"
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

**Interval.** The patient feels about the same as yesterday, with a persistent but loosening cough and good appetite. Vitals at 07:30: BP 136/82, HR 110, RR 17, T 98.1 F, SpO2 97%. No known drug allergies. IV saline has been off since 02:31 on 8/28.

**Exam.** Alert and comfortable. Scattered crackles remain at the base. Heart rate is fast but regular. Abdomen soft.

**Results.** The <ref id="bmp">basic metabolic panel at 06:21 showed sodium 134 (L), potassium 3.9, chloride 101, bicarbonate 25, anion gap 8, urea nitrogen 24 (H), creatinine 1.28 (H), eGFR 44 (L) and glucose 117 (H)</ref>. Sodium is a little lower than yesterday's 138 and creatinine continues to improve.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, slowly improving. The heart rate this morning is higher than on previous days, so we will recheck it and keep watching the vital signs.
2. Mild low sodium again off fluids. Repeat the panel tomorrow.
3. Metformin remains held. Losartan, hydrochlorothiazide and atorvastatin continue.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6796761",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-08-27T01:41:00Z",
    "admitted": "2024-08-27T07:31:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-08-29T12:30:00Z",
    "bp": { "systolic_mmhg": 136, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 110,
    "resp_rate_per_min": 17,
    "temp_f": 98.1,
    "spo2_pct": 97,
    "weight_kg": 96.7
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
    "accession": "L24242-1664",
    "collected": "2024-08-29T11:21:00Z",
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
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "24",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.28",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "44",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "117",
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
    "started": "2024-08-27T02:31:00Z",
    "stopped": "2024-08-28T07:31:00Z"
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
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
