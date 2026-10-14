---
folio: "0.1"
id: "01GV0TST90VFJWW4PC7CJFX2R2"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00209756"
effective: "2023-03-08T13:48:00Z"
recorded: "2023-03-08T14:43:00Z"
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

**Interval.** Feels better and is eating. The saline was stopped last evening at 20:01. Vitals at 07:28: BP 120/72, HR 86, RR 16, T 98.4 F, SpO2 96%. No known drug allergies.

**Exam.** Comfortable, lungs clear, no edema, abdomen soft.

**Results.** <ref id="bmp">BMP at 06:01: sodium 133, potassium 5.6, chloride 102, bicarbonate 25, anion gap 6, urea nitrogen 35, creatinine 1.88, eGFR 32, glucose 108</ref>.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref> continues to improve off IV fluids: creatinine 1.88, down from 2.22 yesterday. Encourage oral fluids and recheck tomorrow morning.
2. Potassium is 5.6, lower than yesterday's 6.1 but still above normal. Repeat with the morning draw.
3. Sodium is 133, a little lower than yesterday's 136, now that the saline is off; we will follow it.
4. Metformin and losartan stay held. Continue glipizide and atorvastatin.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6739258",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-03-06T22:34:00Z",
    "admitted": "2023-03-07T02:01:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-03-08T13:28:00Z",
    "bp": { "systolic_mmhg": 120, "diastolic_mmhg": 72 },
    "heart_rate_bpm": 86,
    "resp_rate_per_min": 16,
    "temp_f": 98.4,
    "spo2_pct": 96,
    "weight_kg": 81.7
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
    "accession": "L23067-2099",
    "collected": "2023-03-08T12:01:00Z",
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
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "6",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "35",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.88",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "32",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "108",
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
    "started": "2023-03-06T23:24:00Z",
    "stopped": "2023-03-08T02:01:00Z"
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
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held"
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
